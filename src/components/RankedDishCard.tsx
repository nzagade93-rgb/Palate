'use client';

// ==============================================================================
// PALATE: Ranked Food Card Architecture (Staff UI/UX Component)
// Renders community-ranked dish with rank badge, Veg/Non-Veg marker, 17px bold title,
// quoted foodie review snippet, squircle image, and interactive +5 CP endorse micro-animation.
// ==============================================================================

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Dish } from '@/types';
import confetti from 'canvas-confetti';
import { addCrestPoints } from '@/lib/crestSystem';

interface RankedDishCardProps {
  dish: Dish;
  rank: number;
  onOpenLogBite: (dish: Dish) => void;
  isEndorsedInitially?: boolean;
}

export default function RankedDishCard({
  dish,
  rank,
  onOpenLogBite,
  isEndorsedInitially = false,
}: RankedDishCardProps) {
  const [isEndorsed, setIsEndorsed] = useState(isEndorsedInitially);
  const [voteCount, setVoteCount] = useState(dish.totalVotes || 120);
  const [showFloatingCp, setShowFloatingCp] = useState(false);
  const [imgError, setImgError] = useState(false);

  const computedRating = (dish.consensusPercentage / 20).toFixed(1);

  const handleEndorse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEndorsed) return;

    setIsEndorsed(true);
    setVoteCount((prev) => prev + 1);
    setShowFloatingCp(true);

    // Trigger gamification points
    addCrestPoints(5, `Endorsed ${dish.name}`);

    // Confetti micro-burst near the button
    try {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 18,
        spread: 35,
        origin: { x, y },
        colors: ['#0D4734', '#10B981', '#F59E0B'],
      });
    } catch {}

    // Clear floating CP micro-animation after duration
    setTimeout(() => {
      setShowFloatingCp(false);
    }, 1200);
  };

  return (
    <article className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
      {/* Top Bar of Card */}
      <div className="flex items-center justify-between mb-3">
        {/* Left: Numbered rank badge + Neighborhood & Sector tag */}
        <div className="flex items-center space-x-2 min-w-0">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black shadow-xs ${
              rank === 1
                ? 'bg-[#F59E0B] text-white shadow-[#F59E0B]/20'
                : rank === 2
                ? 'bg-slate-300 text-slate-800'
                : rank === 3
                ? 'bg-amber-700 text-white'
                : 'bg-slate-100 text-slate-600 font-bold'
            }`}
          >
            #{rank}
          </span>

          <div className="flex items-center space-x-1 text-xs font-bold text-slate-800 truncate">
            <span>{dish.node}</span>
            {dish.sector && (
              <span className="text-slate-500 font-semibold truncate">
                • {dish.sector}
              </span>
            )}
          </div>
        </div>

        {/* Right: Green rating badge pill */}
        <div className="flex items-center space-x-1 bg-[#0D4734] text-white px-2.5 py-0.5 rounded-lg text-xs font-black tracking-wide shadow-xs shrink-0">
          <span>{computedRating}</span>
          <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
        </div>
      </div>

      {/* Main Content Row */}
      <div className="flex items-start justify-between gap-3.5 mb-3.5">
        {/* Left Column: Veg/Non-Veg marker, Dish Name, Restaurant, Price, Quoted Review */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start space-x-2 mb-1">
            {/* Veg / Non-Veg icon marker */}
            <div
              className={`w-3.5 h-3.5 border rounded-xs flex items-center justify-center p-[2px] shrink-0 mt-1 bg-white ${
                dish.isVeg ? 'border-[#16A34A]' : 'border-[#DC2626]'
              }`}
              title={dish.isVeg ? 'Pure Veg' : 'Non-Veg'}
            >
              {dish.isVeg ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              ) : (
                <div
                  className="w-0 h-0 border-x-[3px] border-x-transparent border-b-[6px] border-b-[#DC2626]"
                  style={{ borderBottomColor: '#DC2626' }}
                />
              )}
            </div>

            {/* Dish Name: Bold 17px */}
            <h3 className="text-[17px] font-extrabold text-slate-900 leading-snug line-clamp-2 tracking-tight">
              {dish.name}
            </h3>
          </div>

          {/* Restaurant / Stall Name */}
          <p className="text-xs font-semibold text-slate-500 truncate pl-5.5">
            {dish.restaurantName}
          </p>

          {/* Price */}
          {dish.priceInr && (
            <p className="text-xs font-extrabold text-slate-900 mt-1 pl-5.5">
              ₹{dish.priceInr}
            </p>
          )}

          {/* Quoted Foodie Review snippet in a rounded gray pill */}
          {dish.highlightQuote && (
            <div className="mt-2 pl-5.5">
              <p className="text-[11px] text-slate-600 italic bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100 line-clamp-2 leading-relaxed">
                &ldquo;{dish.highlightQuote}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Right Column: 88x88px to 96x96px squircle image with aspect ratio preservation and smooth fallback */}
        <div className="relative w-22 h-22 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-2xs">
          {!imgError && dish.photoUrl ? (
            <Image
              src={dish.photoUrl}
              alt={dish.name}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-2 text-center">
              <span className="text-xl">🍲</span>
              <span className="text-[9px] font-bold mt-1 text-slate-500">Palate</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto gap-2">
        {/* Left: Consensus Metrics */}
        <span className="text-[11px] text-slate-500 font-bold truncate">
          {voteCount}+ foodie votes • {dish.consensusPercentage}% consensus
        </span>

        {/* Right: Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0 relative">
          {/* Floating "+5 CP" Micro-Animation Badge */}
          {showFloatingCp && (
            <div className="absolute -top-7 left-2 z-30 pointer-events-none animate-float-cp">
              <div className="flex items-center space-x-1 bg-[#F59E0B] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white">
                <Sparkles className="h-3 w-3 fill-white" />
                <span>+5 CP</span>
              </div>
            </div>
          )}

          {/* ✨ +5 CP Endorse Button */}
          <button
            onClick={handleEndorse}
            disabled={isEndorsed}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isEndorsed
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-[#FEF3C7] text-[#0D4734] border border-[#F59E0B]/30 hover:bg-[#FDE68A] hover:border-[#F59E0B] active:scale-95 shadow-2xs cursor-pointer'
            }`}
          >
            {isEndorsed ? (
              <>
                <Check className="h-3 w-3 text-emerald-600 stroke-[3]" />
                <span>Endorsed</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 text-[#F59E0B]" />
                <span>+5 CP Endorse</span>
              </>
            )}
          </button>

          {/* Log Bite → Button */}
          <button
            onClick={() => onOpenLogBite(dish)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-[#0D4734] hover:bg-[#082d21] text-white text-xs font-extrabold rounded-xl shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span>Log Bite</span>
            <ArrowRight className="h-3 w-3 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </article>
  );
}
