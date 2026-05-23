import pickle
import os
import re
import torch
import torch.nn.functional as F
import numpy as np
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

class Attention(torch.nn.Module):
    def __init__(self, hidden_dim, attn_dropout=0.3):
        super(Attention, self).__init__()
        self.attn = torch.nn.Linear(hidden_dim * 2, 1)
        self.dropout = torch.nn.Dropout(attn_dropout)

    def forward(self, lstm_out):
        attn_scores = self.attn(lstm_out).squeeze(-1)
        attn_weights = torch.softmax(attn_scores, dim=1)
        attn_weights = self.dropout(attn_weights)
        context = torch.bmm(attn_weights.unsqueeze(1), lstm_out).squeeze(1)
        return context, attn_weights

class BiLSTMClassifier(torch.nn.Module):
    """BiLSTM + Attention"""
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes, padding_idx=0,
                 lstm_layers=2, embed_dropout=0.2, fc_dropout1=0.5, fc_dropout2=0.4):
        super().__init__()
        self.embedding = torch.nn.Embedding(vocab_size, embed_dim, padding_idx=padding_idx)
        self.embed_dropout = torch.nn.Dropout(embed_dropout)
        self.lstm = torch.nn.LSTM(
            embed_dim, hidden_dim, num_layers=lstm_layers, dropout=0.3,
            batch_first=True, bidirectional=True
        )
        self.attention = Attention(hidden_dim, attn_dropout=0.3)
        self.bn1 = torch.nn.BatchNorm1d(hidden_dim * 2)
        self.fc1 = torch.nn.Linear(hidden_dim * 2, 192)
        self.dropout1 = torch.nn.Dropout(fc_dropout1)
        self.bn2 = torch.nn.BatchNorm1d(192)
        self.fc2 = torch.nn.Linear(192, 96)
        self.dropout2 = torch.nn.Dropout(fc_dropout2)
        self.fc3 = torch.nn.Linear(96, num_classes)
        self.relu = torch.nn.ReLU()

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

class HybridBiLSTM_CNN_NoAttention(torch.nn.Module):
    """BiLSTM + CNN (No Attention)"""
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes, padding_idx=0,
                 lstm_layers=2, cnn_filters=128, kernel_sizes=(2, 3, 4),
                 embed_dropout=0.2, fc_dropout=0.5):
        super().__init__()
        self.embedding = torch.nn.Embedding(vocab_size, embed_dim, padding_idx=padding_idx)
        self.embed_dropout = torch.nn.Dropout(embed_dropout)
        self.lstm = torch.nn.LSTM(
            embed_dim, hidden_dim, num_layers=lstm_layers, batch_first=True,
            dropout=0.3, bidirectional=True
        )
        self.convs = torch.nn.ModuleList([
            torch.nn.Conv1d(in_channels=hidden_dim * 2, out_channels=cnn_filters, kernel_size=k)
            for k in kernel_sizes
        ])
        self.fc1 = torch.nn.Linear(cnn_filters * len(kernel_sizes) + hidden_dim * 2, 256)
        self.dropout = torch.nn.Dropout(fc_dropout)
        self.fc2 = torch.nn.Linear(256, num_classes)
        self.relu = torch.nn.ReLU()

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

class HybridBiLSTM_CNN(torch.nn.Module):
    """BiLSTM + CNN + Attention"""
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes, padding_idx=0,
                 lstm_layers=2, cnn_filters=128, kernel_sizes=(2, 3, 4),
                 embed_dropout=0.2, fc_dropout=0.5):
        super().__init__()
        self.embedding = torch.nn.Embedding(vocab_size, embed_dim, padding_idx=padding_idx)
        self.embed_dropout = torch.nn.Dropout(embed_dropout)
        self.lstm = torch.nn.LSTM(
            embed_dim, hidden_dim, num_layers=lstm_layers, batch_first=True,
            dropout=0.3, bidirectional=True
        )
        self.attention = Attention(hidden_dim, attn_dropout=0.3)
        self.convs = torch.nn.ModuleList([
            torch.nn.Conv1d(in_channels=hidden_dim * 2, out_channels=cnn_filters, kernel_size=k)
            for k in kernel_sizes
        ])
        self.fc1 = torch.nn.Linear(cnn_filters * len(kernel_sizes) + hidden_dim * 2, 256)
        self.dropout = torch.nn.Dropout(fc_dropout)
        self.fc2 = torch.nn.Linear(256, num_classes)
        self.relu = torch.nn.ReLU()

    def forward(self, x):
        emb = self.embedding(x)
        emb = self.embed_dropout(emb)
        lstm_out, _ = self.lstm(emb)
        context, _ = self.attention(lstm_out)
        cnn_input = lstm_out.permute(0, 2, 1)
        cnn_feats = [self.relu(conv(cnn_input)).max(dim=2)[0] for conv in self.convs]
        cnn_vec = torch.cat(cnn_feats, dim=1)
        fused = torch.cat([context, cnn_vec], dim=1)
        x = self.relu(self.fc1(fused))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

