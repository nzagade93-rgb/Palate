'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ThumbsUp,
  ThumbsDown,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { Dish, ConsensusVote } from '@/types';

interface DishCardProps {
  dish: Dish;
  onVote: (dishId: string, vote: ConsensusVote) => void;
  onSelectDish: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onVote, onSelectDish }) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isMustOrder = dish.consensusPercentage >= 75;
  const isSkip = dish.consensusPercentage <= 40;
  const isContested = !isMustOrder && !isSkip;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(
        `Check out "${dish.name}" at ${dish.restaurantName} (${dish.node}) on Palate: ${dish.consensusPercentage}% consensus!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVoteClick = (e: React.MouseEvent, vote: ConsensusVote) => {
    e.stopPropagation();
    onVote(dish.id, vote);
  };

  return (
    <article
      onClick={() => onSelectDish(dish)}
      className="group relative bg-white rounded-2xl border border-[#E7E5E4] hover:border-[#D6D3D1] transition-all duration-300 editorial-shadow-card hover:editorial-shadow-hover flex flex-col overflow-hidden cursor-pointer"
    >
      {/* 1. Photography & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF8F5]">
        <img
          src={
            imageError
              ? 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80'
              : dish.photoUrl
          }
          alt={dish.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Scrim for crisp badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

        {/* Node Badge & Dietary Emblem (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-white/95 backdrop-blur-md text-[#1C1917] border border-white/40 shadow-sm flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-[#A16207]" />
            <span>{dish.node}</span>
          </span>

          {/* Veg / Non-Veg Emblem */}
          <span
            className={`w-5 h-5 rounded-md bg-white/95 backdrop-blur-md flex items-center justify-center border ${
              dish.isVeg ? 'border-green-600' : 'border-amber-800'
            }`}
            title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dish.isVeg ? 'bg-green-600' : 'bg-amber-800'
              }`}
            />
          </span>
        </div>

        {/* Price Tag in INR (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-tight bg-[#1C1917]/90 text-white backdrop-blur-md border border-white/20 shadow-sm font-mono">
            ₹{dish.priceInr}
          </span>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full bg-white/90 text-[#1C1917] hover:bg-white backdrop-blur-md transition-all shadow-sm"
            title="Share dish"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom Photo Overlay: Consensus Status Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {isMustOrder && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] shadow-sm">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Must Order · {dish.consensusPercentage}%</span>
            </span>
          )}

          {isSkip && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] shadow-sm">
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Safe to Skip · {dish.skipCount} Skip Votes</span>
            </span>
          )}

          {isContested && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#A16207] border border-[#FDE68A] shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contested · {dish.consensusPercentage}%</span>
            </span>
          )}

          <span className="text-[11px] font-mono text-white/90 backdrop-blur-sm bg-black/30 px-2 py-0.5 rounded-full">
            {dish.totalVotes} votes
          </span>
        </div>
      </div>

      {/* 2. Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Restaurant & Sector Info */}
          <div className="flex items-center justify-between text-xs text-[#78716C] mb-1.5">
            <span className="font-medium text-[#44403C] truncate max-w-[200px]">
              {dish.restaurantName}
            </span>
            <span className="text-[#A8A29E] font-mono">
              {dish.sector}
            </span>
          </div>

          {/* Dish Headline */}
          <h2 className="text-lg font-bold text-[#1C1917] tracking-tight group-hover:text-[#A16207] transition-colors leading-snug">
            {dish.name}
          </h2>

          {/* Consensus Progress Ratio Bar */}
          <div className="mt-3 space-y-1">
            <div className="h-1.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E7E5E4] flex">
              <div
                style={{ width: `${dish.consensusPercentage}%` }}
                className="h-full bg-[#15803D] transition-all duration-500"
              />
              <div
                style={{ width: `${100 - dish.consensusPercentage}%` }}
                className="h-full bg-[#B91C1C] transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#78716C] font-mono pt-0.5">
              <span className="text-[#15803D] font-medium">
                {dish.mustOrderCount} Must Order
              </span>
              <span className="text-[#B91C1C] font-medium">
                {dish.skipCount} Skip
              </span>
            </div>
          </div>

          {/* Local Highlight Quote */}
          {dish.highlightQuote && (
            <p className="mt-3.5 text-xs text-[#57534E] leading-relaxed font-editorial italic bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E7E5E4]/80">
              "{dish.highlightQuote}"
            </p>
          )}
        </div>

        {/* 3. Interactive Quick-Vote Footer */}
        <div className="pt-3 border-t border-[#E7E5E4] flex items-center justify-between gap-2">
          <div className="text-[11px] text-[#78716C] font-medium">
            Your Verdict:
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={(e) => handleVoteClick(e, 'must_order')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all ${
                dish.userVote === 'must_order'
                  ? 'bg-[#15803D] text-white border-[#15803D] shadow-sm'
                  : 'bg-white text-[#15803D] border-[#BBF7D0] hover:bg-[#F0FDF4] active:scale-95'
              }`}
              title="Vote Must Order"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Must Order</span>
            </button>

            <button
              onClick={(e) => handleVoteClick(e, 'safe_to_skip')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-all ${
                dish.userVote === 'safe_to_skip'
                  ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-sm'
                  : 'bg-white text-[#B91C1C] border-[#FECACA] hover:bg-[#FEF2F2] active:scale-95'
              }`}
              title="Vote Safe to Skip"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
