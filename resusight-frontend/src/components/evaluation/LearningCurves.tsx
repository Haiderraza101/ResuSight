import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ErrorBar,
} from 'recharts';

interface LearningCurveData {
  train_sizes: number[];
  train_scores: number[][];
  test_scores: number[][];
}

interface LearningCurvesProps {
  curves: Record<string, LearningCurveData>;
}

const LearningCurves: React.FC<LearningCurvesProps> = ({ curves }) => {
  if (!curves || Object.keys(curves).length === 0) {
    return <div className="text-slate-400">No learning curves available</div>;
  }

  // Helper to calculate mean and std
  const processData = (data: LearningCurveData) => {
    return data.train_sizes.map((size, i) => {
      const trainScores = data.train_scores[i];
      const testScores = data.test_scores[i];
      
      const trainMean = trainScores.reduce((a, b) => a + b, 0) / trainScores.length;
      const testMean = testScores.reduce((a, b) => a + b, 0) / testScores.length;
      
      // Simple std dev calculation
      const trainStd = Math.sqrt(trainScores.map(x => Math.pow(x - trainMean, 2)).reduce((a, b) => a + b) / trainScores.length);
      const testStd = Math.sqrt(testScores.map(x => Math.pow(x - testMean, 2)).reduce((a, b) => a + b) / testScores.length);

      return {
        size,
        trainMean,
        testMean,
        // Recharts ErrorBar expects error as [minus, plus] relative to value
        trainError: [trainStd, trainStd], 
        testError: [testStd, testStd],
      };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {Object.entries(curves).map(([modelName, data]) => {
        const chartData = processData(data);

        return (
          <div key={modelName} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 border-l-4 border-green-500 pl-3">
              {modelName}
            </h3>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="size" 
                    stroke="#94a3b8" 
                    label={{ value: 'Training Examples', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    domain={[0.7, 1]} 
                    label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(value: number) => value.toFixed(4)}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  
                  <Line type="monotone" dataKey="trainMean" stroke="#ef4444" name="Training Score" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="testMean" stroke="#22c55e" name="CV Score" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LearningCurves;
