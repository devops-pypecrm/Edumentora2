import React from 'react';
import Image from 'next/image';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import { pageMetadata } from '@/lib/seo';
import DistrictSeoContent from '@/components/DistrictSeoContent';

export const metadata = pageMetadata({
  title: 'B Tech Credit Transfer Wayanad',
  description: 'Stay on track with dependable credit transfer support in Wayanad.',
  path: '/b-tech-credit-transfer-wayanad',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Wayanad" 
        badge="Engineering Career" 
        subtitle="Stay on track with dependable credit transfer support in Wayanad."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Wayanad program provides engineering students a valuable opportunity to continue their education without losing previously earned credits. It allows students from Wayanad and nearby regions to transfer their completed semesters or subjects from one recognized university to another approved by UGC and AICTE. This program is ideal for learners who had to pause their studies due to relocation, financial issues, or institutional changes. The B Tech Credit Transfer Wayanad process includes the verification of mark sheets, transcripts, and academic records to match them with the syllabus of the new university. This ensures students can rejoin their course from the correct semester, saving time and reducing costs. It’s a flexible option for those who wish to resume their B.Tech studies through regular, online, or distance learning modes and complete their degree efficiently.
          </p>
          <p className="text-base leading-relaxed text-justify">
            Many recognized universities and study centers in Wayanad guide students through the B Tech Credit Transfer Wayanad process with complete support for document evaluation, eligibility checking, and credit mapping. The program ensures a smooth transition and helps students avoid repeating completed subjects. It’s particularly beneficial for learners who took a study break or transferred from another college. The B Tech Credit Transfer Wayanad program helps students maintain academic continuity and complete their B.Tech degree without losing valuable years of effort. With expert counseling, transparent procedures, and university approval, students can confidently complete their engineering degree and strengthen their career prospects. This initiative gives a new start to students looking to complete their education and achieve recognized academic success.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/apprenticeship-professionals.png"
              alt="B.Tech credit transfer Wayanad"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </div>


      {/* Extra SEO content for this location */}
      <DistrictSeoContent district="wayanad" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-300 w-full">
          <h3 className="text-xl font-bold text-[#002147] mb-6 text-center">Enquire Now</h3>
          <EnquiryForm className="grid grid-cols-1 md:grid-cols-2 gap-4" isGrid={true} />
        </div>
      </div>
<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
