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
  title: 'B Tech Credit Transfer Palakkad',
  description: 'Unlock your engineering future with local credit transfer expertise in Palakkad.',
  path: '/b-tech-credit-transfer-palakkad',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Palakkad" 
        badge="Engineering Career" 
        subtitle="Unlock your engineering future with local credit transfer expertise in Palakkad."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            The B Tech Credit Transfer Palakkad program provides engineering students with a great opportunity to continue their education without losing the progress they have already made. This system allows students in Palakkad and nearby regions to transfer their earned academic credits from one recognized university to another that is approved by UGC and AICTE. The B Tech Credit Transfer Palakkad process ensures that completed semesters or subjects are carefully evaluated and matched with the new university’s syllabus, saving both time and money. It’s ideal for students who had to discontinue their B.Tech studies due to personal, financial, or academic reasons. The program offers flexibility through online, regular, or distance learning modes, making it suitable for those balancing work or other commitments. With proper documentation and verification, students can resume their degree seamlessly and complete their engineering education confidently.
          </p>
          <p className="text-base leading-relaxed text-justify">
            Several reputed universities and education centers in Palakkad assist students with the B Tech Credit Transfer Palakkad process, ensuring a smooth and transparent transition. The program includes academic counseling, document review, and credit mapping, helping students resume their studies from the correct semester. It’s a time-saving and cost-effective solution for learners who want to rebuild their academic path after a gap or college change. By transferring their existing credits, students can avoid repeating subjects and continue their education under UGC-approved universities. The B Tech Credit Transfer Palakkad program empowers students to complete their B.Tech degree conveniently and achieve recognized qualifications that open doors to better career opportunities. This flexible and reliable system ensures academic continuity and helps students move forward toward a successful engineering career.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/apprenticeship-hero.png"
              alt="B.Tech credit transfer Palakkad"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </div>


      {/* Extra SEO content for this location */}
      <DistrictSeoContent district="palakkad" />

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
