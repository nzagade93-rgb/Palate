'use client';

import React from 'react';
import { Plus, Compass, MapPin, Sparkles } from 'lucide-react';
import { NaviMumbaiNode } from '@/types';
import PalateLogo from '@/components/PalateLogo';

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
    <header className="sticky top-0 z-40 bg-[#FFF8EE]/90 backdrop-blur-md border-b border-[#3A2E28]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Masthead Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <PalateLogo size="lg" showTagline={true} />
            <div className="hidden xs:inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase bg-[#DCE7D9] text-[#0F5132] rounded-full border border-[#0F5132]/20">
              Navi Mumbai
            </div>
          </div>

          {/* Node Status Indicator (Desktop) */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-[#3A2E28]/70">
            <div className="flex items-center space-x-2 border-r border-[#3A2E28]/15 pr-6">
              <span className="w-2 h-2 rounded-full bg-[#0F5132] animate-pulse" />
              <span className="font-bold text-[#3A2E28]">6 Nodes Active</span>
              <span className="text-[#3A2E28]/40">·</span>
              <span>{totalDishesCount} Curated Dishes</span>
            </div>

            <button
              onClick={onOpenMethodology}
              className="hover:text-[#0F5132] transition-colors flex items-center space-x-1.5 font-bold py-1 px-2 rounded hover:bg-[#DCE7D9]/30"
            >
              <Compass className="w-3.5 h-3.5 text-[#0F5132]" />
              <span>Consensus Method</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenMethodology}
              className="md:hidden p-2 rounded-xl border border-[#3A2E28]/15 text-[#3A2E28]/70 hover:text-[#3A2E28] hover:bg-white"
              title="Methodology"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              id="log-dish-header-btn"
              onClick={onOpenLogModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0F5132] text-white hover:bg-[#0B3D26] active:scale-[0.98] transition-all shadow-[2px_2px_0px_#3A2E28] font-bold text-xs tracking-wide"
            >
              <Plus className="w-4 h-4 text-[#F6B21A]" />
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
