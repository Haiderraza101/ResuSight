import React from "react";
import { AllModelsPredictions, ModelPrediction } from "../services/api";

interface ModelResultsProps {
  predictions: AllModelsPredictions | null;
  extractedText?: string;
}

// Model grouping by type
const ML_MODELS = [
  "Logistic Regression",
  "Linear SVM",
  "Random Forest",
] as const;
const DL_MODELS = [
  "BiLSTM+Attention",
  "BiLSTM+CNN",
  "BiLSTM+CNN+Attention",
] as const;
const TRANSFORMER_MODELS = ["DistilBERT Transformer"] as const;

const MODEL_COLORS: { [key: string]: string } = {
  "Logistic Regression": "bg-blue-500",
  "Linear SVM": "bg-indigo-500",
  "Random Forest": "bg-green-500",
  "BiLSTM+Attention": "bg-purple-500",
  "BiLSTM+CNN": "bg-pink-500",
  "BiLSTM+CNN+Attention": "bg-red-500",
  "DistilBERT Transformer": "bg-amber-500",
};

const MODEL_ICONS: { [key: string]: string } = {
  "Logistic Regression": "📊",
  "Linear SVM": "🎯",
  "Random Forest": "🌲",
  "BiLSTM+Attention": "🧠",
  "BiLSTM+CNN": "🔬",
  "BiLSTM+CNN+Attention": "⚡",
  "DistilBERT Transformer": "🤖",
};

const ModelCard: React.FC<{
  modelName: string;
  prediction: ModelPrediction;
}> = ({ modelName, prediction }) => {
  const colorClass = MODEL_COLORS[modelName] || "bg-gray-500";
  const bgColor = colorClass.replace("500", "50");
  const textColor = colorClass.replace("bg-", "text-");
  const icon = MODEL_ICONS[modelName] || "🔮";

  return (
    <div
      className={`${bgColor} rounded-lg shadow-md p-6 border-l-4 ${colorClass}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <h4 className="text-lg font-bold text-gray-900">{modelName}</h4>
          <p className="text-xs text-gray-600">Confidence Score</p>
        </div>
      </div>

      {/* Main Prediction */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Predicted Category</span>
          <span className={`text-2xl font-bold ${textColor}`}>
            {prediction.category}
          </span>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Confidence</span>
            <span className="font-semibold text-sm text-gray-900">
              {(prediction.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`${colorClass} h-full rounded-full transition-all duration-500 ease-out`}
              style={{
                width: `${prediction.confidence * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Top 5 Predictions */}
      {prediction.top5 && prediction.top5.length > 0 && (
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-700 mb-3">
            Top 5 Categories
          </p>
          <div className="space-y-2">
            {prediction.top5.map((pred, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-xs text-gray-700">
                  {idx + 1}. {pred.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">
                    {(pred.probability * 100).toFixed(1)}%
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${colorClass} h-full rounded-full`}
                      style={{
                        width: `${pred.probability * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ModelResults: React.FC<ModelResultsProps> = ({
  predictions,
  extractedText,
}) => {
  if (!predictions || Object.keys(predictions).length === 0) {
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
            Upload a resume to see AI-powered predictions from 7 models
          </p>
        </div>
      </div>
    );
  }

  const mlPreds = ML_MODELS.filter(
    (m) => predictions[m]
  ) as (typeof ML_MODELS)[number][];
  const dlPreds = DL_MODELS.filter(
    (m) => predictions[m]
  ) as (typeof DL_MODELS)[number][];
  const transformerPreds = TRANSFORMER_MODELS.filter(
    (m) => predictions[m]
  ) as (typeof TRANSFORMER_MODELS)[number][];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Analysis Results</h2>
        <p className="text-blue-100">
          Comprehensive predictions from 7 AI models (3 ML + 3 DL + 1
          Transformer)
        </p>
      </div>

      {/* ML Models Section */}
      {mlPreds.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span> Machine Learning Models
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mlPreds.map((modelName) => (
              <ModelCard
                key={modelName}
                modelName={modelName}
                prediction={predictions[modelName]!}
              />
            ))}
          </div>
        </div>
      )}

      {/* DL Models Section */}
      {dlPreds.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🧠</span> Deep Learning Models
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dlPreds.map((modelName) => (
              <ModelCard
                key={modelName}
                modelName={modelName}
                prediction={predictions[modelName]!}
              />
            ))}
          </div>
        </div>
      )}

      {/* Transformer Section */}
      {transformerPreds.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🤖</span> Transformer Model
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {transformerPreds.map((modelName) => (
              <ModelCard
                key={modelName}
                modelName={modelName}
                prediction={predictions[modelName]!}
              />
            ))}
          </div>
        </div>
      )}

      {/* Extracted Text Section */}
      {extractedText && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Extracted Resume Text
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {extractedText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelResults;
