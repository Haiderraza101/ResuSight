from flask import Flask, request, jsonify
from flask_cors import CORS
from model_loader import ModelLoader
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize model loader
models_dir = os.path.join(os.path.dirname(__file__), '../../models')
model_loader = ModelLoader(models_dir=models_dir)

# ------------------------
# Routes
# ------------------------
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "Flask API is running"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field in request body"}), 400
        
        resume_text = data['text']
        model_name = data.get('model', 'both')
        
        if model_name not in ['clf1', 'clf2', 'both']:
            return jsonify({"error": "Invalid model name. Use 'clf1', 'clf2', or 'both'"}), 400
        
        results = model_loader.predict(resume_text, model_name)
        if 'error' in results:
            return jsonify(results), 400
        
        return jsonify({"success": True, "results": results}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/file', methods=['POST'])
def predict_file():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field in request body"}), 400
        
        resume_text = data['text']
        model_name = data.get('model', 'both')
        results = model_loader.predict(resume_text, model_name)
        if 'error' in results:
            return jsonify(results), 400
        
        return jsonify({"success": True, "results": results}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/categories', methods=['GET'])
def get_categories():
    try:
        category_mapping = dict(enumerate(model_loader.le.classes_))
        categories = [{"id": k, "name": v} for k, v in category_mapping.items()]
        return jsonify({"success": True, "categories": categories}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------
# Global JSON error handlers
# ------------------------
@app.errorhandler(404)
def handle_404(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def handle_500(e):
    return jsonify({"error": "Internal server error"}), 500

# ------------------------
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
