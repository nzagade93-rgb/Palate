'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Calculator, Share2, Check } from 'lucide-react';
import type { Dish } from '../types/palate';

interface SplitModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SplitModal: React.FC<SplitModalProps> = ({
  dish,
  isOpen,
  onClose,
}) => {
  const [people, setPeople] = useState(2);
  const [copied, setCopied] = useState(false);

  if (!dish) return null;

  const perPerson = Math.ceil(dish.price / people);

  const handleShare = () => {
    const text = `🍽️ Palate Verdict for ${dish.name} @ ${dish.restaurantName}:\n` +
      `ORDER: ${dish.orderNote}\n` +
      `SKIP: ${dish.skipNote}\n` +
      `Split (₹${dish.price} / ${people}): ₹${perPerson} each.\n` +
      `https://palate-vashi.app/?dish=${dish.id}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-card rounded-3xl border border-gold-light/60 p-5 shadow-sheet z-10 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-overline text-gold font-bold block">
                  Table Split
                </span>
                <h3 className="font-serif text-xl font-bold text-espresso">
                  Split the Order
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

            <div className="p-4 rounded-2xl bg-ivory/80 border border-hairline space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted font-medium">Total Bill</span>
                <span className="font-serif text-xl font-bold text-espresso">₹{dish.price}</span>
              </div>

              {/* People counter */}
              <div className="flex items-center justify-between pt-2 border-t border-hairline">
                <span className="text-xs font-semibold text-espresso flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold" />
                  <span>Diners</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPeople(Math.max(1, people - 1))}
                    className="w-7 h-7 rounded-lg border border-hairline bg-card font-bold text-espresso flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-espresso text-sm">{people}</span>
                  <button
                    type="button"
                    onClick={() => setPeople(people + 1)}
                    className="w-7 h-7 rounded-lg border border-hairline bg-card font-bold text-espresso flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Per person result */}
              <div className="p-3 rounded-xl bg-card border border-gold-light/60 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-overline text-gold font-bold">Each Pays</span>
                <span className="font-serif text-2xl font-bold text-espresso">₹{perPerson}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="w-full py-3 rounded-xl bg-espresso hover:bg-[#2B2119] text-gold-light font-bold text-xs uppercase tracking-luxury flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-subtle"
            >
              {copied ? <Check className="w-4 h-4 text-gold-light" /> : <Share2 className="w-4 h-4 text-gold-light" />}
              <span>{copied ? 'Copied to Clipboard' : 'Share Breakdown with Friends'}</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
