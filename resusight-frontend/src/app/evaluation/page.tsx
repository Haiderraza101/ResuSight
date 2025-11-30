"use client";

import React from "react";
import Link from "next/link";
import ModelEvaluation from "@/components/ModelEvaluation";

export default function EvaluationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Navigation */}
      <nav className="p-6">
        <div className="container mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700/50 hover:border-cyan-500/30"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <ModelEvaluation />
      </div>
    </main>
  );
}
