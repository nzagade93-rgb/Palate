'use client';

// ==============================================================================
// PALATE: Native Mobile App Header
// Sleek top app bar with Palate brand, Navi Mumbai location pill, and Crest status.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, Shield, User } from 'lucide-react';
import PalateLogo from '@/components/PalateLogo';
import { getCrestBalance } from '@/lib/crestSystem';

export default function AppHeader() {
  const [crestBalance, setCrestBalance] = useState<number>(75);

  useEffect(() => {
    setCrestBalance(getCrestBalance());
    const handleUpdate = () => setCrestBalance(getCrestBalance());
    window.addEventListener('palate_crest_updated', handleUpdate);
    return () => window.removeEventListener('palate_crest_updated', handleUpdate);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-black/[0.06] shadow-[0_1px_4px_rgba(0,0,0,0.02)] safe-top">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left: Brand + Swiggy-Style Location Selector */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <Link href="/" className="shrink-0 flex items-center">
            <PalateLogo size="sm" showTagline={false} />
          </Link>

          <div className="flex items-center space-x-1.5 border-l border-gray-200 pl-2.5 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-[#EF4E3A] shrink-0" />
            <div className="flex flex-col text-left leading-none min-w-0">
              <div className="flex items-center space-x-0.5">
                <span className="text-[13px] font-extrabold text-[#02060C] tracking-tight truncate">
                  Navi Mumbai
                </span>
                <ChevronDown className="h-3 w-3 text-[#686B78] shrink-0" />
              </div>
              <span className="text-[10px] text-[#686B78] font-medium truncate max-w-[130px]">
                Vashi, Nerul, Belapur
              </span>
            </div>
          </div>
        </div>

        {/* Right: Crest Points & Profile Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <Link
            href="/passport"
            className="flex items-center space-x-1 rounded-full bg-[#F6B21A]/15 border border-[#F6B21A]/35 px-2.5 py-1 text-xs font-bold text-[#0F5132] hover:bg-[#F6B21A]/25 transition-all shadow-xs"
            title="Your Crest Points"
          >
            <Shield className="h-3 w-3 text-[#0F5132]" />
            <span className="font-extrabold text-[11px]">{crestBalance} CP</span>
          </Link>

          <Link
            href="/passport"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F5132] text-white shadow-xs hover:bg-[#0B3D26] transition-all"
            title="Profile & Food Passport"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
