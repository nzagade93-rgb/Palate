import React, { useState } from 'react';
import { 
  Sparkles, 
  Navigation, 
  Bookmark, 
  BookmarkCheck, 
  Flame, 
  ChevronRight, 
  MapPin, 
  Share2, 
  CheckCircle2 
} from 'lucide-react';
import type { Dish, CheckIn } from '../types';
import { useVault } from '../hooks/useVault';
import { useCheckIns } from '../hooks/useCheckIns';

interface DishCardProps {
  dish: Dish;
  onSelectDish: (dish: Dish) => void;
  onOpenSplit?: (dish: Dish) => void;
  onCheckIn?: (dish: Dish) => void;
  onShare?: (dish: Dish, checkIn?: CheckIn) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ 
  dish, 
  onSelectDish,
  onOpenSplit,
  onCheckIn,
  onShare
}) => {
  const { isDishSaved, saveDishToVault } = useVault();
  const { isCheckedInToday, getLatestCheckIn } = useCheckIns();
  const { saved } = isDishSaved(dish.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  const checkedInToday = isCheckedInToday(dish.id);
  const latestCheckIn = getLatestCheckIn(dish.id);

  const isGodTier = dish.verdict === 'GOD_TIER';
  const isWorthIt = dish.verdict === 'WORTH_IT';

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveDishToVault(dish, saved ? 'LOVED' : 'SAVED');
  };

  const handleCheckInClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCheckIn) {
      onCheckIn(dish);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(dish, latestCheckIn);
    }
  };

  return (
    <article 
      onClick={() => onSelectDish(dish)}
      className="group relative rounded-2xl bg-[var(--surface-1)] border border-[var(--border-subtle)] hover:border-gold-500/50 transition-all duration-300 overflow-hidden cursor-pointer shadow-[var(--card-shadow)] active:scale-[0.99] flex flex-col mb-6"
    >
      {/* High-Impact Hero Food Image Locked to aspect-[16/10] */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-2)] rounded-t-2xl">
        {/* Shimmer loading state */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface-3)] to-[var(--surface-2)] animate-pulse" />
        )}

        <img
          src={dish.imageUrl}
          alt={dish.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Subtle Bottom Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-1)]/80 via-transparent to-transparent pointer-events-none" />

        {/* Badge Overlays: Top-3 Left-3 (God-Tier Pill) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span
            className={`w-5 h-5 rounded-md flex items-center justify-center p-0.5 border shrink-0 backdrop-blur-md shadow-sm ${
              dish.isVeg ? 'border-emerald-500/80 bg-emerald-950/80' : 'border-red-500/80 bg-red-950/80'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dish.isVeg ? 'bg-emerald-400' : 'bg-red-400'
              }`}
            />
          </span>
          {isGodTier ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-emerald-400 font-extrabold text-[11px] tracking-wide border border-emerald-500/40 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{dish.scorePercent}% Asli God-Tier 👑</span>
            </div>
          ) : isWorthIt ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-blue-400 font-extrabold text-[11px] tracking-wide border border-blue-500/40 shadow-lg">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>{dish.scorePercent}% Paisa Vasool 👍</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-rose-400 font-extrabold text-[11px] tracking-wide border border-rose-500/40 shadow-lg">
              <span>Mat Mangwana ❌</span>
            </div>
          )}
        </div>

        {/* Badge Overlays: Top-3 Right-3 (Bookmark & Share Actions with 44px+ hitboxes) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <button
            onClick={handleShareClick}
            aria-label="Flex on Story"
            title="Share to Story"
            className="w-11 h-11 rounded-full backdrop-blur-md border bg-black/65 text-white/95 border-white/25 hover:bg-black/90 hover:text-white active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-md"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleBookmarkClick}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark to Vault'}
            className={`w-11 h-11 rounded-full backdrop-blur-md border transition-all flex items-center justify-center cursor-pointer active:scale-90 shadow-md ${
              saved
                ? 'bg-brand-orange text-white border-brand-orange shadow-glow-orange scale-105'
                : 'bg-black/65 text-white/95 border-white/25 hover:bg-black/90 hover:text-white'
            }`}
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4 text-white" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Card Body: Standard p-4 space-y-3 */}
      <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Dish Title and Price Tag Aligned Horizontally */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-black text-[var(--text-primary)] tracking-wide leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">
                {dish.name}
              </h3>
              {/* Venue & Micro-Distance */}
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-1">
                <span className="font-bold text-[var(--text-secondary)] hover:underline truncate">{dish.venueName}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-500 font-semibold shrink-0">
                  <Navigation className="w-3 h-3" />
                  {dish.distanceMeters}m ({dish.walkingMinutes} min)
                </span>
              </div>
            </div>

            <span className="text-xs font-black text-[var(--text-primary)] bg-[var(--surface-2)] px-2.5 py-1.5 rounded-xl border border-[var(--border-subtle)] shrink-0 shadow-xs">
              ₹{dish.price}
            </span>
          </div>

          {/* Micro-verdict box: Left-bordered subtle container */}
          <div className="border-l-3 border-brand-orange pl-3 py-2 text-xs text-[var(--text-secondary)] bg-[var(--surface-2)]/80 rounded-r-xl leading-relaxed border-y border-r border-[var(--border-subtle)]/50">
            “{dish.microVerdict}”
          </div>
        </div>

        {/* Action Footer: Row aligned with flex items-center justify-between pt-2.5 border-t border-[var(--border-subtle)] */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-subtle)] gap-2">
          {/* 1-Tap Check-In with min-h-[48px] */}
          {checkedInToday ? (
            <button
              onClick={handleCheckInClick}
              className="min-h-[48px] px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{latestCheckIn?.reaction === 'SKIP' ? 'Checked in (Skip)' : 'Kha Liya Aaj! 😋'}</span>
            </button>
          ) : (
            <button
              onClick={handleCheckInClick}
              className="min-h-[48px] px-3.5 rounded-xl bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/40 text-brand-orange text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>Yahan Khaya? 📍</span>
            </button>
          )}

          {/* Right: Flavor Tags & Full Split Verdict Button */}
          <div className="flex items-center gap-2">
            {dish.flavorTags.slice(0, 1).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-2)] px-2.5 py-1.5 rounded-xl truncate max-w-[120px] border border-[var(--border-subtle)] hidden xs:inline"
              >
                {tag}
              </span>
            ))}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenSplit) {
                  onOpenSplit(dish);
                } else {
                  onSelectDish(dish);
                }
              }}
              className="min-h-[48px] px-3 rounded-xl flex items-center gap-1.5 text-xs font-black text-brand-orange hover:text-orange-500 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <span>Full Verdict ⚡</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
