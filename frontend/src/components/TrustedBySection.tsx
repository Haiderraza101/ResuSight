import React from 'react';
import './TrustedBySection.css';

const TrustedBySection: React.FC = () => {
  const testimonials = [
    {
      quote: "The parsing accuracy is awesome and it's cloud based! You get what you pay for.",
      author: "AMAR CHADIPIRALA",
      role: "CHIEF TECHNICAL OFFICER – CEIPAL"
    },
    {
      quote: "The quality of the parsing is hugely important. If we can't parse, and do so well, it requires extra work for the manager. We're committed to a great user experience.",
      author: "Joe Miliziano",
      role: "Chief Operating Officer"
    },
    {
      quote: "We could not survive without the parsing software. It has worked extremely well for us for over 20 years with hardly any issues.",
      author: "CLAUDETTE DUNLAP",
      role: "SENIOR SALES ENGINEER – TEMPWORKS"
    }
  ];

  return (
    <section className="trusted-section">
      <div className="trusted-container">
        <div className="trusted-header">
          <h2 className="trusted-title">TRUSTED BY</h2>
        </div>

        <div className="trusted-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-icon-wrapper">
                <svg className="testimonial-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
              <blockquote className="testimonial-quote">
                "{testimonial.quote}"
              </blockquote>
              <div className="testimonial-divider">
                <p className="testimonial-author">{testimonial.author}</p>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="trusted-cta">
          <p className="trusted-cta-subtitle">
            Experience the difference
          </p>
          <h3 className="trusted-cta-title">
            Elevate Your Recruitment to New Heights
          </h3>
          <p className="trusted-cta-description">
            Join the growing community of businesses that have transformed their recruitment processes 
            with the power of ResuSight. Experience AI-powered parsing and unlock a new era of recruitment efficiency.
          </p>
          <button className="btn btn-primary">
            Get a free trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
