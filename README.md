# ResuSight — Resume Analyzer (Next.js + Flask + ML)

Professional README — everything needed to run, test and understand the project.

## Project overview

ResuSight is a resume analysis web app. The user uploads a CV (PDF or TXT) and the system returns job-category predictions computed by two ML models (KNN and Logistic Regression). The frontend is built with Next.js (TypeScript + Tailwind). The backend is a Flask REST API that handles file upload, text extraction and model inference.
Key principles:

- Keep `models/` intact — contains trained model files required at runtime.
- Single source of documentation: this README.

## Quick start (Windows / PowerShell)

Prerequisites

- Python 3.8+ and `pip` (we recommend using `conda` or a virtualenv)
- Node.js 18+ and npm
- Git (optional)

1. Open PowerShell and activate your environment (example using conda):

````powershell
(C:\Users\you\miniconda3\shell\condabin\conda-hook.ps1) ; conda activate resusight
cd "C:\Users\haide\OneDrive - FAST National University\Documents\University\Semester 5\NLP\Project\ResuSight"
2) Install backend Python dependencies and run the Flask API

```powershell
# change to backend folder
cd backend\flask_api
# install dependencies (only needed once or when they change)
pip install -r requirements.txt
# run the Flask app
python app.py
By default the Flask development server will bind to `http://127.0.0.1:5001` (check console — earlier runs showed 5001). Leave this terminal open.

3) Start the frontend (in a new terminal)
```powershell
cd "C:\Users\haide\OneDrive - FAST National University\Documents\University\Semester 5\NLP\Project\ResuSight\resusight-frontend"
npm install         # first time only
npm run dev
````

Open `http://localhost:3000` in your browser.
Notes

- Ensure `resusight-frontend/.env.local` contains the correct API URL (for development):

```text
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## Architecture & data flow (short)

1. User uploads a resume via the Next.js UI.
2. Frontend sends file to Flask endpoint `POST /api/resume/upload`.
3. Flask validates file and extracts text (PDF via PyPDF2 or plain TXT).
4. Extracted text is vectorized and passed to two ML models; predictions + probabilities are returned.
5. Frontend displays both model outputs for comparison.

---

## Backend (Flask) — development

Location: `backend/flask_api`

Important files

- `app.py` — Flask application with API endpoints (`/api/resume/upload`, `/api/resume/predict`, `/api/resume/categories`, `/health`).
- `file_parser.py` — helpers for PDF/TXT extraction.
- `model_loader.py` — model loading and inference (uses files in `models/`).
- `requirements.txt` — Python dependencies for the backend.

Run

```powershell
cd backend\flask_api
pip install -r requirements.txt
python app.py
```

Tip: If you see scikit-learn `InconsistentVersionWarning` (unpickling trained objects built with a different sklearn version), fix by installing the matching sklearn version used when the models were saved (e.g. `pip install scikit-learn==1.7.2`).

---

## Frontend (Next.js) — development

Location: `resusight-frontend`

Run

```powershell
cd resusight-frontend
npm install
npm run dev
```

The frontend expects the backend base URL in `.env.local` as `NEXT_PUBLIC_API_URL`.

---

## Models (IMPORTANT)

- The `models/` directory contains all the trained artifacts (pickles, tokenizer, etc.). Do not modify or remove this folder. The Flask app depends on these files to return predictions.

If you retrain or replace models, keep filenames and the loading logic in `model_loader.py` consistent.

---

## API reference (summary)

- `POST /api/resume/upload` — multipart/form-data file upload. Accepts PDF or TXT (max 25MB). Returns JSON with predictions for both models.
- `POST /api/resume/predict` — JSON body with raw text to predict.
- `GET /api/resume/categories` — returns category list/labels.
- `GET /health` — simple health check.

---

## Troubleshooting & common issues

- `ModuleNotFoundError: No module named 'flask'` — activate your Python environment and run `pip install -r requirements.txt` in `backend/flask_api`.
- `InconsistentVersionWarning` when loading scikit-learn models — install the model-compatible scikit-learn version: `pip install scikit-learn==1.7.2` (or the version models were trained with).
- `Failed to fetch` in frontend console — confirm Flask server is running and `NEXT_PUBLIC_API_URL` is correct and that CORS is enabled.

---

## Project layout (top-level)

```
ResuSight/
├─ backend/
│  └─ flask_api/          # Flask backend + requirements.txt
├─ resusight-frontend/    # Next.js frontend (TypeScript + Tailwind)
├─ models/                # Trained model artifacts (DO NOT CHANGE)
├─ results/               # training results / reports
├─ transformer_model/     # optional transformer artifacts
├─ README.md              # <-- this file (single canonical readme)
├─ LICENSE
└─ .gitignore
```

---

## License

See `LICENSE` at repo root.

---

## Contact / support

If you need help, open an issue in the repository or contact the maintainer.

---

Thank you — the project is now consolidated: a single authoritative `README.md` at the root contains all necessary details.

# ResuSight

Intelligent Resume Screening and Job Matching System using LLMs and RAG

## Overview

ResuSight is a full-stack application that uses machine learning models to classify resumes into job categories. The system consists of:

- **2 ML Models**: KNN and Logistic Regression classifiers
- **Flask API**: Python backend serving ML models
- **Express.js API**: Node.js backend handling file uploads and routing
- **React Frontend**: Modern UI for resume upload and prediction display

## Features

- ✅ Resume upload (PDF/TXT support)
- ✅ Text extraction from PDF files
- ✅ Dual model prediction (KNN + Logistic Regression)
- ✅ Confidence scores and probability distributions
- ✅ Model comparison view
- ✅ Responsive, modern UI

## Quick Start

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Quick Setup

1. **Start Flask API** (Terminal 1):

```bash
cd backend/flask_api
pip install -r requirements.txt
python app.py
```

2. **Start Express.js** (Terminal 2):

```bash
cd backend
npm install
npm run dev
```

3. **Start React Frontend** (Terminal 3):

```bash
cd frontend
npm install
npm start
```

4. Open `http://localhost:3000` in your browser

