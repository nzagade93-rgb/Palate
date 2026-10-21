'use client';

// ==============================================================================
// PALATE: Header Navigation
// Featuring official Palate Logo, Navi Mumbai location pill, Crest Points,
// cloud check-in sync, and responsive drawers.
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
} from 'lucide-react';
import { FoodPassport } from '@/lib/types';
import { getCrestBalance } from '@/lib/crestSystem';
import PalateLogo from '@/components/PalateLogo';

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
    <header className="sticky top-0 z-40 w-full border-b border-[#3A2E28]/10 bg-[#FFF8EE]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo + Location Pill */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center group">
            <PalateLogo size="md" showTagline={false} />
          </Link>

          {/* Location selector pill matching mobile mockup */}
          <div className="hidden xs:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[#3A2E28]/15 bg-[#FFFFFF] text-xs font-bold text-[#3A2E28] shadow-xs">
            <MapPin className="h-3.5 w-3.5 text-[#EF4E3A]" />
            <span>Navi Mumbai</span>
            <span className="text-[10px] text-[#3A2E28]/50">▾</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 font-bold text-xs">
          <button
            onClick={() => handleNav('battles')}
            className={`px-3 py-2 rounded-xl border transition-all ${
              activeSection === 'battles'
                ? 'border-[#3A2E28] bg-[#0F5132] text-white shadow-[2px_2px_0px_#3A2E28]'
                : 'border-transparent text-[#3A2E28]/80 hover:text-[#3A2E28] hover:bg-[#DCE7D9]/40'
            }`}
          >
            Battles
          </button>

          <button
            onClick={() => handleNav('explore')}
            className={`px-3 py-2 rounded-xl border transition-all ${
              activeSection === 'explore'
                ? 'border-[#3A2E28] bg-[#0F5132] text-white shadow-[2px_2px_0px_#3A2E28]'
                : 'border-transparent text-[#3A2E28]/80 hover:text-[#3A2E28] hover:bg-[#DCE7D9]/40'
            }`}
          >
            Explore Nodes
          </button>

          <button
            onClick={() => handleNav('leaderboard')}
            className={`px-3 py-2 rounded-xl border transition-all ${
              activeSection === 'leaderboard'
                ? 'border-[#3A2E28] bg-[#0F5132] text-white shadow-[2px_2px_0px_#3A2E28]'
                : 'border-transparent text-[#3A2E28]/80 hover:text-[#3A2E28] hover:bg-[#DCE7D9]/40'
            }`}
          >
            Leaderboards
          </button>

          <button
            onClick={() => handleNav('challenges')}
            className={`px-3 py-2 rounded-xl border transition-all ${
              activeSection === 'challenges'
                ? 'border-[#3A2E28] bg-[#0F5132] text-white shadow-[2px_2px_0px_#3A2E28]'
                : 'border-transparent text-[#3A2E28]/80 hover:text-[#3A2E28] hover:bg-[#DCE7D9]/40'
            }`}
          >
            Challenges
          </button>

          <Link
            href="/restaurant"
            className="px-3 py-2 rounded-xl border border-transparent text-[#3A2E28]/80 hover:text-[#3A2E28] hover:bg-[#DCE7D9]/40 transition-all font-bold text-xs"
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
              className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-[#3A2E28]/20 bg-[#FFFFFF] px-3 py-1.5 text-xs font-black uppercase text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] hover:bg-[#F6B21A] transition-all"
              title="Post Food Check-in with optional bill receipt"
            >
              <Receipt className="h-3.5 w-3.5 text-[#0F5132]" />
              <span>Check In</span>
              <span className="hidden lg:inline text-[9px] font-mono font-bold bg-[#EF4E3A] text-white px-1.5 py-0.2 rounded-full">
                +50 XP
              </span>
            </button>
          )}

          {/* Cloud Sync / Profile Status (Desktop) */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              id="nav-auth-btn"
              className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-[#3A2E28]/20 bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-bold text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] hover:bg-[#FFF8EE] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title={currentUser ? `Logged in as ${currentUser.email}` : 'Sign in / Sync'}
            >
              <Cloud
                className={`h-3.5 w-3.5 ${
                  currentUser ? 'text-[#0F5132]' : 'text-[#3A2E28]/50'
                }`}
              />
              <span className="font-mono text-[11px] font-black">
                {currentUser ? 'SYNCED' : 'Sync'}
              </span>
            </button>
          )}

          {/* Crest Points Trigger */}
          <button
            onClick={onOpenPassport}
            id="nav-crest-btn"
            className="flex items-center space-x-1.5 rounded-xl border border-[#3A2E28]/20 bg-[#F6B21A]/20 px-2.5 py-1.5 text-xs font-bold text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] hover:bg-[#F6B21A] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="View Crest Points & Rewards"
          >
            <Shield className="h-3.5 w-3.5 text-[#0F5132]" />
            <span className="font-mono text-[11px] font-black">{crestBalance} CP</span>
          </button>

          {/* Profile / Passport Trigger */}
          <button
            onClick={onOpenPassport}
            id="nav-profile-btn"
            className="flex items-center space-x-1.5 sm:space-x-2 rounded-xl border border-[#3A2E28]/20 bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-bold text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] hover:bg-[#FFF8EE] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            title="Open Profile"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F6B21A] border border-[#3A2E28]/20">
              <User className="h-3.5 w-3.5 text-[#3A2E28]" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] font-mono text-[#3A2E28]/60 font-black">
                FOODIE
              </span>
              <span className="text-[11px] font-black text-[#3A2E28]">
                {passport ? `LVL ${passport.levelNumber}` : 'LVL 1'}
              </span>
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-[#3A2E28]/20 bg-[#FFFFFF] shadow-[2px_2px_0px_#3A2E28] hover:bg-[#FFF8EE] transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3A2E28]/10 bg-[#FFF8EE] px-4 py-4 space-y-2.5 font-bold text-sm shadow-lg">
          {onOpenCheckin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckin();
              }}
              className="w-full flex items-center justify-between rounded-xl border border-[#3A2E28] bg-[#F6B21A] p-3 text-left text-xs font-black uppercase shadow-[2px_2px_0px_#3A2E28] active:translate-x-0.5 active:translate-y-0.5 transition-all text-[#3A2E28]"
            >
              <span className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-[#0F5132]" />
                <span>🧾 Check In & Upload Receipt</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#EF4E3A] text-white px-2 py-0.5 rounded">
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
              className="w-full flex items-center justify-between rounded-xl border border-[#3A2E28]/15 bg-[#FFFFFF] p-3 text-left text-xs font-bold text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span className="flex items-center space-x-2">
                <Cloud className="h-4 w-4 text-[#0F5132]" />
                <span>{currentUser ? '👤 Cloud Profile' : '☁️ Sign In / Cloud Sync'}</span>
              </span>
              <span className="text-[10px] font-mono text-[#0F5132] font-black">
                {currentUser ? 'SYNCED' : 'OFFLINE'}
              </span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleNav('battles')}
              className="flex items-center justify-between rounded-xl border border-[#3A2E28]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold shadow-[2px_2px_0px_#3A2E28]"
            >
              <span>🔥 Battles</span>
              <span className="text-[9px] font-mono text-[#EF4E3A] font-bold">LIVE</span>
            </button>

            <button
              onClick={() => handleNav('explore')}
              className="flex items-center justify-between rounded-xl border border-[#3A2E28]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold shadow-[2px_2px_0px_#3A2E28]"
            >
              <span>📍 Explore</span>
              <span className="text-[9px] font-mono text-[#3A2E28]/50">NODES</span>
            </button>

            <button
              onClick={() => handleNav('leaderboard')}
              className="flex items-center justify-between rounded-xl border border-[#3A2E28]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold shadow-[2px_2px_0px_#3A2E28]"
            >
              <span>🏆 Leaderboard</span>
              <span className="text-[9px] font-mono text-[#F6B21A] font-bold">TOP</span>
            </button>

            <button
              onClick={() => handleNav('challenges')}
              className="flex items-center justify-between rounded-xl border border-[#3A2E28]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold shadow-[2px_2px_0px_#3A2E28]"
            >
              <span>⚔️ Challenges</span>
              <span className="text-[9px] font-mono text-[#3A2E28]/50">ARENA</span>
            </button>
          </div>

          <div className="pt-1 space-y-2">
            <Link
              href="/restaurant"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between rounded-xl border border-[#3A2E28]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28]"
            >
              <span>🏪 Restaurant Partner Portal</span>
              <span className="text-[9px] font-mono text-[#0F5132] font-bold">PARTNERS</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between rounded-xl border border-[#3A2E28]/15 bg-[#FFFFFF] p-2.5 text-left text-xs font-bold text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28]"
            >
              <span>🛡️ Admin & Monetization</span>
              <span className="text-[9px] font-mono text-[#0F5132] font-bold">CONTROL</span>
            </Link>
          </div>

          {onOpenCreateBattle && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreateBattle();
              }}
              className="w-full btn-forest py-2.5 text-xs font-black uppercase tracking-wider text-center mt-2"
            >
              + Create a Food Battle
            </button>
          )}
        </div>
      )}
    </header>
  );
}
