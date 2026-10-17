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
      className="group relative rounded-2xl bg-[#0E1116] border border-[#262C36] hover:border-[#3A4352] transition-all duration-300 overflow-hidden cursor-pointer shadow-xl active:scale-[0.99] flex flex-col mb-6"
    >
      {/* High-Impact Hero Food Image Locked to aspect-[16/10] */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#161B22] rounded-t-2xl">
        {/* Shimmer loading state */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#161B22] via-[#202632] to-[#161B22] animate-pulse" />
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116]/80 via-transparent to-transparent pointer-events-none" />

        {/* Badge Overlays: Top-3 Left-3 (God-Tier Pill) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
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
          {isGodTier ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 font-bold text-[11px] tracking-wide border border-emerald-500/30 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{dish.scorePercent}% God-Tier</span>
            </div>
          ) : isWorthIt ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-blue-400 font-bold text-[11px] tracking-wide border border-blue-500/30 shadow-lg">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>{dish.scorePercent}% Worth It</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-red-400 font-bold text-[11px] tracking-wide border border-red-500/30 shadow-lg">
              <span>Skip This</span>
            </div>
          )}
        </div>

        {/* Badge Overlays: Top-3 Right-3 (Bookmark & Share Actions) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            onClick={handleShareClick}
            aria-label="Flex on Story"
            title="Share to Story"
            className="w-9 h-9 rounded-full backdrop-blur-md border bg-black/60 text-white/90 border-[#262C36] hover:bg-black/90 hover:text-white active:scale-95 transition-transform flex items-center justify-center cursor-pointer shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleBookmarkClick}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark to Vault'}
            className={`w-9 h-9 rounded-full backdrop-blur-md border transition-transform flex items-center justify-center cursor-pointer active:scale-95 shadow-sm ${
              saved
                ? 'bg-brand-orange text-white border-brand-orange shadow-glow-orange scale-105'
                : 'bg-black/60 text-white/90 border-[#262C36] hover:bg-black/90 hover:text-white'
            }`}
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Card Body: Standard p-4 space-y-3 */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Dish Title and Price Tag Aligned Horizontally */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-serif font-black text-white tracking-wide leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">
                {dish.name}
              </h3>
              {/* Venue & Micro-Distance */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="font-semibold text-neutral-300 hover:underline truncate">{dish.venueName}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium shrink-0">
                  <Navigation className="w-3 h-3" />
                  {dish.distanceMeters}m ({dish.walkingMinutes}m)
                </span>
              </div>
            </div>

            <span className="text-xs font-extrabold text-white bg-[#161B22] px-2.5 py-1 rounded-lg border border-[#262C36] shrink-0">
              ₹{dish.price}
            </span>
          </div>

          {/* Micro-verdict box: Left-bordered subtle container */}
          <div className="border-l-2 border-[#FF5C1F]/60 pl-3 py-1.5 text-xs text-neutral-300 bg-[#161B22]/40 rounded-r-lg leading-relaxed">
            “{dish.microVerdict}”
          </div>
        </div>

        {/* Action Footer: Row aligned with flex items-center justify-between pt-2 border-t border-neutral-800/40 */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/40 gap-2">
          {/* 1-Tap Check-In */}
          {checkedInToday ? (
            <button
              onClick={handleCheckInClick}
              className="min-h-[40px] px-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{latestCheckIn?.reaction === 'SKIP' ? 'Checked in (Skip)' : 'Checked in Today'}</span>
            </button>
          ) : (
            <button
              onClick={handleCheckInClick}
              className="min-h-[40px] px-3 rounded-xl bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              <span>Check-In</span>
            </button>
          )}

          {/* Right: Flavor Tags & Split Button */}
          <div className="flex items-center gap-2">
            {dish.flavorTags.slice(0, 1).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-400 bg-[#161B22] px-2.5 py-1 rounded-lg truncate max-w-[120px] border border-[#262C36]"
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
              className="min-h-[40px] px-2.5 rounded-xl flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-orange-400 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Split</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
