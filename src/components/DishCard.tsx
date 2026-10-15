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
  onCheckIn?: (dish: Dish) => void;
  onShare?: (dish: Dish, checkIn?: CheckIn) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ 
  dish, 
  onSelectDish,
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
      className="group relative rounded-2xl bg-[#0E1116] border border-neutral-800/50 hover:border-neutral-700/70 transition-all duration-300 overflow-hidden cursor-pointer shadow-xl active:scale-[0.99] flex flex-col mb-10"
    >
      {/* High-Impact Hero Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141720]">
        {/* Shimmer loading state */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#141720] via-[#1A1E29] to-[#141720] animate-pulse" />
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

        {/* Ambient Dark Gradient Vignette for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-black/35 to-black/25 pointer-events-none" />

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 gap-2">
          {/* Left: Veg / Non-Veg Indicator + Category */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-4 h-4 rounded-sm flex items-center justify-center p-0.5 border shrink-0 backdrop-blur-md ${
                dish.isVeg ? 'border-emerald-500/80 bg-emerald-950/70' : 'border-red-500/80 bg-red-950/70'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  dish.isVeg ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              />
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-200 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 truncate">
              {dish.category}
            </span>
          </div>

          {/* Right: Share & Bookmark Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Social Flex / Share Button */}
            <button
              onClick={handleShareClick}
              aria-label="Flex on Story"
              title="Share to Story"
              className="p-1.5 rounded-full backdrop-blur-md border bg-black/50 text-white/80 border-white/15 hover:bg-black/80 hover:text-white active:scale-95 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Quick Save Bookmark Button */}
            <button
              onClick={handleBookmarkClick}
              aria-label={saved ? 'Remove bookmark' : 'Bookmark to Vault'}
              className={`p-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                saved
                  ? 'bg-brand-orange text-white border-brand-orange shadow-glow-orange scale-105'
                  : 'bg-black/50 text-white/80 border-white/15 hover:bg-black/80 hover:text-white'
              }`}
            >
              {saved ? (
                <BookmarkCheck className="w-3.5 h-3.5" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Floating Translucent Pill Tags at Bottom of Image */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Floating Translucent Rating Indicator */}
            {isGodTier ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 font-extrabold text-[11px] tracking-wide border border-emerald-500/40 shadow-lg">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{dish.scorePercent}% God-Tier</span>
              </div>
            ) : isWorthIt ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-blue-400 font-bold text-[11px] tracking-wide border border-blue-500/40 shadow-lg">
                <Flame className="w-3 h-3 text-amber-300" />
                <span>{dish.scorePercent}% Worth It</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-red-400 font-bold text-[11px] tracking-wide border border-red-500/40 shadow-lg">
                <span>Skip This</span>
              </div>
            )}

            <span className="text-[11px] font-black text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shrink-0">
              ₹{dish.price}
            </span>
          </div>

          {/* Checked-in Badge */}
          {checkedInToday && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-500/40 shrink-0">
              <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="hidden xs:inline">Checked In</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body with Generous Padding & Whitespace */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2">
          {/* Bold Dish Title */}
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug group-hover:text-brand-orange transition-colors">
            {dish.name}
          </h3>

          {/* Venue & Micro-Distance */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300 hover:underline truncate">{dish.venueName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium shrink-0">
              <Navigation className="w-3 h-3" />
              {dish.distanceMeters}m ({dish.walkingMinutes}m)
            </span>
          </div>

          {/* 1-Sentence Definitive Micro-Verdict in Spacious Quote Box */}
          <p className="mt-2 text-xs text-neutral-300 bg-[#07090C]/60 p-3 rounded-xl border border-neutral-800/50 leading-relaxed font-normal">
            “{dish.microVerdict}”
          </p>
        </div>

        {/* 1-Tap Check-In & Action Bar */}
        <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-neutral-800/40">
          {/* Interactive Check-in Button */}
          {checkedInToday ? (
            <button
              onClick={handleCheckInClick}
              className="py-1 px-2.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {latestCheckIn?.reaction === 'SKIP' ? 'Checked in (Skip)' : 'Checked in (Loved)'}
              </span>
            </button>
          ) : (
            <button
              onClick={handleCheckInClick}
              className="py-1 px-2.5 rounded-lg bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-brand-orange" />
              <span>Check-In</span>
            </button>
          )}

          {/* Right: Flavor Tags & Split-Card Arrow */}
          <div className="flex items-center gap-2">
            {dish.flavorTags.slice(0, 1).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium text-neutral-400 bg-[#141720] px-2.5 py-0.5 rounded-md truncate max-w-[120px] border border-neutral-800/40"
              >
                {tag}
              </span>
            ))}

            <div className="flex items-center gap-0.5 text-xs font-bold text-brand-orange group-hover:translate-x-0.5 transition-transform pl-1">
              <span>Split</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
