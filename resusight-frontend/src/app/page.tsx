"use client";

import React, { useState } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import ResumeUpload from "@/components/ResumeUpload";
import ModelResults from "@/components/ModelResults";
import TrustedBySection from "@/components/TrustedBySection";
import Footer from "@/components/Footer";
import { PredictionResult } from "@/services/api";

export default function Home() {
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [extractedText, setExtractedText] = useState<string | undefined>();

  const handlePredictionComplete = (
    results: PredictionResult,
    text?: string
  ) => {
    setPredictions(results);
    setExtractedText(text);
  };

  return (
    <div className="w-full bg-white">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <ResumeUpload onPredictionComplete={handlePredictionComplete} />

          <div className="mt-12">
            <ModelResults
              predictions={predictions}
              extractedText={extractedText}
            />
          </div>
        </div>
      </section>

      <TrustedBySection />
      <Footer />
    </div>
  );
}
