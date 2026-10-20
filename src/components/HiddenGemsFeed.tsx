'use client';

// ==============================================================================
// CraveClash HiddenGemsFeed: Local Underground Food Radar
// Community-pitched local spots and secret ordering intelligence
// ==============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, ThumbsUp, PlusCircle, Compass } from 'lucide-react';
import { HiddenGem } from '@/lib/types';

interface HiddenGemsFeedProps {
  gems: HiddenGem[];
  onOpenPitch: () => void;
}

export default function HiddenGemsFeed({ gems, onOpenPitch }: HiddenGemsFeedProps) {
  return (
    <div className="space-y-3">
      {/* Pitch CTA Banner */}
      <div className="metallic-card rounded-2xl border border-[#2d2d2d] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#f59e0b]/40 bg-[#1c1407] text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
              Navi Mumbai Food Underground
            </h3>
            <p className="text-xs text-[#a3a3a3]">
              Unheralded food carts and neighborhood gems nominated by verified locals
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPitch}
          className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:opacity-95 active:scale-95 shadow-[0_0_16px_rgba(245,158,11,0.3)] shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Pitch a Spot</span>
        </button>
      </div>

      {/* Gems Cards */}
      <div className="space-y-3">
        {gems.map((gem, index) => (
          <motion.div
            key={gem.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="metallic-card rounded-xl border border-[#282828] p-4 transition-all hover:border-[#383838]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center space-x-1 rounded-md border border-[#2d2d2d] bg-[#171717] px-2 py-0.5 text-[10px] font-mono font-bold text-[#a3a3a3] mb-1.5 uppercase">
                  <MapPin className="h-2.5 w-2.5 text-[#f59e0b]" />
                  <span>{gem.neighborhood}</span>
                </span>
                <h4 className="text-base font-black text-white uppercase">
                  {gem.restaurantName}
                </h4>
              </div>

              <div className="flex items-center space-x-1 rounded-lg border border-[#333333] bg-[#141414] px-2.5 py-1 text-xs text-[#f59e0b] font-black font-scoreboard">
                <ThumbsUp className="h-3 w-3" />
                <span>{gem.upvotes || 1}</span>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-[#222222] bg-[#121212] p-2.5">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#f59e0b]">
                SIGNATURE RECOMMENDATION:
              </span>
              <p className="text-xs font-bold text-[#f5f5f5] mt-0.5">
                {gem.dishRecommendation}
              </p>
            </div>

            {gem.secretTip && (
              <p className="mt-2 text-[11px] text-[#737373] italic">
                💡 <span className="text-[#a3a3a3] font-semibold">Insider Secret:</span> {gem.secretTip}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
