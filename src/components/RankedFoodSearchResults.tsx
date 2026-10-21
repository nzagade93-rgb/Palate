'use client';

// ==============================================================================
// PALATE: Ranked Food Search Results (Community-Ranked Contenders)
// Answers the core diner question: "Where is the best [dish] in Navi Mumbai?"
// Strictly 100% organic & community-voted. NEVER paid promotion.
// Contenders are ranked by total verified votes, upvotes, and win-rate consensus.
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ThumbsUp, MapPin, ExternalLink, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { INITIAL_DISHES } from '@/lib/mockData';
import { Battle } from '@/lib/types';
import { addCrestPoints } from '@/lib/crestSystem';

export interface RankedContender {
  id: string;
  rank: number;
  restaurantName: string;
  dishName: string;
  node: string;
  sector?: string;
  landmark?: string;
  priceInr?: number;
  totalVotes: number;
  consensusPercentage: number;
  highlightQuote?: string;
  googleMapsUrl?: string;
  imageUrl?: string;
  isChampion?: boolean;
}

interface RankedFoodSearchResultsProps {
  searchQuery: string;
  selectedNeighborhood?: string;
  battles?: Battle[];
  onUpvoteContender?: (contenderId: string, restaurantName: string) => void;
  onSelectBattle?: (battleId: string) => void;
}

