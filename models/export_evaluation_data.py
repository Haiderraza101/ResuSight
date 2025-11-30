import pickle
import json
import numpy as np
import os
import pandas as pd
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix, top_k_accuracy_score
from sklearn.model_selection import train_test_split, learning_curve
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
import re

# ========================= MODEL DEFINITIONS =========================
# (Copying model definitions to ensure we can load the state dicts)

class Attention(nn.Module):
    def __init__(self, hidden_dim, attn_dropout=0.3):
        super(Attention, self).__init__()
        self.attn = nn.Linear(hidden_dim * 2, 1)
        self.dropout = nn.Dropout(attn_dropout)

    def forward(self, lstm_out):
        attn_scores = self.attn(lstm_out).squeeze(-1)
        attn_weights = torch.softmax(attn_scores, dim=1)
        attn_weights = self.dropout(attn_weights)
        context = torch.bmm(attn_weights.unsqueeze(1), lstm_out).squeeze(1)
        return context, attn_weights

class BiLSTMClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes, padding_idx=0,
                 lstm_layers=2, embed_dropout=0.2, fc_dropout1=0.5, fc_dropout2=0.4):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=padding_idx)
        self.embed_dropout = nn.Dropout(embed_dropout)
        self.lstm = nn.LSTM(
            embed_dim, hidden_dim, num_layers=lstm_layers, dropout=0.3,
            batch_first=True, bidirectional=True
        )
        self.attention = Attention(hidden_dim, attn_dropout=0.3)
        self.bn1 = nn.BatchNorm1d(hidden_dim * 2)
        self.fc1 = nn.Linear(hidden_dim * 2, 192)
        self.dropout1 = nn.Dropout(fc_dropout1)
        self.bn2 = nn.BatchNorm1d(192)
        self.fc2 = nn.Linear(192, 96)
        self.dropout2 = nn.Dropout(fc_dropout2)
        self.fc3 = nn.Linear(96, num_classes)
        self.relu = nn.ReLU()

    def forward(self, x):
        emb = self.embedding(x)
        emb = self.embed_dropout(emb)
        lstm_out, _ = self.lstm(emb)
        context, attn_weights = self.attention(lstm_out)
        x = self.bn1(context)
        x = self.relu(self.fc1(x))
        x = self.dropout1(x)
        x = self.bn2(x)
        x = self.relu(self.fc2(x))
        x = self.dropout2(x)
        x = self.fc3(x)
        return x

class HybridBiLSTM_CNN_NoAttention(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes, padding_idx=0,
                 lstm_layers=2, cnn_filters=128, kernel_sizes=(2,3,4),
                 embed_dropout=0.2, fc_dropout=0.5):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=padding_idx)
        self.embed_dropout = nn.Dropout(embed_dropout)
        self.lstm = nn.LSTM(
            embed_dim, hidden_dim, num_layers=lstm_layers, batch_first=True,
            dropout=0.3, bidirectional=True
        )
        self.convs = nn.ModuleList([
            nn.Conv1d(in_channels=hidden_dim * 2, out_channels=cnn_filters, kernel_size=k)
            for k in kernel_sizes
        ])
        self.fc1 = nn.Linear(cnn_filters * len(kernel_sizes) + hidden_dim * 2, 256)
        self.dropout = nn.Dropout(fc_dropout)
        self.fc2 = nn.Linear(256, num_classes)
        self.relu = nn.ReLU()

    def forward(self, x):
        emb = self.embedding(x)
        emb = self.embed_dropout(emb)
        lstm_out, _ = self.lstm(emb)
        lstm_vec = torch.mean(lstm_out, dim=1)
        cnn_input = lstm_out.permute(0, 2, 1)
        cnn_feats = [self.relu(conv(cnn_input)).max(dim=2)[0] for conv in self.convs]
        cnn_vec = torch.cat(cnn_feats, dim=1)
        fused = torch.cat([lstm_vec, cnn_vec], dim=1)
        x = self.relu(self.fc1(fused))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

class AttentionModel3(nn.Module):
    def __init__(self, hidden_dim):
        super().__init__()
        self.attn = nn.Linear(hidden_dim * 2, 1)

    def forward(self, lstm_out):
        attn_scores = self.attn(lstm_out).squeeze(-1)
        attn_weights = torch.softmax(attn_scores, dim=1)
        context = torch.bmm(attn_weights.unsqueeze(1), lstm_out).squeeze(1)
        return context