class ModelLoader:
    def __init__(self, models_dir=None):
        """
        Initialize model loader with path to models directory.
        Loads all 7 models: 3 ML, 3 DL, 1 Transformer.
        """
        if models_dir:
            self.models_dir = os.path.abspath(models_dir)
        else:
            self.models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
        
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        self.clf1 = None 
        self.clf2 = None
        self.clf3_rf = None 
        
        self.model1 = None 
        self.model2 = None 
        self.model3 = None
        
        self.transformer_model = None
        self.transformer_tokenizer = None
       
        self.tfidf = None
        self.le = None
        self.word2idx = None
        self.idx2word = None
        
        self.MAX_LEN = 500
        self.vocab_size = None
        self.num_classes = None
        self.embed_dim = 128
        self.hidden_dim = 128
        
        self.load_models()
    
    def load_models(self):
        """Load all required models and preprocessors"""
        try:
            print("Loading ML preprocessing tools...")
            model_path = os.path.join(self.models_dir, 'tfidf.pkl')
            self.tfidf = pickle.load(open(model_path, 'rb'))
            
            model_path = os.path.join(self.models_dir, 'le.pkl')
            self.le = pickle.load(open(model_path, 'rb'))
            
            self.num_classes = len(self.le.classes_)
            
            print("Loading ML models...")
            model_path = os.path.join(self.models_dir, 'clf1.pkl')
            self.clf1 = pickle.load(open(model_path, 'rb'))
            
            model_path = os.path.join(self.models_dir, 'clf2.pkl')
            self.clf2 = pickle.load(open(model_path, 'rb'))
            
            try:
                model_path = os.path.join(self.models_dir, 'clf3_rf.pkl')
                self.clf3_rf = pickle.load(open(model_path, 'rb'))
                print("✓ clf3_rf (Random Forest) loaded")
            except FileNotFoundError:
                print("⚠ clf3_rf (Random Forest) not found - will skip")
            
            print("Loading DL preprocessing tools...")
            try:
                word2idx_path = os.path.join(self.models_dir, 'word2idx.pkl')
                self.word2idx = pickle.load(open(word2idx_path, 'rb'))
                
                idx2word_path = os.path.join(self.models_dir, 'idx2word.pkl')
                self.idx2word = pickle.load(open(idx2word_path, 'rb'))
                
                self.vocab_size = len(self.word2idx)
                print(f"✓ DL vocab loaded: {self.vocab_size} words")
            except FileNotFoundError:
                print("⚠ DL preprocessing files (word2idx, idx2word) not found")
            
            if self.word2idx:
                print("Loading DL models...")
                try:
                    self.model1 = BiLSTMClassifier(
                        vocab_size=self.vocab_size, embed_dim=self.embed_dim,
                        hidden_dim=self.hidden_dim, num_classes=self.num_classes
                    )
                    pt_path = os.path.join(self.models_dir, 'BiLSTM+Attention.pt')
                    self.model1.load_state_dict(torch.load(pt_path, map_location=self.device))
                    self.model1 = self.model1.to(self.device)
                    self.model1.eval()
                    print("BiLSTM+Attention loaded")
                except Exception as e:
                    print(f"BiLSTM+Attention not loaded: {e}")
                
                try:
                    self.model2 = HybridBiLSTM_CNN_NoAttention(
                        vocab_size=self.vocab_size, embed_dim=self.embed_dim,
                        hidden_dim=self.hidden_dim, num_classes=self.num_classes
                    )
                    pt_path = os.path.join(self.models_dir, 'BiLSTM+CNN.pt')
                    self.model2.load_state_dict(torch.load(pt_path, map_location=self.device))
                    self.model2 = self.model2.to(self.device)
                    self.model2.eval()
                    print("✓ BiLSTM+CNN loaded")
                except Exception as e:
                    print(f"⚠ BiLSTM+CNN not loaded: {e}")
                
                try:
                    self.model3 = HybridBiLSTM_CNN(
                        vocab_size=self.vocab_size, embed_dim=self.embed_dim,
                        hidden_dim=self.hidden_dim, num_classes=self.num_classes
                    )
                    pt_path = os.path.join(self.models_dir, 'BiLSTM+CNN+Attention.pt')
                    self.model3.load_state_dict(torch.load(pt_path, map_location=self.device))
                    self.model3 = self.model3.to(self.device)
                    self.model3.eval()
                    print("BiLSTM+CNN+Attention loaded")
                except Exception as e:
                    print(f"BiLSTM+CNN+Attention not loaded: {e}")
            
            print("Loading Transformer model...")
            try:
                transformer_path = os.path.join(self.models_dir, 'transformer_model')
                self.transformer_tokenizer = DistilBertTokenizerFast.from_pretrained(transformer_path)
                self.transformer_model = DistilBertForSequenceClassification.from_pretrained(transformer_path)
                self.transformer_model = self.transformer_model.to(self.device)
                self.transformer_model.eval()
                print("✓ DistilBERT Transformer loaded")
            except Exception as e:
                print(f"⚠ Transformer not loaded: {e}")
            
            print("Model loading complete!")
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Model file not found: {e}")
        except Exception as e:
            raise Exception(f"Error loading models: {e}")
    
    def clean_text(self, text):
        """Clean text using the same preprocessing as training"""
        clean_txt = re.sub(r'http\S+', '', text)
        clean_txt = re.sub(r'@[A-Za-z0-9]+', '', clean_txt)
        clean_txt = re.sub(r'#', '', clean_txt)
        clean_txt = re.sub(r'[^A-Za-z0-9\s]+', '', clean_txt)
        clean_txt = re.sub(r'RT|cc|CC|rt', '', clean_txt)
        clean_txt = re.sub(r'\s+', ' ', clean_txt)
        return clean_txt.strip()
    
    def text_to_seq(self, text):
        """Convert text to sequence for DL models"""
        if not self.word2idx:
            return None
        seq = [self.word2idx.get(w, 1) for w in text.split()]
        if len(seq) < self.MAX_LEN:
            seq += [0] * (self.MAX_LEN - len(seq))
        else:
            seq = seq[:self.MAX_LEN]
        return torch.tensor([seq], dtype=torch.long).to(self.device)
    
    def get_top_n_predictions(self, probs, n=5):
        """Get top N predictions with labels"""
        if probs is None:
            return []
        top_indices = np.argsort(probs)[-n:][::-1]
        category_mapping = dict(enumerate(self.le.classes_))
        return [
            {
                "category": category_mapping.get(idx, "Unknown"),
                "probability": float(probs[idx])
            }
            for idx in top_indices
        ]
    
    def predict_all(self, resume_text):
        """
        Get predictions from all 7 models.
        
        Returns:
            Dictionary with predictions from all models
        """
        if not resume_text or not resume_text.strip():
            return {"error": "Resume text is empty"}
        
        cleaned_text = self.clean_text(resume_text)
        category_mapping = dict(enumerate(self.le.classes_))
        results = {}
        
        # ===== ML MODELS =====
        if self.clf1:
            tfidf_vec = self.tfidf.transform([cleaned_text])
            proba = self.clf1.predict_proba(tfidf_vec)[0]
            top1_idx = np.argmax(proba)
            results['Logistic Regression'] = {
                'prediction': int(top1_idx),
                'category': category_mapping.get(top1_idx, "Unknown"),
                'confidence': float(proba[top1_idx]),
                'top5': self.get_top_n_predictions(proba, 5)
            }
        
        if self.clf2:
            tfidf_vec = self.tfidf.transform([cleaned_text])
            proba = self.clf2.predict_proba(tfidf_vec)[0]
            top1_idx = np.argmax(proba)
            results['Linear SVM'] = {
                'prediction': int(top1_idx),
                'category': category_mapping.get(top1_idx, "Unknown"),
                'confidence': float(proba[top1_idx]),
                'top5': self.get_top_n_predictions(proba, 5)
            }
        
        if self.clf3_rf:
            tfidf_vec = self.tfidf.transform([cleaned_text])
            proba = self.clf3_rf.predict_proba(tfidf_vec)[0]
            top1_idx = np.argmax(proba)
            results['Random Forest'] = {
                'prediction': int(top1_idx),
                'category': category_mapping.get(top1_idx, "Unknown"),
                'confidence': float(proba[top1_idx]),
                'top5': self.get_top_n_predictions(proba, 5)
            }
        
        seq = self.text_to_seq(cleaned_text)
        
        if self.model1 and seq is not None:
            with torch.no_grad():
                logits = self.model1(seq)
                probs = F.softmax(logits, dim=1).cpu().numpy()[0]
            top1_idx = np.argmax(probs)
            results['BiLSTM+Attention'] = {
                'prediction': int(top1_idx),
                'category': category_mapping.get(top1_idx, "Unknown"),
                'confidence': float(probs[top1_idx]),
                'top5': self.get_top_n_predictions(probs, 5)
            }
        
        if self.model2 and seq is not None:
            with torch.no_grad():
                logits = self.model2(seq)
                probs = F.softmax(logits, dim=1).cpu().numpy()[0]
            top1_idx = np.argmax(probs)
            results['BiLSTM+CNN'] = {
                'prediction': int(top1_idx),
                'category': category_mapping.get(top1_idx, "Unknown"),
                'confidence': float(probs[top1_idx]),
                'top5': self.get_top_n_predictions(probs, 5)
            }
        
        if self.model3 and seq is not None:
            with torch.no_grad():
                logits = self.model3(seq)
                probs = F.softmax(logits, dim=1).cpu().numpy()[0]
            top1_idx = np.argmax(probs)
            results['BiLSTM+CNN+Attention'] = {
                'prediction': int(top1_idx),
                'category': category_mapping.get(top1_idx, "Unknown"),
                'confidence': float(probs[top1_idx]),
                'top5': self.get_top_n_predictions(probs, 5)
            }
        
        if self.transformer_model and self.transformer_tokenizer:
            try:
                inputs = self.transformer_tokenizer(
                    cleaned_text, return_tensors="pt", truncation=True, max_length=512
                ).to(self.device)
                with torch.no_grad():
                    outputs = self.transformer_model(**inputs)
                    logits = outputs.logits
                    probs = F.softmax(logits, dim=1).cpu().numpy()[0]
                top1_idx = np.argmax(probs)
                results['DistilBERT Transformer'] = {
                    'prediction': int(top1_idx),
                    'category': category_mapping.get(top1_idx, "Unknown"),
                    'confidence': float(probs[top1_idx]),
                    'top5': self.get_top_n_predictions(probs, 5)
                }
            except Exception as e:
                print(f"Transformer prediction error: {e}")
        
        return results

    def get_evaluation_metrics(self):
        """Load and return cached evaluation metrics"""
        import json
        metrics_path = os.path.join(self.models_dir, 'evaluation_metrics.json')
        if os.path.exists(metrics_path):
            with open(metrics_path, 'r') as f:
                return json.load(f)
        return {"error": "Evaluation metrics not found. Please run evaluation first."}
    
    def get_confusion_matrices(self):
        """Load and return confusion matrices"""
        import json
        cm_path = os.path.join(self.models_dir, 'confusion_matrices.json')
        if os.path.exists(cm_path):
            with open(cm_path, 'r') as f:
                data = json.load(f)
                data['labels'] = self.le.classes_.tolist()
                return data
        return {"error": "Confusion matrices not found. Please run evaluation first."}
    
    def get_training_history(self):
        """Load and return training history for DL and Transformer models"""
        import json
        history = {}
        
        dl_models = ['BiLSTM+Attention', 'BiLSTM+CNN', 'BiLSTM+CNN+Attention']
        for i, model_name in enumerate(dl_models, 1):
            history_path = os.path.join(self.models_dir, f'history_model{i}.json')
            if os.path.exists(history_path):
                with open(history_path, 'r') as f:
                    history[model_name] = json.load(f)
        
        transformer_history_path = os.path.join(self.models_dir, 'transformer_model', 'transformer_history.json')
        if os.path.exists(transformer_history_path):
            with open(transformer_history_path, 'r') as f:
                history['DistilBERT Transformer'] = json.load(f)
        
        return history
    
    def get_learning_curves(self):
        """Load and return learning curves for ML models"""
        import json
        curves_path = os.path.join(self.models_dir, 'learning_curves.json')
        if os.path.exists(curves_path):
            with open(curves_path, 'r') as f:
                return json.load(f)
        return {"error": "Learning curves not found. Please run evaluation first."}

