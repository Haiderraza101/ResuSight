import streamlit as st
import io
import base64
import re
import pickle
import matplotlib.pyplot as plt
import os
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from PyPDF2 import PdfReader
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, ConfusionMatrixDisplay,
    top_k_accuracy_score
)


# =========================== CLEANING FUNCTION ===========================
def clean_text(text):
    if pd.isna(text):
        return ""
    clean_txt = str(text)
    clean_txt = re.sub(r'\S+@\S+', ' ', clean_txt)
    clean_txt = re.sub(r'http\S+', ' ', clean_txt)
    replacements = {
        "C++": "CPLUSPLUS", "c++": "CPLUSPLUS",
        "C#": "CSHARP", "c#": "CSHARP",
        ".NET": "DOTNET", ".net": "DOTNET",
        "Node.js": "NODEJS", "node.js": "NODEJS"
    }
    for k, v in replacements.items():
        clean_txt = clean_txt.replace(k, v)
    clean_txt = re.sub(r'[^A-Za-z0-9+\#\./\s]', ' ', clean_txt)
    clean_txt = re.sub(r'\s+', ' ', clean_txt).strip()
    inv = {v: k.lower() for k, v in replacements.items()}
    for k, v in inv.items():
        clean_txt = clean_txt.replace(k, v)
    return clean_txt.lower().strip()



# =========================== STREAMLIT UI ===========================
st.title("CV Parser")

uploaded_file = st.file_uploader("Upload Resume:", type=["txt", "pdf"])

