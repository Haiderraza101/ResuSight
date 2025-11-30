import React, { useState } from 'react';

interface ConfusionMatricesProps {
  matrices: Record<string, number[][]>;
  labels: string[];
}

const ConfusionMatrices: React.FC<ConfusionMatricesProps> = ({ matrices, labels }) => {
  const [selectedModel, setSelectedModel] = useState<string>(Object.keys(matrices)[0]);

  if (!matrices || Object.keys(matrices).length === 0) {
    return <div className="text-slate-400">No confusion matrices available</div>;
  }

  const matrix = matrices[selectedModel];
  const maxValue = Math.max(...matrix.flat());

  // Helper to get color intensity
  const getColor = (value: number) => {
    if (value === 0) return 'bg-slate-900';
    const intensity = Math.min(Math.ceil((value / maxValue) * 900), 900);
    // Map to tailwind blue shades roughly
    if (intensity < 100) return 'bg-blue-950 text-slate-400';
    if (intensity < 300) return 'bg-blue-900 text-slate-200';
    if (intensity < 500) return 'bg-blue-800 text-white';
    if (intensity < 700) return 'bg-blue-700 text-white';
    return 'bg-blue-600 text-white font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Model Selector */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(matrices).map((model) => (
          <button
            key={model}
            onClick={() => setSelectedModel(model)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedModel === model
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {model}
          </button>
        ))}
      </div>

      {/* Matrix Visualization */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <div 
              className="grid gap-px bg-slate-700"
              style={{ 
                gridTemplateColumns: `auto repeat(${labels.length}, minmax(40px, 1fr))` 
              }}
            >
              {/* Header Row */}
              <div className="bg-slate-800 p-2 text-xs font-bold text-slate-400 text-center sticky left-0 z-10">
                True \ Pred
              </div>
              {labels.map((label, i) => (
                <div key={`h-${i}`} className="bg-slate-800 p-2 text-xs text-slate-400 text-center truncate" title={label}>
                  {label.substring(0, 3)}
                </div>
              ))}

              {/* Data Rows */}
              {matrix.map((row, i) => (
                <React.Fragment key={`row-${i}`}>
                  {/* Row Label */}
                  <div className="bg-slate-800 p-2 text-xs text-slate-400 font-medium truncate sticky left-0 z-10" title={labels[i]}>
                    {labels[i]}
                  </div>
                  {/* Cells */}
                  {row.map((value, j) => (
                    <div
                      key={`cell-${i}-${j}`}
                      className={`${getColor(value)} p-2 text-xs text-center flex items-center justify-center transition-colors hover:ring-1 hover:ring-cyan-400 hover:z-20`}
                      title={`True: ${labels[i]}, Pred: ${labels[j]}, Count: ${value}`}
                    >
                      {value > 0 ? value : ''}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 text-center mt-2">
        Hover over cells to see details. Darker blue indicates higher values.
      </p>
    </div>
  );
};

export default ConfusionMatrices;
