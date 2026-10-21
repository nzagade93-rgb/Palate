'use client';

// ==============================================================================
// PALATE: Home Page
// India's Food Fights Begin Here.
// Mobile-first food discovery platform where people participate in food battles,
// vote for their favourite dishes, share results, and challenge winning dishes.
// ==============================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import FoodBattleCard from '@/components/FoodBattleCard';
import FoodPassport from '@/components/FoodPassport';
import CreateBattleModal from '@/components/CreateBattleModal';
import ChallengeWinnerModal from '@/components/ChallengeWinnerModal';
import ChallengesView from '@/components/ChallengesView';
import LeaderboardView from '@/components/LeaderboardView';
import InstallPWA from '@/components/InstallPWA';
import AuthModal from '@/components/AuthModal';
import CheckinModal from '@/components/CheckinModal';
import Footer from '@/components/Footer';
import RankedFoodSearchResults from '@/components/RankedFoodSearchResults';
import { addCrestPoints } from '@/lib/crestSystem';

import { Battle, FoodPassport as FoodPassportType, BattleChallenge } from '@/lib/types';
import { getDeviceFingerprint } from '@/lib/fingerprint';
import { trackEvent, recordSharedLinkAttribution } from '@/lib/analytics';
import {
  supabase,
  getCurrentUser,
  fetchCloudCheckins,
  subscribeToCloudCheckins,
  CloudCheckin,
} from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import {
  Flame,
  Swords,
  Trophy,
  Compass,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
  Sparkles,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

const NAVI_MUMBAI_NODES = [
  'All',
  'Vashi',
  'Nerul',
  'Belapur',
  'Kharghar',
  'Seawoods',
];

export default function HomePage() {
  const [activeNavSection, setActiveNavSection] = useState<'battles' | 'explore' | 'leaderboard' | 'challenges'>('battles');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [battles, setBattles] = useState<Battle[]>([]);
  const [passport, setPassport] = useState<FoodPassportType | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<BattleChallenge[]>([]);

  const [fingerprint, setFingerprint] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  // Modals & Cloud State
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isCreateBattleOpen, setIsCreateBattleOpen] = useState(false);
  const [challengeTargetBattle, setChallengeTargetBattle] = useState<Battle | null>(null);

  // Supabase Auth & Cloud Sync
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [cloudCheckins, setCloudCheckins] = useState<CloudCheckin[]>([]);
  const [crestToast, setCrestToast] = useState<{ msg: string; points: number } | null>(null);

  const battlesSectionRef = useRef<HTMLDivElement>(null);

  // Initial Load
  useEffect(() => {
    const fp = getDeviceFingerprint();
    setFingerprint(fp);

    // 1. Supabase Auth listener
    getCurrentUser().then((u) => setCurrentUser(u));
    let authUnsub: (() => void) | undefined;
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user || null);
      });
      authUnsub = () => subscription.unsubscribe();
    }

    // 2. Fetch live Cloud Check-ins & subscribe to Realtime
    fetchCloudCheckins(15).then((list) => {
      if (list && list.length > 0) setCloudCheckins(list);
    });
    const checkinUnsub = subscribeToCloudCheckins((newCheckin) => {
      setCloudCheckins((prev) => [newCheckin, ...prev]);
    });

    async function loadInitialData() {
      try {
        setIsLoading(true);
        // 1. Battles
        const bRes = await fetch(`/api/battles?fingerprint=${encodeURIComponent(fp)}`);
        const bData = await bRes.json();
        if (bData.success && bData.battles) {
          setBattles(bData.battles);
        }

        // 2. Passport
        const pRes = await fetch(`/api/passport?fingerprint=${encodeURIComponent(fp)}`);
        const pData = await pRes.json();
        if (pData.success && pData.passport) {
          setPassport(pData.passport);
        }

        // 3. Leaderboard
        const lbRes = await fetch('/api/leaderboard');
        const lbData = await lbRes.json();
        if (lbData.success && lbData.leaderboard) {
          setLeaderboard(lbData.leaderboard);
        }

        // 4. Challenges
        const cRes = await fetch('/api/challenges');
        const cData = await cRes.json();
        if (cData.success && cData.challenges) {
          setChallenges(cData.challenges);
        }
      } catch (err) {
        console.warn('Error loading PALATE data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    recordSharedLinkAttribution();
    loadInitialData();

    return () => {
      if (authUnsub) authUnsub();
      if (checkinUnsub) checkinUnsub();
    };
  }, []);

  // Vote Handler
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
        if (data.passport) {
          setPassport(data.passport);
        }
        trackEvent('vote_submitted', {
          battleId,
          chosenContestantId,
        });
        // Award Crest Points
        addCrestPoints(10, 'Voted in food battle');
        setCrestToast({ msg: 'Vote counted! +10 Crest Points earned', points: 10 });
        setTimeout(() => setCrestToast(null), 3500);

        // Refresh leaderboard
        fetch('/api/leaderboard')
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setLeaderboard(d.leaderboard);
          })
          .catch(() => {});
        return true;
      } else if (data.alreadyVoted) {
        alert(data.error || 'Already voted in this battle.');
        return false;
      }
    } catch (e) {
      console.error('Vote failed:', e);
    } finally {
      setIsVoting(false);
    }
    return false;
  };

  // Create Battle Handler
  const handleCreateBattle = async (battleData: any): Promise<boolean> => {
    if (!fingerprint) return false;

    try {
      const res = await fetch('/api/battles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...battleData,
          submitter_fingerprint: fingerprint,
        }),
      });

      const data = await res.json();
      if (data.success && data.battle) {
        setBattles((prev) => [data.battle, ...prev]);
        trackEvent('battle_created', {
          battleId: data.battle.id,
          title: data.battle.title,
          battleType: data.battle.battleType,
          neighborhood: data.battle.neighborhood,
        });
        // Refresh passport
        const pRes = await fetch(`/api/passport?fingerprint=${encodeURIComponent(fingerprint)}`);
        const pData = await pRes.json();
        if (pData.success && pData.passport) setPassport(pData.passport);

        // Award Crest Points
        addCrestPoints(30, 'Created food battle');
        setCrestToast({ msg: 'Battle pitched! +30 Crest Points earned', points: 30 });
        setTimeout(() => setCrestToast(null), 3500);
        return true;
      }
    } catch (e) {
      console.error('Create battle failed:', e);
    }
    return false;
  };

  // Submit Challenge Handler
  const handleSubmitChallenge = async (challengeData: any): Promise<boolean> => {
    if (!fingerprint) return false;

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...challengeData,
          submitter_fingerprint: fingerprint,
        }),
      });

      const data = await res.json();
      if (data.success && data.challenge) {
        setChallenges((prev) => [data.challenge, ...prev]);
        // Refresh passport
        const pRes = await fetch(`/api/passport?fingerprint=${encodeURIComponent(fingerprint)}`);
        const pData = await pRes.json();
        if (pData.success && pData.passport) setPassport(pData.passport);

        // Award Crest Points
        addCrestPoints(30, 'Challenged champion dish');
        setCrestToast({ msg: 'Challenger pitched! +30 Crest Points earned', points: 30 });
        setTimeout(() => setCrestToast(null), 3500);
        return true;
      }
    } catch (e) {
      console.error('Challenge submit failed:', e);
    }
    return false;
  };

  const scrollToBattles = () => {
    setActiveNavSection('battles');
    battlesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Section Groups
  const liveBattles = useMemo(() => {
    return battles.filter((b) => b.isActive && b.status !== 'completed');
  }, [battles]);

  const trendingBattles = useMemo(() => {
    return battles.filter((b) => b.isTrending);
  }, [battles]);

  const endingSoonBattles = useMemo(() => {
    return battles.filter((b) => b.isEndingSoon);
  }, [battles]);

  const recentWinners = useMemo(() => {
    return battles.filter((b) => !b.isActive || b.status === 'completed');
  }, [battles]);

  // Filtered Battles (Search + Neighborhood)
  const filteredBattles = useMemo(() => {
    return battles.filter((b) => {
      if (selectedNeighborhood !== 'All') {
        const matchA = b.contestantA.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());
        const matchB = b.contestantB.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase());
        if (!matchA && !matchB && !b.neighborhood.toLowerCase().includes(selectedNeighborhood.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = b.title.toLowerCase().includes(q);
        const inDish = b.dishName.toLowerCase().includes(q);
        const inA = b.contestantA.name.toLowerCase().includes(q);
        const inB = b.contestantB.name.toLowerCase().includes(q);
        if (!inTitle && !inDish && !inA && !inB) return false;
      }
      return true;
    });
  }, [battles, selectedNeighborhood, searchQuery]);

  const handleCheckinSuccess = (newCheckin: CloudCheckin, hasReceipt: boolean) => {
    setCloudCheckins((prev) => [newCheckin, ...prev]);
    const earned = hasReceipt ? 50 : 20;
    addCrestPoints(earned, hasReceipt ? 'Verified receipt check-in' : 'Foodie check-in');
    setCrestToast({
      msg: `Check-in recorded! +${earned} Crest Points earned`,
      points: earned,
    });
    setTimeout(() => setCrestToast(null), 3500);

    if (passport) {
      setPassport((prev) =>
        prev
          ? {
              ...prev,
              dishesTriedCount: prev.dishesTriedCount + 1,
              levelProgress: Math.min(100, prev.levelProgress + (hasReceipt ? 20 : 10)),
            }
          : null
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] pb-28">
      {/* Top Navbar */}
      <Navbar
        passport={passport}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenCreateBattle={() => setIsCreateBattleOpen(true)}
        activeSection={activeNavSection}
        onNavigateSection={(sec: any) => setActiveNavSection(sec)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCheckin={() => setIsCheckinModalOpen(true)}
      />

      {/* FLOATING CREST POINTS TOAST */}
      <AnimatePresence>
        {crestToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-[#3A2E28] text-[#F6B21A] border-2 border-[#F6B21A] px-4 py-2.5 rounded-2xl shadow-[4px_4px_0px_#3A2E28] font-mono text-xs font-black"
          >
            <Sparkles className="h-4 w-4 text-[#F6B21A]" />
            <span>{crestToast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
        {/* COMPACT APP-FIRST HERO BAR */}
        <div className="pb-3 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-[#0F5132] animate-pulse" />
              <span className="font-mono text-[10px] font-black uppercase text-[#0F5132] tracking-wider">
                FOOD WORTH TALKING ABOUT • NAVI MUMBAI
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#3A2E28] uppercase tracking-tight leading-none">
              Trending Dishes &amp; Food Battles{' '}
              <span className="bg-[#EF4E3A] text-white px-2 py-0.5 rounded-md border border-[#3A2E28]/20 text-xs sm:text-sm font-black">
                LIVE
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden xs:inline-flex items-center space-x-1.5 font-mono text-[11px] font-bold text-[#3A2E28]/70 bg-white px-2.5 py-1 rounded-xl border border-[#3A2E28]/15 shadow-xs">
              <Flame className="h-3.5 w-3.5 text-[#EF4E3A]" />
              <span>{liveBattles.length} Clashes</span>
            </span>
            <button
              onClick={() => setIsCreateBattleOpen(true)}
              className="btn-forest px-3 py-1.5 text-xs font-black uppercase flex items-center space-x-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>+ Battle</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Categories (Directly matching official mobile mockup) */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3A2E28]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you craving today? (e.g. Misal Pav, Vada Pav, Biryani)..."
              className="w-full rounded-full border border-[#3A2E28]/20 bg-[#FFFFFF] py-3 pl-10 pr-4 text-xs font-bold text-[#3A2E28] placeholder-[#3A2E28]/45 focus:outline-none focus:ring-2 focus:ring-[#0F5132] shadow-[2px_2px_0px_#3A2E28]"
            />
          </div>

          {/* Quick Category Action Cards (Top Rated, Near Me, Trending, Food Battles) */}
          <div className="grid grid-cols-4 gap-2 pt-0.5">
            <button
              onClick={() => {
                setActiveNavSection('explore');
                setSearchQuery('Misal');
              }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white border border-[#3A2E28]/15 shadow-[2px_2px_0px_#3A2E28] hover:bg-[#FFF8EE] active:translate-y-0.5 transition-all text-center"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F6B21A]/20 text-[#F6B21A] mb-1">
                <Sparkles className="h-4 w-4 text-[#F6B21A]" />
              </div>
              <span className="text-[10px] font-black text-[#3A2E28]">Top Rated</span>
            </button>

            <button
              onClick={() => {
                setSelectedNeighborhood(selectedNeighborhood === 'Vashi' ? 'All' : 'Vashi');
              }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white border border-[#3A2E28]/15 shadow-[2px_2px_0px_#3A2E28] hover:bg-[#FFF8EE] active:translate-y-0.5 transition-all text-center"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EF4E3A]/15 text-[#EF4E3A] mb-1">
                <MapPin className="h-4 w-4 text-[#EF4E3A]" />
              </div>
              <span className="text-[10px] font-black text-[#3A2E28]">Near Me</span>
            </button>

            <button
              onClick={() => {
                setActiveNavSection('battles');
                setSearchQuery('');
              }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white border border-[#3A2E28]/15 shadow-[2px_2px_0px_#3A2E28] hover:bg-[#FFF8EE] active:translate-y-0.5 transition-all text-center"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EF4E3A]/15 text-[#EF4E3A] mb-1">
                <Flame className="h-4 w-4 text-[#EF4E3A]" />
              </div>
              <span className="text-[10px] font-black text-[#3A2E28]">Trending</span>
            </button>

            <button
              onClick={() => {
                setActiveNavSection('battles');
                scrollToBattles();
              }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white border border-[#3A2E28]/15 shadow-[2px_2px_0px_#3A2E28] hover:bg-[#FFF8EE] active:translate-y-0.5 transition-all text-center"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F5132]/15 text-[#0F5132] mb-1">
                <Swords className="h-4 w-4 text-[#0F5132]" />
              </div>
              <span className="text-[10px] font-black text-[#3A2E28]">Food Battles</span>
            </button>
          </div>

          {/* Quick Popular Dish Filters */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] font-bold">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#3A2E28]/50 font-black shrink-0">
              Popular:
            </span>
            {[
              { label: '🧈 Pav Bhaji', query: 'Pav Bhaji' },
              { label: '🥔 Vada Pav', query: 'Vada Pav' },
              { label: '🍲 Dal Khichdi', query: 'Dal Khichdi' },
              { label: '🌶️ Misal Pav', query: 'Misal' },
              { label: '🦀 Coastal Seafood', query: 'Seafood' },
              { label: '🍚 Biryani', query: 'Biryani' },
              { label: '🥞 Dosa', query: 'Dosa' },
            ].map((chip) => (
              <button
                key={chip.query}
                onClick={() => setSearchQuery(searchQuery.toLowerCase() === chip.query.toLowerCase() ? '' : chip.query)}
                className={`whitespace-nowrap shrink-0 rounded-lg px-2.5 py-1 transition-all border ${
                  searchQuery.toLowerCase() === chip.query.toLowerCase()
                    ? 'border-[#3A2E28] bg-[#F6B21A] text-[#3A2E28] shadow-[1.5px_1.5px_0px_#3A2E28]'
                    : 'border-[#3A2E28]/15 bg-[#FFFFFF] text-[#3A2E28]/75 hover:bg-[#FFF8EE]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Node Chips (Smooth edge-to-edge swipe on mobile) */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {NAVI_MUMBAI_NODES.map((node) => (
              <button
                key={node}
                onClick={() => setSelectedNeighborhood(node)}
                className={`whitespace-nowrap shrink-0 rounded-xl px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all border ${
                  selectedNeighborhood === node
                    ? 'border-[#3A2E28] bg-[#0F5132] text-white shadow-[2px_2px_0px_#3A2E28]'
                    : 'border-[#3A2E28]/15 bg-[#FFFFFF] text-[#3A2E28]/70 hover:bg-[#FFF8EE]'
                }`}
              >
                {node === 'All' ? 'ALL NODES' : node}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden sm:flex items-center space-x-2 mb-6">
          <button
            onClick={() => setActiveNavSection('battles')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              activeNavSection === 'battles'
                ? 'bg-[#0F5132] text-white border border-[#3A2E28] shadow-[2px_2px_0px_#3A2E28]'
                : 'bg-white text-[#3A2E28]/70 border border-[#3A2E28]/15 hover:bg-[#FFF8EE]'
            }`}
          >
            <span>🔥</span>
            <span>Live Battles ({liveBattles.length})</span>
          </button>

          <button
            onClick={() => setActiveNavSection('explore')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              activeNavSection === 'explore'
                ? 'bg-[#0F5132] text-white border border-[#3A2E28] shadow-[2px_2px_0px_#3A2E28]'
                : 'bg-white text-[#3A2E28]/70 border border-[#3A2E28]/15 hover:bg-[#FFF8EE]'
            }`}
          >
            <span>📍</span>
            <span>Explore Nodes</span>
          </button>

          <button
            onClick={() => setActiveNavSection('leaderboard')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              activeNavSection === 'leaderboard'
                ? 'bg-[#0F5132] text-white border border-[#3A2E28] shadow-[2px_2px_0px_#3A2E28]'
                : 'bg-white text-[#3A2E28]/70 border border-[#3A2E28]/15 hover:bg-[#FFF8EE]'
            }`}
          >
            <span>🏆</span>
            <span>Leaderboards</span>
          </button>

          <button
            onClick={() => setActiveNavSection('challenges')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              activeNavSection === 'challenges'
                ? 'bg-[#0F5132] text-white border border-[#3A2E28] shadow-[2px_2px_0px_#3A2E28]'
                : 'bg-white text-[#3A2E28]/70 border border-[#3A2E28]/15 hover:bg-[#FFF8EE]'
            }`}
          >
            <span>⚔️</span>
            <span>Challenges ({challenges.length})</span>
          </button>
        </div>

        {/* VIEW 1: BATTLES STREAM */}
        {activeNavSection === 'battles' && (
          <div ref={battlesSectionRef} className="space-y-8">
            {/* IF SEARCHING: SHOW RANKED COMMUNITY CONTENDERS FIRST (100% ORGANIC & NON-PAID) */}
            {searchQuery.trim().length > 0 && (
              <RankedFoodSearchResults
                searchQuery={searchQuery}
                selectedNeighborhood={selectedNeighborhood}
                battles={battles}
                onUpvoteContender={(id, name) => {
                  setCrestToast({ msg: `Upvoted ${name}! +5 Crest Points`, points: 5 });
                  setTimeout(() => setCrestToast(null), 3000);
                }}
              />
            )}

            {/* SECTION A: LIVE BATTLES */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center space-x-2">
                  <span className="flex h-3 w-3 rounded-full bg-[#00B26B] animate-pulse" />
                  <h2 className="text-xl font-black text-[#121212] uppercase tracking-tight">
                    {searchQuery ? `⚔️ Related Battles for "${searchQuery}"` : 'A. Live Food Battles'}
                  </h2>
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-mono text-xs font-bold text-[#D92D20] hover:underline"
                  >
                    Clear Search ✕
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {filteredBattles.filter((b) => b.isActive).map((battle) => (
                  <FoodBattleCard
                    key={battle.id}
                    battle={battle}
                    onVote={handleVote}
                    isVoting={isVoting}
                    onChallengeWinner={handleSubmitChallenge}
                  />
                ))}
              </div>
            </div>

            {/* SECTION B: TRENDING IN NAVI MUMBAI */}
            {trendingBattles.length > 0 && selectedNeighborhood === 'All' && !searchQuery && (
              <div className="pt-4 border-t-2 border-[#121212]/20">
                <div className="flex items-center space-x-2 mb-3.5">
                  <Flame className="h-5 w-5 text-[#FF5C9A]" />
                  <h2 className="text-xl font-black text-[#121212] uppercase tracking-tight">
                    B. Trending in Navi Mumbai
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trendingBattles.slice(0, 2).map((b) => (
                    <div key={b.id} className="poster-card p-4 bg-[#FFFFFF]">
                      <span className="stamp-tag bg-[#FF5C9A] text-white text-[9px] mb-2">
                        TRENDING NOW
                      </span>
                      <h4 className="text-base font-black text-[#121212] uppercase line-clamp-1">
                        {b.title}
                      </h4>
                      <p className="text-xs text-[#121212]/70 font-semibold mb-3">
                        {b.contestantA.name} ({b.percentA}%) vs {b.contestantB.name} ({b.percentB}%)
                      </p>
                      <button
                        onClick={() => handleVote(b.id, b.contestantA.id)}
                        className="btn-yellow w-full py-2 text-xs font-black uppercase"
                      >
                        Vote in Battle
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION C: FOOD BATTLES ENDING SOON */}
            {endingSoonBattles.length > 0 && selectedNeighborhood === 'All' && !searchQuery && (
              <div className="pt-4 border-t-2 border-[#121212]/20">
                <div className="flex items-center space-x-2 mb-3.5">
                  <Clock className="h-5 w-5 text-[#2748FF]" />
                  <h2 className="text-xl font-black text-[#121212] uppercase tracking-tight">
                    C. Food Battles Ending Soon
                  </h2>
                </div>

                <div className="space-y-4">
                  {endingSoonBattles.map((b) => (
                    <FoodBattleCard
                      key={b.id}
                      battle={b}
                      onVote={handleVote}
                      isVoting={isVoting}
                      onChallengeWinner={handleSubmitChallenge}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SECTION D & E: RECENT WINNERS & CHALLENGE A WINNER */}
            <div className="pt-4 border-t-2 border-[#121212]/20">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-[#FFD11A]" />
                  <h2 className="text-xl font-black text-[#121212] uppercase tracking-tight">
                    D. Recent Winners & Reigning Champions
                  </h2>
                </div>
                <button
                  onClick={() => setActiveNavSection('challenges')}
                  className="font-mono text-xs font-black uppercase text-[#2748FF] hover:underline"
                >
                  View All Challenges →
                </button>
              </div>

              <div className="space-y-4">
                {recentWinners.map((b) => (
                  <FoodBattleCard
                    key={b.id}
                    battle={b}
                    onVote={handleVote}
                    isVoting={isVoting}
                    onChallengeWinner={handleSubmitChallenge}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: EXPLORE NAVI MUMBAI */}
        {activeNavSection === 'explore' && (
          <div className="space-y-6">
            <div className="poster-card p-5 bg-[#FFFFFF]">
              <span className="stamp-tag bg-[#FFD11A] mb-2">GEOGRAPHIC EXPLORATION</span>
              <h3 className="text-2xl font-black text-[#121212] uppercase">
                Explore Navi Mumbai Food Nodes
              </h3>
              <p className="text-xs text-[#121212]/75 font-medium mt-1">
                Navi Mumbai is built on culinary nodes. Each sector has its own street king.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
                {['Vashi (Sector 17)', 'Nerul (Station East/West)', 'CBD Belapur (Artist Village)', 'Kharghar (Utsav Chowk)', 'Seawoods (Grand Central)', 'Sanpada (Sector 14)'].map((loc) => {
                  const nodeName = loc.split(' ')[0];
                  return (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedNeighborhood(nodeName);
                        setActiveNavSection('battles');
                      }}
                      className="rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-3 text-left hover:bg-[#FFD11A] transition-all shadow-[2px_2px_0px_#121212]"
                    >
                      <MapPin className="h-4 w-4 text-[#121212] mb-1" />
                      <span className="font-mono text-xs font-black text-[#121212] block">
                        {loc}
                      </span>
                      <span className="text-[10px] text-[#121212]/60 font-semibold block mt-0.5">
                        Browse node battles →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Battle Categories */}
            <div className="poster-card p-5 bg-[#FFFFFF]">
              <h4 className="text-lg font-black text-[#121212] uppercase mb-3">
                Browse By Battle Category
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border-2 border-[#121212] p-3.5 bg-[#2748FF]/10">
                  <span className="font-mono text-xs font-black text-[#2748FF] block mb-1">
                    TYPE A: DISH BATTLES
                  </span>
                  <p className="text-xs text-[#121212]/80 font-bold">
                    Comparing specific dishes from different vendors (e.g. Vada Pav vs Vada Pav).
                  </p>
                </div>

                <div className="rounded-xl border-2 border-[#121212] p-3.5 bg-[#FF5C9A]/10">
                  <span className="font-mono text-xs font-black text-[#FF5C9A] block mb-1">
                    TYPE B: RESTAURANT BATTLES
                  </span>
                  <p className="text-xs text-[#121212]/80 font-bold">
                    Comparing full restaurant dining experiences serving comparable dishes.
                  </p>
                </div>

                <div className="rounded-xl border-2 border-[#121212] p-3.5 bg-[#FFD11A]/20">
                  <span className="font-mono text-xs font-black text-[#121212] block mb-1">
                    TYPE C: FOOD DEBATES
                  </span>
                  <p className="text-xs text-[#121212]/80 font-bold">
                    Fundamental cultural food debates (e.g. Vada Pav vs Pav Bhaji).
                  </p>
                </div>
              </div>
            </div>

            {/* Live Community Food Radar (Supabase Real-Time Check-Ins) */}
            <div className="poster-card p-5 bg-[#FFFFFF] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b-2 border-[#121212]/10">
                <div>
                  <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#121212] bg-[#E3F9ED] px-2.5 py-0.5 text-[10px] font-mono font-black uppercase text-[#008A52] mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00B26B] animate-pulse" />
                    <span>Supabase Cloud Radar</span>
                  </div>
                  <h4 className="text-xl font-black text-[#121212] uppercase tracking-tight">
                    Live Community Check-Ins & Anti-Regret Radar
                  </h4>
                  <p className="text-xs text-[#121212]/70 font-medium">
                    Verified bites logged by diners across Vashi, Nerul, Belapur, Kharghar, and Seawoods.
                  </p>
                </div>

                <button
                  onClick={() => setIsCheckinModalOpen(true)}
                  className="btn-yellow px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  <span>+ Check In Dish</span>
                </button>
              </div>

              {/* Check-ins Feed */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {cloudCheckins.length > 0 ? (
                  cloudCheckins.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-3.5 rounded-xl border-2 border-[#121212] bg-[#F6EFE2] shadow-[2px_2px_0px_#121212] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-sm text-[#121212]">
                            {chk.dish_name}
                          </span>
                          <span className="text-xs text-[#121212]/60 font-bold">
                            @ {chk.venue_name}
                          </span>
                        </div>

                        {chk.note && (
                          <p className="text-xs text-[#121212]/80 font-medium italic">
                            "{chk.note}"
                          </p>
                        )}

                        <div className="flex items-center space-x-2 text-[10px] font-mono text-[#121212]/60 pt-0.5">
                          <span>{chk.user_name || 'Anonymous Diner'}</span>
                          <span>•</span>
                          <span>
                            {new Date(chk.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-lg border-2 text-[10px] font-black uppercase tracking-wider ${
                            chk.reaction === 'GOD_TIER'
                              ? 'border-[#008A52] bg-[#E3F9ED] text-[#008A52]'
                              : 'border-[#D92D20] bg-[#FFEBEB] text-[#D92D20]'
                          }`}
                        >
                          {chk.reaction === 'GOD_TIER' ? 'GOD TIER 🔥' : 'SKIP ❌'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center rounded-xl border-2 border-dashed border-[#121212]/30 text-xs font-bold text-[#121212]/60 space-y-2">
                    <p>No check-ins logged yet today. Be the first to check in!</p>
                    <button
                      onClick={() => setIsCheckinModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg border-2 border-[#121212] bg-[#FFD11A] text-xs font-black uppercase shadow-[2px_2px_0px_#121212]"
                    >
                      Post First Check-In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: LEADERBOARDS */}
        {activeNavSection === 'leaderboard' && (
          <LeaderboardView entries={leaderboard} />
        )}

        {/* VIEW 4: CHALLENGES */}
        {activeNavSection === 'challenges' && (
          <ChallengesView
            challenges={challenges}
            onOpenCreateChallenge={() => {
              if (recentWinners[0]) {
                setChallengeTargetBattle(recentWinners[0]);
              } else {
                alert('Select an active battle card to challenge its winner!');
              }
            }}
          />
        )}

        {/* PALATE REFACTORED LEGAL & STATUTORY FOOTER */}
        <Footer />
      </main>

      {/* CREATE BATTLE MODAL */}
      <CreateBattleModal
        isOpen={isCreateBattleOpen}
        onClose={() => setIsCreateBattleOpen(false)}
        onCreateBattle={handleCreateBattle}
      />

      {/* CHALLENGE WINNER MODAL */}
      {challengeTargetBattle && (
        <ChallengeWinnerModal
          isOpen={Boolean(challengeTargetBattle)}
          onClose={() => setChallengeTargetBattle(null)}
          battle={challengeTargetBattle}
          onSubmitChallenge={handleSubmitChallenge}
        />
      )}

      {/* FOOD PASSPORT MODAL */}
      <FoodPassport
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        passport={passport}
      />

      {/* SUPABASE AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={setCurrentUser}
      />

      {/* CHECK-IN & RECEIPT MODAL */}
      <CheckinModal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        currentUser={currentUser}
        onCheckinSuccess={handleCheckinSuccess}
      />

      {/* INSTALL PWA BANNER */}
      <InstallPWA />

      {/* NATIVE MOBILE STICKY BOTTOM APP BAR (THUMB ZONE) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#3A2E28]/15 bg-[#FFF8EE]/95 backdrop-blur-lg px-2 py-1.5 shadow-[0_-4px_16px_rgba(58,46,40,0.08)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveNavSection('battles')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeNavSection === 'battles'
                ? 'text-[#0F5132] font-black'
                : 'text-[#3A2E28]/50 font-bold hover:text-[#3A2E28]'
            }`}
          >
            <Flame className={`h-5 w-5 ${activeNavSection === 'battles' ? 'text-[#EF4E3A] fill-[#EF4E3A]' : ''}`} />
            <span className="text-[10px] mt-0.5">Battles</span>
          </button>

          <button
            onClick={() => setActiveNavSection('explore')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeNavSection === 'explore'
                ? 'text-[#0F5132] font-black'
                : 'text-[#3A2E28]/50 font-bold hover:text-[#3A2E28]'
            }`}
          >
            <Compass className={`h-5 w-5 ${activeNavSection === 'explore' ? 'text-[#0F5132]' : ''}`} />
            <span className="text-[10px] mt-0.5">Explore</span>
          </button>

          {/* Quick Check-In Center Button */}
          <button
            onClick={() => setIsCheckinModalOpen(true)}
            className="flex flex-col items-center -mt-4 group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F5132] border-2 border-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] group-active:translate-y-0.5 transition-all">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <span className="text-[10px] font-black text-[#3A2E28] mt-0.5">Check In</span>
          </button>

          <button
            onClick={() => setActiveNavSection('challenges')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeNavSection === 'challenges'
                ? 'text-[#0F5132] font-black'
                : 'text-[#3A2E28]/50 font-bold hover:text-[#3A2E28]'
            }`}
          >
            <Swords className={`h-5 w-5 ${activeNavSection === 'challenges' ? 'text-[#EF4E3A]' : ''}`} />
            <span className="text-[10px] mt-0.5">Arena</span>
          </button>

          <button
            onClick={() => setActiveNavSection('leaderboard')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              activeNavSection === 'leaderboard'
                ? 'text-[#0F5132] font-black'
                : 'text-[#3A2E28]/50 font-bold hover:text-[#3A2E28]'
            }`}
          >
            <Trophy className={`h-5 w-5 ${activeNavSection === 'leaderboard' ? 'text-[#F6B21A]' : ''}`} />
            <span className="text-[10px] mt-0.5">Ranks</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
