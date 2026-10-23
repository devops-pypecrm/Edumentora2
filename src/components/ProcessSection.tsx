'use client';

import React from 'react';
import { ArrowRightLeft, Clock, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProcessSection() {
  const features = [
    {
      icon: <ArrowRightLeft className="w-8 h-8 text-[#002147]" />,
      title: "Seamless Credit Transfer",
      description: "Effortlessly transfer earned credits to resume your education without starting over or losing progress.",
      bgColor: "bg-[#E3E8F0]"
    },
    {
      icon: <Clock className="w-8 h-8 text-[#002147]" />,
      title: "Time and Cost Savings",
      description: "Save time and reduce costs by continuing your studies efficiently, maximizing academic success and value.",
      bgColor: "bg-[#E3E8F0]"
    },
    {
      icon: <Building2 className="w-8 h-8 text-[#14213D]" />,
      title: "Recognized Universities",
      description: "Partnered with Glocal University, Radha Govind University, and IEC University to provide accredited and respected degrees.",
      bgColor: "bg-[#E3E8F0]"
    },
  ];

  const processes = [
    {
      num: "01",
      title: "Start Application",
      desc: "Begin your journey easily.",
    },
    {
      num: "02",
      title: "Video Verification",
      desc: "Quick online process.",
    },
    {
      num: "03",
      title: "Seat Reservation",
      desc: "Secure your admission.",
    }
  ];

  return (
    <section className="relative w-full py-16 overflow-hidden bg-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-[80px] relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        
        {/* LEFT COLUMN: Features */}
        <div className="w-full lg:w-1/2 pr-0 lg:pr-8 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#002147] leading-tight mb-4">
              Ready To Grow with Edumentora
            </h2>
            <div className="w-16 h-1.5 bg-[#F9010D] rounded-full mb-12"></div>
          </motion.div>

          <div className="flex flex-col gap-6">
            {features.map((feature, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: index * 0.15 }}
                 className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 group flex flex-col sm:flex-row gap-6 items-start"
               >
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300 ${feature.bgColor}`}>
                   {feature.icon}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-[#002147] mb-2">
                     {feature.title}
                   </h3>
                   <p className="text-gray-600 text-[15px] leading-relaxed">
                     {feature.description}
                   </p>
                 </div>
               </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Process */}
        <div className="w-full lg:w-1/2 pt-12 lg:pt-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#002147] leading-tight">
              Know about Our Process
            </h2>
          </motion.div>

          {/* Timeline Layout */}
          <div className="relative py-8">
            {/* Center Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-200 hidden md:block"></div>

            <div className="flex flex-col gap-12 relative">
              {processes.map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative flex items-center justify-between w-full flex-col md:flex-row ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Left or Right Content Card */}
                  <div className={`w-full md:w-[45%] flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300 w-full group cursor-pointer relative overflow-hidden border border-gray-50">
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-[#F9010D]">
                        <ArrowRight size={20} />
                      </div>
                      <h4 className="text-lg font-bold text-[#002147] mb-1 pr-6">{process.title}</h4>
                      <p className="text-gray-500 text-sm">{process.desc}</p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-md border-4 border-gray-50 items-center justify-center z-10 text-[#002147] font-bold">
                    {process.num}
                  </div>

                  {/* Empty space for the other side */}
                  <div className="w-full md:w-[45%]"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
