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
  title: 'PG Credit Transfer',
  description: 'Transfer your PG credits seamlessly and continue your academic journey with confidence and clarity.',
  path: '/pg-credit-transfer',
});

export default function PGCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner title="PG Credit Transfer" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-6 text-[#3b3226]">
          <h2 className="text-2xl font-bold text-[#002147]">
            Complete Your Postgraduate Degree with Ease
          </h2>
          
          <p className="text-base leading-relaxed text-justify font-medium">
            Transfer your PG credits seamlessly and continue your academic journey with confidence and clarity.
          </p>

          <p className="text-base leading-relaxed text-justify">
            At Edumentora, our PG Credit Transfer Program is designed for students who have paused their postgraduate studies due to academic challenges, personal issues, or financial constraints. This program allows you to transfer your previously earned credits to recognized universities and continue your education without starting from scratch.
          </p>
          
          <p className="text-base leading-relaxed text-justify">
            We have partnered with leading universities like Glocal University, Radha Govind University, and Arni University to ensure that your academic efforts are valued and counted toward your degree. Our expert team carefully evaluates your credits and guides you through a streamlined transfer process, saving you both time and costs.
          </p>
          
          <p className="text-base leading-relaxed text-justify">
            With Edumentora, you can efficiently complete your postgraduate degree, reclaim your academic progress, and achieve your career goals.
          </p>

          <div className="pt-2 space-y-3">
            <h3 className="text-xl font-bold text-[#002147]">
              Changing Universities During a Postgraduate Program
            </h3>
            <p className="text-base leading-relaxed text-justify">
              Postgraduate study often looks different from undergraduate study, and that affects how a university transfer is evaluated. PG programs can have more specialised subject structures, and completed coursework may need a closer academic comparison against the new program&apos;s syllabus. Where a program includes a research component, project work, or a dissertation, that portion is typically considered separately from standard coursework, since research work is generally tied closely to the specific university and guide it was carried out under. As with undergraduate transfers, how much of your previous postgraduate work is recognized, and how your continued studies are structured, depends on the receiving institution&apos;s own academic evaluation process.
            </p>
          </div>

          <Link href="/about-us" className="mt-4 bg-[#F9010D] hover:bg-[#F9010D] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-lg inline-flex items-center group w-fit">
            Know More <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/pg_credit_transfer.png"
              alt="Postgraduate Student on Campus"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </div>

      {/* Full Width Enquire Now Form */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200 w-full max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-[#002147] mb-6 text-center">Enquire Now</h3>
          <EnquiryForm className="grid grid-cols-1 md:grid-cols-2 gap-4" isGrid={true} />
        </div>
      </div>
<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
