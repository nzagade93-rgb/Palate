import React, { useState, useEffect } from 'react';
import { X, Dices, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Dish } from '../types';
import { DISHES } from '../data/mockData';

interface AntiRegretWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dish: Dish) => void;
}

export const AntiRegretWheel: React.FC<AntiRegretWheelProps> = ({
  isOpen,
  onClose,
  onSelectDish,
}) => {
  const godTierDishes = DISHES.filter((d) => d.verdict === 'GOD_TIER');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleSpin();
    }
  }, [isOpen]);

  const handleSpin = () => {
    setIsSpinning(true);
    let count = 0;
    const maxCycles = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * godTierDishes.length);
      setSelectedDish(godTierDishes[randomIndex]);
      count++;
      if (count >= maxCycles) {
        clearInterval(interval);
        setIsSpinning(false);
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF5C1F', '#10B981', '#3B82F6', '#D4AF37']
        });
      }
    }, 90);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--modal-backdrop)] backdrop-blur-md animate-fade-in font-sans">
      <div 
        className="w-full max-w-sm mx-auto rounded-3xl bg-[var(--surface-1)] border border-[var(--border-subtle)] shadow-[var(--card-shadow)] overflow-hidden text-center relative p-5 space-y-4 animate-slide-up text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button with 48px hitbox */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all flex items-center justify-center cursor-pointer active:scale-90"
          aria-label="Close anti-regret wheel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anti-Regret Roulette 🎲</span>
          </div>
          <h3 className="text-xl font-serif font-black text-[var(--text-primary)]">Samajh Nahi Aa Raha Kya Khayein? 🤷‍♂️</h3>
          <p className="text-xs text-[var(--text-muted)] font-medium max-w-xs mx-auto">
            Navi Mumbai ke 100% verified God-Tier spots me se ek mast dish pick karte hain!
          </p>
        </div>

        {/* Featured Dish Card */}
        {selectedDish && (
          <div className={`p-3.5 rounded-2xl bg-[var(--surface-2)] border ${isSpinning ? 'border-amber-400/50 blur-[0.5px]' : 'border-emerald-500/40 shadow-glow-green'} transition-all space-y-2.5 text-left`}>
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--border-subtle)]">
              <img
                src={selectedDish.imageUrl}
                alt={selectedDish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-emerald-400 font-black text-[10px] border border-emerald-500/40 shadow-md">
                {selectedDish.scorePercent}% Asli God-Tier 👑
              </div>
            </div>

            <div>
              <h4 className="text-base font-black text-[var(--text-primary)] leading-snug truncate">
                {selectedDish.name}
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-bold truncate">
                {selectedDish.venueName} • {selectedDish.venueArea}
              </p>
            </div>

            <p className="text-xs text-[var(--text-secondary)] italic bg-[var(--surface-1)] p-3 rounded-xl border border-[var(--border-subtle)] leading-relaxed line-clamp-2">
              “{selectedDish.microVerdict}”
            </p>
          </div>
        )}

        {/* Action Controls: 48px touch targets */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={() => {
              if (selectedDish) {
                onSelectDish(selectedDish);
                onClose();
              }
            }}
            disabled={isSpinning}
            className="w-full h-12 min-h-[48px] rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>Done! Yeh Order Karenge ⚡</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full h-12 min-h-[48px] rounded-2xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-amber-600 dark:text-amber-400 border border-[var(--border-subtle)] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Ghum Raha Hai... 🌪️' : 'Ek Aur Baar Ghumao (Reroll) 🎲'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
