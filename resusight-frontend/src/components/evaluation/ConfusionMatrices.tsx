import React, { useState, useEffect } from "react";

interface ConfusionMatricesProps {
  matrices: Record<string, number[][]> | null | undefined;
  labels: string[] | null | undefined;
}

const ConfusionMatrices: React.FC<ConfusionMatricesProps> = ({
  matrices,
  labels,
}) => {
  // Debug: Raw props
  console.log("🔍 ConfusionMatrices Props:", {
    matrices,
    labels,
  });

  // ---------------------------
  // Guard: Handle missing data
  // ---------------------------
  if (
    !matrices ||
    Object.keys(matrices).length === 0 ||
    !labels ||
    labels.length === 0
  ) {
    console.warn("⚠️ ConfusionMatrices: Missing matrices or labels.");
    return (
      <div className="text-gray-400 text-sm border p-4 rounded-xl bg-gray-50">
        No confusion matrices available.
      </div>
    );
  }

  // Extract model names safely
  const modelKeys = Object.keys(matrices ?? {});
  console.log("📌 Model Keys:", modelKeys);

  const [selectedModel, setSelectedModel] = useState<string>(
    modelKeys[0] ?? ""
  );

  // Log when selected model changes
  useEffect(() => {
    console.log("🔄 Selected Model changed:", selectedModel);
  }, [selectedModel]);

  const matrix = matrices[selectedModel];

  // ---------------------------
  // Ensure matrix exists
  // ---------------------------
  if (!matrix) {
    console.error("❌ No matrix found for model:", selectedModel);
    return (
      <div className="text-gray-400 text-sm border p-4 rounded-xl bg-gray-50">
        Selected model has no matrix available.
      </div>
    );
  }

  console.log(`📊 Matrix for ${selectedModel}:`, matrix);

  const getColor = (value: number) => {
    const intensity = Math.min(255 - value * 20, 255);
    return `rgb(${intensity}, ${255}, ${intensity})`;
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl border">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Confusion Matrix
      </h2>

      {/* Model Selection */}
      <div className="mb-4">
        <label className="mr-2 font-medium text-gray-700">Select Model:</label>
        <select
          value={selectedModel}
          onChange={(e) => {
            console.log("🟦 User selected model:", e.target.value);
            setSelectedModel(e.target.value);
          }}
          className="border px-3 py-1 rounded-md shadow-sm text-gray-700 bg-white"
        >
          {modelKeys.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Confusion Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th></th>
              {labels.map((label) => (
                <th
                  key={label}
                  className="px-3 py-2 border text-sm font-semibold text-gray-700"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {matrix.map((row, i) => {
              console.log(`🧩 Row ${i}`, row);
              return (
                <tr key={i}>
                  <th className="px-3 py-2 border text-sm font-medium text-gray-700">
                    {labels[i]}
                  </th>

                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border text-center text-sm w-16 h-12"
                      style={{ backgroundColor: getColor(cell) }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfusionMatrices;
