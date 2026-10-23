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

  const locations = [
    { name: "Calicut" },
    { name: "Kochi" }
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
          SECTION 1: TOP FOOTER (LARGE CONTENT AREA)
          ======================================================== */}
      <div className="flex flex-col lg:flex-row relative bg-white w-full min-h-[500px] overflow-hidden">

        {/* LEFT SIDE (72%) - FOUR COLUMNS */}
        <div className="w-full lg:w-[72%] relative z-10 py-20 px-8 lg:px-12 xl:px-16 flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 xl:gap-6">
            
            {/* Column 1: Quick Links */}
            <div className="lg:pl-4">
              <h4 className="text-black font-bold text-xl mb-8 relative inline-block pb-3">
                Quick Links
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-[#F9010D]"></span>
              </h4>
              <ul className="space-y-4">
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

            {/* Column 3: Credit Transfer */}
            <div>
              <h4 className="text-black font-bold text-xl mb-8 relative inline-block pb-3">
                Credit Transfer
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-[#F9010D]"></span>
              </h4>
              <ul className="space-y-4">
                {creditTransferLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="group flex items-center text-gray-700 hover:text-[#F9010D] transition-colors duration-300 font-medium text-sm">
                      <ChevronRight className="w-4 h-4 mr-2 text-gray-500 group-hover:text-[#F9010D] transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Locations */}
            <div>
              <h4 className="text-black font-bold text-xl mb-8 relative inline-block pb-3">
                Locations
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-[#F9010D]"></span>
              </h4>
              <ul className="space-y-4">
                {locations.map((loc, index) => (
                  <li key={index}>
                    <p className="flex items-center text-gray-700 font-medium text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                      {loc.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Contact Info & Socials */}
            <div>
              <h4 className="text-black font-bold text-xl mb-8 relative inline-block pb-3">
                Contact Info
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-[#F9010D]"></span>
              </h4>
              
              <ul className="space-y-6">
                <li className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center mr-4 bg-gray-50">
                    <Smartphone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Phone Number</span>
                    <span className="text-sm text-black font-medium">+91 974458 7777</span>
                  </div>
                </li>
                
                <li className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center mr-4 bg-gray-50">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Email Address</span>
                    <span className="text-sm text-black font-medium">info@edumentora.com</span>
                  </div>
                </li>
                
                <li className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center mr-4 bg-gray-50">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Location</span>
                    <span className="text-sm text-black font-medium">Calicut | Kochi</span>
                  </div>
                </li>
              </ul>

              {/* Social Icons */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  {[
                    { icon: FacebookIcon, href: "https://www.facebook.com/edumentoradotcom/" },
                    { icon: InstagramIcon, href: "https://www.instagram.com/edumentora/?hl=en" },
                    { icon: LinkedinIcon, href: "https://www.linkedin.com/company/edumentora/home/" }
                  ].map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-[#F9010D] hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE (28%) - LARGE RED ANGLED PANEL */}
        <div className="w-full lg:w-[28%] relative z-20 flex flex-col justify-center">
          
          {/* Diagonal Red Background Shape */}
          <div 
            className="absolute inset-0 bg-[#F9010D] z-0 hidden lg:block shadow-[-10px_0_30px_rgba(0,0,0,0.35)]"
            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
          />
          <div className="absolute inset-0 bg-[#F9010D] z-0 lg:hidden" />
          
          {/* Content Container */}
          <div className="relative z-10 w-full h-full flex flex-col justify-center py-20 px-10 xl:px-14 lg:pl-20 xl:pl-24">
            
            {/* Brand Logo, Text, and Contact Section */}
            <div className="flex flex-col items-start space-y-6 pl-4 max-w-sm">
              <Link href="/" className="bg-white p-3 rounded-xl shadow-xl inline-block transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/favcon/edumentora_favcon.png" 
                  alt="Edumentora doodle logo" 
                  className="h-16 w-auto object-contain"
                />
              </Link>
              
              <div className="space-y-3">
                <h3 className="text-white font-bold text-xl tracking-wide">Edumentora Services LLP</h3>
                <p className="text-white/85 text-sm leading-relaxed font-medium">
                  Your trusted partner in education, offering expert guidance and innovative learning resources to empower students and professionals for academic and career success.
                </p>
              </div>

              <Link 
                href="/contact" 
                className="inline-block bg-white text-black px-8 py-3.5 hover:bg-gray-100 transition-colors duration-300 rounded font-bold text-sm tracking-wide uppercase shadow-lg border border-white mt-2"
              >
                Contact Us
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================
          SECTION 2: BOTTOM STRIP (COPYRIGHT & LEGAL)
          ======================================================== */}
      <div className="h-auto md:h-[70px] bg-[#001F5C] py-6 md:py-0 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between z-30">
        
        {/* Left: Copyright */}
        <div className="w-full md:w-1/3 text-center md:text-left text-gray-200 text-sm font-medium mb-4 md:mb-0">
          Copyright &copy; {new Date().getFullYear()} Edumentora.
        </div>
        
        {/* Center: Privacy Policy */}
        <div className="w-full md:w-1/3 text-center text-gray-200 text-sm font-medium mb-4 md:mb-0">
          <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
        </div>
        
        {/* Right: Terms & Back To Top */}
        <div className="w-full md:w-1/3 flex items-center justify-center md:justify-end space-x-8 text-gray-200 text-sm font-medium">
          <Link href="/terms" className="hover:text-white transition-colors duration-300">Terms & Conditions</Link>
          
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-[#F9010D] border-2 border-[#F9010D] flex items-center justify-center text-white hover:bg-transparent hover:text-[#F9010D] transition-all duration-300 shadow-[0_4px_15px_rgba(249,1,13,0.3)] group"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>

    </footer>
  );
}
