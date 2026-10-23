'use client';

import React, { useState } from 'react';

type Faq = { q: string; a: string };

// Same visual pattern/interaction as the FAQ accordion on /about-us and
// /b-tech-credit-transfer — kept as a small client component so the FAQ text
// itself still renders in the server-rendered HTML (via the parent server
// page.tsx), only the open/close interactivity is client-side.
export default function ErnakulamFaq({ faqs }: { faqs: Faq[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="group border border-gray-200 rounded-2xl overflow-hidden bg-white transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
          onClick={() => setOpenFaq(openFaq === index ? null : index)}
        >
          <div className={`p-6 flex justify-between items-center transition-colors duration-300 ${openFaq === index ? 'bg-[#002147]' : 'bg-gray-50 hover:bg-[#002147]'}`}>
            <h3 className={`font-bold text-lg transition-colors pr-4 ${openFaq === index ? 'text-white' : 'text-[#002147] group-hover:text-white'}`}>
              {faq.q}
            </h3>
            <span className={`transform transition-all duration-300 flex-shrink-0 ${openFaq === index ? 'text-white rotate-180' : 'text-[#F9010D] group-hover:text-white'}`}>
              ▼
            </span>
          </div>
          <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${openFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <p className="p-6 text-gray-700 bg-white border-t border-gray-100 leading-relaxed text-justify">
                {faq.a}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
