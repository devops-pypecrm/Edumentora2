'use client';

import React from 'react';
import { ArrowRightLeft, Clock, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeaturesSection() {
  const features = [
    {
      icon: <ArrowRightLeft className="w-8 h-8 text-blue-600" />,
      title: "Seamless Credit Transfer",
      description: "Effortlessly transfer earned credits to resume your education without starting over or losing progress.",
      linkText: "Explore Courses",
      linkHref: "#",
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Time and Cost Savings",
      description: "Save time and reduce costs by continuing your studies efficiently, maximizing academic success and value.",
      linkText: "About Us",
      linkHref: "#",
    },
    {
      icon: <Building2 className="w-8 h-8 text-red-500" />,
      title: "Recognized Universities",
      description: "Partnered with Glocal University, Radha Govind University, and IEC University to provide accredited and respected degrees.",
      linkText: "Explore Universities",
      linkHref: "#",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-5 bg-white">
      <div className="mb-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-black leading-tight max-w-2xl"
        >
          Ready To Grow with Edumentora
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-[30px] p-10 border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
          >
            <div className="mb-6">
              {feature.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-black mb-4">
              {feature.title}
            </h3>
            
            <p className="text-gray-500 text-lg leading-relaxed flex-grow mb-8">
              {feature.description}
            </p>
            
            <Link 
              href={feature.linkHref}
              className="inline-flex items-center text-black font-bold text-sm hover:text-red-600 transition-colors group mt-auto"
            >
              {feature.linkText}
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
