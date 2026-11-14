import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'B Tech Credit Transfer Services in Kerala for Dropout & Backlog Students',
  description: 'Reliable B Tech credit transfer services in Kerala for dropout and backlog students — evaluate your completed subjects and resume your engineering degree from the right point.',
  path: '/best-b-tech-credit-transfer-services-in-kerala-for-dropout-backlog-students',
});

export default function BestBTechCreditTransferServicesPage() {
  return (
    <main className="min-h-screen bg-white pt-24 font-[Poppins]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#002147] text-center">
          B Tech Credit Transfer Services in Kerala for Dropout & Backlog Students
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <h2 className="text-2xl font-bold text-[#002147]">
            Why the Right Credit Transfer Service Matters
          </h2>
          <p className="text-base leading-relaxed text-justify">
            Every year, many engineering students across Kerala are forced to discontinue their B.Tech studies due to backlogs, financial constraints, personal circumstances, or issues with their college. For these students, finding the best B Tech credit transfer services in Kerala can make the difference between abandoning years of hard work and completing a recognized engineering degree. A reliable credit transfer service evaluates the subjects and semesters a student has already completed and maps them against the syllabus of a UGC and AICTE-approved university, allowing the student to resume study from the correct point instead of starting over.
          </p>
          <h2 className="text-2xl font-bold text-[#002147]">
            What End-to-End Support Looks Like
          </h2>
          <p className="text-base leading-relaxed text-justify">
            The best B Tech credit transfer services in Kerala for dropout and backlog students go beyond simple documentation support. They offer complete guidance on eligibility, help gather and verify mark sheets and transcripts, coordinate with partner universities, and clarify which subjects and backlogs need to be cleared before the transfer is approved. This kind of end-to-end support is especially valuable for students who feel unsure about where to start after a long gap in their studies, or who worry that their backlogs will disqualify them from continuing their degree.
          </p>
          <h2 className="text-2xl font-bold text-[#002147]">
            Flexible Study Modes and Completing Your Degree
          </h2>
          <p className="text-base leading-relaxed text-justify">
            Choosing the right service also means access to flexible learning modes, such as regular, distance, or online study, so students can complete their degree while managing work or other responsibilities. With the right guidance, dropout and backlog students across Kerala can transfer their earned credits, avoid repeating coursework, and complete a valid B.Tech degree that is accepted for both government and private sector employment as well as higher studies.
          </p>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="relative w-full h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/student-portrait.png"
              alt="B.Tech dropout credit transfer Kerala"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-300">
            <h3 className="text-xl font-bold text-[#002147] mb-5">Enquire Now</h3>
            <EnquiryForm className="space-y-4" isGrid={false} />
          </div>
        </div>
      </div>
<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
