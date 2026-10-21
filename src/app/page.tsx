'use client';

// ==============================================================================
// PALATE: Home Screen — Battles Arena Feed (Tab 1)
// Native Mobile Application Home Screen:
// - Quick craving search bar (links directly to /explore)
// - Daily Food Clash spotlight card with 1-tap live voting
// - Navi Mumbai Node pills & live status toggle
// - Swiggy-grade food battle cards feed with confetti celebration
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import FoodBattleCard from '@/components/FoodBattleCard';
import CreateBattleModal from '@/components/CreateBattleModal';
import { Battle } from '@/lib/types';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { addCrestPoints } from '@/lib/crestSystem';
import { trackEvent } from '@/lib/analytics';
import {
  Flame,
  Swords,
  Search,
  Sparkles,
  Trophy,
  Plus,
  Clock,
  ArrowRight,
} from 'lucide-react';

const NAVI_MUMBAI_NODES = ['All', 'Vashi', 'Nerul', 'Belapur', 'Kharghar', 'Seawoods'];

export default function HomePage() {
  const router = useRouter();
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');
  const [battleFilter, setBattleFilter] = useState<'live' | 'completed'>('live');

  const [battles, setBattles] = useState<Battle[]>([]);
  const [fingerprint, setFingerprint] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [isCreateBattleOpen, setIsCreateBattleOpen] = useState(false);
  const [crestToast, setCrestToast] = useState<{ msg: string; points: number } | null>(null);

  useEffect(() => {
    const fp = getDeviceFingerprint();
    setFingerprint(fp);

    async function loadBattles() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/battles?fingerprint=${encodeURIComponent(fp)}`);
        const data = await res.json();
        if (data.success && data.battles) {
          setBattles(data.battles);
        }
      } catch (err) {
        console.warn('Error loading battles:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBattles();
  }, []);

  // Handle 1-Tap Vote
  const handleVote = async (battleId: string, chosenContestantId: string): Promise<boolean> => {
    if (!fingerprint) return false;
    setIsVoting(true);

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battle_id: battleId,
          chosen_restaurant_id: chosenContestantId,
          voter_fingerprint: fingerprint,
        }),
      });

      const data = await res.json();
      if (data.success && data.battle) {
        setBattles((prev) =>
          prev.map((b) => (b.id === battleId ? data.battle : b))
        );
        trackEvent('vote_submitted', { battleId, chosenContestantId });
        addCrestPoints(10, 'Voted in food battle');
        setCrestToast({ msg: 'Vote counted! +10 Crest Points earned', points: 10 });
        setTimeout(() => setCrestToast(null), 3000);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsVoting(false);
    }
  };

  // Handle Create Battle
  const handleCreateBattle = async (battleData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battleData),
      });
      const data = await res.json();
      if (data.success && data.battle) {
        setBattles((prev) => [data.battle, ...prev]);
        addCrestPoints(25, 'Created a food battle');
        setIsCreateBattleOpen(false);
        setCrestToast({ msg: 'Battle launched! +25 Crest Points earned', points: 25 });
        setTimeout(() => setCrestToast(null), 3000);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Filtered battles
  const filteredBattles = useMemo(() => {
    return battles.filter((b) => {
      if (battleFilter === 'live' && !b.isActive) return false;
      if (battleFilter === 'completed' && b.isActive) return false;
      if (selectedNeighborhood !== 'All') {
        const inA = b.contestantA?.neighborhood?.toLowerCase().includes(selectedNeighborhood.toLowerCase());
        const inB = b.contestantB?.neighborhood?.toLowerCase().includes(selectedNeighborhood.toLowerCase());
        const inMain = b.neighborhood?.toLowerCase().includes(selectedNeighborhood.toLowerCase());
        if (!inA && !inB && !inMain) return false;
      }
      return true;
    });
  }, [battles, battleFilter, selectedNeighborhood]);

  const dailyClash = battles[0];

  return (
    <div className="min-h-full pb-14">
      {/* Toast Notification */}
      <AnimatePresence>
        {crestToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#02060C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 border border-white/10"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#F6B21A]" />
            <span>{crestToast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Header & Search Prompt Box */}
      <div className="bg-white px-4 pt-3.5 pb-2.5 border-b border-black/[0.04] shadow-xs">
        {/* Craving Search Trigger (Navigates to /explore) */}
        <button
          onClick={() => router.push('/explore')}
          className="w-full flex items-center justify-between bg-[#F4F5F8] text-[#686B78] px-3.5 py-2.5 rounded-xl border border-black/[0.04] hover:bg-gray-200/70 transition-all text-xs font-medium text-left"
        >
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-[#686B78]" />
            <span className="font-semibold text-[#02060C]/80">Craving Biryani, Misal, Shawarma...?</span>
          </div>
          <span className="text-[10px] font-bold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
            Rankings
          </span>
        </button>

        {/* Navi Mumbai Node Chips (Horizontal Scroll) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pt-2.5 -mx-4 px-4">
          {NAVI_MUMBAI_NODES.map((node) => {
            const isSelected = selectedNeighborhood === node;
            return (
              <button
                key={node}
                onClick={() => setSelectedNeighborhood(node)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#0F5132] text-white shadow-xs'
                    : 'bg-[#F4F5F8] text-[#686B78] hover:text-[#02060C] hover:bg-gray-200'
                }`}
              >
                {node === 'All' ? '📍 All Navi Mumbai' : node}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Clash Spotlight Card */}
      {dailyClash && (
        <div className="p-4 pb-2">
          <div className="rounded-2xl bg-gradient-to-br from-[#0F5132] via-[#14532D] to-[#0A331E] text-white p-4 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center space-x-1.5 bg-[#EF4E3A] text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
                <Flame className="h-3 w-3 fill-white" />
                <span>Today&apos;s Daily Clash</span>
              </span>
              <span className="text-[11px] text-white/80 font-bold flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Ends Tonight</span>
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-extrabold tracking-tight leading-snug">
              {dailyClash.title}
            </h2>
            <p className="text-xs text-white/80 mt-0.5 line-clamp-1">
              Contested: <span className="text-[#F6B21A] font-bold">{dailyClash.dishName}</span>
            </p>

            {/* Quick Faceoff Row */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="bg-white/10 rounded-xl p-2 border border-white/10 backdrop-blur-xs">
                <p className="text-xs font-bold truncate text-white">
                  {dailyClash.contestantA.name}
                </p>
                <span className="text-[10px] text-emerald-200 font-semibold block truncate">
                  {dailyClash.contestantA.neighborhood}
                </span>
                <span className="mt-1 inline-block text-xs font-black text-[#F6B21A]">
                  {dailyClash.percentA}% ({dailyClash.votesA} votes)
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-2 border border-white/10 backdrop-blur-xs">
                <p className="text-xs font-bold truncate text-white">
                  {dailyClash.contestantB.name}
                </p>
                <span className="text-[10px] text-emerald-200 font-semibold block truncate">
                  {dailyClash.contestantB.neighborhood}
                </span>
                <span className="mt-1 inline-block text-xs font-black text-[#F6B21A]">
                  {dailyClash.percentB}% ({dailyClash.votesB} votes)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed Filter Strip (Live vs Completed) */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setBattleFilter('live')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              battleFilter === 'live'
                ? 'bg-[#EF4E3A] text-white shadow-xs'
                : 'bg-white text-[#686B78] border border-black/[0.06]'
            }`}
          >
            <Flame className="h-3 w-3" />
            <span>Live Fights</span>
          </button>

          <button
            onClick={() => setBattleFilter('completed')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              battleFilter === 'completed'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'bg-white text-[#686B78] border border-black/[0.06]'
            }`}
          >
            <Trophy className="h-3 w-3" />
            <span>Hall of Fame</span>
          </button>
        </div>

        <button
          onClick={() => setIsCreateBattleOpen(true)}
          className="flex items-center space-x-1 text-xs font-bold text-[#0F5132] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50 hover:bg-emerald-100 transition-colors"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3]" />
          <span>New Battle</span>
        </button>
      </div>

      {/* Battles Feed List */}
      <div className="px-4 space-y-4 mt-1">
        {isLoading ? (
          <div className="space-y-3 py-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white border border-black/[0.06] animate-pulse p-4"
              />
            ))}
          </div>
        ) : filteredBattles.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-black/[0.06] shadow-xs">
            <Swords className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#02060C]">No battles in this node</h3>
            <p className="text-xs text-[#686B78] mt-1">
              Be the first to create a food battle for {selectedNeighborhood}!
            </p>
            <button
              onClick={() => setIsCreateBattleOpen(true)}
              className="mt-3 px-4 py-2 bg-[#0F5132] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              + Launch Battle
            </button>
          </div>
        ) : (
          filteredBattles.map((battle) => (
            <FoodBattleCard
              key={battle.id}
              battle={battle}
              onVote={handleVote}
              isVoting={isVoting}
            />
          ))
        )}
      </div>

      {/* Create Battle Modal */}
      <CreateBattleModal
        isOpen={isCreateBattleOpen}
        onClose={() => setIsCreateBattleOpen(false)}
        onCreateBattle={handleCreateBattle}
      />
    </div>
  );
}
