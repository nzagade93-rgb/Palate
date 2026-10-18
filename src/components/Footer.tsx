'use client';

import React from 'react';
import { Heart, MapPin, Database, Sparkles } from 'lucide-react';
import { NaviMumbaiNode } from '@/types';
import { NAVI_MUMBAI_NODES } from '@/lib/mockData';

interface FooterProps {
  onSelectNode: (node: NaviMumbaiNode) => void;
  onOpenLogModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectNode, onOpenLogModal }) => {
  return (
    <footer className="mt-20 border-t border-[#E7E5E4] bg-white py-12 text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Colophon */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-[#1C1917] font-editorial">
                PALATE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-[#FEF3C7] text-[#A16207] rounded border border-[#FDE68A]">
                Navi Mumbai
              </span>
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed max-w-md">
              A hyper-local, dish-first food discovery platform built exclusively for Navi Mumbai diners. We curate genuine binary consensus so you never waste a meal on an overhyped menu item.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#A8A29E] pt-2">
              <Database className="w-3.5 h-3.5 text-[#A16207]" />
              <span>PostgreSQL & Supabase Architecture with Instant Local Fallback</span>
            </div>
          </div>

          {/* Municipal Nodes Index */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-3 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A16207]" />
              <span>Covered Nodes</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#78716C]">
              {NAVI_MUMBAI_NODES.map((node) => (
                <li key={node}>
                  <button
                    onClick={() => {
                      onSelectNode(node);
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                    className="hover:text-[#A16207] hover:underline transition-colors"
                  >
                    {node} Food Consensus
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contribute & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A16207]" />
              <span>Get Involved</span>
            </h4>
            <p className="text-xs text-[#78716C] mb-3 leading-relaxed">
              Know an iconic dish in Belapur or a hidden dosa stall in Sanpada? Log it in under 10 seconds.
            </p>
            <button
              onClick={onOpenLogModal}
              className="px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E7E5E4] font-medium text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-all"
            >
              + Log a Local Dish
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A8A29E] gap-4">
          <div>
            © 2026 Palate Inc. Handcrafted for Navi Mumbai food lovers.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[#1C1917] font-medium">Warm Editorial Elite Design System</span>
            <span>·</span>
            <span>Light-Mode Exclusive</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
