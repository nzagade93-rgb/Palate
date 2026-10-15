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
          colors: ['#FF5722', '#10B981', '#3B82F6']
        });
      }
    }, 90);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-sm rounded-3xl bg-[#0E1116] border border-[#262C36] shadow-glow-orange overflow-hidden text-center relative p-6 space-y-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#161B22] text-slate-400 hover:text-white border border-[#262C36] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anti-Regret Machine</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Can't Decide What to Eat?</h3>
          <p className="text-xs text-slate-400">
            Spinning through 100% verified God-Tier dishes in your neighborhood.
          </p>
        </div>

        {/* Featured Dish Card */}
        {selectedDish && (
          <div className={`p-4 rounded-2xl bg-[#161B22] border ${isSpinning ? 'border-amber-400/50 blur-[0.5px]' : 'border-emerald-500/40 shadow-glow-green'} transition-all space-y-3`}>
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#262C36]">
              <img
                src={selectedDish.imageUrl}
                alt={selectedDish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] shadow-md">
                {selectedDish.scorePercent}% God-Tier
              </div>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-white leading-snug">
                {selectedDish.name}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {selectedDish.venueName} • {selectedDish.venueArea}
              </p>
            </div>

            <p className="text-xs text-neutral-300 italic bg-[#07090C] p-3 rounded-xl border border-[#262C36]">
              “{selectedDish.microVerdict}”
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              if (selectedDish) {
                onSelectDish(selectedDish);
                onClose();
              }
            }}
            disabled={isSpinning}
            className="w-full min-h-[44px] py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>Lock In & View Split-Card</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full min-h-[44px] py-3 rounded-2xl bg-[#161B22] hover:bg-[#1E242E] text-amber-300 border border-[#262C36] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Deciding...' : 'Reroll / Spin Again'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
