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
import { ThemeToggle } from './ThemeToggle';

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

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  'All': '✨ Sab Kuch',
  'Must-Try Icons': '👑 Must-Try Icons',
  'Quick Bites': '⚡ Quick Bites',
  'Late Night': '🌙 Late Night',
  'Spicy': '🔥 Teekha / Spicy',
  'Sweet Tooth': '🍨 Meetha'
};

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
    <header className="sticky top-0 z-30 w-full glass-nav pt-[env(safe-area-inset-top,0px)] border-b border-[var(--border-subtle)]">
      <div className="w-full px-3.5 sm:px-4 py-2.5 space-y-2.5">
        
        {/* Tier 1: Brand & Integrated 1-Click Theme Switch + Location Chip */}
        <div className="h-12 flex items-center justify-between gap-2">
          {/* Brand Logo & Wordmark */}
          <button
            onClick={onBrandClick}
            className="flex items-center gap-2 focus:outline-none group text-left active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-500 p-0.5 flex items-center justify-center shadow-glow-orange shrink-0">
              <Flame className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="flex items-baseline">
              <span className="font-display font-black text-sm tracking-widest uppercase text-[var(--text-primary)]">
                Palate
              </span>
              <span className="text-brand-orange font-black text-sm ml-0.5">.</span>
            </div>
          </button>

          {/* Controls Cluster: 1-Click Theme Switch + Location Pill */}
          <div className="flex items-center gap-2">
            {/* 1-Click Dark Elite / White Elite Theme Switch */}
            <ThemeToggle variant="pill" />

            {/* Micro-Location Indicator Pill with min 44px touch area */}
            <div className="relative flex items-center">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                aria-label="Select Neighborhood Hub"
                className="min-h-[44px] flex items-center gap-1.5 text-xs font-bold bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border-subtle)] hover:border-gold-500/50 text-[var(--text-secondary)] px-3 py-1.5 rounded-full transition-all active:scale-95 shrink-0 cursor-pointer shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span className="max-w-[100px] sm:max-w-[130px] truncate">{selectedArea}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
              </button>

              {/* Neighborhood Dropdown Modal */}
              {showLocationPicker && (
                <>
                  <div
                    className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-xs"
                    onClick={() => setShowLocationPicker(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 z-[55] w-64 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-subtle)] shadow-2xl p-2 animate-fade-in text-[var(--text-primary)]">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-3 py-1.5 flex items-center justify-between">
                      <span>Navi Mumbai Corridors</span>
                      <span className="text-brand-orange text-[9px] font-black">Spine</span>
                    </div>
                    <div className="space-y-0.5 mt-1 max-h-64 overflow-y-auto no-scrollbar">
                      {NEIGHBORHOODS.map((area) => (
                        <button
                          key={area}
                          onClick={() => {
                            setSelectedArea(area);
                            setShowLocationPicker(false);
                          }}
                          className={`w-full flex items-center justify-between text-xs px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                            selectedArea === area
                              ? 'bg-brand-orange text-white font-bold'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] font-medium'
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
                      className="w-full text-xs text-center text-brand-orange font-bold py-2.5 mt-1.5 border-t border-[var(--border-subtle)] hover:underline cursor-pointer"
                    >
                      Reset to All Navi Mumbai
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: Refined Low-Height Search Input with Surface 2 & Clear Focus State */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search karo dish ya spot (e.g. Dosa, Shawarma, Thali)..."
            className="w-full text-xs font-medium pl-10 pr-11 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] w-9 h-9 flex items-center justify-center cursor-pointer active:scale-90"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tier 3: Scaled Horizontal Category Filters with min 44px Touch Targets */}
        <div className="-mx-3.5 sm:-mx-4 px-3.5 sm:px-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 min-h-[44px] py-2 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer shadow-xs flex items-center ${
                  isSelected
                    ? 'bg-[var(--text-primary)] text-[var(--canvas)] font-extrabold shadow-sm'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

