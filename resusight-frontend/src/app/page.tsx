"use client";

import React, { useState } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturesShowcase from "@/components/FeaturesShowcase";
import ResumeUpload from "@/components/ResumeUpload";
import ModelResults from "@/components/ModelResults";
import Footer from "@/components/Footer";
import { PredictionResult } from "@/services/api";

export default function Home() {
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [extractedText, setExtractedText] = useState<string | undefined>();

  const handlePredictionComplete = (
    results: PredictionResult,
    text?: string
  ) => {
    console.log("page.tsx: handlePredictionComplete called");
    console.log("Results received:", results);
    console.log("Text length:", text?.length);
    setPredictions(results);
    setExtractedText(text);
  };

  return (
    <div className="w-full bg-slate-950">
      <HeroSection />
      <FeaturesShowcase />

      <section className="py-12 lg:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResumeUpload onPredictionComplete={handlePredictionComplete} />

          <div className="mt-12">
            <ModelResults
              predictions={predictions}
              extractedText={extractedText}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
