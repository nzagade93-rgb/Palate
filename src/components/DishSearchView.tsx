import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  SlidersHorizontal, 
  Utensils, 
  ChevronDown
} from 'lucide-react';
import type { Dish, CheckIn } from '../types';
import { DISHES, NEIGHBORHOODS } from '../data/mockData';
import { DishCard } from './DishCard';

interface DishSearchViewProps {
  onSelectDish: (dish: Dish) => void;
  onCheckIn?: (dish: Dish) => void;
  onShare?: (dish: Dish, checkIn?: CheckIn) => void;
  initialQuery?: string;
}

const POPULAR_CRAVINGS = [
  'Dal Pakwan',
  'Special Thali',
  'Pav Bhaji',
  'Ghee Dosa',
  'Egg Bhurji',
  'Biryani',
  'Kutchi Chaas',
  'Chaat'
];

export const DishSearchView: React.FC<DishSearchViewProps> = ({
  onSelectDish,
  onCheckIn,
  onShare,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [priceBand, setPriceBand] = useState<'ALL' | 'UNDER_150' | '150_300' | 'ABOVE_300'>('ALL');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('All Navi Mumbai');
  const [onlyGodTier, setOnlyGodTier] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtered Dishes Computation
  const searchResults = useMemo(() => {
    return DISHES.filter((dish) => {
      // 1. Text Query (Dish name, venue name, micro-verdict, flavor tags, category)
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesVenue = dish.venueName.toLowerCase().includes(q);
        const matchesVerdict = dish.microVerdict.toLowerCase().includes(q);
        const matchesTags = dish.flavorTags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = dish.category.toLowerCase().includes(q);
        if (!matchesName && !matchesVenue && !matchesVerdict && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      // 2. Dietary Filter
      if (dietaryFilter === 'VEG' && !dish.isVeg) return false;
      if (dietaryFilter === 'NON_VEG' && dish.isVeg) return false;

      // 3. Price Band
      if (priceBand === 'UNDER_150' && dish.price > 150) return false;
      if (priceBand === '150_300' && (dish.price <= 150 || dish.price > 300)) return false;
      if (priceBand === 'ABOVE_300' && dish.price <= 300) return false;

      // 4. Corridor Filter
      if (selectedCorridor && selectedCorridor !== 'All Navi Mumbai') {
        const areaClean = selectedCorridor.toLowerCase().trim();
        const dishAreaClean = dish.venueArea.toLowerCase();
        let matches = false;
        if (areaClean === 'vashi') {
          matches = dishAreaClean.includes('vashi') || dishAreaClean.includes('sector 17') || dishAreaClean.includes('arenja') || dishAreaClean.includes('apmc');
        } else if (areaClean === 'sanpada') {
          matches = dishAreaClean.includes('sanpada');
        } else if (areaClean === 'juinagar') {
          matches = dishAreaClean.includes('juinagar');
        } else if (areaClean === 'nerul') {
          matches = dishAreaClean.includes('nerul') || dishAreaClean.includes('seawoods');
        } else if (areaClean === 'cbd belapur') {
          matches = dishAreaClean.includes('belapur') || dishAreaClean.includes('cbd');
        } else if (areaClean === 'kharghar') {
          matches = dishAreaClean.includes('kharghar') || dishAreaClean.includes('shilp') || dishAreaClean.includes('utsav');
        } else {
          matches = dishAreaClean.includes(areaClean);
        }
        if (!matches) return false;
      }

      // 5. God-Tier Only
      if (onlyGodTier && dish.verdict !== 'GOD_TIER') return false;

      return true;
    });
  }, [query, dietaryFilter, priceBand, selectedCorridor, onlyGodTier]);

  const activeFilterCount = (dietaryFilter !== 'ALL' ? 1 : 0) +
    (priceBand !== 'ALL' ? 1 : 0) +
    (selectedCorridor !== 'All Navi Mumbai' ? 1 : 0) +
    (onlyGodTier ? 1 : 0);

  const resetAllFilters = () => {
    setQuery('');
    setDietaryFilter('ALL');
    setPriceBand('ALL');
    setSelectedCorridor('All Navi Mumbai');
    setOnlyGodTier(false);
  };

  return (
    <div className="w-full space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[var(--text-primary)] tracking-tight">
          Dish-First Search
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Search by exact craving, specialty dish, or taste profile across Navi Mumbai.
        </p>
      </div>

      {/* Prominent Search Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you craving? (e.g. Pav Bhaji, Dosa, Thali...)"
          className="w-full h-12 pl-11 pr-11 bg-[var(--surface-2)] text-[var(--text-primary)] text-xs sm:text-sm placeholder:text-[var(--text-muted)] rounded-2xl border border-[var(--border-subtle)] focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/40 transition-all shadow-inner"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface-3)] transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Trending Cravings Quick Pills */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block">
          Trending Cravings
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {POPULAR_CRAVINGS.map((craving) => (
            <button
              key={craving}
              onClick={() => setQuery(craving)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all active:scale-95 border cursor-pointer ${
                query.toLowerCase() === craving.toLowerCase()
                  ? 'bg-brand-orange text-white border-brand-orange shadow-glow-orange font-bold'
                  : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-subtle)] hover:bg-[var(--surface-3)]'
              }`}
            >
              {craving}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toggle Toolbar */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            showFilters || activeFilterCount > 0
              ? 'bg-[var(--surface-2)] text-brand-orange border-brand-orange/50'
              : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Quick Corridor Selector */}
        <div className="relative">
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)] rounded-xl px-2.5 py-1.5 pr-7 text-xs font-medium focus:outline-none focus:border-brand-orange cursor-pointer appearance-none"
          >
            {NEIGHBORHOODS.map((hub) => (
              <option key={hub} value={hub}>
                {hub}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Results Counter */}
        <span className="text-[11px] text-[var(--text-muted)] font-medium ml-auto">
          {searchResults.length} {searchResults.length === 1 ? 'dish' : 'dishes'}
        </span>
      </div>

      {/* Expandable Advanced Filters Drawer */}
      {showFilters && (
        <div className="p-4 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-subtle)] space-y-3.5 animate-slide-up shadow-xl text-[var(--text-primary)]">
          {/* Row 1: Dietary Toggle */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block">
              Dietary Preference
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => setDietaryFilter('ALL')}
                className={`py-1.5 px-2 rounded-xl font-bold border transition-all cursor-pointer ${
                  dietaryFilter === 'ALL'
                    ? 'bg-[var(--text-primary)] text-[var(--canvas)] border-[var(--text-primary)]'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                }`}
              >
                All Diets
              </button>
              <button
                onClick={() => setDietaryFilter('VEG')}
                className={`py-1.5 px-2 rounded-xl font-bold border transition-all cursor-pointer ${
                  dietaryFilter === 'VEG'
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-glow-green'
                    : 'bg-[var(--surface-2)] text-emerald-600 dark:text-emerald-400 border-[var(--border-subtle)]'
                }`}
              >
                🟢 Pure Veg
              </button>
              <button
                onClick={() => setDietaryFilter('NON_VEG')}
                className={`py-1.5 px-2 rounded-xl font-bold border transition-all cursor-pointer ${
                  dietaryFilter === 'NON_VEG'
                    ? 'bg-red-500 text-white border-red-400'
                    : 'bg-[var(--surface-2)] text-red-600 dark:text-red-400 border-[var(--border-subtle)]'
                }`}
              >
                🔴 Non-Veg
              </button>
            </div>
          </div>

          {/* Row 2: Price Bands */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block">
              Price Range
            </span>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                onClick={() => setPriceBand('ALL')}
                className={`py-1.5 px-1 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                  priceBand === 'ALL'
                    ? 'bg-[var(--text-primary)] text-[var(--canvas)] border-[var(--text-primary)]'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                }`}
              >
                Any
              </button>
              <button
                onClick={() => setPriceBand('UNDER_150')}
                className={`py-1.5 px-1 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                  priceBand === 'UNDER_150'
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                }`}
              >
                &lt; ₹150
              </button>
              <button
                onClick={() => setPriceBand('150_300')}
                className={`py-1.5 px-1 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                  priceBand === '150_300'
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                }`}
              >
                ₹150-300
              </button>
              <button
                onClick={() => setPriceBand('ABOVE_300')}
                className={`py-1.5 px-1 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                  priceBand === 'ABOVE_300'
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                }`}
              >
                ₹300+
              </button>
            </div>
          </div>

          {/* Row 3: God-Tier Only Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-[var(--text-primary)]">Only God-Tier Dishes (95%+)</span>
            </div>
            <button
              onClick={() => setOnlyGodTier(!onlyGodTier)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                onlyGodTier ? 'bg-emerald-500' : 'bg-[var(--surface-2)] border border-[var(--border-subtle)]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  onlyGodTier ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Filters Action */}
          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="w-full py-1.5 text-xs text-brand-orange font-bold text-center hover:underline pt-1 cursor-pointer"
            >
              Reset All Search Filters
            </button>
          )}
        </div>
      )}

      {/* Results Feed */}
      {searchResults.length === 0 ? (
        <div className="p-10 rounded-3xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-center space-y-3 my-8 shadow-xl">
          <Utensils className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">No dishes match your craving</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
            Try searching for broader keywords like "thali", "dosa", or clearing your dietary filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-glow-orange hover:bg-orange-600 transition-all active:scale-95 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="pt-2">
          {searchResults.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onSelectDish={onSelectDish}
              onCheckIn={onCheckIn}
              onShare={onShare}
            />
          ))}
        </div>
      )}
    </div>
  );
};
