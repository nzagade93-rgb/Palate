'use client';

import React from 'react';
import { ShieldCheck, Flame, ThumbsUp, ThumbsDown, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onScrollToSearch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToSearch }) => {
  return (
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-12 border-b border-[#E7E5E4] overflow-hidden">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 paper-grain pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          {/* Editorial Eyebrow Tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#E7E5E4] mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A16207]" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#78716C]">
              Hyper-Local · Dish-First · Zero Fluff
            </span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1C1917] leading-[1.12] mb-6">
            Know what to order{' '}
            <span className="font-editorial italic font-normal text-[#A16207]">
              before you sit down.
            </span>
          </h1>

          {/* Editorial Rationale */}
          <p className="text-base sm:text-lg text-[#44403C] leading-relaxed mb-8">
            Restaurants have 60-item menus, but only 2 or 3 dishes are truly unforgettable.
            Palate is Navi Mumbai’s community consensus on the single best dish to get at every spot — and the overhyped items you should skip.
          </p>

          {/* Core Tenets Micro-Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-[#E7E5E4] shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center shrink-0">
                <ThumbsUp className="w-4 h-4 text-[#15803D]" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1C1917]">Must Order</div>
                <div className="text-[11px] text-[#78716C]">Consensus &ge; 75% approval</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-[#E7E5E4] shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center shrink-0">
                <ThumbsDown className="w-4 h-4 text-[#B91C1C]" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1C1917]">Safe to Skip</div>
                <div className="text-[11px] text-[#78716C]">Save your appetite & money</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-[#E7E5E4] shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#A16207]" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1C1917]">Navi Mumbai Focus</div>
                <div className="text-[11px] text-[#78716C]">Vashi to Kharghar nodes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
