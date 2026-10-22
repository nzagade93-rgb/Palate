'use client';

// ==============================================================================
// PALATE: Log Bite Modal (Native Bottom Sheet)
// High-conversion tasting logger with star rating, quick taste tags, and +15 CP confetti.
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Sparkles, Check, Flame, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addCrestPoints } from '@/lib/crestSystem';
import { Dish } from '@/types';

interface LogBiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  onSuccess?: (dishName: string) => void;
}

const TASTE_TAG_OPTIONS = [
  'Crispy',
  'Extra Spicy',
  'Authentic Chutney',
  'Value for Money',
  'Amul Butter Rich',
  'Huge Portion',
  'Piping Hot',
  'Pure Nostalgia',
];

export default function LogBiteModal({
  isOpen,
  onClose,
  dish,
  onSuccess,
}: LogBiteModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Crispy', 'Authentic Chutney']);
  const [verdict, setVerdict] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!dish) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1:
        return 'Not worth the calories (Skip)';
      case 2:
        return 'Mediocre / Below expectations';
      case 3:
        return 'Decent neighbourhood bite';
      case 4:
        return 'Very good, definitely recommend';
      case 5:
        return 'Must-Order Legendary! ★';
      default:
        return 'Select your rating';
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Confetti celebration
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0D4734', '#10B981', '#F59E0B', '#FEF3C7'],
      });
    } catch {}

    // Add +15 CP
    addCrestPoints(15, `Logged tasting for ${dish.name}`);

    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) onSuccess(dish.name);
      onClose();
    }, 400);
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-[420px] bg-white rounded-t-[32px] border-t border-slate-100 shadow-[0_-12px_40px_rgba(0,0,0,0.2)] overflow-hidden max-h-[90vh] flex flex-col z-10"
          >
            {/* iOS Pull Bar */}
            <div className="pt-3 pb-1 flex items-center justify-center">
              <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Header: Dish Name & Location */}
            <div className="px-5 pt-2 pb-3.5 border-b border-slate-100 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {/* Veg / Non-Veg Indicator */}
                  <span
                    className={`inline-block h-3.5 w-3.5 border p-[2px] rounded-xs shrink-0 ${
                      dish.isVeg ? 'border-[#16A34A]' : 'border-[#DC2626]'
                    }`}
                  >
                    {dish.isVeg ? (
                      <span className="block h-full w-full rounded-full bg-[#16A34A]" />
                    ) : (
                      <span
                        className="block w-0 h-0 border-x-[3px] border-x-transparent border-b-[6px] border-b-[#DC2626]"
                        style={{ borderBottomColor: '#DC2626' }}
                      />
                    )}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Log Your Tasting
                  </span>
                </div>

                <h2 className="text-[16px] font-extrabold text-slate-900 leading-snug truncate">
                  {dish.name}
                </h2>

                <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                  {dish.restaurantName} • <span className="text-slate-700">{dish.node} {dish.sector ? `(${dish.sector})` : ''}</span>
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Scrollable Body */}
            <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1 overscroll-contain">
              {/* Star Rating Section */}
              <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-slate-100 text-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Rate This Dish
                </label>

                {/* 5-Star Interactive Selector */}
                <div className="flex items-center justify-center space-x-2 my-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= activeRating;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-2xl transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            isFilled
                              ? 'text-[#F59E0B] fill-[#F59E0B] drop-shadow-xs'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs font-extrabold text-[#0D4734] mt-1">
                  {getRatingLabel(activeRating)}
                </p>
              </div>

              {/* Quick Taste Tags (Multi-Select) */}
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-2">
                  Quick Taste Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TASTE_TAG_OPTIONS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border ${
                          isSelected
                            ? 'bg-[#0D4734] text-white border-[#0D4734] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* One-Line Verdict Input */}
              <div>
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-1.5">
                  Your One-Line Verdict
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={140}
                    value={verdict}
                    onChange={(e) => setVerdict(e.target.value)}
                    placeholder="e.g. Crisp golden exterior with that fiery red thecha crunch..."
                    className="w-full bg-[#F8FAFC] text-slate-900 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D4734]/20 focus:border-[#0D4734] focus:bg-white placeholder:text-slate-400 transition-all"
                  />
                  <span className="absolute right-3 top-3 text-[10px] font-bold text-slate-400">
                    {verdict.length}/140
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Help fellow foodies know what makes this dish special.
                </p>
              </div>
            </div>

            {/* Bottom Sticky Action Button */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col space-y-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#0D4734] hover:bg-[#082d21] active:scale-[0.98] text-white font-extrabold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                <span>Submit Bite (+15 CP)</span>
              </button>

              <p className="text-[10px] text-center text-slate-400 font-medium">
                Verified logs help rank dishes in the Navi Mumbai Food Directory
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
