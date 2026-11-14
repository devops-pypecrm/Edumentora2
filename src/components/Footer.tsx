'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Smartphone, Mail, MapPin, ArrowUp } from 'lucide-react';
import Image from 'next/image';

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
    <path d="m10 15 5-3-5-3z"></path>
  </svg>
);

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Credit Transfer", href: "/b-tech-credit-transfer#know-more" },
    { name: "Universities", href: "/universities" },
    { name: "Contact Us", href: "/contact" }
  ];

  const creditTransferLinks = [
    { name: "B.Tech Credit Transfer", href: "/b-tech-credit-transfer" },
    { name: "PG Credit Transfer", href: "/pg-credit-transfer" },
    { name: "UG Credit Transfer", href: "/ug-credit-transfer" },
    { name: "Diploma Credit Transfer", href: "/diploma-credit-transfer" }
  ];

  const socialLinks = [
    { icon: FacebookIcon, href: "https://www.facebook.com/edumentoradotcom/", label: "Facebook" },
    { icon: InstagramIcon, href: "https://www.instagram.com/edumentora/?hl=en", label: "Instagram" },
    { icon: LinkedinIcon, href: "https://www.linkedin.com/company/edumentora/home/", label: "LinkedIn" },
    { icon: YoutubeIcon, href: "https://www.youtube.com/@edumentora", label: "YouTube" }
  ];

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full relative font-sans flex flex-col">
      <div aria-hidden="true" className="h-0.5 w-full shrink-0 bg-[#001F5C]" />

      {/* ========================================================
          SECTION 1: TOP FOOTER (COMPACT CONTENT AREA)
          ======================================================== */}
      <div className="flex flex-col lg:flex-row relative bg-white w-full overflow-hidden">

        {/* LEFT SIDE - THREE COLUMNS */}
        <div className="w-full lg:w-[70%] relative z-10 py-7 lg:py-8 px-6 lg:px-10 xl:px-12 flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-gray-200">

            {/* Column 1: Quick Links */}
            <div className="md:pr-8 lg:pr-10">
              <h4 className="text-[#002147] font-bold text-xl mb-4 relative inline-block pb-2">
                Quick Links
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-[#F9010D]"></span>
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="group flex items-center text-gray-700 hover:text-[#F9010D] transition-colors duration-300 font-medium text-sm">
                      <ChevronRight className="w-4 h-4 mr-2 text-gray-500 group-hover:text-[#F9010D] transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Credit Transfer */}
            <div className="md:px-8 lg:px-10">
              <h4 className="text-[#002147] font-bold text-xl mb-4 relative inline-block pb-2">
                Credit Transfer
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-[#F9010D]"></span>
              </h4>
              <ul className="space-y-2">
                {creditTransferLinks.slice(0, 4).map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="group flex items-center text-gray-700 hover:text-[#F9010D] transition-colors duration-300 font-medium text-sm">
                      <ChevronRight className="w-4 h-4 mr-2 text-gray-500 group-hover:text-[#F9010D] transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="md:pl-8 lg:pl-10">
              <h4 className="text-[#002147] font-bold text-xl mb-4 relative inline-block pb-2">
                Contact Info
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-[#F9010D]"></span>
              </h4>

              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center mr-3 bg-gray-50">
                    <Smartphone className="w-4 h-4 text-[#002147]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Phone Number</span>
                    <span className="text-sm text-black font-medium">+91 974458 7777</span>
                  </div>
                </li>

                <li className="flex items-center">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center mr-3 bg-gray-50">
                    <Mail className="w-4 h-4 text-[#002147]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Email Address</span>
                    <span className="text-sm text-black font-medium">info@edumentora.com</span>
                  </div>
                </li>

                <li className="flex items-center">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center mr-3 bg-gray-50">
                    <MapPin className="w-4 h-4 text-[#002147]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Location</span>
                    <span className="text-sm text-black font-medium">Calicut | Kochi</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE (30%) - RED ANGLED PANEL */}
        <div className="w-full lg:w-[30%] relative z-20 flex flex-col justify-center">

          {/* Diagonal Red Background Shape */}
          <div
            className="absolute inset-0 bg-[#F9010D] z-0 hidden lg:block shadow-[-10px_0_30px_rgba(0,0,0,0.25)]"
            style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
          />
          {/* Lighter red edge behind the angled panel */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -left-3 bg-[#F9010D]/35 z-0 hidden lg:block"
            style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
          />
          <div className="absolute inset-0 bg-[#F9010D] z-0 lg:hidden" />

          {/* Content Container */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center py-6 px-8 lg:pl-14 lg:pr-6 xl:pl-16 xl:pr-8">

            {/* Brand Logo, Text, and Contact Section */}
            <div className="flex flex-col items-center space-y-3 max-w-sm">
              <Link href="/" className="bg-white p-2 rounded-xl shadow-xl inline-block transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="/favcon/edumentora_favcon.png"
                  alt="Edumentora doodle logo"
                  width={72}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </Link>

              <div className="space-y-1.5">
                <h3 className="text-white font-bold text-xl tracking-wide">Edumentora Services LLP</h3>
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  Your trusted partner in education, offering expert guidance and innovative learning resources to empower students and professionals for academic and career success.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-block bg-white text-[#002147] px-7 py-2.5 hover:bg-gray-100 transition-colors duration-300 rounded-lg font-bold text-sm tracking-wide uppercase shadow-lg border border-white"
              >
                Contact Us
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================
          SECTION 2: BOTTOM STRIP (SOCIAL, LEGAL & COPYRIGHT)
          ======================================================== */}
      <div className="bg-[#F3F5FA] border-t border-gray-200 py-2.5 px-6 lg:px-10 xl:px-12 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 z-30">

        {/* Left: Social Icons | Privacy Policy | Terms */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm font-medium text-[#002147]">
          <div className="flex items-center gap-2">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center ${social.label === 'YouTube' ? 'text-[#FF0000]' : 'text-[#002147]'} hover:bg-[#F9010D] hover:border-[#F9010D] hover:text-white transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          <span aria-hidden="true" className="hidden sm:block h-5 w-px bg-gray-300" />
          <Link href="/privacy-policy" className="hover:text-[#F9010D] transition-colors duration-300">Privacy Policy</Link>
          <span aria-hidden="true" className="h-5 w-px bg-gray-300" />
          <Link href="/terms" className="hover:text-[#F9010D] transition-colors duration-300">Terms and Conditions</Link>
        </div>

        {/* Right: Copyright & Back To Top */}
        <div className="flex items-center gap-4 text-gray-600 text-sm font-medium">
          <span>Copyright &copy; {new Date().getFullYear()} Edumentora.</span>
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full bg-[#F9010D] border-2 border-[#F9010D] flex items-center justify-center text-white hover:bg-transparent hover:text-[#F9010D] transition-all duration-300 shadow-[0_4px_15px_rgba(249,1,13,0.3)] group"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>

    </footer>
  );
}
