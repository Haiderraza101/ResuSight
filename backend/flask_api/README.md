# Flask API for ResuSight

This Flask API serves resume analysis for the ResuSight application. It handles file uploads, text extraction, and predictions using ML models.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run Server

```bash
python app.py
```

The API will start on `http://localhost:5000`

## Architecture

- **Framework:** Flask + Flask-CORS
- **Models:** scikit-learn (KNN + Logistic Regression)
- **File Processing:** PyPDF2 for PDF extraction
- **Text Processing:** TF-IDF vectorization

## Key Files

| File               | Purpose                                |
| ------------------ | -------------------------------------- |
| `app.py`           | Main Flask application with API routes |
| `model_loader.py`  | ML model management and predictions    |
| `file_parser.py`   | PDF/TXT text extraction utilities      |
| `requirements.txt` | Python dependencies                    |

## API Endpoints

### 1. Health Check

```
GET /health

Response: {"status": "healthy", "message": "Flask API is running"}
```

### 2. Upload & Analyze Resume

```
POST /api/resume/upload
Content-Type: multipart/form-data

Parameters:
- file: (File) PDF or TXT resume
- model: (string) 'clf1' | 'clf2' | 'both' (optional, default: 'both')

Response:
{
  "success": true,
  "filename": "resume.pdf",
  "fileSize": 102400,
  "extractedTextLength": 5000,
  "predictions": {
    "model1": {
      "prediction": 2,
      "category": "Software Engineer",
      "confidence": 0.95,
      "probabilities": {...}
    },
    "model2": {...}
  }
}
```

### 3. Predict from Text

```
POST /api/resume/predict
Content-Type: application/json

Request:
{
  "text": "resume text content...",
  "model": "both"
}

Response: Same structure as /api/resume/upload (minus file info)
```

### 4. Get Job Categories

```
GET /api/resume/categories

Response:
{
  "success": true,
  "categories": [
    {"id": 0, "name": "Software Engineer"},
    {"id": 1, "name": "Data Scientist"},
    ...
  ]
}
```

## Configuration

### Required Models

These pickle files must exist in `../../models/`:

- `clf1.pkl` - KNN Classifier
- `clf2.pkl` - Logistic Regression Classifier
- `tfidf.pkl` - TF-IDF Vectorizer
- `le.pkl` - Label Encoder

### Upload Settings

- **Max file size:** 25MB
- **Allowed formats:** PDF, TXT
- **Storage:** Temporary (uploads/ directory)

### Port

Default: 5000
Override: `PORT=8000 python app.py`

## File Extraction

### PDF Files

- Uses PyPDF2 to extract text from all pages
- Handles multi-page resumes
- Supports most PDF formats

### TXT Files

- Reads file content directly
- Supports UTF-8 and Latin-1 encoding
- Auto-detects encoding if needed

## Integration with Frontend

The Next.js frontend at `resusight-frontend/` sends requests to:

```
http://localhost:5000/api/resume/upload
http://localhost:5000/api/resume/predict
http://localhost:5000/api/resume/categories
```

Configure in `resusight-frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Testing

### Test Health

```bash
curl http://localhost:5000/health
```

### Test with Sample Text

```bash
curl -X POST http://localhost:5000/api/resume/predict \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Software engineer with 5 years experience in Python and JavaScript",
    "model": "both"
  }'
```

### Test File Upload

```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "file=@resume.pdf" \
  -F "model=both"
```

## Error Responses

### Bad Request (400)

```json
{"error": "No file provided"}
{"error": "File type not allowed. Only PDF and TXT files are supported"}
{"error": "No text could be extracted from the file"}
```

### Not Found (404)

```json
{ "error": "Endpoint not found" }
```

### Server Error (500)

```json
{ "error": "Upload failed: [details]" }
```

## Development

### Enable Debug Mode

```bash
export FLASK_ENV=development
python app.py
```

### View Logs

Flask will print logs to console. Errors include:

- Model loading failures
- File processing errors
- Prediction errors

## Performance

| Operation             | Time   |
| --------------------- | ------ |
| Startup (load models) | 5-10s  |
| Small PDF extraction  | 0.5-1s |
| Large PDF extraction  | 2-3s   |
| Text prediction       | <100ms |
| Model comparison      | <150ms |

## Dependencies

### Core

- flask >= 3.0.0
- flask-cors >= 4.0.0
- werkzeug >= 3.1.0

### ML/Data

- scikit-learn >= 1.3.0
- numpy >= 1.24.0
- pandas >= 2.0.0

### File Processing

- PyPDF2 >= 3.0.0

Install all: `pip install -r requirements.txt`

## Troubleshooting

| Problem               | Solution                                            |
| --------------------- | --------------------------------------------------- |
| ModuleNotFoundError   | Run `pip install -r requirements.txt`               |
| Model files not found | Check `../../models/` directory and file paths      |
| PDF extraction fails  | Try different PDF or check PyPDF2 installation      |
| CORS errors           | Verify Flask-CORS is installed and Flask is running |
| Port already in use   | Change PORT or kill process on 5000                 |

## Production Deployment

Use Gunicorn for production:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Deploy to:

- Heroku (add Procfile)
- AWS EC2/Lambda
- Google Cloud
- DigitalOcean
- Any cloud supporting Python

## Future Improvements

- [ ] DOCX file support
- [ ] Async processing for large files
- [ ] Request rate limiting
- [ ] API authentication
- [ ] Result caching
- [ ] Batch uploads
- [ ] Database integration
- [ ] Webhook callbacks
- [ ] Model versioning
- [ ] Metrics/monitoring

## Support

See related documentation:

- `QUICK_START_SETUP.md` - Complete setup guide
- `BACKEND_INTEGRATION.md` - Integration details
- `INTEGRATION_COMPLETED.md` - What was implemented

For more info on the full project, check the main ResuSight documentation.

      "category": "Data Science",
      "confidence": 0.98
    }

}
}

```

### GET /categories
Get all available job categories.

### GET /health
Health check endpoint.

```
