# Quick Start Guide

## Fix Flask API Error

The error you're seeing is: **"No module named 'sklearn'"** (not "ekklen")

### Install scikit-learn:

```bash
# Option 1: Using pip
pip install scikit-learn numpy pandas

# Option 2: If you have conda
conda install scikit-learn numpy pandas

# Option 3: If SSL errors occur
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org scikit-learn numpy pandas
```

### Verify:
```bash
python -c "import sklearn; print('OK')"
```

## Run All Services

### Terminal 1: Flask API
```bash
cd backend/flask_api
python app.py
```
Runs on: http://localhost:5001

### Terminal 2: Express.js
```bash
cd backend
npm install
npm run dev
```
Runs on: http://localhost:5000

### Terminal 3: React
```bash
cd frontend
npm install
npm start
```
Runs on: http://localhost:3000

## Project Cleaned

✅ Removed compiled .js files
✅ Removed empty directories
✅ Removed duplicate documentation
✅ Fixed import paths
✅ Simplified requirements.txt

