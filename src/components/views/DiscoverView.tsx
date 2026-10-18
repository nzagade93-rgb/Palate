'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, MapPin, Dices, Radio } from 'lucide-react';
import { DishCard } from '../DishCard';
import { Chip } from '../Chip';
import type { Dish, CategoryType } from '../../types/palate';

interface DiscoverViewProps {
  dishes: Dish[];
  savedDishIds: Set<string>;
  onToggleSave: (dishId: string) => void;
  onOpenDetail: (dish: Dish) => void;
  onCheckIn: (dish: Dish) => void;
  onSplit: (dish: Dish) => void;
  onDecideForMe: () => void;
  liveVouch: { userName?: string; dishName: string; restaurantName: string; timeAgo: string } | null;
}

const CATEGORIES: CategoryType[] = [
  'All',
  'Must-Try Icons',
  'Quick Bites',
  'Late Night',
  'Spicy',
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  dishes,
  savedDishIds,
  onToggleSave,
  onOpenDetail,
  onCheckIn,
  onSplit,
  onDecideForMe,
  liveVouch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [inlineSearch, setInlineSearch] = useState('');

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      if (selectedCategory !== 'All' && !dish.category.includes(selectedCategory)) {
        return false;
      }
      if (inlineSearch.trim()) {
        const q = inlineSearch.toLowerCase().trim();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchRest = dish.restaurantName.toLowerCase().includes(q);
        const matchTag = dish.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchRest && !matchTag) return false;
      }
      return true;
    });
  }, [dishes, selectedCategory, inlineSearch]);

  return (
    <div className="space-y-6 pb-24 font-sans">
      {/* 1. Header Bar: Logo, Location Pill, Decide Icon */}
      <header className="flex items-center justify-between gap-3 pt-2">
        {/* Brand Wordmark */}
        <div className="flex items-baseline">
          <span className="font-serif font-black text-2xl tracking-tight text-espresso">
            Palate
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold ml-0.5 inline-block" />
        </div>

        {/* Location Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-hairline shadow-subtle text-xs text-espresso font-semibold">
          <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
          <span className="truncate max-w-[125px]">Vashi · Sector 17</span>
        </div>

        {/* "Decide for me" Button */}
        <button
          type="button"
          onClick={onDecideForMe}
          title="Decide for me based on my Palate DNA"
          className="w-10 h-10 rounded-full bg-card border border-gold-light hover:border-gold shadow-subtle flex items-center justify-center text-espresso active:scale-95 transition-all cursor-pointer group"
          aria-label="Decide for me"
        >
          <Dices className="w-5 h-5 text-gold group-hover:rotate-45 transition-transform" />
        </button>
      </header>

      {/* 2. Underline Search Field */}
      <div className="relative border-b border-espresso/20 pb-1.5 focus-within:border-gold transition-colors">
        <Search className="w-4 h-4 text-muted absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={inlineSearch}
          onChange={(e) => setInlineSearch(e.target.value)}
          placeholder="Search by dish or venue..."
          className="w-full pl-7 pr-4 py-1 text-xs bg-transparent text-espresso placeholder-muted/70 focus:outline-none"
        />
      </div>

      {/* 3. Category Chips Row */}
      <div className="-mx-4 px-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            isSelected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </div>

      {/* 4. Slim Live Check-In Strip with Green Pulse */}
      {liveVouch && (
        <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-xl bg-card border border-hairline shadow-subtle text-[11px] text-muted animate-fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-god-tier opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-god-tier" />
            </span>
            <span className="truncate">
              <strong className="text-espresso font-semibold">{liveVouch.userName || 'Diner'}</strong> just vouched for <strong className="text-espresso font-semibold">{liveVouch.dishName}</strong> at {liveVouch.restaurantName}
            </span>
          </div>
          <span className="text-[10px] text-gold font-medium shrink-0">
            {liveVouch.timeAgo}
          </span>
        </div>
      )}

      {/* 5. Section Heading & Dynamic Count */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-[10.5px] uppercase tracking-overline text-gold font-bold block mb-0.5">
            Navi Mumbai Spine
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso tracking-tight leading-tight">
            What should you order?
          </h1>
        </div>

        <span className="text-xs text-muted font-medium shrink-0">
          {filteredDishes.length} {filteredDishes.length === 1 ? 'dish' : 'dishes'}
        </span>
      </div>

      {/* 6. Staggered Dish Cards Feed */}
      {filteredDishes.length === 0 ? (
        <div className="p-8 rounded-3xl bg-card border border-hairline text-center space-y-2 my-6">
          <p className="font-serif text-lg text-espresso font-bold">No dishes found</p>
          <p className="text-xs text-muted">Try clearing your search query or selecting "All".</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setInlineSearch('');
            }}
            className="mt-2 text-xs font-bold text-gold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <DishCard
                dish={dish}
                isSaved={savedDishIds.has(dish.id)}
                onToggleSave={() => onToggleSave(dish.id)}
                onOpenDetail={onOpenDetail}
                onCheckIn={onCheckIn}
                onSplit={onSplit}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
