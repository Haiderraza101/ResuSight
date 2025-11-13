import React from 'react';
import { PredictionResult } from '../services/api';
import './ModelResults.css';

interface ModelResultsProps {
  predictions: PredictionResult | null;
}

const ModelResults: React.FC<ModelResultsProps> = ({ predictions }) => {
  if (!predictions) {
    return (
      <div className="model-results">
        <p className="no-results">Upload a resume to see predictions</p>
      </div>
    );
  }

  return (
    <div className="model-results">
      <h2>Prediction Results</h2>
      <div className="results-grid">
        {predictions.model1 && (
          <div className="result-card">
            <h3>Model 1 (KNN)</h3>
            <div className="prediction">
              <span className="label">Predicted Category:</span>
              <span className="value category">{predictions.model1.category}</span>
            </div>
            {predictions.model1.confidence !== null && (
              <div className="prediction">
                <span className="label">Confidence:</span>
                <span className="value">
                  {(predictions.model1.confidence * 100).toFixed(2)}%
                </span>
              </div>
            )}
            {predictions.model1.probabilities && (
              <div className="probabilities">
                <h4>Top Probabilities:</h4>
                <ul>
                  {Object.entries(predictions.model1.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([category, prob]) => (
                      <li key={category}>
                        {category}: {(prob * 100).toFixed(2)}%
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {predictions.model2 && (
          <div className="result-card">
            <h3>Model 2 (Logistic Regression)</h3>
            <div className="prediction">
              <span className="label">Predicted Category:</span>
              <span className="value category">{predictions.model2.category}</span>
            </div>
            {predictions.model2.confidence !== null && (
              <div className="prediction">
                <span className="label">Confidence:</span>
                <span className="value">
                  {(predictions.model2.confidence * 100).toFixed(2)}%
                </span>
              </div>
            )}
            {predictions.model2.probabilities && (
              <div className="probabilities">
                <h4>Top Probabilities:</h4>
                <ul>
                  {Object.entries(predictions.model2.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([category, prob]) => (
                      <li key={category}>
                        {category}: {(prob * 100).toFixed(2)}%
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {predictions.model1 && predictions.model2 && (
          <div className="comparison-card">
            <h3>Comparison</h3>
            {predictions.model1.category === predictions.model2.category ? (
              <div className="agreement">
                <span className="icon">✓</span>
                <p>Both models agree: <strong>{predictions.model1.category}</strong></p>
              </div>
            ) : (
              <div className="disagreement">
                <span className="icon">⚠</span>
                <p>Models disagree:</p>
                <ul>
                  <li>Model 1: {predictions.model1.category}</li>
                  <li>Model 2: {predictions.model2.category}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelResults;

