import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import ModelResults from './components/ModelResults';
import { PredictionResult } from './services/api';
import './App.css';

function App() {
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);

  const handlePredictionComplete = (results: PredictionResult) => {
    setPredictions(results);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ResuSight</h1>
        <p>Intelligent Resume Screening and Job Matching System</p>
      </header>
      
      <main className="App-main">
        <ResumeUpload onPredictionComplete={handlePredictionComplete} />
        <ModelResults predictions={predictions} />
      </main>
    </div>
  );
}

export default App;
