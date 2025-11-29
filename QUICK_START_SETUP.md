# ResuSight - Complete Setup & Start Guide

## System Architecture

```
┌─────────────────────┐
│   Next.js Frontend  │  (http://localhost:3000)
│  resusight-frontend │
└──────────┬──────────┘
           │ (POST /api/resume/upload)
           │ (sends PDF/TXT file)
           ▼
┌─────────────────────┐
│   Flask Backend     │  (http://localhost:5000)
│  backend/flask_api  │
└──────────┬──────────┘
           │ (extracts text, vectorizes)
           ▼
┌─────────────────────┐
│   ML Models         │
│   models/           │
│ - KNN (clf1.pkl)    │
│ - LogisticReg(clf2) │
└─────────────────────┘
```

## Quick Start (Windows)

### 1. Install Python Dependencies (Flask Backend)

```bash
cd backend\flask_api
pip install -r requirements.txt
```

**Key packages that will be installed:**

- Flask (API framework)
- Flask-CORS (cross-origin requests)
- PyPDF2 (PDF text extraction)
- scikit-learn (ML models)
- numpy, pandas, scipy (data processing)

### 2. Start Flask Backend

**Option A: Using batch script**

```bash
start-backend.bat
```

**Option B: Manual start**

```bash
cd backend\flask_api
python app.py
```

✅ Flask API will start on `http://localhost:5000`

### 3. Start Next.js Frontend (New Terminal)

```bash
cd resusight-frontend
npm run dev
```

✅ Frontend will start on `http://localhost:3000`

### 4. Open Browser

Navigate to: `http://localhost:3000`

## Complete Feature Flow

### User Uploads Resume

1. **In Next.js App:**

   - Click "Upload Your Resume" section
   - Drag & drop a PDF or TXT file OR click "browse files"
   - File size is validated
   - Click "Analyze Resume" button

2. **File is Sent to Flask:**

   - Frontend sends file to: `POST /api/resume/upload`
   - Includes file (PDF/TXT) and model selection

3. **Flask Backend Processes:**

   - Validates file type and size
   - **Extracts text:**
     - PDF: Reads all pages using PyPDF2
     - TXT: Reads file content
   - Cleans text (removes URLs, special chars, etc.)
   - Vectorizes using pre-trained TF-IDF model
   - Passes to both ML models

4. **Models Make Predictions:**

   - **Model 1 (KNN Classifier):**
     - Predicts job category
     - Returns confidence score
     - Provides probability distribution
   - **Model 2 (Logistic Regression):**
     - Predicts job category
     - Returns confidence score
     - Provides probability distribution

5. **Results Displayed in Frontend:**
   - Shows both model predictions
   - Displays confidence percentages
   - Shows top 5 category probabilities for each model
   - Indicates if models agree/disagree
   - Color-coded confidence bars

## API Endpoints Reference

### 1. Upload & Analyze Resume

```
POST /api/resume/upload
Content-Type: multipart/form-data

Parameters:
- file: (File) PDF or TXT resume
- model: (string) 'clf1' | 'clf2' | 'both' (default: 'both')

Returns:
{
  "success": true,
  "filename": "resume.pdf",
  "fileSize": 102400,
  "extractedTextLength": 5000,
  "predictions": {
    "model1": {
      "category": "Software Engineer",
      "confidence": 0.95,
      "probabilities": {...}
    },
    "model2": {
      "category": "Software Engineer",
      "confidence": 0.92,
      "probabilities": {...}
    }
  }
}
```

### 2. Predict from Text

```
POST /api/resume/predict
Content-Type: application/json

Body:
{
  "text": "Resume content text...",
  "model": "both"
}

Returns: Same as upload endpoint
```

### 3. Get Job Categories

```
GET /api/resume/categories

Returns:
{
  "success": true,
  "categories": [
    {"id": 0, "name": "Software Engineer"},
    {"id": 1, "name": "Data Scientist"},
    ...
  ]
}
```

### 4. Health Check

```
GET /health

Returns:
{
  "status": "healthy",
  "message": "Flask API is running"
}
```

## Frontend Components

All components are in `resusight-frontend/src/components/`:

1. **HeroSection.tsx** - Main landing section with title & CTAs
2. **FeaturesSection.tsx** - Feature highlights (Speed, Accuracy, Multilingual, AI)
3. **BenefitsSection.tsx** - Business benefits cards
4. **ResumeUpload.tsx** - Drag-drop file upload with validation
5. **ModelResults.tsx** - Displays predictions from both models
6. **TrustedBySection.tsx** - Customer testimonials
7. **Footer.tsx** - Footer with links

## Configuration Files

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Flask (app.py settings)

```python
PORT = 5000
ALLOWED_EXTENSIONS = {'pdf', 'txt'}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB
```

## Project File Structure

```
ResuSight/
├── resusight-frontend/           # Next.js Frontend
│   ├── src/
│   │   ├── app/page.tsx          # Main page with all components
│   │   ├── components/           # UI components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── ResumeUpload.tsx
│   │   │   ├── ModelResults.tsx
│   │   │   ├── TrustedBySection.tsx
│   │   │   └── Footer.tsx
│   │   └── services/
│   │       └── api.ts            # API client service
│   ├── .env.local                # API URL configuration
│   └── package.json
│
├── backend/flask_api/            # Flask Backend
│   ├── app.py                    # Main Flask application
│   ├── model_loader.py           # ML model loader
│   ├── file_parser.py            # PDF/TXT text extraction
│   ├── requirements.txt          # Python dependencies
│   └── uploads/                  # Temp file storage (auto-created)
│
├── models/                       # ML Models (outside workspace)
│   ├── clf1.pkl                  # KNN Classifier
│   ├── clf2.pkl                  # Logistic Regression
│   ├── tfidf.pkl                 # TF-IDF Vectorizer
│   └── le.pkl                    # Label Encoder
│
└── BACKEND_INTEGRATION.md        # Detailed integration guide
```

## Troubleshooting

### Problem: "API is not available"

**Solution:**

1. Check Flask is running: `python app.py` in `backend/flask_api`
2. Verify URL in `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. Check no firewall blocking localhost:5000

### Problem: "Cannot find module PyPDF2"

**Solution:**

```bash
pip install PyPDF2
```

### Problem: "Model files not found"

**Solution:**

1. Verify pickle files exist in `models/` directory:
   - clf1.pkl
   - clf2.pkl
   - tfidf.pkl
   - le.pkl
2. Check file path in `model_loader.py`

### Problem: "Failed to extract text from PDF"

**Solution:**

1. Ensure PyPDF2 is installed
2. Try with a different PDF (some are image-based)
3. Check PDF is not corrupted

### Problem: CORS Error in Console

**Solution:**

1. Verify Flask-CORS is installed: `pip install flask-cors`
2. Check no trailing slash in API URL

### Problem: Frontend won't load

**Solution:**

1. Ensure Node.js is installed: `node --version`
2. Install dependencies: `npm install` in `resusight-frontend`
3. Check port 3000 is not in use

## Performance Tips

- **Large PDFs:** May take 2-3 seconds to extract text
- **Model Inference:** Typically < 100ms per prediction
- **Network:** Ensure stable connection between frontend and backend
- **File Size:** Supported up to 25MB

## Next Steps

After successful setup:

1. Upload a test resume (PDF or TXT)
2. View predictions from both models
3. Check confidence scores and probability distributions
4. Note which model performs better for your data
5. Consider which model to use in production

## Support & Documentation

See `BACKEND_INTEGRATION.md` for:

- Detailed API endpoint documentation
- Environment variable setup
- File upload limitations
- Model training details
- Future improvement ideas
