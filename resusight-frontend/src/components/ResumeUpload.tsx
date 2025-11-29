import React, { useState, useRef } from "react";
import ApiService, { UploadResponse, PredictionResult } from "../services/api";

interface ResumeUploadProps {
  onPredictionComplete: (results: PredictionResult, text?: string) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onPredictionComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(
    null
  );
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    if (
      selectedFile.type === "application/pdf" ||
      selectedFile.type === "text/plain"
    ) {
      setFile(selectedFile);
      setError(null);
      setUploadResponse(null);
    } else {
      setError("Please upload a PDF or TXT file");
      setFile(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await ApiService.uploadResume(file, "both");
      setUploadResponse(response);
      onPredictionComplete(response.predictions);
    } catch (err: any) {
      setError(err.message || "Failed to upload and process resume");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const uploadAreaClass = `${
    dragActive
      ? "border-blue-500 bg-blue-50"
      : file
      ? "border-green-500 bg-green-50"
      : "border-gray-300 bg-gray-50"
  } border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50`;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Your Resume
        </h3>
        <p className="text-gray-600">
          Get instant AI-powered analysis and job category matching
        </p>
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
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {file ? (
            <div>
              <p className="text-lg font-semibold text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                {(file.size / 1024).toFixed(2)} KB •{" "}
                {file.type === "application/pdf" ? "PDF" : "Text"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-700 mb-1">
                Drag and drop your resume here
              </p>
              <p className="text-sm text-gray-500 mb-2">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 font-medium underline hover:text-blue-700 bg-none border-none cursor-pointer p-0 m-0"
              >
                browse files
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Supports PDF and TXT files
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full mt-6 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Analyze Resume"
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {uploadResponse && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Resume processed successfully!
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
