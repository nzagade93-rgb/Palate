'use client';

// ==============================================================================
// PALATE: AppShell (Native Mobile Application Frame & Container)
// Delivers a 100% native mobile app feel:
// - On Mobile: Full-screen edge-to-edge native app with sticky header & bottom nav.
// - On Desktop: Toggleable between Framed Phone Mockup and Full Width view.
// ==============================================================================

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import BottomNav from '@/components/BottomNav';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [frameMode, setFrameMode] = useState<'phone' | 'full'>('phone');

  if (isAdmin) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  const isPhone = frameMode === 'phone';

  return (
    <div className="min-h-screen w-full bg-[#0A0F1D] flex flex-col items-center justify-start sm:py-6 sm:px-4 select-none">
      {/* Desktop Viewport Switcher Controls */}
      <aside
        aria-label="Viewport Controls"
        className="hidden sm:flex items-center space-x-3 mb-4 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md"
      >
        <div className="flex items-center space-x-1.5 pr-2 border-r border-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">
            Palate App Preview
          </span>
        </div>

        {/* Option Toggle: Phone Frame vs Full Width */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-0.5 rounded-full border border-slate-800/80">
          <button
            onClick={() => setFrameMode('phone')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isPhone
                ? 'bg-[#0D4734] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Phone Mockup</span>
          </button>

          <button
            onClick={() => setFrameMode('full')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              !isPhone
                ? 'bg-[#0D4734] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Full Width</span>
          </button>
        </div>
      </aside>

      {/* Mobile Device Frame or Full Width Container */}
      <div
        className={`w-full bg-[#F8FAFC] text-slate-900 relative flex flex-col overflow-hidden transition-all duration-300 ${
          isPhone
            ? 'max-w-[420px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[46px] sm:border-[10px] sm:border-[#1E293B] sm:shadow-[0_25px_80px_rgba(0,0,0,0.65)]'
            : 'max-w-3xl min-h-[90vh] sm:rounded-3xl sm:border sm:border-slate-800 sm:shadow-[0_20px_60px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* iOS Dynamic Island & Status Bar */}
        <div className="hidden sm:flex shrink-0 h-9 bg-white items-center justify-between px-6 pt-1 select-none border-b border-slate-100">
          <span className="text-[11px] font-bold text-slate-900">9:41</span>

          {/* Simulated Dynamic Island */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end pr-2 space-x-1 shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1E293B]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#0A0F1D] ring-1 ring-white/10" />
          </div>

          <div className="flex items-center space-x-1.5 text-slate-900">
            <Signal className="h-3 w-3 stroke-[2.5]" />
            <Wifi className="h-3 w-3 stroke-[2.5]" />
            <BatteryMedium className="h-3.5 w-3.5 stroke-[2]" />
          </div>
        </div>

        {/* Top App Header */}
        <div className="shrink-0 z-30">
          <AppHeader />
        </div>

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none overscroll-contain relative bg-[#F8FAFC]">
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
