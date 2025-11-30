import React, { useEffect, useState } from 'react';
import ApiService from '../services/api';
import PerformanceMetrics from './evaluation/PerformanceMetrics';
import ConfusionMatrices from './evaluation/ConfusionMatrices';
import TrainingHistory from './evaluation/TrainingHistory';
import LearningCurves from './evaluation/LearningCurves';

const ModelEvaluation: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'metrics' | 'confusion' | 'history' | 'learning'>('metrics');
  
  const [metrics, setMetrics] = useState<any>(null);
  const [confusionMatrices, setConfusionMatrices] = useState<any>(null);
  const [trainingHistory, setTrainingHistory] = useState<any>(null);
  const [learningCurves, setLearningCurves] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [metricsData, cmData, historyData, curvesData] = await Promise.allSettled([
          ApiService.getModelMetrics(),
          ApiService.getConfusionMatrices(),
          ApiService.getTrainingHistory(),
          ApiService.getLearningCurves()
        ]);

        // Handle results
        if (metricsData.status === 'fulfilled') setMetrics(metricsData.value);
        if (cmData.status === 'fulfilled') setConfusionMatrices(cmData.value);
        if (historyData.status === 'fulfilled') setTrainingHistory(historyData.value);
        if (curvesData.status === 'fulfilled') setLearningCurves(curvesData.value);

      } catch (err: any) {
        setError(err.message || 'Failed to load evaluation data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 animate-pulse">Loading model evaluation data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block p-4 rounded-full bg-red-500/10 text-red-500 mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Failed to Load Data</h3>
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'metrics', label: 'Performance Metrics' },
    { id: 'confusion', label: 'Confusion Matrices' },
    { id: 'history', label: 'Training History (DL)' },
    { id: 'learning', label: 'Learning Curves (ML)' },
  ];

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Model <span className="text-cyan-400">Evaluation</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Comprehensive analysis of our 7 AI models using standard performance metrics, 
          confusion matrices, and training visualizations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm min-h-[500px]">
        {activeTab === 'metrics' && (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
            <PerformanceMetrics metrics={metrics} />
          </div>
        )}

        {activeTab === 'confusion' && (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6">Confusion Matrices</h3>
            <ConfusionMatrices matrices={confusionMatrices?.confusionMatrices || confusionMatrices} labels={confusionMatrices?.labels || []} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6">Training History (Deep Learning & Transformer)</h3>
            <TrainingHistory history={trainingHistory} />
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-6">Learning Curves (Machine Learning)</h3>
            <LearningCurves curves={learningCurves} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelEvaluation;
