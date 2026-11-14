import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'B Tech Credit Transfer Kannur',
  description: 'Advance your education with dependable credit transfer services in Kannur.',
  path: '/b-tech-credit-transfer-kannur',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Kannur" 
        badge="Engineering Career" 
        subtitle="Advance your education with dependable credit transfer services in Kannur."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Kannur program offers engineering students a great opportunity to continue their education without restarting their degree from the beginning. It is specially designed for students who had to discontinue their B.Tech studies due to personal, financial, or academic reasons and now wish to resume their course under a recognized university. Students in Kannur can easily transfer their earned academic credits to UGC and AICTE-approved universities that accept credit transfers. The B Tech Credit Transfer Kannur process includes verifying previous mark sheets, transcripts, and course details to ensure accurate subject matching.
          </p>
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Kannur program is a smart option for engineering students who want to complete their studies without wasting the effort they’ve already put in. This system allows students from Kannur and nearby regions to transfer their academic credits from one approved university to another recognized institution under UGC and AICTE regulations. It’s ideal for those who faced interruptions in their education due to relocation, college closure, or personal reasons. Through the B Tech Credit Transfer Kannur program, universities assess previous academic records and match the completed subjects with the new curriculum to ensure a seamless continuation of studies. This method saves students time, reduces unnecessary costs, and provides flexibility to finish their degree through regular, online, or distance learning modes.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/wilp-hero.png"
              alt="B.Tech credit transfer Kannur"
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
