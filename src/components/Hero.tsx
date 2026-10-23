'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, ShieldCheck, Bell } from 'lucide-react';
import EligibilityForm from '@/components/EligibilityForm';

const LoopingTypewriterText = ({
  baseSegments,
  loopSegments,
  speed = 40,
  deleteSpeed = 20,
  delay = 500,
  pause = 5000
}: {
  baseSegments: { text: string, className?: string }[],
  loopSegments: { text: string, className?: string }[][],
  speed?: number,
  deleteSpeed?: number,
  delay?: number,
  pause?: number
}) => {
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentLoopSegs = loopSegments[loopIndex];
  const fullBaseText = baseSegments.map(s => s.text).join("");
  const fullLoopText = currentLoopSegs.map(s => s.text).join("");
  const totalLength = fullBaseText.length + fullLoopText.length;

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    if (!isDeleting && charIndex < totalLength) {
      const t = setTimeout(() => setCharIndex(c => c + 1), speed);
      return () => clearTimeout(t);
    }

    if (!isDeleting && charIndex === totalLength) {
      const t = setTimeout(() => setIsDeleting(true), pause);
      return () => clearTimeout(t);
    }

    if (isDeleting && charIndex > fullBaseText.length) {
      const t = setTimeout(() => setCharIndex(c => c - 1), deleteSpeed);
      return () => clearTimeout(t);
    }

    if (isDeleting && charIndex === fullBaseText.length) {
      setIsDeleting(false);
      setLoopIndex((prev) => (prev + 1) % loopSegments.length);
    }
  }, [charIndex, started, isDeleting, totalLength, fullBaseText.length, loopSegments.length, speed, deleteSpeed, pause]);

  const combinedSegments = [...baseSegments, ...currentLoopSegs];

  let currentIndex = 0;
  return (
    <>
      {combinedSegments.map((seg, i) => {
        const segStart = currentIndex;
        currentIndex += seg.text.length;

        if (charIndex <= segStart) return null;

        const displayedText = seg.text.slice(0, charIndex - segStart);

        return (
          <span key={i} className={seg.className}>
            {displayedText.split('\n').map((line, j, arr) => (
              <React.Fragment key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      })}
      <style>{`
        @keyframes typeBlink {
          0%, 49% { opacity: 1; }
          50%, 99% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes heroAchieveScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-doodle { animation: none !important; }
        }
      `}</style>
      <span className="inline-block w-[5px] h-[0.9em] bg-[#F9010D] ml-1 align-middle" style={{ marginTop: '-4px', animation: 'typeBlink 1s infinite' }}></span>
    </>
  );
};

type HeroSlide = { id: string; imageUrl: string; altText: string };

export default function Hero({ notifications = [], slides = [], showContent = true }: { notifications?: string[]; slides?: HeroSlide[]; showContent?: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const visibleSlideIndex = slides.length > 0 ? activeSlide % slides.length : 0;
  // Server-provided (src/app/page.tsx fetches these the same way it fetches
  // reviews/gallery/reels) so the current notifications are present in the
  // server-rendered HTML itself, not only after client hydration.
  const [marqueeItems] = useState<string[]>(notifications);
  const marqueeBarRef = useRef<HTMLDivElement>(null);
  const [marqueeGap, setMarqueeGap] = useState(24);

  useEffect(() => {
    if (slides.length < 2 || shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length, shouldReduceMotion]);

  // Keep the gap between notifications at a true 5% of the marquee bar's own width.
  useEffect(() => {
    const updateGap = () => {
      if (marqueeBarRef.current) {
        setMarqueeGap(marqueeBarRef.current.clientWidth * 0.05);
      }
    };
    updateGap();
    window.addEventListener('resize', updateGap);
    return () => window.removeEventListener('resize', updateGap);
  }, []);

  const riseIn = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0.01 : 0.5, delay, ease: 'easeOut' as const },
  });

  // A handful (or even just one) notification would otherwise only fill a small
  // portion of the bar, leaving the rest empty — repeat the list so the strip
  // comfortably spans the full width regardless of how many notifications there are.
  let displayMarqueeItems = marqueeItems;
  if (displayMarqueeItems.length > 0 && displayMarqueeItems.length < 8) {
    while (displayMarqueeItems.length < 8) {
      displayMarqueeItems = [...displayMarqueeItems, ...marqueeItems];
    }
  }

  const heroDoodles = [
    { left: '5%', top: '8%', width: '260px', rotate: '-12deg', opacity: 0.28 },
    { left: '18%', top: '48%', width: '260px', rotate: '18deg', opacity: 0.3 },
    { left: '42%', top: '18%', width: '230px', rotate: '8deg', opacity: 0.22 },
    { left: '62%', top: '8%', width: '300px', rotate: '0deg', opacity: 0.34 },
    { left: '68%', top: '48%', width: '270px', rotate: '18deg', opacity: 0.25 },
    { left: '48%', top: '62%', width: '220px', rotate: '-12deg', opacity: 0.2 },
  ];

  return (
    <section className={`relative w-full flex overflow-hidden font-[Poppins] ${showContent ? 'min-h-[100svh] md:h-[100dvh]' : 'h-auto md:h-[100dvh]'}`}>

      {/* Main hero area */}
      <div className={`relative flex-1 flex flex-col pb-0 overflow-hidden ${showContent ? 'min-h-[100svh] md:h-full pt-[5.5rem] md:pt-32 lg:pt-[100px] bg-[#07111f]' : 'min-h-[100svh] pt-[5.5rem] md:h-full md:pt-32 lg:pt-[100px] bg-[#002147]'}`}>
        <div className={`absolute z-0 overflow-hidden ${showContent ? 'inset-0' : 'inset-x-0 top-0 h-[100svh] md:inset-0 md:h-auto'}`}>
          {slides.length > 0 ? (
            <>
              {/* Preload every slide so switching never exposes the page background. */}
              <div className="hidden" aria-hidden="true">
                {slides.map((slide) => <img key={slide.id} src={slide.imageUrl} alt="" />)}
              </div>
              <AnimatePresence initial={false} mode="sync">
                <motion.img
                  key={slides[visibleSlideIndex].id}
                  src={slides[visibleSlideIndex].imageUrl}
                  alt={slides[visibleSlideIndex].altText}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: '4%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: '-4%' }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="hero-carousel-image absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </>
          ) : (
            <div className="absolute inset-0 pointer-events-none">
              {heroDoodles.map((doodle, index) => (
                <img
                  key={index}
                  src="/favcon/edumentora_favcon.png"
                  alt=""
                  className="absolute select-none"
                  style={{
                    left: doodle.left,
                    top: doodle.top,
                    width: doodle.width,
                    transform: `rotate(${doodle.rotate})`,
                    opacity: doodle.opacity,
                    filter: index % 2 === 0 ? 'saturate(1.4) brightness(1.2) contrast(1.1)' : 'saturate(1.1) brightness(1.15)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
        {slides.length === 0 && <div className="absolute inset-0 z-[1] bg-[#edf6ff]/65" />}
        {showContent && <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-[#07111f]/60 to-[#07111f]/95 md:hidden" />}

        {slides.length > 1 && (
          <div className="absolute right-4 top-[5.9rem] z-20 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-2 backdrop-blur-sm md:bottom-24 md:right-10 md:top-auto md:gap-2 md:bg-white/90 md:px-3 md:shadow-lg">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show hero image ${index + 1}`}
                aria-current={index === visibleSlideIndex}
                className={`h-2.5 rounded-full transition-all ${index === visibleSlideIndex ? 'w-7 bg-[#F9010D]' : 'w-2.5 bg-[#002147]/40 hover:bg-[#002147]/70'}`}
              />
            ))}
          </div>
        )}

      <div className={`relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-visible px-5 pb-5 md:px-8 md:pb-6 ${showContent ? 'md:overflow-y-auto' : 'md:overflow-hidden'}`}>
        <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-4 md:gap-8 lg:gap-10 items-stretch">

          {showContent && <>
          {/* Mobile-only: trust badge pinned at the very top-left, above the (independently shifted) content block */}
          <motion.div
            {...riseIn(0.05)}
            className="md:hidden self-start flex max-w-[calc(100%-4rem)] items-center gap-2 bg-white/95 px-3 py-2 rounded-xl"
          >
            <ShieldCheck className="w-5 h-5 text-[#002147]" />
            <span className="font-bold text-[#002147] text-xs sm:text-sm">Academic Credit Transfer Guidance</span>
          </motion.div>

          {/* 1: Content + paragraph */}
          <div className="flex flex-col items-start justify-center text-left h-full md:flex-[1.3]">

            {/* Trust badge card — desktop/tablet, unchanged */}
            <motion.div
              {...riseIn(0.05)}
              className="hidden md:flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(23,42,83,0.25)] mb-6"
            >
              <ShieldCheck className="w-5 h-5 text-[#002147]" />
              <span className="font-bold text-[#002147] text-sm">Academic Credit Transfer Guidance</span>
            </motion.div>

            <h1 className="text-[2rem] min-[380px]:text-[2.25rem] sm:text-5xl xl:text-6xl font-extrabold text-white md:text-[#002147] leading-[1.08] tracking-tight mt-8 md:mt-3 mb-4 min-h-[118px] sm:min-h-[160px] md:h-[200px] xl:h-[220px] flex flex-col justify-end drop-shadow-sm md:drop-shadow-none">
              <div>
                <LoopingTypewriterText
                  speed={40}
                  deleteSpeed={30}
                  pause={2200}
                  baseSegments={[
                    { text: "Without Starting\nOver, Continue\nYour " },
                  ]}
                  loopSegments={[
                    [{ text: "B.Tech", className: "text-[#F9010D]" }],
                    [{ text: "UG", className: "text-[#F9010D]" }],
                    [{ text: "PG", className: "text-[#F9010D]" }],
                    [{ text: "Diploma", className: "text-[#F9010D]" }],
                  ]}
                />
              </div>
            </h1>

            <motion.p
              {...riseIn(0.12)}
              className="inline-flex rounded-full bg-white px-3 py-1.5 text-[#002147] md:bg-transparent md:px-0 md:py-0 font-bold text-xs sm:text-sm md:text-base tracking-wide mb-3 md:mb-2"
            >
              Academic Credit Transfer Guidance in Kerala
            </motion.p>

            <motion.p
              {...riseIn(0.15)}
              className="text-white/90 md:text-gray-600 text-sm sm:text-base leading-relaxed mb-5 max-w-md"
            >
              Transfer the credits you&rsquo;ve already earned to a UGC-approved, AICTE-recognized university and pick up exactly where you left off — no entrance exam, no repeated years.
            </motion.p>

            <motion.div
              {...riseIn(0.3)}
              className="grid w-full grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-4 items-center mt-1 md:mt-[5%] md:w-auto"
            >
              <a href="https://findyouruniversity.com/" target="_blank" rel="noopener noreferrer" className="w-full sm:flex-1 md:flex-none min-w-0">
                <button className="w-full whitespace-nowrap border border-white/50 bg-white/10 text-white font-bold px-3 py-3 text-[11px] md:bg-[#002147] md:border-0 md:px-7 md:py-3 md:text-base rounded-full backdrop-blur-sm transition-all duration-300">
                  Find Your University
                </button>
              </a>
              <a href="/contact" className="w-full sm:flex-1 md:flex-none min-w-0">
                <button className="w-full whitespace-nowrap bg-[#F9010D] text-white font-bold px-3 py-3 text-[11px] md:px-7 md:py-3 md:text-base rounded-full transition-all duration-300">
                  Book a Free Consultation
                </button>
              </a>
            </motion.div>

            {/* Mobile-only widget — replaces the inline eligibility form; tap to open it in a modal */}
          </div>

          {/* 3: Check Your Eligibility Now form, with accent glow + doodles — hidden on mobile, replaced by a tap-to-open widget below */}
          </>}

          <motion.div
            {...riseIn(showContent ? 0.4 : 0.1)}
            className={`md:hidden w-full rounded-[1.5rem] border-[3px] border-[#002147]/70 bg-white p-4 ${showContent ? 'mt-7' : 'mt-[42svh] mb-3'}`}
          >
            <div className="mb-2 flex w-fit items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1">
              <ClipboardCheck className="size-4 text-[#002147]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#002147]">Fast Assessment</span>
            </div>
            <h3 className="mb-1 text-lg font-bold text-[#002147]">Check Your Eligibility Now</h3>
            <p className="mb-4 text-sm leading-5 text-gray-600">Get a quick review of your credit transfer eligibility in just a few steps.</p>
            <EligibilityForm className="space-y-3" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, delay: 0.15, ease: 'easeOut' }}
            className={`hidden md:flex relative w-full h-full items-center justify-center md:justify-end ${showContent ? 'md:flex-1' : ''}`}
          >
            {/* Decorative doodles — gentle float, disabled under prefers-reduced-motion */}
            <svg
              className="hero-doodle hidden lg:block absolute -top-6 left-6 w-14 h-10 text-[#002147]/70 pointer-events-none"
              style={{ animation: shouldReduceMotion ? 'none' : 'heroFloat 4s ease-in-out infinite' }}
              viewBox="0 0 60 40" fill="none"
            >
              <path d="M2 8 Q10 2 18 8 T34 8 T50 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <svg
              className="hero-doodle hidden lg:block absolute top-10 -right-4 w-10 h-10 text-[#002147] pointer-events-none"
              style={{ animation: shouldReduceMotion ? 'none' : 'heroFloat 3.2s ease-in-out infinite 0.4s' }}
              viewBox="0 0 40 40" fill="none"
            >
              <path d="M20 2 L23 15 L36 15 L25 23 L29 36 L20 28 L11 36 L15 23 L4 15 L17 15 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>

            <div id="eligibility-form" className="relative w-full max-w-[270px] min-[900px]:max-w-[290px] lg:max-w-[360px] rounded-[1.5rem] lg:rounded-[2.5rem] border-[3px] lg:border-4 border-[#002147]/70 shadow-[0_25px_60px_-20px_rgba(23,42,83,0.35)] bg-white p-3 min-[900px]:p-4 lg:p-6 scroll-mt-32">
              <div className="flex items-center gap-2 mb-2 lg:mb-3 rounded-full bg-blue-50 w-fit px-2.5 py-1 lg:px-3 lg:py-1.5">
                <ClipboardCheck className="w-4 h-4 text-[#002147]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#002147]">Fast Assessment</span>
              </div>
              <h3 className="text-[15px] min-[900px]:text-base lg:text-xl font-bold text-[#002147] mb-1">Check Your Eligibility Now</h3>
              <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4 leading-5 lg:leading-6">Get a quick review of your credit transfer eligibility in just a few steps.</p>
              <EligibilityForm className="space-y-3" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrolling trust marquee — all notifications flow continuously in one strip, looping seamlessly */}
      <div ref={marqueeBarRef} className="relative z-10 hidden w-full shrink-0 bg-[#002147] py-3 overflow-hidden md:block">
        {/* Bell icon pinned at the left, marking this strip as notifications — sits above the scrolling track, fades it out underneath, and links to the notifications page */}
        {displayMarqueeItems.length > 0 && (
          <Link
            href="/notifications"
            aria-label="View all notifications"
            className="absolute inset-y-0 left-0 z-20 flex items-center pl-4 pr-8 bg-gradient-to-r from-[#002147] via-[#002147] to-transparent hover:opacity-80 transition-opacity"
          >
            <Bell className="h-full w-auto max-h-9 text-[#F9010D]" />
          </Link>
        )}
        {displayMarqueeItems.length > 0 && (
          <div className="hero-marquee-track flex whitespace-nowrap w-max">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
                {displayMarqueeItems.map((item, i) => (
                  <span key={i} style={{ marginLeft: marqueeGap / 2, marginRight: marqueeGap / 2 }} className="flex items-center gap-3 text-white text-sm font-semibold tracking-wide">
                    {item}
                    <span className="text-[#002147]">&#10022;</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Mobile eligibility widget modal — same content as the desktop inline form */}
    </section>
  );
}
