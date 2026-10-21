'use client';

// ==============================================================================
// PALATE: Battle Detail View (Client Layer)
// Swiggy-grade mobile battle arena with real-time percentages,
// WhatsApp share drawer, and "Challenge the Winner" workflow.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Battle, FoodPassport } from '@/lib/types';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { trackEvent, recordSharedLinkAttribution } from '@/lib/analytics';
import { addCrestPoints } from '@/lib/crestSystem';
import ShareableBattleCardModal from '@/components/ShareableBattleCardModal';
import ChallengeWinnerModal from '@/components/ChallengeWinnerModal';

import {
  ArrowLeft,
  Flame,
  Swords,
  Clock,
  MapPin,
  ShieldCheck,
  Share2,
  Trophy,
  Check,
  Star,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BattleDetailClientProps {
  initialBattle: Battle;
}

export default function BattleDetailClient({ initialBattle }: BattleDetailClientProps) {
  const [battle, setBattle] = useState<Battle>(initialBattle);
  const [fingerprint, setFingerprint] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [votingSide, setVotingSide] = useState<'A' | 'B' | null>(null);

  // Modals
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial voter setup & analytics
  useEffect(() => {
    const fp = getDeviceFingerprint();
    setFingerprint(fp);

    // Track shared link attribution and battle view
    recordSharedLinkAttribution();
    trackEvent('battle_viewed', {
      battleId: initialBattle.id,
      dish: initialBattle.dishName,
    });
  }, [initialBattle]);

  const hasVoted = Boolean(battle.userVotedChoice);
  const userChoice = battle.userVotedChoice;

  // Real Vote Action
  const handleVote = async (contestantId: string, side: 'A' | 'B') => {
    if (hasVoted || isVoting || !battle.isActive) return;

    setVotingSide(side);

    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#0F5132', '#EF4E3A', '#F6B21A'],
      });
    } catch {}

    try {
      setIsVoting(true);
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battle_id: battle.id,
          chosen_restaurant_id: contestantId,
          voter_fingerprint: fingerprint,
        }),
      });

      const data = await res.json();
      if (data.success && data.battle) {
        setBattle(data.battle);
        trackEvent('vote_submitted', {
          battleId: battle.id,
          chosenContestantId: contestantId,
          side,
        });
        addCrestPoints(10, `Voted in ${battle.title}`);
        setToastMessage('Vote Counted! +10 Crest Points');
        setTimeout(() => setToastMessage(null), 3000);
      } else if (data.alreadyVoted) {
        alert(data.error || 'Already voted in this battle.');
      }
    } catch (e) {
      console.error('Vote failed:', e);
    } finally {
      setIsVoting(false);
      setVotingSide(null);
    }
  };

  // Submit Challenge Action
  const handleChallengeSubmit = async (challengeData: any) => {
    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...challengeData,
          submitter_fingerprint: fingerprint,
        }),
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-full pb-14 px-4 py-4 space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#02060C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 border border-white/10">
          <Sparkles className="h-3.5 w-3.5 text-[#F6B21A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back to Battles Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#686B78] hover:text-[#02060C] transition-colors bg-white px-3 py-1.5 rounded-full border border-black/[0.06] shadow-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Battles</span>
        </Link>

        <span className="text-[11px] font-bold text-[#0F5132] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
          📍 {battle.neighborhood}
        </span>
      </div>

      {/* Battle Main Poster Card */}
      <article className="rounded-2xl border border-black/[0.06] bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(2,6,12,0.05)]">
        {/* Status Row */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] text-[11px] font-bold border border-emerald-200/50">
            <span className="h-2 w-2 rounded-full bg-[#0F5132] animate-pulse" />
            <span>{battle.isActive ? 'LIVE FOOD FIGHT' : 'CONCLUDED'}</span>
          </span>

          <span className="text-xs font-semibold text-[#686B78]">
            {battle.totalVotes.toLocaleString()} Votes Cast
          </span>
        </div>

        {/* Title & Contested Dish */}
        <div className="mb-4">
          <h1 className="text-lg sm:text-xl font-extrabold text-[#02060C] tracking-tight leading-snug">
            {battle.title}
          </h1>
          <p className="mt-1 text-xs text-[#686B78]">
            Contested Dish: <span className="font-bold text-[#02060C]">{battle.dishName}</span>
          </p>
          {battle.description && (
            <p className="mt-2 text-xs text-[#475569] leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              {battle.description}
            </p>
          )}
        </div>

        {/* Live Vote Split Bar (When Voted or Closed) */}
        {(hasVoted || !battle.isActive) && (
          <div className="mb-5 bg-[#F4F5F8] rounded-xl p-3 border border-black/[0.04]">
            <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
              <span className="text-[#0F5132]">{battle.contestantA.name}: {battle.percentA}%</span>
              <span className="text-[#EF4E3A]">{battle.contestantB.name}: {battle.percentB}%</span>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${battle.percentA}%` }}
                className="bg-[#0F5132] h-full transition-all duration-700"
              />
              <div
                style={{ width: `${battle.percentB}%` }}
                className="bg-[#EF4E3A] h-full transition-all duration-700"
              />
            </div>
          </div>
        )}

        {/* Contenders Cards Grid */}
        <div className="space-y-3">
          {/* Contender A */}
          <div
            className={`rounded-2xl border p-3.5 transition-all flex flex-col justify-between ${
              userChoice === battle.contestantA.id
                ? 'bg-emerald-50/50 border-[#0F5132] shadow-xs'
                : 'bg-white border-black/[0.06]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-black/[0.04]">
                <img
                  src={battle.contestantA.imageUrl}
                  alt={battle.contestantA.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/40">
                    Contender A
                  </span>
                  {userChoice === battle.contestantA.id && (
                    <span className="flex items-center space-x-1 text-[10px] font-black text-[#0F5132] bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Check className="h-3 w-3 stroke-[3]" />
                      <span>YOUR VOTE</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-[#02060C] mt-1 truncate">
                  {battle.contestantA.name}
                </h3>
                <p className="text-[11px] text-[#686B78] font-medium truncate">
                  📍 {battle.contestantA.neighborhood}
                </p>
                <p className="text-[11px] text-[#475569] italic mt-0.5 truncate">
                  &ldquo;{battle.contestantA.signatureDish || battle.dishName}&rdquo;
                </p>
              </div>
            </div>

            {/* Vote Action or Result */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#686B78]">
                {battle.votesA.toLocaleString()} votes ({battle.percentA}%)
              </span>

              {!hasVoted && battle.isActive && (
                <button
                  onClick={() => handleVote(battle.contestantA.id, 'A')}
                  disabled={isVoting}
                  className="px-4 py-1.5 bg-[#0F5132] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#0B3D26] active:scale-95 transition-all"
                >
                  {votingSide === 'A' ? 'Voting...' : 'VOTE THIS'}
                </button>
              )}
            </div>
          </div>

          {/* Contender B */}
          <div
            className={`rounded-2xl border p-3.5 transition-all flex flex-col justify-between ${
              userChoice === battle.contestantB.id
                ? 'bg-rose-50/50 border-[#EF4E3A] shadow-xs'
                : 'bg-white border-black/[0.06]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-black/[0.04]">
                <img
                  src={battle.contestantB.imageUrl}
                  alt={battle.contestantB.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#EF4E3A] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/40">
                    Contender B
                  </span>
                  {userChoice === battle.contestantB.id && (
                    <span className="flex items-center space-x-1 text-[10px] font-black text-[#EF4E3A] bg-rose-100 px-2 py-0.5 rounded-full">
                      <Check className="h-3 w-3 stroke-[3]" />
                      <span>YOUR VOTE</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-[#02060C] mt-1 truncate">
                  {battle.contestantB.name}
                </h3>
                <p className="text-[11px] text-[#686B78] font-medium truncate">
                  📍 {battle.contestantB.neighborhood}
                </p>
                <p className="text-[11px] text-[#475569] italic mt-0.5 truncate">
                  &ldquo;{battle.contestantB.signatureDish || battle.dishName}&rdquo;
                </p>
              </div>
            </div>

            {/* Vote Action or Result */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#686B78]">
                {battle.votesB.toLocaleString()} votes ({battle.percentB}%)
              </span>

              {!hasVoted && battle.isActive && (
                <button
                  onClick={() => handleVote(battle.contestantB.id, 'B')}
                  disabled={isVoting}
                  className="px-4 py-1.5 bg-[#EF4E3A] text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-[#D93D2A] active:scale-95 transition-all"
                >
                  {votingSide === 'B' ? 'Voting...' : 'VOTE THIS'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#F4F5F8] text-[#02060C] text-xs font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            <Share2 className="h-3.5 w-3.5 text-[#0F5132]" />
            <span>Share Battle</span>
          </button>

          <button
            onClick={() => setChallengeModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-[#0F5132] text-xs font-bold rounded-xl border border-emerald-200/50 hover:bg-emerald-100 transition-all"
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Challenge Winner</span>
          </button>
        </div>

        {/* Community Verification Notice */}
        <div className="mt-3 bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex items-center space-x-2 text-[10px] text-[#686B78] font-medium">
          <ShieldCheck className="h-4 w-4 text-[#0F5132] shrink-0" />
          <span>Device-fingerprinted voting. 1 voter = 1 vote. Community taste only.</span>
        </div>
      </article>

      {/* Share Modal */}
      <ShareableBattleCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        battle={battle}
      />

      {/* Challenge Winner Modal */}
      <ChallengeWinnerModal
        isOpen={challengeModalOpen}
        onClose={() => setChallengeModalOpen(false)}
        battle={battle}
        onSubmitChallenge={handleChallengeSubmit}
      />
    </div>
  );
}
