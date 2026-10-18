'use client';

import React from 'react';
import { Plus, Compass, MapPin, Sparkles } from 'lucide-react';
import { NaviMumbaiNode } from '@/types';

interface HeaderProps {
  onOpenLogModal: () => void;
  onOpenMethodology: () => void;
  selectedNode: NaviMumbaiNode | 'All';
  onSelectNode: (node: NaviMumbaiNode | 'All') => void;
  totalDishesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLogModal,
  onOpenMethodology,
  selectedNode,
  totalDishesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E5E4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Masthead Brand */}
          <div className="flex items-baseline space-x-3 cursor-pointer group">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] font-editorial">
                  PALATE
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase bg-[#FEF3C7] text-[#A16207] rounded border border-[#FDE68A]">
                  Navi Mumbai
                </span>
              </div>
              <span className="text-[11px] font-medium tracking-wider uppercase text-[#78716C] mt-0.5">
                Vol. I · Hyper-Local Dish Consensus
              </span>
            </div>
          </div>

          {/* Node Status Indicator (Desktop) */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-[#78716C]">
            <div className="flex items-center space-x-2 border-r border-[#E7E5E4] pr-6">
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse" />
              <span className="font-medium text-[#1C1917]">6 Nodes Active</span>
              <span className="text-[#A8A29E]">·</span>
              <span>{totalDishesCount} Curated Dishes</span>
            </div>

            <button
              onClick={onOpenMethodology}
              className="hover:text-[#A16207] transition-colors flex items-center space-x-1.5 font-medium py-1 px-2 rounded hover:bg-[#FAF8F5]"
            >
              <Compass className="w-3.5 h-3.5 text-[#A16207]" />
              <span>Consensus Method</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenMethodology}
              className="md:hidden p-2 rounded-lg border border-[#E7E5E4] text-[#78716C] hover:text-[#1C1917] hover:bg-white"
              title="Methodology"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              id="log-dish-header-btn"
              onClick={onOpenLogModal}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#1C1917] text-white hover:bg-[#292524] active:scale-[0.98] transition-all shadow-sm font-medium text-xs tracking-wide"
            >
              <Plus className="w-4 h-4 text-[#FEF3C7]" />
              <span>Log Dish</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 bg-white/20 text-[10px] rounded font-mono">
                3-Tap
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
