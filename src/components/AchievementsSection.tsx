'use client';

import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

function AnimatedValue({ value, start }: { value: string; start: boolean }) {
  const match = value.match(/^([\d,]+)(.*)$/);
  const numStr = match ? match[1].replace(/,/g, '') : '0';
  const suffix = match ? match[2] : '';
  const target = parseInt(numStr, 10);

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate(latest) {
        setDisplay(Math.floor(latest));
      },
    });
    return () => controls.stop();
  }, [start, target]);

  return (
    <h3 className="text-4xl md:text-5xl font-bold text-[#002147] mb-2">
      {display.toLocaleString()}{suffix}
    </h3>
  );
}

export default function AchievementsSection() {
  const [startCount, setStartCount] = useState(false);

  const achievements = [
    {
      title: "Successful Credit Transfers",
      value: "800+",
    },
    {
      title: "Years of Expertise in Industry",
      value: "16",
    },
    {
      title: "Awards and Recognition",
      value: "163",
    },
    {
      title: "Graduates With Certified Degrees",
      value: "5,000+",
    }
  ];

  return (
    <section className="w-full bg-white pt-16 pb-24 -mt-[20px] relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        onViewportEnter={() => setStartCount(true)}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-[#002147] leading-tight whitespace-nowrap">
          Our Great Achievements
        </h2>
      </motion.div>

      <div className="overflow-hidden">
        <motion.div
          className="flex w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
        >
          {[0, 1].map((setIndex) => (
            <div key={setIndex} className="flex gap-8 lg:gap-16 pr-8 lg:pr-16">
              {achievements.map((item, index) => (
                <div
                  key={`${setIndex}-${index}`}
                  className="flex flex-col items-center justify-center text-center p-4 w-[180px] shrink-0 hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <AnimatedValue value={item.value} start={startCount} />
                  <p className="text-[#002147]/80 text-xs font-medium leading-snug">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
      </div>
    </section>
  );
}
