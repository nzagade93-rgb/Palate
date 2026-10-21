'use client';

// ==============================================================================
// PALATE: Foodie Passport & Rewards Screen (Tab 4)
// Native mobile foodie profile:
// - Digital Foodie ID Card with Level & XP Progress
// - Crest Points Wallet & Local Navi Mumbai Cafe Perks
// - Verified Badges Grid (Vashi Veteran, Spice Crusader, etc.)
// - Cloud Account Sync via Supabase Phone OTP
// - 1-Tap Add to Home Screen (PWA)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Trophy,
  Sparkles,
  Award,
  ChevronRight,
  Receipt,
  Flame,
  CheckCircle2,
  Clock,
  User,
  LogOut,
  Gift,
  ExternalLink,
  Lock,
  Phone,
  Smartphone,
  Share,
  PlusSquare,
} from 'lucide-react';
import { getCrestBalance, addCrestPoints } from '@/lib/crestSystem';
import { getCurrentUser, supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';
import confetti from 'canvas-confetti';

interface BadgeItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  progress: string;
}

const BADGES: BadgeItem[] = [
  {
    id: 'badge-vashi',
    name: 'Vashi Veteran',
    desc: 'Logged 5+ verified food bites in Vashi',
    icon: '🏅',
    unlocked: true,
    progress: '5 / 5 Bites',
  },
  {
    id: 'badge-spice',
    name: 'Spice Crusader',
    desc: 'Voted in 10+ fiery misal & vada pav battles',
    icon: '🌶️',
    unlocked: true,
    progress: '10 / 10 Votes',
  },
  {
    id: 'badge-receipt',
    name: 'Receipt Connoisseur',
    desc: 'Verified 3 food bites with authentic receipts',
    icon: '🧾',
    unlocked: true,
    progress: '3 / 3 Bills',
  },
  {
    id: 'badge-consensus',
    name: 'Consensus Maker',
    desc: 'Voted for winning dishes in 5 community clashes',
    icon: '👑',
    unlocked: false,
    progress: '3 / 5 Wins',
  },
  {
    id: 'badge-gem',
    name: 'Gem Hunter',
    desc: 'Discovered an undiscovered local tapri in Navi Mumbai',
    icon: '💎',
    unlocked: false,
    progress: '0 / 1 Gem',
  },
  {
    id: 'badge-night',
    name: 'Midnight Craver',
    desc: 'Participated in a late-night street food battle',
    icon: '🌙',
    unlocked: false,
    progress: '0 / 1 Battle',
  },
];

const PERKS = [
  {
    id: 'perk-coffee',
    name: 'Free Filter Coffee',
    restaurant: 'Mysore Cafe, Vashi',
    cost: 100,
    icon: '☕',
  },
  {
    id: 'perk-discount',
    name: '₹100 Off on Bill',
    restaurant: 'Persian Darbar, Belapur',
    cost: 200,
    icon: '🍛',
  },
  {
    id: 'perk-sandwich',
    name: 'Buy 1 Get 1 Sandwich',
    restaurant: 'Gupta Snacks, Vashi',
    cost: 150,
    icon: '🥪',
  },
];