class HybridBiLSTM_CNN(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes, padding_idx=0,
                 lstm_layers=2, cnn_filters=128, kernel_sizes=(2,3,4),
                 embed_dropout=0.2, fc_dropout=0.5):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=padding_idx)
        self.embed_dropout = nn.Dropout(embed_dropout)
        self.lstm = nn.LSTM(
            embed_dim, hidden_dim, num_layers=lstm_layers, dropout=0.3,
            batch_first=True, bidirectional=True
        )
        self.attention = AttentionModel3(hidden_dim)
        self.convs = nn.ModuleList([
            nn.Conv1d(in_channels=hidden_dim * 2, out_channels=cnn_filters, kernel_size=k)
            for k in kernel_sizes
        ])
        self.fc1 = nn.Linear(cnn_filters * len(kernel_sizes) + hidden_dim * 2, 256)
        self.dropout = nn.Dropout(fc_dropout)
        self.fc2 = nn.Linear(256, num_classes)
        self.relu = nn.ReLU()

    def forward(self, x):
        emb = self.embedding(x)
        emb = self.embed_dropout(emb)
        lstm_out, _ = self.lstm(emb)
        context = self.attention(lstm_out)
        cnn_input = lstm_out.permute(0, 2, 1)
        cnn_feats = [self.relu(conv(cnn_input)).max(dim=2)[0] for conv in self.convs]
        cnn_vec = torch.cat(cnn_feats, dim=1)
        fused = torch.cat([context, cnn_vec], dim=1)
        x = self.relu(self.fc1(fused))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# ========================= UTILS =========================

