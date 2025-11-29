import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-4">
          Fast, Accurate, Multilingual Resume & Job Parsing
        </p>

        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          RESUSIGHT: GROUNDBREAKING
          <br />
          <span className="text-blue-600">PARSING TECHNOLOGY</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-7">
          Embrace the transformative power of ResuSight, an intelligent resume
          screening system that empowers you to streamline your recruitment
          process and make informed hiring decisions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg">
            Start your free trial $0/ month
          </button>
          <button className="px-8 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
            Find out more
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Unparalleled Speed and Accuracy
            </h3>
            <p className="text-gray-600 text-sm">
              Process resumes with unmatched speed and accuracy, ensuring you
              don't miss a single qualified candidate.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Multilingual Mastery
            </h3>
            <p className="text-gray-600 text-sm">
              Extract and enrich data from resumes in multiple languages,
              expanding your talent pool worldwide.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Precision-Driven Matching
            </h3>
            <p className="text-gray-600 text-sm">
              Swiftly filter, search, rank, and match candidates with pinpoint
              accuracy, eliminating manual processes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
