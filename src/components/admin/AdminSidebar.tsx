'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import SidebarNav from '@/components/admin/SidebarNav';

export default function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative bg-[#002147] text-white flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ height: '100vh' }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="absolute -right-3.5 top-6 z-50 w-7 h-7 bg-[#002147] border-2 border-white/20 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#E91D24] hover:border-[#E91D24] transition-all"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Header */}
      <div className={`p-4 overflow-hidden transition-all duration-300 ${collapsed ? 'px-2' : 'p-6'}`}>
        {collapsed ? (
          <div className="flex items-center justify-center">
            <span className="text-xl font-extrabold text-white">E</span>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-1 whitespace-nowrap">Edumentora</h2>
            <p className="text-[#E91D24] text-xs font-bold tracking-widest uppercase whitespace-nowrap">Admin Panel</p>
          </>
        )}
      </div>

      {/* Nav */}
      <SidebarNav collapsed={collapsed} />

      {/* Logout */}
      <div className={`p-3 mt-auto ${collapsed ? 'flex justify-center' : ''}`}>
        <form action={onLogout}>
          <button
            type="submit"
            className={`flex items-center gap-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors ${
              collapsed ? 'p-2 justify-center' : 'px-4 py-3 w-full'
            }`}
            title="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
