import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  X, 
  ChevronDown,
  Flame,
  Check
} from 'lucide-react';
import type { CategoryFilter } from '../types';
import { NEIGHBORHOODS } from '../data/mockData';

interface HeaderNavProps {
  selectedCategory: CategoryFilter;
  setSelectedCategory: (category: CategoryFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  onBrandClick?: () => void;
}

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Must-Try Icons',
  'Quick Bites',
  'Late Night',
  'Spicy',
  'Sweet Tooth'
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedArea,
  setSelectedArea,
  onBrandClick,
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-nav pt-[env(safe-area-inset-top,0px)] border-b border-[#262C36]">
      <div className="w-full px-4 py-2.5 space-y-2.5">
        
        {/* Tier 1: Brand & Integrated Location Chip (Vertically Centered, Zero Clipping) */}
        <div className="h-12 flex items-center justify-between gap-3">
          {/* Brand Logo & Wordmark */}
          <button
            onClick={onBrandClick}
            className="flex items-center gap-2 focus:outline-none group text-left active:scale-95 transition-transform"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-orange to-amber-500 p-0.5 flex items-center justify-center shadow-glow-orange">
              <Flame className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="flex items-baseline">
              <span className="font-display font-black text-sm tracking-widest uppercase text-white">
                Palate
              </span>
              <span className="text-brand-orange font-black text-sm ml-0.5">.</span>
            </div>
          </button>

          {/* Micro-Location Indicator Pill with Tight Elegant Border */}
          <div className="relative flex items-center">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              aria-label="Select Neighborhood Hub"
              className="flex items-center gap-1.5 text-[11px] font-semibold bg-[#161B22] hover:bg-[#1E2430] border border-[#262C36] hover:border-slate-500 text-slate-300 px-3 py-1.5 rounded-full transition-all active:scale-95 shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
              <span className="max-w-[130px] truncate">{selectedArea}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* Neighborhood Dropdown Modal */}
            {showLocationPicker && (
              <>
                <div
                  className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-xs"
                  onClick={() => setShowLocationPicker(false)}
                />
                <div className="absolute top-full right-0 mt-2 z-[55] w-64 rounded-2xl bg-[#0E1116] border border-[#262C36] shadow-2xl p-2 animate-fade-in">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 flex items-center justify-between">
                    <span>Navi Mumbai Corridors</span>
                    <span className="text-brand-orange text-[9px]">Spine</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {NEIGHBORHOODS.map((area) => (
                      <button
                        key={area}
                        onClick={() => {
                          setSelectedArea(area);
                          setShowLocationPicker(false);
                        }}
                        className={`w-full flex items-center justify-between text-xs px-3 py-2 rounded-xl text-left transition-colors ${
                          selectedArea === area
                            ? 'bg-brand-orange text-white font-bold'
                            : 'text-neutral-300 hover:bg-[#161B22]'
                        }`}
                      >
                        <span className="truncate">{area}</span>
                        {selectedArea === area && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedArea('All Navi Mumbai');
                      setShowLocationPicker(false);
                    }}
                    className="w-full text-[11px] text-center text-brand-orange font-semibold py-2 mt-1.5 border-t border-[#262C36] hover:underline"
                  >
                    Reset to All Navi Mumbai
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tier 2: Refined Low-Height Search Input with Surface 2 & Clear Focus State */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or venue (e.g. Thali, Pav Bhaji, Shawarma)..."
            className="w-full text-xs font-medium pl-10 pr-9 py-2 rounded-xl bg-[#161B22] border border-[#262C36] text-white placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tier 3: Scaled Horizontal Category Filters with Small Padding */}
        <div className="-mx-4 px-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-[#161B22] text-slate-400 hover:text-white border border-[#262C36]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

