import React from 'react';
import './FeaturesSection.css';

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="features-header">
          <p className="features-subtitle">
            Unmatched Speed, Accuracy, and Multilingual Capabilities
          </p>
          <h2 className="features-title">
            All of ResuSight's features, enhanced by AI-powered technology
          </h2>
          <p className="features-description">
            Our revolutionary system seamlessly integrates advanced resume parsing capabilities 
            with market-leading ML engines, delivering a comprehensive solution.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="feature-title">Lightning Fast</h3>
            <p className="feature-description">Process resumes in seconds with our optimized ML pipeline</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper indigo">
              <svg className="feature-icon indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="feature-title">99%+ Accuracy</h3>
            <p className="feature-description">Dual ML models ensure precise job category classification</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper purple">
              <svg className="feature-icon purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.036 6.949A18.022 18.022 0 009.088 9m-3.04 6.949A18.022 18.022 0 0112 15.5m6.364-6.5A18.022 18.022 0 0115.5 9m-3.04 6.949A18.022 18.022 0 0118.912 9" />
              </svg>
            </div>
            <h3 className="feature-title">Multilingual</h3>
            <p className="feature-description">Support for multiple languages and formats</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper pink">
              <svg className="feature-icon pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="feature-title">Smart Analytics</h3>
            <p className="feature-description">Get detailed insights and probability distributions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
