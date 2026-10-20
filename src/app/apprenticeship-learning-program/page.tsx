import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import PageBanner from '@/components/PageBanner';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Apprenticeship Learning Program',
  description: "Edumentora's apprenticeship credit transfer lets you carry your earned experience to new opportunities — stay on track, keep learning, and grow without interruption.",
  path: '/apprenticeship-learning-program',
});

export default function ApprenticeshipLearningProgram() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner>
        <div className="grid md:grid-cols-2 gap-12 items-center pt-8">
          {/* Left: Text */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#002147] leading-tight">
              Apprenticeship program at Edumentora
            </h1>
            <p className="text-lg md:text-xl text-[#002147]/90 leading-relaxed text-justify">
              Edumentora’s apprenticeship credit transfer lets you carry your earned experience to new opportunities. Stay on track, keep learning, and grow without interruption.
            </p>
            <button className="bg-[#8B0000] hover:bg-[#5C0000] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg w-max mt-4">
              Know More
            </button>
          </div>

          {/* Right: Image */}
          <div className="relative h-[300px] md:h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
            <img
              src="/apprenticeship-hero.png"
              alt="Apprenticeship program at Edumentora"
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </div>
        </div>
      </PageBanner>

      {/* EALP Overview Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002147]">
            Employee Apprenticeship-Learning Program (EALP)
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold text-[#E91D24] leading-relaxed">
            Earn a Recognized Degree Faster by Converting Your Work Experience into Academic Credits
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed text-justify md:text-center mt-6">
            The Employee Apprenticeship-Based Learning Program (EALP) is a unique opportunity for working professionals to complete their degree without restarting from the beginning. This program recognizes your work experience and converts it into academic credits, allowing you to earn a UG or PG degree in a shorter time while continuing your job.
          </p>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-[#002147] text-center mb-16">
          How it Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-[#E91D24]/10 text-[#E91D24] rounded-2xl flex items-center justify-center font-black text-2xl mb-6 shadow-sm border border-[#E91D24]/25">1</div>
            <h3 className="text-xl font-bold text-[#002147] mb-4">Work Experience as Academic Credits</h3>
            <p className="text-gray-600 leading-relaxed">
              If you have 2+ years of work experience, it will be evaluated and counted as part of your degree. You don’t need to study subjects where you already have practical knowledge.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-[#E91D24]/10 text-[#E91D24] rounded-2xl flex items-center justify-center font-black text-2xl mb-6 shadow-sm border border-[#E91D24]/25">2</div>
            <h3 className="text-xl font-bold text-[#002147] mb-4">Reduced Study Duration</h3>
            <p className="text-gray-600 leading-relaxed">
              Instead of the traditional 3–4-year degree, your work experience helps you complete the course faster. The exact duration depends on your experience and the course requirements.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-[#E91D24]/10 text-[#E91D24] rounded-2xl flex items-center justify-center font-black text-2xl mb-6 shadow-sm border border-[#E91D24]/25">3</div>
            <h3 className="text-xl font-bold text-[#002147] mb-4">Flexible Learning Options</h3>
            <p className="text-gray-600 leading-relaxed">
              Study through online classes, weekend sessions, or a hybrid model while continuing your job. Course content is industry-relevant, ensuring practical learning.
            </p>
          </div>
        </div>
      </div>

      {/* Programs and Eligibility Section */}
      <div className="bg-white text-[#002147] py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-16">
            {/* Available Programs */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Available Degree Programs</h2>
              <h3 className="text-xl font-semibold text-[#E91D24] mb-6 border-b border-[#002147]/15 pb-4">Undergraduate Programs</h3>
              <ul className="space-y-4 text-lg text-gray-600 mb-10">
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">BBA</strong> (Bachelor of Business Administration) – Ideal for business professionals</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">B.Com</strong> (Bachelor of Commerce) – Perfect for accountants and finance experts</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">BCA</strong> (Bachelor of Computer Applications) – Best for IT professionals</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">B.Sc IT</strong> (Bachelor of Science in Information Technology) – For software and tech experts</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">B.Tech</strong> (Bachelor of Technology) – Suitable for engineering professionals in various fields</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">BA</strong> (Bachelor of Arts) – Various specializations in humanities and social sciences</span></li>
              </ul>

              <h3 className="text-xl font-semibold text-[#E91D24] mb-6 border-b border-[#002147]/15 pb-4">Postgraduate Programs</h3>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">MBA</strong> (Master of Business Administration) – For career growth in management</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">M.Com</strong> (Master of Commerce) – Advanced knowledge for commerce and finance professionals</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">MCA</strong> (Master of Computer Applications) – Higher studies in IT and computer applications</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span><strong className="text-[#002147]">M.Tech</strong> (Master of Technology) – For engineers looking for specialization and advanced knowledge</span></li>
              </ul>
            </div>

            {/* Who Can Apply? */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Who Can Apply?</h2>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span>Working professionals who discontinued their studies and want to complete their degree.</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span>Employees with 2+ years of industry experience who want an academic qualification.</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span>People seeking career growth and better job opportunities.</span></li>
                <li className="flex items-start"><span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span> <span>Corporate professionals who want to upskill and move up the career ladder.</span></li>
              </ul>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-[#002147]/15">
            <img
              src="/apprenticeship-professionals.png"
              alt="Working professionals studying"
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </div>
        </div>
      </div>

      {/* Why Choose EALP Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002147] text-center mb-10">
            Why Choose EALP?
          </h2>
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
            <ul className="space-y-5 text-lg text-gray-700 mb-10">
              <li className="flex items-start">
                <span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span>
                <span><strong>Complete Your Degree Faster</strong> – Work experience reduces study time.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span>
                <span><strong>Work & Study Together</strong> – No need to quit your job.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span>
                <span><strong>Flexible Learning</strong> – Online, weekend, or hybrid classes available.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span>
                <span><strong>Recognized Degree</strong> – Accepted for jobs, promotions, and further studies.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E91D24] mr-3 font-bold text-xl">➤</span>
                <span><strong>Industry-Relevant Curriculum</strong> – Courses designed to match your field of work.</span>
              </li>
            </ul>
            <p className="text-lg text-gray-800 leading-relaxed text-center font-medium border-t border-gray-200 pt-8">
              This program helps you achieve your educational goals while leveraging your professional experience. Your hard work and skills deserve academic recognition—now you can earn your degree without starting from scratch!
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147]">
              Start Your Journey with Edumentora
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Fill out the form below and our experts will get back to you shortly.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            <EnquiryForm className="space-y-6" isGrid={false} />
          </div>
        </div>
      </div>
<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
