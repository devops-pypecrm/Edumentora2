'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const edumentoraVideos = [
  "/videos/edu_vdo_002/AQMVj3lkTOBgMHTnLZTC2J4kfHstGPCf2q03YmOLyyo6c3tT2MXe3fa_KOV7ZqW3-y1_BPFhshr8BcJg6LBF95WvJxk_iXMkDgXHsjc.mp4",
  "/videos/edu_vdo_002/AQNSavI6FlYWDwT6h6LLNyQGF24TQPZIX7g3EmKsBpaVn-4mDMUz6b9w6tPS6ZIoNI3D0kjp_c6AY6fLRWMBvP46xqd9EI7K7U5p968.mp4",
  "/videos/edu_vdo_002/AQONsMIdVI0-4Qh0PeZPNOd1hLNrEpXKKLKPMB_ZsQEkISLYbqILCZoYfj1n8DF7RqGaFcE_AX8gRyc8Kzq6Q8udqWFdJbIyDnCKwss.mp4",
  "/videos/edu_vdo_002/AQOYIuE_RxbeMs5toV-jgVMPka2Pu5oupIwX-iXJjtkCWkgKCP4SEiS9l1vdvKPRE-QwXre_oEaORvYnmFj8ZYSfTMt1m5rMKNTko7U.mp4",
  "/videos/edu_vdo_002/AQOxffHXxWVuQqOy-5bt_MkuHMZoeQmlQ1bD6oIQVsNkclT8_43QjykbdsS9hZV8neWXGIzzL8Yp4gIGqBG5caMUgj_NOSvC9CPrFSM.mp4",
  "/videos/edu_vdo_002/AQP1bJu-J18cIMOjllZW30S4EEX6dVbCNZLW-5lBxYrHhjm6kaf2q0ZwJQTDOElKNjaXQQ6SoLckr3FxCRVtElzBHwrhOfdLrUKFxYE.mp4"
];

export default function HomeGallerySection() {
  // Scroll pauses while any video in the strip is actually playing (not just on hover),
  // and resumes once every playing video has been paused/ended.
  const [playingIndices, setPlayingIndices] = useState<Set<number>>(new Set());
  const isAnyPlaying = playingIndices.size > 0;

  const handlePlay = (idx: number) => {
    setPlayingIndices((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  };

  const handleStop = (idx: number) => {
    setPlayingIndices((prev) => {
      if (!prev.has(idx)) return prev;
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
  };

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      <style>{`
        @keyframes scrollUpGallery {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-up-gallery {
          animation: scrollUpGallery 25s linear infinite;
        }
        .animate-scroll-up-gallery:hover {
          animation-play-state: paused;
        }
        .fade-edges-gallery {
          mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
        }
      `}</style>

      {/* Grid Content Section */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Side: Text and Button */}
        <div className="text-left flex flex-col items-start justify-center">
          <ScrollReveal delay={0.1}>
            <div className="inline-flex items-center justify-center space-x-2 bg-gray-50 px-4 py-2 rounded-full mb-4 border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-[#E91D24] animate-pulse"></span>
              <span className="text-[#002147] font-semibold text-sm tracking-wider uppercase">Campus Life</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#002147] tracking-tight mb-4">
              Our Gallery
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="w-24 h-1.5 bg-[#E91D24] rounded-full mb-6"></div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-gray-600 text-lg md:text-xl max-w-xl mb-8">
              Discover the vibrant moments and memories captured at Edumentora.
            </p>
          </ScrollReveal>

          {/* Explore More Button */}
          <ScrollReveal delay={0.5}>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#8B0000] text-white font-bold rounded-xl hover:bg-[#5C0000] transition-all hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <span>Explore More</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Right Side: Vertically Scrolling Videos */}
        <div className="w-full flex justify-center">
          <ScrollReveal delay={0.6} className="w-full flex justify-center">
            <div className="relative h-[450px] md:h-[550px] w-full max-w-[180px] md:max-w-[220px] overflow-hidden fade-edges-gallery mx-auto">
              <div
                className="flex flex-col gap-5 animate-scroll-up-gallery pb-5 hover:[animation-play-state:paused]"
                style={isAnyPlaying ? { animationPlayState: 'paused' } : undefined}
              >
                {[...edumentoraVideos, ...edumentoraVideos].map((src, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-full aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-md relative group"
                  >
                    <video
                      src={src}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                      onPlay={() => handlePlay(idx)}
                      onPause={() => handleStop(idx)}
                      onEnded={() => handleStop(idx)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
