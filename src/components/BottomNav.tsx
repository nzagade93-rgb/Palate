'use client';

// ==============================================================================
// PALATE: Native Mobile Bottom Navigation Bar
// Fixed 4-Tab thumb navigation for modern iOS/Android application feel.
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Compass, Plus, User, Shield } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isExplore = pathname === '/explore' || pathname.startsWith('/explore');
  const isCheckin = pathname === '/checkin' || pathname.startsWith('/checkin');
  const isPassport = pathname === '/passport' || pathname.startsWith('/passport');

  return (
    <nav className="w-full border-t border-black/[0.06] bg-white/98 backdrop-blur-lg px-4 py-1.5 select-none safe-bottom">
      <div className="flex items-center justify-around w-full">
        {/* TAB 1: BATTLES FEED */}
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isHome
              ? 'text-[#EF4E3A] font-bold'
              : 'text-[#686B78] font-medium hover:text-[#02060C]'
          }`}
        >
          <div className="relative">
            <Flame className={`h-5 w-5 ${isHome ? 'fill-[#EF4E3A]' : ''}`} />
            {isHome && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4E3A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4E3A]" />
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Battles</span>
        </Link>

        {/* TAB 2: EXPLORE & RANKINGS */}
        <Link
          href="/explore"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isExplore
              ? 'text-[#0F5132] font-bold'
              : 'text-[#686B78] font-medium hover:text-[#02060C]'
          }`}
        >
          <Compass className={`h-5 w-5 ${isExplore ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">Explore</span>
        </Link>

        {/* TAB 3: CENTER CHECK-IN ACTION (Elevated Floating Thumb Action) */}
        <Link
          href="/checkin"
          className="flex flex-col items-center -mt-6 group focus:outline-none"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-4 ring-white transition-all transform active:scale-90 ${
              isCheckin
                ? 'bg-[#EF4E3A] text-white shadow-rose-200'
                : 'bg-[#0F5132] text-white shadow-emerald-200 hover:bg-[#0B3D26]'
            }`}
          >
            <Plus className="h-6 w-6 stroke-[3]" />
          </div>
          <span
            className={`text-[10px] mt-1 tracking-tight font-bold ${
              isCheckin ? 'text-[#EF4E3A]' : 'text-[#02060C]'
            }`}
          >
            Check In
          </span>
        </Link>

        {/* TAB 4: PASSPORT & PROFILE */}
        <Link
          href="/passport"
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
            isPassport
              ? 'text-[#0F5132] font-bold'
              : 'text-[#686B78] font-medium hover:text-[#02060C]'
          }`}
        >
          <div className="relative">
            <Shield className={`h-5 w-5 ${isPassport ? 'fill-[#0F5132]/10 stroke-[2.5]' : ''}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Passport</span>
        </Link>
      </div>
    </nav>
  );
}
