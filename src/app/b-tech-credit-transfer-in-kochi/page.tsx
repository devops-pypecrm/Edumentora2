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
  title: 'BTech Credit Transfer in Kochi',
  description: 'Get expert credit transfer assistance and complete your engineering degree in Kochi.',
  path: '/b-tech-credit-transfer-in-kochi',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="BTech Credit Transfer in Kochi" 
        badge="Engineering Career" 
        subtitle="Get expert credit transfer assistance and complete your engineering degree in Kochi."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            BTech Credit Transfer in Kochi gives engineering students a simple way to continue their studies in a new college without wasting the years they have already completed. Many students decide to move to Kochi because the city has some of the best institutions, modern facilities, and good career opportunities. Instead of starting from the first year again, BTech Credit Transfer in Kochi helps them carry forward the credits they have already earned.
          </p>
          <p className="text-base leading-relaxed text-justify">
            The process is very simple. Students only need to provide their previous mark sheets, subject details, and syllabus copies. The new college in Kochi will check these papers and see which subjects can be matched. Once the credits are accepted, the student can directly join the next semester. So, no need to repeat the same subjects again.
          </p>
          <p className="text-base leading-relaxed text-justify">
            Choosing BTech Credit Transfer in Kochi can save both time and money. It also makes it possible to move to a better college without losing the progress you have already made. For students who want a fresh start in Kochi but do not want to waste years of study, this option is very useful. With BTech Credit Transfer in Kochi, you can smoothly continue your education and complete your degree on time.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/btech_transfer_kochi.png"
              alt="B.Tech credit transfer Kochi"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </div>


      {/* Extra SEO content for this location */}
      <DistrictSeoContent district="kochi" />

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
