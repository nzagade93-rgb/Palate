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
    <header className="sticky top-0 z-40 w-full border-b border-[#1C1917]/10 bg-[#FAF8F5]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1C1917]/20 bg-[#FFD11A] shadow-[2px_2px_0px_#1C1917] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_#1C1917] transition-all">
            <Swords className="h-5 w-5 text-[#1C1917]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-tight text-[#1C1917]">
                PALATE
              </span>
              <span className="rounded-md bg-[#1C1917] px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-[#FFD11A]">
                IN
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1C1917]/60 leading-none">
              Food Fights
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 font-bold text-xs">
          <button
            onClick={() => handleNav('battles')}
            className={`px-3 py-2 rounded-lg border transition-all ${
              activeSection === 'battles'
                ? 'border-[#1C1917] bg-[#FFD11A] text-[#1C1917] shadow-[2px_2px_0px_#1C1917]'
                : 'border-transparent text-[#1C1917]/80 hover:text-[#1C1917] hover:bg-[#EFECE6]'
            }`}
          >
            Battles
          </button>

          <button
            onClick={() => handleNav('explore')}
            className={`px-3 py-2 rounded-lg border transition-all ${
              activeSection === 'explore'
                ? 'border-[#1C1917] bg-[#FFD11A] text-[#1C1917] shadow-[2px_2px_0px_#1C1917]'
                : 'border-transparent text-[#1C1917]/80 hover:text-[#1C1917] hover:bg-[#EFECE6]'
            }`}
          >
            Explore Nodes
          </button>

          <button
            onClick={() => handleNav('leaderboard')}
            className={`px-3 py-2 rounded-lg border transition-all ${
              activeSection === 'leaderboard'
                ? 'border-[#1C1917] bg-[#FFD11A] text-[#1C1917] shadow-[2px_2px_0px_#1C1917]'
                : 'border-transparent text-[#1C1917]/80 hover:text-[#1C1917] hover:bg-[#EFECE6]'
            }`}
          >
            Leaderboards
          </button>

          <button
            onClick={() => handleNav('challenges')}
            className={`px-3 py-2 rounded-lg border transition-all ${
              activeSection === 'challenges'
                ? 'border-[#1C1917] bg-[#FFD11A] text-[#1C1917] shadow-[2px_2px_0px_#1C1917]'
                : 'border-transparent text-[#1C1917]/80 hover:text-[#1C1917] hover:bg-[#EFECE6]'
            }`}
          >
            Challenges
          </button>

          <Link
            href="/restaurant"
            className="px-3 py-2 rounded-lg border border-transparent text-[#1C1917]/80 hover:text-[#1C1917] hover:bg-[#EFECE6] transition-all font-bold text-xs"
          >
            Partner Portal
          </Link>
        </nav>

        {/* Actions (Desktop: Check-In, Sync, Profile | Mobile: Level Badge & Menu) */}
        <div className="flex items-center space-x-2">
          {/* Live Check-In Button (Desktop & Tablet) */}
          {onOpenCheckin && (
            <button
              onClick={onOpenCheckin}
              id="nav-checkin-btn"
              className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-[#1C1917]/20 bg-[#FFFFFF] px-3 py-1.5 text-xs font-black uppercase text-[#1C1917] shadow-[2px_2px_0px_#1C1917] hover:bg-[#FFD11A] transition-all"
              title="Check In & Upload Receipt"
            >
              <Receipt className="h-3.5 w-3.5" />
              <span>Check In</span>
            </button>
          )}

          {/* Create Battle Button (Desktop) */}
          {onOpenCreateBattle && (
            <button
              onClick={onOpenCreateBattle}
              id="nav-create-battle-btn"
              className="hidden lg:flex items-center space-x-1.5 btn-yellow px-3 py-1.5 text-xs font-black uppercase tracking-wider"
              title="Create a food fight"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Battle</span>
            </button>
          )}

          {/* Cloud Auth / Sync Trigger (Desktop & Tablet) */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              id="nav-auth-btn"
              className={`hidden sm:flex items-center space-x-1.5 rounded-xl border border-[#1C1917]/20 px-2.5 py-1.5 text-xs font-bold shadow-[2px_2px_0px_#1C1917] hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${
                currentUser
                  ? 'bg-[#E3F9ED] text-[#008A52]'
                  : 'bg-white text-[#1C1917]'
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
                  <span className="hidden md:inline font-bold">Sync</span>
                </>
              )}
            </button>
          )}

          {/* Profile / Passport Trigger */}
          <button
            onClick={onOpenPassport}
            id="nav-profile-btn"
            className="flex items-center space-x-1.5 sm:space-x-2 rounded-xl border border-[#1C1917]/20 bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-bold text-[#1C1917] shadow-[2px_2px_0px_#1C1917] hover:bg-[#FAF8F5] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Open Profile"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFD11A] border border-[#1C1917]/20">
              <User className="h-3.5 w-3.5 text-[#1C1917]" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] font-mono text-[#1C1917]/60 font-black">
                FOODIE
              </span>
              <span className="text-[11px] font-black text-[#1C1917]">
                {passport ? `LVL ${passport.levelNumber}` : 'LVL 1'}
              </span>
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-[#1C1917]/20 bg-[#FFFFFF] shadow-[2px_2px_0px_#1C1917] hover:bg-[#FAF8F5] transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1C1917]/10 bg-[#FAF8F5] px-4 py-4 space-y-2.5 font-bold text-sm shadow-lg">
          {onOpenCheckin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckin();
              }}
              className="w-full flex items-center justify-between rounded-xl border border-[#1C1917] bg-[#FFD11A] p-3 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#1C1917] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span className="flex items-center space-x-2">
                <Receipt className="h-4 w-4" />
                <span>🧾 Check In & Upload Receipt</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#1C1917] text-[#FFD11A] px-2 py-0.5 rounded">NEW</span>
            </button>
          )}

          {onOpenAuth && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full flex items-center justify-between rounded-xl border border-[#1C1917]/15 bg-[#FFFFFF] p-3 text-left text-xs font-bold text-[#1C1917] shadow-[2px_2px_0px_#1C1917] active:translate-x-0.5 active:translate-y-0.5 transition-all"
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

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleNav('battles')}
              className="flex items-center justify-between rounded-xl border border-[#1C1917]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold shadow-[2px_2px_0px_#1C1917]"
            >
              <span>🔥 Battles</span>
              <span className="text-[9px] font-mono text-[#1C1917]/50">LIVE</span>
            </button>

            <button
              onClick={() => handleNav('explore')}
              className="flex items-center justify-between rounded-xl border border-[#1C1917]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold shadow-[2px_2px_0px_#1C1917]"
            >
              <span>📍 Explore</span>
              <span className="text-[9px] font-mono text-[#1C1917]/50">NODES</span>
            </button>

            <button
              onClick={() => handleNav('leaderboard')}
              className="flex items-center justify-between rounded-xl border border-[#1C1917]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold shadow-[2px_2px_0px_#1C1917]"
            >
              <span>🏆 Leaderboard</span>
              <span className="text-[9px] font-mono text-[#1C1917]/50">TOP</span>
            </button>

            <button
              onClick={() => handleNav('challenges')}
              className="flex items-center justify-between rounded-xl border border-[#1C1917]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold shadow-[2px_2px_0px_#1C1917]"
            >
              <span>⚔️ Challenges</span>
              <span className="text-[9px] font-mono text-[#1C1917]/50">ARENA</span>
            </button>
          </div>

          <div className="pt-1 space-y-2">
            <Link
              href="/restaurant"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between rounded-xl border border-[#1C1917]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold text-[#1C1917] shadow-[2px_2px_0px_#1C1917]"
            >
              <span>🏪 Restaurant Partner Portal</span>
              <span className="text-[9px] font-mono text-[#00B26B] font-bold">PARTNERS</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between rounded-xl border border-[#1C1917]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold text-[#1C1917] shadow-[2px_2px_0px_#1C1917]"
            >
              <span>🛡️ Admin & Monetization</span>
              <span className="text-[9px] font-mono text-[#2748FF] font-bold">CONTROL</span>
            </Link>
          </div>

          {onOpenCreateBattle && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreateBattle();
              }}
              className="w-full btn-yellow py-2.5 text-xs font-black uppercase tracking-wider text-center mt-2"
            >
              + Create a Food Battle
            </button>
          )}
        </div>
      )}
    </header>
  );
}
