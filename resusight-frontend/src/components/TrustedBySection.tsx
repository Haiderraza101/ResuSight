import React from "react";

const TrustedBySection: React.FC = () => {
  const testimonials = [
    {
      quote:
        "The parsing accuracy is awesome and it's cloud based! You get what you pay for.",
      author: "AMAR CHADIPIRALA",
      role: "CHIEF TECHNICAL OFFICER – CEIPAL",
    },
    {
      quote:
        "The quality of the parsing is hugely important. If we can't parse, and do so well, it requires extra work for the manager. We're committed to a great user experience.",
      author: "Joe Miliziano",
      role: "Chief Operating Officer",
    },
    {
      quote:
        "We could not survive without the parsing software. It has worked extremely well for us for over 20 years with hardly any issues.",
      author: "CLAUDETTE DUNLAP",
      role: "SENIOR SALES ENGINEER – TEMPWORKS",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">TRUSTED BY</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="mb-6">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <blockquote className="text-xl font-semibold text-gray-900 mb-6 leading-7">
                "{testimonial.quote}"
              </blockquote>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
            Experience the difference
          </p>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Elevate Your Recruitment to New Heights
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join the growing community of businesses that have transformed their
            recruitment processes with the power of ResuSight. Experience
            AI-powered parsing and unlock a new era of recruitment efficiency.
          </p>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-200">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
