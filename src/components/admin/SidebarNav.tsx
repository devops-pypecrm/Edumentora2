'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, MessageSquare, Image, GraduationCap, FileText, BookOpen, Star, HelpCircle, ChevronDown, Clapperboard, Bell, Landmark, Navigation, Images, Plug } from 'lucide-react';

const links = [
  { href: '/admin',                   label: 'Dashboard',        icon: LayoutDashboard, exact: true },
  { href: '/admin/enquiries',         label: 'Enquiry',           icon: MessageSquare },
  { href: '/admin/university',        label: 'University',        icon: GraduationCap },
  { href: '/admin/university-programs', label: 'University Program', icon: Landmark },
  { href: '/admin/contacts',          label: 'Contacts',          icon: Users },
  { href: '/admin/reviews',           label: 'Reviews',           icon: Star },
  { href: '/admin/gallery',           label: 'Image Gallery',     icon: Image },
  { href: '/admin/blogs',             label: 'Blogs',             icon: FileText },
  { href: '/admin/programs',          label: 'Programs',          icon: BookOpen },
  { href: '/admin/reels',             label: 'Add Reels',         icon: Clapperboard },
  { href: '/admin/hero-carousel',     label: 'Hero Carousel',     icon: Images },
  { href: '/admin/notifications',     label: 'Notification',      icon: Bell },
  { href: '/admin/manage-nav',        label: 'Manage Nav',        icon: Navigation },
];

const faqLinks = [
  { href: '/admin/faq/about', label: 'About FAQ' },
  { href: '/admin/faq/btech', label: 'Btech FAQ' },
];

export default function SidebarNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const isFaqActive = pathname.startsWith('/admin/faq');
  const [faqOpen, setFaqOpen] = useState(isFaqActive);

  // Keep the dropdown open automatically while on one of its sub-pages.
  useEffect(() => {
    if (isFaqActive) setFaqOpen(true);
  }, [isFaqActive]);

  return (
    <nav data-lenis-prevent className={`flex-1 min-h-0 space-y-1 overflow-y-auto transition-all duration-300 ${collapsed ? 'px-2 mt-4' : 'px-4 mt-6'}`}>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            title={collapsed ? link.label : undefined}
            className={`flex items-center rounded-xl transition-all duration-200 ${
              collapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-3'
            } ${
              isActive
                ? 'bg-white/20 text-white font-semibold shadow-inner'
                : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#D2B48C]' : ''}`} />
            {!collapsed && (
              <span className="font-medium whitespace-nowrap overflow-hidden">{link.label}</span>
            )}
          </Link>
        );
      })}

      {/* FAQ dropdown */}
      <div>
        <button
          type="button"
          onClick={() => setFaqOpen((v) => !v)}
          title={collapsed ? 'FAQ' : undefined}
          className={`w-full flex items-center rounded-xl transition-all duration-200 ${
            collapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-3'
          } ${
            isFaqActive
              ? 'bg-white/20 text-white font-semibold shadow-inner'
              : 'hover:bg-white/10 text-white/70 hover:text-white'
          }`}
        >
          <HelpCircle className={`w-5 h-5 flex-shrink-0 ${isFaqActive ? 'text-[#D2B48C]' : ''}`} />
          {!collapsed && (
            <>
              <span className="font-medium whitespace-nowrap overflow-hidden flex-1 text-left">FAQ</span>
              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${faqOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        {!collapsed && faqOpen && (
          <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
            {faqLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold'
                      : 'hover:bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Link
        href="/admin/faq/integration"
        title={collapsed ? 'Integration' : undefined}
        className={`flex items-center rounded-xl transition-all duration-200 ${
          collapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-3'
        } ${
          pathname === '/admin/faq/integration'
            ? 'bg-white/20 text-white font-semibold shadow-inner'
            : 'hover:bg-white/10 text-white/70 hover:text-white'
        }`}
      >
        <Plug className={`w-5 h-5 flex-shrink-0 ${pathname === '/admin/faq/integration' ? 'text-[#D2B48C]' : ''}`} />
        {!collapsed && <span className="font-medium whitespace-nowrap overflow-hidden">Integration</span>}
      </Link>
    </nav>
  );
}
