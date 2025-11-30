import React, { useState } from "react";
import { AllModelsPredictions, ModelPrediction } from "../services/api";

interface ModelResultsProps {
  predictions: AllModelsPredictions | null;
  extractedText?: string;
}

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

const MODEL_CONFIG: {
  [key: string]: { gradient: string; border: string; accent: string };
} = {
  "Logistic Regression": {
    gradient: "from-cyan-600 to-cyan-500",
    border: "border-cyan-500/40",
    accent: "text-cyan-400",
  },
  "Linear SVM": {
    gradient: "from-cyan-500 to-blue-600",
    border: "border-blue-500/40",
    accent: "text-cyan-300",
  },
  "Random Forest": {
    gradient: "from-blue-600 to-blue-500",
    border: "border-blue-500/40",
    accent: "text-blue-400",
  },
  "BiLSTM+Attention": {
    gradient: "from-cyan-600 to-blue-600",
    border: "border-cyan-500/40",
    accent: "text-cyan-400",
  },
  "BiLSTM+CNN": {
    gradient: "from-blue-600 to-blue-500",
    border: "border-blue-500/40",
    accent: "text-blue-400",
  },
  "BiLSTM+CNN+Attention": {
    gradient: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/40",
    accent: "text-cyan-300",
  },
  "DistilBERT Transformer": {
    gradient: "from-blue-600 to-cyan-500",
    border: "border-blue-500/40",
    accent: "text-blue-400",
  },
};

const ModelCard: React.FC<{
  modelName: string;
  prediction: ModelPrediction;
  modelType: "ml" | "dl" | "transformer";
}> = ({ modelName, prediction, modelType }) => {
  const [expanded, setExpanded] = useState(false);
  const config = MODEL_CONFIG[modelName];
  const confidencePercent = (prediction.confidence * 100).toFixed(1);

  const modelTypeLabel =
    modelType === "ml"
      ? "Machine Learning"
      : modelType === "dl"
      ? "Deep Learning"
      : "Transformer";

  return (
    <>
      <style>{`
        .scrollbar-theme {
          scrollbar-color: rgba(34, 197, 234, 0.6) rgba(30, 41, 59, 0.3);
          scrollbar-width: thin;
        }
        .scrollbar-theme::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-theme::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .scrollbar-theme::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 234, 0.6);
          border-radius: 10px;
          border: 2px solid rgba(15, 23, 42, 0.5);
        }
        .scrollbar-theme::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.8);
        }
      `}</style>
      <div
        className={`group relative bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-lg sm:rounded-xl border ${config.border} p-4 sm:p-6 w-full hover:border-opacity-100 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
        ></div>

        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                <span
                  className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-800/50 border ${config.border} rounded-full text-xs font-semibold ${config.accent} shrink-0`}
                >
                  {modelTypeLabel}
                </span>
              </div>
              <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white">
                {modelName}
              </h4>
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm mb-0.5 sm:mb-1">
                  Predicted Category
                </p>
                <p
                  className={`text-lg sm:text-xl lg:text-2xl font-bold ${config.accent}`}
                >
                  {prediction.category}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-slate-400 text-xs sm:text-sm">Confidence</p>
                <p
                  className={`text-2xl sm:text-3xl font-black ${config.accent}`}
                >
                  {confidencePercent}%
                </p>
              </div>
            </div>

            <div className="relative mt-3 sm:mt-4">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-transparent h-2 rounded-full opacity-30"></div>
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 ease-out shadow-lg shadow-current/20`}
                  style={{ width: `${prediction.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {prediction.top5 && prediction.top5.length > 0 && (
            <div>
              <button
                onClick={() => setExpanded(!expanded)}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border ${config.border} transition-colors duration-300 group`}
              >
                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                  Top 5 Predictions
                </span>
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    config.accent
                  } transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {expanded && (
                <div className="mt-2 sm:mt-3 space-y-2 max-h-64 overflow-y-auto scrollbar-theme">
                  {prediction.top5.map((pred, idx) => (
                    <div key={idx} className="group/item">
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg border border-slate-700/30 transition-all duration-200 gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span
                            className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-gradient-to-br ${config.gradient} text-white text-xs font-bold`}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-slate-300 truncate">
                            {pred.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                          <span
                            className={`text-xs sm:text-sm font-semibold ${config.accent}`}
                          >
                            {(pred.probability * 100).toFixed(1)}%
                          </span>
                          <div className="w-12 sm:w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-300`}
                              style={{ width: `${pred.probability * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ModelResults: React.FC<ModelResultsProps> = ({
  predictions,
  extractedText,
}) => {
  React.useEffect(() => {
    console.log("ModelResults: predictions updated", predictions);
    if (predictions) {
      console.log("Predictions keys:", Object.keys(predictions));
    }
  }, [predictions]);

  if (!predictions || Object.keys(predictions).length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-12 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-transparent to-slate-800/50 pointer-events-none"></div>
        <div className="relative">
          <div className="w-20 h-20 bg-slate-800/50 border border-slate-600/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            No Analysis Yet
          </h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Upload a resume above to unlock AI-powered predictions from 7
            advanced models
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
    <div className="space-y-12">
      <div className="relative rounded-2xl border border-slate-700/50 p-6 sm:p-8 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 opacity-80 pointer-events-none"></div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>

        <div className="relative">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3">
            Intelligence
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
              Revealed
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl">
            7 state-of-the-art AI models analyzed your resume with neural
            networks and machine learning to predict the perfect job category
          </p>
        </div>
      </div>

      {mlPreds.length > 0 && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">
                ML
              </span>
              Machine Learning Ensemble
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Classical algorithms with TF-IDF vectorization
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {mlPreds.map((modelName) => (
              <ModelCard
                key={modelName}
                modelName={modelName}
                prediction={predictions[modelName]!}
                modelType="ml"
              />
            ))}
          </div>
        </div>
      )}

      {dlPreds.length > 0 && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">
                DL
              </span>
              Deep Learning Neural Networks
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Advanced BiLSTM architectures with attention mechanisms
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {dlPreds.map((modelName) => (
              <ModelCard
                key={modelName}
                modelName={modelName}
                prediction={predictions[modelName]!}
                modelType="dl"
              />
            ))}
          </div>
        </div>
      )}

      {transformerPreds.length > 0 && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">
                TF
              </span>
              Transformer Architecture
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Cutting-edge pre-trained language model
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 w-full">
            {transformerPreds.map((modelName) => (
              <ModelCard
                key={modelName}
                modelName={modelName}
                prediction={predictions[modelName]!}
                modelType="transformer"
              />
            ))}
          </div>
        </div>
      )}

      {extractedText && (
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-6 sm:p-8 overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-transparent pointer-events-none"></div>
          <div className="relative">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Processed Resume
            </h3>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 sm:p-6 max-h-96 overflow-y-auto scrollbar-theme">
              <p className="text-slate-300 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed font-light">
                {extractedText.slice(0, 1500)}
                {extractedText.length > 1500 && "..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelResults;
