'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, UtensilsCrossed, Navigation, ExternalLink, Heart } from 'lucide-react';
import { ArchImage } from './ArchImage';
import { ScoreNumeral } from './ScoreNumeral';
import { TrustLine } from './TrustLine';
import { OrderSkipRows } from './OrderSkipRows';
import { formatDistance, computeSharedTasteCount, CURRENT_USER } from '../data/seedData';
import type { Dish } from '../types/palate';

interface DetailSheetProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onReserveTable?: () => void;
  onOrderDirect?: () => void;
}

export const DetailSheet: React.FC<DetailSheetProps> = ({
  dish,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
  onReserveTable,
  onOrderDirect,
}) => {
  if (!dish) return null;

  const sharedTasteCount = computeSharedTasteCount(
    CURRENT_USER.dnaAffinities,
    dish.dnaVector,
    dish.vouchCount
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso/50 backdrop-blur-sm"
          />

          {/* Spring Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-[430px] max-h-[92vh] bg-card rounded-t-[32px] border-t border-gold-light/60 shadow-sheet z-10 flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-12 h-1.5 rounded-full bg-hairline mx-auto mt-3 shrink-0" />

            {/* Top Close & Save Action */}
            <div className="px-5 py-2 flex items-center justify-between shrink-0">
              <span className="text-[10px] uppercase tracking-overline text-gold font-bold">
                The Definitive Verdict
              </span>
              <div className="flex items-center gap-2">
                {onToggleSave && (
                  <button
                    type="button"
                    onClick={onToggleSave}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                      isSaved ? 'bg-espresso text-gold-light border-gold' : 'bg-ivory border-hairline text-espresso'
                    }`}
                    aria-label="Save dish"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-gold-light text-gold-light' : ''}`} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-ivory border border-hairline hover:border-gold flex items-center justify-center text-espresso cursor-pointer"
                  aria-label="Close sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-5 py-3 space-y-4 pb-28">
              {/* Arch Hero Image */}
              <ArchImage
                src={dish.photoUrl}
                alt={dish.name}
                size="hero"
                isVeg={dish.isVeg}
                categoryBadge={dish.category[1] || dish.category[0]}
              />

              {/* Header Info */}
              <div className="flex items-start justify-between gap-3 pt-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[10.5px] uppercase tracking-overline text-gold font-bold block mb-1">
                    ₹{dish.price} · {dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-espresso leading-snug">
                    {dish.name}
                  </h2>
                  <div className="text-xs text-muted flex items-center gap-1.5 mt-1">
                    <span className="font-semibold text-espresso">{dish.restaurantName}</span>
                    <span className="text-gold">·</span>
                    <span>{dish.area}</span>
                    <span className="text-gold">·</span>
                    <span className="text-espresso font-medium">{formatDistance(dish.distanceMeters)}</span>
                  </div>
                </div>

                <ScoreNumeral
                  score={dish.godTierPct}
                  vouchCount={dish.vouchCount}
                  size="large"
                />
              </div>

              {/* Trust Line */}
              <TrustLine
                vouchCount={dish.vouchCount}
                vouchesThisMonth={dish.vouchesThisMonth}
                sharedTasteCount={sharedTasteCount}
              />

              {/* Order & Skip Rows */}
              <div className="p-3.5 rounded-xl bg-ivory/60 border border-hairline space-y-1">
                <OrderSkipRows
                  orderNote={dish.orderNote}
                  skipNote={dish.skipNote}
                />
              </div>

              {/* Tags & Flavor Breakdown */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-overline text-muted font-bold block">
                  Flavor Characteristics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dish.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-ivory border border-hairline text-espresso font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {dish.curatorPick && (
                    <span className="text-xs px-2.5 py-1 rounded-md bg-gold/15 border border-gold/40 text-gold font-semibold">
                      Palate Team Pick
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-card/95 backdrop-blur-md border-t border-gold-light/60 flex items-center gap-3">
              {/* Primary: [RESERVE A TABLE] */}
              <button
                type="button"
                onClick={onReserveTable || onClose}
                className="flex-1 min-h-[48px] py-3 px-4 rounded-xl bg-espresso hover:bg-[#2B2119] text-gold-light font-bold text-xs uppercase tracking-luxury shadow-card active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-gold-light" />
                <span>Reserve a Table</span>
              </button>

              {/* Secondary: [Order] */}
              <button
                type="button"
                onClick={onOrderDirect || onClose}
                className="min-h-[48px] px-5 rounded-xl border border-hairline hover:border-gold bg-ivory text-espresso font-bold text-xs uppercase tracking-luxury active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-espresso" />
                <span>Order</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
