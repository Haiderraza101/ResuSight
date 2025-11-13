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
