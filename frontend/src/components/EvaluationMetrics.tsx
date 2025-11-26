import React, { useState, useEffect } from 'react';
import apiService, { EvaluationResponse, EvaluationResult } from '../services/api';
import './EvaluationMetrics.css';

const EvaluationMetrics: React.FC = () => {
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<'all' | 'clf1' | 'clf2' | 'clf3' | 'clf4'>('all');

  useEffect(() => {
    loadEvaluation();
  }, [selectedModel]);

  const loadEvaluation = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getEvaluation(selectedModel);
      setEvaluation(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load evaluation metrics');
    } finally {
      setLoading(false);
    }
  };

  const renderMetrics = (result: EvaluationResult, modelKey: string) => {
    const modelColors: { [key: string]: string } = {
      model1: 'blue',
      model2: 'purple',
      model3: 'green',
      model4: 'orange'
    };
    const color = modelColors[modelKey] || 'blue';

    return (
      <div key={modelKey} className="evaluation-model-section">
        <h3 className="evaluation-model-title">{result.model_name} Evaluation Metrics</h3>
        
        {/* Metrics Grid */}
        <div className="evaluation-metrics-grid">
          <div className="evaluation-metric-card">
            <div className="evaluation-metric-label">Accuracy</div>
            <div className={`evaluation-metric-value ${color}`}>
              {result.accuracy.toFixed(4)}
            </div>
          </div>
          
          <div className="evaluation-metric-card">
            <div className="evaluation-metric-label">Precision</div>
            <div className={`evaluation-metric-value ${color}`}>
              {result.precision.toFixed(4)}
            </div>
          </div>
          
          <div className="evaluation-metric-card">
            <div className="evaluation-metric-label">Recall</div>
            <div className={`evaluation-metric-value ${color}`}>
              {result.recall.toFixed(4)}
            </div>
          </div>
          
          <div className="evaluation-metric-card">
            <div className="evaluation-metric-label">F1 Score</div>
            <div className={`evaluation-metric-value ${color}`}>
              {result.f1_score.toFixed(4)}
            </div>
          </div>
          
          <div className="evaluation-metric-card">
            <div className="evaluation-metric-label">AUC</div>
            <div className={`evaluation-metric-value ${color}`}>
              {result.auc !== null ? result.auc.toFixed(4) : 'N/A'}
            </div>
          </div>
          
          <div className="evaluation-metric-card">
            <div className="evaluation-metric-label">Top-3 Accuracy</div>
            <div className={`evaluation-metric-value ${color}`}>
              {result.top3_accuracy !== null ? result.top3_accuracy.toFixed(4) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="evaluation-confusion-matrix">
          <h4 className="evaluation-confusion-title">Confusion Matrix</h4>
          <ConfusionMatrix 
            matrix={result.confusion_matrix} 
            labels={result.labels}
            color={color}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="evaluation-loading">
        <div className="evaluation-loading-spinner"></div>
        <p>Loading evaluation metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evaluation-error">
        <p>{error}</p>
        <button onClick={loadEvaluation} className="evaluation-retry-btn">Retry</button>
      </div>
    );
  }

  if (!evaluation || !evaluation.results) {
    return (
      <div className="evaluation-empty">
        <p>No evaluation data available. Click "Load Evaluation" to see metrics.</p>
        <button onClick={loadEvaluation} className="evaluation-load-btn">Load Evaluation</button>
      </div>
    );
  }

  const results = evaluation.results;
  const hasResults = results.model1 || results.model2 || results.model3 || results.model4;

  return (
    <div className="evaluation-metrics">
      <div className="evaluation-header">
        <h2 className="evaluation-title">📊 Model Evaluation Metrics</h2>
        <p className="evaluation-subtitle">Performance metrics and confusion matrices for all models</p>
        
        <div className="evaluation-filters">
          <button 
            className={`evaluation-filter-btn ${selectedModel === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedModel('all')}
          >
            All Models
          </button>
          <button 
            className={`evaluation-filter-btn ${selectedModel === 'clf1' ? 'active' : ''}`}
            onClick={() => setSelectedModel('clf1')}
          >
            Model 1
          </button>
          <button 
            className={`evaluation-filter-btn ${selectedModel === 'clf2' ? 'active' : ''}`}
            onClick={() => setSelectedModel('clf2')}
          >
            Model 2
          </button>
          {results.model3 && (
            <button 
              className={`evaluation-filter-btn ${selectedModel === 'clf3' ? 'active' : ''}`}
              onClick={() => setSelectedModel('clf3')}
            >
              Model 3
            </button>
          )}
          {results.model4 && (
            <button 
              className={`evaluation-filter-btn ${selectedModel === 'clf4' ? 'active' : ''}`}
              onClick={() => setSelectedModel('clf4')}
            >
              Model 4
            </button>
          )}
        </div>
      </div>

      {!hasResults && (
        <div className="evaluation-empty">
          <p>No evaluation results available for the selected model(s).</p>
        </div>
      )}

      <div className="evaluation-content">
        {selectedModel === 'all' ? (
          <>
            {results.model1 && renderMetrics(results.model1, 'model1')}
            {results.model2 && renderMetrics(results.model2, 'model2')}
            {results.model3 && renderMetrics(results.model3, 'model3')}
            {results.model4 && renderMetrics(results.model4, 'model4')}
          </>
        ) : (
          <>
            {selectedModel === 'clf1' && results.model1 && renderMetrics(results.model1, 'model1')}
            {selectedModel === 'clf2' && results.model2 && renderMetrics(results.model2, 'model2')}
            {selectedModel === 'clf3' && results.model3 && renderMetrics(results.model3, 'model3')}
            {selectedModel === 'clf4' && results.model4 && renderMetrics(results.model4, 'model4')}
          </>
        )}
      </div>
    </div>
  );
};

// Confusion Matrix Component
interface ConfusionMatrixProps {
  matrix: number[][];
  labels: string[];
  color: string;
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ matrix, labels, color }) => {
  const maxValue = Math.max(...matrix.flat());
  
  return (
    <div className="confusion-matrix-container">
      <div className="confusion-matrix-table">
        <div className="confusion-matrix-header">
          <div className="confusion-matrix-corner"></div>
          {labels.map((label, idx) => (
            <div key={idx} className="confusion-matrix-header-cell">
              {label.length > 15 ? label.substring(0, 15) + '...' : label}
            </div>
          ))}
        </div>
        {matrix.map((row, rowIdx) => (
          <div key={rowIdx} className="confusion-matrix-row">
            <div className="confusion-matrix-row-label">
              {labels[rowIdx].length > 15 ? labels[rowIdx].substring(0, 15) + '...' : labels[rowIdx]}
            </div>
            {row.map((cell, colIdx) => {
              const intensity = maxValue > 0 ? cell / maxValue : 0;
              return (
                <div
                  key={colIdx}
                  className={`confusion-matrix-cell ${color}`}
                  style={{
                    backgroundColor: `rgba(${
                      color === 'blue' ? '59, 130, 246' :
                      color === 'purple' ? '147, 51, 234' :
                      color === 'green' ? '34, 197, 94' :
                      '249, 115, 22'
                    }, ${0.2 + intensity * 0.8})`,
                    color: intensity > 0.5 ? '#fff' : '#000'
                  }}
                  title={`True: ${labels[rowIdx]}, Predicted: ${labels[colIdx]}, Count: ${cell}`}
                >
                  {cell}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationMetrics;

