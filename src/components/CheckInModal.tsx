'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { ArchImage } from './ArchImage';
import type { Dish, Vouch } from '../types/palate';

interface CheckInModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitVouch: (vouch: Vouch) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  dish,
  isOpen,
  onClose,
  onSubmitVouch,
}) => {
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!dish) return null;

  const handleVerdict = (verdict: 'vouch' | 'skip') => {
    const newVouch: Vouch = {
      id: `vouch-${Date.now()}`,
      userId: 'user-default-1',
      userName: 'You',
      dishId: dish.id,
      dishName: dish.name,
      restaurantName: dish.restaurantName,
      createdAt: Date.now(),
      verdict,
      note: note.trim() || undefined,
    };

    onSubmitVouch(newVouch);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setNote('');
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso/50 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-sm bg-card rounded-3xl border border-gold-light/60 p-5 shadow-sheet z-10 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-overline text-gold font-bold block">
                  10-Second Meal Log
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso">
                  Did you order this?
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-ivory border border-hairline flex items-center justify-center text-espresso"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dish Thumbnail & Name */}
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-ivory/80 border border-hairline">
              <ArchImage
                src={dish.photoUrl}
                alt={dish.name}
                size="thumb"
                isVeg={dish.isVeg}
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-overline text-gold font-bold block">
                  ₹{dish.price}
                </span>
                <h4 className="font-serif font-bold text-espresso text-sm leading-snug truncate">
                  {dish.name}
                </h4>
                <p className="text-xs text-muted truncate">{dish.restaurantName}</p>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-god-tier/10 border border-god-tier/40 text-center space-y-1.5 animate-pulse">
                <Sparkles className="w-6 h-6 text-god-tier mx-auto" />
                <div className="font-serif font-bold text-espresso text-base">Vouch Recorded!</div>
                <p className="text-xs text-muted">Your taste DNA has been updated.</p>
              </div>
            ) : (
              <>
                {/* Note input */}
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional: flavor note or temperature..."
                  className="w-full px-3 py-2 text-xs bg-ivory text-espresso placeholder-muted/60 rounded-xl border border-hairline focus:outline-none focus:border-gold"
                />

                {/* 2 Fast Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleVerdict('vouch')}
                    className="py-3 px-3 rounded-xl bg-god-tier hover:bg-[#185541] text-white font-bold text-xs uppercase tracking-luxury flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-subtle"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>God-Tier (Vouch)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerdict('skip')}
                    className="py-3 px-3 rounded-xl bg-oxblood hover:bg-[#722622] text-white font-bold text-xs uppercase tracking-luxury flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-subtle"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Skip This</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
