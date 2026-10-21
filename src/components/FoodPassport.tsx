'use client';

// ==============================================================================
// PALATE: User Profile & Food Passport with Crest Perks & Rewards
// Displays voting activity, battle badges, AND customer Crest Points perks
// (bill discounts, free menu items, VIP table reservations, critic crest).
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodPassport as FoodPassportType } from '@/lib/types';
import {
  X,
  User,
  Trophy,
  Utensils,
  MapPin,
  Swords,
  Check,
  Share2,
  Copy,
  Sparkles,
  Shield,
  Ticket,
  Clock,
  Gift,
  AlertCircle,
} from 'lucide-react';
import {
  getCrestBalance,
  getRedeemedPerks,
  AVAILABLE_CREST_PERKS,
  CREST_EARNING_RULES,
  redeemPerk,
  RedeemedPerk,
} from '@/lib/crestSystem';

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
  const [activeTab, setActiveTab] = useState<'passport' | 'perks'>('passport');
  const [crestBalance, setCrestBalance] = useState<number>(75);
  const [redeemedPerks, setRedeemedPerks] = useState<RedeemedPerk[]>([]);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);
  const [redeemErrorMsg, setRedeemErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCrestBalance(getCrestBalance());
      setRedeemedPerks(getRedeemedPerks());
    }

    const handleUpdate = () => {
      setCrestBalance(getCrestBalance());
      setRedeemedPerks(getRedeemedPerks());
    };

    window.addEventListener('palate_crest_updated', handleUpdate);
    return () => window.removeEventListener('palate_crest_updated', handleUpdate);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShare = () => {
    if (!passport) return;
    const text = `🎖️ My PALATE Food Fight Passport:\nRank: Level ${passport.levelNumber} (${passport.levelTitle})\n🔥 Battles Voted: ${passport.dishesTriedCount}\n🛡️ Crest Points: ${crestBalance} CP\n📍 Nodes Explored: ${passport.neighborhoodsExploredCount}\n\nJoin the Navi Mumbai Food Battles at https://palate.app`;

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

  const handleRedeem = (perkId: string) => {
    setRedeemErrorMsg(null);
    setRedeemSuccessMsg(null);
    const res = redeemPerk(perkId);
    if (res.success && res.perk) {
      setRedeemSuccessMsg(`Successfully claimed: ${res.perk.title}! Coupon: ${res.perk.couponCode}`);
      setCrestBalance(getCrestBalance());
      setRedeemedPerks(getRedeemedPerks());
      setTimeout(() => setRedeemSuccessMsg(null), 5000);
    } else {
      setRedeemErrorMsg(res.error || 'Failed to redeem perk');
      setTimeout(() => setRedeemErrorMsg(null), 4000);
    }
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
              <div className="flex items-center gap-1.5">
                <span className="stamp-tag text-[9px] py-0.5 px-2 bg-[#2748FF] text-white">
                  VERIFIED VOTER
                </span>
                <span className="stamp-tag text-[9px] py-0.5 px-2 bg-[#FFD11A] text-[#121212]">
                  {crestBalance} CRESTS
                </span>
              </div>
              <h2 className="text-xl font-black text-[#121212] uppercase leading-tight mt-1">
                {passport?.displayName || 'Palate Foodie'}
              </h2>
              <p className="font-mono text-xs text-[#121212]/70 font-bold">
                Device Signature: {passport?.fingerprint ? `${passport.fingerprint.slice(0, 14)}...` : 'Voter #01'}
              </p>
            </div>
          </div>

          {/* Tab Switcher: Passport vs Crest Perks */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button
              onClick={() => setActiveTab('passport')}
              className={`rounded-xl border-2 border-[#121212] py-2 text-xs font-black uppercase transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'passport'
                  ? 'bg-[#FFD11A] text-[#121212] shadow-[2px_2px_0px_#121212]'
                  : 'bg-[#FFFFFF] text-[#121212]/70 hover:bg-[#FAF8F5]'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Food Passport</span>
            </button>

            <button
              onClick={() => setActiveTab('perks')}
              className={`rounded-xl border-2 border-[#121212] py-2 text-xs font-black uppercase transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'perks'
                  ? 'bg-[#FFD11A] text-[#121212] shadow-[2px_2px_0px_#121212]'
                  : 'bg-[#FFFFFF] text-[#121212]/70 hover:bg-[#FAF8F5]'
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-[#A16207]" />
              <span>Crest Perks ({crestBalance} CP)</span>
            </button>
          </div>

          {/* TAB 1: FOOD PASSPORT & BADGES */}
          {activeTab === 'passport' && (
            <div className="space-y-5">
              {/* Rank Title & Level Bar */}
              <div className="poster-card p-4 bg-[#FFFFFF]">
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
              <div className="grid grid-cols-3 gap-2.5 text-center">
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
                  <Shield className="h-4 w-4 text-[#A16207] mx-auto mb-1" />
                  <span className="font-mono text-xl font-black text-[#121212] block">
                    {crestBalance}
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase text-[#121212]/60">
                    Crest Points
                  </span>
                </div>
              </div>

              {/* Favourite Food Categories */}
              <div className="poster-card p-4 bg-[#FFFFFF]">
                <span className="font-mono text-[10px] font-black uppercase text-[#121212]/60 block mb-2">
                  FAVOURITE FOOD FIGHT CATEGORIES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(passport?.favoriteCategories || ['Street Food', 'Pav Bhaji', 'Biryani', 'Seafood', 'Misal Pav']).map((cat) => (
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
                    {passport?.badges?.filter((b) => b.unlocked).length || 0} UNLOCKED
                  </span>
                </div>

                <div className="space-y-2">
                  {passport?.badges?.map((b) => (
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
            </div>
          )}

          {/* TAB 2: CREST PERKS & REWARDS CATALOG */}
          {activeTab === 'perks' && (
            <div className="space-y-5">
              {/* Crest Balance Hero Card */}
              <div className="poster-card p-5 bg-[#FFFFFF] border-2 border-[#121212] shadow-[3px_3px_0px_#FFD11A]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-mono text-[10px] font-black uppercase text-[#121212]/60">
                      YOUR CREST REPUTATION
                    </span>
                    <h3 className="text-2xl font-black text-[#121212] flex items-center gap-1.5">
                      <Shield className="h-6 w-6 text-[#A16207]" />
                      <span>{crestBalance} Crest Points</span>
                    </h3>
                  </div>

                  <span className="rounded-xl border border-[#121212] bg-[#FFD11A] px-3 py-1 text-xs font-mono font-black text-[#121212]">
                    LEVEL {Math.floor(crestBalance / 100) + 1}
                  </span>
                </div>

                <p className="text-xs text-[#121212]/80 leading-relaxed font-medium">
                  Earn Crest Points by voting in battles, checking in with meal receipts, and upvoting iconic Navi Mumbai spots. Redeem your points for exclusive food discounts, free dishes, and VIP table reservations.
                </p>

                {/* Quick Earning Cheat Sheet */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#121212]/15 text-[11px] font-mono">
                  <div className="rounded-lg bg-[#FAF8F5] p-2 border border-[#121212]/10">
                    <span className="font-black text-[#00B26B] block">+10 CP</span>
                    <span className="text-[#121212]/70 text-[10px]">Vote in Battle</span>
                  </div>
                  <div className="rounded-lg bg-[#FAF8F5] p-2 border border-[#121212]/10">
                    <span className="font-black text-[#00B26B] block">+50 CP</span>
                    <span className="text-[#121212]/70 text-[10px]">Receipt Check-in</span>
                  </div>
                  <div className="rounded-lg bg-[#FAF8F5] p-2 border border-[#121212]/10">
                    <span className="font-black text-[#00B26B] block">+5 CP</span>
                    <span className="text-[#121212]/70 text-[10px]">Dish Upvote</span>
                  </div>
                </div>
              </div>

              {/* Status Alert Messages */}
              {redeemSuccessMsg && (
                <div className="rounded-xl border-2 border-[#00B26B] bg-[#E3F9ED] p-3 text-xs font-bold text-[#008A52] flex items-center space-x-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{redeemSuccessMsg}</span>
                </div>
              )}
              {redeemErrorMsg && (
                <div className="rounded-xl border-2 border-[#D92D20] bg-[#FFEBEB] p-3 text-xs font-bold text-[#D92D20] flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{redeemErrorMsg}</span>
                </div>
              )}

              {/* Active Redeemed Vouchers Shelf */}
              {redeemedPerks.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs font-black uppercase text-[#121212] mb-2 flex items-center space-x-1.5">
                    <Ticket className="h-3.5 w-3.5 text-[#2748FF]" />
                    <span>Your Active Redeemed Vouchers ({redeemedPerks.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {redeemedPerks.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-xl border-2 border-[#121212] bg-[#FFFFFF] p-3 shadow-[2px_2px_0px_#121212] flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono text-[9px] font-black uppercase bg-[#2748FF] text-white px-2 py-0.5 rounded">
                            ACTIVE VOUCHER
                          </span>
                          <h5 className="text-xs font-black text-[#121212] mt-1">{v.title}</h5>
                          <p className="font-mono text-sm font-black text-[#2748FF] tracking-wider mt-0.5">
                            {v.couponCode}
                          </p>
                          <span className="font-mono text-[10px] text-[#121212]/60">
                            Valid until {v.expiresAt}
                          </span>
                        </div>
                        <span className="stamp-tag bg-[#00B26B] text-white text-[9px] py-1 px-2.5">
                          READY TO USE
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Perks to Claim */}
              <div>
                <h4 className="font-mono text-xs font-black uppercase text-[#121212] mb-2.5 flex items-center space-x-1.5">
                  <Gift className="h-3.5 w-3.5 text-[#FF5C9A]" />
                  <span>Available Foodie Perks to Unlock</span>
                </h4>

                <div className="space-y-3">
                  {AVAILABLE_CREST_PERKS.map((perk) => {
                    const canAfford = crestBalance >= perk.cost;

                    return (
                      <div
                        key={perk.id}
                        className="poster-card p-4 bg-[#FFFFFF] border-2 border-[#121212] space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className={`stamp-tag text-white text-[9px] py-0.5 px-2 mb-1 ${perk.badgeColor}`}
                            >
                              {perk.categoryLabel}
                            </span>
                            <h5 className="text-sm font-black text-[#121212] leading-tight">
                              {perk.title}
                            </h5>
                            <p className="text-xs font-bold text-[#2748FF]">
                              {perk.tagline}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono text-base font-black text-[#121212] block">
                              {perk.cost} CP
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#121212]/60">
                              Points Needed
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[#121212]/75 leading-relaxed font-medium">
                          {perk.description}
                        </p>

                        <div className="pt-2 border-t border-[#121212]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-[#121212]/60">
                            Nodes: {perk.applicableNodes.slice(0, 3).join(', ')}...
                          </span>

                          <button
                            onClick={() => handleRedeem(perk.id)}
                            disabled={!canAfford}
                            className={`rounded-xl border border-[#121212] px-4 py-2 text-xs font-black uppercase transition-all shadow-[1.5px_1.5px_0px_#121212] ${
                              canAfford
                                ? 'bg-[#FFD11A] text-[#121212] hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5'
                                : 'bg-[#DDD4C2] text-[#121212]/40 cursor-not-allowed shadow-none'
                            }`}
                          >
                            {canAfford ? `Redeem for ${perk.cost} CP` : `Need ${perk.cost - crestBalance} more CP`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

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
