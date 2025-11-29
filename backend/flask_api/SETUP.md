# Flask API Setup

## Quick Fix for "sklearn not found" Error

The error you're seeing is: `ModuleNotFoundError: No module named 'sklearn'`

### Solution 1: Install using conda (Recommended)
```bash
conda install scikit-learn numpy pandas
```

### Solution 2: Install using pip with trusted hosts
```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org scikit-learn numpy pandas
```

### Solution 3: Use pre-built wheels
```bash
pip install scikit-learn==1.3.2 --only-binary :all:
```

## Verify Installation

```bash
python -c "import sklearn; print('sklearn OK')"
python -c "import numpy; print('numpy OK')"
python -c "import pandas; print('pandas OK')"
```

## Run Flask API

```bash
cd backend/flask_api
python app.py
```

The API will start on `http://localhost:5001`

## Troubleshooting

If you still get errors:
1. Make sure you're using the same Python environment where you trained the models
2. Check if models exist in `../../models/` directory
3. Verify all .pkl files are present: clf1.pkl, clf2.pkl, tfidf.pkl, le.pkl

