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
  const [scanningPhase, setScanningPhase] = useState<
    "idle" | "name" | "skills" | "experience" | "complete"
  >("idle");
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
    setScanningPhase("name");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setScanningPhase("skills");

      await new Promise((resolve) => setTimeout(resolve, 800));
      setScanningPhase("experience");

      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("Uploading resume file:", file.name);
      const response = await ApiService.uploadResume(file);
      console.log("Upload response:", response);

      if (!response.predictions) {
        console.error("No predictions in response:", response);
        throw new Error("No predictions returned from API");
      }

      console.log("Predictions received:", response.predictions);
      setUploadResponse(response);
      setScanningPhase("complete");

      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log("Calling onPredictionComplete with:", response.predictions);
      onPredictionComplete(response.predictions, response.extractedText);
    } catch (err: any) {
      setError(err.message || "Failed to upload and process resume");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (!error) {
        setTimeout(() => setScanningPhase("idle"), 1500);
      }
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 sm:py-16 lg:py-20 overflow-hidden relative">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
      `}</style>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slideInUp">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-sm font-medium text-cyan-300">
              Smart Resume Analysis
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Upload & Analyze
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
              Your Resume
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Our 7 advanced AI models analyze your resume in under 1 second to
            predict the perfect job category
          </p>
        </div>

        {/* Main Content - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left - Upload Section */}
          <div
            className="animate-slideInLeft"
            style={{ animationDelay: "0.1s" }}
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative group rounded-2xl border-2 p-8 sm:p-12 transition-all duration-300 cursor-pointer ${
                dragActive
                  ? "border-cyan-400 bg-cyan-500/10"
                  : file
                  ? "border-cyan-500/40 bg-slate-800/50"
                  : "border-slate-600/40 bg-slate-800/30 hover:border-cyan-500/40 hover:bg-slate-800/50"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleInputChange}
                disabled={uploading}
                className="hidden"
              />

              {uploading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-cyan-400 animate-spin"></div>
                  </div>
                  <p className="text-white font-bold text-lg mb-8">
                    Analyzing Your Resume
                  </p>

                  <div className="space-y-3 w-full max-w-sm">
                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                        scanningPhase === "name"
                          ? "bg-cyan-500/30"
                          : scanningPhase === "complete"
                          ? "bg-green-500/20"
                          : "bg-slate-800/50"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          scanningPhase === "name"
                            ? "bg-cyan-400 animate-pulse"
                            : scanningPhase === "complete"
                            ? "bg-green-400"
                            : "bg-slate-600"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          scanningPhase === "name" ||
                          scanningPhase === "complete"
                            ? "text-white"
                            : "text-slate-400"
                        }`}
                      >
                        Scanning Name & Contact
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                        scanningPhase === "skills"
                          ? "bg-blue-500/30"
                          : scanningPhase === "complete"
                          ? "bg-green-500/20"
                          : "bg-slate-800/50"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          scanningPhase === "skills"
                            ? "bg-blue-400 animate-pulse"
                            : scanningPhase === "complete"
                            ? "bg-green-400"
                            : "bg-slate-600"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          scanningPhase === "skills" ||
                          scanningPhase === "complete"
                            ? "text-white"
                            : "text-slate-400"
                        }`}
                      >
                        Extracting Skills
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                        scanningPhase === "experience"
                          ? "bg-cyan-500/30"
                          : scanningPhase === "complete"
                          ? "bg-green-500/20"
                          : "bg-slate-800/50"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          scanningPhase === "experience"
                            ? "bg-cyan-400 animate-pulse"
                            : scanningPhase === "complete"
                            ? "bg-green-400"
                            : "bg-slate-600"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${
                          scanningPhase === "experience" ||
                          scanningPhase === "complete"
                            ? "text-white"
                            : "text-slate-400"
                        }`}
                      >
                        Analyzing Experience
                      </span>
                    </div>
                  </div>
                </div>
              ) : !file ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="mb-8 relative">
                    <svg
                      className="w-16 h-16 text-slate-500 group-hover:text-cyan-400 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-white text-center mb-2">
                    Drag your resume here
                  </p>
                  <p className="text-slate-400 text-center mb-6">
                    or click to browse your files (PDF or TXT)
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                  >
                    Select Resume
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <p className="text-white font-bold mb-2">Resume Ready</p>
                  <p className="text-slate-400 text-sm mb-4 text-center max-w-xs">
                    {file.name}
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium underline transition-colors duration-200"
                  >
                    Change Resume
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right - Process Info */}
          <div className="animate-slideInUp" style={{ animationDelay: "0.2s" }}>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl h-full flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-lg mb-6">
                  What Happens Next
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Quick Upload
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        PDF or TXT format
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        AI Analysis
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        7 models processing
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Get Results
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        26 job categories
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-slideInUp">
            <svg
              className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        <div
          className="flex gap-4 mt-8 animate-slideInUp"
          style={{ animationDelay: "0.3s" }}
        >
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`flex-1 py-4 rounded-xl font-bold transition-all duration-300 ${
              file && !uploading
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/20"
                : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
            }`}
          >
            {uploading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
