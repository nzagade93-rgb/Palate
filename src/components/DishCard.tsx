'use client';

import React from 'react';
import { ArchImage } from './ArchImage';
import { ScoreNumeral } from './ScoreNumeral';
import { TrustLine } from './TrustLine';
import { OrderSkipRows } from './OrderSkipRows';
import { formatDistance, computeSharedTasteCount, CURRENT_USER } from '../data/seedData';
import type { Dish } from '../types/palate';
import { MapPin, Share2, Sparkles } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  isSaved?: boolean;
  onToggleSave: () => void;
  onOpenDetail: (dish: Dish) => void;
  onCheckIn: (dish: Dish) => void;
  onSplit: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  isSaved = false,
  onToggleSave,
  onOpenDetail,
  onCheckIn,
  onSplit,
}) => {
  const sharedTasteCount = computeSharedTasteCount(
    CURRENT_USER.dnaAffinities,
    dish.dnaVector,
    dish.vouchCount
  );

  return (
    <article className="bg-card rounded-2xl border border-hairline p-4 sm:p-5 shadow-card hover:border-gold-light transition-all flex flex-col space-y-4 relative">
      {/* 1. Arch Image with Category Badge & Overlays */}
      <div 
        onClick={() => onOpenDetail(dish)}
        className="cursor-pointer"
      >
        <ArchImage
          src={dish.photoUrl}
          alt={dish.name}
          size="card"
          isVeg={dish.isVeg}
          isSaved={isSaved}
          onToggleSave={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          categoryBadge={dish.category[1] || dish.category[0]}
        />
      </div>

      {/* 2. Header: Overline Price, Serif Title & Score Numeral Divider */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="min-w-0 flex-1">
          {/* Price Overline */}
          <span className="text-[10.5px] uppercase tracking-overline text-gold font-bold block mb-0.5">
            ₹{dish.price} · {dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          </span>

          {/* Serif Dish Title */}
          <h3 
            onClick={() => onOpenDetail(dish)}
            className="font-serif text-xl sm:text-2xl font-bold text-espresso leading-snug hover:text-gold transition-colors cursor-pointer"
          >
            {dish.name}
          </h3>

          {/* Restaurant & Formatted Distance */}
          <div className="text-xs text-muted flex items-center gap-1.5 mt-1">
            <span className="font-semibold text-espresso truncate">{dish.restaurantName}</span>
            <span className="text-gold">·</span>
            <span className="text-muted shrink-0">{dish.area}</span>
            <span className="text-gold">·</span>
            <span className="text-espresso font-medium shrink-0">
              {formatDistance(dish.distanceMeters)}
            </span>
          </div>
        </div>

        {/* Large Serif God-Tier Score Numeral */}
        <ScoreNumeral
          score={dish.godTierPct}
          vouchCount={dish.vouchCount}
        />
      </div>

      {/* 3. Trust Line */}
      <TrustLine
        vouchCount={dish.vouchCount}
        vouchesThisMonth={dish.vouchesThisMonth}
        sharedTasteCount={sharedTasteCount}
      />

      {/* 4. Order & Skip Rows */}
      <OrderSkipRows
        orderNote={dish.orderNote}
        skipNote={dish.skipNote}
      />

      {/* 5. Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-hairline/60">
        {/* Primary Action: [SEE THE VERDICT] */}
        <button
          type="button"
          onClick={() => onOpenDetail(dish)}
          className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-espresso hover:bg-[#2B2119] text-gold-light font-bold text-xs uppercase tracking-luxury active:scale-95 transition-all shadow-subtle flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-light" />
          <span>See the Verdict</span>
        </button>

        {/* Secondary Action: [Check-in] */}
        <button
          type="button"
          onClick={() => onCheckIn(dish)}
          className="min-h-[44px] px-3.5 rounded-xl border border-hairline hover:border-gold bg-ivory/60 hover:bg-ivory text-espresso font-semibold text-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-gold" />
          <span>Check-in</span>
        </button>

        {/* Secondary Action: [Split] */}
        <button
          type="button"
          onClick={() => onSplit(dish)}
          className="min-h-[44px] px-3.5 rounded-xl border border-hairline hover:border-gold bg-ivory/60 hover:bg-ivory text-espresso font-semibold text-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Split dish with friends"
        >
          <Share2 className="w-3.5 h-3.5 text-muted" />
          <span>Split</span>
        </button>
      </div>
    </article>
  );
};
