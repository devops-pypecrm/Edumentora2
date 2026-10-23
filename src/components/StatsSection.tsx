'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import Link from 'next/link';
import { Award, Briefcase } from 'lucide-react';

type StatUniversity = { id: string; name: string; logo: string };

function AnimatedCounter({ from = 0, to, duration = 2, suffix = '' }: { from?: number, to: number, duration?: number, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  // Starts at the real, final value (not `from`) so the number is correct in
  // the server-rendered HTML before any JS runs — the count-up is then a
  // purely cosmetic flourish layered on top once the element scrolls into view.
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (isInView) {
      setValue(from);
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(val) {
          setValue(Math.round(val));
        }
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

export default function StatsSection({ universities = [] }: { universities?: StatUniversity[] }) {
  const slots = Math.min(4, universities.length) || 4;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (universities.length <= slots) return;
    const timer = setInterval(() => {
      setOffset((prev) => (prev + slots) % universities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [universities.length, slots]);

  const visibleLogos = Array.from({ length: Math.min(slots, universities.length) }, (_, i) =>
    universities[(offset + i) % universities.length]
  );

  return (
    <section className="relative z-20 w-full overflow-hidden bg-white">
      <div className="max-w-[1400px] mx-auto py-[60px] px-4 md:px-8">
        {/* Heading Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center text-center mb-10"
      >
        <span className="text-[#F9010D] text-[13px] md:text-sm font-bold tracking-[0.2em] mb-3 uppercase font-[Poppins]">
          OUR IMPACT
        </span>
        <h2 className="text-[36px] md:text-[48px] font-bold text-[#002147] font-[Playfair_Display] leading-[1.15] mb-5 max-w-4xl">
          Edumentora Makes<br />
          <span className="text-[#F9010D]">Restarting</span> your Education Easier
        </h2>
        <div className="w-20 h-[2px] bg-[#F9010D] rounded-full mb-8"></div>

        <h3 className="text-[20px] md:text-[24px] font-semibold text-[#002147] font-[Poppins]">
          <Link
            href="/universities"
            className="hover:text-[#F9010D] transition-colors underline decoration-[#F9010D] decoration-2 underline-offset-4"
          >
            Visit Our Trusted Universities
          </Link>
        </h3>
      </motion.div>

      {/* Showcase Flow Area */}
      <div className="relative w-full py-6 mt-4">
        
        {/* SVG Curved Connector (Desktop only to prevent messy mobile overlap) */}
        <div className="absolute top-1/2 left-0 w-full h-[200px] -translate-y-1/2 pointer-events-none z-0 hidden xl:block">
          <style>{`
            @keyframes statsConnectorFlow {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -24; }
            }
            .stats-connector-line {
              animation: statsConnectorFlow 1.2s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .stats-connector-line { animation: none; }
            }
          `}</style>
          <svg width="100%" height="100%" viewBox="0 0 1200 200" fill="none" preserveAspectRatio="none">
            {/* Smooth flowing sine-wave style path connecting the centers */}
            <path
              className="stats-connector-line opacity-70"
              d="M 130,100 C 300,50 400,160 600,100 C 800,40 900,150 1070,100"
              stroke="#F9010D"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
            />
            {/* Connection nodes under each card (approximate positions corresponding to the offsets) */}
            <circle cx="130" cy="100" r="4" fill="#F9010D" />
            <circle cx="340" cy="72" r="4" fill="#F9010D" />
            <circle cx="510" cy="120" r="4" fill="#F9010D" />
            <circle cx="680" cy="80" r="4" fill="#F9010D" />
            <circle cx="850" cy="128" r="4" fill="#F9010D" />
            <circle cx="1070" cy="100" r="4" fill="#F9010D" />
          </svg>
        </div>

        {/* Content Row */}
        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-[32px] w-full max-w-[1200px] mx-auto">
          
          {/* Left Stat */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full sm:w-[240px] shrink-0 drop-shadow-[0_15px_25px_rgba(0,0,0,0.05)] hover:drop-shadow-[0_20px_35px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-300 z-10"
          >
            <div className="bg-white p-6 pb-8 flex flex-col items-center text-center relative w-full h-full"
                 style={{ clipPath: 'polygon(50% 0%, 100% 12%, 100% 88%, 50% 100%, 0% 88%, 0% 12%)', minHeight: '260px' }}>
              <div className="w-12 h-12 rounded-full border-2 border-[#F9010D] text-[#F9010D] flex items-center justify-center mb-4 mt-2">
                <Briefcase size={24} strokeWidth={1.5} />
              </div>
              <h4 className="text-[48px] md:text-[56px] font-bold font-[Playfair_Display] text-[#002147] leading-none mb-3">
                <AnimatedCounter to={16} suffix="+" />
              </h4>
              <p className="text-[15px] md:text-[16px] text-[#002147] font-[Poppins] leading-[1.4]">
                Years of Expertise<br/>in Industry
              </p>
            </div>
          </motion.div>

          {/* Universities Container */}
          <div className="flex flex-wrap xl:flex-nowrap justify-center gap-[32px] flex-1">
            {/* Alternate vertical offsets for a sine wave feel on large screens */}
            {(() => {
              const offsets = ['xl:-translate-y-8', 'xl:translate-y-4', 'xl:-translate-y-4', 'xl:translate-y-8'];
              return (
                <AnimatePresence mode="popLayout">
                  {visibleLogos.map((logo, i) => (
                    <motion.div
                      key={logo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] ${offsets[i]}`}
                    >
                      <Link href={`/universities?filter=${encodeURIComponent(logo.name)}#universities-list`} className="block w-full h-full">
                        <div className="bg-white rounded-[24px] w-full h-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-[#ECECEC] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-300 p-4">
                          <img
                            src={logo.logo}
                            alt={logo.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              );
            })()}
          </div>

          {/* Right Stat */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="w-full sm:w-[240px] shrink-0 drop-shadow-[0_15px_25px_rgba(0,0,0,0.05)] hover:drop-shadow-[0_20px_35px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-300 z-10"
          >
            <div className="bg-white p-6 pb-8 flex flex-col items-center text-center relative w-full h-full"
                 style={{ clipPath: 'polygon(50% 0%, 100% 12%, 100% 88%, 50% 100%, 0% 88%, 0% 12%)', minHeight: '260px' }}>
              <div className="w-12 h-12 rounded-full border-2 border-[#F9010D] text-[#F9010D] flex items-center justify-center mb-4 mt-2">
                <Award size={24} strokeWidth={1.5} />
              </div>
              <h4 className="text-[48px] md:text-[56px] font-bold font-[Playfair_Display] text-[#002147] leading-none mb-3">
                <AnimatedCounter to={163} />
              </h4>
              <p className="text-[15px] md:text-[16px] text-[#002147] font-[Poppins] leading-[1.4]">
                Awards and<br/>Recognition<br/>in Industry
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
}
