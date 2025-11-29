import React from "react";

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: "Improve data-driven decisions",
      description:
        "Enriched and complete candidate and jobs data is the foundation of accurate search, match and analytics capabilities.",
      icon: "📊",
    },
    {
      title: "Streamline recruitment processes",
      description:
        "Enhance recruitment accuracy, minimize data entry errors, and standardize input with automated data extraction.",
      icon: "⚡",
    },
    {
      title: "Reduce bias",
      description:
        "Focus on skills and ensure fair hiring by only displaying relevant extracted data.",
      icon: "🎯",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Right Talent, Faster and Smarter
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our parsing solutions transform your recruitment strategy,
            empowering talent acquisition teams to work smarter and find the
            right talent for every job posting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-7">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-wide mb-4 opacity-90">
            Experience the power of ResuSight parsing
          </p>
          <h3 className="text-3xl font-bold mb-6">
            Unleash the combined power of advanced resume parsing capabilities
          </h3>
          <button className="px-8 py-4 bg-white text-blue-600 rounded font-semibold shadow-lg hover:bg-gray-100 transition-colors duration-200">
            Find out more
          </button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
