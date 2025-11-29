import React from "react";
import { PredictionResult } from "../services/api";

interface ModelResultsProps {
  predictions: PredictionResult | null;
  extractedText?: string;
}

const ModelResults: React.FC<ModelResultsProps> = ({
  predictions,
  extractedText,
}) => {
  if (!predictions) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Analysis Yet
          </h3>
          <p className="text-gray-600">
            Upload a resume to see AI-powered predictions and insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Analysis Results
        </h3>
        <p className="text-gray-600">
          AI-powered predictions from dual ML models
        </p>
      </div>

      {/* Model Predictions */}
      <div className="space-y-6">
        {predictions.model1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Model 1: KNN
                  </h4>
                  <p className="text-sm text-gray-600">
                    K-Nearest Neighbors Classifier
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Predicted Category
                  </span>
                  <span className="text-lg font-bold text-blue-700">
                    {predictions.model1.category}
                  </span>
                </div>
              </div>

              {predictions.model1.confidence !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Confidence</span>
                    <span className="font-semibold text-gray-900">
                      {(predictions.model1.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${predictions.model1.confidence * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {predictions.model1.probabilities && (
                <div className="mt-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Top Probabilities
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(predictions.model1.probabilities)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([category, prob], index) => (
                        <div key={category} className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 w-4">
                            {index + 1}.
                          </span>
                          <span className="text-sm text-gray-700 flex-1">
                            {category}
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${prob * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-600 w-10 text-right">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {predictions.model2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🧠</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Model 2: Logistic Regression
                  </h4>
                  <p className="text-sm text-gray-600">
                    Linear Classification Model
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-linear-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Predicted Category
                  </span>
                  <span className="text-lg font-bold text-purple-700">
                    {predictions.model2.category}
                  </span>
                </div>
              </div>

              {predictions.model2.confidence !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Confidence</span>
                    <span className="font-semibold text-gray-900">
                      {(predictions.model2.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${predictions.model2.confidence * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {predictions.model2.probabilities && (
                <div className="mt-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">
                    Top Probabilities
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(predictions.model2.probabilities)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([category, prob], index) => (
                        <div key={category} className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 w-4">
                            {index + 1}.
                          </span>
                          <span className="text-sm text-gray-700 flex-1">
                            {category}
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-purple-500 h-full rounded-full"
                              style={{ width: `${prob * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-600 w-10 text-right">
                            {(prob * 100).toFixed(1)}%
                          </span>
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
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-lg shadow-lg p-6 border border-indigo-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Model Comparison
            </h4>

            {predictions.model1.category === predictions.model2.category ? (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-900">Models Agree</p>
                    <p className="text-sm text-green-800">
                      Both models predict:{" "}
                      <strong>{predictions.model1.category}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                <div className="mb-3">
                  <div className="flex items-center gap-2 font-semibold text-yellow-900">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Models Disagree
                  </div>
                </div>
                <div className="space-y-1 text-sm text-yellow-900">
                  <p>
                    <strong>Model 1 predicts:</strong>{" "}
                    {predictions.model1.category}
                  </p>
                  <p>
                    <strong>Model 2 predicts:</strong>{" "}
                    {predictions.model2.category}
                  </p>
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
