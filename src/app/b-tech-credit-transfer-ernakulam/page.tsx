import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import { pageMetadata, breadcrumbJsonLd, faqPageJsonLd } from '@/lib/seo';
import ErnakulamFaq from './ErnakulamFaq';

export const metadata = pageMetadata({
  title: 'B.Tech Credit Transfer in Ernakulam',
  description: 'Understand how B.Tech credit transfer works for students in Ernakulam — eligibility, required documents, credit evaluation, and how Edumentora can guide your application.',
  path: '/b-tech-credit-transfer-ernakulam',
});

const FAQS = [
  {
    q: 'What Is B.Tech Credit Transfer?',
    a: 'B.Tech credit transfer is a process that lets an engineering student carry the academic credits they’ve already earned at one institution toward a B.Tech program at a different, recognized university — so completed semesters and subjects don’t have to be repeated, subject to that university’s own evaluation of your record.',
  },
  {
    q: 'How Does the Credit Transfer Process Work?',
    a: 'In general, a student shares their academic records — mark sheets, syllabus copies, and subject details — with the receiving university. The university reviews the completed coursework against its own curriculum to decide how many credits and semesters can be carried forward. The exact steps and turnaround time can vary from one university to another.',
  },
  {
    q: 'Who Can Apply in Ernakulam?',
    a: 'Students based in or near Ernakulam who have discontinued a B.Tech program, or who want to move to a different recognized university, can look into credit transfer. Every application is assessed individually by the receiving institution — Edumentora can guide students in Ernakulam through preparing and submitting that application.',
  },
  {
    q: 'Eligibility for B.Tech Credit Transfer',
    a: 'Eligibility is ultimately decided by the receiving university, and generally depends on factors like how many semesters or subjects were completed, whether the previous institution is recognized, and how closely the earlier syllabus matches the new one. There’s no fixed, guaranteed eligibility — each case is evaluated on its own academic record.',
  },
  {
    q: 'Documents Required',
    a: 'Commonly requested documents include previous semester mark sheets or transcripts, syllabus copies for completed subjects, your transfer or migration certificate, proof of your earlier admission, and details of any pending backlogs. Exact requirements can vary between universities, so treat this as a general starting checklist rather than a fixed list.',
  },
  {
    q: 'Available Engineering Branches',
    a: 'Which branches are available for credit transfer depends on what the receiving university currently offers — commonly branches like Computer Science, Electronics, Electrical, Mechanical, Civil, and Information Technology. Availability and seat status should be confirmed directly with the specific university during the evaluation.',
  },
  {
    q: 'How Edumentora Helps Students',
    a: 'Edumentora helps students in Ernakulam understand the credit transfer process, organize the academic documents a university will ask for, and connect with an appropriate university for evaluation — aiming to make the transition clearer and reduce guesswork. This is guidance and coordination support, not a guarantee of admission or credit approval, which always rests with the receiving university.',
  },
];

const breadcrumbLd = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'B.Tech Credit Transfer', path: '/b-tech-credit-transfer' },
  { name: 'B.Tech Credit Transfer in Ernakulam', path: '/b-tech-credit-transfer-ernakulam' },
]);

const faqLd = faqPageJsonLd(FAQS.map((f) => ({ q: f.q, a: f.a })));

