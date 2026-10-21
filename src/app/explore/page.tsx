'use client';

// ==============================================================================
// PALATE: Explore & Ranked Dish Directory (Tab 2)
// 100% Organic, Community-Voted Best Dishes across Navi Mumbai.
// Native mobile UX with quick search, node filters, and Swiggy-grade dish cards.
// ==============================================================================

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Trophy,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  X,
  Share2,
} from 'lucide-react';
import { INITIAL_DISHES } from '@/lib/mockData';
import { addCrestPoints } from '@/lib/crestSystem';
import confetti from 'canvas-confetti';

const NAVI_MUMBAI_NODES = ['All', 'Vashi', 'Nerul', 'Belapur', 'Kharghar', 'Seawoods', 'Sanpada'];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [under200, setUnder200] = useState(false);

  // Upvoted dishes local state
  const [endorsedDishes, setEndorsedDishes] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter dishes
  const filteredDishes = useMemo(() => {
    return INITIAL_DISHES.filter((dish) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDish = dish.name.toLowerCase().includes(q);
        const matchesRest = dish.restaurantName.toLowerCase().includes(q);
        const matchesNode = dish.node.toLowerCase().includes(q);
        const matchesCat = dish.category.toLowerCase().includes(q);
        if (!matchesDish && !matchesRest && !matchesNode && !matchesCat) return false;
      }

      // Node filter
      if (selectedNode !== 'All' && dish.node.toLowerCase() !== selectedNode.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && !dish.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }

      // Veg only
      if (vegOnly && !dish.isVeg) {
        return false;
      }

      // Top rated only (consensus >= 88%, which corresponds to 4.4+)
      if (topRatedOnly && dish.consensusPercentage < 88) {
        return false;
      }

      // Under 200
      if (under200 && dish.priceInr && dish.priceInr > 200) {
        return false;
      }

      return true;
    }).sort((a, b) => b.consensusPercentage - a.consensusPercentage || b.totalVotes - a.totalVotes);
  }, [searchQuery, selectedNode, selectedCategory, vegOnly, topRatedOnly, under200]);

  const handleEndorse = (dishId: string, dishName: string) => {
    if (endorsedDishes[dishId]) return;

    setEndorsedDishes((prev) => ({ ...prev, [dishId]: true }));
    addCrestPoints(5, `Endorsed ${dishName}`);

    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#0F5132', '#F6B21A'],
      });
    } catch {}

    setToastMessage(`+5 Crest Points! Endorsed ${dishName}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="min-h-full pb-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#02060C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 border border-white/10"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#F6B21A]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Header & Search Box */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-black/[0.04] shadow-xs sticky top-0 z-20">
        <div className="mb-2">
          <h1 className="text-xl font-extrabold text-[#02060C] tracking-tight">
            Navi Mumbai Food Directory
          </h1>
          <p className="text-xs text-[#686B78] font-medium">
            100% community-ranked dishes. Verified by true foodies.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-[#686B78] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Vada Pav, Biryani, Misal, Shawarma..."
            className="w-full bg-[#F4F5F8] text-[#02060C] text-xs font-semibold pl-10 pr-9 py-2.5 rounded-xl border border-black/[0.04] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:bg-white transition-all placeholder:text-[#94A3B8]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navi Mumbai Node Chips (Horizontal Scroll) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pt-2.5 -mx-4 px-4">
          {NAVI_MUMBAI_NODES.map((node) => {
            const isSelected = selectedNode === node;
            return (
              <button
                key={node}
                onClick={() => setSelectedNode(node)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'bg-[#F4F5F8] text-[#686B78] hover:text-[#02060C] hover:bg-gray-200'
                }`}
              >
                {node === 'All' ? '📍 All Navi Mumbai' : node}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar (Veg, Rating, Price) */}
      <div className="px-4 py-2.5 flex items-center space-x-2 overflow-x-auto scrollbar-none bg-[#F4F5F8]">
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`shrink-0 flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
            vegOnly
              ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
              : 'bg-white text-[#686B78] border-black/[0.06]'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Veg Only</span>
        </button>

        <button
          onClick={() => setTopRatedOnly(!topRatedOnly)}
          className={`shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
            topRatedOnly
              ? 'bg-amber-50 text-amber-800 border-amber-400'
              : 'bg-white text-[#686B78] border-black/[0.06]'
          }`}
        >
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>4.4+ Rated</span>
        </button>

        <button
          onClick={() => setUnder200(!under200)}
          className={`shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
            under200
              ? 'bg-rose-50 text-rose-800 border-rose-300'
              : 'bg-white text-[#686B78] border-black/[0.06]'
          }`}
        >
          <span>₹ Under 200</span>
        </button>
      </div>

      {/* Results Count & Subtitle */}
      <div className="px-4 pt-2 pb-1 flex items-center justify-between">
        <span className="text-xs font-bold text-[#686B78]">
          Showing {filteredDishes.length} ranked dishes
        </span>
        <span className="text-[10px] font-semibold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/40">
          Ranked by Consensus
        </span>
      </div>

      {/* Ranked Dish Cards List */}
      <div className="px-4 space-y-3 mt-2">
        {filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-black/[0.06] shadow-xs">
            <Trophy className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#02060C]">No dishes found</h3>
            <p className="text-xs text-[#686B78] mt-1">
              Try adjusting your search query or neighborhood filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedNode('All');
                setVegOnly(false);
                setTopRatedOnly(false);
                setUnder200(false);
              }}
              className="mt-3 px-4 py-1.5 bg-[#0F5132] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredDishes.map((dish, index) => {
            const rank = index + 1;
            const isEndorsed = endorsedDishes[dish.id];
            const computedRating = (dish.consensusPercentage / 20).toFixed(1);

            return (
              <article
                key={dish.id}
                className="bg-white rounded-2xl border border-black/[0.06] p-3.5 shadow-[0_2px_8px_rgba(2,6,12,0.04)] hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Badge: Rank + Node */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                        rank === 1
                          ? 'bg-[#F6B21A] text-white shadow-xs'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : rank === 3
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-[#686B78]'
                      }`}
                    >
                      #{rank}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#02060C] tracking-tight">
                      {dish.node}
                    </span>
                    {dish.sector && (
                      <span className="text-[10px] text-[#686B78] font-medium">
                        • {dish.sector}
                      </span>
                    )}
                  </div>

                  {/* Swiggy-Style Green Rating Pill */}
                  <div className="flex items-center space-x-1 bg-[#0F5132] text-white px-2 py-0.5 rounded-md text-[11px] font-black tracking-wide shadow-xs">
                    <span>{computedRating}</span>
                    <Star className="h-2.5 w-2.5 fill-white" />
                  </div>
                </div>

                {/* Main Content: Info & Image */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      {/* Veg / Non-Veg Indicator */}
                      <span
                        className={`inline-block h-3.5 w-3.5 border p-[2px] rounded-xs shrink-0 ${
                          dish.isVeg ? 'border-emerald-600' : 'border-rose-600'
                        }`}
                        title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      >
                        <span
                          className={`block h-full w-full rounded-full ${
                            dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        />
                      </span>

                      <h2 className="text-sm font-extrabold text-[#02060C] leading-snug truncate">
                        {dish.name}
                      </h2>
                    </div>

                    <p className="text-xs font-semibold text-[#686B78] truncate">
                      {dish.restaurantName}
                    </p>

                    {dish.priceInr && (
                      <p className="text-xs font-extrabold text-[#02060C] mt-1">
                        ₹{dish.priceInr}
                      </p>
                    )}

                    {dish.highlightQuote && (
                      <p className="text-[11px] text-[#475569] italic mt-1 line-clamp-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                        &ldquo;{dish.highlightQuote}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Food Image */}
                  {dish.photoUrl && (
                    <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-black/[0.04]">
                      <Image
                        src={dish.photoUrl}
                        alt={dish.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Action Strip */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mt-3">
                  <span className="text-[10px] text-[#686B78] font-bold">
                    {dish.totalVotes || 120}+ foodie votes • {dish.consensusPercentage}% consensus
                  </span>

                  <div className="flex items-center space-x-2">
                    {/* Endorse Button */}
                    <button
                      onClick={() => handleEndorse(dish.id, dish.name)}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        isEndorsed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#F4F5F8] text-[#02060C] hover:bg-gray-200'
                      }`}
                    >
                      <Sparkles className="h-3 w-3 text-[#F6B21A]" />
                      <span>{isEndorsed ? 'Endorsed' : '+5 CP Endorse'}</span>
                    </button>

                    {/* Log Bite Link */}
                    <Link
                      href={`/checkin?dish=${encodeURIComponent(dish.name)}&rest=${encodeURIComponent(
                        dish.restaurantName
                      )}&node=${encodeURIComponent(dish.node)}`}
                      className="flex items-center space-x-1 px-3 py-1 bg-[#0F5132] text-white text-[11px] font-bold rounded-lg shadow-xs hover:bg-[#0B3D26] active:scale-95 transition-all"
                    >
                      <span>Log Bite</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
