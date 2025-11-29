# ResuSight Backend Integration Guide

## Architecture

```
Next.js Frontend (resusight-frontend)
    ↓ (sends file via /api/resume/upload)
Flask Backend (backend/flask_api)
    ↓ (extracts text & passes to models)
ML Models (models/)
    ↓ (returns predictions)
Next.js Frontend (displays results)
```

## Backend Setup (Flask)

### 1. Install Dependencies

```bash
cd backend/flask_api
pip install -r requirements.txt
```

Make sure the following packages are installed:

- Flask (3.0.0+)
- Flask-CORS (4.0.0+)
- PyPDF2 (3.0.0+) - for PDF text extraction
- scikit-learn, numpy, pandas - for ML models

### 2. Prepare ML Models

Ensure these pickle files exist in the `models/` directory:

- `clf1.pkl` - KNN classifier
- `clf2.pkl` - Logistic Regression classifier
- `tfidf.pkl` - TF-IDF vectorizer
- `le.pkl` - Label encoder for categories

### 3. Run Flask API

```bash
python app.py
```

The API will start on `http://localhost:5000` by default.

## Frontend Setup (Next.js)

### 1. Install Dependencies

```bash
cd resusight-frontend
npm install
```

### 2. Configure API URL

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Next.js Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Upload Resume (File)

**POST** `/api/resume/upload`

**Request:**

- Method: `POST`
- Content-Type: `multipart/form-data`
- Fields:
  - `file` (File) - PDF or TXT resume file
  - `model` (string, optional) - 'clf1', 'clf2', or 'both' (default: 'both')

**Response:**

```json
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
      "probabilities": {
        "Software Engineer": 0.95,
        "Data Scientist": 0.04,
        "...": 0.01
      }
    },
    "model2": {
      "prediction": 2,
      "category": "Software Engineer",
      "confidence": 0.92,
      "probabilities": {...}
    }
  }
}
```

### Predict from Text

**POST** `/api/resume/predict`

**Request:**

```json
{
  "text": "Resume text content...",
  "model": "both"
}
```

**Response:** Same as upload endpoint

### Get Categories

**GET** `/api/resume/categories`

**Response:**

```json
{
  "success": true,
  "categories": [
    {"id": 0, "name": "Software Engineer"},
    {"id": 1, "name": "Data Scientist"},
    ...
  ]
}
```

### Health Check

**GET** `/health`

**Response:**

```json
{
  "status": "healthy",
  "message": "Flask API is running"
}
```

## File Upload Limitations

- **Supported Formats:** PDF, TXT
- **Max File Size:** 25MB
- **Text Extraction:**
  - PDF: Uses PyPDF2 to extract text from all pages
  - TXT: Reads file content (supports UTF-8 and Latin-1 encoding)

## Complete Flow

1. **User uploads resume in Next.js frontend**

   - Drag & drop or click to browse
   - Select PDF or TXT file
   - File size is validated on frontend

2. **Frontend sends file to Flask API**

   - `POST /api/resume/upload`
   - Includes model selection ('both' by default)

3. **Flask backend processes file**

   - Validates file type and size
   - Extracts text from file (PDF or TXT)
   - Cleans and vectorizes text using TF-IDF
   - Passes to both ML models

4. **Models return predictions**

   - KNN classifier (clf1) provides:
     - Predicted job category
     - Confidence score
     - Probability distribution across categories
   - Logistic Regression (clf2) provides same info

5. **Results displayed in frontend**
   - Shows predictions from both models
   - Displays confidence scores
   - Shows probability distribution for each category
   - Indicates if models agree or disagree
   - User can see detailed analysis

## Troubleshooting

### "API is not available" Error

- Check if Flask server is running: `python app.py`
- Verify API URL in `.env.local` matches Flask port
- Check for CORS issues in browser console

### "Failed to extract text from file" Error

- Ensure PyPDF2 is installed: `pip install PyPDF2`
- Try with a different PDF (some PDFs are image-based and cannot be extracted)
- For TXT files, ensure proper encoding (UTF-8 or Latin-1)

### Model Loading Error

- Verify all `.pkl` files exist in `models/` directory
- Check file paths in `model_loader.py`
- Ensure models directory path is correct relative to `app.py`

### CORS Issues

- Flask-CORS is already enabled in `app.py`
- Check that `NEXT_PUBLIC_API_URL` doesn't have trailing slash

## Environment Variables

### Next.js (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Flask (system environment)

```
PORT=5000        # Optional, default is 5000
FLASK_ENV=development
FLASK_DEBUG=True
```

## Performance Notes

- File uploads up to 25MB are supported
- Text extraction from large PDFs may take a few seconds
- Model inference is typically < 100ms per prediction
- Both models run in parallel for better UX (showing both results)

## Future Improvements

- Add support for more file formats (DOCX, etc.)
- Implement async processing for large files
- Add caching for repeated predictions
- Implement user authentication
- Add result history/storage
- Deploy Flask API to cloud service (Heroku, AWS, etc.)
