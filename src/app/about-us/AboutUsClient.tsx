'use client';

import React, { useState } from 'react';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import LocationsSection from '@/components/LocationsSection';

type Faq = { id: string; q: string; a: string };

export default function AboutUsClient({ faqs }: { faqs: Faq[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      {/* Hero Section */}
      <PageBanner
        badge="About Edumentora"
        title="Transform Past Efforts into Future Success"
        subtitle="Edumentora makes restarting your education easy by transferring past credits to accredited universities, saving you time and money."
        isGradientText={true}
      />

      <AboutSection />

      {/* Overview Section */}
      <div className="bg-white py-24 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-lg md:text-xl text-[#002147]/90 leading-relaxed text-justify md:text-center font-medium">
            Edumentora is an innovative education service provider that specializes in academic credit transfer solutions, helping students across India restart and complete their discontinued degree programs. Whether due to financial hardship, personal setbacks, academic difficulties, or institutional issues, many students pause their education, but with Edumentora, they don’t have to start over. We make it possible to transfer previously earned college or university credits to UGC-recognized institutions, allowing students to pick up where they left off. Our goal is to ensure that prior academic efforts are not wasted and that every learner gets a second chance to earn a respected qualification. At Edumentora, we’re committed to turning past progress into future success through reliable, student-focused credit transfer services.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-24 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002147] text-center mb-12">
            Frequently Asked Questions
          </h2>
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
                  <span className={`transform transition-all duration-300 flex-shrink-0 ${openFaq === index ? 'text-white rotate-180' : 'text-[#E91D24] group-hover:text-white'}`}>
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
        </div>
      </div>

      {/* Best Credit Transfer Institute Section */}
      <div className="bg-white py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 text-lg text-gray-700 leading-relaxed text-justify">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002147] text-center mb-10">
            The Credit Transfer Institute
          </h2>
          <p>
            When students think about shifting to another college or university, one of the biggest worries is whether their earlier studies will still count. Nobody wants to repeat the same subjects or lose valuable years. This is where choosing the Credit Transfer Institute makes all the difference.
          </p>
          <p>
            The Credit Transfer Institute gives students a chance to carry their credits from one institution to another without starting the degree all over again. By submitting mark sheets, subject details, and the syllabus of the courses already completed, students can have their past work evaluated. Once the credits are approved, they can continue their studies directly from the right semester.
          </p>
          <p>
            For students who want to move forward without wasting time or money, the Credit Transfer Institute provides the right pathway. It makes sure that the effort already put in is not ignored, and it allows students to complete their education in a smooth and stress-free manner.
          </p>
          <p>
            Many learners face unexpected changes in life, but with the help of the Credit Transfer Institute, their education remains on track. It values hard work, supports growth, and opens doors to better opportunities.
          </p>
        </div>
      </div>

      <LocationsSection />
<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
