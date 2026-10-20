'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Award, ArrowRight, ClipboardCheck, Landmark, TrendingUp, Layers, ChevronDown, Clock, Wallet, Shuffle, ShieldCheck, Minus } from 'lucide-react';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import EligibilityForm from '@/components/EligibilityForm';

type Faq = { id: string; q: string; a: string };

export default function BTechCreditTransferClient({ faqs }: { faqs: Faq[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showEligibilityPopup, setShowEligibilityPopup] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const STORAGE_KEY = 'btech-eligibility-popup-seen';

    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    if (isReload) {
      sessionStorage.removeItem(STORAGE_KEY);
    }

    const alreadySeen = sessionStorage.getItem(STORAGE_KEY) === 'true';

    setShowEligibilityPopup(true);
    if (alreadySeen) {
      // Already shown once this session (came back via client-side navigation) — go straight to the small corner widget.
      setIsMinimized(true);
    } else {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  }, []);

  const btechBenefits = [
    {
      icon: Clock,
      title: 'Saves Time and Effort',
      body: 'Complete the degree you already started — since your earned credits are recognized, you never repeat courses you’ve already passed.',
    },
    {
      icon: Wallet,
      title: 'Reduces Financial Cost',
      body: 'Paying for fewer repeated semesters means real savings on tuition, hostel, and related expenses.',
    },
    {
      icon: Shuffle,
      title: 'Offers Flexibility',
      body: 'Switch institutions for personal, academic, or professional reasons — relocation, better facilities, or a change in career focus.',
    },
    {
      icon: ShieldCheck,
      title: 'Prevents Loss of Academic Progress',
      body: 'Discontinued your studies for personal or academic reasons? Resume exactly where you left off, without starting from scratch.',
    },
  ];

  const highlights = [
    {
      icon: ClipboardCheck,
      title: 'Eligibility Criteria',
      body: "Students are eligible to apply when they have completed at least 50% of their B.Tech coursework and can provide official mark sheets and academic records. Their previous university must be recognized and approved, and any failed subjects can be completed through the university’s offline process."
    },
    {
      icon: Landmark,
      title: 'Top Universities',
      body: 'Edumentora works with reputed UGC-approved universities such as Glocal University, Radha Govind University, IEC University, and Arni University. These partnerships help students continue their studies smoothly while keeping their academic progress valid and recognized.'
    },
    {
      icon: TrendingUp,
      title: 'Program Benefits',
      body: 'This program helps students avoid starting over from the beginning, save time and money, and continue their degree in a legal and recognized way. It also keeps their academic journey aligned with employment opportunities and future career goals.'
    },
    {
      icon: Layers,
      title: 'Specializations Available',
      body: 'Students can choose from multiple engineering specializations including Civil Engineering, Mechanical Engineering, Computer Science, Electronics, Electrical Engineering, Information Technology, Automobile Engineering, and Chemical Engineering.'
    }
  ];

  return (
    <main className="min-h-screen font-[Poppins] bg-white">
      <Header />

      <PageBanner
        badge="Engineering Career"
        title="B.Tech Credit Transfer in Kerala"
        subtitle="Take the Next Step in Your Engineering Career. Don’t let an incomplete B.Tech stop you from achieving your dreams. With Edumentora’s B.Tech Credit Transfer Program, you can resume your studies, complete your degree, and build a successful future."
        bgClassName="bg-white"
        borderClassName="border-transparent"
      />

      <div id="know-more" className="relative pb-20 scroll-mt-28 pt-8">
        {/* Intro Card */}
        <div className="bg-white pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-7xl mx-auto px-4 md:px-8 relative z-20"
        >
          <div className="relative rounded-[2.5rem] shadow-[0_20px_60px_-25px_rgba(0,33,71,0.2)] border border-gray-100 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-16 lg:gap-20 items-center overflow-hidden bg-white">

            {/* Background Decorative Blob */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E91D24]/10 blur-[100px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#002147]/5 blur-[100px] -z-10 pointer-events-none"></div>

            {/* Left Side: Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="relative w-full lg:w-5/12 flex justify-center group"
            >
              <div className="relative w-full h-[400px] md:h-[460px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_45px_-20px_rgba(0,33,71,0.25)] border border-gray-100 z-10 bg-white">
                <Image
                  src="/image-008.png"
                  alt="Students on campus progressing toward graduation and their certificates"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Floating badge */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-10 h-10 bg-[#002147]/10 text-[#002147] rounded-full flex items-center justify-center font-bold text-lg">
                    🎓
                  </div>
                  <div>
                    <div className="font-bold text-[#002147] text-xs uppercase tracking-wider">Fast Track</div>
                    <div className="text-stone-500 text-[10px] font-bold uppercase">Your Degree</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="w-full lg:w-7/12 space-y-8 relative z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#002147]/10 border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-[#002147] animate-pulse"></span>
                <span className="text-[#002147] font-bold text-xs uppercase tracking-widest">Resume Your Journey</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#002147] leading-tight tracking-tight">
                Complete your B.Tech <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002147] to-[#E91D24]">Without Starting Over!</span>
              </h2>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#002147]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-5 h-5 text-[#002147]" />
                  </div>
                  <p className="text-stone-600 leading-relaxed font-medium">
                    At Edumentora, our B.Tech Credit Transfer Program is designed to help engineering students who have discontinued their studies due to academic, personal, or financial challenges. This program allows you to transfer your previously earned credits to our partner universities and continue your B.Tech degree without starting over.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#002147]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Landmark className="w-5 h-5 text-[#002147]" />
                  </div>
                  <p className="text-stone-600 leading-relaxed font-medium">
                    We collaborate with reputed institutions like Glocal University, Radha Govind University, and Arni University, ensuring that your academic efforts are recognized and credited toward your degree. Our expert team evaluates your existing credits and facilitates a smooth transfer process.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#002147]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ClipboardCheck className="w-5 h-5 text-[#002147]" />
                  </div>
                  <p className="text-stone-600 leading-relaxed font-medium">
                    Instead of starting from the first year, eligible students who have completed at least 50% of their B.Tech coursework can transfer their existing credits to a UGC-approved and AICTE-recognized university.
                  </p>
                </div>
              </div>

              <Link href="#educational-mobility" className="mt-8 relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-[#8B0000] hover:bg-[#5C0000] rounded-full overflow-hidden group w-fit shadow-md hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B0000] focus-visible:ring-offset-2">
                <span className="relative flex items-center gap-2">
                  Know More
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        </div>

        {/* What Is B.Tech Credit Transfer + Benefits */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">

            {/* Left: What Is */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B0000] text-white text-xs font-bold uppercase tracking-widest mb-6">
                What Is
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#002147] leading-tight tracking-tight mb-2">
                B.Tech
              </h2>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#8B0000] leading-tight tracking-tight mb-6">
                Credit Transfer?
              </h2>
              <p className="text-[#E91D24] font-bold text-sm uppercase tracking-widest mb-3">
                Academic Credit Transfer
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                Academic credit transfer enables students to move from one institution to another, carrying forward the credits earned in courses they&rsquo;ve already completed — so they don&rsquo;t need to repeat those subjects. The process involves evaluating the curriculum, grades, and relevance of your previous coursework to confirm equivalency and eligibility for transfer to your new university.
              </p>
            </motion.div>

            {/* Right: Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#002147] mb-8">
                Benefits of B.Tech Credit Transfer
              </h3>
              <div className="space-y-7">
                {btechBenefits.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                    className="flex gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#002147]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#8B0000]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#002147] mb-1">{item.title}</h4>
                      <p className="text-stone-600 leading-relaxed">{item.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Program Highlights */}
        <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#002147]/10 border border-gray-100 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#002147] animate-pulse"></span>
              <span className="text-[#002147] font-bold text-xs uppercase tracking-widest">Program Details</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#002147] tracking-tight">
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002147] to-[#E91D24]">Know</span>
            </h2>
          </motion.div>

          <div className="relative rounded-[2.5rem] shadow-[0_20px_60px_-25px_rgba(0,33,71,0.2)] border border-gray-100 overflow-hidden bg-white">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                className={`flex flex-col sm:flex-row gap-5 sm:items-center p-8 md:px-12 md:py-9 ${i > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#002147]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-7 h-7 text-[#002147]" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#002147]">{item.title}</h3>
                  <p className="text-base leading-8 text-stone-600">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>

        {/* Enquire Now + Know More Row */}
        <div className="bg-white py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto px-4 md:px-8"
        >
          <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] items-stretch">
            <div className="rounded-[1.5rem] bg-white border border-gray-100 p-5 md:p-7 self-stretch flex flex-col justify-center shadow-[0_20px_60px_-25px_rgba(0,33,71,0.2)]">
              <h3 className="text-2xl font-bold text-[#002147] mb-4 text-center">Enquire Now</h3>
              <EnquiryForm className="grid grid-cols-1 md:grid-cols-2 gap-3" isGrid={true} />
            </div>

            <div id="educational-mobility" className="rounded-[1.5rem] bg-white border border-gray-100 p-0 overflow-hidden shadow-[0_20px_60px_-25px_rgba(0,33,71,0.2)] scroll-mt-28">
              <div className="md:grid md:grid-cols-[280px_1fr]">
                <div className="text-[#002147] p-8 md:p-10 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#002147]"></span>
                    <span className="text-xs tracking-[0.3em] uppercase text-[#002147] font-semibold">Credit Transfer</span>
                  </span>
                  <h2 className="text-2xl md:text-3xl font-semibold leading-tight text-[#002147]">Know more on Credit Transfers</h2>
                  <p className="mt-5 text-sm leading-7 text-stone-600 max-w-[22rem]">
                    Discover how your prior credits can be applied toward a new degree, helping you move forward faster with confidence.
                  </p>
                </div>
                <div className="p-8 md:p-10 md:border-l md:border-gray-100">
                  <div className="space-y-5 text-[#002147]">
                    <p className="text-base leading-8 text-stone-600">
                      Your existing credits can carry over to a new college, so you don&rsquo;t repeat courses you&rsquo;ve already passed.
                    </p>
                    <p className="text-base leading-8 text-stone-600">
                      This can save you time and money, though approval depends on your previous coursework and the new university&rsquo;s policies.
                    </p>
                    <p className="text-base leading-8 text-stone-600">
                      Talk to our academic advisor to see exactly how your credits apply and what to do next.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </div>

        {/* Premium Programs Section */}
        <div className="bg-white py-[100px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#E91D24] blur-[120px]"></div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
            {/* Animated Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#002147]/10 border border-gray-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#002147] animate-pulse"></span>
                <span className="text-[#002147] font-bold text-xs uppercase tracking-widest">Choose Your Path</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002147] mb-4 tracking-tight">
                Our Transfer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002147] to-[#E91D24]">Programs</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#002147] to-[#E91D24] rounded-full mb-6"></div>
              <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">Select the program that fits your educational background</p>
            </motion.div>

            {/* Animated Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">

              {/* Card 1: UG */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,33,71,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(0,33,71,0.2)] overflow-hidden transition-all duration-500 flex flex-col justify-between min-h-[420px]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#002147]/10 to-transparent rounded-full blur-3xl -z-10 transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#002147] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <div className="w-16 h-16 bg-[#002147]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#002147] transition-colors duration-500 shadow-inner">
                  <GraduationCap className="w-8 h-8 text-[#002147] group-hover:text-white transition-colors duration-500" />
                </div>

                <div className="relative z-20 flex-grow flex flex-col">
                  <h3 className="text-3xl font-bold text-[#002147] mb-4">UG Transfer</h3>
                  <p className="text-stone-600 text-lg leading-relaxed mb-8 font-medium flex-grow">
                    Transfer your earned UG credits to top universities, saving time and costs while completing your degree efficiently.
                  </p>

                  <Link href="/ug-credit-transfer" className="inline-flex items-center text-[#002147] font-bold text-lg group/link mt-auto w-max rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002147] focus-visible:ring-offset-2">
                    Know More
                    <span className="ml-2 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover/link:bg-[#002147] group-hover/link:text-white transition-all duration-300">
                      <ArrowRight className="w-5 h-5 transform group-hover/link:-rotate-45 transition-transform duration-300" />
                    </span>
                  </Link>
                </div>
              </motion.div>

              {/* Card 2: PG */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,33,71,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(0,33,71,0.2)] overflow-hidden transition-all duration-500 flex flex-col justify-between min-h-[420px]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#002147]/10 to-transparent rounded-full blur-3xl -z-10 transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#002147] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <div className="w-16 h-16 bg-[#002147]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#002147] transition-colors duration-500 shadow-inner">
                  <Briefcase className="w-8 h-8 text-[#002147] group-hover:text-white transition-colors duration-500" />
                </div>

                <div className="relative z-20 flex-grow flex flex-col">
                  <h3 className="text-3xl font-bold text-[#002147] mb-4">PG Transfer</h3>
                  <p className="text-stone-600 text-lg leading-relaxed mb-8 font-medium flex-grow">
                    Transfer your PG credits to leading universities, saving time and money while completing your postgraduate degree smoothly.
                  </p>

                  <Link href="/pg-credit-transfer" className="inline-flex items-center text-[#002147] font-bold text-lg group/link mt-auto w-max rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002147] focus-visible:ring-offset-2">
                    Know More
                    <span className="ml-2 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover/link:bg-[#002147] group-hover/link:text-white transition-all duration-300">
                      <ArrowRight className="w-5 h-5 transform group-hover/link:-rotate-45 transition-transform duration-300" />
                    </span>
                  </Link>
                </div>
              </motion.div>

              {/* Card 3: Diploma */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.3 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,33,71,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(0,33,71,0.2)] overflow-hidden transition-all duration-500 flex flex-col justify-between min-h-[420px]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#002147]/10 to-transparent rounded-full blur-3xl -z-10 transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#002147] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <div className="w-16 h-16 bg-[#002147]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#002147] transition-colors duration-500 shadow-inner">
                  <Award className="w-8 h-8 text-[#002147] group-hover:text-white transition-colors duration-500" />
                </div>

                <div className="relative z-20 flex-grow flex flex-col">
                  <h3 className="text-3xl font-bold text-[#002147] mb-4">Diploma Transfer</h3>
                  <p className="text-stone-600 text-lg leading-relaxed mb-8 font-medium flex-grow">
                    Transfer your Diploma credits to leading universities to fast-track your educational progression effortlessly.
                  </p>

                  <Link href="/diploma-credit-transfer" className="inline-flex items-center text-[#002147] font-bold text-lg group/link mt-auto w-max rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002147] focus-visible:ring-offset-2">
                    Know More
                    <span className="ml-2 w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover/link:bg-[#002147] group-hover/link:text-white transition-all duration-300">
                      <ArrowRight className="w-5 h-5 transform group-hover/link:-rotate-45 transition-transform duration-300" />
                    </span>
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-bold text-[#002147] text-center mb-12"
          >
            Frequently Asked Questions on B.Tech Credit Transfers
          </motion.h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
                className="group border border-gray-100 rounded-2xl overflow-hidden bg-white transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer focus-within:ring-2 focus-within:ring-[#002147] focus-within:ring-offset-2"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                role="button"
                tabIndex={0}
                aria-expanded={openFaq === index}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenFaq(openFaq === index ? null : index);
                  }
                }}
              >
                <div className={`p-6 flex justify-between items-center transition-colors duration-300 ${openFaq === index ? 'bg-[#002147]' : 'hover:bg-[#002147]'}`}>
                  <h3 className={`font-bold text-lg transition-colors pr-4 ${openFaq === index ? 'text-white' : 'text-[#002147] group-hover:text-white'}`}>
                    {faq.q}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${openFaq === index ? 'text-white rotate-180' : 'text-[#E91D24] group-hover:text-white'}`}
                  />
                </div>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${openFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="p-6 text-stone-600 bg-gray-50 border-t border-gray-100 leading-relaxed text-justify">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Note Paragraph */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 p-5 bg-white rounded-2xl border border-gray-100 text-center shadow-sm"
          >
            <p className="text-[#002147] text-sm md:text-base italic font-medium leading-relaxed">
              *To complete your B.Tech degree through credit transfer, you must visit the university and write the failed subjects directly in offline mode. Universities do not allow online exams for credit transfer programs, as per UGC guidelines.
            </p>
          </motion.div>
        </div>
      </div>
      </div>

      {/* Seventh Section: Final Summary */}
      {/* <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="w-full space-y-6 text-gray-600 text-lg leading-relaxed text-justify">
          <p>
            BTech Credit Transfer is a useful option for students who want to continue their studies in a new college or university without the problem of starting everything again. Students face conditions such as transferring to another city for better facilities or going to a college with more opportunities. In such cases, BTech Credit Transfer allows them to carry forward the credits they already earned.
          </p>
          <p>
            The process of BTech Credit Transfer is simple in most universities. A student can apply by showing their previous mark sheets, syllabus, and proof of the subjects they have already passed. The new college then checks which subjects match with their own syllabus. Once approved, those credits get added, and the student can continue from the next semester instead of beginning from the first year again.
          </p>
          <p>
            BTech Credit Transfer saves both time and money. Instead of repeating the same subjects, students can focus on new topics and complete the degree on time. It also gives freedom to move to better colleges without wasting years of study.
          </p>
          <p>
            If you are planning to change your current college, then learning about BTech credit transfer can make the shift very easy. It ensures your hard work is valued and helps you achieve your B.Tech degree smoothly.
          </p>
        </div>
      </div> */}

      {/* Check Your Eligibility Now popup */}
      <AnimatePresence>
        {showEligibilityPopup && !isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsMinimized(true)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[400px] rounded-[2.5rem] border-4 border-[#002147]/70 shadow-[0_25px_60px_-20px_rgba(23,42,83,0.35)] bg-white p-6"
            >
              {/* Minimize Button */}
              <button
                onClick={() => setIsMinimized(true)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Minimize"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3 rounded-full bg-blue-50 w-fit px-3 py-1.5">
                <ClipboardCheck className="w-4 h-4 text-[#002147]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#002147]">Fast Assessment</span>
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-1">Check Your Eligibility Now</h3>
              <p className="text-sm text-gray-600 mb-4 leading-6">Get a quick review of your B.Tech credit transfer eligibility in just a few steps.</p>
              <EligibilityForm className="space-y-3" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized: small tag pinned to the top-right, stays fixed regardless of scroll — click to reopen the form */}
      <AnimatePresence>
        {showEligibilityPopup && isMinimized && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            onClick={() => setIsMinimized(false)}
            className="fixed top-24 right-4 md:right-6 z-[100] flex items-center gap-2 bg-white border-2 border-[#002147]/70 text-[#002147] font-bold px-4 py-2.5 rounded-full shadow-[0_10px_30px_-10px_rgba(23,42,83,0.35)] hover:-translate-y-0.5 transition-transform text-sm"
          >
            <ClipboardCheck className="w-4 h-4" />
            Check Eligibility
          </motion.button>
        )}
      </AnimatePresence>

<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
