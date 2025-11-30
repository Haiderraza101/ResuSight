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
} from 'recharts';

interface HistoryData {
  train_loss: number[];
  val_loss: number[];
  train_acc: number[];
  val_acc: number[];
}

interface TrainingHistoryProps {
  history: Record<string, HistoryData>;
}

const TrainingHistory: React.FC<TrainingHistoryProps> = ({ history }) => {
  if (!history || Object.keys(history).length === 0) {
    return <div className="text-slate-400">No training history available</div>;
  }

  return (
    <div className="space-y-12">
      {Object.entries(history).map(([modelName, data]) => {
        // Transform data for Recharts
        const chartData = data.train_loss.map((_, index) => ({
          epoch: index + 1,
          train_loss: data.train_loss[index],
          val_loss: data.val_loss[index],
          train_acc: data.train_acc[index],
          val_acc: data.val_acc[index],
        }));

        return (
          <div key={modelName} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-3">
              {modelName}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Loss Chart */}
              <div className="h-[300px]">
                <h4 className="text-sm font-medium text-slate-400 mb-4 text-center">Loss over Epochs</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="epoch" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="train_loss" stroke="#ef4444" name="Train Loss" dot={false} />
                    <Line type="monotone" dataKey="val_loss" stroke="#f97316" name="Val Loss" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Accuracy Chart */}
              <div className="h-[300px]">
                <h4 className="text-sm font-medium text-slate-400 mb-4 text-center">Accuracy over Epochs</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="epoch" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 1]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="train_acc" stroke="#3b82f6" name="Train Acc" dot={false} />
                    <Line type="monotone" dataKey="val_acc" stroke="#22c55e" name="Val Acc" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainingHistory;
