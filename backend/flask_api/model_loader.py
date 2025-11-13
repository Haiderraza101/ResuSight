import pickle
import os
import re

class ModelLoader:
    def __init__(self, models_dir='../../models'):
        """
        Initialize model loader with path to models directory
        """
        self.models_dir = models_dir
        self.clf1 = None
        self.clf2 = None
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
        """Clean text using the same preprocessing as training"""
        clean_txt = re.sub(r'http\S+', '', text)
        clean_txt = re.sub(r'@[A-Za-z0-9]+', '', clean_txt)
        clean_txt = re.sub(r'#', '', clean_txt)
        clean_txt = re.sub(r'[^A-Za-z0-9\s]+', '', clean_txt)
        clean_txt = re.sub(r'RT|cc|CC|rt', '', clean_txt)
        clean_txt = re.sub(r'\s+', ' ', clean_txt)
        return clean_txt.strip()
    
    def predict(self, resume_text, model_name='both'):
        """
        Predict job category from resume text
        
        Args:
            resume_text: Raw resume text
            model_name: 'clf1', 'clf2', or 'both'
        
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
        
        if model_name in ['clf1', 'both']:
            prediction1 = self.clf1.predict(vectorized_resume)[0]
            result1 = category_mapping.get(prediction1, "Unknown")
            results['model1'] = {
                'prediction': int(prediction1),
                'category': result1,
                'confidence': None  # KNN doesn't provide probability
            }
            
            # Try to get probabilities if available
            try:
                proba1 = self.clf1.predict_proba(vectorized_resume)[0]
                results['model1']['confidence'] = float(max(proba1))
                results['model1']['probabilities'] = {
                    category_mapping.get(i, "Unknown"): float(prob) 
                    for i, prob in enumerate(proba1)
                }
            except:
                pass
        
        if model_name in ['clf2', 'both']:
            prediction2 = self.clf2.predict(vectorized_resume)[0]
            result2 = category_mapping.get(prediction2, "Unknown")
            results['model2'] = {
                'prediction': int(prediction2),
                'category': result2,
                'confidence': None
            }
            
            # Try to get probabilities if available
            try:
                proba2 = self.clf2.predict_proba(vectorized_resume)[0]
                results['model2']['confidence'] = float(max(proba2))
                results['model2']['probabilities'] = {
                    category_mapping.get(i, "Unknown"): float(prob) 
                    for i, prob in enumerate(proba2)
                }
            except:
                pass
        
        return results

