# ResuSight System Architecture Diagram

## System Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                     RESUSIGHT APPLICATION                             │
│                                                                        │
│                      Next.js Frontend                                  │
│                    (localhost:3000)                                   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                    Landing Page                             │    │
│  │  ┌────────────────────────────────────────────────────┐    │    │
│  │  │ HeroSection: Welcome & Title                       │    │    │
│  │  ├────────────────────────────────────────────────────┤    │    │
│  │  │ FeaturesSection: Speed, Accuracy, etc.            │    │    │
│  │  ├────────────────────────────────────────────────────┤    │    │
│  │  │ BenefitsSection: Business benefits               │    │    │
│  │  ├────────────────────────────────────────────────────┤    │    │
│  │  │ ResumeUpload: Drag & drop file upload             │    │    │
│  │  │  - Validates file type (PDF/TXT)                 │    │    │
│  │  │  - Sends to Flask backend                        │    │    │
│  │  ├────────────────────────────────────────────────────┤    │    │
│  │  │ ModelResults: Display predictions                │    │    │
│  │  │  - Shows KNN result with confidence              │    │    │
│  │  │  - Shows Logistic Regression result              │    │    │
│  │  │  - Probability distributions                     │    │    │
│  │  │  - Agreement/disagreement status                 │    │    │
│  │  ├────────────────────────────────────────────────────┤    │    │
│  │  │ TrustedBySection: Testimonials                    │    │    │
│  │  ├────────────────────────────────────────────────────┤    │    │
│  │  │ Footer: Links & social media                     │    │    │
│  │  └────────────────────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                             ↓                                        │
│                  POST /api/resume/upload                             │
│           (File: resume.pdf, Model: 'both')                         │
│                                                                      │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               │ REST API (JSON)
               │
               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     FLASK BACKEND API                                  │
│                    (localhost:5000)                                   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                   Request Handler                           │    │
│  │  1. Validate file type (PDF or TXT)                         │    │
│  │  2. Validate file size (max 25MB)                           │    │
│  └────────────────┬─────────────────────────────────────────────┘    │
│                   ▼                                                   │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │               File Processing                               │    │
│  │                                                             │    │
│  │  PDF File ──┐                                              │    │
│  │             ├─→ extract_text_from_file()                  │    │
│  │  TXT File ──┘                                              │    │
│  │                   ↓                                        │    │
│  │           Raw Text Content                                │    │
│  │                   ↓                                        │    │
│  │  ┌──────────────────────────────────────────────┐        │    │
│  │  │ Text Cleaning & Preprocessing                │        │    │
│  │  │ - Remove URLs                                │        │    │
│  │  │ - Remove special characters                 │        │    │
│  │  │ - Lowercase                                 │        │    │
│  │  │ - Remove extra whitespace                   │        │    │
│  │  └────────────┬───────────────────────────────┘        │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                   │                                                  │
│                   ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │            Text Vectorization                               │    │
│  │  - TF-IDF Transformation                                    │    │
│  │  - Converts text to numerical features                      │    │
│  │  - Uses pre-trained vectorizer (tfidf.pkl)                │    │
│  └────────────┬───────────────────────────────────────────────┘    │
│               │                                                      │
└───────────────┼──────────────────────────────────────────────────────┘
                │
                │ Feature Vector
                │
        ┌───────┴──────────┐
        │                  │
        ▼                  ▼
    ┌────────────┐    ┌──────────────────┐
    │ KNN        │    │ Logistic         │
    │ Classifier │    │ Regression       │
    │ (clf1)     │    │ (clf2)           │
    │            │    │                  │
    │ Returns:   │    │ Returns:         │
    │ - Category │    │ - Category       │
    │ - Prob. %  │    │ - Prob. %        │
    │ - Top 5    │    │ - Top 5          │
    │   classes  │    │   classes        │
    └─────┬──────┘    └────────┬─────────┘
          │                    │
          └────────┬───────────┘
                   │
                   ▼
        ┌────────────────────────┐
        │  JSON Response         │
        │  {                     │
        │    "success": true,    │
        │    "predictions": {    │
        │      "model1": {...},  │
        │      "model2": {...}   │
        │    }                   │
        │  }                     │
        └────────────┬───────────┘
                     │
                     │ REST API Response
                     │
                     ▼
        ┌────────────────────────┐
        │  Frontend receives     │
        │  and displays results  │
        └────────────────────────┘
```

## Data Flow Sequence

```
User
  │
  ├─ 1. Visits http://localhost:3000
  │       └─→ Sees landing page with upload form
  │
  ├─ 2. Selects resume file (PDF or TXT)
  │       └─→ File appears in upload area
  │
  ├─ 3. Clicks "Analyze Resume"
  │       └─→ Frontend validates file
  │           └─→ Sends file to Flask backend
  │
  └─ 4. Flask Backend receives request
        ├─ Extracts text from file
        ├─ Cleans and vectorizes text
        ├─ Passes to both ML models
        ├─ Returns predictions
        │
        └─ Frontend displays results
            ├─ Shows KNN prediction
            ├─ Shows Logistic Regression prediction
            ├─ Shows confidence scores
            ├─ Shows probability distribution
            ├─ Shows if models agree/disagree
            │
            └─ User sees insights about resume
```

## Component Interaction

```
┌─────────────────────────────────────────┐
│      Next.js Frontend (page.tsx)        │
│                                        │
│  useState(predictions, extractedText)   │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ <HeroSection />                │   │
│  │ <FeaturesSection />            │   │
│  │ <BenefitsSection />            │   │
│  │ <ResumeUpload                  │   │
│  │   onPredictionComplete={...}   │   │
│  │ />                             │   │
│  │ <ModelResults                  │   │
│  │   predictions={predictions}    │   │
│  │ />                             │   │
│  │ <TrustedBySection />           │   │
│  │ <Footer />                     │   │
│  └────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         │ onPredictionComplete()
         │ └─ Updates state
         │
         ▼