export default function PassportPage() {
  const [crestBalance, setCrestBalance] = useState(75);
  const [user, setUser] = useState<any>(null);
  const [redeemedPerk, setRedeemedPerk] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    setCrestBalance(getCrestBalance());
    const handleUpdate = () => setCrestBalance(getCrestBalance());
    window.addEventListener('palate_crest_updated', handleUpdate);

    // Check supabase user
    getCurrentUser().then((u) => setUser(u));

    return () => window.removeEventListener('palate_crest_updated', handleUpdate);
  }, []);

  const handleRedeem = (perk: typeof PERKS[0]) => {
    if (crestBalance < perk.cost) {
      alert(`You need ${perk.cost} Crest Points to claim this perk! Log more bites or vote in battles.`);
      return;
    }

    addCrestPoints(-perk.cost, `Redeemed ${perk.name} at ${perk.restaurant}`);
    setRedeemedPerk(perk.name);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0F5132', '#F6B21A'],
      });
    } catch {}

    setTimeout(() => setRedeemedPerk(null), 3500);
  };

  return (
    <div className="min-h-full pb-28 px-4 py-4 space-y-4">
      {/* Redemptions Alert Toast */}
      <AnimatePresence>
        {redeemedPerk && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0F5132] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
          >
            <Gift className="h-4 w-4 text-[#F6B21A]" />
            <span>Perk Claimed: {redeemedPerk}! Show code at venue.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digital Foodie Identity Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F5132] via-[#14532D] to-[#062412] text-white p-5 shadow-lg relative overflow-hidden">
        {/* Background Watermark */}
        <Shield className="absolute -right-6 -bottom-6 h-36 w-36 text-white/[0.05] pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              👑
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base font-extrabold tracking-tight">
                  {user ? (user.user_metadata?.display_name || user.phone || 'Verified Foodie') : 'Navi Mumbai Foodie'}
                </h1>
                <span className="text-[10px] font-bold bg-[#F6B21A] text-[#02060C] px-1.5 py-0.2 rounded-xs">
                  {user ? 'VERIFIED' : 'PRO'}
                </span>
              </div>
              <p className="text-xs text-white/70 font-medium">
                {user ? (user.phone ? `📱 ${user.phone}` : `✉️ ${user.email}`) : '@foodie_nm_42 • Local Level'}
              </p>
            </div>
          </div>

          <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
            Level 3
          </span>
        </div>

        {/* Level Title & XP Progress */}
        <div className="mt-5 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-emerald-200">Spice Scout</span>
            <span className="text-white/80">420 / 600 XP</span>
          </div>

          {/* XP Bar */}
          <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden p-[1px] border border-white/10">
            <div className="h-full bg-gradient-to-r from-[#F6B21A] to-amber-300 rounded-full w-[70%]" />
          </div>
          <p className="text-[10px] text-white/60 mt-1 font-medium">
            180 XP to unlock Level 4: Culinary Judge (+1.5x vote weight)
          </p>
        </div>
      </div>

      {/* Cloud Account Sync Card (Supabase Mobile OTP) */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-3.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center shrink-0 border border-emerald-200/50">
            <Phone className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-extrabold text-[#02060C] truncate">
              {user ? 'Cloud Profile Active' : 'Sync Profile & Crest Points'}
            </h3>
            <p className="text-[10px] text-[#686B78] truncate">
              {user ? 'Cross-device sync enabled via Supabase' : 'Sign in with 1-tap mobile OTP'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs ${
            user
              ? 'bg-gray-100 text-[#02060C] hover:bg-gray-200'
              : 'bg-[#0F5132] text-white hover:bg-[#0B3D26] active:scale-95'
          }`}
        >
          {user ? 'Account' : 'Sign In'}
        </button>
      </div>

      {/* Crest Points Wallet Container */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#F6B21A]/20 text-[#0F5132] flex items-center justify-center">
              <Shield className="h-5 w-5 fill-[#F6B21A]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#686B78] uppercase tracking-wider block">
                Crest Balance
              </span>
              <div className="text-xl font-black text-[#02060C] flex items-center space-x-1">
                <span>{crestBalance}</span>
                <span className="text-xs text-[#0F5132] font-extrabold">CP</span>
              </div>
            </div>
          </div>

          <Link
            href="/checkin"
            className="px-3 py-1.5 bg-[#0F5132] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B3D26] active:scale-95 transition-all"
          >
            + Earn CP
          </Link>
        </div>

        {/* How to earn quick row */}
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center">
          <div className="bg-[#F4F5F8] rounded-xl p-2">
            <span className="text-[10px] text-[#686B78] font-bold block">Vote</span>
            <span className="text-xs font-black text-[#0F5132]">+10 CP</span>
          </div>
          <div className="bg-[#F4F5F8] rounded-xl p-2">
            <span className="text-[10px] text-[#686B78] font-bold block">Log Bite</span>
            <span className="text-xs font-black text-[#0F5132]">+25 CP</span>
          </div>
          <div className="bg-[#F4F5F8] rounded-xl p-2">
            <span className="text-[10px] text-[#686B78] font-bold block">Bill Photo</span>
            <span className="text-xs font-black text-[#F6B21A]">+50 CP</span>
          </div>
        </div>
      </div>

      {/* PWA: Add to Home Screen Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200/60 p-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-[#0F5132] text-white flex items-center justify-center shrink-0">
              <Smartphone className="h-4 w-4 text-[#F6B21A]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-extrabold text-[#02060C] truncate">
                Add Palate to Home Screen
              </h3>
              <p className="text-[10px] text-[#686B78] truncate">
                Native app icon, offline caching & fastest load
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInstallGuide(!showInstallGuide)}
            className="shrink-0 px-3 py-1.5 bg-[#0F5132] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0B3D26] active:scale-95 transition-all"
          >
            {showInstallGuide ? 'Close' : 'Install'}
          </button>
        </div>

        {/* Safari / Android Step-by-Step Guidance */}
        {showInstallGuide && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-3 pt-3 border-t border-emerald-200/50 text-[11px] text-[#02060C] space-y-1.5"
          >
            <p className="font-extrabold text-[#0F5132]">How to install on your phone:</p>
            <div className="flex items-center space-x-2 text-[#475569]">
              <span>📱 <strong>iPhone Safari:</strong> Tap Share</span>
              <Share className="h-3.5 w-3.5 text-[#0F5132]" />
              <span>→ tap <strong>Add to Home Screen</strong></span>
              <PlusSquare className="h-3.5 w-3.5 text-[#0F5132]" />
            </div>
            <div className="text-[#475569]">
              <span>🤖 <strong>Android Chrome:</strong> Tap top menu (⋮) → tap <strong>Install App</strong></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Redeemable Perks Section */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold text-[#02060C] flex items-center space-x-1.5">
            <Gift className="h-4 w-4 text-[#EF4E3A]" />
            <span>Redeem Crest Perks</span>
          </h2>
          <span className="text-[10px] text-[#686B78] font-bold">Partner Cafes</span>
        </div>

        <div className="space-y-2">
          {PERKS.map((perk) => (
            <div
              key={perk.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 transition-all bg-[#F4F5F8]/50"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="text-xl shrink-0">{perk.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[#02060C] truncate">{perk.name}</h3>
                  <p className="text-[10px] text-[#686B78] truncate">{perk.restaurant}</p>
                </div>
              </div>

              <button
                onClick={() => handleRedeem(perk)}
                disabled={crestBalance < perk.cost}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  crestBalance >= perk.cost
                    ? 'bg-[#0F5132] text-white hover:bg-[#0B3D26] shadow-xs active:scale-95'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {perk.cost} CP
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Badges Grid */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold text-[#02060C] flex items-center space-x-1.5">
            <Award className="h-4 w-4 text-[#F6B21A]" />
            <span>Achievement Badges</span>
          </h2>
          <span className="text-[10px] text-[#0F5132] font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
            3 / 6 Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className={`rounded-xl p-2.5 border transition-all flex flex-col justify-between ${
                b.unlocked
                  ? 'bg-emerald-50/40 border-emerald-200/60'
                  : 'bg-gray-50/70 border-gray-200/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xl">{b.icon}</span>
                  {b.unlocked ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#0F5132]" />
                  ) : (
                    <Lock className="h-3 w-3 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xs font-extrabold text-[#02060C] mt-1.5">{b.name}</h3>
                <p className="text-[10px] text-[#686B78] leading-tight mt-0.5">{b.desc}</p>
              </div>

              <div className="mt-2 text-[9px] font-black text-[#0F5132] pt-1 border-t border-black/[0.04]">
                {b.progress}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account & App Settings Strip */}
      <div className="bg-white rounded-2xl border border-black/[0.06] p-2 shadow-xs space-y-1">
        <Link
          href="/privacy"
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-xs font-bold text-[#02060C] transition-colors"
        >
          <span>Privacy Policy</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
        <Link
          href="/terms"
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-xs font-bold text-[#02060C] transition-colors"
        >
          <span>Terms of Service</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
        <Link
          href="/grievance"
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-xs font-bold text-[#02060C] transition-colors"
        >
          <span>Grievance & Support</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
        <Link
          href="/restaurant"
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-xs font-bold text-[#0F5132] transition-colors"
        >
          <span>Partner with Palate (Restaurants)</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
      </div>

      <div className="text-center text-[10px] text-[#94A3B8] font-semibold py-2">
        Palate Application v1.3 • Navi Mumbai Food Consensus Engine
      </div>

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onAuthSuccess={(u) => setUser(u)}
      />
    </div>
  );
}
