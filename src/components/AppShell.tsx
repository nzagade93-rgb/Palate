'use client';

// ==============================================================================
// PALATE: AppShell (Native Mobile Application Frame & Container)
// Delivers a 100% native mobile app feel:
// - On Mobile: Full-screen edge-to-edge native app with sticky header & bottom nav.
// - On Desktop: Sleek titanium mobile phone frame with dynamic notch & home bar.
// ==============================================================================

import React from 'react';
import { usePathname } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import BottomNav from '@/components/BottomNav';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }
  return (
    <div className="min-h-screen w-full bg-[#0A0F1D] flex flex-col items-center justify-center sm:py-6 sm:px-4 select-none">
      {/* Desktop App Preview Header Pill */}
      <aside aria-label="Desktop Preview Mode" className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-white/50 mb-3">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] tracking-wide uppercase text-white/70">Palate Application Shell • Navi Mumbai</span>
      </aside>

      {/* Mobile Device Frame */}
      <div className="w-full max-w-[420px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] bg-[#F4F5F8] text-[#02060C] relative flex flex-col sm:rounded-[46px] sm:border-[10px] sm:border-[#1E293B] sm:shadow-[0_25px_80px_rgba(0,0,0,0.65)] overflow-hidden">
        
        {/* Desktop Phone Hardware Notch & iOS Status Bar */}
        <div className="hidden sm:flex shrink-0 h-9 bg-white items-center justify-between px-6 pt-1 select-none border-b border-black/[0.02]">
          <span className="text-[11px] font-bold text-[#02060C]">9:41</span>
          
          {/* Dynamic Island Pill */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end pr-2 space-x-1 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1E293B]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#0A0F1D] ring-1 ring-white/10" />
          </div>

          <div className="flex items-center space-x-1.5 text-[#02060C]">
            <Signal className="h-3 w-3 stroke-[2.5]" />
            <Wifi className="h-3 w-3 stroke-[2.5]" />
            <BatteryMedium className="h-3.5 w-3.5 stroke-[2]" />
          </div>
        </div>

        {/* Top App Header */}
        <div className="shrink-0 z-30">
          <AppHeader />
        </div>

        {/* Scrollable Screen Content (Boxed and padded according to native mobile guidelines) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none overscroll-contain relative bg-[#F4F5F8]">
          {children}
        </main>

        {/* Bottom Navigation Bar + Home Indicator */}
        <div className="shrink-0 z-30 bg-white">
          <BottomNav />
          <div className="h-3.5 bg-white flex items-center justify-center pb-1">
            <div className="w-28 h-1 bg-black/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
