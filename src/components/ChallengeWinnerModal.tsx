'use client';

// ==============================================================================
// PALATE: Challenge the Winner Modal
// Enables the core product loop: PROPOSE A NEW CONTENDER AGAINST THE CHAMPION
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battle } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';
import { X, Swords, Trophy, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChallengeWinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  battle: Battle;
  onSubmitChallenge: (challengeData: {
    previous_battle_id: string;
    challenger_name: string;
    challenger_restaurant: string;
    neighborhood: string;
    dish_category: string;
    reason: string;
  }) => Promise<boolean>;
}

export default function ChallengeWinnerModal({
  isOpen,
  onClose,
  battle,
  onSubmitChallenge,
}: ChallengeWinnerModalProps) {
  const winnerName = battle.winnerContestantId === battle.contestantA.id
    ? battle.contestantA.name
    : battle.votesA >= battle.votesB
    ? battle.contestantA.name
    : battle.contestantB.name;

  const [challengerName, setChallengerName] = useState('');
  const [challengerRestaurant, setChallengerRestaurant] = useState('');
  const [neighborhood, setNeighborhood] = useState(battle.neighborhood || 'Vashi');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!challengerName.trim() || !reason.trim()) {
      setErrorMsg('Please name the challenger and give a reason why they can beat the champion.');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmitChallenge({
      previous_battle_id: battle.id,
      challenger_name: challengerName.trim(),
      challenger_restaurant: challengerRestaurant.trim() || challengerName.trim(),
      neighborhood,
      dish_category: battle.category,
      reason: reason.trim(),
    });
    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      trackEvent('challenge_started', {
        previousBattleId: battle.id,
        previousBattleTitle: battle.title,
        challenger: challengerName.trim(),
        dishCategory: battle.category,
      });
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD11A', '#2748FF', '#FF5C9A', '#00B26B'],
        });
      } catch {}

      setTimeout(() => {
        setIsSuccess(false);
        setChallengerName('');
        setChallengerRestaurant('');
        setReason('');
        onClose();
      }, 2000);
    } else {
      setErrorMsg('Could not submit challenge. Please try again.');
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
          className="fixed inset-0 bg-[#121212]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border-[3px] border-[#121212] bg-[#F6EFE2] p-5 sm:p-6 shadow-[8px_8px_0px_#121212]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border-2 border-[#121212] bg-[#FFFFFF] p-1.5 text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#121212] bg-[#FFD11A] shadow-[3px_3px_0px_#121212]">
                <CheckCircle2 className="h-8 w-8 text-[#121212]" />
              </div>
              <h3 className="text-xl font-black text-[#121212] uppercase">
                Challenge Logged!
              </h3>
              <p className="text-xs text-[#121212]/75 max-w-xs mx-auto font-medium">
                Your challenger has been matched against {winnerName}. Once community upvotes cross the threshold, the new battle launches live!
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#121212] bg-[#FFD11A] shadow-[2px_2px_0px_#121212]">
                  <Trophy className="h-5 w-5 text-[#121212]" />
                </div>
                <div>
                  <span className="stamp-tag text-[9px] py-0.5 px-2">
                    RECURRING BATTLE LOOP
                  </span>
                  <h3 className="text-lg font-black tracking-tight text-[#121212] uppercase leading-tight">
                    Challenge The Winner
                  </h3>
                </div>
              </div>

              {/* Current Champion Callout */}
              <div className="mb-4 rounded-xl border-2 border-[#121212] bg-[#FFFFFF] p-3 shadow-[2px_2px_0px_#121212]">
                <span className="text-[10px] font-mono font-black uppercase text-[#121212]/60">
                  REIGNING CHAMPION:
                </span>
                <h4 className="text-sm font-black text-[#121212]">
                  {winnerName}
                </h4>
                <p className="text-[11px] text-[#121212]/70 font-medium">
                  Dish: {battle.dishName} ({battle.category})
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 rounded-lg border-2 border-[#121212] bg-red-100 p-2 text-xs font-bold text-red-700">
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-1 font-mono">
                    New Challenger Dish / Vendor *
                  </label>
                  <input
                    type="text"
                    required
                    value={challengerName}
                    onChange={(e) => setChallengerName(e.target.value)}
                    placeholder="e.g. Anand Stall Vada Pav or Shivaji Chowk Nerul"
                    className="w-full rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#121212] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#FFD11A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-1 font-mono">
                    Neighbourhood Node *
                  </label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-3 py-2 text-xs font-bold text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FFD11A]"
                  >
                    <option value="Vashi">Sector 17, Vashi</option>
                    <option value="Nerul">Sector 19A, Nerul</option>
                    <option value="Belapur">CBD Belapur</option>
                    <option value="Kharghar">Utsav Chowk, Kharghar</option>
                    <option value="Seawoods">Seawoods Grand Central</option>
                    <option value="Sanpada">Sector 14, Sanpada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#121212] mb-1 font-mono">
                    Why Can They Beat The Champion? *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Their thecha is crunchier and made with cold-pressed peanut oil."
                    className="w-full rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-3.5 py-2 text-xs text-[#121212] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#FFD11A]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 btn-yellow py-3 text-xs font-black uppercase tracking-wider"
                  >
                    <Swords className="h-4 w-4" />
                    <span>{isSubmitting ? 'Proposing Challenge...' : 'Submit Challenge Against Winner'}</span>
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
