'use client';

// ==============================================================================
// PALATE: Leaderboard View (Swiggy-Grade Clean Modern Aesthetic)
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
  { id: 'All', label: 'All Battles' },
  { id: 'dish', label: 'Dishes' },
  { id: 'restaurant', label: 'Restaurants' },
  { id: 'debate', label: 'Debates' },
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
      <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#F6B21A] shrink-0">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded mb-0.5">
              Community Consensus
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#02060C] tracking-tight">
              Navi Mumbai Leaderboards
            </h3>
          </div>
        </div>
        <p className="text-xs text-[#686B78] font-normal leading-relaxed">
          Rankings are calculated dynamically from verified battle votes. Results reflect crowd consensus, not paid sponsorships.
        </p>

        {/* Filter Controls */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 items-center">
          {/* Battle Type Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  selectedType === t.id
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'bg-white text-[#686B78] border border-gray-200 hover:text-[#02060C] hover:border-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Node Chips */}
        <div className="mt-2.5 flex items-center space-x-1.5 overflow-x-auto pb-1">
          {NODES.map((n) => (
            <button
              key={n}
              onClick={() => setSelectedNode(n)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                selectedNode === n
                  ? 'bg-[#0F5132] text-white shadow-xs'
                  : 'bg-white text-[#686B78] border border-gray-200 hover:text-[#02060C] hover:border-gray-300'
              }`}
            >
              {n === 'All' ? 'All Nodes' : n}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Entries List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-8 text-center bg-white border border-gray-100 shadow-xs">
            <AlertCircle className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-[#02060C]">
              No contenders found for this filter
            </p>
            <p className="text-xs text-[#686B78] mt-1">
              Try switching back to &apos;All Nodes&apos; or changing the battle type.
            </p>
          </div>
        ) : (
          filtered.map((item, index) => {
            const isTop3 = item.rank <= 3;
            const rankStyles = [
              'bg-[#F6B21A] text-[#02060C]', // Gold #1
              'bg-gray-100 text-[#02060C]',   // Silver #2
              'bg-amber-100 text-amber-900',  // Bronze #3
            ];

            return (
              <motion.div
                key={item.restaurant.id + index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-xl bg-white border border-black/[0.06] p-3.5 flex items-center justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3.5">
                  {/* Rank Badge */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                      isTop3 ? rankStyles[item.rank - 1] : 'bg-gray-50 text-[#686B78]'
                    }`}
                  >
                    #{item.rank}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <img
                      src={item.restaurant.imageUrl}
                      alt={item.restaurant.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <h4 className="text-sm font-bold text-[#02060C] leading-tight">
                      {item.restaurant.name}
                    </h4>
                    <div className="flex items-center space-x-1.5 text-xs text-[#686B78] font-normal mt-0.5">
                      <MapPin className="h-3 w-3 text-[#EF4E3A]" />
                      <span>{item.restaurant.neighborhood}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#0F5132] line-clamp-1 mt-0.5">
                      {item.dishName}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-[#02060C]">
                    {item.winRate}% WIN
                  </div>
                  <span className="block text-xs font-normal text-[#686B78]">
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