export default function RankedFoodSearchResults({
  searchQuery,
  selectedNeighborhood = 'All',
  battles = [],
  onUpvoteContender,
  onSelectBattle,
}: RankedFoodSearchResultsProps) {
  // Local upvote state for responsive micro-interactions
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [bonusVotes, setBonusVotes] = useState<Record<string, number>>({});
  const [justAwardedId, setJustAwardedId] = useState<string | null>(null);

  const query = searchQuery.trim().toLowerCase();

  // 1. Gather all dishes matching query from INITIAL_DISHES
  const matchedDishes = INITIAL_DISHES.filter((d) => {
    const inName = d.name.toLowerCase().includes(query);
    const inRest = d.restaurantName.toLowerCase().includes(query);
    const inCategory = d.category.toLowerCase().includes(query);
    const inQuote = d.highlightQuote?.toLowerCase().includes(query) || false;

    // Filter by neighborhood if selected
    if (selectedNeighborhood !== 'All' && d.node.toLowerCase() !== selectedNeighborhood.toLowerCase()) {
      return false;
    }

    return inName || inRest || inCategory || inQuote;
  });

  // 2. Also gather any battle contestants matching query (to ensure complete coverage)
  const battleContenders: RankedContender[] = [];
  battles.forEach((b) => {
    const inDish = b.dishName.toLowerCase().includes(query);
    const inTitle = b.title.toLowerCase().includes(query);

    if (inDish || inTitle) {
      if (b.contestantA) {
        const matchesNodeA =
          selectedNeighborhood === 'All' ||
          b.contestantA.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());
        if (matchesNodeA) {
          battleContenders.push({
            id: b.contestantA.id,
            rank: 0,
            restaurantName: b.contestantA.restaurantName || b.contestantA.name,
            dishName: b.contestantA.signatureDish || b.dishName,
            node: b.contestantA.neighborhood.split(',')[1]?.trim() || b.contestantA.neighborhood,
            sector: b.contestantA.neighborhood.split(',')[0]?.trim(),
            totalVotes: b.contestantA.votes,
            consensusPercentage: Math.round(b.contestantA.percentage),
            highlightQuote: `${b.contestantA.percentage}% win rate in community rivalry`,
            imageUrl: b.contestantA.imageUrl,
            isChampion: b.contestantA.isWinner,
          });
        }
      }
      if (b.contestantB) {
        const matchesNodeB =
          selectedNeighborhood === 'All' ||
          b.contestantB.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());
        if (matchesNodeB) {
          battleContenders.push({
            id: b.contestantB.id,
            rank: 0,
            restaurantName: b.contestantB.restaurantName || b.contestantB.name,
            dishName: b.contestantB.signatureDish || b.dishName,
            node: b.contestantB.neighborhood.split(',')[1]?.trim() || b.contestantB.neighborhood,
            sector: b.contestantB.neighborhood.split(',')[0]?.trim(),
            totalVotes: b.contestantB.votes,
            consensusPercentage: Math.round(b.contestantB.percentage),
            highlightQuote: `${b.contestantB.percentage}% win rate in community rivalry`,
            imageUrl: b.contestantB.imageUrl,
            isChampion: b.contestantB.isWinner,
          });
        }
      }
    }
  });

  // 3. Merge dishes into RankedContenders format
  const dishContenders: RankedContender[] = matchedDishes.map((d) => ({
    id: d.id,
    rank: 0,
    restaurantName: d.restaurantName,
    dishName: d.name,
    node: d.node,
    sector: d.sector,
    landmark: d.landmark,
    priceInr: d.priceInr,
    totalVotes: d.totalVotes,
    consensusPercentage: d.consensusPercentage,
    highlightQuote: d.highlightQuote,
    googleMapsUrl: d.googleMapsUrl,
    imageUrl: d.photoUrl,
    isChampion: d.consensusPercentage >= 95,
  }));

  // Combine and de-duplicate by restaurant name
  const combinedMap = new Map<string, RankedContender>();
  [...dishContenders, ...battleContenders].forEach((item) => {
    const key = (item.restaurantName + '-' + item.dishName).toLowerCase();
    if (!combinedMap.has(key)) {
      combinedMap.set(key, item);
    } else {
      // Pick the one with higher votes
      const existing = combinedMap.get(key)!;
      if (item.totalVotes > existing.totalVotes) {
        combinedMap.set(key, item);
      }
    }
  });

  // 4. Sort strictly by Total Votes + Consensus (NEVER paid!)
  const rankedList: RankedContender[] = Array.from(combinedMap.values())
    .map((item) => ({
      ...item,
      totalVotes: item.totalVotes + (bonusVotes[item.id] || 0),
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      isChampion: index === 0, // #1 gets official Champion Crest!
    }));

  const handleUpvote = (item: RankedContender) => {
    if (upvotedIds[item.id]) return;

    setUpvotedIds((prev) => ({ ...prev, [item.id]: true }));
    setBonusVotes((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    setJustAwardedId(item.id);

    // Award +5 Crest Points
    addCrestPoints(5, `Upvoted ${item.restaurantName} for ${item.dishName}`);

    if (onUpvoteContender) {
      onUpvoteContender(item.id, item.restaurantName);
    }

    setTimeout(() => {
      setJustAwardedId(null);
    }, 2500);
  };

  if (rankedList.length === 0) {
    return (
      <div className="poster-card p-6 bg-[#FFFFFF] border-2 border-[#1C1917] mb-6">
        <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#1C1917]/70 mb-1">
          <AlertCircle className="h-4 w-4 text-[#A16207]" />
          <span>No direct ranked dishes found</span>
        </div>
        <p className="text-xs text-[#1C1917]/80 font-medium">
          We couldn&apos;t find an existing ranked winner for &ldquo;<strong>{searchQuery}</strong>&rdquo;{' '}
          {selectedNeighborhood !== 'All' ? `in ${selectedNeighborhood}` : 'in Navi Mumbai'}.
        </p>
        <p className="text-[11px] text-[#1C1917]/60 mt-2 font-mono">
          Tip: Try searching &ldquo;Pav Bhaji&rdquo;, &ldquo;Vada Pav&rdquo;, &ldquo;Dal Khichdi&rdquo;, &ldquo;Misal&rdquo;, or &ldquo;Seafood&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Search Header Banner with Trust Guarantee */}
      <div className="poster-card p-4 sm:p-5 bg-[#FFFFFF] border-2 border-[#3A2E28] shadow-[4px_4px_0px_#3A2E28]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#3A2E28]/10 pb-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#3A2E28] bg-[#F6B21A] px-2.5 py-0.5 text-[10px] font-mono font-black uppercase text-[#3A2E28] mb-1.5">
              <Trophy className="h-3 w-3" />
              <span>Ranked Community Consensus</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#3A2E28] uppercase tracking-tight">
              Best &ldquo;{searchQuery}&rdquo; in {selectedNeighborhood === 'All' ? 'Navi Mumbai' : selectedNeighborhood}
            </h3>
          </div>

          <div className="inline-flex items-center space-x-1.5 rounded-lg border border-[#0F5132]/30 bg-[#DCE7D9] px-3 py-1.5 text-[11px] font-bold text-[#0F5132] shrink-0">
            <Shield className="h-3.5 w-3.5" />
            <span>100% Community Ranked • Non-Sponsored</span>
          </div>
        </div>

        <p className="text-xs text-[#3A2E28]/70 font-medium pt-2.5 leading-relaxed">
          Rankings are calculated dynamically from verified diner votes, check-ins, and battle results. Restaurants cannot pay for position promotion.
        </p>
      </div>

      {/* Contenders List */}
      <div className="space-y-3">
        {rankedList.map((item) => {
          const isUpvoted = upvotedIds[item.id];
          const isJustAwarded = justAwardedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`poster-card p-4 bg-[#FFFFFF] border-2 transition-all ${
                item.rank === 1
                  ? 'border-[#3A2E28] shadow-[4px_4px_0px_#F6B21A]'
                  : 'border-[#3A2E28]/30 hover:border-[#3A2E28]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Rank & Info */}
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  {/* Rank Badge / Crest */}
                  <div
                    className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border-2 font-mono font-black shadow-[2px_2px_0px_#3A2E28] ${
                      item.rank === 1
                        ? 'border-[#3A2E28] bg-[#F6B21A] text-[#3A2E28]'
                        : item.rank === 2
                        ? 'border-[#3A2E28] bg-[#DCE7D9] text-[#0F5132]'
                        : item.rank === 3
                        ? 'border-[#3A2E28] bg-[#EF4E3A]/15 text-[#EF4E3A]'
                        : 'border-[#3A2E28]/20 bg-[#FFF8EE] text-[#3A2E28]/70'
                    }`}
                  >
                    <span className="text-[10px] leading-none uppercase">RANK</span>
                    <span className="text-lg leading-tight">#{item.rank}</span>
                  </div>

                  {/* Thumbnail if available */}
                  {item.imageUrl && (
                    <div className="hidden sm:block h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 border-[#3A2E28]">
                      <img
                        src={item.imageUrl}
                        alt={item.dishName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {/* Header line with Champion tag */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      {item.rank === 1 && (
                        <span className="inline-flex items-center space-x-1 rounded-md border border-[#3A2E28] bg-[#F6B21A] px-2 py-0.5 text-[9px] font-mono font-black uppercase text-[#3A2E28]">
                          <Trophy className="h-2.5 w-2.5" />
                          <span>CHAMPION CREST</span>
                        </span>
                      )}
                      <span className="rounded-md border border-[#3A2E28]/20 bg-[#FFF8EE] px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase text-[#3A2E28]/80">
                        {item.node}
                      </span>
                      {item.sector && (
                        <span className="text-[10px] text-[#3A2E28]/60 font-medium">
                          {item.sector}
                        </span>
                      )}
                    </div>

                    {/* Restaurant Name */}
                    <h4 className="text-base font-black text-[#3A2E28] leading-snug truncate">
                      {item.restaurantName}
                    </h4>

                    {/* Dish & Price */}
                    <p className="text-xs font-bold text-[#0F5132] line-clamp-1">
                      {item.dishName} {item.priceInr ? `• ₹${item.priceInr}` : ''}
                    </p>

                    {/* Quote / Highlight */}
                    {item.highlightQuote && (
                      <p className="text-[11px] text-[#3A2E28]/70 mt-1 line-clamp-2 leading-relaxed">
                        &ldquo;{item.highlightQuote}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Votes & Interactive Upvote Button */}
                <div className="flex flex-col items-end shrink-0 space-y-2">
                  <div className="text-right">
                    <span className="block font-mono text-sm font-black text-[#3A2E28]">
                      {item.totalVotes.toLocaleString()} Votes
                    </span>
                    <span className="inline-block rounded bg-[#00B26B]/15 px-1.5 py-0.5 font-mono text-[10px] font-black text-[#008A52]">
                      {item.consensusPercentage}% Consensus
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 relative">
                    {/* Upvote Button with Crest Rewards */}
                    <button
                      onClick={() => handleUpvote(item)}
                      disabled={isUpvoted}
                      className={`flex items-center space-x-1 rounded-lg border border-[#1C1917] px-2.5 py-1 text-xs font-bold transition-all shadow-[1.5px_1.5px_0px_#1C1917] ${
                        isUpvoted
                          ? 'bg-[#E3F9ED] text-[#008A52] cursor-default'
                          : 'bg-[#FFD11A] text-[#1C1917] hover:bg-[#FFE066] active:scale-95'
                      }`}
                      title={isUpvoted ? 'Upvoted!' : 'Upvote this stall (+5 Crests)'}
                    >
                      <ThumbsUp className={`h-3 w-3 ${isUpvoted ? 'fill-[#008A52]' : ''}`} />
                      <span>{isUpvoted ? 'Upvoted' : '+1 Upvote'}</span>
                    </button>

                    {/* Directions link if available */}
                    {item.googleMapsUrl && (
                      <a
                        href={item.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-[#1C1917]/20 bg-[#FAF8F5] p-1 text-[#1C1917] hover:bg-[#EFECE6] transition-colors"
                        title="Directions on Google Maps"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}

                    {/* Floating Toast when Upvoted */}
                    <AnimatePresence>
                      {isJustAwarded && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: -24, scale: 1 }}
                          exit={{ opacity: 0, y: -30 }}
                          className="absolute right-0 -top-6 whitespace-nowrap rounded-md bg-[#1C1917] text-[#FFD11A] px-2 py-0.5 text-[9px] font-mono font-black shadow-md flex items-center space-x-1 z-20 pointer-events-none"
                        >
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>+5 CREST POINTS!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
