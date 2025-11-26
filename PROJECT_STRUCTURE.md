# ResuSight - Clean Project Structure

## Fixed Issues

✅ **Flask API Error Fixed**: Changed from "ekklen" to "sklearn" - the actual error is `ModuleNotFoundError: No module named 'sklearn'`

✅ **Cleaned Up Project**: Removed unnecessary files and empty directories

## Installation Instructions

### Flask API Dependencies

The error occurs because `scikit-learn` is not installed. Install it using one of these methods:

**Option 1: Using conda (Recommended)**
```bash
conda install scikit-learn numpy pandas
```

**Option 2: Using pip**
```bash
pip install scikit-learn numpy pandas
```

**Option 3: If you have SSL issues**
```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org scikit-learn numpy pandas
```

### Verify Installation
```bash
python -c "import sklearn; print('OK')"
```

## Project Structure (Cleaned)

```
ResuSight/
├── models/                    # ML model files
│   ├── clf1.pkl
│   ├── clf2.pkl
│   ├── tfidf.pkl
│   ├── le.pkl
│   └── ML_models.ipynb
│
├── backend/
│   ├── flask_api/            # Flask API
│   │   ├── app.py
│   │   ├── model_loader.py
│   │   ├── requirements.txt
│   │   └── SETUP.md
│   │
│   └── src/                 # Express.js backend
│       ├── server.ts
│       ├── routes/
│       │   ├── nlpRoutes.ts
│       │   └── resumeRoutes.ts
│       └── services/
│           └── flaskService.ts
│
└── frontend/                # React frontend
    └── src/
        ├── App.tsx
        ├── components/
        └── services/
```

## Running the Application

1. **Flask API**: `cd backend/flask_api && python app.py`
2. **Express.js**: `cd backend && npm run dev`
3. **React**: `cd frontend && npm start`

## Removed Files

- Compiled .js files (auto-generated from .ts)
- Empty directories (app/, models/, parsers/, embeddings/)
- Duplicate documentation files
- Startup scripts (replaced with simple instructions)

