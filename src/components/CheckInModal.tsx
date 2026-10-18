import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Flame, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  Share2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Dish, CheckInReaction, CheckIn } from '../types';
import { useCheckIns } from '../hooks/useCheckIns';
import { useVault } from '../hooks/useVault';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  onOpenShare?: (dish: Dish, checkIn?: CheckIn) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  dish,
  onOpenShare,
}) => {
  const { addCheckIn, getLatestCheckIn } = useCheckIns();
  const { saveDishToVault } = useVault();
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<CheckInReaction>('GOD_TIER');

  if (!isOpen || !dish) return null;

  const previousCheckIn = getLatestCheckIn(dish.id);

  const handleSubmit = (reaction: CheckInReaction) => {
    setSelectedReaction(reaction);
    
    // Save check-in
    addCheckIn(dish, reaction, note.trim() || undefined);

    // Also mirror to personal vault automatically
    saveDishToVault(dish, reaction === 'GOD_TIER' ? 'LOVED' : 'AVOID', note.trim() || undefined);

    setIsSubmitted(true);

    if (reaction === 'GOD_TIER') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF5C1F', '#10B981', '#F59E0B', '#D4AF37'],
      });
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[var(--modal-backdrop)] backdrop-blur-md animate-fade-in overflow-hidden font-sans">
      <div 
        className="w-full max-w-[430px] bg-[var(--surface-1)] border-t sm:border border-[var(--border-subtle)] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 animate-slide-up relative text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header: Location & Dish Info */}
            <div className="space-y-1 pr-8">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-orange uppercase tracking-luxury bg-brand-orange/10 border border-brand-orange/30 px-2.5 py-0.5 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-brand-orange" />
                <span>1-Tap Live Check-In</span>
              </div>
              <h2 className="text-xl font-serif font-black text-[var(--text-primary)] tracking-tight leading-snug">
                I'm Eating Here Now
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span className="text-[var(--text-secondary)] font-semibold">{dish.venueName}</span>
                <span>•</span>
                <span>{dish.venueArea}</span>
              </div>
            </div>

            {/* Dish Card Snippet */}
            <div className="p-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-subtle)] flex items-center gap-3">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[var(--border-subtle)]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-[var(--text-primary)] truncate">{dish.name}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs">
                  <span className="font-bold text-[var(--text-primary)]">₹{dish.price}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {dish.scorePercent}% God-Tier
                  </span>
                </div>
              </div>
            </div>

            {/* Prompt Question */}
            <div className="text-center pt-1">
              <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                Did you order this today? What's your verdict?
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Tap once to log your taste memory & unlock your social flex card
              </p>
            </div>

            {/* Micro-Reaction Decision Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* 🟢 Loved it */}
              <button
                type="button"
                onClick={() => handleSubmit('GOD_TIER')}
                className="group p-4 min-h-[96px] rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/15 border-2 border-emerald-500/50 hover:border-emerald-500 shadow-glow-green text-center space-y-1.5 transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <ThumbsUp className="w-5 h-5 fill-emerald-500/40" />
                </div>
                <div className="font-black text-sm text-[var(--text-primary)]">God-Tier</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-300 font-medium">Loved it • Pure Truth</div>
              </button>

              {/* 🔴 Skip it */}
              <button
                type="button"
                onClick={() => handleSubmit('SKIP')}
                className="group p-4 min-h-[96px] rounded-2xl bg-gradient-to-b from-red-500/20 to-red-500/10 hover:from-red-500/30 hover:to-red-500/15 border-2 border-red-500/50 hover:border-red-500 shadow-glow-red text-center space-y-1.5 transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                  <ThumbsDown className="w-5 h-5 fill-red-500/40" />
                </div>
                <div className="font-black text-sm text-[var(--text-primary)]">Overhyped</div>
                <div className="text-[10px] text-red-600 dark:text-red-300 font-medium">Skip it • Would not reorder</div>
              </button>
            </div>

            {/* Optional Personal Note */}
            <div className="pt-1">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add optional flex note (e.g. Extra kadak pav is insane)..."
                className="w-full text-xs font-medium px-3.5 py-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand-orange transition-all"
              />
            </div>
          </>
        ) : (
          /* Confirmation & Social Flex Trigger Screen */
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-glow-green animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Check-In Recorded
              </div>
              <h3 className="text-xl font-serif font-black text-[var(--text-primary)]">
                Checked in at {dish.venueName}!
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                {selectedReaction === 'GOD_TIER' 
                  ? 'Your God-Tier verdict is now saved to your personal taste vault.' 
                  : 'Logged to your avoid list so you never make this mistake again.'}
              </p>
            </div>

            {/* CTA Buttons: Flex to Story / Done */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  handleResetAndClose();
                  if (onOpenShare) {
                    onOpenShare(dish, previousCheckIn);
                  }
                }}
                className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-gradient-to-r from-brand-orange via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-glow-orange flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-white" />
                <span>Flex to Instagram / WhatsApp Story</span>
              </button>

              <button
                onClick={handleResetAndClose}
                className="w-full min-h-[44px] flex items-center justify-center py-2.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer active:scale-95"
              >
                Done for now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
