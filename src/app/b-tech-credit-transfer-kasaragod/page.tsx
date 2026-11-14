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
  title: 'B Tech Credit Transfer Kasaragod',
  description: 'Bring your unfinished B.Tech in Kasaragod back on track with a credit transfer route built around the semesters you’ve already cleared.',
  path: '/b-tech-credit-transfer-kasaragod',
});

export default function BTechCreditTransferPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner 
        title="B Tech Credit Transfer Kasaragod" 
        badge="Engineering Career" 
        subtitle="Bring your unfinished B.Tech in Kasaragod back on track with a credit transfer route built around the semesters you’ve already cleared."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-[#3b3226]">
          <p className="text-base leading-relaxed text-justify">
            Discontinuing a B.Tech midway is rarely about ability — more often it comes down to a backlog that piled up, a financial gap, or a college that simply didn’t work out. For engineering students in Kasaragod facing exactly that, credit transfer offers a genuine way back in without repeating the semesters you’ve already cleared. The process itself starts with a review of your academic records — mark sheets, completed subjects, and the syllabus you followed — which a UGC and AICTE-recognized university then compares against its own curriculum to work out exactly where you can rejoin. Subjects that match closely are carried forward as completed credit; anything that doesn’t align as clearly gets flagged for the university to decide on. Once that mapping is confirmed, you continue your B.Tech from the appropriate semester rather than restarting the degree from year one, which is the part of the process students in Kasaragod tend to worry about most before they actually go through it.
          </p>
          <p className="text-base leading-relaxed text-justify">
            What makes this route practical for students based in and around Kasaragod is the flexibility built into how the remaining coursework gets completed — regular, distance, or online study, chosen based on what actually fits a student’s schedule and circumstances rather than a single fixed format. Universities open to credit transfer students are generally looking for a genuine reason behind the gap — relocation, a paused semester, or an institution that closed or lost recognition — and evaluate each academic record on that basis rather than applying one rule to everyone. Because subjects you’ve already cleared are recognized instead of repeated, both the time and the cost of finishing the degree come down noticeably. The B.Tech you end up completing carries the same UGC and AICTE recognition as one finished without any interruption, which matters for admissions, further studies, and job eligibility down the line.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/wilp-hero.png"
              alt="B.Tech credit transfer Kasaragod"
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


      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <EnquiryForm className="w-full flex flex-col md:flex-row gap-3" isGrid={false} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 space-y-3">
        <h3 className="text-xl font-bold text-[#002147] mb-2">Recent Posts</h3>
        <Link
          href="/best-b-tech-credit-transfer-services-in-kerala-for-dropout-backlog-students/"
          className="block w-full text-gray-700 hover:text-blue-600 hover:underline text-sm md:text-base transition-colors font-medium"
        >
          B Tech Credit Transfer Services in Kerala for Dropout & Backlog Students
        </Link>
        <Link
          href="/blog/btech-discontinued-after-2-or-3-years"
          className="block w-full text-gray-700 hover:text-blue-600 hover:underline text-sm md:text-base transition-colors font-medium"
        >
          B.Tech Discontinued After 2 or 3 Years? Know Your Options.
        </Link>
        <Link
          href="/b-tech-credit-transfer"
          className="block w-full text-gray-700 hover:text-blue-600 hover:underline text-sm md:text-base transition-colors font-medium"
        >
          Eligibility and Benefits of B.Tech Credit Transfer
        </Link>
        <Link
          href="/blog/what-is-academic-credit-transfer"
          className="block w-full text-gray-700 hover:text-blue-600 hover:underline text-sm md:text-base transition-colors font-medium"
        >
          What Is Academic Credit Transfer?
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <h3 className="text-xl font-bold text-[#002147] mb-5">Recent Comments</h3>
        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-sm">
          No comments to show.
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <EnquiryForm className="w-full flex flex-col md:flex-row gap-3" isGrid={false} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-bold text-[#002147] mb-5">Categories</h3>
          <ul className="space-y-2 text-gray-700 text-sm md:text-base">
            <li>Credit Transfer (7)</li>
            <li>Education (4)</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-[#002147] mb-2">Recent Posts</h3>
          <Link
            href="/best-b-tech-credit-transfer-services-in-kerala-for-dropout-backlog-students/"
            className="block w-full text-gray-700 hover:text-blue-600 hover:underline text-sm md:text-base transition-colors font-medium"
          >
            B Tech Credit Transfer Services in Kerala for Dropout & Backlog Students
          </Link>
          <Link
            href="/blog/is-btech-credit-transfer-right-for-you"
            className="block w-full text-gray-700 hover:text-blue-600 hover:underline text-sm md:text-base transition-colors font-medium"
          >
            B.Tech Credit Transfer: Is It Right for You?
          </Link>
          <Link
            href="/blog/btech-discontinued-after-2-or-3-years"
            className="block w-full text-gray-700 hover:text-blue-600 hover:underline text-sm md:text-base transition-colors font-medium"
          >
            B.Tech Discontinued After 2 or 3 Years? Know Your Options.
          </Link>
          <Link
            href="/b-tech-credit-transfer"
            className="block w-full text-gray-700 hover:text-blue-600 hover:underline text-sm md:text-base transition-colors font-medium"
          >
            Eligibility and Benefits of B.Tech Credit Transfer
          </Link>
          <Link
            href="/blog/what-is-academic-credit-transfer"
            className="block w-full text-gray-700 hover:text-blue-600 hover:underline text-sm md:text-base transition-colors font-medium"
          >
            What Is Academic Credit Transfer?
          </Link>
        </div>
      </div>
<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
