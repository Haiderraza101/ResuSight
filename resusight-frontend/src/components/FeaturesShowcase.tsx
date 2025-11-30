import React from "react";

interface Feature {
  number: string;
  title: string;
  description: string;
  gradient: string;
  border: string;
  accent: string;
}

const FeaturesShowcase: React.FC = () => {
  const features: Feature[] = [
    {
      number: "01",
      title: "Lightning Fast",
      description:
        "Analyze resumes in under 1 second with our optimized AI pipeline",
      gradient: "from-cyan-600 to-cyan-500",
      border: "border-cyan-500/30",
      accent: "text-cyan-400",
    },
    {
      number: "02",
      title: "26 Job Categories",
      description:
        "Comprehensive classification covering all professional domains",
      gradient: "from-cyan-500 to-blue-600",
      border: "border-blue-500/30",
      accent: "text-blue-400",
    },
    {
      number: "03",
      title: "7 AI Models",
      description:
        "Ensemble of Machine Learning, Deep Learning, and Transformer models",
      gradient: "from-blue-600 to-blue-500",
      border: "border-blue-500/30",
      accent: "text-blue-400",
    },
    {
      number: "04",
      title: "Ensemble Voting",
      description:
        "ML, DL, and Transformer predictions combined for superior accuracy",
      gradient: "from-cyan-600 to-blue-600",
      border: "border-cyan-500/40",
      accent: "text-cyan-300",
    },
    {
      number: "05",
      title: "Advanced NLP",
      description: "State-of-the-art semantic understanding with DistilBERT",
      gradient: "from-blue-600 to-cyan-500",
      border: "border-blue-500/40",
      accent: "text-blue-300",
    },
    {
      number: "06",
      title: "Enterprise Ready",
      description:
        "Production-ready with security, reliability, and scalability built-in",
      gradient: "from-cyan-500 to-blue-500",
      border: "border-cyan-500/40",
      accent: "text-cyan-400",
    },
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-slate-950 overflow-hidden">
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 animate-slideInUp">
            What ResuSight Delivers
          </h2>
          <p
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto animate-slideInUp"
            style={{ animationDelay: "0.1s" }}
          >
            Comprehensive resume intelligence powered by advanced AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 hover:border-opacity-100 transition-all duration-500 overflow-hidden cursor-pointer animate-slideInUp"
              style={{ animationDelay: `${0.15 + index * 0.05}s` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
              ></div>

              <div className="absolute inset-0 border border-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-cyan-500/20 group-hover:to-purple-500/10 transition-all duration-500"></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`text-5xl font-black ${feature.accent} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                  >
                    {feature.number}
                  </div>
                  <div
                    className={`w-1.5 h-10 rounded-full bg-gradient-to-b ${feature.gradient} opacity-40 group-hover:opacity-100 transition-all duration-300`}
                  ></div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-semibold text-cyan-400">
                    Learn more
                  </span>
                  <svg
                    className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative p-12 rounded-3xl overflow-hidden">
          <div className="absolute inset-0  from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 animate-float"></div>

          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Our AI Technology Stack
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="group p-4 rounded-lg bg-slate-800/50 border border-cyan-500/30  transition-all duration-300">
                  <p className="text-slate-300 transition-colors duration-300">
                    <span className="font-bold text-blue-400">
                      Machine Learning Models
                    </span>
                    <br />
                    <span className="text-sm">
                      Logistic Regression, Linear SVM, Random Forest
                    </span>
                  </p>
                </div>
                <div className="group p-4 rounded-lg bg-slate-800/50 border border-blue-500/30 ransition-all duration-300">
                  <p className="text-slate-300transition-colors duration-300">
                    <span className="font-bold text-blue-400">
                      Deep Learning Models
                    </span>
                    <br />
                    <span className="text-sm">
                      BiLSTM variants with Attention & CNN
                    </span>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="group p-4 rounded-lg bg-slate-800/50 border border-cyan-500/30  transition-all duration-300">
                  <p className="text-slate-300 transition-colors duration-300">
                    <span className="font-bold text-blue-400">
                      Transformer Model
                    </span>
                    <br />
                    <span className="text-sm">DistilBERT for advanced NLP</span>
                  </p>
                </div>
                <div className="group p-4 rounded-lg bg-slate-800/50 border border-cyan-500/30  transition-all duration-300">
                  <p className="text-slate-300 transition-colors duration-300">
                    <span className="font-bold text-blue-400">
                      Ensemble Voting
                    </span>
                    <br />
                    <span className="text-sm">
                      Combined predictions for accuracy
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
