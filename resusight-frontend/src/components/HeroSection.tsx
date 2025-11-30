import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 lg:py-20">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.8s ease-out forwards; }
        .robot-glow {
          position: relative;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15));
          box-shadow: 0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 40px rgba(6, 182, 212, 0.1);
        }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950"></div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        style={{ animation: "float 5s ease-in-out infinite" }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Branding & Text */}
          <div className="animate-slideInLeft">
            <div className="inline-flex items-center justify-start px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6 backdrop-blur-sm">
              <span className="text-xs font-medium text-cyan-300">
                AI-Powered Resume Analysis
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
              Resu
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                Sight
              </span>
            </h1>

            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 text-transparent bg-clip-text mb-4">
              Resume Intelligence Platform
            </p>

            <p className="text-lg text-slate-300 mb-3 leading-relaxed font-light max-w-lg">
              Transform your resume into actionable intelligence with our 7
              advanced AI models working in perfect ensemble harmony.
            </p>

            <p className="text-base text-slate-400 mb-8 leading-relaxed max-w-lg">
              Get instant job category detection, real-time analysis, and
              enterprise-grade accuracy in under 1 second.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="group relative px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 overflow-hidden hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Get Started Now
                  <svg
                    className="w-4 h-4"
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

              <button className="group px-8 py-3.5 bg-slate-800/40 backdrop-blur-sm text-slate-200 font-semibold rounded-lg border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                Learn More
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700/30">
              <div
                className="animate-slideInLeft"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  7
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  AI Models
                </p>
              </div>
              <div
                className="animate-slideInLeft"
                style={{ animationDelay: "0.15s" }}
              >
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  26
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Categories
                </p>
              </div>
              <div
                className="animate-slideInLeft"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  &lt;1s
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Analysis
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - AI Robot Visual */}
          <div
            className="animate-slideInRight hidden lg:block"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative h-full min-h-[500px] flex items-center justify-center">
              {/* Glowing background box */}
              <div className="absolute inset-0 robot-glow rounded-3xl backdrop-blur-md"></div>

              {/* AI Robot SVG Illustration */}
              <svg
                className="relative w-full h-full max-w-md mx-auto"
                viewBox="0 0 400 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Head */}
                <rect
                  x="100"
                  y="50"
                  width="200"
                  height="150"
                  rx="20"
                  className="fill-slate-800 stroke-cyan-500"
                  strokeWidth="2"
                />

                {/* Glow effect for head */}
                <rect
                  x="95"
                  y="45"
                  width="210"
                  height="160"
                  rx="25"
                  className="fill-none stroke-cyan-400 opacity-30"
                  strokeWidth="3"
                />

                {/* Eyes */}
                <circle cx="150" cy="110" r="15" className="fill-cyan-400" />
                <circle cx="250" cy="110" r="15" className="fill-cyan-400" />
                <circle cx="155" cy="110" r="8" className="fill-slate-900" />
                <circle cx="255" cy="110" r="8" className="fill-slate-900" />

                {/* Animated pupils */}
                <circle
                  cx="155"
                  cy="110"
                  r="4"
                  className="fill-cyan-300 animate-pulse"
                />
                <circle
                  cx="255"
                  cy="110"
                  r="4"
                  className="fill-cyan-300 animate-pulse"
                />

                {/* Mouth - AI smile */}
                <path
                  d="M 140 160 Q 200 180 260 160"
                  className="stroke-blue-400"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Body - Tech design */}
                <rect
                  x="80"
                  y="210"
                  width="240"
                  height="200"
                  rx="25"
                  className="fill-slate-800/50 stroke-blue-500"
                  strokeWidth="2"
                />

                {/* Chest panel */}
                <rect
                  x="140"
                  y="240"
                  width="120"
                  height="140"
                  rx="12"
                  className="fill-slate-700/50 stroke-cyan-400/50"
                  strokeWidth="1.5"
                />

                {/* Tech circuits - vertical lines */}
                <line
                  x1="170"
                  y1="240"
                  x2="170"
                  y2="380"
                  className="stroke-cyan-400/40"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                />
                <line
                  x1="200"
                  y1="240"
                  x2="200"
                  y2="380"
                  className="stroke-blue-400/40"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                />
                <line
                  x1="230"
                  y1="240"
                  x2="230"
                  y2="380"
                  className="stroke-cyan-400/40"
                  strokeWidth="1.5"
                  strokeDasharray="5,5"
                />

                {/* Tech circuits - horizontal lines */}
                <line
                  x1="140"
                  y1="280"
                  x2="260"
                  y2="280"
                  className="stroke-cyan-400/30"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <line
                  x1="140"
                  y1="320"
                  x2="260"
                  y2="320"
                  className="stroke-blue-400/30"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <line
                  x1="140"
                  y1="360"
                  x2="260"
                  y2="360"
                  className="stroke-cyan-400/30"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />

                {/* Left arm */}
                <rect
                  x="40"
                  y="240"
                  width="50"
                  height="60"
                  rx="20"
                  className="fill-slate-800 stroke-blue-400"
                  strokeWidth="2"
                />
                <circle
                  cx="70"
                  cy="310"
                  r="25"
                  className="fill-slate-800 stroke-cyan-400"
                  strokeWidth="2"
                />

                {/* Right arm */}
                <rect
                  x="310"
                  y="240"
                  width="50"
                  height="60"
                  rx="20"
                  className="fill-slate-800 stroke-blue-400"
                  strokeWidth="2"
                />
                <circle
                  cx="330"
                  cy="310"
                  r="25"
                  className="fill-slate-800 stroke-cyan-400"
                  strokeWidth="2"
                />

                {/* Core glow circle in chest */}
                <circle
                  cx="200"
                  cy="310"
                  r="20"
                  className="fill-cyan-500/30 stroke-cyan-400"
                  strokeWidth="2"
                />
                <circle
                  cx="200"
                  cy="310"
                  r="15"
                  className="fill-none stroke-cyan-400"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />

                {/* Legs */}
                <rect
                  x="140"
                  y="420"
                  width="40"
                  height="60"
                  rx="15"
                  className="fill-slate-800 stroke-blue-400"
                  strokeWidth="2"
                />
                <rect
                  x="220"
                  y="420"
                  width="40"
                  height="60"
                  rx="15"
                  className="fill-slate-800 stroke-blue-400"
                  strokeWidth="2"
                />

                {/* Feet */}
                <ellipse
                  cx="160"
                  cy="485"
                  rx="25"
                  ry="12"
                  className="fill-slate-700 stroke-cyan-400"
                  strokeWidth="2"
                />
                <ellipse
                  cx="240"
                  cy="485"
                  rx="25"
                  ry="12"
                  className="fill-slate-700 stroke-cyan-400"
                  strokeWidth="2"
                />
              </svg>

              {/* Floating elements around robot */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-500/10 rounded-lg blur-xl animate-float"></div>
              <div
                className="absolute bottom-20 right-10 w-24 h-24 bg-blue-500/10 rounded-lg blur-xl"
                style={{ animation: "float 5s ease-in-out infinite" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default HeroSection;
