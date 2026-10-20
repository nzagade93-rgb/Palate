'use client';

// ==============================================================================
// PALATE: Admin & Moderation Console
// Allows authorized administrators to create, edit, approve, reject,
// toggle live/completed status, review true vote logs, and inspect growth funnel.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Battle, BattleChallenge, AnalyticsEvent } from '@/lib/types';
import {
  ShieldAlert,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Swords,
  Trophy,
  Activity,
  BarChart2,
  Trash2,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import AdminMonetizationSection from '@/components/AdminMonetizationSection';

export default function AdminPage() {
  const [adminSection, setAdminSection] = useState<'moderation' | 'monetization'>('moderation');
  const [battles, setBattles] = useState<Battle[]>([]);
  const [challenges, setChallenges] = useState<BattleChallenge[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setIsLoading(true);
        const [bRes, cRes, aRes] = await Promise.all([
          fetch('/api/battles'),
          fetch('/api/challenges'),
          fetch('/api/analytics'),
        ]);

        const bData = await bRes.json();
        const cData = await cRes.json();
        const aData = await aRes.json();

        if (bData.success) setBattles(bData.battles || []);
        if (cData.success) setChallenges(cData.challenges || []);
        if (aData.success) setAnalytics(aData.summary || null);
      } catch (err) {
        console.error('Admin fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const toggleBattleStatus = (battleId: string) => {
    setBattles((prev) =>
      prev.map((b) => {
        if (b.id === battleId) {
          const newActive = !b.isActive;
          return {
            ...b,
            isActive: newActive,
            status: newActive ? 'live' : 'completed',
          };
        }
        return b;
      })
    );
  };

  const approveChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: 'approved' } : c))
    );
  };

  const rejectChallenge = (challengeId: string) => {
    setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
  };

  return (
    <div className="min-h-screen bg-[#F6EFE2] text-[#121212] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b-2 border-[#121212] pb-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#121212] bg-[#FFFFFF] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A] transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px]">
                AUTHORIZED ADMIN
              </span>
              <h1 className="text-2xl font-black text-[#121212] uppercase tracking-tight">
                PALATE Moderation & Growth Console
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 font-mono text-xs font-bold bg-[#FFFFFF] px-3 py-1.5 rounded-lg border-2 border-[#121212] shadow-[2px_2px_0px_#121212]">
            <ShieldAlert className="h-4 w-4 text-[#2748FF]" />
            <span>Server Authorisation Active</span>
          </div>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex items-center space-x-2 mb-6">
          <button
            onClick={() => setAdminSection('moderation')}
            className={`rounded-xl border-2 border-[#121212] px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
              adminSection === 'moderation'
                ? 'bg-[#121212] text-[#FFD11A] shadow-[3px_3px_0px_#121212]'
                : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
            }`}
          >
            ⚔️ Battles & Moderation
          </button>
          <button
            onClick={() => setAdminSection('monetization')}
            className={`rounded-xl border-2 border-[#121212] px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
              adminSection === 'monetization'
                ? 'bg-[#121212] text-[#FFD11A] shadow-[3px_3px_0px_#121212]'
                : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
            }`}
          >
            💰 Monetization Engine (Build Now, Activate Later)
          </button>
        </div>

        {adminSection === 'monetization' ? (
          <AdminMonetizationSection />
        ) : (
          <>
            {/* Growth Funnel Metrics Card */}
            {analytics && (
              <div className="poster-card p-5 bg-[#FFFFFF] mb-8">
                <div className="flex items-center space-x-2 mb-3">
                  <BarChart2 className="h-5 w-5 text-[#2748FF]" />
                  <h2 className="text-lg font-black uppercase text-[#121212]">
                    Viral Growth Funnel
                  </h2>
                </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-3">
                <span className="font-mono text-xl font-black text-[#121212] block">
                  {analytics.funnel?.vote_submitted || 0}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60">
                  Votes Submitted
                </span>
              </div>

              <div className="rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-3">
                <span className="font-mono text-xl font-black text-[#2748FF] block">
                  {analytics.funnel?.battle_shared || 0}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60">
                  Battles Shared
                </span>
              </div>

              <div className="rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-3">
                <span className="font-mono text-xl font-black text-[#FF5C9A] block">
                  {analytics.funnel?.challenge_started || 0}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60">
                  Challenges Started
                </span>
              </div>

              <div className="rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-3">
                <span className="font-mono text-xl font-black text-[#00B26B] block">
                  {analytics.funnel?.battle_created || 0}
                </span>
                <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60">
                  Battles Created
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Battle Management Table */}
        <div className="poster-card p-5 bg-[#FFFFFF] mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Swords className="h-5 w-5 text-[#FFD11A]" />
              <h2 className="text-lg font-black uppercase text-[#121212]">
                Active Food Battles ({battles.length})
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#121212] font-mono text-[11px] font-black uppercase text-[#121212]/70">
                  <th className="py-2 pr-3">Battle Title</th>
                  <th className="py-2 pr-3">Contestants</th>
                  <th className="py-2 pr-3">Votes (A / B)</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b border-[#121212]/20 font-bold">
                {battles.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F6EFE2]/50">
                    <td className="py-3 pr-3">
                      <span className="font-black text-[#121212] block">{b.title}</span>
                      <span className="text-[10px] text-[#121212]/60 font-mono">
                        {b.neighborhood} • {b.dishName}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="text-[#2748FF] block">{b.contestantA.name} ({b.percentA}%)</span>
                      <span className="text-[#FF5C9A] block">{b.contestantB.name} ({b.percentB}%)</span>
                    </td>
                    <td className="py-3 pr-3 font-mono font-black">
                      {b.votesA.toLocaleString()} vs {b.votesB.toLocaleString()}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-black uppercase border border-[#121212] ${
                          b.isActive ? 'bg-[#00B26B] text-white' : 'bg-[#DDD4C2] text-[#121212]'
                        }`}
                      >
                        {b.isActive ? 'LIVE' : 'COMPLETED'}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => toggleBattleStatus(b.id)}
                        className="btn-white px-2 py-1 text-[10px] font-mono"
                      >
                        {b.isActive ? 'Mark Complete' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Challenge Moderation Queue */}
        <div className="poster-card p-5 bg-[#FFFFFF]">
          <div className="flex items-center space-x-2 mb-3">
            <Trophy className="h-5 w-5 text-[#FF5C9A]" />
            <h2 className="text-lg font-black uppercase text-[#121212]">
              Challenge Moderation Queue ({challenges.length})
            </h2>
          </div>

          <div className="space-y-3">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-3 gap-2"
              >
                <div>
                  <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px] mb-1">
                    {c.neighborhood} • {c.dishCategory}
                  </span>
                  <h4 className="text-xs font-black text-[#121212]">
                    Challenger: {c.challengerName} vs Winner: {c.winnerContestantName}
                  </h4>
                  <p className="text-[11px] text-[#121212]/75 italic mt-0.5">
                    "{c.reason}"
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="font-mono text-xs font-bold">
                    {c.upvotes} Upvotes
                  </span>
                  <button
                    onClick={() => approveChallenge(c.id)}
                    className="flex items-center space-x-1 rounded-lg bg-[#00B26B] px-2.5 py-1 text-white text-xs font-bold border border-[#121212]"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Approved</span>
                  </button>
                  <button
                    onClick={() => rejectChallenge(c.id)}
                    className="flex items-center space-x-1 rounded-lg bg-red-600 px-2.5 py-1 text-white text-xs font-bold border border-[#121212]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )}
  </div>
</div>
  );
}
