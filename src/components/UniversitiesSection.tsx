'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function UniversitiesSection() {
  const universities = [
    {
      id: 1,
      name: "Manipur International University (MIU)",
      image: "/manipur_international_university.jpg",
    },
    {
      id: 2,
      name: "GLOCAL UNIVERSITY",
      image: "/glocal_university.png",
    },
    {
      id: 3,
      name: "MAYA DEVI UNIVERSITY",
      image: "/maya-devi-university.png",
    },
    {
      id: 4,
      name: "ARNI UNIVERSITY",
      image: "/arni-university.png",
    }
  ];

  return (
    <section className="w-full bg-[#E91D24] pt-24 pb-0 mt-5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight whitespace-nowrap">
          Our Most Trusted Universities
        </h2>
      </motion.div>

      <div className="overflow-hidden">
        <motion.div
          className="flex w-max gap-12 lg:gap-20"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
        >
          {[...universities, ...universities].map((uni, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-6 w-[220px] shrink-0 hover:scale-105 transition-transform duration-300 cursor-pointer grayscale hover:grayscale-0"
            >
              <div className="relative w-28 h-28 mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
                <Image src={uni.image} alt={uni.name} fill className="object-contain p-3" />
              </div>
              <h3 className={`font-bold ${uni.id === 1 ? 'text-sm' : 'text-lg'} text-white uppercase tracking-wider`}>
                {uni.name}
              </h3>
              {uni.id === 2 && <span className="text-[10px] text-white/70 uppercase tracking-widest mt-1">Shaping Global Minds</span>}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-12 pb-12 flex justify-center">
        <a 
          href="/universities" 
          className="bg-white text-[#E91D24] font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          Show all universities
          <span className="text-xl">→</span>
        </a>
      </div>
      </div>
    </section>
  );
}
