import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import { pageMetadata } from '@/lib/seo';
import DistrictSeoContent from '@/components/DistrictSeoContent';

export const metadata = pageMetadata({
  title: 'B Tech Credit Transfer Pathanamthitta',
  description: 'Make your academic comeback with focused credit transfer support in Pathanamthitta.',
  path: '/b-tech-credit-transfer-pathanamthitta',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Pathanamthitta" 
        badge="Engineering Career" 
        subtitle="Make your academic comeback with focused credit transfer support in Pathanamthitta."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Pathanamthitta program offers engineering students a second chance to continue their education without starting over. It is specially designed for learners who had to discontinue their B.Tech studies due to personal, financial, or academic reasons. This system allows students from Pathanamthitta and nearby regions to transfer their earned academic credits from one university to another recognized under UGC and AICTE regulations. The B Tech Credit Transfer Pathanamthitta process includes a detailed evaluation of transcripts, mark sheets, and completed subjects to match them with the new university’s syllabus. This ensures that students don’t have to repeat previous semesters, saving valuable time and effort. With the flexibility of regular, distance, or online learning modes, students can complete their degree conveniently and at their own pace. The program helps maintain academic continuity and supports students in achieving their engineering qualification efficiently.
          </p>
          <p className="text-base leading-relaxed text-justify">
            Several reputed universities and study centers in Pathanamthitta guide students through the B Tech Credit Transfer Pathanamthitta process with proper counseling and documentation support. They ensure transparency, accuracy, and a smooth transition for every student applying under this program. The system is highly beneficial for those who had to leave college mid-course due to relocation or unforeseen challenges and now want to finish their degree under a recognized university. With the B Tech Credit Transfer Pathanamthitta program, students can continue their studies without losing their hard-earned credits, complete their B.Tech degree faster, and gain recognized qualifications. It’s a cost-effective, time-saving, and flexible way to rebuild one’s academic journey while maintaining full credibility and quality education.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/btech_transfer_pathanamthitta.png"
              alt="B.Tech credit transfer Pathanamthitta"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </div>


      {/* Extra SEO content for this location */}
      <DistrictSeoContent district="pathanamthitta" />

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
