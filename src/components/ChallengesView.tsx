'use client';

// ==============================================================================
// PALATE: ChallengesView
// Displays community proposals challenging winning dishes to start the next battle
// ==============================================================================

import React, { useState } from 'react';
import { BattleChallenge } from '@/lib/types';
import { Trophy, Swords, ThumbsUp, PlusCircle, ArrowRight } from 'lucide-react';

interface ChallengesViewProps {
  challenges: BattleChallenge[];
  onOpenCreateChallenge?: () => void;
}

export default function ChallengesView({
  challenges,
  onOpenCreateChallenge,
}: ChallengesViewProps) {
  const [upvotedMap, setUpvotedMap] = useState<Record<string, boolean>>({});

  const handleUpvote = (id: string) => {
    setUpvotedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="poster-card bg-[#FFD11A] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="stamp-tag bg-[#121212] text-[#FFD11A] mb-1.5">
              THE KINGMAKER ARENA
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#121212] uppercase tracking-tight">
              Challenge The Winners
            </h3>
            <p className="text-xs text-[#121212] font-semibold mt-0.5 max-w-lg">
              When a champion wins, the debate never ends. Propose a new contender to take them down in the next battle.
            </p>
          </div>

          {onOpenCreateChallenge && (
            <button
              onClick={onOpenCreateChallenge}
              className="btn-white px-4 py-2.5 text-xs font-black uppercase flex items-center justify-center space-x-1.5 shrink-0"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Propose Challenger</span>
            </button>
          )}
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {challenges.length === 0 ? (
          <div className="poster-card p-8 text-center bg-[#FFFFFF]">
            <Trophy className="mx-auto h-8 w-8 text-[#121212]/40 mb-2" />
            <h4 className="text-base font-black uppercase">No Active Challenges Yet</h4>
            <p className="text-xs text-[#121212]/70 mt-1">
              Be the first to challenge a reigning champion!
            </p>
          </div>
        ) : (
          challenges.map((c) => {
            const hasUpvoted = Boolean(upvotedMap[c.id]);
            const votes = c.upvotes + (hasUpvoted ? 1 : 0);

            return (
              <div
                key={c.id}
                className="poster-card bg-[#FFFFFF] p-4 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#121212] pb-2 mb-3">
                  <span className="stamp-tag bg-[#DDD4C2] text-[#121212] text-[10px]">
                    📍 {c.neighborhood} • {c.dishCategory}
                  </span>

                  <span className="font-mono text-[10px] font-black uppercase text-[#121212]/60">
                    CHAINED FROM: {c.previousBattleTitle}
                  </span>
                </div>

                {/* Matchup */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-xl border-2 border-[#121212] bg-[#FFD11A] p-2 text-center">
                      <Trophy className="h-5 w-5 text-[#121212] mx-auto" />
                      <span className="font-mono text-[9px] font-black uppercase block mt-0.5">
                        CHAMPION
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-[#121212]">
                        {c.winnerContestantName}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-xs font-black text-[#2748FF] uppercase">
                        <span>VS. CHALLENGER:</span>
                        <span className="underline decoration-[#FF5C9A] decoration-2">
                          {c.challengerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Upvote CTA */}
                  <button
                    onClick={() => handleUpvote(c.id)}
                    className={`rounded-xl border-2 border-[#121212] px-3.5 py-2 font-mono text-xs font-black flex items-center space-x-1.5 transition-all shadow-[2px_2px_0px_#121212] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                      hasUpvoted ? 'bg-[#00B26B] text-white' : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{votes} RALLY VOTES</span>
                  </button>
                </div>

                {/* Why Quote */}
                <div className="rounded-lg border-2 border-[#121212] bg-[#F6EFE2] p-2.5">
                  <span className="font-mono text-[10px] font-black uppercase text-[#121212]/70 block">
                    THE CONTENDER'S PITCH:
                  </span>
                  <p className="text-xs font-bold text-[#121212] mt-0.5 italic">
                    "{c.reason}"
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
