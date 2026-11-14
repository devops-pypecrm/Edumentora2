import React from 'react';
import Image from 'next/image';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'B Tech Credit Transfer Thiruvananthapuram',
  description: 'Complete your engineering goals with trusted credit transfer support in Thiruvananthapuram.',
  path: '/b-tech-credit-transfer-thiruvananthapuram',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Thiruvananthapuram" 
        badge="Engineering Career" 
        subtitle="Complete your engineering goals with trusted credit transfer support in Thiruvananthapuram."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Thiruvananthapuram program offers engineering students a convenient way to continue their studies without losing previously earned credits. Students in Thiruvananthapuram who had to pause or discontinue their B.Tech education can now transfer their completed semesters or subjects to another UGC and AICTE-approved university. This system ensures that students don’t have to start from the beginning, saving both time and money.
          </p>
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Thiruvananthapuram process involves document verification, transcript evaluation, and mapping of completed subjects with the syllabus of the new university. It’s ideal for students who had to relocate, change colleges, or resume studies after a break. With flexible study options including regular, online, or distance modes, learners can easily complete their engineering degree and achieve recognized qualifications. This program helps maintain academic continuity and supports students in rebuilding their educational journey confidently.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/btech_transfer_thiruvananthapuram.png"
              alt="B.Tech credit transfer Thiruvananthapuram"
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
