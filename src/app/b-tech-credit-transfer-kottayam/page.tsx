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
  title: 'B Tech Credit Transfer Kottayam',
  description: 'Continue your education confidently with credit transfer guidance in Kottayam.',
  path: '/b-tech-credit-transfer-kottayam',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Kottayam" 
        badge="Engineering Career" 
        subtitle="Continue your education confidently with credit transfer guidance in Kottayam."
        isGradientText={true}
      />

      {/* Extra SEO content for this location */}
      <DistrictSeoContent district="kottayam" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Kottayam program offers engineering students a valuable opportunity to continue their studies without losing the progress they have already made. This system allows students from Kottayam and surrounding areas to transfer their completed academic credits from one approved university to another recognized under UGC and AICTE regulations. It’s ideal for those who had to pause their education due to personal, financial, or academic reasons. Through the B Tech Credit Transfer Kottayam process, universities review previous transcripts, mark sheets, and syllabi to map completed subjects with the new institution’s curriculum. This method helps students save time, avoid repeating semesters, and reduce unnecessary expenses. With flexible study options like regular, online, or distance learning, students can continue their B.Tech degree conveniently. This credit transfer system supports learners in maintaining academic continuity and achieving their engineering degree efficiently.
          </p>
          <p className="text-base leading-relaxed text-justify">
            Many reputed universities and learning centers in Kottayam assist students in the B Tech Credit Transfer Kottayam process, providing step-by-step guidance from counseling to documentation. These institutions ensure that every transferred credit aligns with academic requirements, maintaining educational quality and consistency. This program is especially useful for students who had to discontinue their studies because of relocation, college closure, or personal challenges. By choosing B Tech Credit Transfer Kottayam, students can complete their degree through recognized universities without wasting years or resources. It’s a smooth and transparent process that guarantees authenticity and academic recognition. Whether you are resuming studies after a gap or switching universities, this program provides a reliable path to complete your B.Tech degree and move ahead in your professional journey with confidence.
          </p>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="relative w-full h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/btech_transfer_kottayam.png"
              alt="B.Tech credit transfer Kottayam"
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
