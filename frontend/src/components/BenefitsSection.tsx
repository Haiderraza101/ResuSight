import React from 'react';
import './BenefitsSection.css';

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: "Improve data-driven decisions",
      description: "Enriched and complete candidate and jobs data is the foundation of accurate search, match and analytics capabilities.",
      icon: "📊"
    },
    {
      title: "Streamline recruitment processes",
      description: "Enhance recruitment accuracy, minimize data entry errors, and standardize input with automated data extraction.",
      icon: "⚡"
    },
    {
      title: "Reduce bias",
      description: "Focus on skills and ensure fair hiring by only displaying relevant extracted data.",
      icon: "🎯"
    }
  ];

  return (
    <section id="benefits" className="benefits-section">
      <div className="benefits-container">
        <div className="benefits-header">
          <h2 className="benefits-title">
            Find the Right Talent, Faster and Smarter
          </h2>
          <p className="benefits-description">
            Our parsing solutions transform your recruitment strategy, empowering talent acquisition teams 
            to work smarter and find the right talent for every job posting.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="benefits-cta">
          <p className="benefits-cta-subtitle">
            Experience the power of ResuSight parsing
          </p>
          <h3 className="benefits-cta-title">
            Unleash the combined power of advanced resume parsing capabilities
          </h3>
          <button className="benefits-cta-button">
            Find out more
          </button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
