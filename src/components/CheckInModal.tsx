import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ThumbsDown, 
  ThumbsUp, 
  Share2, 
  CheckCircle2,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Dish, CheckIn, CheckInReaction } from '../types';
import { useCheckIns } from '../hooks/useCheckIns';

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
  onOpenShare
}) => {
  const { addCheckIn, getLatestCheckIn } = useCheckIns();
  const [selectedReaction, setSelectedReaction] = useState<CheckInReaction | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [latestSavedCheckIn, setLatestSavedCheckIn] = useState<CheckIn | null>(null);

  if (!isOpen || !dish) return null;

  const previousCheckIn = getLatestCheckIn(dish.id);

  const handleSubmit = (reaction: CheckInReaction) => {
    setSelectedReaction(reaction);

    if (reaction === 'GOD_TIER') {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF5722', '#10B981', '#F59E0B']
      });
    }

    const saved = addCheckIn(dish, reaction, note);
    setLatestSavedCheckIn(saved);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setSelectedReaction(null);
    setNote('');
    setLatestSavedCheckIn(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-hidden">
      <div 
        className="w-full max-w-md bg-[#13151F] border-t sm:border border-[#282C3D] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1F2231] text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Header: Location & Dish Info */}
            <div className="space-y-1 pr-8">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-orange uppercase tracking-wider bg-brand-orange/10 border border-brand-orange/30 px-2.5 py-0.5 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-brand-orange" />
                <span>1-Tap Live Check-In</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight leading-snug">
                I'm Eating Here Now
              </h2>
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-200 font-semibold">{dish.venueName}</span>
                <span>•</span>
                <span>{dish.venueArea}</span>
              </div>
            </div>

            {/* Dish Card Snippet */}
            <div className="p-3 rounded-2xl bg-[#1A1D2A] border border-[#2B3042] flex items-center gap-3">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-white truncate">{dish.name}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs">
                  <span className="font-bold text-gray-300">₹{dish.price}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/70 border border-emerald-800/50 px-2 py-0.2 rounded">
                    {dish.scorePercent}% God-Tier
                  </span>
                </div>
              </div>
            </div>

            {/* Prompt Question */}
            <div className="text-center pt-1">
              <h3 className="text-sm font-extrabold text-white">
                Did you order this today? What's your verdict?
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Tap once to log your taste memory & unlock your social flex card
              </p>
            </div>

            {/* Micro-Reaction Decision Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* 🟢 Loved it */}
              <button
                type="button"
                onClick={() => handleSubmit('GOD_TIER')}
                className="group p-4 rounded-2xl bg-gradient-to-b from-emerald-950/70 to-emerald-900/40 hover:from-emerald-900/90 hover:to-emerald-800/60 border-2 border-emerald-500/50 hover:border-emerald-400 shadow-glow-green text-center space-y-1.5 transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <ThumbsUp className="w-5 h-5 text-emerald-300 fill-emerald-300/40" />
                </div>
                <div className="font-black text-sm text-white">God-Tier</div>
                <div className="text-[10px] text-emerald-300/90 font-medium">Loved it • Pure Truth</div>
              </button>

              {/* 🔴 Skip it */}
              <button
                type="button"
                onClick={() => handleSubmit('SKIP')}
                className="group p-4 rounded-2xl bg-gradient-to-b from-red-950/70 to-red-900/40 hover:from-red-900/90 hover:to-red-800/60 border-2 border-red-500/50 hover:border-red-400 shadow-glow-red text-center space-y-1.5 transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                  <ThumbsDown className="w-5 h-5 text-red-300 fill-red-300/40" />
                </div>
                <div className="font-black text-sm text-white">Overhyped</div>
                <div className="text-[10px] text-red-300/90 font-medium">Skip it • Would not reorder</div>
              </button>
            </div>

            {/* Optional Personal Note */}
            <div className="pt-1">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add optional flex note (e.g. Extra kadak pav is insane)..."
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-[#1A1D2A] border border-[#2B3042] text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange transition-all"
              />
            </div>
          </>
        ) : (
          /* Confirmation & Social Flex Trigger Screen */
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-glow-green animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Check-In Recorded
              </div>
              <h3 className="text-xl font-black text-white">
                Checked in at {dish.venueName}!
              </h3>
              <p className="text-xs text-gray-300 max-w-xs mx-auto">
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
                    onOpenShare(dish, latestSavedCheckIn || previousCheckIn);
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-orange via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-glow-orange flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-white" />
                <span>Flex to Instagram / WhatsApp Story</span>
              </button>

              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
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
