import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Flame, 
  Ticket, 
  Share2, 
  Clock, 
  Info, 
  ChevronRight,
  ShieldCheck,
  Utensils
} from 'lucide-react';
import type { Dish, Venue, CheckIn } from '../types';
import { VENUES } from '../data/mockData';
import { useVault } from '../hooks/useVault';
import { useCheckIns } from '../hooks/useCheckIns';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSplitVenue?: (venue: Venue) => void;
  onOpenVoucher?: (venue: Venue) => void;
  onCheckIn?: (dish: Dish) => void;
  onShare?: (dish: Dish, checkIn?: CheckIn) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  isOpen,
  onClose,
  onOpenSplitVenue,
  onOpenVoucher,
  onCheckIn,
  onShare,
}) => {
  const { isDishSaved, saveDishToVault } = useVault();
  const { isCheckedInToday, getLatestCheckIn } = useCheckIns();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasting' | 'compare' | 'logistics'>('tasting');

  if (!isOpen || !dish) return null;

  const venue = VENUES[dish.venueId] || null;
  const { saved } = isDishSaved(dish.id);
  const checkedInToday = isCheckedInToday(dish.id);
  const latestCheckIn = getLatestCheckIn(dish.id);

  const isGodTier = dish.verdict === 'GOD_TIER';
  const isWorthIt = dish.verdict === 'WORTH_IT';
  const skipDish = venue?.skipDishes?.[0] || null;

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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-hidden">
      <div 
        className="w-full max-w-lg max-h-[92dvh] bg-[#0E1116] border-t sm:border border-[#262C36] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Action Bar */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span
              className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 backdrop-blur-md shadow-md ${
                dish.isVeg ? 'border-emerald-500/80 bg-emerald-950/80' : 'border-red-500/80 bg-red-950/80'
              }`}
              title={dish.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dish.isVeg ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              />
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase bg-black/60 text-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
              {dish.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleShareClick}
              aria-label="Flex on Instagram Story"
              title="Share Story"
              className="w-9 h-9 rounded-full backdrop-blur-md border bg-black/60 text-white/90 border-[#262C36] hover:bg-black/90 hover:text-white active:scale-95 transition-transform flex items-center justify-center shadow-md cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleBookmarkClick}
              aria-label={saved ? 'Remove bookmark' : 'Bookmark to Vault'}
              title="Save to Vault"
              className={`w-9 h-9 rounded-full backdrop-blur-md border transition-transform flex items-center justify-center cursor-pointer active:scale-95 shadow-md ${
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
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 text-white/90 hover:text-white border border-[#262C36] backdrop-blur-md transition-colors flex items-center justify-center shadow-md cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Food Photography Header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#161B22] shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#161B22] via-[#202632] to-[#161B22] animate-pulse" />
          )}

          <img
            src={dish.imageUrl}
            alt={dish.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Editorial Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-[#0E1116]/40 to-transparent pointer-events-none" />

          {/* Bottom Title & Rating Overlay */}
          <div className="absolute bottom-3 inset-x-4 z-10 space-y-1">
            <div className="flex items-center gap-2">
              {isGodTier ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-400 font-bold text-[11px] tracking-wide border border-emerald-500/40 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{dish.scorePercent}% God-Tier Verdict</span>
                </span>
              ) : isWorthIt ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 backdrop-blur-md text-blue-400 font-bold text-[11px] tracking-wide border border-blue-500/40 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>{dish.scorePercent}% Worth-It</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 backdrop-blur-md text-red-400 font-bold text-[11px] tracking-wide border border-red-500/40 shadow-sm">
                  <span>Skip Item</span>
                </span>
              )}

              <span className="text-xs font-black text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                ₹{dish.price}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-black text-white tracking-wide leading-tight drop-shadow-md">
              {dish.name}
            </h1>
          </div>
        </div>

        {/* Venue Header Bar */}
        <div className="px-4 py-2.5 bg-[#161B22]/80 border-b border-[#262C36] flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="min-w-0">
            <div 
              onClick={() => venue && onOpenSplitVenue && onOpenSplitVenue(venue)}
              className="font-bold text-white hover:text-brand-orange truncate cursor-pointer flex items-center gap-1.5"
            >
              <span>{dish.venueName}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{dish.venueArea}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                {dish.distanceMeters}m ({dish.walkingMinutes}m walk)
              </span>
            </div>
          </div>

          {venue?.mapsUrl && (
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors shrink-0"
            >
              <Navigation className="w-3 h-3" />
              <span>Map</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        {/* Segmented View Subtabs: Tasting Notes / Menu Trap Comparison / Logistics */}
        <div className="px-4 pt-2.5 pb-1 flex items-center gap-2 border-b border-[#262C36] bg-[#0E1116] shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('tasting')}
            className={`pb-2 font-bold tracking-wide transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'tasting'
                ? 'border-brand-orange text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Tasting Verdict</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`pb-2 font-bold tracking-wide transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'border-brand-orange text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Menu Trap vs Hero</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`pb-2 font-bold tracking-wide transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'logistics'
                ? 'border-brand-orange text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Venue & Perk</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 overscroll-contain">
          {activeTab === 'tasting' && (
            <div className="space-y-4 animate-fade-in">
              {/* Micro-verdict Quotation */}
              <div className="p-3.5 rounded-2xl bg-[#161B22] border-l-4 border-brand-orange border-y border-r border-[#262C36] text-neutral-200 text-xs sm:text-sm font-medium leading-relaxed italic">
                “{dish.microVerdict}”
              </div>

              {/* Flavor Profile Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Flavor Characteristics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dish.flavorTags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#262C36] text-slate-300 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-lg bg-[#161B22] border border-[#262C36] text-emerald-400 text-xs font-semibold">
                    {dish.isVeg ? '🟢 100% Vegetarian' : '🔴 Non-Vegetarian'}
                  </span>
                </div>
              </div>

              {/* In-Depth Sensory Review */}
              <div className="p-4 rounded-2xl bg-[#12161E] border border-[#262C36] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-brand-orange uppercase tracking-luxury">
                  <Utensils className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Verified Tasting Review</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {dish.detailedReview}
                </p>
              </div>

              {/* Insider Diner Tip */}
              {dish.insiderTip && (
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs space-y-1">
                  <span className="font-extrabold uppercase tracking-wide flex items-center gap-1 text-[10px] text-amber-400">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>Local Insider Tip</span>
                  </span>
                  <p className="leading-relaxed text-amber-100/90">{dish.insiderTip}</p>
                </div>
              )}

              {/* Community Vouch / Check-in Proof */}
              <div className="p-3 rounded-2xl bg-[#161B22]/60 border border-[#262C36] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Community Vouched</div>
                    <div className="text-[10px] text-slate-400">Tested by verified diners in {dish.venueArea}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-emerald-400 font-extrabold text-sm">{dish.scorePercent}%</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wide">Approval</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xs text-slate-400">
                To guarantee zero dining regret, Palate tests every spot's top dish against its most common menu trap.
              </div>

              {/* Must-Order Hero Card */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-600/40 space-y-2">
                <div className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>🟢 The Must-Order (Order This)</span>
                </div>
                <div className="text-sm font-extrabold text-white">{dish.name} • ₹{dish.price}</div>
                <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">
                  {dish.microVerdict}
                </p>
              </div>

              {/* Skip Trap Card */}
              {skipDish ? (
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-600/40 space-y-2">
                  <div className="inline-flex items-center gap-1 text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-900/60 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>🔴 The Menu Trap (Skip This)</span>
                  </div>
                  <div className="text-sm font-extrabold text-white">{skipDish.name} • ₹{skipDish.price}</div>
                  <p className="text-xs text-rose-200/90 leading-relaxed font-sans">
                    {skipDish.reason}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-rose-800/40">
                    <strong className="text-rose-300">Alternative:</strong> {skipDish.alternativeRecommendation}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#161B22] border border-[#262C36] text-xs text-slate-400">
                  No documented trap orders for this venue yet. Stick to the hero dish!
                </div>
              )}

              {venue && onOpenSplitVenue && (
                <button
                  onClick={() => onOpenSplitVenue(venue)}
                  className="w-full py-2.5 rounded-xl bg-[#161B22] hover:bg-[#1E242E] text-slate-300 hover:text-white border border-[#262C36] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Full {venue.name} Split-Card</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="space-y-4 animate-fade-in">
              {/* Venue Card Details */}
              <div className="p-4 rounded-2xl bg-[#161B22] border border-[#262C36] space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-white">{dish.venueName}</h3>
                    <p className="text-xs text-slate-400">{venue?.fullAddress || dish.venueArea}</p>
                  </div>
                </div>

                {venue?.vibeTags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {venue.vibeTags.map((vibe, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-[#0E1116] border border-[#262C36] text-slate-300 px-2 py-0.5 rounded-md">
                        {vibe}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2 border-t border-[#262C36] text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    <span>~{dish.walkingMinutes} min walk</span>
                  </span>
                  <span>•</span>
                  <span>{dish.distanceMeters} meters away</span>
                </div>
              </div>

              {/* Counter Perk Voucher if Available */}
              {venue?.counterPerk && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#161B22] to-[#1E242E] border border-amber-500/40 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-luxury">
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>Diner Counter Perk Available</span>
                  </div>
                  <div className="text-xs font-bold text-white">{venue.counterPerk.title}</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {venue.counterPerk.description}
                  </p>

                  {onOpenVoucher && (
                    <button
                      onClick={() => onOpenVoucher(venue)}
                      className="w-full mt-1 min-h-[36px] px-3 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-white font-bold text-xs shadow-glow-orange flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Show Perk Voucher to Cashier</span>
                    </button>
                  )}
                </div>
              )}

              {/* Ordering / Reservation Transparency */}
              <div className="p-3 rounded-xl bg-[#0E1116] border border-[#262C36] text-xs text-slate-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Ordering Note:</strong> Order directly at the counter or dine-in. Show your Palate screen for the verified local diner perk.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Dock */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-[#0E1116]/95 backdrop-blur-xl border-t border-[#262C36] flex items-center gap-2 z-20">
          {/* Check-In Button */}
          {checkedInToday ? (
            <button
              onClick={handleCheckInClick}
              className="flex-1 min-h-[46px] px-4 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Checked-In Today</span>
            </button>
          ) : (
            <button
              onClick={handleCheckInClick}
              className="flex-1 min-h-[46px] px-4 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-glow-orange transition-transform active:scale-95 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>I'm Eating This Today</span>
            </button>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className={`min-h-[46px] px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              saved
                ? 'bg-brand-orange text-white border-brand-orange shadow-glow-orange'
                : 'bg-[#161B22] text-slate-300 hover:text-white border-[#262C36]'
            }`}
          >
            {saved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
