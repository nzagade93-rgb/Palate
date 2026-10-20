'use client';

// ==============================================================================
// PALATE: Battle Detail View (Client Layer)
// High-conversion battle arena with Blue vs Pink voting, real-time percentages,
// WhatsApp share drawer, and "Challenge the Winner" workflow.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Battle, FoodPassport } from '@/lib/types';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { trackEvent, recordSharedLinkAttribution } from '@/lib/analytics';
import Navbar from '@/components/Navbar';
import ShareableBattleCardModal from '@/components/ShareableBattleCardModal';
import ChallengeWinnerModal from '@/components/ChallengeWinnerModal';
import FoodPassportModal from '@/components/FoodPassportModal';

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
  AlertCircle,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BattleDetailClientProps {
  initialBattle: Battle;
}

export default function BattleDetailClient({ initialBattle }: BattleDetailClientProps) {
  const [battle, setBattle] = useState<Battle>(initialBattle);
  const [passport, setPassport] = useState<FoodPassport | null>(null);
  const [fingerprint, setFingerprint] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [votingSide, setVotingSide] = useState<'A' | 'B' | null>(null);

  // Modals
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [passportModalOpen, setPassportModalOpen] = useState(false);

  // Initial voter setup & analytics
  useEffect(() => {
    const fp = getDeviceFingerprint();
    setFingerprint(fp);

    // Track shared link attribution and battle view
    recordSharedLinkAttribution();
    trackEvent('battle_viewed', {
      battleId: initialBattle.id,
      slug: initialBattle.slug,
      title: initialBattle.title,
      battleType: initialBattle.battleType,
      neighborhood: initialBattle.neighborhood,
    });

    // Sync user vote status
    fetch(`/api/battles?slug=${encodeURIComponent(initialBattle.slug)}&fingerprint=${encodeURIComponent(fp)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.battle) setBattle(d.battle);
      })
      .catch(() => {});

    // Sync passport
    fetch(`/api/passport?fingerprint=${encodeURIComponent(fp)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.passport) setPassport(d.passport);
      })
      .catch(() => {});
  }, [initialBattle.slug, initialBattle.id, initialBattle.title, initialBattle.battleType, initialBattle.neighborhood]);

  const hasVoted = Boolean(battle.userVotedChoice);
  const userChoice = battle.userVotedChoice;

  // Vote Action
  const handleVote = async (contestantId: string, side: 'A' | 'B') => {
    if (hasVoted || isVoting || !battle.isActive) return;
    setVotingSide(side);

    trackEvent('contestant_selected', {
      battleId: battle.id,
      chosenContestantId: contestantId,
      side,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#FFD11A', '#2748FF', '#FF5C9A'],
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
        if (data.passport) setPassport(data.passport);
        trackEvent('vote_submitted', {
          battleId: battle.id,
          chosenContestantId: contestantId,
          side,
        });
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
    <div className="min-h-screen bg-[#F6EFE2] text-[#121212] pb-24">
      {/* Top Navigation */}
      <Navbar
        passport={passport}
        onOpenPassport={() => setPassportModalOpen(true)}
      />

      <main className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 font-bold text-xs uppercase tracking-wider text-[#121212] hover:text-[#2748FF] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Battles</span>
          </Link>
        </div>

        {/* Battle Main Poster Card */}
        <article className="poster-card overflow-hidden bg-[#FFFFFF] p-5 sm:p-7 mb-6">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#121212] pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="stamp-tag bg-[#FFD11A]">
                {battle.battleType.toUpperCase()} BATTLE
              </span>
              <span className="font-mono text-xs font-bold text-[#121212]/70">
                📍 {battle.neighborhood}, {battle.city}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-xs font-bold">
              <Clock className="h-3.5 w-3.5 text-[#121212]" />
              <span>
                {battle.isActive ? 'BATTLE ACTIVE' : 'BATTLE COMPLETED'}
              </span>
            </div>
          </div>

          {/* Title & Contested Dish */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-4xl font-black text-[#121212] uppercase tracking-tight leading-tight">
              {battle.title}
            </h1>
            <p className="mt-1 text-sm font-bold text-[#121212]/75">
              Contested Dish: <span className="underline decoration-[#FFD11A] decoration-4 font-black">{battle.dishName}</span>
            </p>
            {battle.description && (
              <p className="mt-2 text-xs text-[#121212]/70 font-medium max-w-2xl">
                {battle.description}
              </p>
            )}
          </div>

          {/* Contestants Head-to-Head Arena */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            {/* Contestant A (TEAM BLUE) */}
            <div
              className={`relative flex flex-col justify-between rounded-xl border-2 border-[#121212] p-4 transition-all ${
                userChoice === battle.contestantA.id
                  ? 'bg-[#2748FF]/15 ring-2 ring-[#2748FF]'
                  : 'bg-[#FFFFFF]'
              }`}
            >
              {userChoice === battle.contestantA.id && (
                <div className="absolute right-3 top-3 z-10 flex items-center space-x-1 rounded-full bg-[#2748FF] px-2.5 py-0.5 text-[10px] font-black text-white border border-[#121212] shadow-sm">
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>YOUR VOTE</span>
                </div>
              )}

              <div>
                <span className="stamp-tag stamp-blue text-[10px] py-0.5 px-2 mb-2 inline-block">
                  TEAM BLUE
                </span>

                <div className="relative mb-3 h-44 w-full overflow-hidden rounded-lg border-2 border-[#121212] bg-[#DDD4C2]">
                  <img
                    src={battle.contestantA.imageUrl}
                    alt={battle.contestantA.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#FFD11A]">
                      {battle.contestantA.neighborhood}
                    </span>
                    <h3 className="text-base font-black leading-tight">
                      {battle.contestantA.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#121212]/75 italic mb-4">
                  "{battle.contestantA.signatureDish || battle.dishName}"
                </p>
              </div>

              {/* Vote Stats / Action */}
              <div>
                {hasVoted || !battle.isActive ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono font-black">
                      <span>{battle.votesA.toLocaleString()} VOTES</span>
                      <span className="text-base text-[#2748FF]">{battle.percentA}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full border border-[#121212] bg-[#DDD4C2]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${battle.percentA}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-[#2748FF]"
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVote(battle.contestantA.id, 'A')}
                    disabled={isVoting}
                    id="btn-vote-blue"
                    className="w-full btn-blue py-3 text-xs font-black uppercase tracking-wider"
                  >
                    {votingSide === 'A' ? 'Voting...' : `Vote ${battle.contestantA.name}`}
                  </button>
                )}
              </div>
            </div>

            {/* Contestant B (TEAM PINK) */}
            <div
              className={`relative flex flex-col justify-between rounded-xl border-2 border-[#121212] p-4 transition-all ${
                userChoice === battle.contestantB.id
                  ? 'bg-[#FF5C9A]/15 ring-2 ring-[#FF5C9A]'
                  : 'bg-[#FFFFFF]'
              }`}
            >
              {userChoice === battle.contestantB.id && (
                <div className="absolute right-3 top-3 z-10 flex items-center space-x-1 rounded-full bg-[#FF5C9A] px-2.5 py-0.5 text-[10px] font-black text-white border border-[#121212] shadow-sm">
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>YOUR VOTE</span>
                </div>
              )}

              <div>
                <span className="stamp-tag stamp-pink text-[10px] py-0.5 px-2 mb-2 inline-block">
                  TEAM PINK
                </span>

                <div className="relative mb-3 h-44 w-full overflow-hidden rounded-lg border-2 border-[#121212] bg-[#DDD4C2]">
                  <img
                    src={battle.contestantB.imageUrl}
                    alt={battle.contestantB.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#FFD11A]">
                      {battle.contestantB.neighborhood}
                    </span>
                    <h3 className="text-base font-black leading-tight">
                      {battle.contestantB.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#121212]/75 italic mb-4">
                  "{battle.contestantB.signatureDish || battle.dishName}"
                </p>
              </div>

              {/* Vote Stats / Action */}
              <div>
                {hasVoted || !battle.isActive ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono font-black">
                      <span>{battle.votesB.toLocaleString()} VOTES</span>
                      <span className="text-base text-[#FF5C9A]">{battle.percentB}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full border border-[#121212] bg-[#DDD4C2]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${battle.percentB}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full bg-[#FF5C9A]"
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVote(battle.contestantB.id, 'B')}
                    disabled={isVoting}
                    id="btn-vote-pink"
                    className="w-full btn-pink py-3 text-xs font-black uppercase tracking-wider"
                  >
                    {votingSide === 'B' ? 'Voting...' : `Vote ${battle.contestantB.name}`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#121212] pt-4">
            <div className="flex items-center space-x-2">
              {/* Share Battle Button (WhatsApp / IG) */}
              <button
                onClick={() => setShareModalOpen(true)}
                id="btn-open-share-modal"
                className="btn-yellow px-4 py-2.5 text-xs font-black uppercase flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Battle Card</span>
              </button>

              {/* Challenge Winner Button */}
              <button
                onClick={() => setChallengeModalOpen(true)}
                id="btn-open-challenge-modal"
                className="btn-white px-4 py-2.5 text-xs font-black uppercase flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4 text-[#121212]" />
                <span>Challenge Winner</span>
              </button>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-[11px] text-[#121212]/70 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Anti-Cheat Device Protected</span>
            </div>
          </div>

          {/* Transparent Popularity Notice */}
          <div className="mt-4 rounded-lg border border-[#121212]/30 bg-[#F6EFE2] p-2.5 text-[11px] text-[#121212]/80 font-medium">
            <span className="font-black text-[#121212]">Voting Notice:</span> Community votes represent crowd taste and neighbourhood debate, not verified food inspection or commercial rating.
          </div>
        </article>
      </main>

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

      {/* Profile / Passport Modal */}
      <FoodPassportModal
        isOpen={passportModalOpen}
        onClose={() => setPassportModalOpen(false)}
        passport={passport}
      />
    </div>
  );
}
