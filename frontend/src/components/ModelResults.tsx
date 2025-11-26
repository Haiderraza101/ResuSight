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

        {predictions.model3 && (
          <div className="model-card">
            <div className="model-header">
              <div className="model-header-content">
                <div className="model-icon-wrapper green">
                  <span className="model-icon">🌲</span>
                </div>
                <div className="model-info">
                  <h4 className="model-name">Model 3: Random Forest</h4>
                  <p className="model-type">Ensemble Learning Model</p>
                </div>
              </div>
            </div>
            
            <div className="model-content">
              <div className="model-category-card green">
                <div className="model-category-row">
                  <span className="model-category-label">Predicted Category</span>
                  <span className="model-category-value green">{predictions.model3.category}</span>
                </div>
              </div>
              
              {predictions.model3.confidence !== null && (
                <div className="model-confidence">
                  <div className="model-confidence-row">
                    <span className="model-confidence-label">Confidence</span>
                    <span className="model-confidence-value">
                      {(predictions.model3.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="model-confidence-bar">
                    <div
                      className="model-confidence-fill green"
                      style={{ width: `${predictions.model3.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {predictions.model3.probabilities && (
                <div className="model-probabilities">
                  <h5 className="model-probabilities-title">Top Probabilities</h5>
                  <div className="model-probabilities-list">
                    {Object.entries(predictions.model3.probabilities)
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
                                className="model-probability-fill green"
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

        {predictions.model4 && (
          <div className="model-card">
            <div className="model-header">
              <div className="model-header-content">
                <div className="model-icon-wrapper orange">
                  <span className="model-icon">⚡</span>
                </div>
                <div className="model-info">
                  <h4 className="model-name">Model 4: XGBoost</h4>
                  <p className="model-type">Gradient Boosting Model</p>
                </div>
              </div>
            </div>
            
            <div className="model-content">
              <div className="model-category-card orange">
                <div className="model-category-row">
                  <span className="model-category-label">Predicted Category</span>
                  <span className="model-category-value orange">{predictions.model4.category}</span>
                </div>
              </div>
              
              {predictions.model4.confidence !== null && (
                <div className="model-confidence">
                  <div className="model-confidence-row">
                    <span className="model-confidence-label">Confidence</span>
                    <span className="model-confidence-value">
                      {(predictions.model4.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="model-confidence-bar">
                    <div
                      className="model-confidence-fill orange"
                      style={{ width: `${predictions.model4.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {predictions.model4.probabilities && (
                <div className="model-probabilities">
                  <h5 className="model-probabilities-title">Top Probabilities</h5>
                  <div className="model-probabilities-list">
                    {Object.entries(predictions.model4.probabilities)
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
                                className="model-probability-fill orange"
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
        {(predictions.model1 || predictions.model2 || predictions.model3 || predictions.model4) && (
          <div className="model-comparison">
            <h4 className="model-comparison-title">
              <svg className="model-comparison-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Model Comparison
            </h4>
            
            <div className="model-comparison-list">
              {predictions.model1 && <p>• Model 1 (KNN): <strong>{predictions.model1.category}</strong></p>}
              {predictions.model2 && <p>• Model 2 (Logistic Regression): <strong>{predictions.model2.category}</strong></p>}
              {predictions.model3 && <p>• Model 3 (Random Forest): <strong>{predictions.model3.category}</strong></p>}
              {predictions.model4 && <p>• Model 4 (XGBoost): <strong>{predictions.model4.category}</strong></p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelResults;