if uploaded_file:
    resume_text = ""

    # ---- Handle TXT Files ----
    if uploaded_file.type == "text/plain":
        try:
            # For TXT, read content directly
            resume_text = uploaded_file.read().decode("utf-8")
        except UnicodeDecodeError:
            resume_text = uploaded_file.read().decode("latin-1")

        st.subheader("Uploaded Resume (Text)")
        st.text_area("File Content", resume_text, height=400)

    # ---- Handle PDF Files (FIXED LOGIC) ----
    elif uploaded_file.type == "application/pdf":
        # 1. Read the file into a bytes buffer, ensuring pointer is reset
        uploaded_file.seek(0)
        pdf_bytes = uploaded_file.read()

        # 2. Extract text using io.BytesIO for robustness with PyPDF2
        try:
            pdf_reader = PdfReader(io.BytesIO(pdf_bytes))
            for page in pdf_reader.pages:
                # Add pages, using empty string if extraction fails
                resume_text += page.extract_text() or ""
        except Exception as e:
            # Display a user-friendly error if PyPDF2 fails
            st.error(f"Error reading PDF contents: {e}")

        # 3. Display PDF in app using the base64 encoded bytes
        st.subheader("Uploaded Resume (PDF Viewer)")
        base64_pdf = base64.b64encode(pdf_bytes).decode("utf-8")
        pdf_display = f"""
        <iframe src="data:application/pdf;base64,{base64_pdf}" width="100%" height="600" type="application/pdf"></iframe>
        """
        st.markdown(pdf_display, unsafe_allow_html=True)

    # ---- Handle Empty or Invalid Extraction ----
    if not resume_text.strip():
        st.warning("No readable text found in the uploaded file.")
    else:
        st.success("File uploaded and processed successfully!")
        with st.expander("View Extracted Text"):
            # Display truncated text for brevity in the expander
            st.text_area("Extracted Text", resume_text[:3000], height=300)

        # ===================== MODEL 1 PREDICTION =====================
        resume_text_cleaned = clean_text(resume_text)
        vectorized_resume = tfidf.transform([resume_text_cleaned])
        prediction_ML_model1 = clf1.predict(vectorized_resume)[0]
        category_mapping = dict(enumerate(le.classes_))
        result_ML_model1 = category_mapping.get(prediction_ML_model1, "Unknown")
        st.success(f"Predicted Job Category by **ML_model1 (SVM)**: {result_ML_model1}")

        # ===================== MODEL 2 PREDICTION =====================
        prediction_ML_model2 = clf2.predict(vectorized_resume)[0]
        result_ML_model2 = category_mapping.get(prediction_ML_model2, "Unknown")
        st.success(f"Predicted Job Category by **ML_model2 (Logistic Regression)**: {result_ML_model2}")

        # ===================== MODEL 3 PREDICTION =====================
        prediction_ML_model3 = clf3.predict(vectorized_resume)[0]
        result_ML_model3 = category_mapping.get(prediction_ML_model3, "Unknown")
        st.success(f"Predicted Job Category by **ML_model3 (Random Forest)**: {result_ML_model3}")

        # ===================== MODEL 4 PREDICTION =====================
        prediction_ML_model4 = clf4.predict(vectorized_resume)[0]
        result_ML_model4 = category_mapping.get(prediction_ML_model4, "Unknown")
        st.success(f"Predicted Job Category by **ML_model4 (XGBoost)**: {result_ML_model4}")


        # ===================== MODEL 1 EVALUATION =====================
        st.subheader("📊 ML_model1 (SVM) Evaluation Metrics")
        y_pred1 = clf1.predict(x_test)
        y_proba1 = clf1.predict_proba(x_test)

        cm = confusion_matrix(y_test, y_pred1)
        fig, ax = plt.subplots(figsize=(10, 8))
        ConfusionMatrixDisplay(cm, display_labels=le.classes_).plot(
            ax=ax, cmap='Blues', xticks_rotation='vertical'
        )
        ax.set_title("Confusion Matrix (ML_model1 - SVM)")
        fig.tight_layout()
        st.pyplot(fig)

        accuracy1 = accuracy_score(y_test, y_pred1)
        precision1 = precision_score(y_test, y_pred1, average='weighted', zero_division=0)
        recall1 = recall_score(y_test, y_pred1, average='weighted', zero_division=0)
        f1_score1 = f1_score(y_test, y_pred1, average='weighted')
        auc1 = roc_auc_score(y_test, y_proba1, multi_class='ovr')
        top3_acc1 = top_k_accuracy_score(y_test, y_proba1, k=3)

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Accuracy", f"{accuracy1:.4f}")
        with col2:
            st.metric("Precision", f"{precision1:.4f}")
        with col3:
            st.metric("Recall", f"{recall1:.4f}")
        
        col4, col5, col6 = st.columns(3)
        with col4:
            st.metric("F1 Score", f"{f1_score1:.4f}")
        with col5:
            st.metric("AUC", f"{auc1:.4f}")
        with col6:
            st.metric("Top-3 Accuracy", f"{top3_acc1:.4f}")

        # ===================== MODEL 2 EVALUATION =====================
        st.subheader("📊 ML_model2 (Logistic Regression) Evaluation Metrics")
        y_pred2 = clf2.predict(x_test)
        y_proba2 = clf2.predict_proba(x_test)

        cm = confusion_matrix(y_test, y_pred2)
        fig, ax = plt.subplots(figsize=(10, 8))
        ConfusionMatrixDisplay(cm, display_labels=le.classes_).plot(
            ax=ax, cmap='Blues', xticks_rotation='vertical'
        )
        ax.set_title("Confusion Matrix (ML_model2 - Logistic Regression)")
        fig.tight_layout()
        st.pyplot(fig)

        accuracy2 = accuracy_score(y_test, y_pred2)
        precision2 = precision_score(y_test, y_pred2, average='weighted', zero_division=0)
        recall2 = recall_score(y_test, y_pred2, average='weighted', zero_division=0)
        f1_score2 = f1_score(y_test, y_pred2, average='weighted')
        auc2 = roc_auc_score(y_test, y_proba2, multi_class='ovr')
        top3_acc2 = top_k_accuracy_score(y_test, y_proba2, k=3)

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Accuracy", f"{accuracy2:.4f}")
        with col2:
            st.metric("Precision", f"{precision2:.4f}")
        with col3:
            st.metric("Recall", f"{recall2:.4f}")
        
        col4, col5, col6 = st.columns(3)
        with col4:
            st.metric("F1 Score", f"{f1_score2:.4f}")
        with col5:
            st.metric("AUC", f"{auc2:.4f}")
        with col6:
            st.metric("Top-3 Accuracy", f"{top3_acc2:.4f}")

        # ===================== MODEL 3 EVALUATION =====================
        st.subheader("📊 ML_model3 (Random Forest) Evaluation Metrics")
        y_pred3 = clf3.predict(x_test)
        y_proba3 = clf3.predict_proba(x_test)

        cm = confusion_matrix(y_test, y_pred3)
        fig, ax = plt.subplots(figsize=(10, 8))
        ConfusionMatrixDisplay(cm, display_labels=le.classes_).plot(
            ax=ax, cmap='Blues', xticks_rotation='vertical'
        )
        ax.set_title("Confusion Matrix (ML_model3 - Random Forest)")
        fig.tight_layout()
        st.pyplot(fig)

        accuracy3 = accuracy_score(y_test, y_pred3)
        precision3 = precision_score(y_test, y_pred3, average='weighted', zero_division=0)
        recall3 = recall_score(y_test, y_pred3, average='weighted', zero_division=0)
        f1_score3 = f1_score(y_test, y_pred3, average='weighted')
        auc3 = roc_auc_score(y_test, y_proba3, multi_class='ovr')
        top3_acc3 = top_k_accuracy_score(y_test, y_proba3, k=3)

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Accuracy", f"{accuracy3:.4f}")
        with col2:
            st.metric("Precision", f"{precision3:.4f}")
        with col3:
            st.metric("Recall", f"{recall3:.4f}")
        
        col4, col5, col6 = st.columns(3)
        with col4:
            st.metric("F1 Score", f"{f1_score3:.4f}")
        with col5:
            st.metric("AUC", f"{auc3:.4f}")
        with col6:
            st.metric("Top-3 Accuracy", f"{top3_acc3:.4f}")

        # ===================== MODEL 4 EVALUATION =====================
        st.subheader("📊 ML_model4 (XGBoost) Evaluation Metrics")
        y_pred4 = clf4.predict(x_test)
        y_proba4 = clf4.predict_proba(x_test)

        cm = confusion_matrix(y_test, y_pred4)
        fig, ax = plt.subplots(figsize=(10, 8))
        ConfusionMatrixDisplay(cm, display_labels=le.classes_).plot(
            ax=ax, cmap='Blues', xticks_rotation='vertical'
        )
        ax.set_title("Confusion Matrix (ML_model4 - XGBoost)")
        fig.tight_layout()
        st.pyplot(fig)

        accuracy4 = accuracy_score(y_test, y_pred4)
        precision4 = precision_score(y_test, y_pred4, average='weighted', zero_division=0)
        recall4 = recall_score(y_test, y_pred4, average='weighted', zero_division=0)
        f1_score4 = f1_score(y_test, y_pred4, average='weighted')
        auc4 = roc_auc_score(y_test, y_proba4, multi_class='ovr')
        top3_acc4 = top_k_accuracy_score(y_test, y_proba4, k=3)

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Accuracy", f"{accuracy4:.4f}")
        with col2:
            st.metric("Precision", f"{precision4:.4f}")
        with col3:
            st.metric("Recall", f"{recall4:.4f}")
        
        col4, col5, col6 = st.columns(3)
        with col4:
            st.metric("F1 Score", f"{f1_score4:.4f}")
        with col5:
            st.metric("AUC", f"{auc4:.4f}")
        with col6:
            st.metric("Top-3 Accuracy", f"{top3_acc4:.4f}")
