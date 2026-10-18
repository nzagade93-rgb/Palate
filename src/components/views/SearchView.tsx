'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { ArchImage } from '../ArchImage';
import { Chip } from '../Chip';
import { formatDistance } from '../../data/seedData';
import type { Dish } from '../../types/palate';

interface SearchViewProps {
  dishes: Dish[];
  onOpenDetail: (dish: Dish) => void;
}

const TRENDING_CRAVINGS = [
  'Dal Pakwan',
  'Ghee Thali',
  'Egg Bhurji',
  'Paper Dosa',
  'Pav Bhaji',
  'Chole Bhature',
  'Surmai Fry',
  'Kutchi Chaas',
];

export const SearchView: React.FC<SearchViewProps> = ({
  dishes,
  onOpenDetail,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return dishes;
    const q = query.toLowerCase().trim();
    return dishes.filter((d) => {
      return (
        d.name.toLowerCase().includes(q) ||
        d.restaurantName.toLowerCase().includes(q) ||
        d.orderNote.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [dishes, query]);

  return (
    <div className="space-y-6 pb-24 font-sans">
      {/* Title */}
      <div className="space-y-1 pt-2">
        <span className="text-[10.5px] uppercase tracking-overline text-gold font-bold block">
          Craving-First Search
        </span>
        <h1 className="font-serif text-3xl font-bold text-espresso tracking-tight">
          What are you craving?
        </h1>
        <p className="text-xs text-muted">
          Search dishes, ingredients, or cooking styles across Navi Mumbai.
        </p>
      </div>

      {/* Natural Language Input */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-muted absolute left-4 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="E.g. Dal pakwan, crispy dosa, ghee thali..."
          className="w-full h-12 pl-11 pr-11 bg-card text-espresso placeholder-muted/60 text-xs sm:text-sm rounded-2xl border border-hairline focus:outline-none focus:border-gold shadow-subtle"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3.5 p-1 rounded-full text-muted hover:text-espresso"
            aria-label="Clear query"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Trending Cravings Chips */}
      <div className="space-y-2">
        <span className="text-[10.5px] uppercase tracking-overline text-muted font-bold block">
          Trending Cravings
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {TRENDING_CRAVINGS.map((craving) => (
            <Chip
              key={craving}
              label={craving}
              isSelected={query.toLowerCase() === craving.toLowerCase()}
              onClick={() => setQuery(craving)}
            />
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-baseline justify-between pt-1 border-t border-hairline/60">
        <span className="text-xs text-muted font-semibold">
          {searchResults.length} {searchResults.length === 1 ? 'curated dish' : 'curated dishes'}
        </span>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-xs text-gold font-semibold hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Results Rows */}
      {searchResults.length === 0 ? (
        <div className="p-8 rounded-3xl bg-card border border-hairline text-center space-y-2 my-4">
          <p className="font-serif text-lg text-espresso font-bold">No verified dishes match this craving</p>
          <p className="text-xs text-muted">Try searching for broader keywords like "thali" or "dosa".</p>
        </div>
      ) : (
        <div className="space-y-3">
          {searchResults.map((dish) => (
            <div
              key={dish.id}
              onClick={() => onOpenDetail(dish)}
              className="p-3.5 rounded-2xl bg-card hover:bg-card/90 border border-hairline hover:border-gold-light/80 shadow-subtle flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] transition-all"
            >
              {/* Arch Thumbnail */}
              <ArchImage
                src={dish.photoUrl}
                alt={dish.name}
                size="thumb"
                isVeg={dish.isVeg}
              />

              {/* Dish Name & Restaurant */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-[10px] uppercase tracking-overline text-gold font-bold block">
                  ₹{dish.price} · {dish.area}
                </span>
                <h4 className="font-serif font-bold text-espresso text-base group-hover:text-gold transition-colors leading-snug line-clamp-1">
                  {dish.name}
                </h4>
                <p className="text-xs text-muted truncate">
                  {dish.restaurantName} · {formatDistance(dish.distanceMeters)}
                </p>
              </div>

              {/* God-Tier Score Numeral Pill */}
              <div className="text-right pl-2 shrink-0">
                <div className="flex items-baseline justify-end">
                  <span className="font-serif font-bold text-lg text-espresso leading-none">
                    {dish.godTierPct}
                  </span>
                  <span className="font-serif text-xs text-gold ml-0.5">%</span>
                </div>
                <span className="text-[9px] uppercase tracking-overline text-god-tier font-bold block">
                  God-Tier
                </span>
                <span className="text-[9.5px] text-muted">
                  ({dish.vouchCount})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
