# ResuSight Setup Guide

## Project Structure

```
ResuSight/
├── models/              # Trained ML models (clf1.pkl, clf2.pkl, etc.)
├── backend/
│   ├── flask_api/       # Flask API wrapper for Python models
│   ├── src/             # Express.js backend
│   └── rag/             # RAG implementation (future)
└── frontend/            # React frontend
```

## Prerequisites

- Python 3.8+ with pip
- Node.js 16+ and npm
- Trained model files in `models/` directory:
  - `clf1.pkl`
  - `clf2.pkl`
  - `tfidf.pkl`
  - `le.pkl`
  - `x_test.pkl` (optional, for evaluation)
  - `y_test.pkl` (optional, for evaluation)

## Setup Instructions

### 1. Flask API Setup (Python Backend)

```bash
# Navigate to Flask API directory
cd backend/flask_api

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Express.js Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build
```

### 3. React Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Step 1: Start Flask API

```bash
# From backend/flask_api directory
python app.py
```

Flask API will run on `http://localhost:5001`

### Step 2: Start Express.js Server

```bash
# From backend directory
npm run dev
# OR
npm start
```

Express server will run on `http://localhost:5000`

### Step 3: Start React Frontend

```bash
# From frontend directory
npm start
```

React app will run on `http://localhost:3000`

## API Endpoints

### Flask API (Port 5001)
- `GET /health` - Health check
- `POST /predict` - Predict from text
- `POST /predict/file` - Predict from file text
- `GET /categories` - Get all job categories

### Express API (Port 5000)
- `GET /health` - Health check
- `POST /api/resume/upload` - Upload resume file (PDF/TXT)
- `POST /api/resume/predict` - Predict from text
- `GET /api/resume/categories` - Get all categories

## Usage

1. Open `http://localhost:3000` in your browser
2. Click "Choose PDF or TXT file" and select your resume
3. Click "Upload & Analyze"
4. View predictions from both models (KNN and Logistic Regression)

## Troubleshooting

### Flask API Issues
- Ensure model files exist in `models/` directory
- Check that Python dependencies are installed
- Verify the path to models directory in `model_loader.py`

### Express.js Issues
- Ensure Flask API is running on port 5001
- Check that all npm dependencies are installed
- Verify TypeScript compilation succeeded

### Frontend Issues
- Ensure Express.js server is running on port 5000
- Check browser console for errors
- Verify API_BASE_URL in `frontend/src/services/api.ts`

## Environment Variables

### Flask API
- `PORT` - Flask API port (default: 5001)

### Express.js
- `FLASK_API_URL` - Flask API URL (default: http://localhost:5001)

### React
- `REACT_APP_API_URL` - Express API URL (default: http://localhost:5000/api)

## Next Steps

- Add Deep Learning models (LSTM, CNN)
- Add Transformer model (BERT)
- Implement RAG system
- Add evaluation metrics visualization
- Add training/validation graphs

