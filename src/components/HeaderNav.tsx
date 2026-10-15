import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  X, 
  Bookmark, 
  Compass, 
  Dices, 
  ChevronDown,
  Flame,
  Printer,
  Check
} from 'lucide-react';
import type { CategoryFilter } from '../types';
import { NEIGHBORHOODS } from '../data/mockData';

interface HeaderNavProps {
  currentTab: 'radar' | 'vault';
  setCurrentTab: (tab: 'radar' | 'vault') => void;
  selectedCategory: CategoryFilter;
  setSelectedCategory: (category: CategoryFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  onOpenWheel: () => void;
  onOpenFlyer?: () => void;
  vaultCount: number;
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
  currentTab,
  setCurrentTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedArea,
  setSelectedArea,
  onOpenWheel,
  onOpenFlyer,
  vaultCount,
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-nav pt-[env(safe-area-inset-top,0px)]">
      <div className="w-full px-3.5 sm:px-4 py-2.5 space-y-2.5">
        
        {/* Top Tier: Logo, Micro-Location & Primary Nav Buttons */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Location Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('radar')}
              className="flex items-center gap-1.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-500 p-0.5 flex items-center justify-center shadow-glow-orange">
                <Flame className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display font-black text-lg tracking-tight text-white">
                Palate<span className="text-brand-orange">.</span>
              </span>
            </button>

            {/* Micro-Location Indicator Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-1 text-xs font-semibold bg-[#1C1F2B] hover:bg-[#252A3A] border border-[#2B3144] text-gray-200 px-2.5 py-1.5 rounded-full transition-colors active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                <span className="max-w-[120px] truncate">{selectedArea}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {/* Location Dropdown Modal */}
              {showLocationPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={() => setShowLocationPicker(false)}
                  />
                  <div className="absolute top-full left-0 mt-1.5 z-50 w-56 rounded-2xl bg-[#141620] border border-[#2B3144] shadow-2xl p-1.5 animate-fade-in">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
                      Navi Mumbai Hubs
                    </div>
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
                            : 'text-gray-300 hover:bg-[#202434]'
                        }`}
                      >
                        <span>{area}</span>
                        {selectedArea === area && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedArea('All Sector 17 & Arenja');
                        setShowLocationPicker(false);
                      }}
                      className="w-full text-xs text-center text-brand-orange font-semibold py-1.5 mt-1 border-t border-white/5"
                    >
                      Show All Sector 17 & Arenja
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Icons: Flyer, Surprise Wheel & Vault Tab */}
          <div className="flex items-center gap-1.5">
            {/* Merchant Flyer Button */}
            {onOpenFlyer && (
              <button
                onClick={onOpenFlyer}
                title="Print Merchant Table-Tent Flyer"
                className="flex items-center gap-1 text-xs font-bold bg-[#1C1F2B] hover:bg-[#282E40] text-gray-300 hover:text-white border border-[#2B3144] px-2.5 py-1.5 rounded-full shadow-sm transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-brand-orange" />
                <span className="hidden sm:inline text-[11px]">Flyer</span>
              </button>
            )}

            {/* Surprise Me / Wheel */}
            <button
              onClick={onOpenWheel}
              title="Spin Anti-Regret Wheel"
              className="flex items-center gap-1 text-xs font-bold bg-[#1C1F2B] hover:bg-[#282E40] text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-full shadow-sm transition-all active:scale-95"
            >
              <Dices className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="hidden sm:inline">Spin</span>
            </button>

            {/* Radar / Vault Toggle Pills */}
            <div className="flex items-center bg-[#151722] border border-[#272B3C] p-0.5 rounded-full">
              <button
                onClick={() => setCurrentTab('radar')}
                className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  currentTab === 'radar'
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Radar</span>
              </button>

              <button
                onClick={() => setCurrentTab('vault')}
                className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full transition-all relative ${
                  currentTab === 'vault'
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Vault</span>
                {vaultCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center">
                    {vaultCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Clean Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search a dish (e.g., Pav Bhaji, Momos, Shawarma)..."
            className="w-full text-xs font-medium pl-10 pr-9 py-2.5 rounded-2xl bg-[#161822] border border-[#252A3C] text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Horizontal Craving Filters (Chips) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-white text-black shadow-md shadow-white/10'
                    : 'bg-[#181A25] text-gray-400 hover:text-gray-200 border border-[#282C3D]'
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
