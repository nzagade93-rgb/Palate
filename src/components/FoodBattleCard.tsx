'use client';

// ==============================================================================
// PALATE: FoodBattleCard (Swiggy-Grade Dish Battle Card)
// Clean white surface, soft elevation, high-contrast typography,
// Swiggy-style VOTE buttons, and seamless mobile touch ergonomics.
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Battle } from '@/lib/types';
import { Swords, Check, Share2, Flame, Trophy, ExternalLink, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import ShareableBattleCardModal from './ShareableBattleCardModal';
import ChallengeWinnerModal from './ChallengeWinnerModal';

interface FoodBattleCardProps {
  battle: Battle;
  onVote: (battleId: string, chosenContestantId: string) => Promise<boolean>;
  isVoting: boolean;
  onChallengeWinner?: (challengeData: any) => Promise<boolean>;
}

export default function FoodBattleCard({
  battle,
  onVote,
  isVoting,
  onChallengeWinner,
}: FoodBattleCardProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [votingSide, setVotingSide] = useState<'A' | 'B' | null>(null);

  const hasVoted = Boolean(battle.userVotedChoice);
  const userChoice = battle.userVotedChoice;

  const nodeA = battle.contestantA.neighborhood.split(',')[0]?.trim() || battle.contestantA.neighborhood;
  const nodeB = battle.contestantB.neighborhood.split(',')[0]?.trim() || battle.contestantB.neighborhood;

  const handleVoteClick = async (contestantId: string, side: 'A' | 'B', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVoted || isVoting || !battle.isActive) return;

    setVotingSide(side);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0F5132', '#EF4E3A', '#F6B21A'],
      });
    } catch {}

    await onVote(battle.id, contestantId);
    setVotingSide(null);
  };

  const battleUrl = `/battle/${battle.slug || battle.id}`;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-black/[0.06] bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(2,6,12,0.05)] hover:shadow-[0_8px_24px_rgba(2,6,12,0.08)] transition-all"
      >
        {/* Top Header Row: Live Status + Location Meta */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] text-[11px] font-bold border border-emerald-200/50">
              <span className="h-2 w-2 rounded-full bg-[#0F5132] animate-pulse" />
              <span>{battle.isActive ? 'LIVE BATTLE' : 'COMPLETED'}</span>
            </span>

            <span className="text-xs font-semibold text-[#686B78]">
              📍 {battle.neighborhood}
            </span>
          </div>

          <span className="text-[11px] font-bold text-[#686B78] uppercase tracking-wider bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
            {battle.battleType}
          </span>
        </div>

        {/* Title & Contested Dish */}
        <div className="mb-3.5">
          <Link href={battleUrl} className="group">
            <h3 className="text-[17px] sm:text-[19px] font-extrabold text-[#02060C] tracking-tight leading-snug group-hover:text-[#0F5132] transition-colors">
              {battle.title}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-[#686B78]">
            Contested Dish: <span className="font-bold text-[#02060C]">{battle.dishName}</span>
          </p>
        </div>

        {/* Head-to-Head Contender Cards (Swiggy Food Presentation) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4 relative">
          {/* Contestant A */}
          <div
            className={`relative flex flex-col justify-between rounded-xl border p-3 transition-all ${
              userChoice === battle.contestantA.id
                ? 'border-[#0F5132] bg-emerald-50/30 ring-1 ring-[#0F5132]'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            {userChoice === battle.contestantA.id && (
              <div className="absolute right-2.5 top-2.5 z-20 flex items-center space-x-1 rounded-full bg-[#0F5132] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                <Check className="h-3 w-3 stroke-[3]" />
                <span>YOUR PICK</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded">
                  Contender A
                </span>
                <span className="swiggy-rating">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <span>4.4</span>
                </span>
              </div>

              {/* Dish Photo */}
              <div className="relative mb-2.5 h-36 w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={battle.contestantA.imageUrl}
                  alt={battle.contestantA.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[10px] font-bold text-[#F6B21A] block">
                    {nodeA}
                  </span>
                  <h4 className="text-sm font-bold leading-tight line-clamp-1">
                    {battle.contestantA.name}
                  </h4>
                </div>
              </div>
            </div>

            {/* Voting Action / Progress Bar */}
            <div className="pt-1">
              {hasVoted || !battle.isActive ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#686B78]">
                      {battle.votesA.toLocaleString()} votes
                    </span>
                    <span className="text-[#0F5132] font-extrabold">{battle.percentA}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      style={{ width: `${battle.percentA}%` }}
                      className="h-full bg-[#0F5132] transition-all duration-500 rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={(e) => handleVoteClick(battle.contestantA.id, 'A', e)}
                  disabled={isVoting}
                  id={`btn-vote-a-${battle.id}`}
                  className="w-full py-2.5 rounded-xl border-2 border-[#0F5132] bg-white text-[#0F5132] hover:bg-[#0F5132] hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98 flex items-center justify-center space-x-1"
                >
                  <span>{votingSide === 'A' ? 'Voting...' : `Vote ${battle.contestantA.name.split(' ')[0]}`}</span>
                </button>
              )}
            </div>
          </div>

          {/* Contestant B */}
          <div
            className={`relative flex flex-col justify-between rounded-xl border p-3 transition-all ${
              userChoice === battle.contestantB.id
                ? 'border-[#EF4E3A] bg-rose-50/30 ring-1 ring-[#EF4E3A]'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            {userChoice === battle.contestantB.id && (
              <div className="absolute right-2.5 top-2.5 z-20 flex items-center space-x-1 rounded-full bg-[#EF4E3A] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                <Check className="h-3 w-3 stroke-[3]" />
                <span>YOUR PICK</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EF4E3A] bg-rose-50 px-2 py-0.5 rounded">
                  Contender B
                </span>
                <span className="swiggy-rating bg-[#EF4E3A]">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <span>4.3</span>
                </span>
              </div>

              {/* Dish Photo */}
              <div className="relative mb-2.5 h-36 w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={battle.contestantB.imageUrl}
                  alt={battle.contestantB.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="text-[10px] font-bold text-[#F6B21A] block">
                    {nodeB}
                  </span>
                  <h4 className="text-sm font-bold leading-tight line-clamp-1">
                    {battle.contestantB.name}
                  </h4>
                </div>
              </div>
            </div>

            {/* Voting Action / Progress Bar */}
            <div className="pt-1">
              {hasVoted || !battle.isActive ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#686B78]">
                      {battle.votesB.toLocaleString()} votes
                    </span>
                    <span className="text-[#EF4E3A] font-extrabold">{battle.percentB}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      style={{ width: `${battle.percentB}%` }}
                      className="h-full bg-[#EF4E3A] transition-all duration-500 rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={(e) => handleVoteClick(battle.contestantB.id, 'B', e)}
                  disabled={isVoting}
                  id={`btn-vote-b-${battle.id}`}
                  className="w-full py-2.5 rounded-xl border-2 border-[#EF4E3A] bg-white text-[#EF4E3A] hover:bg-[#EF4E3A] hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98 flex items-center justify-center space-x-1"
                >
                  <span>{votingSide === 'B' ? 'Voting...' : `Vote ${battle.contestantB.name.split(' ')[0]}`}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: Live votes count, Share & Arena buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs">
          <div className="flex items-center space-x-1.5 text-xs text-[#686B78] font-medium">
            <Flame className="h-3.5 w-3.5 text-[#EF4E3A]" />
            <span>{battle.totalVotes.toLocaleString()} community votes cast</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Share Trigger */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-[#02060C] hover:bg-gray-50 transition-all flex items-center space-x-1.5 shadow-xs"
              title="Share Battle on WhatsApp/Socials"
            >
              <Share2 className="h-3.5 w-3.5 text-[#686B78]" />
              <span>Share</span>
            </button>

            {/* Challenge Winner Trigger */}
            {!battle.isActive && (
              <button
                onClick={() => setChallengeModalOpen(true)}
                className="rounded-full bg-[#F6B21A] text-[#02060C] px-3 py-1.5 text-xs font-bold hover:bg-[#e5a315] transition-all flex items-center space-x-1.5 shadow-xs"
                title="Challenge the Winner"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Challenge</span>
              </button>
            )}

            {/* Open Battle Page */}
            <Link
              href={battleUrl}
              className="rounded-full bg-[#0F5132] text-white px-3.5 py-1.5 text-xs font-bold hover:bg-[#0B3D26] transition-all flex items-center space-x-1 shadow-xs"
            >
              <span>View Arena</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Legal Trust Tagline */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-[#686B78] leading-tight">
          <span>⚡ Community Consensus (Sec 79 IT Act)</span>
          <span>100% Organic • Non-Sponsored Poll</span>
        </div>
      </motion.article>

      {/* Share Modal */}
      <ShareableBattleCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        battle={battle}
      />

      {/* Challenge Modal */}
      <ChallengeWinnerModal
        isOpen={challengeModalOpen}
        onClose={() => setChallengeModalOpen(false)}
        battle={battle}
        onSubmitChallenge={onChallengeWinner || (async () => true)}
      />
    </>
  );
}
