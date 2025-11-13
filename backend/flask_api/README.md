# Flask API for ResuSight

This Flask API serves as a wrapper for the Python ML models, allowing the Express.js backend to make predictions.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure model files are in the `../../models/` directory:
   - clf1.pkl
   - clf2.pkl
   - tfidf.pkl
   - le.pkl

## Running

```bash
python app.py
```

The API will start on `http://localhost:5001`

## API Endpoints

### POST /predict
Predict job category from resume text.

**Request:**
```json
{
  "text": "resume text here",
  "model": "both"  // or "clf1" or "clf2"
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "model1": {
      "prediction": 15,
      "category": "Data Science",
      "confidence": 0.95
    },
    "model2": {
      "prediction": 15,
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

