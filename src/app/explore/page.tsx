'use client';

// ==============================================================================
// PALATE: Navi Mumbai Food Directory (Staff UI/UX Edition)
// 100% community-ranked dishes verified by authentic local foodies.
// Pixel-perfect mobile-first layout with fluid interactions, micro-animations,
// instant fuzzy search, multi-filter pills, and gamified tasting logger.
// ==============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Trophy,
  Filter,
  Sparkles,
  ArrowUpDown,
  X,
  ChevronDown,
} from 'lucide-react';
import { INITIAL_DISHES } from '@/lib/mockData';
import { Dish } from '@/types';
import RankedDishCard from '@/components/RankedDishCard';
import LogBiteModal from '@/components/LogBiteModal';

const NEIGHBORHOOD_CHIPS = [
  'All Navi Mumbai',
  'Vashi',
  'Nerul',
  'Belapur',
  'Kharghar',
  'Seawoods',
  'Sanpada',
];

type SortOption = 'consensus' | 'rating' | 'price_asc';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All Navi Mumbai');
  const [vegOnly, setVegOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [under200, setUnder200] = useState(false);
  const [under100, setUnder100] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('consensus');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Modal & Toast states
  const [activeDishForLog, setActiveDishForLog] = useState<Dish | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with global header neighborhood changes
  useEffect(() => {
    const handleNeighborhoodChange = (e: any) => {
      const zone = e.detail?.zone || 'All Navi Mumbai';
      setSelectedNeighborhood(zone);
    };

    window.addEventListener('palate_neighborhood_changed', handleNeighborhoodChange);
    return () => {
      window.removeEventListener('palate_neighborhood_changed', handleNeighborhoodChange);
    };
  }, []);

  const handleSelectNeighborhood = (chip: string) => {
    setSelectedNeighborhood(chip);
    const finalZone = chip === 'All Navi Mumbai' ? 'Navi Mumbai' : chip;
    if (typeof window !== 'undefined') {
      localStorage.setItem('palate_selected_neighborhood', finalZone);
      window.dispatchEvent(
        new CustomEvent('palate_neighborhood_changed', { detail: { zone: finalZone } })
      );
    }
  };

  // Instant Fuzzy Filtering & Sorting
  const filteredDishes = useMemo(() => {
    return INITIAL_DISHES.filter((dish) => {
      // 1. Instant fuzzy search across dish titles and restaurant names
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDish = dish.name.toLowerCase().includes(q);
        const matchesRest = dish.restaurantName.toLowerCase().includes(q);
        const matchesNode = dish.node.toLowerCase().includes(q);
        const matchesSector = dish.sector ? dish.sector.toLowerCase().includes(q) : false;
        const matchesCategory = dish.category.toLowerCase().includes(q);
        if (!matchesDish && !matchesRest && !matchesNode && !matchesSector && !matchesCategory) {
          return false;
        }
      }

      // 2. Single select neighborhood filter
      if (
        selectedNeighborhood !== 'All Navi Mumbai' &&
        selectedNeighborhood !== 'All' &&
        dish.node.toLowerCase() !== selectedNeighborhood.toLowerCase()
      ) {
        return false;
      }

      // 3. Veg Only
      if (vegOnly && !dish.isVeg) {
        return false;
      }

      // 4. 4.4+ Rated (consensus >= 88%)
      if (topRatedOnly && dish.consensusPercentage < 88) {
        return false;
      }

      // 5. Under ₹100
      if (under100 && dish.priceInr && dish.priceInr > 100) {
        return false;
      }

      // 6. Under ₹200
      if (under200 && dish.priceInr && dish.priceInr > 200) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return (a.priceInr || 0) - (b.priceInr || 0);
      }
      if (sortBy === 'rating') {
        const ratingA = a.consensusPercentage / 20;
        const ratingB = b.consensusPercentage / 20;
        return ratingB - ratingA || b.totalVotes - a.totalVotes;
      }
      // Default: Ranked by Consensus
      return b.consensusPercentage - a.consensusPercentage || b.totalVotes - a.totalVotes;
    });
  }, [
    searchQuery,
    selectedNeighborhood,
    vegOnly,
    topRatedOnly,
    under200,
    under100,
    sortBy,
  ]);

  const handleBiteLogged = (dishName: string) => {
    setToastMessage(`Tasting logged for ${dishName}! +15 CP earned.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price_asc':
        return 'Price: Low to High';
      case 'rating':
        return 'Top Rated';
      case 'consensus':
      default:
        return 'Ranked by Consensus';
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedNeighborhood('All Navi Mumbai');
    setVegOnly(false);
    setTopRatedOnly(false);
    setUnder200(false);
    setUnder100(false);
    setSortBy('consensus');
  };

  return (
    <div className="min-h-full pb-24">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl flex items-center space-x-2 border border-white/10"
          >
            <Sparkles className="h-4 w-4 text-[#F59E0B]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Header & Search Box */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sticky top-0 z-20">
        {/* Hero Title & Subtitle */}
        <div className="mb-2.5">
          <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Navi Mumbai Food Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            100% community-ranked dishes. Verified by true foodies.
          </p>
        </div>

        {/* Prominent Rounded Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Vada Pav, Biryani, Misal, Shawarma..."
            className="w-full bg-[#F8FAFC] text-slate-900 text-xs font-semibold pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0D4734]/20 focus:border-[#0D4734] focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Horizontal Neighborhood Carousel (Single Select) */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pt-2.5 -mx-4 px-4">
          {NEIGHBORHOOD_CHIPS.map((chip) => {
            const isSelected = selectedNeighborhood === chip;
            return (
              <button
                key={chip}
                onClick={() => handleSelectNeighborhood(chip)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#0D4734] text-white font-extrabold shadow-xs border border-[#0D4734]'
                    : 'bg-white text-slate-700 font-bold border border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Multi-Select Filter Pills */}
      <div className="px-4 py-2.5 flex items-center space-x-2 overflow-x-auto scrollbar-none bg-[#F8FAFC] border-b border-slate-100">
        {/* 🟢 Veg Only */}
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            vegOnly
              ? 'bg-emerald-50 text-[#16A34A] border-[#16A34A] shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
          <span>Veg Only</span>
        </button>

        {/* ⭐ 4.4+ Rated */}
        <button
          onClick={() => setTopRatedOnly(!topRatedOnly)}
          className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            topRatedOnly
              ? 'bg-amber-50 text-amber-800 border-[#F59E0B] shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
          <span>4.4+ Rated</span>
        </button>

        {/* ₹ Under 200 */}
        <button
          onClick={() => setUnder200(!under200)}
          className={`shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            under200
              ? 'bg-emerald-50 text-emerald-900 border-[#0D4734] shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span>₹ Under 200</span>
        </button>

        {/* ₹ Under 100 */}
        <button
          onClick={() => setUnder100(!under100)}
          className={`shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            under100
              ? 'bg-emerald-50 text-emerald-900 border-[#0D4734] shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span>₹ Under 100</span>
        </button>
      </div>

      {/* Results Count & Sorting Header */}
      <div className="px-4 py-3 flex items-center justify-between relative">
        {/* Left: Live counter */}
        <span className="text-xs font-extrabold text-slate-500">
          Showing {filteredDishes.length} ranked dishes
        </span>

        {/* Right: Sort Pill with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center space-x-1.5 bg-white border border-slate-200/90 text-slate-800 text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-2xs hover:border-slate-300 active:scale-95 transition-all"
          >
            <span>{getSortLabel()}</span>
            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>

          {/* Sort Dropdown Menu */}
          {isSortDropdownOpen && (
            <div className="absolute right-0 top-9 z-30 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setSortBy('consensus');
                  setIsSortDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between ${
                  sortBy === 'consensus'
                    ? 'text-[#0D4734] bg-emerald-50/60'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Ranked by Consensus</span>
                {sortBy === 'consensus' && <span className="text-[#0D4734]">✓</span>}
              </button>

              <button
                onClick={() => {
                  setSortBy('rating');
                  setIsSortDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between ${
                  sortBy === 'rating'
                    ? 'text-[#0D4734] bg-emerald-50/60'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Top Rated</span>
                {sortBy === 'rating' && <span className="text-[#0D4734]">✓</span>}
              </button>

              <button
                onClick={() => {
                  setSortBy('price_asc');
                  setIsSortDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between ${
                  sortBy === 'price_asc'
                    ? 'text-[#0D4734] bg-emerald-50/60'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Price: Low to High</span>
                {sortBy === 'price_asc' && <span className="text-[#0D4734]">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ranked Food Cards List */}
      <div className="px-4 space-y-3.5">
        {filteredDishes.length === 0 ? (
          /* Empty Results State */
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm mt-3">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-2xl">
              🔍
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              No ranked dishes found
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 max-w-[260px] mx-auto leading-relaxed">
              No dishes match your active search or filters. Try relaxing your filters to discover more food.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-4 px-5 py-2 bg-[#0D4734] hover:bg-[#082d21] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredDishes.map((dish, index) => {
            const rank = index + 1;
            return (
              <RankedDishCard
                key={dish.id}
                dish={dish}
                rank={rank}
                onOpenLogBite={(selected) => setActiveDishForLog(selected)}
              />
            );
          })
        )}
      </div>

      {/* Log Bite Bottom Sheet Modal */}
      <LogBiteModal
        isOpen={Boolean(activeDishForLog)}
        dish={activeDishForLog}
        onClose={() => setActiveDishForLog(null)}
        onSuccess={handleBiteLogged}
      />
    </div>
  );
}
