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
    <header className="sticky top-0 z-30 w-full glass-nav pt-[env(safe-area-inset-top,0px)] border-b border-neutral-800/40">
      <div className="w-full px-4 py-2.5 space-y-2.5">
        
        {/* Tier 1: Brand & Integrated Location Chip (Zero Clipping) */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo & Wordmark */}
          <button
            onClick={onBrandClick}
            className="flex items-center gap-2 focus:outline-none group text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-orange to-amber-500 p-0.5 flex items-center justify-center shadow-glow-orange">
              <Flame className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <div className="flex items-baseline">
              <span className="font-display font-black text-sm tracking-ultra-wide uppercase text-white">
                Palate
              </span>
              <span className="text-brand-orange font-black text-sm ml-0.5">.</span>
            </div>
          </button>

          {/* Micro-Location Indicator Pill with Tight Elegant Border */}
          <div className="relative">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              aria-label="Select Neighborhood Hub"
              className="flex items-center gap-1.5 text-[11px] font-semibold bg-[#0E1116] hover:bg-[#141720] border border-neutral-800/80 hover:border-neutral-700 text-neutral-300 px-2.5 py-1 rounded-full transition-all active:scale-95 shrink-0"
            >
              <MapPin className="w-3 h-3 text-brand-orange shrink-0" />
              <span className="max-w-[130px] truncate">{selectedArea}</span>
              <ChevronDown className="w-3 h-3 text-neutral-500 shrink-0" />
            </button>

            {/* Neighborhood Dropdown Modal */}
            {showLocationPicker && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
                  onClick={() => setShowLocationPicker(false)}
                />
                <div className="absolute top-full right-0 mt-2 z-50 w-60 rounded-2xl bg-[#0E1116] border border-neutral-800/90 shadow-2xl p-2 animate-fade-in">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-3 py-1.5">
                    Navi Mumbai Hubs
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
                            : 'text-neutral-300 hover:bg-[#161A24]'
                        }`}
                      >
                        <span className="truncate">{area}</span>
                        {selectedArea === area && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedArea('All Sector 17 & Arenja');
                      setShowLocationPicker(false);
                    }}
                    className="w-full text-[11px] text-center text-brand-orange font-semibold py-2 mt-1.5 border-t border-neutral-800/60 hover:underline"
                  >
                    Show All Sector 17 & Arenja
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tier 2: Refined Low-Height Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or venue (e.g. Thali, Pav Bhaji, Shawarma)..."
            className="w-full text-xs font-medium pl-9 pr-8 py-2 rounded-xl bg-[#0E1116] border border-neutral-800/60 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-orange/70 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Tier 3: Scaled Horizontal Category Filters with Small Padding */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 pt-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-[#0E1116] text-neutral-400 hover:text-neutral-200 border border-neutral-800/60'
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
