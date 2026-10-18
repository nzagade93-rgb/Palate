import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  Flame,
  Ticket,
  Clock,
  HeartHandshake,
  Printer,
  Share2
} from 'lucide-react';
import type { Venue, Dish, CheckIn } from '../types';
import { DISHES } from '../data/mockData';
import { useVault } from '../hooks/useVault';
import { useCheckIns } from '../hooks/useCheckIns';

interface VerdictSplitCardProps {
  venue: Venue;
  isOpen: boolean;
  onClose: () => void;
  onOpenVoucher: (venue: Venue) => void;
  onOpenFlyer?: (venue: Venue) => void;
  onCheckIn?: (dish: Dish) => void;
  onShare?: (dish: Dish, checkIn?: CheckIn) => void;
}

export const VerdictSplitCard: React.FC<VerdictSplitCardProps> = ({
  venue,
  isOpen,
  onClose,
  onOpenVoucher,
  onOpenFlyer,
  onCheckIn,
  onShare,
}) => {
  const { isDishSaved, saveDishToVault } = useVault();
  const { isCheckedInToday, getLatestCheckIn } = useCheckIns();
  const [activeNoteDishId, setActiveNoteDishId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  if (!isOpen) return null;

  // Resolve full dish objects for this venue's top dishes
  const topDishes = venue.topDishIds
    .map((id) => DISHES.find((d) => d.id === id))
    .filter((d): d is Dish => Boolean(d));

  const handleSaveWithNote = (dish: Dish) => {
    saveDishToVault(dish, 'SAVED', noteText);
    setActiveNoteDishId(null);
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[var(--modal-backdrop)] backdrop-blur-md animate-fade-in overflow-hidden">
      <div 
        className="w-full max-w-[430px] max-h-[90dvh] sm:max-h-[88dvh] bg-[var(--surface-1)] border-t sm:border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-[var(--surface-1)] border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-orange uppercase tracking-luxury mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>The Verdict Split-Card</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[var(--text-primary)] tracking-wide leading-snug">{venue.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  {venue.area}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-500 font-medium">
                  <Navigation className="w-3 h-3" />
                  {venue.distanceMeters}m ({venue.walkingMinutes} min walk)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
              aria-label="Close card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Vibe Tags & Directions */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
            {venue.vibeTags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)] px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full hover:bg-emerald-500/25 transition-colors ml-auto cursor-pointer"
            >
              <Navigation className="w-3 h-3" />
              <span>Directions</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Scrollable Body with Increased Whitespace */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1 overscroll-contain">
          
          {/* Action Banner: Secret Counter Perk */}
          <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-2)] p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-luxury">
                  <Ticket className="w-3.5 h-3.5 text-amber-500" />
                  <span>Exclusive Counter Perk</span>
                </div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">{venue.counterPerk.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {venue.counterPerk.description}
                </p>
              </div>
            </div>
            
            <div className="mt-3.5 flex items-center gap-2">
              <button
                onClick={() => onOpenVoucher(venue)}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-white font-bold text-xs tracking-wide shadow-glow-orange flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Show Voucher to Cashier</span>
              </button>

              {onOpenFlyer && (
                <button
                  onClick={() => onOpenFlyer(venue)}
                  className="min-h-[44px] min-w-[44px] px-3.5 rounded-xl bg-[var(--surface-1)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  title="Print Merchant Counter Flyer"
                >
                  <Printer className="w-4 h-4 text-brand-orange" />
                  <span className="text-xs">Flyer</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 1: The Must-Orders */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-luxury flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Section 1: The Must-Orders (Non-Negotiable)</span>
              </h3>
            </div>

            <div className="space-y-4">
              {topDishes.map((dish) => {
                const { saved, item } = isDishSaved(dish.id);
                const isWritingNote = activeNoteDishId === dish.id;
                const checkedInToday = isCheckedInToday(dish.id);
                const latestCheckIn = getLatestCheckIn(dish.id);

                return (
                  <div
                    key={dish.id}
                    className="p-4 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-subtle)] hover:border-emerald-500/40 transition-all space-y-3 relative shadow-md"
                  >
                    <div className="flex gap-3.5">
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[var(--border-subtle)]"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-black text-[var(--text-primary)] leading-snug truncate">
                            {dish.name}
                          </h4>
                          <span className="text-xs font-black text-[var(--text-primary)] bg-[var(--surface-2)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)] shrink-0">
                            ₹{dish.price}
                          </span>
                        </div>

                        {/* Score Badge */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                            <Sparkles className="w-2.5 h-2.5" />
                            {dish.scorePercent}% {dish.verdict === 'GOD_TIER' ? 'God-Tier' : 'Worth It'}
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)]">{dish.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Micro Verdict Inset */}
                    <p className="text-xs text-[var(--text-secondary)] bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--border-subtle)] leading-relaxed font-normal">
                      “{dish.microVerdict}”
                    </p>

                    {/* Flavor Tags & Insider Tip */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {dish.flavorTags.map((tag, i) => (
                        <span key={i} className="text-[10px] bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)] px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-amber-900 dark:text-amber-200 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span><strong>Insider Tip:</strong> {dish.insiderTip}</span>
                    </div>

                    {/* Action Row: Check-in, Share & Vault */}
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] gap-2">
                      <div className="flex items-center gap-2">
                        {checkedInToday ? (
                          <button
                            onClick={() => onCheckIn?.(dish)}
                            className="min-h-[44px] px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                          >
                            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>Checked In</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onCheckIn?.(dish)}
                            className="min-h-[44px] px-3.5 rounded-xl bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Check-In</span>
                          </button>
                        )}

                        {onShare && (
                          <button
                            onClick={() => onShare(dish, latestCheckIn)}
                            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                            title="Share to Story"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (saved) {
                              saveDishToVault(dish, 'LOVED');
                            } else {
                              saveDishToVault(dish, 'SAVED');
                            }
                          }}
                          className={`min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 rounded-xl active:scale-95 transition-transform cursor-pointer ${
                            saved
                              ? 'bg-brand-orange text-white'
                              : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                          }`}
                        >
                          {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                          <span>{saved ? 'Saved' : 'Save'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveNoteDishId(isWritingNote ? null : dish.id);
                            setNoteText(item?.userNotes || '');
                          }}
                          className="min-h-[44px] px-2.5 flex items-center justify-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-4 cursor-pointer"
                        >
                          {item?.userNotes ? 'Note' : '+ Note'}
                        </button>
                      </div>
                    </div>

                    {/* Inline Note Box */}
                    {isWritingNote && (
                      <div className="pt-2 space-y-2 animate-fade-in">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="E.g., Ask for less salt, or extra kadak pav..."
                          className="w-full text-xs p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-orange"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveNoteDishId(null)}
                            className="min-h-[40px] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveWithNote(dish)}
                            className="min-h-[40px] text-xs bg-brand-orange hover:bg-orange-600 text-white font-bold px-3.5 py-1.5 rounded-xl active:scale-95 transition-transform cursor-pointer"
                          >
                            Save Note to Vault
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: The Skip List */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <h3 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-luxury flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Section 2: The Skip List (Do Not Order)</span>
              </h3>
            </div>

            <div className="space-y-3">
              {venue.skipDishes.map((skip) => (
                <div
                  key={skip.id}
                  className="p-4 rounded-2xl bg-[var(--surface-1)] border border-rose-500/25 hover:border-rose-500/40 transition-all space-y-2.5 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-red-500/15 text-red-600 dark:text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full">
                          AVOID • SKIP
                        </span>
                        <h4 className="text-sm font-bold text-red-600 dark:text-red-300">{skip.name}</h4>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] mt-1 block">Price: ₹{skip.price}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    <strong className="text-red-600 dark:text-red-400 font-semibold">Why to Avoid:</strong> {skip.reason}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
                    <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
                    <span><strong>Order Instead:</strong> {skip.alternativeRecommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer sticky bar */}
        <div className="p-3.5 sm:p-4 bg-[var(--surface-1)] border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] shrink-0">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            Verified by Palate Field Scouts • 2026
          </span>
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold transition-all text-xs active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
