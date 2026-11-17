'use client';

import { useState } from 'react';

type Faq = { id: string; q: string; a: string };

// Home page FAQ, managed from Admin → FAQ → Home FAQ. Answers are always in
// the HTML (only visually collapsed), so search engines can read them.
export default function HomeFaqSection({ faqs }: { faqs: Faq[] }) {
  // All questions start closed; an answer shows only after its question is clicked.
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" aria-labelledby="home-faq-heading" className="w-full bg-white px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h2 id="home-faq-heading" className="mb-3 text-center text-3xl font-bold text-[#002147] md:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto mb-10 h-1.5 w-16 rounded-full bg-[#F9010D]" />

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <h3>
                  <button
                    type="button"
                    id={`home-faq-question-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`home-faq-answer-${index}`}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className={`flex w-full items-center justify-between gap-4 p-5 text-left transition-colors duration-300 md:p-6 ${isOpen ? 'bg-[#002147]' : 'bg-gray-50 hover:bg-[#002147]/[0.06]'}`}
                  >
                    <span className={`text-base font-bold md:text-lg ${isOpen ? 'text-white' : 'text-[#002147]'}`}>{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className={`flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-[#F9010D]'}`}
                    >
                      ▼
                    </span>
                  </button>
                </h3>
                <div
                  id={`home-faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`home-faq-question-${index}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="whitespace-pre-line border-t border-gray-100 bg-white p-5 leading-relaxed text-gray-700 md:p-6">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
