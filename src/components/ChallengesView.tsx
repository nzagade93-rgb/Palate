'use client';

// ==============================================================================
// PALATE: ChallengesView (Swiggy-Grade Clean Modern Aesthetic)
// Displays community proposals challenging winning dishes to start the next battle.
// ==============================================================================

import React, { useState } from 'react';
import { BattleChallenge } from '@/lib/types';
import { Trophy, Swords, ThumbsUp, PlusCircle, MapPin, Quote, Sparkles } from 'lucide-react';

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
      {/* Editorial Arena Header */}
      <div className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-amber-50 text-[#02060C] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-amber-200/50">
              <Sparkles className="h-3 w-3 text-[#F6B21A]" />
              <span>Battle Arena</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#02060C] tracking-tight">
              Challenge Reigning Champions
            </h3>
            <p className="text-xs text-[#686B78] font-normal leading-relaxed">
              When a champion wins, the debate never ends. Propose a local contender to challenge them in the next food battle.
            </p>
          </div>

          {onOpenCreateChallenge && (
            <button
              onClick={onOpenCreateChallenge}
              className="btn-forest px-4 py-2.5 text-xs font-bold rounded-full flex items-center justify-center space-x-2 shrink-0 self-start sm:self-auto shadow-sm"
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
          <div className="rounded-2xl border border-gray-100 p-10 text-center bg-white shadow-xs">
            <Trophy className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <h4 className="text-base font-bold text-[#02060C]">No Active Challenges Yet</h4>
            <p className="text-xs text-[#686B78] mt-1 max-w-md mx-auto">
              Be the first foodie to challenge a reigning champion from Vashi, Nerul, or Belapur!
            </p>
            {onOpenCreateChallenge && (
              <button
                onClick={onOpenCreateChallenge}
                className="btn-forest px-4 py-2 text-xs font-bold rounded-full mt-4"
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
                className="rounded-2xl border border-black/[0.06] bg-white p-4 sm:p-5 shadow-xs hover:shadow-md space-y-3.5 transition-all"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
                  <div className="inline-flex items-center space-x-1.5 rounded-full bg-gray-50 border border-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#02060C]">
                    <MapPin className="h-3 w-3 text-[#EF4E3A]" />
                    <span>{c.neighborhood} • {c.dishCategory}</span>
                  </div>

                  <span className="text-[11px] font-medium text-[#686B78]">
                    Chained from: {c.previousBattleTitle}
                  </span>
                </div>

                {/* Matchup & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Contenders Visual Row */}
                  <div className="flex items-center space-x-2.5">
                    <div className="flex items-center space-x-2 rounded-xl border border-amber-200/60 bg-amber-50/50 p-2.5">
                      <Trophy className="h-4 w-4 text-[#F6B21A]" />
                      <div className="leading-tight">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                          Reigning Champ
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#02060C]">
                          {c.winnerContestantName}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-black text-gray-400 uppercase">
                      VS
                    </span>

                    <div className="flex items-center space-x-2 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-2.5">
                      <Swords className="h-4 w-4 text-[#0F5132]" />
                      <div className="leading-tight">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F5132] block">
                          Challenger
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#02060C]">
                          {c.challengerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rally Vote Button */}
                  <button
                    onClick={() => handleUpvote(c.id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold flex items-center justify-center space-x-2 transition-all shrink-0 ${
                      hasUpvoted
                        ? 'bg-emerald-50 text-[#0F5132] border border-emerald-200'
                        : 'bg-white border border-gray-200 text-[#02060C] hover:bg-gray-50 shadow-xs'
                    }`}
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 ${hasUpvoted ? 'fill-[#0F5132]' : ''}`} />
                    <span>{votes} Rally Votes</span>
                  </button>
                </div>

                {/* Contender's Pitch Quote */}
                <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-3 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-[#686B78]">
                    <Quote className="h-3 w-3" />
                    <span>The Challenger&apos;s Argument:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-normal text-[#02060C] italic leading-relaxed pl-1">
                    &ldquo;{c.reason}&rdquo;
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