export default function Page() {
  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <Header />

      {/* 1. Hero — single H1 for the page */}
      <PageBanner
        badge="Engineering Career"
        title="B.Tech Credit Transfer in Ernakulam"
        subtitle="Guidance for engineering students in Ernakulam who want to carry forward completed credits to a recognized university instead of restarting their B.Tech."
        isGradientText={true}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-6 grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-10 text-[#3b3226]">

          {/* 2. Quick Answer */}
          <section>
            <h2 className="text-2xl font-bold text-[#002147] mb-3">What Is B.Tech Credit Transfer?</h2>
            <p className="text-base leading-relaxed text-justify">
              B.Tech credit transfer is a process that allows an engineering student to move the academic credits they have already earned at one institution toward a B.Tech program at a different, recognized university. Rather than starting over, completed semesters and subjects are evaluated by the receiving university and, where they match, counted toward the new degree. For students in Ernakulam considering a{' '}
              <Link href="/b-tech-credit-transfer" className="text-[#F9010D] font-semibold hover:underline">
                B.Tech credit transfer
              </Link>
              , this is the starting point: understanding what can realistically be carried forward before applying.
            </p>
          </section>

          {/* 3. How the Process Works */}
          <section>
            <h2 className="text-2xl font-bold text-[#002147] mb-3">How the Process Works</h2>
            <ol className="list-decimal list-outside pl-5 space-y-3 text-base leading-relaxed">
              <li>Gather your academic records from the previous institution — mark sheets, syllabus copies, and subject-wise details.</li>
              <li>Share these records with the university you want to transfer to, so it can review what you have already completed.</li>
              <li>The receiving university compares your earlier syllabus with its own curriculum to decide which subjects and how many credits or semesters can be carried forward.</li>
              <li>Once the evaluation is complete, you enroll at the point the university determines your credits place you — rather than from the first semester.</li>
            </ol>
            <p className="text-base leading-relaxed text-justify mt-3">
              The exact steps, paperwork, and timelines can differ between universities, so this sequence is a general guide rather than a fixed procedure.
            </p>
          </section>

          {/* 4. Who May Be Eligible */}
          <section>
            <h2 className="text-2xl font-bold text-[#002147] mb-3">Who May Be Eligible?</h2>
            <p className="text-base leading-relaxed text-justify">
              There is no single eligibility rule that applies to every student. Whether a credit transfer is possible depends on your specific academic record — how many semesters and subjects you completed, whether your previous institution is recognized, and how closely its syllabus lines up with the receiving university's own curriculum. Final eligibility is always determined by the receiving institution's own evaluation of your case, not guaranteed in advance.
            </p>
          </section>

          {/* 5. Documents That May Be Required */}
          <section>
            <h2 className="text-2xl font-bold text-[#002147] mb-3">Documents That May Be Required</h2>
            <ul className="list-disc list-outside pl-5 space-y-2 text-base leading-relaxed">
              <li>Mark sheets or transcripts for completed semesters</li>
              <li>Syllabus copies for the subjects already completed</li>
              <li>Transfer or migration certificate from the previous institution</li>
              <li>Proof of your original admission</li>
              <li>Details of any pending backlogs, if applicable</li>
            </ul>
            <p className="text-base leading-relaxed text-justify mt-3">
              This is a general checklist — exact document requirements can vary from one university to another, so it's worth confirming the specific list with the institution you're applying to.
            </p>
          </section>

          {/* 6. Academic Credit Evaluation */}
          <section>
            <h2 className="text-2xl font-bold text-[#002147] mb-3">Academic Credit Evaluation</h2>
            <p className="text-base leading-relaxed text-justify">
              Academic credit evaluation is how a university decides what to accept from your previous studies. It typically involves comparing the subjects and syllabus you've already completed against its own course structure, checking the credit hours assigned to each subject, and identifying any gaps that would still need to be completed. The outcome — how many semesters or subjects are recognized — depends entirely on that comparison, and can differ from student to student even within the same previous institution.
            </p>
          </section>

          {/* 7. Support for Students in Ernakulam */}
          <section>
            <h2 className="text-2xl font-bold text-[#002147] mb-3">Support for Students in Ernakulam</h2>
            <p className="text-base leading-relaxed text-justify">
              Edumentora's office serving the Kochi area sits within Ernakulam district, and the team there works with students from Ernakulam who are exploring a B.Tech credit transfer. That support covers explaining how the process works, helping organize the academic documents a university will ask for, and coordinating with an appropriate university for evaluation — guidance and coordination, rather than a guarantee of admission or how many credits will be approved, which stays the receiving university's decision.{' '}
              <Link href="/contact" className="text-[#F9010D] font-semibold hover:underline">
                Get in touch
              </Link>{' '}
              to start a conversation about your specific academic background.
            </p>
          </section>

        </div>

        <div className="lg:col-span-5">
          <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <Image
              src="/btech-credit-transfer.png"
              alt="B.Tech credit transfer guidance for engineering students in Ernakulam"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </div>

      {/* 8. FAQ */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6 pb-16">
        <h2 className="text-3xl font-bold text-[#002147] text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
          Common questions from students in Ernakulam about B.Tech credit transfer.
        </p>
        <ErnakulamFaq faqs={FAQS} />
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
