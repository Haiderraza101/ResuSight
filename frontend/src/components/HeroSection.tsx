import React from 'react';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <p className="hero-subtitle">
          Fast, Accurate, Multilingual Resume & Job Parsing
        </p>
        
        <h1 className="hero-title">
          RESUSIGHT: GROUNDBREAKING
          <br />
          <span className="hero-title-highlight">PARSING TECHNOLOGY</span>
        </h1>
        
        <p className="hero-description">
          Embrace the transformative power of ResuSight, an intelligent resume screening system 
          that empowers you to streamline your recruitment process and make informed hiring decisions.
        </p>

        <div className="hero-buttons">
          <button className="btn btn-primary">
            Start your free trial $0/ month
          </button>
          <button className="btn btn-secondary">
            Find out more
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="hero-features">
          <div className="hero-feature-card">
            <div className="hero-feature-icon">✅</div>
            <h3 className="hero-feature-title">Unparalleled Speed and Accuracy</h3>
            <p className="hero-feature-description">
              Process resumes with unmatched speed and accuracy, ensuring you don't miss a single qualified candidate.
            </p>
          </div>
          
          <div className="hero-feature-card">
            <div className="hero-feature-icon">✅</div>
            <h3 className="hero-feature-title">Multilingual Mastery</h3>
            <p className="hero-feature-description">
              Extract and enrich data from resumes in multiple languages, expanding your talent pool worldwide.
            </p>
          </div>
          
          <div className="hero-feature-card">
            <div className="hero-feature-icon">✅</div>
            <h3 className="hero-feature-title">Precision-Driven Matching</h3>
            <p className="hero-feature-description">
              Swiftly filter, search, rank, and match candidates with pinpoint accuracy, eliminating manual processes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
