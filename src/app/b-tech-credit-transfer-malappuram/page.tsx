import React from 'react';
import Image from 'next/image';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'B Tech Credit Transfer Malappuram',
  description: 'Choose a smoother academic path with credit transfer guidance in Malappuram.',
  path: '/b-tech-credit-transfer-malappuram',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Malappuram" 
        badge="Engineering Career" 
        subtitle="Choose a smoother academic path with credit transfer guidance in Malappuram."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Malappuram program is a golden opportunity for engineering students who had to pause their studies to continue their education without starting from scratch. This program allows students from Malappuram and nearby regions to transfer their previously earned academic credits from one recognized university to another that follows UGC and AICTE guidelines.
          </p>
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Malappuram process involves evaluating and verifying completed subjects, ensuring they align with the new university’s syllabus. This helps students save valuable time, avoid repeating semesters, and reduce financial burdens. It’s ideal for students who discontinued their education due to relocation, college closure, or personal reasons. With flexible learning options like online, distance, and regular modes, students can easily complete their B.Tech degree. The B Tech Credit Transfer Malappuram system ensures academic continuity and provides a convenient way for learners to complete their engineering degree with credibility and recognition.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/btech_transfer_malappuram.png"
              alt="B.Tech credit transfer Malappuram"
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
