"use client";

import React, { useState } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturesShowcase from "@/components/FeaturesShowcase";
import ResumeUpload from "@/components/ResumeUpload";
import ModelResults from "@/components/ModelResults";
import Footer from "@/components/Footer";
import { PredictionResult } from "@/services/api";
import Link from "next/link"; // Added Link import

export default function Home() {
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [extractedText, setExtractedText] = useState<string | undefined>();

  // Renamed function to match the new prop name on ResumeUpload
  const handlePredictionsReceived = (
    results: PredictionResult,
    text?: string
  ) => {
    console.log("page.tsx: handlePredictionsReceived called");
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
          {/* Upload Section */}
          <div className="max-w-7xl mx-auto">
            {/* Changed prop name from onPredictionComplete to onPredictionsReceived */}
            <ResumeUpload onPredictionsReceived={handlePredictionsReceived} />
          </div>
        </div>
      </section>

      {/* Results Section - Conditionally rendered */}
      {predictions && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ModelResults
              predictions={predictions}
              extractedText={extractedText}
            />

            {/* Evaluation Button - Shown only after results */}
            <div className="flex justify-center mt-16">
              <Link
                href="/evaluation"
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/200 transition-all duration-300 overflow-hidden inline-flex items-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 "></div>
                <span className="relative flex items-center gap-3">
                  View Detailed Model Evaluation & Metrics
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
