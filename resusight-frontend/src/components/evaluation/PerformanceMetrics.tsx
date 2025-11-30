import React from 'react';

interface Metrics {
  Accuracy: number;
  Precision: number;
  Recall: number;
  "F1-score": number;
  "Top-3 Accuracy": number;
  "Top-5 Accuracy": number;
}

interface PerformanceMetricsProps {
  metrics: Record<string, Metrics>;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return <div className="text-slate-400">No metrics available</div>;
  }

  const modelNames = Object.keys(metrics);
  const metricNames = Object.keys(metrics[modelNames[0]]) as (keyof Metrics)[];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
          <tr>
            <th className="px-6 py-3 rounded-tl-lg">Model</th>
            {metricNames.map((name) => (
              <th key={name} className="px-6 py-3">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modelNames.map((model) => (
            <tr key={model} className="bg-slate-900/30 border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 font-medium text-white">{model}</td>
              {metricNames.map((metric) => (
                <td key={`${model}-${metric}`} className="px-6 py-4">
                  {(metrics[model][metric] * 100).toFixed(2)}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceMetrics;
