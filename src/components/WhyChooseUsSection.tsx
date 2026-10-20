'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardCheck, 
  Lightbulb, 
  HeartHandshake, 
  MousePointerClick, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export default function WhyChooseUsSection() {
  const reasons = [
    {
      title: "Expert guidance",
      desc: "Our dedicated team offers tailored guidance, ensuring a seamless and successful academic credit transfer experience for each student.",
      icon: <ClipboardCheck className="w-6 h-6 text-[#002147] group-hover:text-[#E91D24] transition-colors duration-300" />,
      glowColor: "bg-[#002147]/5 group-hover:bg-[#E91D24]/10"
    },
    {
      title: "Flexible learning paths",
      desc: "We offer tailored programs that allow you to balance education with personal and professional commitments effectively.",
      icon: <Lightbulb className="w-6 h-6 text-[#002147] group-hover:text-[#E91D24] transition-colors duration-300" />,
      glowColor: "bg-[#002147]/5 group-hover:bg-[#E91D24]/10"
    },
    {
      title: "Personalized support",
      desc: "Our experienced team offers personalized support, guaranteeing a seamless and hassle-free academic credit transfer experience.",
      icon: <HeartHandshake className="w-6 h-6 text-[#002147] group-hover:text-[#E91D24] transition-colors duration-300" />,
      glowColor: "bg-[#002147]/5 group-hover:bg-[#E91D24]/10"
    },
    {
      title: "Effortless credit transfer",
      desc: "Seamlessly transfer your earned credits to resume your education without losing progress or starting from scratch.",
      icon: <MousePointerClick className="w-6 h-6 text-[#002147] group-hover:text-[#E91D24] transition-colors duration-300" />,
      glowColor: "bg-[#002147]/5 group-hover:bg-[#E91D24]/10"
    },
    {
      title: "Trusted university",
      desc: "Collaborations with Glocal University, Radha Govind University, and Arni University ensure globally recognized and accredited degrees.",
      icon: <ShieldCheck className="w-6 h-6 text-[#002147] group-hover:text-[#E91D24] transition-colors duration-300" />,
      glowColor: "bg-[#002147]/5 group-hover:bg-[#E91D24]/10"
    },
    {
      title: "Save time and money",
      desc: "Resume your education from where you paused, saving valuable time and reducing overall financial expenses efficiently.",
      icon: <Clock className="w-6 h-6 text-[#002147] group-hover:text-[#E91D24] transition-colors duration-300" />,
      glowColor: "bg-[#002147]/5 group-hover:bg-[#E91D24]/10"
    }
  ];

  return (
    <section className="relative w-full py-16 overflow-hidden bg-white">
      {/* Subtle Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgTCA0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjMsNDIsODMsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E91D24]/10 border border-[#E91D24]/25 text-[#E91D24] font-semibold text-[10px] tracking-widest uppercase mb-4 shadow-sm"
          >
            <ShieldCheck className="w-3 h-3" />
            Our Advantage
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#002147] leading-tight"
          >
            Why We are the <br className="hidden md:block" />
            <span className="text-[#E91D24]">Right Choice</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative h-full"
            >
              <div className="relative h-full bg-white border-2 border-gray-100 rounded-[1.5rem] p-5 lg:p-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#E91D24] group-hover:shadow-[0_20px_40px_-15px_rgba(233, 29, 36,0.25)] overflow-hidden flex flex-col z-10">
                
                {/* Decorative corner gradient */}
                <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gray-50 rounded-full group-hover:bg-red-50 transition-colors duration-500 ease-out`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 relative overflow-hidden shrink-0 ${reason.glowColor}`}>
                    {reason.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#002147] mb-2 group-hover:text-[#E91D24] transition-colors duration-300">
                    {reason.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-snug text-[13px] md:text-sm flex-grow">
                    {reason.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
