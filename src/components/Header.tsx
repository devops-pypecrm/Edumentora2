'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const fallbackNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'B.Tech Credit Transfer', href: '/b-tech-credit-transfer' },
  { name: 'Programmes', href: '/programs' },
  { name: 'Universities', href: '/universities' },
  { name: 'About', href: '/about-us' },
  { name: 'Contact', href: '/contact' },
];

const fallbackSubNavLinks = [
  { name: 'About us', href: '/about-us', parentId: '/about-us' },
  { name: 'Gallery', href: '/gallery', parentId: '/about-us' },
  { name: 'Blog', href: '/blog', parentId: '/about-us' },
];

type NavItem = {
  name: string;
  href: string;
  kind: 'nav' | 'sub';
  parentId?: string | null;
  visibility?: boolean;
  order?: number;
};

type SubNavItem = NavItem & { kind: 'sub' };

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadNavItems() {
      try {
        const res = await fetch('/api/navigation', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load nav');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setNavItems(data.filter((item) => item.visibility !== false));
          return;
        }
      } catch {
        // ignore and keep fallback list below
      }
      setNavItems([
        ...fallbackNavLinks.map((item, index) => ({
          name: item.name,
          href: item.href,
          kind: 'nav' as const,
          order: index,
          visibility: true,
        })),
        ...fallbackSubNavLinks.map((item, index) => ({
          ...item,
          kind: 'sub' as const,
          order: fallbackNavLinks.length + index,
          visibility: true,
        })),
      ]);
    }

    loadNavItems();
  }, []);

  const visibleNavItems = navItems.length > 0 ? navItems.filter((item) => item.kind === 'nav' && item.visibility !== false) : fallbackNavLinks.map((item, index) => ({ name: item.name, href: item.href, kind: 'nav' as const, order: index, visibility: true }));
  const subNavItems = navItems.filter((item): item is SubNavItem => item.kind === 'sub' && item.visibility !== false);
  const dropdownMap = subNavItems.reduce<Record<string, SubNavItem[]>>((acc, item) => {
    const key = item.parentId ?? 'root';
    acc[key] = acc[key] ? [...acc[key], item] : [item];
    return acc;
  }, {});

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileOpenDropdown(null);
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname?.startsWith(path);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 box-border flex max-w-full justify-center overflow-x-clip px-3 pt-3 font-[Poppins] pointer-events-none min-[720px]:px-4 min-[720px]:pt-4">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isHidden ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`pointer-events-auto box-border min-w-0 w-full max-w-[68rem] h-[62px] min-[720px]:h-[76px] lg:h-[82px] flex items-center justify-between gap-3 px-5 min-[720px]:px-6 lg:px-8 transition-colors duration-300 rounded-[22px] min-[720px]:rounded-full ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100'
            : 'bg-white shadow-sm border border-transparent'
        }`}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onDoubleClick={(e) => {
            e.preventDefault();
            router.push('/admin');
          }}
        >
          <img
            src="/favcon/edumentora_logo.webp"
            alt="Edumentora logo"
            className="w-auto h-8 min-[720px]:h-9 xl:h-[40px] object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav ref={navRef} className="hidden min-[720px]:flex items-center justify-end gap-2 lg:gap-4 xl:gap-7 whitespace-nowrap text-[10px] min-[850px]:text-[11px] lg:text-sm xl:text-[15px] font-bold text-[#002147]">
          {visibleNavItems.map((link) => {
            const childLinks = dropdownMap[link.href] ?? [];
            const hasDropdown = childLinks.length > 0;

            if (!hasDropdown) {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative py-2 group"
                >
                  <span className={`transition-colors duration-200 ${isActive(link.href) ? 'text-[#F9010D]' : 'hover:text-[#F9010D]'}`}>
                    {link.name}
                  </span>
                  <span className={`absolute left-0 bottom-0 h-[2px] bg-[#F9010D] transition-all duration-300 ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            }

            return (
              <div
                key={link.name}
                className="group relative flex items-center h-full"
                onMouseEnter={() => setOpenDropdown(link.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={(e) => { e.preventDefault(); setOpenDropdown(openDropdown === link.name ? null : link.name); }}
                  className={`relative flex items-center gap-1 cursor-pointer py-2 group ${openDropdown === link.name ? 'text-[#F9010D]' : 'hover:text-[#F9010D] transition-colors duration-200'}`}
                >
                  {link.name} <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === link.name ? 'rotate-180' : 'group-hover:rotate-180'}`} />
                </button>
                <AnimatePresence>
                  {openDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-12 left-1/2 -translate-x-1/2 w-60 bg-white shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 rounded-[16px] py-2 z-50 overflow-hidden"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {childLinks.map((child) => (
                        <Link key={child.name} href={child.href} className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#F9010D] transition-colors">{child.name}</Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <Link
            href="/students-login"
            className="ml-2 lg:ml-4 rounded-xl bg-[#F9010D] px-3.5 py-2.5 lg:px-5 lg:py-3 text-xs lg:text-sm font-bold text-white shadow-md transition-colors hover:bg-[#F9010D]"
          >
            Login
          </Link>

          {visibleNavItems.length === 0 && fallbackNavLinks.map((link) => (
            <Link key={link.name} href={link.href} className="relative py-2 group">
              <span className={`transition-colors duration-200 ${isActive(link.href) ? 'text-[#F9010D]' : 'hover:text-[#F9010D]'}`}>
                {link.name}
              </span>
              <span className={`absolute left-0 bottom-0 h-[2px] bg-[#F9010D] transition-all duration-300 ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="min-[720px]:hidden flex size-10 shrink-0 items-center justify-center rounded-full text-[#002147] transition-colors active:bg-slate-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-[720px]:hidden pointer-events-auto absolute top-[5.25rem] left-3 right-3 bg-white shadow-[0_20px_40px_rgb(0,0,0,0.1)] rounded-[20px] border border-gray-100 flex flex-col z-50 overflow-hidden"
          >
            <div className="flex flex-col py-4 px-6 space-y-2 text-base font-bold text-[#002147] h-max max-h-[80vh] overflow-y-auto">
              {visibleNavItems.map((link) => {
                const childLinks = dropdownMap[link.href] ?? [];
                if (childLinks.length === 0) {
                  return (
                    <Link key={link.name} href={link.href} onClick={closeMobileMenu} className={`py-3 transition-colors border-b border-gray-50 ${isActive(link.href) ? 'text-[#F9010D]' : 'hover:text-[#F9010D]'}`}>
                      {link.name}
                    </Link>
                  );
                }

                return (
                  <div key={link.name} className="py-2 border-b border-gray-50">
                    <button
                      onClick={() => setMobileOpenDropdown(mobileOpenDropdown === link.name ? null : link.name)}
                      className="flex items-center justify-between w-full py-2 hover:text-[#F9010D] transition-colors"
                    >
                      {link.name} <ChevronDown className={`w-5 h-5 transition-transform ${mobileOpenDropdown === link.name ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileOpenDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col pl-4 mt-2 space-y-3 text-sm text-gray-600 border-l-2 border-[#F9010D]/20 overflow-hidden"
                        >
                          {childLinks.map((child) => (
                            <Link key={child.name} href={child.href} onClick={closeMobileMenu} className="hover:text-[#F9010D] transition-colors py-1">{child.name}</Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {visibleNavItems.length === 0 && fallbackNavLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={closeMobileMenu} className={`py-3 transition-colors border-b border-gray-50 ${isActive(link.href) ? 'text-[#F9010D]' : 'hover:text-[#F9010D]'}`}>
                  {link.name}
                </Link>
              ))}

              <Link
                href="/students-login"
                onClick={closeMobileMenu}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#F9010D] px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-[#F9010D]"
              >
                Login
              </Link>

              <Link href="/contact" onClick={closeMobileMenu} className="flex items-center justify-center mt-4 w-full px-6 py-3 bg-[#F9010D] text-white font-medium rounded-xl shadow-md hover:bg-[#F9010D] transition-colors">
                Enquire Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Enquire Now Button */}
      <Link
        href="/contact"
        className="fixed bottom-6 right-6 z-50 pointer-events-auto hidden md:flex items-center justify-center px-6 py-3 text-base bg-[#F9010D] text-white font-medium rounded-full shadow-[0_4px_14px_0_rgba(249,1,13,0.39)] hover:shadow-[0_6px_20px_rgba(249,1,13,0.23)] hover:bg-[#F9010D] hover:-translate-y-0.5 transition-all duration-200"
      >
        Enquire Now
      </Link>
    </div>
  );
}
