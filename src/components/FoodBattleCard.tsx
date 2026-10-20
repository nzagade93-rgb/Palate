'use client';

// ==============================================================================
// PALATE: FoodBattleCard (The Primary Growth Engine)
// Indian street poster aesthetic with thick black borders, Team Blue vs Pink,
// real-time voting percentages, and WhatsApp viral share triggers.
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Battle } from '@/lib/types';
import { Swords, Check, Share2, Flame, Trophy, ExternalLink, MessageCircle } from 'lucide-react';
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
        colors: ['#FFD11A', '#2748FF', '#FF5C9A'],
      });
    } catch {}

    await onVote(battle.id, contestantId);
    setVotingSide(null);
  };

  const battleUrl = `/battle/${battle.slug || battle.id}`;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="poster-card overflow-hidden bg-[#FFFFFF] p-4 sm:p-5 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_#121212]"
      >
        {/* Top Header Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#121212] pb-2.5 mb-3.5">
          <div className="flex items-center space-x-2">
            <span className="stamp-tag bg-[#FFD11A]">
              {battle.battleType.toUpperCase()} BATTLE
            </span>
            <span className="font-mono text-xs font-bold text-[#121212]/70">
              📍 {battle.neighborhood}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 font-mono text-xs font-bold">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00B26B] animate-pulse" />
            <span>
              {battle.isActive ? 'LIVE BATTLE' : 'COMPLETED'}
            </span>
          </div>
        </div>

        {/* Title & Dish */}
        <div className="mb-4">
          <Link href={battleUrl} className="group">
            <h3 className="text-xl sm:text-2xl font-black text-[#121212] uppercase tracking-tight leading-tight group-hover:text-[#2748FF] transition-colors">
              {battle.title}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs font-bold text-[#121212]/70">
            Contested Dish: <span className="font-black text-[#121212]">{battle.dishName}</span>
          </p>
        </div>

        {/* Head-to-Head Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4">
          {/* Contestant A (TEAM BLUE) */}
          <div
            className={`relative flex flex-col justify-between rounded-xl border-2 border-[#121212] p-3 transition-all ${
              userChoice === battle.contestantA.id ? 'bg-[#2748FF]/10 ring-2 ring-[#2748FF]' : 'bg-[#FFFFFF]'
            }`}
          >
            {userChoice === battle.contestantA.id && (
              <div className="absolute right-2.5 top-2.5 z-10 flex items-center space-x-1 rounded-full bg-[#2748FF] px-2 py-0.5 text-[9px] font-black text-white border border-[#121212]">
                <Check className="h-3 w-3 stroke-[3]" />
                <span>YOUR PICK</span>
              </div>
            )}

            <div>
              <span className="stamp-tag stamp-blue text-[9px] py-0.5 px-2 mb-2 inline-block">
                TEAM BLUE
              </span>

              <div className="relative mb-2.5 h-32 sm:h-36 w-full overflow-hidden rounded-lg border-2 border-[#121212] bg-[#DDD4C2]">
                <img
                  src={battle.contestantA.imageUrl}
                  alt={battle.contestantA.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <span className="font-mono text-[9px] font-black text-[#FFD11A] uppercase">
                    {battle.contestantA.neighborhood}
                  </span>
                  <h4 className="text-sm font-black leading-tight line-clamp-1">
                    {battle.contestantA.name}
                  </h4>
                </div>
              </div>
            </div>

            {/* Voting Action / Percent Bar */}
            <div>
              {hasVoted || !battle.isActive ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono font-black">
                    <span className="text-[11px] text-[#121212]/70">
                      {battle.votesA.toLocaleString()} votes
                    </span>
                    <span className="text-[#2748FF] font-black">{battle.percentA}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#121212] bg-[#DDD4C2]">
                    <div
                      style={{ width: `${battle.percentA}%` }}
                      className="h-full bg-[#2748FF] transition-all duration-500"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={(e) => handleVoteClick(battle.contestantA.id, 'A', e)}
                  disabled={isVoting}
                  id={`btn-vote-a-${battle.id}`}
                  className="w-full btn-blue py-2 text-xs font-black uppercase tracking-wider"
                >
                  {votingSide === 'A' ? 'Voting...' : `Vote ${battle.contestantA.name.split(' ')[0]}`}
                </button>
              )}
            </div>
          </div>

          {/* Contestant B (TEAM PINK) */}
          <div
            className={`relative flex flex-col justify-between rounded-xl border-2 border-[#121212] p-3 transition-all ${
              userChoice === battle.contestantB.id ? 'bg-[#FF5C9A]/10 ring-2 ring-[#FF5C9A]' : 'bg-[#FFFFFF]'
            }`}
          >
            {userChoice === battle.contestantB.id && (
              <div className="absolute right-2.5 top-2.5 z-10 flex items-center space-x-1 rounded-full bg-[#FF5C9A] px-2 py-0.5 text-[9px] font-black text-white border border-[#121212]">
                <Check className="h-3 w-3 stroke-[3]" />
                <span>YOUR PICK</span>
              </div>
            )}

            <div>
              <span className="stamp-tag stamp-pink text-[9px] py-0.5 px-2 mb-2 inline-block">
                TEAM PINK
              </span>

              <div className="relative mb-2.5 h-32 sm:h-36 w-full overflow-hidden rounded-lg border-2 border-[#121212] bg-[#DDD4C2]">
                <img
                  src={battle.contestantB.imageUrl}
                  alt={battle.contestantB.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <span className="font-mono text-[9px] font-black text-[#FFD11A] uppercase">
                    {battle.contestantB.neighborhood}
                  </span>
                  <h4 className="text-sm font-black leading-tight line-clamp-1">
                    {battle.contestantB.name}
                  </h4>
                </div>
              </div>
            </div>

            {/* Voting Action / Percent Bar */}
            <div>
              {hasVoted || !battle.isActive ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono font-black">
                    <span className="text-[11px] text-[#121212]/70">
                      {battle.votesB.toLocaleString()} votes
                    </span>
                    <span className="text-[#FF5C9A] font-black">{battle.percentB}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#121212] bg-[#DDD4C2]">
                    <div
                      style={{ width: `${battle.percentB}%` }}
                      className="h-full bg-[#FF5C9A] transition-all duration-500"
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={(e) => handleVoteClick(battle.contestantB.id, 'B', e)}
                  disabled={isVoting}
                  id={`btn-vote-b-${battle.id}`}
                  className="w-full btn-pink py-2 text-xs font-black uppercase tracking-wider"
                >
                  {votingSide === 'B' ? 'Voting...' : `Vote ${battle.contestantB.name.split(' ')[0]}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: View Battle, Share, Challenge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-[#121212] pt-3 text-xs">
          <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-[#121212]/70">
            <Flame className="h-3.5 w-3.5 text-[#121212]" />
            <span>{battle.totalVotes.toLocaleString()} community votes</span>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Share Trigger */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="rounded-lg border-2 border-[#121212] bg-[#FFFFFF] px-2.5 py-1.5 font-black text-xs text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A] transition-all flex items-center space-x-1"
              title="Share Battle on WhatsApp/Socials"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>

            {/* Challenge Winner Trigger */}
            {!battle.isActive && (
              <button
                onClick={() => setChallengeModalOpen(true)}
                className="rounded-lg border-2 border-[#121212] bg-[#FFD11A] px-2.5 py-1.5 font-black text-xs text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#ffd83b] transition-all flex items-center space-x-1"
                title="Challenge the Winner"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Challenge</span>
              </button>
            )}

            {/* Open Battle Page */}
            <Link
              href={battleUrl}
              className="btn-yellow px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center space-x-1"
            >
              <span>Arena</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Legal Intermediary Disclaimer (Section 79 IT Act) */}
        <div className="mt-2.5 pt-2 border-t border-[#121212]/10 flex flex-col xs:flex-row items-start xs:items-center justify-between text-[9px] font-mono text-[#121212]/50 gap-1 leading-tight">
          <span>⚡ Community Intermediary (Sec 79 IT Act)</span>
          <span>Voluntary polls • Not a health or commercial audit</span>
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
