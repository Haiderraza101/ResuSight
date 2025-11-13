import React from 'react';
import { PredictionResult } from '../services/api';
import './ModelResults.css';

interface ModelResultsProps {
  predictions: PredictionResult | null;
  extractedText?: string;
}

const ModelResults: React.FC<ModelResultsProps> = ({ predictions, extractedText }) => {
  if (!predictions) {
    return (
      <div className="model-results-empty">
        <div className="model-results-empty-content">
          <div className="model-results-empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="model-results-empty-title">No Analysis Yet</h3>
          <p className="model-results-empty-text">Upload a resume to see AI-powered predictions and insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="model-results">
      {/* Header */}
      <div className="model-results-header">
        <h3 className="model-results-title">Analysis Results</h3>
        <p className="model-results-subtitle">AI-powered predictions from dual ML models</p>
      </div>

      {/* Model Predictions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {predictions.model1 && (
          <div className="model-card">
            <div className="model-header">
              <div className="model-header-content">
                <div className="model-icon-wrapper blue">
                  <span className="model-icon">🤖</span>
                </div>
                <div className="model-info">
                  <h4 className="model-name">Model 1: KNN</h4>
                  <p className="model-type">K-Nearest Neighbors Classifier</p>
                </div>
              </div>
            </div>
            
            <div className="model-content">
              <div className="model-category-card">
                <div className="model-category-row">
                  <span className="model-category-label">Predicted Category</span>
                  <span className="model-category-value blue">{predictions.model1.category}</span>
                </div>
              </div>
              
              {predictions.model1.confidence !== null && (
                <div className="model-confidence">
                  <div className="model-confidence-row">
                    <span className="model-confidence-label">Confidence</span>
                    <span className="model-confidence-value">
                      {(predictions.model1.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="model-confidence-bar">
                    <div
                      className="model-confidence-fill blue"
                      style={{ width: `${predictions.model1.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {predictions.model1.probabilities && (
                <div className="model-probabilities">
                  <h5 className="model-probabilities-title">Top Probabilities</h5>
                  <div className="model-probabilities-list">
                    {Object.entries(predictions.model1.probabilities)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([category, prob], index) => (
                        <div key={category} className="model-probability-item">
                          <div className="model-probability-content">
                            <span className="model-probability-number">{index + 1}.</span>
                            <span className="model-probability-name">{category}</span>
                          </div>
                          <div className="model-probability-bar-wrapper">
                            <div className="model-probability-bar">
                              <div
                                className="model-probability-fill blue"
                                style={{ width: `${prob * 100}%` }}
                              ></div>
                            </div>
                            <span className="model-probability-percent">
                              {(prob * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {predictions.model2 && (
          <div className="model-card">
            <div className="model-header">
              <div className="model-header-content">
                <div className="model-icon-wrapper purple">
                  <span className="model-icon">🧠</span>
                </div>
                <div className="model-info">
                  <h4 className="model-name">Model 2: Logistic Regression</h4>
                  <p className="model-type">Linear Classification Model</p>
                </div>
              </div>
            </div>
            
            <div className="model-content">
              <div className="model-category-card purple">
                <div className="model-category-row">
                  <span className="model-category-label">Predicted Category</span>
                  <span className="model-category-value purple">{predictions.model2.category}</span>
                </div>
              </div>
              
              {predictions.model2.confidence !== null && (
                <div className="model-confidence">
                  <div className="model-confidence-row">
                    <span className="model-confidence-label">Confidence</span>
                    <span className="model-confidence-value">
                      {(predictions.model2.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="model-confidence-bar">
                    <div
                      className="model-confidence-fill purple"
                      style={{ width: `${predictions.model2.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {predictions.model2.probabilities && (
                <div className="model-probabilities">
                  <h5 className="model-probabilities-title">Top Probabilities</h5>
                  <div className="model-probabilities-list">
                    {Object.entries(predictions.model2.probabilities)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([category, prob], index) => (
                        <div key={category} className="model-probability-item">
                          <div className="model-probability-content">
                            <span className="model-probability-number">{index + 1}.</span>
                            <span className="model-probability-name">{category}</span>
                          </div>
                          <div className="model-probability-bar-wrapper">
                            <div className="model-probability-bar">
                              <div
                                className="model-probability-fill purple"
                                style={{ width: `${prob * 100}%` }}
                              ></div>
                            </div>
                            <span className="model-probability-percent">
                              {(prob * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comparison Card */}
        {predictions.model1 && predictions.model2 && (
          <div className="model-comparison">
            <h4 className="model-comparison-title">
              <svg className="model-comparison-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Model Comparison
            </h4>
            
            {predictions.model1.category === predictions.model2.category ? (
              <div className="model-comparison-agree">
                <div className="model-comparison-agree-content">
                  <svg className="model-comparison-agree-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="model-comparison-agree-text">Models Agree</p>
                    <p className="model-comparison-agree-detail">Both models predict: <strong>{predictions.model1.category}</strong></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="model-comparison-disagree">
                <div className="model-comparison-disagree-header">
                  <svg className="model-comparison-disagree-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="model-comparison-disagree-title">Models Disagree</p>
                </div>
                <div className="model-comparison-disagree-list">
                  <p>• Model 1 (KNN): <strong>{predictions.model1.category}</strong></p>
                  <p>• Model 2 (Logistic Regression): <strong>{predictions.model2.category}</strong></p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelResults;
