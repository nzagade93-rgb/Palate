'use client';

// ==============================================================================
// PALATE: Header Navigation (Swiggy-Grade Clean Modern Aesthetic)
// Featuring official Palate Logo, Swiggy-style Navi Mumbai location bar,
// Crest Points balance, quick sync, and thumb-friendly mobile drawer.
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Swords,
  Compass,
  Trophy,
  User,
  PlusCircle,
  Flame,
  Menu,
  X,
  Receipt,
  Cloud,
  Shield,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { FoodPassport } from '@/lib/types';
import { getCrestBalance } from '@/lib/crestSystem';
import PalateLogo, { PalateIcon } from '@/components/PalateLogo';

interface NavbarProps {
  passport: FoodPassport | null;
  onOpenPassport: () => void;
  onOpenCreateBattle?: () => void;
  activeSection?: 'battles' | 'explore' | 'leaderboard' | 'challenges';
  onNavigateSection?: (section: 'battles' | 'explore' | 'leaderboard' | 'challenges') => void;
  currentUser?: any;
  onOpenAuth?: () => void;
  onOpenCheckin?: () => void;
}

export default function Navbar({
  passport,
  onOpenPassport,
  onOpenCreateBattle,
  activeSection = 'battles',
  onNavigateSection,
  currentUser,
  onOpenAuth,
  onOpenCheckin,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [crestBalance, setCrestBalance] = useState<number>(75);

  React.useEffect(() => {
    setCrestBalance(getCrestBalance());
    const handleUpdate = () => setCrestBalance(getCrestBalance());
    window.addEventListener('palate_crest_updated', handleUpdate);
    return () => window.removeEventListener('palate_crest_updated', handleUpdate);
  }, []);

  const handleNav = (section: 'battles' | 'explore' | 'leaderboard' | 'challenges') => {
    if (onNavigateSection) {
      onNavigateSection(section);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-white/95 backdrop-blur-md transition-colors shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo + Swiggy-Style Location Selector */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <Link href="/" className="flex items-center group shrink-0">
            <PalateLogo size="md" showTagline={false} />
          </Link>

          {/* Location Selector (Swiggy Pattern: Bold Area + Subtitle Address) */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-3 sm:pl-4 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EF4E3A]/10 shrink-0">
              <MapPin className="h-3.5 w-3.5 text-[#EF4E3A]" />
            </div>
            <div className="flex flex-col text-left leading-tight min-w-0">
              <div className="flex items-center space-x-1">
                <span className="text-[13px] sm:text-[14px] font-extrabold text-[#02060C] tracking-tight truncate">
                  Navi Mumbai
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#686B78] shrink-0" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#686B78] truncate max-w-[130px] sm:max-w-[220px]">
                Vashi, Nerul, Belapur, Kharghar
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 font-semibold text-xs text-[#686B78]">
          <button
            onClick={() => handleNav('battles')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeSection === 'battles'
                ? 'bg-[#0F5132] text-white font-bold shadow-xs'
                : 'hover:text-[#02060C] hover:bg-black/[0.04]'
            }`}
          >
            Battles
          </button>

          <button
            onClick={() => handleNav('explore')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeSection === 'explore'
                ? 'bg-[#0F5132] text-white font-bold shadow-xs'
                : 'hover:text-[#02060C] hover:bg-black/[0.04]'
            }`}
          >
            Explore Nodes
          </button>

          <button
            onClick={() => handleNav('leaderboard')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeSection === 'leaderboard'
                ? 'bg-[#0F5132] text-white font-bold shadow-xs'
                : 'hover:text-[#02060C] hover:bg-black/[0.04]'
            }`}
          >
            Leaderboards
          </button>

          <button
            onClick={() => handleNav('challenges')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeSection === 'challenges'
                ? 'bg-[#0F5132] text-white font-bold shadow-xs'
                : 'hover:text-[#02060C] hover:bg-black/[0.04]'
            }`}
          >
            Arena
          </button>

          <Link
            href="/restaurant"
            className="px-3 py-2 rounded-xl hover:text-[#02060C] hover:bg-black/[0.04] transition-all"
          >
            Partners
          </Link>
        </nav>

        {/* Header Actions (Crest Points, Check-In, Profile) */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Live Check-In Button (Desktop & Tablet) */}
          {onOpenCheckin && (
            <button
              onClick={onOpenCheckin}
              id="nav-checkin-btn"
              className="hidden sm:flex items-center space-x-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-[#02060C] shadow-xs hover:border-gray-300 hover:bg-gray-50 transition-all"
              title="Post Food Check-in with bill receipt"
            >
              <Receipt className="h-3.5 w-3.5 text-[#0F5132]" />
              <span>Check In</span>
              <span className="hidden lg:inline text-[9px] font-bold bg-[#EF4E3A] text-white px-1.5 py-0.2 rounded-full">
                +50 XP
              </span>
            </button>
          )}

          {/* Cloud Sync Status (Desktop) */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              id="nav-auth-btn"
              className="hidden sm:flex items-center space-x-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#686B78] hover:text-[#02060C] hover:bg-gray-50 transition-all shadow-xs"
              title={currentUser ? `Logged in as ${currentUser.email}` : 'Sign in / Sync'}
            >
              <Cloud
                className={`h-3.5 w-3.5 ${
                  currentUser ? 'text-[#0F5132]' : 'text-gray-400'
                }`}
              />
              <span className="text-[11px] font-bold">
                {currentUser ? 'Synced' : 'Sync'}
              </span>
            </button>
          )}

          {/* Crest Points Trigger (Sleek Swiggy-Style Reward Pill) */}
          <button
            onClick={onOpenPassport}
            id="nav-crest-btn"
            className="flex items-center space-x-1.5 rounded-full bg-[#F6B21A]/15 border border-[#F6B21A]/35 px-2.5 py-1 text-xs font-bold text-[#0F5132] hover:bg-[#F6B21A]/25 transition-all shadow-xs"
            title="View Crest Points & Rewards"
          >
            <Shield className="h-3.5 w-3.5 text-[#0F5132]" />
            <span className="font-bold">{crestBalance} CP</span>
          </button>

          {/* Profile / Foodie Level Trigger */}
          <button
            onClick={onOpenPassport}
            id="nav-profile-btn"
            className="flex items-center space-x-1.5 rounded-full border border-gray-200 bg-white p-1 sm:px-2.5 sm:py-1 hover:bg-gray-50 transition-all shadow-xs"
            title="Open Profile"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F5132] text-white font-bold text-xs">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#02060C]">
              {passport ? `Lvl ${passport.levelNumber}` : 'Lvl 1'}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#02060C] hover:bg-gray-50 transition-all shadow-xs"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean Swiggy Card Aesthetics) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2.5 font-semibold text-sm shadow-xl animate-in slide-in-from-top-2 duration-200">
          {onOpenCheckin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckin();
              }}
              className="w-full flex items-center justify-between rounded-xl bg-[#0F5132] text-white p-3 text-left text-xs font-bold shadow-sm"
            >
              <span className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-[#F6B21A]" />
                <span>Check In & Upload Food Bill</span>
              </span>
              <span className="text-[10px] font-bold bg-[#EF4E3A] text-white px-2 py-0.5 rounded-full">
                +50 XP
              </span>
            </button>
          )}

          {onOpenAuth && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FA] p-3 text-left text-xs font-semibold text-[#02060C]"
            >
              <span className="flex items-center space-x-2">
                <Cloud className="h-4 w-4 text-[#0F5132]" />
                <span>{currentUser ? 'Cloud Account' : 'Sign In / Cloud Sync'}</span>
              </span>
              <span className="text-[10px] text-[#0F5132] font-bold">
                {currentUser ? 'Synced' : 'Offline'}
              </span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <button
              onClick={() => handleNav('battles')}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FA] p-2.5 text-left font-semibold text-[#02060C]"
            >
              <span>🔥 Food Battles</span>
              <span className="text-[9px] font-bold text-[#EF4E3A] bg-[#EF4E3A]/10 px-1.5 py-0.5 rounded">LIVE</span>
            </button>

            <button
              onClick={() => handleNav('explore')}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FA] p-2.5 text-left font-semibold text-[#02060C]"
            >
              <span>📍 Explore Nodes</span>
              <span className="text-[9px] text-[#686B78]">6 NODES</span>
            </button>

            <button
              onClick={() => handleNav('leaderboard')}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FA] p-2.5 text-left font-semibold text-[#02060C]"
            >
              <span>🏆 Leaderboards</span>
              <span className="text-[9px] font-bold text-[#0F5132]">TOP</span>
            </button>

            <button
              onClick={() => handleNav('challenges')}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FA] p-2.5 text-left font-semibold text-[#02060C]"
            >
              <span>⚔️ Battle Arena</span>
              <span className="text-[9px] text-[#686B78]">REIGNING</span>
            </button>
          </div>

          <div className="pt-1 space-y-1.5 text-xs">
            <Link
              href="/restaurant"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FA] p-2.5 text-left font-medium text-[#02060C]"
            >
              <span>🏪 Restaurant Partner Portal</span>
              <span className="text-[10px] text-[#0F5132] font-bold">PARTNERS</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FA] p-2.5 text-left font-medium text-[#02060C]"
            >
              <span>🛡️ Admin Dashboard</span>
              <span className="text-[10px] text-[#686B78] font-bold">CONTROL</span>
            </Link>
          </div>

          {onOpenCreateBattle && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreateBattle();
              }}
              className="w-full btn-forest py-2.5 text-xs font-bold text-center mt-2"
            >
              + Create a Food Battle
            </button>
          )}
        </div>
      )}
    </header>
  );
}