## Project Structure

```
ResuSight/
├── models/                 # Trained ML models
│   ├── clf1.pkl            # KNN model
│   ├── clf2.pkl            # Logistic Regression model
│   ├── tfidf.pkl           # TF-IDF vectorizer
│   └── le.pkl              # Label encoder
├── backend/
│   ├── flask_api/           # Flask API wrapper
│   │   ├── app.py          # Flask application
│   │   ├── model_loader.py # Model loading logic
│   │   └── requirements.txt
│   ├── src/                # Express.js backend
│   │   ├── server.ts       # Express server
│   │   ├── routes/         # API routes
│   │   └── services/       # Service layer
│   └── rag/                # RAG implementation (future)
└── frontend/               # React frontend
    └── src/
        ├── components/     # React components
        └── services/       # API client
```

## Technology Stack

- **Backend (Python)**: Flask, scikit-learn, pandas, numpy
- **Backend (Node.js)**: Express.js, TypeScript, multer, pdf-parse
- **Frontend**: React, TypeScript, CSS3
- **ML Models**: scikit-learn (KNN, Logistic Regression)

## API Documentation

### Express.js Endpoints

- `POST /api/resume/upload` - Upload resume file
- `POST /api/resume/predict` - Predict from text
- `GET /api/resume/categories` - Get all categories

### Flask API Endpoints

- `POST /predict` - Predict job category
- `GET /categories` - Get categories
- `GET /health` - Health check

## Future Enhancements

- [ ] Add 2 Deep Learning models (LSTM, CNN)
- [ ] Add 1 Transformer model (BERT/DistilBERT)
- [ ] Training/validation graphs
- [ ] Enhanced evaluation metrics (EM, Top-k)
- [ ] RAG implementation with 100 QA pairs
- [ ] RAG vs non-RAG comparison

## License

ISC
