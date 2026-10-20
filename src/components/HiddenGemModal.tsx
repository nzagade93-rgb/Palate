'use client';

// ==============================================================================
// CraveClash HiddenGemModal: Friction-Free Food Spot Submission Form
// Allows community foodies to pitch unheralded local food spots with dish recommendations
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HiddenGemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitGem: (data: {
    restaurant_name: string;
    neighborhood: string;
    dish_recommendation: string;
    secret_tip?: string;
  }) => Promise<boolean>;
}

const NAVI_MUMBAI_AREAS = [
  'Sector 17, Vashi',
  'Sector 19A, Nerul East',
  'Nerul West (Near Station)',
  'CBD Belapur (Artist Village / Sector 15)',
  'Sector 20, Kharghar',
  'Utsav Chowk, Kharghar',
  'Seawoods Grand Central Area',
  'Sector 14, Sanpada',
  'Airoli Knowledge Park',
  'Ulwe Sector 19',
];

export default function HiddenGemModal({
  isOpen,
  onClose,
  onSubmitGem,
}: HiddenGemModalProps) {
  const [restaurantName, setRestaurantName] = useState('');
  const [neighborhood, setNeighborhood] = useState(NAVI_MUMBAI_AREAS[0]);
  const [dishRecommendation, setDishRecommendation] = useState('');
  const [secretTip, setSecretTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!restaurantName.trim() || !dishRecommendation.trim()) {
      setErrorMsg('Spot name and signature dish recommendation are required.');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmitGem({
      restaurant_name: restaurantName.trim(),
      neighborhood,
      dish_recommendation: dishRecommendation.trim(),
      secret_tip: secretTip.trim() || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#ffffff', '#d97706'],
        });
      } catch {
        // Ignore
      }

      setTimeout(() => {
        setIsSuccess(false);
        setRestaurantName('');
        setDishRecommendation('');
        setSecretTip('');
        onClose();
      }, 1800);
    } else {
      setErrorMsg('Could not submit gem. Please verify your connection.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="metallic-card relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#383838] p-5 sm:p-6 shadow-2xl"
        >
          {/* Top Amber Highlight */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-[#2d2d2d] bg-[#141414] p-1.5 text-[#a3a3a3] transition-colors hover:border-[#f59e0b] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f59e0b] bg-[#211707] text-[#f59e0b] shadow-[0_0_24px_rgba(245,158,11,0.3)]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-white uppercase">Spot Pitched!</h3>
              <p className="text-xs text-[#a3a3a3] max-w-xs mx-auto">
                Your hidden gem has been added to the CraveClash nomination radar.
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center space-x-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#f59e0b]/40 bg-[#1c1407] text-[#f59e0b]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white uppercase">
                    Pitch a Hidden Gem
                  </h3>
                  <p className="text-xs text-[#a3a3a3]">
                    Back an unheralded local spot for the next Navi Mumbai Battle
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-950/40 p-2.5 text-xs text-red-300">
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4d4d4] mb-1.5 font-mono">
                    Spot / Stall Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Darjeeling Momos Corner or Sainath Misal"
                    className="w-full rounded-xl border border-[#2d2d2d] bg-[#121212] px-3.5 py-2.5 text-xs text-white placeholder-[#525252] focus:border-[#f59e0b] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4d4d4] mb-1.5 font-mono">
                    Neighbourhood Node *
                  </label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full rounded-xl border border-[#2d2d2d] bg-[#121212] px-3 py-2.5 text-xs text-white focus:border-[#f59e0b] focus:outline-none transition-colors"
                  >
                    {NAVI_MUMBAI_AREAS.map((area) => (
                      <option key={area} value={area} className="bg-[#171717]">
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4d4d4] mb-1.5 font-mono">
                    The One Dish to Order *
                  </label>
                  <input
                    type="text"
                    required
                    value={dishRecommendation}
                    onChange={(e) => setDishRecommendation(e.target.value)}
                    placeholder="e.g. Steamed Chicken Kothey with Chili Chutney"
                    className="w-full rounded-xl border border-[#2d2d2d] bg-[#121212] px-3.5 py-2.5 text-xs text-white placeholder-[#525252] focus:border-[#f59e0b] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#d4d4d4] mb-1.5 font-mono">
                    Insider Secret / Tip (Optional)
                  </label>
                  <input
                    type="text"
                    value={secretTip}
                    onChange={(e) => setSecretTip(e.target.value)}
                    placeholder="e.g. Ask for extra spicy thecha after 7 PM"
                    className="w-full rounded-xl border border-[#2d2d2d] bg-[#121212] px-3.5 py-2.5 text-xs text-white placeholder-[#525252] focus:border-[#f59e0b] focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] py-3 text-xs font-black uppercase tracking-wider text-black transition-all hover:opacity-95 active:scale-98 disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? 'Pitching Spot...' : 'Submit to CraveClash Radar'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
