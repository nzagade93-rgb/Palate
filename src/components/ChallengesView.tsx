'use client';

// ==============================================================================
// PALATE: ChallengesView
// Displays community proposals challenging winning dishes to start the next battle.
// Redesigned with Warm Editorial Elite styling: balanced rhythm, refined typography,
// and tactile neo-editorial cards.
// ==============================================================================

import React, { useState } from 'react';
import { BattleChallenge } from '@/lib/types';
import { Trophy, Swords, ThumbsUp, PlusCircle, ArrowRight, Sparkles, MapPin, Quote } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Editorial Arena Header */}
      <div className="rounded-2xl border border-[#1C1917]/15 bg-white p-5 sm:p-7 shadow-[3px_3px_0px_#1C1917] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#1C1917]/20 bg-[#FFD11A] px-2.5 py-0.5 text-[10px] font-mono font-black uppercase text-[#1C1917]">
              <Sparkles className="h-3 w-3" />
              <span>The Kingmaker Arena</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#1C1917] uppercase tracking-tight">
              Challenge The Winners
            </h3>
            <p className="text-xs sm:text-sm text-[#1C1917]/70 font-medium leading-relaxed">
              When a champion wins, the debate never ends. Propose a local challenger to dethrone them in the next Navi Mumbai food fight.
            </p>
          </div>

          {onOpenCreateChallenge && (
            <button
              onClick={onOpenCreateChallenge}
              className="btn-yellow px-4 py-3 text-xs font-black uppercase flex items-center justify-center space-x-2 shrink-0 self-start sm:self-auto"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Propose Challenger</span>
            </button>
          )}
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="rounded-2xl border border-[#1C1917]/15 p-10 text-center bg-[#FFFFFF] shadow-[2px_2px_0px_#1C1917]">
            <Trophy className="mx-auto h-10 w-10 text-[#1C1917]/30 mb-2" />
            <h4 className="text-base font-black uppercase text-[#1C1917]">No Active Challenges Yet</h4>
            <p className="text-xs text-[#1C1917]/60 mt-1 max-w-md mx-auto">
              Be the first food critic to challenge a reigning champion from Vashi, Nerul, or Belapur!
            </p>
            {onOpenCreateChallenge && (
              <button
                onClick={onOpenCreateChallenge}
                className="btn-yellow px-4 py-2 text-xs font-black uppercase mt-4"
              >
                Start First Challenge
              </button>
            )}
          </div>
        ) : (
          challenges.map((c) => {
            const hasUpvoted = Boolean(upvotedMap[c.id]);
            const votes = c.upvotes + (hasUpvoted ? 1 : 0);

            return (
              <div
                key={c.id}
                className="rounded-2xl border border-[#1C1917]/15 bg-[#FFFFFF] p-4 sm:p-6 shadow-[3px_3px_0px_#1C1917] space-y-4 transition-all"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1C1917]/10">
                  <div className="inline-flex items-center space-x-1.5 rounded-lg border border-[#1C1917]/15 bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-bold text-[#1C1917]">
                    <MapPin className="h-3 w-3 text-[#A16207]" />
                    <span>{c.neighborhood} • {c.dishCategory}</span>
                  </div>

                  <span className="font-mono text-[10px] font-bold uppercase text-[#1C1917]/50">
                    Chained from: {c.previousBattleTitle}
                  </span>
                </div>

                {/* Matchup & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Contenders Visual Row */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 rounded-xl border border-[#1C1917]/15 bg-[#FFD11A]/20 p-2.5">
                      <Trophy className="h-5 w-5 text-[#A16207]" />
                      <div className="leading-tight">
                        <span className="text-[9px] font-mono font-black uppercase text-[#A16207] block">
                          Reigning Champ
                        </span>
                        <span className="text-xs sm:text-sm font-black text-[#1C1917]">
                          {c.winnerContestantName}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-xs font-black text-[#1C1917]/40 uppercase">
                      VS
                    </span>

                    <div className="flex items-center space-x-2 rounded-xl border border-[#1C1917]/15 bg-[#2748FF]/5 p-2.5">
                      <Swords className="h-5 w-5 text-[#2748FF]" />
                      <div className="leading-tight">
                        <span className="text-[9px] font-mono font-black uppercase text-[#2748FF] block">
                          Challenger
                        </span>
                        <span className="text-xs sm:text-sm font-black text-[#1C1917]">
                          {c.challengerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rally Vote Button */}
                  <button
                    onClick={() => handleUpvote(c.id)}
                    className={`rounded-xl border px-4 py-2 font-mono text-xs font-black flex items-center justify-center space-x-2 transition-all shrink-0 ${
                      hasUpvoted
                        ? 'border-[#00B26B] bg-[#E3F9ED] text-[#008A52] shadow-[2px_2px_0px_#008A52]'
                        : 'border-[#1C1917]/20 bg-white text-[#1C1917] hover:bg-[#FAF8F5] shadow-[2px_2px_0px_#1C1917] active:translate-x-0.5 active:translate-y-0.5'
                    }`}
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 ${hasUpvoted ? 'text-[#008A52]' : 'text-[#1C1917]'}`} />
                    <span>{votes} RALLY VOTES</span>
                  </button>
                </div>

                {/* Contender's Pitch Quote */}
                <div className="rounded-xl border border-[#1C1917]/10 bg-[#FAF8F5] p-3 sm:p-4 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono font-black uppercase text-[#A16207]">
                    <Quote className="h-3 w-3" />
                    <span>The Challenger's Argument:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#1C1917]/85 italic leading-relaxed pl-1">
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
