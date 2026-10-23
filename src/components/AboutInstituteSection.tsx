'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutInstituteSection() {
  return (
    <section className="w-full bg-white py-16 mt-[30px]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-[#2b2418]">

        {/* Masthead-style headline with double rule, like a newspaper front page */}
        <div className="border-t-4 border-b border-[#2b2418] pt-3 pb-2 mb-2">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-5xl font-bold leading-tight text-center"
          >
            Credit Transfer Institute in<br className="hidden md:block" /> Kerala for B.Tech Students
          </motion.h2>
        </div>
        <div className="border-b-2 border-[#2b2418] mb-10" />

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          {/* Article body, set in newspaper-style columns with a drop cap */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 font-serif text-sm md:text-base leading-relaxed text-justify columns-1 md:columns-2 gap-8 [column-rule:1px_solid_rgba(43,36,24,0.25)] first-letter:float-left first-letter:font-bold first-letter:text-6xl first-letter:leading-[0.8] first-letter:pr-2 first-letter:pt-1"
          >
            At Edumentora, we believe education is a right—not a privilege. Unfortunately, many
            students are forced to discontinue their graduation or postgraduate programs due to
            academic roadblocks, personal setbacks, or institutional barriers. This often leaves
            them uncertain about how to complete their education without starting over. As a
            leading academic credit transfer institution, Edumentora specializes in helping
            students seamlessly resume and complete their degrees, including{' '}
            <Link href="/b-tech-credit-transfer" className="underline decoration-1 underline-offset-2 hover:text-[#F9010D] transition-colors">
              B. Tech
            </Link>{' '}
            and other
            professional programs. Recognized as a trusted engineering academic credit
            transfer institution in Kerala, we offer a streamlined solution for transferring
            previously earned academic credits to UGC-recognized universities. Our process is
            simple and effective: we assess your existing academic credits, align them with
            partner universities, and ensure a smooth transfer—saving you valuable time and
            money. With Edumentora, you can continue your education from where you left off
            and move closer to your academic and career goals without unnecessary repetition
            or delays.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
