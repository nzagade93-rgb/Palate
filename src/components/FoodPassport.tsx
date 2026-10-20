'use client';

// ==============================================================================
// PALATE: User Profile & Food Passport
// Displays voting activity, battles participated in, battles created,
// favourite categories, and achievement badges.
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodPassport as FoodPassportType } from '@/lib/types';
import { X, User, Trophy, Utensils, MapPin, Swords, Check, Share2, Copy, Sparkles, Settings } from 'lucide-react';

interface FoodPassportProps {
  isOpen: boolean;
  onClose: () => void;
  passport: FoodPassportType | null;
}

export default function FoodPassport({
  isOpen,
  onClose,
  passport,
}: FoodPassportProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'badges' | 'settings'>('stats');

  if (!isOpen) return null;

  const handleShare = () => {
    if (!passport) return;
    const text = `🎖️ My PALATE Food Fight Passport:\nRank: Level ${passport.levelNumber} (${passport.levelTitle})\n🔥 Battles Voted: ${passport.dishesTriedCount}\n📍 Neighbourhoods Explored: ${passport.neighborhoodsExploredCount}\n\nJoin the Navi Mumbai Food Battles at https://palate.app`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'My PALATE Passport', text }).catch(() => {});
      return;
    }

    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#121212]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border-[3px] border-[#121212] bg-[#F6EFE2] p-5 sm:p-7 shadow-[8px_8px_0px_#121212]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border-2 border-[#121212] bg-[#FFFFFF] p-1.5 text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Profile Header */}
          <div className="flex items-center space-x-3.5 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#121212] bg-[#FFD11A] shadow-[3px_3px_0px_#121212]">
              <User className="h-7 w-7 text-[#121212]" />
            </div>

            <div>
              <span className="stamp-tag text-[9px] py-0.5 px-2 bg-[#2748FF] text-white">
                VERIFIED VOTER
              </span>
              <h2 className="text-xl font-black text-[#121212] uppercase leading-tight">
                {passport?.displayName || 'Palate Foodie'}
              </h2>
              <p className="font-mono text-xs text-[#121212]/70 font-bold">
                Device Signature: {passport?.fingerprint ? `${passport.fingerprint.slice(0, 14)}...` : 'Voter #01'}
              </p>
            </div>
          </div>

          {/* Rank Title & Level Bar */}
          <div className="poster-card p-4 mb-5 bg-[#FFFFFF]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-mono text-[10px] font-black uppercase text-[#121212]/60">
                  CURRENT RANK
                </span>
                <h3 className="text-base font-black text-[#121212]">
                  {passport?.levelTitle || 'Taste Novice'}
                </h3>
              </div>

              <div className="rounded-lg border-2 border-[#121212] bg-[#FFD11A] px-3 py-1 font-mono text-xs font-black text-[#121212] shadow-[2px_2px_0px_#121212]">
                LEVEL {passport?.levelNumber || 1}
              </div>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full border border-[#121212] bg-[#DDD4C2]">
              <div
                className="h-full bg-[#00B26B] transition-all duration-500"
                style={{ width: `${Math.max(8, passport?.levelProgress || 0)}%` }}
              />
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
            <div className="rounded-xl border-2 border-[#121212] bg-[#FFFFFF] p-3 shadow-[2px_2px_0px_#121212]">
              <Utensils className="h-4 w-4 text-[#2748FF] mx-auto mb-1" />
              <span className="font-mono text-xl font-black text-[#121212] block">
                {passport?.dishesTriedCount || 0}
              </span>
              <span className="font-mono text-[9px] font-bold uppercase text-[#121212]/60">
                Battles Voted
              </span>
            </div>

            <div className="rounded-xl border-2 border-[#121212] bg-[#FFFFFF] p-3 shadow-[2px_2px_0px_#121212]">
              <MapPin className="h-4 w-4 text-[#FF5C9A] mx-auto mb-1" />
              <span className="font-mono text-xl font-black text-[#121212] block">
                {passport?.neighborhoodsExploredCount || 0}
              </span>
              <span className="font-mono text-[9px] font-bold uppercase text-[#121212]/60">
                Nodes Explored
              </span>
            </div>

            <div className="rounded-xl border-2 border-[#121212] bg-[#FFFFFF] p-3 shadow-[2px_2px_0px_#121212]">
              <Swords className="h-4 w-4 text-[#00B26B] mx-auto mb-1" />
              <span className="font-mono text-xl font-black text-[#121212] block">
                {passport?.battlesCreatedCount || 0}
              </span>
              <span className="font-mono text-[9px] font-bold uppercase text-[#121212]/60">
                Battles Pitched
              </span>
            </div>
          </div>

          {/* Favourite Food Categories */}
          <div className="poster-card p-4 mb-5 bg-[#FFFFFF]">
            <span className="font-mono text-[10px] font-black uppercase text-[#121212]/60 block mb-2">
              FAVOURITE FOOD FIGHT CATEGORIES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(passport?.favoriteCategories || ['Street Food', 'Biryani', 'Seafood', 'Misal Pav']).map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-[#121212] bg-[#F6EFE2] px-2.5 py-1 text-xs font-bold text-[#121212]"
                >
                  🔥 {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements / Badges Shelf */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-xs font-black uppercase text-[#121212]">
                ACHIEVEMENT BADGES
              </span>
              <span className="font-mono text-xs font-bold text-[#00B26B]">
                {passport?.badges.filter((b) => b.unlocked).length || 0} UNLOCKED
              </span>
            </div>

            <div className="space-y-2">
              {passport?.badges.map((b) => (
                <div
                  key={b.id}
                  className={`flex items-center justify-between rounded-xl border-2 border-[#121212] p-2.5 ${
                    b.unlocked ? 'bg-[#FFFFFF] shadow-[2px_2px_0px_#121212]' : 'bg-[#DDD4C2]/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl">{b.icon}</span>
                    <div>
                      <h4 className="text-xs font-black text-[#121212]">
                        {b.name}
                      </h4>
                      <p className="text-[10px] text-[#121212]/70 font-medium">
                        {b.description}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] font-black">
                    {b.unlocked ? (
                      <span className="stamp-tag stamp-mint py-0.5 px-2 text-[9px]">EARNED</span>
                    ) : (
                      `${b.current}/${b.target}`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Share Profile CTA */}
          <div className="mt-5 pt-4 border-t-2 border-[#121212] flex space-x-2">
            <button
              onClick={handleShare}
              className="flex-1 btn-yellow py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Profile Card</span>
            </button>
            <button
              onClick={handleShare}
              className="btn-white px-3.5 py-3 text-xs font-black"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
