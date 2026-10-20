'use client';

// ==============================================================================
// PALATE: Leaderboard View
// Transparent community popularity rankings across Navi Mumbai dishes & spots
// ==============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, MapPin, Filter, AlertCircle } from 'lucide-react';
import { Restaurant } from '@/lib/types';

interface LeaderboardEntry {
  rank: number;
  restaurant: Restaurant;
  dishName: string;
  winRate: number;
  totalBattles: number;
  totalVotes: number;
  battleType?: string;
}

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  onSelectBattle?: (restaurantId: string) => void;
}

const NODES = ['All', 'Vashi', 'Nerul', 'Belapur', 'Kharghar', 'Seawoods'];
const TYPES = [
  { id: 'All', label: 'All Battle Types' },
  { id: 'dish', label: 'Dish Battles' },
  { id: 'restaurant', label: 'Restaurant Battles' },
  { id: 'debate', label: 'Food Debates' },
];

export default function LeaderboardView({
  entries,
  onSelectBattle,
}: LeaderboardViewProps) {
  const [selectedNode, setSelectedNode] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filtered = entries.filter((e) => {
    if (selectedNode !== 'All' && !e.restaurant.neighborhood.includes(selectedNode)) {
      return false;
    }
    if (selectedType !== 'All' && e.battleType !== selectedType) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="poster-card bg-[#FFFFFF] p-5">
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#121212] bg-[#FFD11A] shadow-[2px_2px_0px_#121212]">
            <Trophy className="h-5 w-5 text-[#121212]" />
          </div>
          <div>
            <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px] py-0.5 px-2">
              COMMUNITY POPULARITY
            </span>
            <h3 className="text-xl font-black text-[#121212] uppercase tracking-tight">
              Navi Mumbai Leaderboards
            </h3>
          </div>
        </div>
        <p className="text-xs text-[#121212]/75 font-medium">
          Rankings are calculated dynamically from verified battle votes. Results reflect crowd consensus, not paid culinary awards.
        </p>

        {/* Filter Controls */}
        <div className="mt-4 pt-3 border-t-2 border-[#121212] flex flex-wrap gap-2">
          {/* Battle Type Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold border-2 border-[#121212] transition-all ${
                  selectedType === t.id
                    ? 'bg-[#FFD11A] shadow-[2px_2px_0px_#121212]'
                    : 'bg-[#FFFFFF] text-[#121212]/70 hover:bg-[#F6EFE2]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Node Chips */}
        <div className="mt-2 flex items-center space-x-1.5 overflow-x-auto">
          {NODES.map((n) => (
            <button
              key={n}
              onClick={() => setSelectedNode(n)}
              className={`rounded-full px-3 py-0.5 font-mono text-[11px] font-bold border border-[#121212] transition-all ${
                selectedNode === n
                  ? 'bg-[#121212] text-[#FFD11A]'
                  : 'bg-[#F6EFE2] text-[#121212] hover:bg-[#DDD4C2]'
              }`}
            >
              {n === 'All' ? 'ALL NODES' : n}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="poster-card p-8 text-center bg-[#FFFFFF]">
            <p className="text-xs font-bold text-[#121212]/70">
              No contenders match this filter selection.
            </p>
          </div>
        ) : (
          filtered.map((item, index) => {
            const isTop3 = item.rank <= 3;
            const rankStyles = [
              'bg-[#FFD11A] text-[#121212] border-2 border-[#121212]', // Gold #1
              'bg-[#DDD4C2] text-[#121212] border-2 border-[#121212]', // Silver #2
              'bg-[#FF5C9A]/20 text-[#121212] border-2 border-[#121212]', // Bronze #3
            ];

            return (
              <motion.div
                key={item.restaurant.id + index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="poster-card bg-[#FFFFFF] p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  {/* Rank Badge */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-black shadow-[2px_2px_0px_#121212] ${
                      isTop3 ? rankStyles[item.rank - 1] : 'border-2 border-[#121212] bg-[#FFFFFF] text-[#121212]'
                    }`}
                  >
                    #{item.rank}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 border-[#121212] bg-[#DDD4C2]">
                    <img
                      src={item.restaurant.imageUrl}
                      alt={item.restaurant.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <h4 className="text-sm font-black text-[#121212] leading-tight">
                      {item.restaurant.name}
                    </h4>
                    <div className="flex items-center space-x-1.5 text-[11px] text-[#121212]/70 font-medium">
                      <MapPin className="h-3 w-3 text-[#121212]" />
                      <span>{item.restaurant.neighborhood}</span>
                    </div>
                    <p className="text-[10px] font-bold text-[#2748FF] line-clamp-1">
                      {item.dishName}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="font-mono text-base font-black text-[#121212]">
                    {item.winRate}% WIN
                  </div>
                  <span className="block font-mono text-[10px] font-bold text-[#121212]/60">
                    {item.totalVotes.toLocaleString()} votes
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
