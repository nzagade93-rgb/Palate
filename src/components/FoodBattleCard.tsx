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
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-[#3A2E28]/15 overflow-hidden bg-[#FFFFFF] p-4 sm:p-6 transition-all hover:shadow-[4px_4px_0px_#3A2E28] shadow-[2px_2px_0px_#3A2E28]"
      >
        {/* Top Header Stamp */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3A2E28]/10 pb-3 mb-3.5">
          <div className="flex items-center space-x-2">
            <span className="stamp-tag bg-[#F6B21A] text-[#3A2E28] font-black text-[10px]">
              {battle.battleType.toUpperCase()} BATTLE
            </span>
            <span className="font-mono text-xs font-bold text-[#3A2E28]/70">
              📍 {battle.neighborhood}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 font-mono text-xs font-bold">
            <span className="inline-block h-2 w-2 rounded-full bg-[#0F5132] animate-pulse" />
            <span className="text-[#3A2E28]">
              {battle.isActive ? 'LIVE BATTLE' : 'COMPLETED'}
            </span>
          </div>
        </div>

        {/* Title & Dish */}
        <div className="mb-4">
          <Link href={battleUrl} className="group">
            <h3 className="text-xl sm:text-2xl font-black text-[#3A2E28] uppercase tracking-tight leading-tight group-hover:text-[#0F5132] transition-colors">
              {battle.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs font-bold text-[#3A2E28]/70">
            Contested Dish: <span className="font-black text-[#3A2E28]">{battle.dishName}</span>
          </p>
        </div>

        {/* Head-to-Head Cards */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 mb-4">
          {/* Contestant A (Forest Green) */}
          <div
            className={`relative flex flex-col justify-between rounded-xl border p-3.5 transition-all ${
              userChoice === battle.contestantA.id
                ? 'border-[#0F5132] bg-[#DCE7D9]/30 ring-1 ring-[#0F5132]'
                : 'border-[#3A2E28]/15 bg-[#FFFFFF]'
            }`}
          >
            {userChoice === battle.contestantA.id && (
              <div className="absolute right-2.5 top-2.5 z-10 flex items-center space-x-1 rounded-full bg-[#0F5132] px-2 py-0.5 text-[9px] font-black text-white">
                <Check className="h-3 w-3 stroke-[3]" />
                <span>YOUR PICK</span>
              </div>
            )}

            <div>
              <span className="inline-block text-[9px] font-mono font-black uppercase text-[#0F5132] bg-[#DCE7D9]/60 border border-[#0F5132]/30 px-2 py-0.5 rounded-md mb-2">
                CONTENDER A
              </span>

              <div className="relative mb-2.5 h-36 w-full overflow-hidden rounded-xl border border-[#3A2E28]/15 bg-[#DCE7D9]/40">
                <img
                  src={battle.contestantA.imageUrl}
                  alt={battle.contestantA.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="font-mono text-[9px] font-black text-[#F6B21A] uppercase tracking-wider block">
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
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono font-black">
                    <span className="text-[11px] text-[#3A2E28]/70">
                      {battle.votesA.toLocaleString()} votes
                    </span>
                    <span className="text-[#0F5132] font-black">{battle.percentA}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#DCE7D9]">
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
                  className="w-full bg-[#0F5132] hover:bg-[#0B3D26] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#3A2E28] transition-all active:translate-x-0.5 active:translate-y-0.5"
                >
                  {votingSide === 'A' ? 'Voting...' : `Vote ${battle.contestantA.name.split(' ')[0]}`}
                </button>
              )}
            </div>
          </div>

          {/* Contestant B (Tomato Red) */}
          <div
            className={`relative flex flex-col justify-between rounded-xl border p-3.5 transition-all ${
              userChoice === battle.contestantB.id
                ? 'border-[#EF4E3A] bg-[#FFF1F0] ring-1 ring-[#EF4E3A]'
                : 'border-[#3A2E28]/15 bg-[#FFFFFF]'
            }`}
          >
            {userChoice === battle.contestantB.id && (
              <div className="absolute right-2.5 top-2.5 z-10 flex items-center space-x-1 rounded-full bg-[#EF4E3A] px-2 py-0.5 text-[9px] font-black text-white">
                <Check className="h-3 w-3 stroke-[3]" />
                <span>YOUR PICK</span>
              </div>
            )}

            <div>
              <span className="inline-block text-[9px] font-mono font-black uppercase text-[#EF4E3A] bg-[#FFF1F0] border border-[#EF4E3A]/30 px-2 py-0.5 rounded-md mb-2">
                CONTENDER B
              </span>

              <div className="relative mb-2.5 h-36 w-full overflow-hidden rounded-xl border border-[#3A2E28]/15 bg-[#DCE7D9]/40">
                <img
                  src={battle.contestantB.imageUrl}
                  alt={battle.contestantB.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <span className="font-mono text-[9px] font-black text-[#F6B21A] uppercase tracking-wider block">
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
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono font-black">
                    <span className="text-[11px] text-[#3A2E28]/70">
                      {battle.votesB.toLocaleString()} votes
                    </span>
                    <span className="text-[#EF4E3A] font-black">{battle.percentB}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#DCE7D9]">
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
                  className="w-full bg-[#EF4E3A] hover:bg-[#D93E2B] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#3A2E28] transition-all active:translate-x-0.5 active:translate-y-0.5"
                >
                  {votingSide === 'B' ? 'Voting...' : `Vote ${battle.contestantB.name.split(' ')[0]}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: View Battle, Share, Challenge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#3A2E28]/10 pt-3 text-xs">
          <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-[#3A2E28]/70">
            <Flame className="h-3.5 w-3.5 text-[#EF4E3A]" />
            <span>{battle.totalVotes.toLocaleString()} community votes</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Share Trigger */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="rounded-xl border border-[#3A2E28]/20 bg-[#FFFFFF] px-3 py-1.5 font-black text-xs text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] hover:bg-[#FFF8EE] transition-all flex items-center space-x-1.5"
              title="Share Battle on WhatsApp/Socials"
            >
              <Share2 className="h-3.5 w-3.5 text-[#3A2E28]" />
              <span>Share</span>
            </button>

            {/* Challenge Winner Trigger */}
            {!battle.isActive && (
              <button
                onClick={() => setChallengeModalOpen(true)}
                className="rounded-xl border border-[#3A2E28] bg-[#F6B21A] px-3 py-1.5 font-black text-xs text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] hover:bg-[#e5a315] transition-all flex items-center space-x-1.5"
                title="Challenge the Winner"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Challenge</span>
              </button>
            )}

            {/* Open Battle Page */}
            <Link
              href={battleUrl}
              className="btn-yellow px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5"
            >
              <span>Arena</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Legal Intermediary Disclaimer (Section 79 IT Act) */}
        <div className="mt-2.5 pt-2 border-t border-[#3A2E28]/10 flex flex-col xs:flex-row items-start xs:items-center justify-between text-[9px] font-mono text-[#3A2E28]/50 gap-1 leading-tight">
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
