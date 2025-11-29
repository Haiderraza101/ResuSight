from flask import Flask, request, jsonify
from flask_cors import CORS
from model_loader import ModelLoader
from file_parser import extract_text_from_file
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'txt'}
MAX_FILE_SIZE = 25 * 1024 * 1024

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
model_loader = ModelLoader(models_dir=models_dir)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "Flask API is running"}), 200

@app.route('/api/resume/upload', methods=['POST'])
def upload_resume():
    """Handle resume file upload and return predictions from all 7 models"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed. Only PDF and TXT files are supported"}), 400
        
        try:
            extracted_text = extract_text_from_file(file)
        except Exception as e:
            return jsonify({"error": f"Failed to extract text from file: {str(e)}"}), 400
        
        if not extracted_text or not extracted_text.strip():
            return jsonify({"error": "No text could be extracted from the file"}), 400
        
        # Get predictions from ALL 7 models
        predictions = model_loader.predict_all(extracted_text)
        if 'error' in predictions:
            return jsonify(predictions), 400
        
        return jsonify({
            "success": True,
            "filename": secure_filename(file.filename),
            "extractedTextLength": len(extracted_text),
            "extractedText": extracted_text,
            "predictions": predictions
        }), 200

    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500

@app.route('/api/resume/predict', methods=['POST'])
def predict():
    """Predict from raw text using all 7 models"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field in request body"}), 400
        
        resume_text = data['text']
        
        # Get predictions from ALL 7 models
        results = model_loader.predict_all(resume_text)
        if 'error' in results:
            return jsonify(results), 400
        
        return jsonify({"success": True, "predictions": results}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/resume/categories', methods=['GET'])
def get_categories():
    """Get all job categories"""
    try:
        category_mapping = dict(enumerate(model_loader.le.classes_))
        categories = [{"id": k, "name": v} for k, v in category_mapping.items()]
        return jsonify({"success": True, "categories": categories}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def handle_404(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def handle_500(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
