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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[var(--modal-backdrop)] backdrop-blur-md animate-fade-in overflow-hidden">
      <div 
        className="w-full max-w-lg max-h-[92dvh] bg-[var(--surface-1)] text-[var(--text-primary)] border-t sm:border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="absolute top-2 inset-x-0 z-30 flex justify-center pointer-events-none sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-white/40 backdrop-blur-md shadow-xs" />
        </div>

        {/* Top Floating Action Bar with 44px+ hitboxes */}
        <div className="absolute top-3.5 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 backdrop-blur-md shadow-md ${
                dish.isVeg ? 'border-emerald-500/80 bg-emerald-950/80' : 'border-red-500/80 bg-red-950/80'
              }`}
              title={dish.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  dish.isVeg ? 'bg-emerald-400' : 'bg-red-400'
                }`}
              />
            </span>
            <span className="text-[10px] font-black tracking-widest uppercase bg-black/75 text-white backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-sm">
              {dish.category}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleShareClick}
              aria-label="Flex on Instagram Story"
              title="Share Story"
              className="w-11 h-11 rounded-full backdrop-blur-md border bg-black/65 text-white/95 border-white/25 hover:bg-black/90 hover:text-white active:scale-90 transition-all flex items-center justify-center shadow-md cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleBookmarkClick}
              aria-label={saved ? 'Remove bookmark' : 'Bookmark to Vault'}
              title="Save to Vault"
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
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-black/75 hover:bg-black/90 text-white/95 hover:text-white border border-white/25 backdrop-blur-md transition-all flex items-center justify-center shadow-md active:scale-90 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Food Photography Header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-2)] shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface-3)] to-[var(--surface-2)] animate-pulse" />
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
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-1)] via-black/40 to-transparent pointer-events-none" />

          {/* Bottom Title & Rating Overlay */}
          <div className="absolute bottom-3 inset-x-4 z-10 space-y-1">
            <div className="flex items-center gap-2">
              {isGodTier ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-emerald-400 font-bold text-[11px] tracking-wide border border-emerald-500/40 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{dish.scorePercent}% God-Tier Verdict</span>
                </span>
              ) : isWorthIt ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-blue-400 font-bold text-[11px] tracking-wide border border-blue-500/40 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>{dish.scorePercent}% Worth-It</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-red-400 font-bold text-[11px] tracking-wide border border-red-500/40 shadow-sm">
                  <span>Skip Item</span>
                </span>
              )}

              <span className="text-xs font-black text-white bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                ₹{dish.price}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-black text-white tracking-wide leading-tight drop-shadow-md">
              {dish.name}
            </h1>
          </div>
        </div>

        {/* Venue Header Bar */}
        <div className="px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="min-w-0">
            <div 
              onClick={() => venue && onOpenSplitVenue && onOpenSplitVenue(venue)}
              className="font-bold text-[var(--text-primary)] hover:text-brand-orange truncate cursor-pointer flex items-center gap-1.5"
            >
              <span>{dish.venueName}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            </div>
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
              <span>{dish.venueArea}</span>
              <span>•</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
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
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors shrink-0"
            >
              <Navigation className="w-3 h-3" />
              <span>Map</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        {/* Segmented View Subtabs: Tasting Notes / Menu Trap Comparison / Logistics */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-1)] shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('tasting')}
            className={`pb-2.5 font-extrabold tracking-wide transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tasting'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span>Tasting Notes 👅</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`pb-2.5 font-extrabold tracking-wide transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'compare'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Trap vs Hero 🥊</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`pb-2.5 font-extrabold tracking-wide transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logistics'
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>Spot & Deals 📍</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 overscroll-contain">
          {activeTab === 'tasting' && (
            <div className="space-y-4 animate-fade-in">
              {/* Micro-verdict Quotation */}
              <div className="p-4 rounded-2xl bg-[var(--surface-2)] border-l-4 border-brand-orange border-y border-r border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs sm:text-sm font-medium leading-relaxed italic">
                “{dish.microVerdict}”
              </div>

              {/* Flavor Profile Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">
                  Flavor Profile & Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dish.flavorTags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-emerald-500 text-xs font-bold">
                    {dish.isVeg ? '🟢 100% Shakahari / Veg' : '🔴 Non-Veg'}
                  </span>
                </div>
              </div>

              {/* In-Depth Sensory Review */}
              <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-brand-orange uppercase tracking-wider">
                  <Utensils className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Asli Foodie Tasting Review</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans font-normal">
                  {dish.detailedReview}
                </p>
              </div>

              {/* Insider Diner Tip */}
              {dish.insiderTip && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                  <span className="font-extrabold uppercase tracking-wide flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                    <Info className="w-3.5 h-3.5" />
                    <span>Foodie Insider Tip</span>
                  </span>
                  <p className="leading-relaxed font-medium">{dish.insiderTip}</p>
                </div>
              )}

              {/* Community Vouch / Check-in Proof */}
              <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">Local Foodies Ne Vouch Kiya Hai</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{dish.venueArea} ke foodies dwara verified</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-emerald-500 font-black text-base">{dish.scorePercent}%</div>
                  <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Approval</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xs text-[var(--text-muted)] font-medium">
                Paisa vasool experience ke liye: Har spot ki best dish mangwao, aur menu traps se bacho.
              </div>

              {/* Must-Order Hero Card */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>🟢 Yeh Mangwao (Hero Dish)</span>
                </div>
                <div className="text-sm font-black text-[var(--text-primary)]">{dish.name} • ₹{dish.price}</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                  {dish.microVerdict}
                </p>
              </div>

              {/* Skip Trap Card */}
              {skipDish ? (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>🔴 Yeh Mat Mangwana (Menu Trap)</span>
                  </div>
                  <div className="text-sm font-black text-[var(--text-primary)]">{skipDish.name} • ₹{skipDish.price}</div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    {skipDish.reason}
                  </p>
                  <div className="text-[11px] text-[var(--text-muted)] pt-1.5 border-t border-rose-500/20">
                    <strong className="text-rose-600 dark:text-rose-300">Iske Badle:</strong> {skipDish.alternativeRecommendation}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                  Is spot par koi trap dish report nahi hui hai. Hero dish bina tension mangwao!
                </div>
              )}

              {venue && onOpenSplitVenue && (
                <button
                  onClick={() => onOpenSplitVenue(venue)}
                  className="w-full min-h-[48px] py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  <span>{venue.name} Ka Full Split-Card Dekho</span>
                  <ChevronRight className="w-4 h-4 text-brand-orange" />
                </button>
              )}
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="space-y-4 animate-fade-in">
              {/* Venue Card Details */}
              <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-[var(--text-primary)]">{dish.venueName}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{venue?.fullAddress || dish.venueArea}</p>
                  </div>
                </div>

                {venue?.vibeTags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {venue.vibeTags.map((vibe, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-secondary)] px-2.5 py-1 rounded-md">
                        {vibe}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2.5 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-secondary)] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    <span>~{dish.walkingMinutes} min walk</span>
                  </span>
                  <span>•</span>
                  <span>{dish.distanceMeters} meters away</span>
                </div>
              </div>

              {/* Counter Perk Voucher if Available */}
              {venue?.counterPerk && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--surface-2)] to-[var(--surface-3)] border border-amber-500/40 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    <Ticket className="w-3.5 h-3.5 text-amber-500" />
                    <span>Secret Counter Deal Available 🎁</span>
                  </div>
                  <div className="text-xs font-black text-[var(--text-primary)]">{venue.counterPerk.title}</div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {venue.counterPerk.description}
                  </p>

                  {onOpenVoucher && (
                    <button
                      onClick={() => onOpenVoucher(venue)}
                      className="w-full mt-1 min-h-[48px] px-3.5 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-glow-orange flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Cashier Ko Dikhake Deal Lo 🎟️</span>
                    </button>
                  )}
                </div>
              )}

              {/* Ordering / Reservation Transparency */}
              <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Foodie Note:</strong> Dine-in karo ya counter par order karo. Free perk ke liye cashier ko apna Palate screen dikhao!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action Dock with 48px touch targets */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-[var(--surface-1)]/95 backdrop-blur-xl border-t border-[var(--border-subtle)] flex items-center gap-2.5 z-20">
          {/* Check-In Button */}
          {checkedInToday ? (
            <button
              onClick={handleCheckInClick}
              className="flex-1 min-h-[48px] px-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Kha Liya Aaj! 😋 (Checked-In)</span>
            </button>
          ) : (
            <button
              onClick={handleCheckInClick}
              className="flex-1 min-h-[48px] px-4 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-glow-orange transition-all active:scale-95 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>Aaj Yahi Khaunga! 🤤 (Check-In)</span>
            </button>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className={`min-h-[48px] px-5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-xs ${
              saved
                ? 'bg-brand-orange text-white border-brand-orange shadow-glow-orange'
                : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-subtle)]'
            }`}
          >
            {saved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-white" />
                <span>Saved ✓</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Karlo ⭐</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
