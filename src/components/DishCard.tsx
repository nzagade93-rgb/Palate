import React, { useState } from 'react';
import { 
  Sparkles, 
  Navigation, 
  Bookmark, 
  BookmarkCheck, 
  Flame, 
  ChevronRight
} from 'lucide-react';
import type { Dish } from '../types';
import { useVault } from '../hooks/useVault';

interface DishCardProps {
  dish: Dish;
  onSelectDish: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onSelectDish }) => {
  const { isDishSaved, saveDishToVault } = useVault();
  const { saved } = isDishSaved(dish.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isGodTier = dish.verdict === 'GOD_TIER';
  const isWorthIt = dish.verdict === 'WORTH_IT';

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveDishToVault(dish, saved ? 'LOVED' : 'SAVED');
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
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Veg / Non-Veg Indicator + Category */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-4 h-4 rounded-sm flex items-center justify-center p-0.5 border ${
                dish.isVeg ? 'border-emerald-500 bg-emerald-950/80' : 'border-red-500 bg-red-950/80'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dish.isVeg ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              />
            </span>
            <span className="text-[11px] font-semibold text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
              {dish.category}
            </span>
          </div>

          {/* Quick Save Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark to Vault'}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              saved
                ? 'bg-brand-orange text-white border-brand-orange shadow-glow-orange scale-105'
                : 'bg-black/60 text-white/80 border-white/20 hover:bg-black/90 hover:text-white'
            }`}
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Score Pill Overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
          {isGodTier ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white font-extrabold text-xs shadow-glow-green border border-emerald-300/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>{dish.scorePercent}% God-Tier</span>
            </div>
          ) : isWorthIt ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 text-white font-bold text-xs border border-blue-400/40 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>{dish.scorePercent}% Worth It</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-bold text-xs border border-red-400/40 backdrop-blur-md">
              <span>Skip This</span>
            </div>
          )}

          <span className="text-xs font-black text-white bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            ₹{dish.price}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Bold Dish Title */}
          <h3 className="text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-brand-orange transition-colors">
            {dish.name}
          </h3>

          {/* Venue & Micro-Distance */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
            <span className="font-semibold text-gray-300 hover:underline">{dish.venueName}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-medium">
              <Navigation className="w-3 h-3" />
              {dish.distanceMeters}m ({dish.walkingMinutes} min)
            </span>
          </div>

          {/* 1-Sentence Definitive Micro-Verdict */}
          <p className="mt-2.5 text-xs text-gray-300 bg-[#1A1D27] p-2.5 rounded-xl border border-white/5 leading-relaxed font-normal">
            “{dish.microVerdict}”
          </p>
        </div>

        {/* Footer: Flavor tags & Detail CTA */}
        <div className="pt-1 flex items-center justify-between border-t border-white/5">
          <div className="flex flex-wrap gap-1">
            {dish.flavorTags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium text-gray-400 bg-[#1E212D] px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-brand-orange group-hover:translate-x-0.5 transition-transform">
            <span>Split-Card</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </article>
  );
};
