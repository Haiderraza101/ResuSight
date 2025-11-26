import pickle
import os
import re
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, top_k_accuracy_score
)

class ModelLoader:
    def __init__(self, models_dir='../../models'):
        """
        Initialize model loader with path to models directory
        """
        self.models_dir = models_dir
        self.clf1 = None
        self.clf2 = None
        self.clf3 = None
        self.clf4 = None
        self.tfidf = None
        self.le = None
        self.x_test = None
        self.y_test = None
        self.load_models()
    
    def load_models(self):
        """Load all required models and preprocessors"""
        try:
            model_path = os.path.join(self.models_dir, 'clf1.pkl')
            self.clf1 = pickle.load(open(model_path, 'rb'))
            
            model_path = os.path.join(self.models_dir, 'clf2.pkl')
            self.clf2 = pickle.load(open(model_path, 'rb'))
            
            # Load clf3 (Random Forest) and clf4 (XGBoost) if available
            try:
                model_path = os.path.join(self.models_dir, 'clf3_rf.pkl')
                self.clf3 = pickle.load(open(model_path, 'rb'))
            except FileNotFoundError:
                print("Warning: clf3_rf.pkl not found. Model 3 will not be available.")
                self.clf3 = None
            
            try:
                model_path = os.path.join(self.models_dir, 'clf4_xgb.pkl')
                self.clf4 = pickle.load(open(model_path, 'rb'))
            except FileNotFoundError:
                print("Warning: clf4_xgb.pkl not found. Model 4 will not be available.")
                self.clf4 = None
            
            model_path = os.path.join(self.models_dir, 'tfidf.pkl')
            self.tfidf = pickle.load(open(model_path, 'rb'))
            
            model_path = os.path.join(self.models_dir, 'le.pkl')
            self.le = pickle.load(open(model_path, 'rb'))
            
            # Load test data for evaluation
            try:
                test_path = os.path.join(self.models_dir, 'x_test.pkl')
                self.x_test = pickle.load(open(test_path, 'rb'))
                
                test_path = os.path.join(self.models_dir, 'y_test.pkl')
                self.y_test = pickle.load(open(test_path, 'rb'))
            except FileNotFoundError:
                print("Warning: Test data not found. Evaluation features may be limited.")
                self.x_test = None
                self.y_test = None
                
            print("All models loaded successfully!")
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Model file not found: {e}")
        except Exception as e:
            raise Exception(f"Error loading models: {e}")
    
    def clean_text(self, text):
        """Clean text using the same preprocessing as Streamlit app"""
        if pd.isna(text):
            return ""
        clean_txt = str(text)
        clean_txt = re.sub(r'\S+@\S+', ' ', clean_txt)
        clean_txt = re.sub(r'http\S+', ' ', clean_txt)
        replacements = {
            "C++": "CPLUSPLUS", "c++": "CPLUSPLUS",
            "C#": "CSHARP", "c#": "CSHARP",
            ".NET": "DOTNET", ".net": "DOTNET",
            "Node.js": "NODEJS", "node.js": "NODEJS"
        }
        for k, v in replacements.items():
            clean_txt = clean_txt.replace(k, v)
        clean_txt = re.sub(r'[^A-Za-z0-9+\#\./\s]', ' ', clean_txt)
        clean_txt = re.sub(r'\s+', ' ', clean_txt).strip()
        inv = {v: k.lower() for k, v in replacements.items()}
        for k, v in inv.items():
            clean_txt = clean_txt.replace(k, v)
        return clean_txt.lower().strip()
    
    def predict(self, resume_text, model_name='both'):
        """
        Predict job category from resume text
        
        Args:
            resume_text: Raw resume text
            model_name: 'clf1', 'clf2', 'clf3', 'clf4', or 'all'
        
        Returns:
            Dictionary with predictions
        """
        if not resume_text or not resume_text.strip():
            return {"error": "Resume text is empty"}
        
        # Clean and vectorize
        cleaned_text = self.clean_text(resume_text)
        vectorized_resume = self.tfidf.transform([cleaned_text])
        
        # Get category mapping
        category_mapping = dict(enumerate(self.le.classes_))
        
        results = {}
        
        def add_prediction(model, model_key, model_name_str):
            try:
                prediction = model.predict(vectorized_resume)[0]
                result = category_mapping.get(prediction, "Unknown")
                pred_result = {
                    'prediction': int(prediction),
                    'category': result,
                    'confidence': None
                }
                
                # Try to get probabilities if available
                try:
                    proba = model.predict_proba(vectorized_resume)[0]
                    pred_result['confidence'] = float(max(proba))
                    pred_result['probabilities'] = {
                        category_mapping.get(i, "Unknown"): float(prob) 
                        for i, prob in enumerate(proba)
                    }
                except:
                    pass
                
                results[model_key] = pred_result
            except Exception as e:
                results[model_key] = {"error": str(e)}
        
        if model_name in ['clf1', 'both', 'all']:
            add_prediction(self.clf1, 'model1', 'Model 1')
        
        if model_name in ['clf2', 'both', 'all']:
            add_prediction(self.clf2, 'model2', 'Model 2')
        
        if model_name in ['clf3', 'all'] and self.clf3 is not None:
            add_prediction(self.clf3, 'model3', 'Model 3')
        
        if model_name in ['clf4', 'all'] and self.clf4 is not None:
            add_prediction(self.clf4, 'model4', 'Model 4')
        
        return results
    
    def evaluate(self, model_name='all'):
        """
        Evaluate model(s) on test data
        
        Args:
            model_name: 'clf1', 'clf2', 'clf3', 'clf4', or 'all'
        
        Returns:
            Dictionary with evaluation metrics for each model
        """
        if self.x_test is None or self.y_test is None:
            return {"error": "Test data not available"}
        
        results = {}
        category_mapping = dict(enumerate(self.le.classes_))
        
        def evaluate_model(model, model_key, model_name_str):
            try:
                y_pred = model.predict(self.x_test)
                y_proba = model.predict_proba(self.x_test)
                
                accuracy = float(accuracy_score(self.y_test, y_pred))
                precision = float(precision_score(self.y_test, y_pred, average='weighted', zero_division=0))
                recall = float(recall_score(self.y_test, y_pred, average='weighted', zero_division=0))
                f1 = float(f1_score(self.y_test, y_pred, average='weighted'))
                
                # AUC (multi-class)
                try:
                    auc = float(roc_auc_score(self.y_test, y_proba, multi_class='ovr'))
                except:
                    auc = None
                
                # Top-3 Accuracy
                try:
                    top3_acc = float(top_k_accuracy_score(self.y_test, y_proba, k=3))
                except:
                    top3_acc = None
                
                # Confusion Matrix
                cm = confusion_matrix(self.y_test, y_pred)
                cm_list = cm.tolist()
                
                results[model_key] = {
                    'model_name': model_name_str,
                    'accuracy': accuracy,
                    'precision': precision,
                    'recall': recall,
                    'f1_score': f1,
                    'auc': auc,
                    'top3_accuracy': top3_acc,
                    'confusion_matrix': cm_list,
                    'labels': list(self.le.classes_)
                }
            except Exception as e:
                results[model_key] = {"error": str(e)}
        
        if model_name in ['clf1', 'all']:
            evaluate_model(self.clf1, 'model1', 'Model 1 (KNN/SVM)')
        
        if model_name in ['clf2', 'all']:
            evaluate_model(self.clf2, 'model2', 'Model 2 (Logistic Regression)')
        
        if model_name in ['clf3', 'all'] and self.clf3 is not None:
            evaluate_model(self.clf3, 'model3', 'Model 3 (Random Forest)')
        
        if model_name in ['clf4', 'all'] and self.clf4 is not None:
            evaluate_model(self.clf4, 'model4', 'Model 4 (XGBoost)')
        
        return results

