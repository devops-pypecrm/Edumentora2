import React from 'react';
import Image from 'next/image';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'B Tech Credit Transfer Kozhikode',
  description: 'Move closer to completing your degree with expert support in Kozhikode.',
  path: '/b-tech-credit-transfer-kozhikode',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Kozhikode" 
        badge="Engineering Career" 
        subtitle="Move closer to completing your degree with expert support in Kozhikode."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Kozhikode program is an excellent opportunity for engineering students who had to discontinue their studies and wish to complete their degree without starting over. This system allows students from Kozhikode and nearby regions to transfer their previously earned academic credits from one university to another that is approved by UGC and AICTE. The B Tech Credit Transfer Kozhikode process ensures that completed subjects are properly evaluated and accepted by the new institution, saving students both time and money. It’s ideal for those who had to pause their studies due to relocation, college closure, or personal challenges. Students can choose to complete their remaining semesters through regular, online, or distance learning modes, depending on their convenience. This program helps maintain academic continuity and provides an easier route to complete a valid B.Tech degree with full credibility.
          </p>
          <p className="text-base leading-relaxed text-justify">
            Many reputed universities and education centers in Kozhikode support students through the B Tech Credit Transfer Kozhikode process, offering complete guidance from documentation to credit verification. This program helps ensure that each student’s previous academic performance is recognized and carried forward effectively. The credit transfer system is highly beneficial for students who don’t want to lose the effort and years invested in their engineering studies. With this opportunity, students can resume their education smoothly and complete their degree under recognized institutions. The B Tech Credit Transfer Kozhikode option also provides flexibility for working professionals and distance learners who want to balance education with their careers. It’s a reliable, time-saving, and affordable way to complete your engineering journey and achieve your B.Tech degree successfully.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/btech_transfer_kozhikode.png"
              alt="B.Tech credit transfer Kozhikode"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </div>


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
