'use client';

// ==============================================================================
// PALATE: Neighborhood Picker Drawer (iOS Native Bottom Sheet)
// Opened by tapping the location selector in AppHeader.
// Allows users to filter citywide or focus on specific Navi Mumbai nodes.
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Check, Search, Sparkles } from 'lucide-react';

export interface NeighborhoodItem {
  id: string;
  name: string;
  subtext: string;
  dishCount: number;
  highlight: string;
}

export const NAVI_MUMBAI_ZONES: NeighborhoodItem[] = [
  {
    id: 'All',
    name: 'All Navi Mumbai',
    subtext: 'Citywide Consensus across 6 Nodes',
    dishCount: 148,
    highlight: 'Full directory of #1 community-ranked dishes',
  },
  {
    id: 'Vashi',
    name: 'Vashi',
    subtext: 'Sector 17 • Sector 9 • Sector 28',
    dishCount: 42,
    highlight: 'Famous for Bhagwati Pav Bhaji & Bhagat Tarachand',
  },
  {
    id: 'Nerul',
    name: 'Nerul',
    subtext: 'Sector 21 • Sector 15 • Sector 19A',
    dishCount: 36,
    highlight: 'Home of #1 Shri Krishna Vada Pav & Mamledar Misal',
  },
  {
    id: 'Belapur',
    name: 'Belapur',
    subtext: 'Sector 11 • Sector 15 • Artist Village',
    dishCount: 28,
    highlight: 'Coastal seafood at Mahesh Lunch Home & Dum Biryani',
  },
  {
    id: 'Kharghar',
    name: 'Kharghar',
    subtext: 'Sector 8 • Sector 12 • Sector 20',
    dishCount: 31,
    highlight: 'Student food street, Shawarma & Kerala Cafe',
  },
  {
    id: 'Seawoods',
    name: 'Seawoods',
    subtext: 'Sector 40 • Grand Central Mall • Sector 44',
    dishCount: 22,
    highlight: 'Yoko Sizzlers & artisan cafe culture',
  },
  {
    id: 'Sanpada',
    name: 'Sanpada',
    subtext: 'Sector 4 • Palm Beach Road • Sector 3',
    dishCount: 19,
    highlight: 'Sai Swaad Mysore Masala Dosa & Tender Coconut Kulfi',
  },
];

interface NeighborhoodDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: string;
  onSelectZone: (zone: string) => void;
}

export default function NeighborhoodDrawer({
  isOpen,
  onClose,
  selectedZone,
  onSelectZone,
}: NeighborhoodDrawerProps) {
  const [search, setSearch] = useState('');

  const filteredZones = NAVI_MUMBAI_ZONES.filter((z) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      z.name.toLowerCase().includes(q) ||
      z.subtext.toLowerCase().includes(q) ||
      z.highlight.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-[420px] bg-white rounded-t-[32px] border-t border-slate-100 shadow-[0_-12px_40px_rgba(0,0,0,0.2)] overflow-hidden max-h-[85vh] flex flex-col z-10"
          >
            {/* iOS Pull Bar */}
            <div className="pt-3 pb-2 flex items-center justify-center">
              <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3 flex items-center justify-between border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#0D4734]" />
                  <span>Select Neighborhood</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Verified foodie consensus across Navi Mumbai
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Search */}
            <div className="px-5 py-3 border-b border-slate-100 bg-[#F8FAFC]">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by node or sector (e.g., Sector 17, Nerul)..."
                  className="w-full bg-white text-xs font-semibold pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D4734]/20 focus:border-[#0D4734] placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Neighborhood Zones List */}
            <div className="overflow-y-auto px-4 py-3 space-y-2 flex-1 overscroll-contain">
              {filteredZones.map((zone) => {
                const isSelected =
                  selectedZone === zone.name ||
                  (zone.id === 'All' && selectedZone === 'All Navi Mumbai');

                return (
                  <button
                    key={zone.id}
                    onClick={() => {
                      onSelectZone(zone.id === 'All' ? 'All Navi Mumbai' : zone.name);
                      onClose();
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#0D4734]/5 border-[#0D4734] shadow-xs'
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-[14px] text-slate-900 tracking-tight">
                          {zone.name}
                        </span>
                        <span className="text-[10px] font-bold text-[#0D4734] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {zone.dishCount} dishes
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                        {zone.subtext}
                      </p>

                      <p className="text-[10px] text-slate-600 italic mt-1 line-clamp-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {zone.highlight}
                      </p>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#0D4734] border-[#0D4734] text-white shadow-xs'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Notice */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3 text-[#F59E0B]" />
                All rankings are 100% verified by Navi Mumbai diners
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