class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def clean_resume(text):
    if not text:
        return ""
    s = str(text)
    s = re.sub(r'\S+@\S+', ' ', s)
    s = re.sub(r'http\S+', ' ', s)
    replacements = {
        "C++": "CPLUSPLUS", "c++": "CPLUSPLUS",
        "C#": "CSHARP", "c#": "CSHARP",
        ".NET": "DOTNET", ".net": "DOTNET",
        "Node.js": "NODEJS", "node.js": "NODEJS"
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    s = re.sub(r'[^A-Za-z0-9+\#\./\s]', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    inv = {v: k.lower() for k, v in replacements.items()}
    for k, v in inv.items():
        s = s.replace(k, v)
    return s.lower().strip()

# ========================= MAIN SCRIPT =========================

def main():
    BASE_PATH = os.path.dirname(os.path.abspath(__file__))
    print(f"Working directory: {BASE_PATH}")
    
    # Check if evaluation results pickle exists
    eval_cache_path = os.path.join(BASE_PATH, "evaluation_results.pkl")
    
    results = None
    
    if os.path.exists(eval_cache_path):
        print(f"Loading evaluation results from {eval_cache_path}...")
        with open(eval_cache_path, 'rb') as f:
            results = pickle.load(f)
    else:
        print("Evaluation results pickle not found. Running full evaluation...")
        
        try:
            # Load resources
            print("Loading resources...")
            word2idx = pickle.load(open(os.path.join(BASE_PATH, "word2idx.pkl"), "rb"))
            le = pickle.load(open(os.path.join(BASE_PATH, "le.pkl"), "rb"))
            tfidf = pickle.load(open(os.path.join(BASE_PATH, "tfidf.pkl"), "rb"))
            
            vocab_size = len(word2idx)
            num_classes = len(le.classes_)
            embed_dim = 128
            hidden_dim = 128
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            
            # Load Models
            print("Loading models...")
            # ML Models
            clf1 = pickle.load(open(os.path.join(BASE_PATH, "clf1.pkl"), "rb"))
            clf2 = pickle.load(open(os.path.join(BASE_PATH, "clf2.pkl"), "rb"))
            try:
                clf3 = pickle.load(open(os.path.join(BASE_PATH, "clf3_rf.pkl"), "rb"))
            except:
                clf3 = None
                print("Warning: Random Forest model not found")

            # DL Models
            model1 = BiLSTMClassifier(vocab_size, embed_dim, hidden_dim, num_classes)
            model1.load_state_dict(torch.load(os.path.join(BASE_PATH, "BiLSTM+Attention.pt"), map_location=device))
            model1.to(device).eval()
            
            model2 = HybridBiLSTM_CNN_NoAttention(vocab_size, embed_dim, hidden_dim, num_classes)
            model2.load_state_dict(torch.load(os.path.join(BASE_PATH, "BiLSTM+CNN.pt"), map_location=device))
            model2.to(device).eval()
            
            model3 = HybridBiLSTM_CNN(vocab_size, embed_dim, hidden_dim, num_classes)
            model3.load_state_dict(torch.load(os.path.join(BASE_PATH, "BiLSTM+CNN+Attention.pt"), map_location=device))
            model3.to(device).eval()
            
            # Transformer
            try:
                trans_path = os.path.join(BASE_PATH, "transformer_model")
                tokenizer_trans = DistilBertTokenizerFast.from_pretrained(trans_path)
                transformer_model = DistilBertForSequenceClassification.from_pretrained(trans_path).to(device)
                transformer_model.eval()
            except:
                tokenizer_trans = None
                transformer_model = None
                print("Warning: Transformer model not found")

            # Load Data
            print("Loading and processing dataset...")
            df_path = os.path.join(BASE_PATH, "Final_Categorized.csv")
            df = pd.read_csv(df_path)
            df["Resume"] = df["Resume"].apply(clean_resume)
            df["label"] = le.transform(df["Category"])
            
            X = df["Resume"].values
            y = df["label"].values
            
            # Split data
            x_train_text, x_test_text, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
            
            # Prepare DL Data
            MAX_LEN = 500
            x_test_seq = []
            for t in x_test_text:
                seq = [word2idx.get(w, 1) for w in t.split()]
                if len(seq) < MAX_LEN:
                    seq += [0] * (MAX_LEN - len(seq))
                else:
                    seq = seq[:MAX_LEN]
                x_test_seq.append(seq)
            x_test_seq = np.array(x_test_seq)
            
            test_dataset = ResumeDataset(x_test_seq, y_test)
            test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)
            
            # Prepare ML Data
            x_test_tfidf = tfidf.transform(x_test_text)
            
            results = {}
            
            # Evaluate DL Models
            print("Evaluating DL models...")
            dl_models = {
                "BiLSTM+Attention": model1,
                "BiLSTM+CNN": model2,
                "BiLSTM+CNN+Attention": model3
            }
            
            for name, model in dl_models.items():
                print(f"Evaluating {name}...")
                all_preds = []
                all_probs = []
                with torch.no_grad():
                    for X_batch, _ in test_loader:
                        X_batch = X_batch.to(device)
                        out = model(X_batch)
                        probs = F.softmax(out, dim=1).cpu().numpy()
                        preds = np.argmax(probs, axis=1)
                        all_preds.extend(preds)
                        all_probs.extend(probs)
                
                y_pred = np.array(all_preds)
                y_prob = np.array(all_probs)
                
                acc = accuracy_score(y_test, y_pred)
                prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)
                top3 = top_k_accuracy_score(y_test, y_prob, k=3, labels=list(range(num_classes)))
                top5 = top_k_accuracy_score(y_test, y_prob, k=5, labels=list(range(num_classes)))
                cm = confusion_matrix(y_test, y_pred)
                
                results[name] = {
                    "Accuracy": acc,
                    "Precision": prec,
                    "Recall": rec,
                    "F1-score": f1,
                    "Top-3 Accuracy": top3,
                    "Top-5 Accuracy": top5,
                    "Confusion Matrix": cm
                }

            # Evaluate ML Models
            print("Evaluating ML models...")
            ml_models = {
                "Logistic Regression": clf1,
                "Linear SVM": clf2
            }
            if clf3:
                ml_models["Random Forest"] = clf3
                
            for name, model in ml_models.items():
                print(f"Evaluating {name}...")
                probs = model.predict_proba(x_test_tfidf)
                preds = np.argmax(probs, axis=1)
                
                acc = accuracy_score(y_test, preds)
                prec, rec, f1, _ = precision_recall_fscore_support(y_test, preds, average='weighted', zero_division=0)
                top3 = top_k_accuracy_score(y_test, probs, k=3, labels=list(range(num_classes)))
                top5 = top_k_accuracy_score(y_test, probs, k=5, labels=list(range(num_classes)))
                cm = confusion_matrix(y_test, preds)
                
                results[name] = {
                    "Accuracy": acc,
                    "Precision": prec,
                    "Recall": rec,
                    "F1-score": f1,
                    "Top-3 Accuracy": top3,
                    "Top-5 Accuracy": top5,
                    "Confusion Matrix": cm
                }
                
            # Evaluate Transformer
            if tokenizer_trans and transformer_model:
                print("Evaluating Transformer...")
                all_preds = []
                all_probs = []
                # Process in batches to avoid OOM
                batch_size = 16
                for i in range(0, len(x_test_text), batch_size):
                    batch_texts = x_test_text[i:i+batch_size]
                    inputs = tokenizer_trans(
                        batch_texts.tolist(),
                        truncation=True,
                        padding="max_length",
                        max_length=512,
                        return_tensors="pt"
                    ).to(device)
                    
                    with torch.no_grad():
                        outputs = transformer_model(**inputs)
                        probs = F.softmax(outputs.logits, dim=1).cpu().numpy()
                        preds = np.argmax(probs, axis=1)
                        all_preds.extend(preds)
                        all_probs.extend(probs)
                
                y_pred = np.array(all_preds)
                y_prob = np.array(all_probs)
                
                acc = accuracy_score(y_test, y_pred)
                prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)
                top3 = top_k_accuracy_score(y_test, y_prob, k=3, labels=list(range(num_classes)))
                top5 = top_k_accuracy_score(y_test, y_prob, k=5, labels=list(range(num_classes)))
                cm = confusion_matrix(y_test, y_pred)
                
                results["DistilBERT Transformer"] = {
                    "Accuracy": acc,
                    "Precision": prec,
                    "Recall": rec,
                    "F1-score": f1,
                    "Top-3 Accuracy": top3,
                    "Top-5 Accuracy": top5,
                    "Confusion Matrix": cm
                }

            # Generate Learning Curves (Simplified for speed)
            print("Generating learning curves...")
            learning_curves = {}
            # Using a smaller subset for speed if needed, but here we use full X
            X_full_tfidf = tfidf.transform(df["Resume"].values)
            y_full = df["label"].values
            
            for name, model in ml_models.items():
                print(f"Learning curve for {name}...")
                train_sizes, train_scores, test_scores = learning_curve(
                    model, X_full_tfidf, y_full, cv=3, n_jobs=-1, 
                    train_sizes=np.linspace(.1, 1.0, 4)
                )
                learning_curves[name] = {
                    'train_sizes': train_sizes,
                    'train_scores': train_scores,
                    'test_scores': test_scores
                }
            
            results['learning_curves'] = learning_curves
            
            # Save to pickle for future use
            with open(eval_cache_path, 'wb') as f:
                pickle.dump(results, f)
            print("Evaluation complete and saved to pickle.")
            
        except Exception as e:
            print(f"Error during evaluation: {e}")
            import traceback
            traceback.print_exc()
            return

    # Separate data into different JSON files
    if results:
        metrics = {}
        confusion_matrices = {}
        learning_curves_data = {}
        
        for model_name, data in results.items():
            if model_name == 'learning_curves':
                learning_curves_data = data
                continue
                
            # Extract metrics
            metrics[model_name] = {k: v for k, v in data.items() if k != "Confusion Matrix"}
            
            # Extract confusion matrix
            if "Confusion Matrix" in data:
                confusion_matrices[model_name] = data["Confusion Matrix"]
        
        # Save Metrics
        with open(os.path.join(BASE_PATH, 'evaluation_metrics.json'), 'w') as f:
            json.dump(metrics, f, cls=NumpyEncoder, indent=2)
        print("Saved evaluation_metrics.json")
        
        # Save Confusion Matrices
        with open(os.path.join(BASE_PATH, 'confusion_matrices.json'), 'w') as f:
            json.dump(confusion_matrices, f, cls=NumpyEncoder, indent=2)
        print("Saved confusion_matrices.json")
        
        # Save Learning Curves
        with open(os.path.join(BASE_PATH, 'learning_curves.json'), 'w') as f:
            json.dump(learning_curves_data, f, cls=NumpyEncoder, indent=2)
        print("Saved learning_curves.json")

if __name__ == "__main__":
    main()
