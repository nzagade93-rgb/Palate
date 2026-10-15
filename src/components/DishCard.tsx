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
      className="group relative rounded-2xl bg-[#14161E] border border-[#242838] hover:border-[#3B425C] transition-all duration-200 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.99] flex flex-col"
    >
      {/* High-Impact Hero Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1B1E28]">
        {/* Shimmer loading state */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B1E28] via-[#242936] to-[#1B1E28] animate-pulse" />
        )}

        <img
          src={dish.imageUrl}
          alt={dish.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Ambient Dark Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14161E] via-black/40 to-black/20" />

        {/* Top Badges Row */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 gap-1.5">
          {/* Left: Veg / Non-Veg Indicator + Category */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-4 h-4 rounded-sm flex items-center justify-center p-0.5 border shrink-0 ${
                dish.isVeg ? 'border-emerald-500 bg-emerald-950/80' : 'border-red-500 bg-red-950/80'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dish.isVeg ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              />
            </span>
            <span className="text-[10px] font-semibold text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 truncate">
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
              className="p-1.5 rounded-full backdrop-blur-md border bg-black/60 text-white/80 border-white/20 hover:bg-black/90 hover:text-white active:scale-95 transition-all cursor-pointer"
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
                  : 'bg-black/60 text-white/80 border-white/20 hover:bg-black/90 hover:text-white'
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

        {/* Score Pill Overlay & Checked-In Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {isGodTier ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white font-extrabold text-[11px] shadow-glow-green border border-emerald-300/40 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-yellow-200" />
                <span>{dish.scorePercent}% God-Tier</span>
              </div>
            ) : isWorthIt ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white font-bold text-[11px] border border-blue-400/40 backdrop-blur-md">
                <Flame className="w-3 h-3 text-amber-300" />
                <span>{dish.scorePercent}% Worth It</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white font-bold text-[11px] border border-red-400/40 backdrop-blur-md">
                <span>Skip This</span>
              </div>
            )}

            <span className="text-[11px] font-black text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 shrink-0">
              ₹{dish.price}
            </span>
          </div>

          {/* Checked in Today Stamp */}
          {checkedInToday && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-black text-[10px] font-black border border-amber-300 backdrop-blur-md shadow-glow-orange shrink-0 animate-pulse">
              <Flame className="w-3 h-3 fill-black text-black" />
              <span>Checked in Today</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Bold Dish Title */}
          <h3 className="text-[15px] sm:text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-brand-orange transition-colors">
            {dish.name}
          </h3>

          {/* Venue & Micro-Distance */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
            <span className="font-semibold text-gray-300 hover:underline truncate">{dish.venueName}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-medium shrink-0">
              <Navigation className="w-3 h-3" />
              {dish.distanceMeters}m ({dish.walkingMinutes}m)
            </span>
          </div>

          {/* 1-Sentence Definitive Micro-Verdict */}
          <p className="mt-2 text-xs text-gray-300 bg-[#1A1D27] p-2.5 rounded-xl border border-white/5 leading-relaxed font-normal">
            “{dish.microVerdict}”
          </p>
        </div>

        {/* 1-Tap Check-In & Action Bar */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
          {/* Interactive Check-in Button */}
          {checkedInToday ? (
            <button
              onClick={handleCheckInClick}
              className="py-1 px-2.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {latestCheckIn?.reaction === 'SKIP' ? 'Checked in (Skip)' : 'Checked in (Loved)'}
              </span>
            </button>
          ) : (
            <button
              onClick={handleCheckInClick}
              className="py-1 px-2.5 rounded-lg bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/40 text-brand-orange text-[11px] font-extrabold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-brand-orange" />
              <span>Check-In</span>
            </button>
          )}

          {/* Right: Flavor Tags & Split-Card Arrow */}
          <div className="flex items-center gap-1.5">
            {dish.flavorTags.slice(0, 1).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium text-gray-400 bg-[#1E212D] px-2 py-0.5 rounded-md truncate max-w-[110px]"
              >
                {tag}
              </span>
            ))}

            <div className="flex items-center gap-0.5 text-xs font-bold text-brand-orange group-hover:translate-x-0.5 transition-transform pl-1">
              <span className="hidden sm:inline">Split</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
