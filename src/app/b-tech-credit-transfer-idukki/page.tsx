import React from 'react';
import Image from 'next/image';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'B Tech Credit Transfer Idukki',
  description: 'Continue your degree smoothly with credit transfer support in Idukki.',
  path: '/b-tech-credit-transfer-idukki',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Idukki" 
        badge="Engineering Career" 
        subtitle="Continue your degree smoothly with credit transfer support in Idukki."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Idukki program offers a second chance for engineering students who had to pause their studies due to relocation, personal issues, or institutional reasons. Through this system, students can transfer their earned credits from one recognized university to another without losing the progress they’ve already made. In Idukki, several UGC and AICTE-approved universities and learning centers help students complete their B.Tech degree through an easy and transparent credit transfer process. The B Tech Credit Transfer Idukki option involves submitting academic transcripts, mark sheets, and related documents to evaluate previously completed subjects. Once verified, eligible credits are transferred to the new institution, allowing students to resume their education from the appropriate semester. This system saves both time and money by avoiding repeated coursework and helps maintain academic continuity. For students in Idukki who want to continue their B.Tech studies through flexible modes like distance or online education, this credit transfer program is a convenient solution.
          </p>
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Idukki program is a valuable opportunity for engineering students who discontinued their studies but wish to complete their degree without starting from the first semester. This initiative allows students from Idukki and nearby regions to transfer their academic credits from one approved university to another recognized institution under UGC and AICTE norms. The B Tech Credit Transfer Idukki process ensures that previously completed subjects and practicals are carefully evaluated and matched with the syllabus of the new university. This method not only saves time and reduces financial strain but also helps students maintain academic continuity. Many universities in Idukki provide complete assistance with documentation, credit mapping, and counseling to make the transition smooth. The program is especially beneficial for students who relocated, faced personal challenges, or had to leave college mid-course. With options for regular, distance, and online learning, B Tech Credit Transfer Idukki gives students the flexibility to complete their engineering education at their own pace. It’s an efficient and recognized path to achieve a valid B.Tech degree and rebuild a successful academic and professional career.
          </p>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="relative w-full h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/graduation.png"
              alt="B.Tech credit transfer Idukki"
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
