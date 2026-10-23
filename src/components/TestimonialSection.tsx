'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, User, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import HomeGalleryClient from './HomeGalleryClient';
import ReelPlayer from './ReelPlayer';

export default function TestimonialSection({ reviews = [], galleryImages = [], promoVideos = [], successVideos = [] }: { reviews?: any[], galleryImages?: string[], promoVideos?: string[], successVideos?: string[] }) {
  const staticTestimonials = [
    {
      id: "1",
      name: "Aiswarya Raj",
      date: "2 months ago",
      text: "The best credit transfer agency in Kerala. The team is very supportive and helpful throughout the entire process.",
      rating: 5,
      image: null
    },
    {
      id: "2",
      name: "Mohammed Shibil",
      date: "6 months ago",
      text: "Highly recommended! They made my B.Tech credit transfer process incredibly smooth and tension-free.",
      rating: 5,
      image: null
    },
    {
      id: "3",
      name: "Fathima Nasrin",
      date: "8 months ago",
      text: "Professional, honest, and quick with responses. My university transfer went through without any hassle.",
      rating: 5,
      image: null
    }
  ];

  const displayTestimonials = reviews && reviews.length > 0 ? reviews.map(r => ({
    id: r.id,
    name: r.username,
    date: new Date(r.postedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
    text: r.comment,
    rating: r.rating,
    image: r.image || null
  })) : staticTestimonials;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Clicking a video on the right swaps the "Our Gallery" intro content (left
  // column) out for the playing video instead — not an overlay/popup. Going
  // back unmounts the player, which stops playback for every video type
  // (native <video> or any iframe embed).
  const [activeVideoSrc, setActiveVideoSrc] = useState<string | null>(null);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === displayTestimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? displayTestimonials.length - 1 : prevIndex - 1));
  };

  const videoTestimonials = successVideos;
  const edumentoraVideos = promoVideos;

  let displayImages = galleryImages;
  if (displayImages.length > 0 && displayImages.length < 5) {
    while (displayImages.length < 5) {
      displayImages = [...displayImages, ...galleryImages].slice(0, 8);
    }
  }

  return (
    <section className="w-full bg-white py-10 md:py-12 overflow-hidden">
      <style>{`
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-down {
          animation: scrollDown 20s linear infinite;
        }
        .animate-scroll-down:hover {
          animation-play-state: paused;
        }
        .animate-scroll-up {
          animation: scrollUp 25s linear infinite;
        }
        .animate-scroll-up:hover {
          animation-play-state: paused;
        }
        .fade-edges {
          mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start lg:items-stretch pt-4">

        {/* Left Column: Gallery + testimonial content, or the playing video, centered */}
        <div className={`w-full flex flex-col items-start text-left gap-6 ${activeVideoSrc ? 'justify-center' : 'justify-start'}`}>
          <AnimatePresence mode="wait">
            {activeVideoSrc ? (
              <motion.div
                key="playing-video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col items-center sticky top-1/2 translate-y-[-40%]"
              >
                <button
                  type="button"
                  onClick={() => setActiveVideoSrc(null)}
                  className="self-start inline-flex items-center gap-2 text-[#002147] font-semibold text-sm mb-4 hover:text-[#F9010D] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Gallery
                </button>
                <div className="relative w-full max-w-[360px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl">
                  <ReelPlayer src={activeVideoSrc} className="w-full h-full object-cover" autoPlay />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="gallery-and-testimonials"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col items-start gap-6"
              >
                {/* 1. Gallery Content */}
                <div className="flex flex-col items-start w-full">
                  <ScrollReveal delay={0.1}>
                    <div className="inline-flex items-center justify-center space-x-2 bg-white px-4 py-2 rounded-full mb-4 border border-gray-100 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#F9010D] animate-pulse"></span>
                      <span className="text-[#002147] font-semibold text-sm tracking-wider uppercase">Campus Life</span>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.2}>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#002147] tracking-tight mb-4">
                      Our Stories
                    </h2>
                  </ScrollReveal>

                  <ScrollReveal delay={0.3}>
                    <div className="w-24 h-1.5 bg-[#F9010D] rounded-full mb-6"></div>
                  </ScrollReveal>

                  <ScrollReveal delay={0.4}>
                    <p className="text-gray-600 text-lg md:text-xl max-w-xl mb-4">
                      Discover the vibrant moments and memories captured at Edumentora.
                    </p>
                  </ScrollReveal>

                  {/* Render the 3D Gallery Client if we have images */}
                  {displayImages.length > 0 && (
                    <ScrollReveal delay={0.5} className="w-full flex justify-start -ml-4 mb-4 transform scale-75 origin-left">
                      <HomeGalleryClient images={displayImages} />
                    </ScrollReveal>
                  )}

                  {/* Explore More Button */}
                  <ScrollReveal delay={0.6}>
                    <Link
                      href="/gallery"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-[#F9010D] text-white font-bold rounded-xl hover:bg-[#F9010D] transition-all hover:scale-105 shadow-lg hover:shadow-xl group"
                    >
                      <span>Explore More</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </ScrollReveal>
                </div>

                <div className="w-full h-px bg-gray-200 my-2"></div>

                {/* 2. What Our Students Say About Us! */}
                <div className="w-full flex flex-col items-start">
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-[#002147] text-left"
                  >
                    What Our Students Say<br />About Us!
                  </motion.h2>

                  <div className="relative w-full max-w-lg">
                    {/* The white card */}
                    <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-xl relative">

                      {/* Avatar overlapping top edge */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="relative">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.3 }}
                              className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden"
                            >
                              {displayTestimonials[currentIndex].image ? (
                                <img
                                  src={displayTestimonials[currentIndex].image}
                                  alt={displayTestimonials[currentIndex].name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-8 h-8 text-gray-400" />
                              )}
                            </motion.div>
                          </AnimatePresence>
                          {/* Small Google 'G' icon badge */}
                          <div className="absolute bottom-0 -right-1 bg-white rounded-full p-0.5 shadow-sm z-10">
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100 font-bold text-[10px]">
                              <span className="text-blue-500">G</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 h-40 flex flex-col justify-center">
                        <AnimatePresence mode='wait'>
                          <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3 className="font-bold text-black text-lg">
                              {displayTestimonials[currentIndex].name}
                            </h3>
                            <p className="text-gray-500 text-sm mb-3">
                              {displayTestimonials[currentIndex].date}
                            </p>

                            <div className="flex justify-center items-center gap-1 mb-4">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < displayTestimonials[currentIndex].rating ? 'fill-yellow-400 text-yellow-400' : 'fill-white text-gray-300'}`} />
                              ))}
                              <div className="ml-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-[10px]">✓</span>
                              </div>
                            </div>

                            <p className="text-black text-base font-medium">
                              "{displayTestimonials[currentIndex].text}"
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                    </div>

                    {/* Navigation Arrows */}
                    <button
                      onClick={prevTestimonial}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Watch Our Students Videos (Dual Tracks) */}
        <div className="w-full h-full min-h-[1000px] flex justify-center lg:justify-end gap-4 md:gap-6 pt-10">

          {/* Track 1: Edumentora Videos (Scrolls Up) */}
          <div className="relative h-[1000px] md:h-[1150px] w-full max-w-[160px] md:max-w-[200px] overflow-hidden fade-edges">
            <div className="flex flex-col gap-2 animate-scroll-up pb-2 hover:[animation-play-state:paused]">
              {[...edumentoraVideos, ...edumentoraVideos].map((src, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-full aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-md relative group cursor-pointer"
                  onClick={() => setActiveVideoSrc(src)}
                >
                  <ReelPlayer src={src} className="w-full h-full object-cover" />
                  {/* Blocks direct interaction with the inline thumbnail — the video only ever plays via the left-column swap */}
                  <div className="absolute inset-0 z-10" />
                </div>
              ))}
            </div>
          </div>

          {/* Track 2: Video Testimonials (Scrolls Down) */}
          <div className="relative h-[1000px] md:h-[1150px] w-full max-w-[160px] md:max-w-[200px] overflow-hidden fade-edges">
            <div className="flex flex-col gap-2 animate-scroll-down pb-2 hover:[animation-play-state:paused]">
              {[...videoTestimonials, ...videoTestimonials].map((src, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-full aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-md relative group cursor-pointer"
                  onClick={() => setActiveVideoSrc(src)}
                >
                  <ReelPlayer src={src} className="w-full h-full object-cover" />
                  {/* Blocks direct interaction with the inline thumbnail — the video only ever plays via the left-column swap */}
                  <div className="absolute inset-0 z-10" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
