import React, { useState } from 'react';
import ApiService, { UploadResponse, PredictionResult } from '../services/api';
import './ResumeUpload.css';

interface ResumeUploadProps {
  onPredictionComplete: (results: PredictionResult) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onPredictionComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError(null);
        setUploadResponse(null);
      } else {
        setError('Please upload a PDF or TXT file');
        setFile(null);
      }
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

  return (
    <div className="resume-upload">
      <h2>Upload Your Resume</h2>
      <div className="upload-section">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="resume-upload" className="file-label">
            {file ? file.name : 'Choose PDF or TXT file'}
          </label>
        </div>
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="upload-button"
        >
          {uploading ? 'Processing...' : 'Upload & Analyze'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {uploadResponse && (
        <div className="upload-info">
          <p><strong>File:</strong> {uploadResponse.filename}</p>
          <p><strong>Size:</strong> {(uploadResponse.fileSize / 1024).toFixed(2)} KB</p>
          <p><strong>Text Extracted:</strong> {uploadResponse.extractedTextLength} characters</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;

