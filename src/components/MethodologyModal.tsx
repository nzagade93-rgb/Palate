'use client';

import React from 'react';
import { X, ShieldCheck, Scale, Award, HeartHandshake } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-[#1C1917]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4]">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#A16207]">
              Editorial Colophon
            </span>
            <h3 className="text-xl font-bold tracking-tight text-[#1C1917] font-editorial">
              The Palate Consensus Methodology
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs text-[#44403C] leading-relaxed">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0 text-[#A16207]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1917] text-sm">
                1. Binary Verdicts, Zero 5-Star Ambiguity
              </h4>
              <p className="mt-1">
                Star ratings are broken—a 4.2 star restaurant often serves mediocre appetizers and stellar biryani. Palate asks one unambiguous question: <em>"Must Order"</em> or <em>"Safe to Skip"</em>.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center shrink-0 text-[#15803D]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1917] text-sm">
                2. Dish-Level Granularity
              </h4>
              <p className="mt-1">
                We celebrate the signature culinary marvels of Navi Mumbai. You don’t visit Mahesh Lunch Home for general seafood—you go for the <strong>Butter Garlic Surmai & Ghee Neer Dosa</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#E7E5E4] flex items-center justify-center shrink-0 text-[#1C1917]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#1C1917] text-sm">
                3. Hyper-Local Navi Mumbai Nodes
              </h4>
              <p className="mt-1">
                Navi Mumbai is not a monolith. Our platform maps real neighborhood patterns across <strong>Vashi, Nerul, Belapur, Kharghar, Seawoods, and Sanpada</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E7E5E4] flex items-center justify-between text-xs text-[#78716C]">
          <span>Palate · Editorial Standard</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1C1917] text-white font-medium hover:bg-[#292524] transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
