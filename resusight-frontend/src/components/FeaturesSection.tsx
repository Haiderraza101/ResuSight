import React from "react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Process resumes in seconds with our optimized ML pipeline",
      color: "from-cyan-600 to-cyan-500",
      borderColor: "border-cyan-500/30",
    },
    {
      icon: "🎯",
      title: "99%+ Accuracy",
      description: "Dual ML models ensure precise job category classification",
      color: "from-cyan-500 to-blue-600",
      borderColor: "border-blue-500/30",
    },
    {
      icon: "🌍",
      title: "Multilingual",
      description: "Support for 50+ languages across the globe",
      color: "from-blue-600 to-blue-500",
      borderColor: "border-blue-500/30",
    },
    {
      icon: "🤖",
      title: "AI-Powered",
      description: "Advanced machine learning for smart categorization",
      color: "from-cyan-600 to-blue-600",
      borderColor: "border-cyan-500/30",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-20 bg-slate-950 overflow-hidden"
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out forwards; }
        .feature-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s duration;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(6, 182, 212, 0.2);
        }
      `}</style>

      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        style={{ animation: "float 5s ease-in-out infinite" }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-sm font-medium text-cyan-300">
              ✨ Powered by Advanced Technology
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Why ResuSight
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
              Delivers Excellence
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Our revolutionary system seamlessly integrates advanced resume
            parsing capabilities with market-leading ML engines, delivering
            unmatched performance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card group p-8 border ${feature.borderColor}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none`}
              ></div>

              <div className="relative">
                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 text-2xl shadow-lg`}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>

                {/* Subtle accent line */}
                <div
                  className={`absolute top-0 right-0 w-1 h-12 bg-gradient-to-b ${feature.color} opacity-30 rounded-full`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative group rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-slate-800/50 to-blue-900/30 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-12 sm:p-16 text-center">
            <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Recruitment Process?
              </span>
            </h3>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of companies already using ResuSight to streamline
              their hiring with AI-powered precision.
            </p>
            <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 overflow-hidden hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                Get Started Today
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom accent shapes */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
    </section>
  );
};

export default FeaturesSection;
