import React from "react";

const TrustedBySection: React.FC = () => {
  const testimonials = [
    {
      quote:
        "The parsing accuracy is awesome and it's cloud based! You get what you pay for.",
      author: "AMAR CHADIPIRALA",
      role: "CHIEF TECHNICAL OFFICER – CEIPAL",
      color: "from-cyan-600 to-cyan-500",
      borderColor: "border-cyan-500/40",
    },
    {
      quote:
        "The quality of the parsing is hugely important. If we can't parse, and do so well, it requires extra work for the manager. We're committed to a great user experience.",
      author: "Joe Miliziano",
      role: "Chief Operating Officer",
      color: "from-cyan-500 to-blue-600",
      borderColor: "border-blue-500/40",
    },
    {
      quote:
        "We could not survive without the parsing software. It has worked extremely well for us for over 20 years with hardly any issues.",
      author: "CLAUDETTE DUNLAP",
      role: "SENIOR SALES ENGINEER – TEMPWORKS",
      color: "from-blue-600 to-blue-500",
      borderColor: "border-blue-500/40",
    },
  ];

  return (
    <section className="relative py-20 bg-slate-950 overflow-hidden">
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
        .testimonial-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s duration;
        }
        .testimonial-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(6, 182, 212, 0.15);
        }
      `}</style>

      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        style={{ animation: "float 5s ease-in-out infinite" }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-sm font-medium text-cyan-300">
              ⭐ Trusted By Industry Leaders
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
            What Our Users Are Saying
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of recruitment professionals and companies who trust
            ResuSight to transform their hiring process.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card group p-8 sm:p-10 border ${testimonial.borderColor}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none`}
              ></div>

              <div className="relative">
                {/* Quote icon */}
                <div className="mb-6">
                  <svg
                    className={`w-14 h-14 bg-gradient-to-br ${testimonial.color} text-transparent bg-clip-text`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Quote text */}
                <blockquote className="text-xl sm:text-2xl font-bold text-white mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author info */}
                <div className={`border-t ${testimonial.borderColor} pt-6`}>
                  <p className="font-bold text-white text-lg">
                    {testimonial.author}
                  </p>
                  <p className="text-slate-300 text-sm sm:text-base mt-1">
                    {testimonial.role}
                  </p>
                </div>

                {/* Accent gradient bar */}
                <div
                  className={`absolute top-0 right-0 w-1 h-12 bg-gradient-to-b ${testimonial.color} opacity-40 rounded-full`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="group relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative bg-gradient-to-br from-slate-800/60 to-blue-900/20 backdrop-blur-md border border-cyan-500/30 rounded-3xl p-12 sm:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-medium text-cyan-300 uppercase tracking-widest mb-4">
                Transform Your Recruitment Process
              </p>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
                Ready to Experience the ResuSight
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                  Difference?
                </span>
              </h3>

              <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                Join the growing community of businesses that have
                revolutionized their recruitment with AI-powered resume parsing.
                Unlock unparalleled accuracy, speed, and efficiency in finding
                the right talent.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group/btn relative px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 overflow-hidden hover:scale-105 text-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Get Started Now
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

                <button className="group/btn relative px-10 py-4 border-2 border-cyan-500/40 text-cyan-300 font-bold rounded-lg hover:border-cyan-500 transition-all duration-300 overflow-hidden hover:scale-105 text-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Schedule Demo
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent shapes */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2"></div>
    </section>
  );
};

export default TrustedBySection;
