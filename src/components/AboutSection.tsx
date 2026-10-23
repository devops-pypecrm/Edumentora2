'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Phone, Volume2, VolumeX } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const action = isMuted ? 'unMute' : 'mute';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: action, args: [] }), '*');
      setIsMuted(!isMuted);
    }
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const imageX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [-200, 0, 0, -200]);
  const imageRotateY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [-90, 0, 0, -90]);
  const contentX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [200, 0, 0, 200]);
  const contentRotateY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [90, 0, 0, 90]);

  return (
    <section ref={sectionRef} className="w-full bg-white overflow-hidden mb-[10px] -mt-[60px] relative z-10">
      <motion.div
        style={{ opacity: sectionOpacity }}
        className="max-w-7xl mx-auto px-8 pt-16 pb-24 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center [perspective:1500px]"
      >

        {/* Left Side: Video */}
        <div className="w-full lg:w-1/2 relative h-auto flex flex-col items-center justify-center mt-5 mb-10 lg:mb-0">
          <motion.div 
            style={{ x: imageX, rotateY: imageRotateY, transformStyle: 'preserve-3d' }}
            className="relative w-full max-w-[800px] aspect-video rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] group"
          >
            {/* YouTube Iframe */}
            <div 
              className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black shadow-inner cursor-pointer"
              onClick={() => window.open("https://www.youtube.com/watch?v=bjIA16xIvHg", "_blank")}
            >
              <iframe
                ref={iframeRef}
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/bjIA16xIvHg?autoplay=1&mute=1&loop=1&playlist=bjIA16xIvHg&controls=0&modestbranding=1&rel=0&enablejsapi=1&disablekb=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full object-cover relative z-0 pointer-events-none"
              ></iframe>
              
              {/* Custom Overlay for Mute */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all z-20 cursor-pointer"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Content */}
        <motion.div
          style={{ x: contentX, rotateY: contentRotateY, transformStyle: 'preserve-3d' }}
          className="w-full lg:w-1/2 flex flex-col justify-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#002147] my-5">
            About Edumentora
          </h2>

          <div className="border-l-4 border-[#F9010D] pl-6">
            <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-medium">
              Edumentora makes restarting your education easy by transferring past credits to accredited universities, saving you time and money.
            </p>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed text-justify">
            Resume your graduation or postgraduate education through Edumentora, a leading academic credit transfer institution. Transfer earned credits for B. Tech, engineering, and other programs to recognized universities, saving time and costs while achieving academic success.
          </p>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F9010D]/10 rounded-xl flex items-center justify-center shadow-sm">
              <Phone className="w-6 h-6 text-[#F9010D]" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Call Us Anytime</p>
              <p className="text-[#002147] font-bold text-lg">+91 974458 7777</p>
            </div>
          </div>

          <div>
            <button className="bg-[#F9010D] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#F9010D]/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300">
              About Us
            </button>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
