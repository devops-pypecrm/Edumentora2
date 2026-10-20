'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ChevronLeft, ChevronRight, UserCircle } from 'lucide-react';
import SidebarNav from '@/components/admin/SidebarNav';

export default function AdminShell({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // The login page must render standalone — no sidebar/nav behind it.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-[Poppins]">

      {/* ── SIDEBAR ────────────────────────────────────────────────── */}
      <aside
        className={`sticky top-0 h-screen bg-[#002147] text-white flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3.5 top-6 z-50 w-7 h-7 bg-[#002147] border-2 border-white/20 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#E91D24] hover:border-[#E91D24] transition-all"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : <ChevronLeft  className="w-3.5 h-3.5" />}
        </button>

        {/* Logo / Title */}
        <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'px-2 pt-4 pb-2' : 'px-6 pt-6 pb-4'}`}>
          {collapsed ? (
            <div className="flex items-center justify-center h-10">
              <span className="text-xl font-extrabold text-white">E</span>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-1 whitespace-nowrap">Edumentora</h2>
              <p className="text-[#E91D24] text-xs font-bold tracking-widest uppercase whitespace-nowrap">Admin Panel</p>
            </>
          )}
        </div>

        {/* Nav Links */}
        <SidebarNav collapsed={collapsed} />

        {/* Profile + Logout */}
        <div className={`mt-auto p-3 space-y-1 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          <Link
            href="/admin/profile"
            title="Profile"
            className={`flex items-center gap-3 rounded-xl transition-colors ${
              pathname === '/admin/profile'
                ? 'bg-white/20 text-white font-semibold'
                : 'hover:bg-white/10 text-white/70 hover:text-white'
            } ${collapsed ? 'p-2 justify-center' : 'px-4 py-3 w-full'}`}
          >
            <UserCircle className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium whitespace-nowrap">Profile</span>}
          </Link>

          <form action={onLogout}>
            <button
              type="submit"
              title="Logout"
              className={`flex items-center gap-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors ${
                collapsed ? 'p-2 justify-center' : 'px-4 py-3 w-full'
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
