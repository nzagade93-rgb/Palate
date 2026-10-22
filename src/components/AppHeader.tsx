'use client';

// ==============================================================================
// PALATE: Native Mobile App Header (Staff UI/UX Edition)
// Top app bar with Palate brand logo, interactive location picker, and CP status pill.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, Shield, User } from 'lucide-react';
import PalateLogo from '@/components/PalateLogo';
import { getCrestBalance } from '@/lib/crestSystem';
import NeighborhoodDrawer from '@/components/NeighborhoodDrawer';

const ZONE_SUBTEXT_MAP: Record<string, string> = {
  'Navi Mumbai': 'Vashi, Nerul, Belapur',
  'All Navi Mumbai': 'Vashi, Nerul, Belapur',
  Vashi: 'Sector 17, Sector 9',
  Nerul: 'Sector 21, Sector 15',
  Belapur: 'Sector 11, Sector 15',
  Kharghar: 'Sector 8, Sector 20',
  Seawoods: 'Sector 40, Grand Central',
  Sanpada: 'Sector 4, Palm Beach Rd',
};

export default function AppHeader() {
  const [crestBalance, setCrestBalance] = useState<number>(85);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState('Navi Mumbai');

  useEffect(() => {
    setCrestBalance(getCrestBalance());
    const handleCrestUpdate = (e: any) => {
      setCrestBalance(e.detail?.balance ?? getCrestBalance());
    };
    window.addEventListener('palate_crest_updated', handleCrestUpdate);

    // Initial load from storage if present
    const savedZone = localStorage.getItem('palate_selected_neighborhood');
    if (savedZone) {
      setSelectedZone(savedZone);
    }

    const handleZoneChange = (e: any) => {
      const zone = e.detail?.zone || 'Navi Mumbai';
      setSelectedZone(zone);
    };
    window.addEventListener('palate_neighborhood_changed', handleZoneChange);

    return () => {
      window.removeEventListener('palate_crest_updated', handleCrestUpdate);
      window.removeEventListener('palate_neighborhood_changed', handleZoneChange);
    };
  }, []);

  const handleSelectZone = (zone: string) => {
    const finalZone = zone === 'All Navi Mumbai' ? 'Navi Mumbai' : zone;
    setSelectedZone(finalZone);
    if (typeof window !== 'undefined') {
      localStorage.setItem('palate_selected_neighborhood', finalZone);
      window.dispatchEvent(
        new CustomEvent('palate_neighborhood_changed', { detail: { zone: finalZone } })
      );
    }
  };

  const subtext = ZONE_SUBTEXT_MAP[selectedZone] || 'Vashi, Nerul, Belapur';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] safe-top">
        <div className="flex h-14 items-center justify-between px-3.5">
          {/* Left: Brand Logo */}
          <div className="shrink-0 flex items-center pr-1">
            <Link href="/" className="flex items-center" aria-label="Palate Home">
              <PalateLogo size="sm" showTagline={false} />
            </Link>
          </div>

          {/* Center: Interactive Location Selector with Map Pin */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center space-x-1.5 px-2 py-1 rounded-xl hover:bg-slate-50 transition-colors border-l border-slate-200/80 pl-2.5 min-w-0 max-w-[175px] text-left"
            title="Change Neighborhood"
          >
            <MapPin className="h-3.5 w-3.5 text-[#0D4734] shrink-0" />
            <div className="flex flex-col min-w-0 leading-tight">
              <div className="flex items-center space-x-0.5">
                <span className="text-[13px] font-extrabold text-slate-900 tracking-tight truncate">
                  {selectedZone}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-500 shrink-0" />
              </div>
              <span className="text-[10px] text-slate-500 font-medium truncate max-w-[125px]">
                {subtext}
              </span>
            </div>
          </button>

          {/* Right: Community Points Status Pill & User Avatar */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <Link
              href="/passport"
              className="flex items-center space-x-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/30 px-2.5 py-1 text-xs font-bold text-[#0D4734] hover:bg-[#FDE68A]/60 transition-all shadow-xs"
              title="Your Community Points"
            >
              <Shield className="h-3.5 w-3.5 text-[#F59E0B]" />
              <span className="font-extrabold text-[11px] tracking-tight">{crestBalance} CP</span>
            </Link>

            <Link
              href="/passport"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D4734] text-white shadow-xs hover:bg-[#082d21] transition-all"
              title="Profile & Food Passport"
              aria-label="Profile"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Neighborhood Picker Bottom Drawer */}
      <NeighborhoodDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedZone={selectedZone}
        onSelectZone={handleSelectZone}
      />
    </>
  );
}
