'use client';

import React from 'react';
import { Heart, Compass, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { ArchImage } from '../ArchImage';
import { ScoreNumeral } from '../ScoreNumeral';
import { formatDistance } from '../../data/seedData';
import type { Dish } from '../../types/palate';

interface VaultViewProps {
  savedDishes: Dish[];
  onToggleSave: (dishId: string) => void;
  onOpenDetail: (dish: Dish) => void;
  onNavigateToDiscover: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  savedDishes,
  onToggleSave,
  onOpenDetail,
  onNavigateToDiscover,
}) => {
  return (
    <div className="space-y-6 pb-24 font-sans">
      {/* Title */}
      <div className="space-y-1 pt-2">
        <span className="text-[10.5px] uppercase tracking-overline text-gold font-bold block">
          Personal Notebook
        </span>
        <h1 className="font-serif text-3xl font-bold text-espresso tracking-tight">
          My Food Vault
        </h1>
        <p className="text-xs text-muted">
          Your curated anti-regret collection, verified orders, and offline dining shortlist.
        </p>
      </div>

      {/* Saved Dishes List or Empty State */}
      {savedDishes.length === 0 ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-card border border-hairline text-center space-y-4 my-6 shadow-subtle">
          {/* Arch Icon Illustration */}
          <div className="w-20 h-28 mx-auto rounded-[999px_999px_16px_16px] border border-gold-light p-2 bg-ivory flex items-center justify-center shadow-arch">
            <div className="w-full h-full rounded-[999px_999px_12px_12px] border border-gold-light/60 flex items-center justify-center bg-card">
              <Heart className="w-6 h-6 text-gold-light" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-xs mx-auto">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso leading-snug">
              Tap the heart on any dish
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Save your favorite God-Tier dishes to curate your personal anti-regret dining notebook.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToDiscover}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-espresso hover:bg-[#2B2119] text-gold-light font-bold text-xs uppercase tracking-luxury shadow-card active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-gold-light" />
            <span>Explore Navi Mumbai</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between text-xs text-muted font-medium pb-1 border-b border-hairline/60">
            <span>{savedDishes.length} saved {savedDishes.length === 1 ? 'item' : 'items'}</span>
            <span className="text-gold font-semibold">Offline Ready</span>
          </div>

          {savedDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => onOpenDetail(dish)}
              className="p-3.5 rounded-2xl bg-card hover:bg-card/90 border border-hairline hover:border-gold-light shadow-subtle flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] transition-all"
            >
              <ArchImage
                src={dish.photoUrl}
                alt={dish.name}
                size="thumb"
                isVeg={dish.isVeg}
              />

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

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(dish.id);
                  }}
                  className="w-8 h-8 rounded-full bg-ivory border border-hairline hover:border-oxblood/40 text-muted hover:text-oxblood flex items-center justify-center transition-colors cursor-pointer"
                  title="Remove from saved"
                  aria-label="Remove from saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="w-8 h-8 rounded-full bg-ivory border border-hairline group-hover:bg-espresso group-hover:text-gold-light text-espresso flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
