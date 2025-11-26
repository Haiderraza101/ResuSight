import React, { useState, useRef } from 'react';
import ApiService, { UploadResponse, PredictionResult } from '../services/api';
import './ResumeUpload.css';

interface ResumeUploadProps {
  onPredictionComplete: (results: PredictionResult, text?: string) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onPredictionComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
      setFile(selectedFile);
      setError(null);
      setUploadResponse(null);
    } else {
      setError('Please upload a PDF or TXT file');
      setFile(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await ApiService.uploadResume(file, 'both');
      setUploadResponse(response);
      onPredictionComplete(response.predictions);
    } catch (err: any) {
      setError(err.message || 'Failed to upload and process resume');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const uploadAreaClass = `upload-area ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`;

  return (
    <div className="resume-upload">
      <div className="resume-upload-header">
        <h3 className="resume-upload-title">Upload Your Resume</h3>
        <p className="resume-upload-subtitle">Get instant AI-powered analysis and job category matching</p>
      </div>

      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={uploadAreaClass}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="resume-upload"
          accept=".pdf,.txt"
          onChange={handleInputChange}
          disabled={uploading}
          className="upload-input"
        />
        
        <div className="upload-content">
          <div className="upload-icon-wrapper">
            <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          {file ? (
            <div>
              <p className="upload-file-name">{file.name}</p>
              <p className="upload-file-info">
                {(file.size / 1024).toFixed(2)} KB • {file.type === 'application/pdf' ? 'PDF' : 'Text'}
              </p>
            </div>
          ) : (
            <div>
              <p className="upload-text">
                Drag and drop your resume here
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0' }}>or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="upload-browse"
              >
                browse files
              </button>
              <p className="upload-hint">Supports PDF and TXT files</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="upload-button"
      >
        {uploading ? (
          <span className="upload-button-loading">
            <svg className="spinner" style={{ width: '1.25rem', height: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Analyze Resume'
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <div className="error-content">
            <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="error-text">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Info */}
      {uploadResponse && (
        <div className="success-message">
          <div className="success-header">
            <svg className="success-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="success-title">File processed successfully!</p>
          </div>
          <div className="success-info">
            <div className="success-info-item">
              <span className="success-info-label">File:</span>
              <span>{uploadResponse.filename}</span>
            </div>
            <div className="success-info-item">
              <span className="success-info-label">Size:</span>
              <span>{(uploadResponse.fileSize / 1024).toFixed(2)} KB</span>
            </div>
            <div className="success-info-item">
              <span className="success-info-label">Text Extracted:</span>
              <span>{uploadResponse.extractedTextLength.toLocaleString()} characters</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
