'use client';

// ==============================================================================
// PALATE: Navigation Bar
// Indian street-poster editorial aesthetic with thick black borders,
// high-contrast tags, and navigation across Battles, Explore, Leaderboards & Profile.
// ==============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { Swords, Compass, Trophy, User, PlusCircle, Flame, Menu, X, Receipt, Cloud } from 'lucide-react';
import { FoodPassport } from '@/lib/types';

interface NavbarProps {
  passport: FoodPassport | null;
  onOpenPassport: () => void;
  onOpenCreateBattle?: () => void;
  onOpenExplore?: () => void;
  activeSection?: string;
  onNavigateSection?: (section: string) => void;
  currentUser?: any;
  onOpenAuth?: () => void;
  onOpenCheckin?: () => void;
}

export default function Navbar({
  passport,
  onOpenPassport,
  onOpenCreateBattle,
  onOpenExplore,
  activeSection = 'battles',
  onNavigateSection,
  currentUser,
  onOpenAuth,
  onOpenCheckin,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (section: string) => {
    if (onNavigateSection) {
      onNavigateSection(section);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-[2.5px] border-[#121212] bg-[#F6EFE2]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#121212] bg-[#FFD11A] shadow-[2px_2px_0px_#121212] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_#121212] transition-all">
            <Swords className="h-5 w-5 text-[#121212]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-tight text-[#121212]">
                PALATE
              </span>
              <span className="rounded-md border border-[#121212] bg-[#121212] px-1.5 py-0.2 text-[10px] font-mono font-bold tracking-widest text-[#FFD11A]">
                IN
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#121212]/70 leading-none">
              Food Fights
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 font-bold text-xs">
          <button
            onClick={() => handleNav('battles')}
            className={`px-3 py-2 rounded-lg border-2 transition-all ${
              activeSection === 'battles'
                ? 'border-[#121212] bg-[#FFD11A] text-[#121212] shadow-[2px_2px_0px_#121212]'
                : 'border-transparent text-[#121212] hover:bg-[#DDD4C2]/50'
            }`}
          >
            Battles
          </button>

          <button
            onClick={() => handleNav('explore')}
            className={`px-3 py-2 rounded-lg border-2 transition-all ${
              activeSection === 'explore'
                ? 'border-[#121212] bg-[#FFD11A] text-[#121212] shadow-[2px_2px_0px_#121212]'
                : 'border-transparent text-[#121212] hover:bg-[#DDD4C2]/50'
            }`}
          >
            Explore Navi Mumbai
          </button>

          <button
            onClick={() => handleNav('leaderboard')}
            className={`px-3 py-2 rounded-lg border-2 transition-all ${
              activeSection === 'leaderboard'
                ? 'border-[#121212] bg-[#FFD11A] text-[#121212] shadow-[2px_2px_0px_#121212]'
                : 'border-transparent text-[#121212] hover:bg-[#DDD4C2]/50'
            }`}
          >
            Leaderboards
          </button>

          <button
            onClick={() => handleNav('challenges')}
            className={`px-3 py-2 rounded-lg border-2 transition-all ${
              activeSection === 'challenges'
                ? 'border-[#121212] bg-[#FFD11A] text-[#121212] shadow-[2px_2px_0px_#121212]'
                : 'border-transparent text-[#121212] hover:bg-[#DDD4C2]/50'
            }`}
          >
            Challenges
          </button>

          <Link
            href="/restaurant"
            className="px-3 py-2 rounded-lg border-2 border-transparent text-[#121212] hover:bg-[#DDD4C2]/50 transition-all font-bold text-xs"
          >
            Partner Portal
          </Link>
        </nav>

        {/* Actions (Check In + Create + Auth + Profile) */}
        <div className="flex items-center space-x-2">
          {/* Live Check-In Button */}
          {onOpenCheckin && (
            <button
              onClick={onOpenCheckin}
              id="nav-checkin-btn"
              className="flex items-center space-x-1.5 rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-black uppercase text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A] transition-all"
              title="Check In & Upload Receipt"
            >
              <Receipt className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Check In</span>
            </button>
          )}

          {/* Create Battle Button */}
          {onOpenCreateBattle && (
            <button
              onClick={onOpenCreateBattle}
              id="nav-create-battle-btn"
              className="hidden sm:flex items-center space-x-1.5 btn-yellow px-3 py-1.5 text-xs font-black uppercase tracking-wider"
              title="Create a food fight"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Battle</span>
            </button>
          )}

          {/* Cloud Auth / Sync Trigger */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              id="nav-auth-btn"
              className={`flex items-center space-x-1.5 rounded-xl border-2 border-[#121212] px-2.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_#121212] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#121212] transition-all ${
                currentUser
                  ? 'bg-[#E3F9ED] text-[#008A52]'
                  : 'bg-white text-[#121212]'
              }`}
              title={currentUser ? `Signed in as ${currentUser.email}` : 'Sign In for Cloud Sync'}
            >
              {currentUser ? (
                <>
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#00B26B] text-white text-[10px] font-black">
                    {(currentUser.user_metadata?.display_name || currentUser.email || 'U')[0].toUpperCase()}
                  </span>
                  <span className="hidden md:inline font-mono text-[10px]">SYNCED</span>
                </>
              ) : (
                <>
                  <Cloud className="h-3.5 w-3.5 text-[#2748FF]" />
                  <span className="hidden md:inline">Sync</span>
                </>
              )}
            </button>
          )}

          {/* Profile / Passport Trigger */}
          <button
            onClick={onOpenPassport}
            id="nav-profile-btn"
            className="flex items-center space-x-2 rounded-xl border-2 border-[#121212] bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-bold text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#F6EFE2] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            title="Open Profile"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFD11A] border border-[#121212]">
              <User className="h-3.5 w-3.5 text-[#121212]" />
            </div>
            <div className="hidden xs:flex flex-col text-left leading-none">
              <span className="text-[10px] font-mono text-[#121212]/70 font-black">
                VOTER
              </span>
              <span className="text-xs font-black text-[#121212]">
                {passport ? `LVL ${passport.levelNumber}` : 'LVL 1'}
              </span>
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#121212] bg-[#FFFFFF] shadow-[2px_2px_0px_#121212]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-[#121212] bg-[#F6EFE2] px-4 py-3 space-y-2 font-bold text-sm">
          {onOpenCheckin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckin();
              }}
              className="w-full flex items-center justify-between rounded-lg border-2 border-[#121212] bg-[#FFD11A] p-2.5 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#121212]"
            >
              <span className="flex items-center space-x-2">
                <Receipt className="h-4 w-4" />
                <span>🧾 Check In & Upload Receipt</span>
              </span>
              <span className="text-[10px] font-mono text-[#121212]">NEW</span>
            </button>
          )}

          {onOpenAuth && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full flex items-center justify-between rounded-lg border-2 border-[#121212] bg-[#FFFFFF] p-2.5 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#121212]"
            >
              <span className="flex items-center space-x-2">
                <Cloud className="h-4 w-4 text-[#2748FF]" />
                <span>{currentUser ? '👤 Cloud Profile' : '☁️ Sign In / Cloud Sync'}</span>
              </span>
              <span className="text-[10px] font-mono text-[#00B26B]">
                {currentUser ? 'SYNCED' : 'OFFLINE'}
              </span>
            </button>
          )}

          <button
            onClick={() => handleNav('battles')}
            className="w-full flex items-center justify-between rounded-lg border-2 border-[#121212] bg-[#FFFFFF] p-2.5 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#121212]"
          >
            <span>🔥 Food Battles</span>
            <span className="text-[10px] font-mono text-[#121212]/60">LIVE NOW</span>
          </button>

          <button
            onClick={() => handleNav('explore')}
            className="w-full flex items-center justify-between rounded-lg border-2 border-[#121212] bg-[#FFFFFF] p-2.5 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#121212]"
          >
            <span>📍 Explore Navi Mumbai</span>
            <span className="text-[10px] font-mono text-[#121212]/60">NODES</span>
          </button>

          <button
            onClick={() => handleNav('leaderboard')}
            className="w-full flex items-center justify-between rounded-lg border-2 border-[#121212] bg-[#FFFFFF] p-2.5 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#121212]"
          >
            <span>🏆 Leaderboards</span>
            <span className="text-[10px] font-mono text-[#121212]/60">RANKINGS</span>
          </button>

          <button
            onClick={() => handleNav('challenges')}
            className="w-full flex items-center justify-between rounded-lg border-2 border-[#121212] bg-[#FFFFFF] p-2.5 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#121212]"
          >
            <span>⚔️ Challenge A Winner</span>
            <span className="text-[10px] font-mono text-[#121212]/60">DEBATES</span>
          </button>

          <Link
            href="/restaurant"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between rounded-lg border-2 border-[#121212] bg-[#FFFFFF] p-2.5 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#121212]"
          >
            <span>🏪 Restaurant Partner Portal</span>
            <span className="text-[10px] font-mono text-[#00B26B]">PARTNERS</span>
          </Link>

          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between rounded-lg border-2 border-[#121212] bg-[#FFFFFF] p-2.5 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#121212]"
          >
            <span>🛡️ Admin & Monetization</span>
            <span className="text-[10px] font-mono text-[#2748FF]">ADMIN</span>
          </Link>

          {onOpenCreateBattle && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreateBattle();
              }}
              className="w-full btn-yellow py-3 text-xs font-black uppercase tracking-wider text-center"
            >
              + Create a Food Battle
            </button>
          )}
        </div>
      )}
    </header>
  );
}
