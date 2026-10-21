'use client';

// ==============================================================================
// PALATE: FoodBattleCard (Swiggy / Plattr Grade Faceoff Card)
// Clean horizontal contender layout designed specifically for mobile viewports.
// Prevents badge collisions, eliminates text truncation, provides 1-tap voting.
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Battle } from '@/lib/types';
import { Check, Share2, Trophy, Star } from 'lucide-react';
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
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0F5132', '#EF4E3A', '#F6B21A'],
      });
    } catch {}

    await onVote(battle.id, contestantId);
    setVotingSide(null);
  };

  const handleChallengeSubmit = async (challengeData: any) => {
    if (onChallengeWinner) return onChallengeWinner(challengeData);
    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challengeData),
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  };

  const battleUrl = `/battle/${battle.slug || battle.id}`;

  return (
    <>
      <article className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs hover:shadow-sm transition-all">
        {/* Header Metadata */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] text-[10px] font-extrabold border border-emerald-200/50">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F5132] animate-pulse" />
              <span>{battle.isActive ? 'LIVE BATTLE' : 'COMPLETED'}</span>
            </span>

            <span className="text-[11px] font-bold text-[#686B78]">
              📍 {battle.neighborhood}
            </span>
          </div>

          <span className="text-[10px] font-bold text-[#686B78] uppercase tracking-wider bg-gray-50 border border-gray-200/60 px-2 py-0.5 rounded-md">
            {battle.battleType}
          </span>
        </div>

        {/* Title & Contested Dish */}
        <div className="mb-3">
          <Link href={battleUrl} className="group">
            <h3 className="text-[15px] font-extrabold text-[#02060C] tracking-tight leading-snug group-hover:text-[#0F5132] transition-colors">
              {battle.title}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-[#686B78] line-clamp-1">
            Contested Dish: <span className="font-bold text-[#02060C]">{battle.dishName}</span>
          </p>
        </div>

        {/* Contender A Row */}
        <div
          className={`rounded-xl p-2.5 border transition-all flex items-center justify-between gap-3 ${
            userChoice === battle.contestantA.id
              ? 'bg-emerald-50/50 border-[#0F5132]'
              : 'bg-[#F9FAFB] border-gray-200/70 hover:border-gray-300'
          }`}
        >
          {/* Left: Thumbnail + Details */}
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-black/[0.04]">
              <img
                src={battle.contestantA.imageUrl}
                alt={battle.contestantA.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#0F5132] bg-emerald-100/60 px-1.5 py-0.2 rounded">
                  A
                </span>
                <span className="text-[10px] font-bold text-[#686B78] truncate">
                  {nodeA}
                </span>
                {userChoice === battle.contestantA.id && (
                  <span className="inline-flex items-center text-[9px] font-black text-[#0F5132] bg-emerald-100 px-1.5 py-0.2 rounded-full">
                    <Check className="h-2.5 w-2.5 mr-0.5 stroke-[3]" />
                    VOTED
                  </span>
                )}
              </div>

              <h4 className="text-xs font-extrabold text-[#02060C] leading-snug truncate mt-0.5">
                {battle.contestantA.name}
              </h4>

              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="inline-flex items-center space-x-0.5 bg-[#0F5132] text-white px-1.5 py-0.2 rounded text-[10px] font-black">
                  <span>4.4</span>
                  <Star className="h-2 w-2 fill-white" />
                </span>
                {hasVoted && (
                  <span className="text-[10px] font-bold text-[#0F5132]">
                    {battle.percentA}% ({battle.votesA} votes)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Vote Action Button */}
          <div className="shrink-0">
            {!hasVoted && battle.isActive ? (
              <button
                onClick={(e) => handleVoteClick(battle.contestantA.id, 'A', e)}
                disabled={isVoting}
                className="px-3.5 py-1.5 bg-white border border-[#0F5132] text-[#0F5132] hover:bg-[#0F5132] hover:text-white text-xs font-black rounded-lg shadow-xs active:scale-95 transition-all"
              >
                {votingSide === 'A' ? 'Voting...' : 'VOTE'}
              </button>
            ) : hasVoted ? (
              <span className="text-xs font-black text-[#0F5132]">
                {battle.percentA}%
              </span>
            ) : null}
          </div>
        </div>

        {/* VS Divider */}
        <div className="relative my-2 flex items-center justify-center">
          <div className="w-full border-t border-gray-200" />
          <span className="absolute bg-white px-2 text-[10px] font-black text-[#686B78] uppercase tracking-wider">
            VS
          </span>
        </div>

        {/* Contender B Row */}
        <div
          className={`rounded-xl p-2.5 border transition-all flex items-center justify-between gap-3 ${
            userChoice === battle.contestantB.id
              ? 'bg-rose-50/50 border-[#EF4E3A]'
              : 'bg-[#F9FAFB] border-gray-200/70 hover:border-gray-300'
          }`}
        >
          {/* Left: Thumbnail + Details */}
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-black/[0.04]">
              <img
                src={battle.contestantB.imageUrl}
                alt={battle.contestantB.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#EF4E3A] bg-rose-100/60 px-1.5 py-0.2 rounded">
                  B
                </span>
                <span className="text-[10px] font-bold text-[#686B78] truncate">
                  {nodeB}
                </span>
                {userChoice === battle.contestantB.id && (
                  <span className="inline-flex items-center text-[9px] font-black text-[#EF4E3A] bg-rose-100 px-1.5 py-0.2 rounded-full">
                    <Check className="h-2.5 w-2.5 mr-0.5 stroke-[3]" />
                    VOTED
                  </span>
                )}
              </div>

              <h4 className="text-xs font-extrabold text-[#02060C] leading-snug truncate mt-0.5">
                {battle.contestantB.name}
              </h4>

              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="inline-flex items-center space-x-0.5 bg-[#EF4E3A] text-white px-1.5 py-0.2 rounded text-[10px] font-black">
                  <span>4.3</span>
                  <Star className="h-2 w-2 fill-white" />
                </span>
                {hasVoted && (
                  <span className="text-[10px] font-bold text-[#EF4E3A]">
                    {battle.percentB}% ({battle.votesB} votes)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Vote Action Button */}
          <div className="shrink-0">
            {!hasVoted && battle.isActive ? (
              <button
                onClick={(e) => handleVoteClick(battle.contestantB.id, 'B', e)}
                disabled={isVoting}
                className="px-3.5 py-1.5 bg-white border border-[#EF4E3A] text-[#EF4E3A] hover:bg-[#EF4E3A] hover:text-white text-xs font-black rounded-lg shadow-xs active:scale-95 transition-all"
              >
                {votingSide === 'B' ? 'Voting...' : 'VOTE'}
              </button>
            ) : hasVoted ? (
              <span className="text-xs font-black text-[#EF4E3A]">
                {battle.percentB}%
              </span>
            ) : null}
          </div>
        </div>

        {/* Percentage Progress Bar (When Voted or Completed) */}
        {(hasVoted || !battle.isActive) && (
          <div className="mt-3 pt-2">
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden flex">
              <div
                style={{ width: `${battle.percentA}%` }}
                className="bg-[#0F5132] h-full transition-all duration-500"
              />
              <div
                style={{ width: `${battle.percentB}%` }}
                className="bg-[#EF4E3A] h-full transition-all duration-500"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-[#686B78] mt-1">
              <span>{battle.contestantA.name.split(' ')[0]} ({battle.percentA}%)</span>
              <span>{battle.totalVotes.toLocaleString()} votes cast</span>
              <span>{battle.contestantB.name.split(' ')[0]} ({battle.percentB}%)</span>
            </div>
          </div>
        )}

        {/* Footer Actions (Share & Challenge) */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mt-3">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center space-x-1.5 text-[11px] font-bold text-[#686B78] hover:text-[#02060C] transition-colors"
          >
            <Share2 className="h-3.5 w-3.5 text-[#0F5132]" />
            <span>Share</span>
          </button>

          <button
            onClick={() => setChallengeModalOpen(true)}
            className="flex items-center space-x-1 text-[11px] font-bold text-[#0F5132] hover:text-[#0B3D26] transition-colors"
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Challenge Winner</span>
          </button>
        </div>
      </article>

      {/* Modals */}
      <ShareableBattleCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        battle={battle}
      />

      <ChallengeWinnerModal
        isOpen={challengeModalOpen}
        onClose={() => setChallengeModalOpen(false)}
        battle={battle}
        onSubmitChallenge={handleChallengeSubmit}
      />
    </>
  );
}
