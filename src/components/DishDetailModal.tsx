'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Share2,
  Check,
  Clock,
  ShieldCheck,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Dish, ConsensusVote } from '@/types';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onVote: (dishId: string, vote: ConsensusVote, quickNote?: string) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  onClose,
  onVote,
}) => {
  const [quickNote, setQuickNote] = useState('');
  const [copied, setCopied] = useState(false);

  if (!dish) return null;

  const isMustOrder = dish.consensusPercentage >= 75;
  const isSkip = dish.consensusPercentage <= 40;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(
        `Check out "${dish.name}" at ${dish.restaurantName} (${dish.node}) on Palate: ${dish.consensusPercentage}% consensus!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVoteWithFeedback = (vote: ConsensusVote) => {
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
    onVote(dish.id, vote, quickNote);
    setQuickNote('');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl overflow-hidden transition-all text-[#1C1917]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-[#1C1917] hover:bg-white backdrop-blur-md shadow-md border border-[#E7E5E4]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Banner */}
        <div className="relative aspect-[16/9] w-full bg-[#FAF8F5] overflow-hidden">
          <img
            src={dish.photoUrl}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges on Hero */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="text-white space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 text-[#1C1917] backdrop-blur-md">
                  {dish.node} · {dish.sector}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#A16207] text-white">
                  ₹{dish.priceInr}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {dish.name}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-stone-200">
                <span className="font-medium text-white">{dish.restaurantName}</span>
                {dish.landmark && (
                  <>
                    <span>·</span>
                    <span className="truncate max-w-[280px]">{dish.landmark}</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#1C1917] transition-all shadow-md shrink-0"
              title="Share consensus"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Consensus Scoreboard */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7E5E4] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#78716C]">
                  Community Consensus Score
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-[#1C1917]">
                    {dish.consensusPercentage}%
                  </span>
                  <span className="text-xs font-semibold text-[#15803D]">
                    {isMustOrder
                      ? 'Certified Must Order'
                      : isSkip
                      ? 'Safe to Skip'
                      : 'Contested'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-[#78716C]">
                  {dish.totalVotes} Verified Votes
                </span>
                <div className="flex items-center space-x-2 mt-1 text-xs">
                  <span className="text-[#15803D] font-medium">
                    {dish.mustOrderCount} Order
                  </span>
                  <span className="text-[#A8A29E]">/</span>
                  <span className="text-[#B91C1C] font-medium">
                    {dish.skipCount} Skip
                  </span>
                </div>
              </div>
            </div>

            {/* Ratio Bar */}
            <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-[#E7E5E4] flex">
              <div
                style={{ width: `${dish.consensusPercentage}%` }}
                className="h-full bg-[#15803D]"
              />
              <div
                style={{ width: `${100 - dish.consensusPercentage}%` }}
                className="h-full bg-[#B91C1C]"
              />
            </div>

            {/* Highlight quote */}
            {dish.highlightQuote && (
              <p className="text-xs text-[#44403C] font-editorial italic pt-1">
                "{dish.highlightQuote}"
              </p>
            )}
          </div>

          {/* Quick Vote Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              Cast or Update Your Verdict
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleVoteWithFeedback('must_order')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                  dish.userVote === 'must_order'
                    ? 'bg-[#15803D] text-white border-[#15803D] shadow-sm'
                    : 'bg-white text-[#15803D] border-[#BBF7D0] hover:bg-[#F0FDF4]'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Must Order (+1)</span>
              </button>

              <button
                onClick={() => handleVoteWithFeedback('safe_to_skip')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all ${
                  dish.userVote === 'safe_to_skip'
                    ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-sm'
                    : 'bg-white text-[#B91C1C] border-[#FECACA] hover:bg-[#FEF2F2]'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Safe to Skip (+1)</span>
              </button>
            </div>
          </div>

          {/* Recent Dining Logs */}
          <div className="space-y-3 pt-2 border-t border-[#E7E5E4]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#1C1917]">
                Recent Verified Local Logs
              </span>
              <span className="text-[#78716C] font-mono">
                {dish.recentLogs?.length || 0} entries
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {dish.recentLogs && dish.recentLogs.length > 0 ? (
                dish.recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E5E4] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1C1917]">
                        {log.userHandle}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          log.vote === 'must_order'
                            ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                            : 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                        }`}
                      >
                        {log.vote === 'must_order' ? 'Must Order' : 'Skip'}
                      </span>
                    </div>
                    {log.note && (
                      <p className="text-[#44403C] text-[11px] leading-relaxed">
                        {log.note}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-[#A8A29E] pt-0.5">
                      <span>{log.node}</span>
                      <span>{log.createdAt}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#78716C] bg-[#FAF8F5] rounded-xl border border-dashed border-[#E7E5E4]">
                  No detailed notes yet. Be the first to log this dish!
                </div>
              )}
            </div>
          </div>

          {/* Restaurant Location & External Map Link */}
          <div className="pt-2 border-t border-[#E7E5E4] flex items-center justify-between text-xs text-[#78716C]">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A16207]" />
              <span>
                {dish.restaurantName} · {dish.sector}, {dish.node}
              </span>
            </div>

            {dish.googleMapsUrl && (
              <a
                href={dish.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A16207] hover:underline flex items-center space-x-1 font-medium"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