┌─────────────────────────────────────────┐
│   Services/api.ts (ApiService)          │
│                                        │
│  uploadResume(file, model)              │
│  └─ POST /api/resume/upload             │
│                                        │
│  predictFromText(text, model)           │
│  └─ POST /api/resume/predict            │
│                                        │
│  getCategories()                        │
│  └─ GET /api/resume/categories          │
└─────────────────────────────────────────┘
         │
         │ HTTP Request (JSON)
         │
         ▼
┌─────────────────────────────────────────┐
│   Flask Backend (app.py)                │
│                                        │
│  @app.route('/api/resume/upload')      │
│  def upload_resume():                   │
│   ├─ Validate file                     │
│   ├─ Extract text                      │
│   ├─ Get predictions                   │
│   └─ Return JSON                       │
│                                        │
│  @app.route('/api/resume/predict')     │
│  def predict():                         │
│   ├─ Get text from request              │
│   ├─ Get predictions                   │
│   └─ Return JSON                       │
└─────────────────────────────────────────┘
         │
         │
         ├──→ model_loader.py
         │    └─ predict(text, model)
         │       ├─ Vectorize text (tfidf)
         │       ├─ Pass to KNN (clf1)
         │       ├─ Pass to LogReg (clf2)
         │       └─ Return predictions
         │
         └──→ file_parser.py
              └─ extract_text_from_file()
                 ├─ If PDF: PyPDF2
                 └─ If TXT: read file
```

## File Upload Process

```
┌─────────────────────────────┐
│  User selects file          │
│  (resume.pdf)               │
└──────────┬──────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Frontend (ResumeUpload.tsx)             │
│  - Validates file type                  │
│  - Displays file info                   │
│  - Shows upload button                  │
└──────────┬───────────────────────────────┘
           │
           ▼
    ┌──────────────────┐
    │ User clicks      │
    │ "Analyze Resume" │
    └──────────┬───────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ ApiService.uploadResume(...)  │
    │ - Creates FormData            │
    │ - Appends file                │
    │ - Appends model selection     │
    │ - Sends POST request          │
    └──────────┬────────────────────┘
               │
               │ Content-Type: multipart/form-data
               │
               ▼
    ┌──────────────────────────────────────────┐
    │  Flask Backend (/api/resume/upload)      │
    │                                          │
    │  1. Check file in request ✓              │
    │  2. Validate extension (pdf/txt) ✓       │
    │  3. Validate file size (< 25MB) ✓        │
    │  4. Extract text                         │
    │     │                                    │
    │     ├─ If .pdf: PyPDF2.PdfReader()      │
    │     │   ├─ Read all pages               │
    │     │   └─ Extract text                 │
    │     │                                   │
    │     └─ If .txt: file.read()             │
    │         └─ Decode (UTF-8 or Latin-1)   │
    │                                        │
    │  5. Process text:                       │
    │     ├─ Clean (remove URLs, etc.)       │
    │     ├─ Lowercase                       │
    │     └─ Vectorize (TF-IDF)              │
    │                                        │
    │  6. Get predictions:                    │
    │     ├─ KNN prediction (clf1)           │
    │     └─ LogReg prediction (clf2)        │
    │                                        │
    │  7. Build JSON response                 │
    └──────────┬───────────────────────────────┘
               │
               │ Content-Type: application/json
               │ Status: 200 OK
               │
               ▼
    ┌────────────────────────────────────┐
    │  JSON Response                     │
    │  {                                 │
    │    "success": true,               │
    │    "filename": "resume.pdf",      │
    │    "fileSize": 102400,            │
    │    "predictions": {               │
    │      "model1": {                  │
    │        "category": "Software...", │
    │        "confidence": 0.95,        │
    │        "probabilities": {...}    │
    │      },                           │
    │      "model2": {...}              │
    │    }                              │
    │  }                                │
    └──────────┬─────────────────────────┘
               │
               ▼
    ┌────────────────────────────┐
    │  Frontend receives         │
    │  - Updates state           │
    │  - Re-renders page         │
    │  - Shows ModelResults      │
    │  - Displays predictions    │
    └────────────────────────────┘
```

## Model Prediction Flow

```
┌─────────────────────────────────┐
│  Vectorized Text                │
│  (TF-IDF features)              │
└──────────┬──────────────────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
   ┌────────┐ ┌──────────────────┐
   │ KNN    │ │ Logistic         │
   │ (clf1) │ │ Regression (clf2)│
   └───┬────┘ └────────┬─────────┘
       │                │
       ├─ Find k        ├─ Calculate
       │  nearest       │  probability
       │  neighbors     │  for each
       │                │  class
       ├─ Get their     │
       │  labels        ├─ Return highest
       │                │  probability
       ├─ Return        │  class + score
       │  majority      │
       │  class         └─ Return
       │                  predictions
       └─ Get proba if
          available

       │                │
       └────┬───────────┘
            │
            ▼
     ┌────────────────────────┐
     │ Combine Results        │
     │ {                      │
     │   "model1": {          │
     │     "category": "...", │
     │     "confidence": 0.X, │
     │     "probabilities":{} │
     │   },                   │
     │   "model2": {...}      │
     │ }                      │
     └────────────────────────┘
            │
            ▼
     ┌────────────────────┐
     │ Return to Frontend │
     └────────────────────┘
```

---

**This architecture ensures:**

- ✅ Clean separation of concerns
- ✅ Scalable backend
- ✅ Responsive frontend
- ✅ Reliable predictions
- ✅ Easy to maintain and extend
