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
import SplashScreen from '@/components/SplashScreen';
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
  Play,
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
  const [showSplashVideo, setShowSplashVideo] = useState(false);

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
    <div className="min-h-screen bg-[#F4F5F8] text-[#02060C] pb-28">
      {/* 9:16 Mobile Splash Video Intro (Runs once per session or on request) */}
      <SplashScreen forceShow={showSplashVideo} onFinish={() => setShowSplashVideo(false)} />

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
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-[#02060C] text-[#F6B21A] border border-[#F6B21A]/30 px-4 py-2 rounded-full shadow-xl text-xs font-bold"
          >
            <Sparkles className="h-4 w-4 text-[#F6B21A]" />
            <span>{crestToast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
        {/* SWIGGY-STYLE CLEAN HERO BAR */}
        <div className="pb-3 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="flex h-2 w-2 rounded-full bg-[#0F5132] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F5132]">
                Food Consensus • Navi Mumbai
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#02060C] tracking-tight leading-tight">
              Trending Food Battles{' '}
              <span className="bg-[#EF4E3A] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                LIVE
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowSplashVideo(true)}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-[#686B78] bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs hover:text-[#02060C] hover:bg-gray-50 transition-all"
              title="Watch Intro Splash Video"
            >
              <Play className="h-3 w-3 text-[#0F5132]" />
              <span>Intro</span>
            </button>
            <span className="hidden xs:inline-flex items-center space-x-1.5 text-xs font-semibold text-[#686B78] bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs">
              <Flame className="h-3.5 w-3.5 text-[#EF4E3A]" />
              <span>{liveBattles.length} Clashes</span>
            </span>
            <button
              onClick={() => setIsCreateBattleOpen(true)}
              className="btn-forest px-3.5 py-1.5 text-xs font-bold rounded-full flex items-center space-x-1 shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>+ Battle</span>
            </button>
          </div>
        </div>

        {/* Swiggy Full-Width Search Bar & Quick Categories */}
        <div className="space-y-3 mb-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes, battles, or nodes (e.g. Vada Pav, Misal)..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm font-medium text-[#02060C] placeholder:text-gray-400 focus:outline-none focus:border-[#0F5132] focus:ring-1 focus:ring-[#0F5132] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Category Action Cards (Swiggy Modern Card Grid) */}
          <div className="grid grid-cols-4 gap-2.5 pt-0.5">
            <button
              onClick={() => {
                setActiveNavSection('explore');
                setSearchQuery('Misal');
              }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white border border-black/[0.04] shadow-xs hover:shadow-md active:scale-98 transition-all text-center group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-[#F6B21A] mb-1.5 group-hover:scale-105 transition-transform">
                <Sparkles className="h-4 w-4 text-[#F6B21A]" />
              </div>
              <span className="text-[11px] font-bold text-[#02060C]">Top Rated</span>
            </button>

            <button
              onClick={() => {
                setSelectedNeighborhood(selectedNeighborhood === 'Vashi' ? 'All' : 'Vashi');
              }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white border border-black/[0.04] shadow-xs hover:shadow-md active:scale-98 transition-all text-center group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-[#EF4E3A] mb-1.5 group-hover:scale-105 transition-transform">
                <MapPin className="h-4 w-4 text-[#EF4E3A]" />
              </div>
              <span className="text-[11px] font-bold text-[#02060C]">Near Me</span>
            </button>

            <button
              onClick={() => {
                setActiveNavSection('battles');
                setSearchQuery('');
              }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white border border-black/[0.04] shadow-xs hover:shadow-md active:scale-98 transition-all text-center group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-[#EF4E3A] mb-1.5 group-hover:scale-105 transition-transform">
                <Flame className="h-4 w-4 text-[#EF4E3A]" />
              </div>
              <span className="text-[11px] font-bold text-[#02060C]">Trending</span>
            </button>

            <button
              onClick={() => {
                setActiveNavSection('battles');
                scrollToBattles();
              }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white border border-black/[0.04] shadow-xs hover:shadow-md active:scale-98 transition-all text-center group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-[#0F5132] mb-1.5 group-hover:scale-105 transition-transform">
                <Swords className="h-4 w-4 text-[#0F5132]" />
              </div>
              <span className="text-[11px] font-bold text-[#02060C]">Food Battles</span>
            </button>
          </div>

          {/* Swiggy "What's on your mind?" Category Pills */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center space-x-2 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#686B78] shrink-0">
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
                className={`whitespace-nowrap shrink-0 rounded-full px-3.5 py-1.5 transition-all text-xs font-semibold border ${
                  searchQuery.toLowerCase() === chip.query.toLowerCase()
                    ? 'border-[#0F5132] bg-[#0F5132] text-white shadow-xs'
                    : 'border-gray-200 bg-white text-[#3E4152] hover:border-gray-300 shadow-2xs'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Node Filter Chips (Swiggy Horizontal Clean Chips) */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {NAVI_MUMBAI_NODES.map((node) => (
              <button
                key={node}
                onClick={() => setSelectedNeighborhood(node)}
                className={`whitespace-nowrap shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border ${
                  selectedNeighborhood === node
                    ? 'border-[#0F5132] bg-[#0F5132] text-white shadow-xs'
                    : 'border-gray-200 bg-white text-[#686B78] hover:border-gray-300 shadow-2xs'
                }`}
              >
                {node === 'All' ? 'All Nodes' : node}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Navigation Tabs (Swiggy Clean Rounded Pills) */}
        <div className="hidden sm:flex items-center space-x-2 mb-6">
          <button
            onClick={() => setActiveNavSection('battles')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeNavSection === 'battles'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'bg-white text-[#686B78] border border-gray-200 hover:text-[#02060C] hover:border-gray-300'
            }`}
          >
            <span>🔥</span>
            <span>Live Battles ({liveBattles.length})</span>
          </button>

          <button
            onClick={() => setActiveNavSection('explore')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeNavSection === 'explore'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'bg-white text-[#686B78] border border-gray-200 hover:text-[#02060C] hover:border-gray-300'
            }`}
          >
            <span>📍</span>
            <span>Explore Nodes</span>
          </button>

          <button
            onClick={() => setActiveNavSection('leaderboard')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeNavSection === 'leaderboard'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'bg-white text-[#686B78] border border-gray-200 hover:text-[#02060C] hover:border-gray-300'
            }`}
          >
            <span>🏆</span>
            <span>Leaderboards</span>
          </button>

          <button
            onClick={() => setActiveNavSection('challenges')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeNavSection === 'challenges'
                ? 'bg-[#0F5132] text-white shadow-xs'
                : 'bg-white text-[#686B78] border border-gray-200 hover:text-[#02060C] hover:border-gray-300'
            }`}
          >
            <span>⚔️</span>
            <span>Arena ({challenges.length})</span>
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

            {/* SECTION 1: LIVE FOOD BATTLES */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#0F5132] animate-pulse" />
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#02060C] tracking-tight">
                    {searchQuery ? `Battles matching "${searchQuery}"` : 'Food Battles Happening Now'}
                  </h2>
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-bold text-[#EF4E3A] hover:underline"
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

            {/* SECTION 2: TRENDING IN NAVI MUMBAI */}
            {trendingBattles.length > 0 && selectedNeighborhood === 'All' && !searchQuery && (
              <div className="pt-4 border-t border-gray-200/60">
                <div className="flex items-center space-x-2 mb-3.5">
                  <Flame className="h-5 w-5 text-[#EF4E3A]" />
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#02060C] tracking-tight">
                    Trending in Navi Mumbai
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trendingBattles.slice(0, 2).map((b) => (
                    <div key={b.id} className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_2px_10px_rgba(2,6,12,0.04)] hover:shadow-md transition-all">
                      <span className="inline-block text-[10px] font-bold uppercase text-[#EF4E3A] bg-rose-50 px-2 py-0.5 rounded mb-2">
                        TRENDING NOW
                      </span>
                      <h4 className="text-base font-extrabold text-[#02060C] line-clamp-1">
                        {b.title}
                      </h4>
                      <p className="text-xs text-[#686B78] font-medium mb-3 mt-0.5">
                        {b.contestantA.name} ({b.percentA}%) vs {b.contestantB.name} ({b.percentB}%)
                      </p>
                      <button
                        onClick={() => handleVote(b.id, b.contestantA.id)}
                        className="btn-forest w-full py-2.5 text-xs font-bold"
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

            {/* SECTION 3: RECENT WINNERS & REIGNING CHAMPIONS */}
            <div className="pt-4 border-t border-gray-200/60">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-[#F6B21A]" />
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#02060C] tracking-tight">
                    Recent Winners &amp; Reigning Champions
                  </h2>
                </div>
                <button
                  onClick={() => setActiveNavSection('challenges')}
                  className="text-xs font-bold text-[#0F5132] hover:underline"
                >
                  View Arena →
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
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-xs">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded mb-1.5">
                Geographic Discovery
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#02060C] tracking-tight">
                Explore Navi Mumbai Food Nodes
              </h3>
              <p className="text-xs text-[#686B78] font-normal mt-0.5">
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
                      className="rounded-xl border border-gray-200 bg-white p-3 text-left hover:border-[#0F5132] hover:shadow-xs transition-all group"
                    >
                      <MapPin className="h-4 w-4 text-[#EF4E3A] mb-1.5" />
                      <span className="text-xs font-bold text-[#02060C] block group-hover:text-[#0F5132] transition-colors">
                        {loc}
                      </span>
                      <span className="text-[11px] text-[#686B78] font-medium block mt-0.5">
                        Browse battles →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Battle Categories */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-xs">
              <h4 className="text-base font-extrabold text-[#02060C] mb-3">
                Browse By Battle Category
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-emerald-100 p-3.5 bg-emerald-50/50">
                  <span className="text-xs font-bold text-[#0F5132] block mb-1">
                    Dish Battles
                  </span>
                  <p className="text-xs text-[#686B78] font-medium">
                    Comparing specific dishes from different vendors (e.g. Vada Pav vs Vada Pav).
                  </p>
                </div>

                <div className="rounded-xl border border-rose-100 p-3.5 bg-rose-50/50">
                  <span className="text-xs font-bold text-[#EF4E3A] block mb-1">
                    Restaurant Battles
                  </span>
                  <p className="text-xs text-[#686B78] font-medium">
                    Comparing full restaurant dining experiences serving comparable dishes.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-100 p-3.5 bg-amber-50/50">
                  <span className="text-xs font-bold text-[#A16207] block mb-1">
                    Food Debates
                  </span>
                  <p className="text-xs text-[#686B78] font-medium">
                    Fundamental cultural food debates (e.g. Vada Pav vs Pav Bhaji).
                  </p>
                </div>
              </div>
            </div>

            {/* Live Community Food Radar (Supabase Real-Time Check-Ins) */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#0F5132] mb-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0F5132] animate-pulse" />
                    <span>Real-Time Check-Ins</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-[#02060C] tracking-tight">
                    Live Community Food Radar
                  </h4>
                  <p className="text-xs text-[#686B78] font-normal">
                    Verified bites logged by diners across Vashi, Nerul, Belapur, Kharghar, and Seawoods.
                  </p>
                </div>

                <button
                  onClick={() => setIsCheckinModalOpen(true)}
                  className="btn-forest px-4 py-2 text-xs font-bold rounded-full flex items-center justify-center space-x-1.5 shrink-0 shadow-xs"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  <span>+ Check In Dish</span>
                </button>
              </div>

              {/* Check-ins Feed */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {cloudCheckins.length > 0 ? (
                  cloudCheckins.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-3.5 rounded-xl border border-gray-100 bg-[#F8F9FA] flex items-start justify-between gap-3 hover:border-gray-200 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-[#02060C]">
                            {chk.dish_name}
                          </span>
                          <span className="text-xs text-[#686B78]">
                            @ {chk.venue_name}
                          </span>
                        </div>

                        {chk.note && (
                          <p className="text-xs text-[#686B78] font-normal italic">
                            &ldquo;{chk.note}&rdquo;
                          </p>
                        )}

                        <div className="flex items-center space-x-2 text-[11px] text-[#686B78] pt-0.5">
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
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            chk.reaction === 'GOD_TIER'
                              ? 'bg-emerald-50 text-[#0F5132] border border-emerald-200/50'
                              : 'bg-rose-50 text-[#EF4E3A] border border-rose-200/50'
                          }`}
                        >
                          {chk.reaction === 'GOD_TIER' ? 'GOD TIER 🔥' : 'SKIP ❌'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center rounded-xl border border-dashed border-gray-200 text-xs font-medium text-[#686B78] space-y-2">
                    <p>No check-ins logged yet today. Be the first to check in!</p>
                    <button
                      onClick={() => setIsCheckinModalOpen(true)}
                      className="btn-forest px-3.5 py-1.5 rounded-full text-xs font-bold"
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

      {/* SWIGGY-STYLE NATIVE MOBILE STICKY BOTTOM APP BAR */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/98 backdrop-blur-lg px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => setActiveNavSection('battles')}
            className={`flex flex-col items-center py-0.5 px-3 rounded-lg transition-all ${
              activeNavSection === 'battles'
                ? 'text-[#EF4E3A] font-bold'
                : 'text-[#686B78] font-medium hover:text-[#02060C]'
            }`}
          >
            <Flame className={`h-5 w-5 ${activeNavSection === 'battles' ? 'fill-[#EF4E3A]' : ''}`} />
            <span className="text-[10px] mt-0.5">Battles</span>
          </button>

          <button
            onClick={() => setActiveNavSection('explore')}
            className={`flex flex-col items-center py-0.5 px-3 rounded-lg transition-all ${
              activeNavSection === 'explore'
                ? 'text-[#0F5132] font-bold'
                : 'text-[#686B78] font-medium hover:text-[#02060C]'
            }`}
          >
            <Compass className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">Explore</span>
          </button>

          {/* Quick Check-In Center Button (Swiggy Floating Action Style) */}
          <button
            onClick={() => setIsCheckinModalOpen(true)}
            className="flex flex-col items-center -mt-5 group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F5132] text-white shadow-lg ring-4 ring-white group-active:scale-95 transition-all">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-[#02060C] mt-0.5">Check In</span>
          </button>

          <button
            onClick={() => setActiveNavSection('challenges')}
            className={`flex flex-col items-center py-0.5 px-3 rounded-lg transition-all ${
              activeNavSection === 'challenges'
                ? 'text-[#0F5132] font-bold'
                : 'text-[#686B78] font-medium hover:text-[#02060C]'
            }`}
          >
            <Swords className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">Arena</span>
          </button>

          <button
            onClick={() => setActiveNavSection('leaderboard')}
            className={`flex flex-col items-center py-0.5 px-3 rounded-lg transition-all ${
              activeNavSection === 'leaderboard'
                ? 'text-[#0F5132] font-bold'
                : 'text-[#686B78] font-medium hover:text-[#02060C]'
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">Ranks</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
