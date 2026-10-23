'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function LocationsSection() {
  const [expanded, setExpanded] = useState(false);

  const locations = [
    [
      { name: "B Tech Credit Transfer Alappuzha", url: "/b-tech-credit-transfer-alappuzha" },
      { name: "B Tech Credit Transfer Ernakulam", url: "/b-tech-credit-transfer-ernakulam" },
      { name: "B Tech Credit Transfer Idukki", url: "/b-tech-credit-transfer-idukki" },
      { name: "B Tech Credit Transfer Palakkad", url: "/b-tech-credit-transfer-palakkad" },
      { name: "B Tech Credit Transfer Wayanad", url: "/b-tech-credit-transfer-wayanad" }
    ],
    [
      { name: "B Tech Credit Transfer Kannur", url: "/b-tech-credit-transfer-kannur" },
      { name: "B Tech Credit Transfer Kasaragod", url: "/b-tech-credit-transfer-kasaragod" },
      { name: "B Tech Credit Transfer Kollam", url: "/b-tech-credit-transfer-kollam" },
      { name: "B Tech Credit Transfer Pathanamthitta", url: "/b-tech-credit-transfer-pathanamthitta" },
      { name: "BTech Credit Transfer in Kochi", url: "/b-tech-credit-transfer-in-kochi" }
    ],
    [
      { name: "B Tech Credit Transfer Kottayam", url: "/b-tech-credit-transfer-kottayam" },
      { name: "B Tech Credit Transfer Kozhikode", url: "/b-tech-credit-transfer-kozhikode" },
      { name: "B Tech Credit Transfer Malappuram", url: "/b-tech-credit-transfer-malappuram" },
      { name: "B Tech Credit Transfer Thrissur", url: "/b-tech-credit-transfer-thrissur" },
      { name: "B Tech Credit Transfer Thiruvananthapuram", url: "/b-tech-credit-transfer-thiruvananthapuram" }
    ]
  ];

  return (
    <section className="w-full bg-white py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Desktop/tablet: full grid, always shown, unchanged */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="hidden md:grid md:grid-cols-3 gap-8"
        >
          {locations.map((col, colIndex) => (
            <ul key={colIndex} className="space-y-3 rounded-[1.5rem] border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              {col.map((location, index) => (
                <li key={index}>
                  <Link
                    href={location.url}
                    className="block rounded-xl border border-transparent px-3 py-3 text-[15px] md:text-base font-semibold leading-relaxed text-[#002147] transition-colors duration-300 hover:border-gray-200 hover:bg-white hover:text-[#F9010D]"
                  >
                    {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </motion.div>

        {/* Mobile-only: locations hidden behind a single toggle button */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-[15px] font-semibold text-[#002147] shadow-sm"
          >
            {expanded ? 'Hide Locations' : 'Our Locations'}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  {locations.map((col, colIndex) => (
                    <ul key={colIndex} className="space-y-2 rounded-[1.5rem] border border-gray-200 bg-white p-4 shadow-sm">
                      {col.map((location, index) => (
                        <li key={index}>
                          <Link
                            href={location.url}
                            className="block rounded-xl border border-transparent px-3 py-2.5 text-[14px] font-semibold leading-relaxed text-[#002147] transition-colors duration-300 hover:border-gray-200 hover:bg-white hover:text-[#F9010D]"
                          >
                            {location.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
