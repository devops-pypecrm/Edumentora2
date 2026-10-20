'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SeoContentSection() {
  return (
    <section className="w-full bg-white py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 text-[#002147]/85 text-sm md:text-base leading-relaxed text-justify"
      >
        <p>
          For students who wish to continue their education without losing valuable time, finding the Credit Transfer Institute in Kerala is very important. Many students look for better options when they move to a new city, need advanced facilities, or wish to study in a place that offers stronger career opportunities. In such cases, the Credit Transfer Institute in Kerala helps them carry forward the credits they have already earned.
        </p>
        
        <p>
          The process is simpler than you think. Students will be requested to submit their mark sheets, syllabus, and proof of the subjects they have completed. The institute then checks which subjects match their own syllabus. Once the credits get accepted, the student can directly join the right semester. This way, the earlier work will be valued, and the degree can be completed on time.
        </p>
        
        <p>
          Choosing the Credit Transfer Institute in Kerala saves both time and money. It also provides flexibility for students who want to move into better colleges and still keep the progress they have already made. For anyone planning a shift, the Credit Transfer Institute in Kerala ensures a smooth change, values previous efforts, and supports students in finishing their education successfully.
        </p>
      </motion.div>
    </section>
  );
}
