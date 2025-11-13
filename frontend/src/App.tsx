import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import ModelResults from './components/ModelResults';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TrustedBySection from './components/TrustedBySection';
import BenefitsSection from './components/BenefitsSection';
import Footer from './components/Footer';
import { PredictionResult } from './services/api';
import './App.css';

function App() {
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  const handlePredictionComplete = (results: PredictionResult, text?: string) => {
    setPredictions(results);
    if (text) setExtractedText(text);
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-logo">ResuSight</div>
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#upload" className="nav-link">Try It</a>
              <a href="#benefits" className="nav-link">Benefits</a>
            </div>
            <div className="nav-actions">
              <button className="nav-button" style={{ display: 'none' }}>Login</button>
              <button className="nav-button-primary">Contact us</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Upload & Analysis Section */}
      <section id="upload" className="section bg-gray">
        <div className="section-container">
          <div className="section-header">
            <p className="section-subtitle">
              Experience the power
            </p>
            <h2 className="section-title">
              Upload & Analyze Your Resume
            </h2>
            <p className="section-description">
              Get instant AI-powered analysis and job category matching with our advanced ML models
            </p>
          </div>

          <div className="grid grid-1 grid-upload">
            <ResumeUpload onPredictionComplete={handlePredictionComplete} />
            <ModelResults predictions={predictions} extractedText={extractedText} />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
