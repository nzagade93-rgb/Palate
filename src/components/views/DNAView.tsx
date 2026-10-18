'use client';

import React, { useState } from 'react';
import { Dna, Share2, Sparkles, Check, Info } from 'lucide-react';
import { AffinityBar } from '../AffinityBar';
import { CURRENT_USER } from '../../data/seedData';
import type { User } from '../../types/palate';

interface DNAViewProps {
  user?: User;
}

export const DNAView: React.FC<DNAViewProps> = ({
  user = CURRENT_USER,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `🧬 My Palate Taste Blueprint:\n` +
      `Archetype: ${user.archetype}\n` +
      `• Crunch: ${user.dnaAffinities.crunch}%\n` +
      `• Heat: ${user.dnaAffinities.heat}%\n` +
      `• Ghee: ${user.dnaAffinities.ghee}%\n` +
      `• Tang: ${user.dnaAffinities.tang}%\n` +
      `• Sweet: ${user.dnaAffinities.sweet}%\n` +
      `Primary Corridor: ${user.primaryCorridor}\n` +
      `Dietary Split: ${Math.round(user.vegRatio * 100)}% Pure Veg\n` +
      `Discovered on Palate Navi Mumbai.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const progressPct = Math.round((user.logCount / 25) * 100);

  return (
    <div className="space-y-6 pb-24 font-sans">
      {/* Title */}
      <div className="space-y-1 pt-2">
        <span className="text-[10.5px] uppercase tracking-overline text-gold font-bold block">
          Palate DNA
        </span>
        <h1 className="font-serif text-3xl font-bold text-espresso tracking-tight">
          Your Taste Blueprint
        </h1>
        <p className="text-xs text-muted">
          Distilled algorithmically from your saved orders, verified check-ins, and taste affinity vectors.
        </p>
      </div>

      {/* Espresso Archetype Card */}
      <div className="rounded-3xl bg-espresso text-card p-6 shadow-card border border-gold-light/40 relative overflow-hidden space-y-4">
        {/* Subtle Watermark Arch */}
        <div className="absolute -right-8 -bottom-10 w-44 h-56 rounded-[999px_999px_20px_20px] border border-gold-light/10 pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold-light/30 text-gold-light text-[10px] font-bold uppercase tracking-overline">
            <Sparkles className="w-3 h-3 text-gold-light" />
            <span>Taste Archetype</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-card leading-tight">
            {user.archetype}
          </h2>

          <p className="text-xs text-gold-light/80 leading-relaxed font-sans">
            {user.archetypeSubtitle}
          </p>
        </div>

        {/* Footnote Stats */}
        <div className="pt-3 border-t border-hairline/20 flex items-center justify-between text-xs relative z-10 text-card/90">
          <div>
            <span className="text-[10px] uppercase tracking-overline text-gold-light/60 block">Primary Corridor</span>
            <span className="font-semibold">{user.primaryCorridor}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-overline text-gold-light/60 block">Dietary Split</span>
            <span className="font-semibold">{Math.round(user.vegRatio * 100)}% Pure Veg</span>
          </div>
        </div>
      </div>

      {/* Independent Affinity Bars */}
      <div className="p-5 rounded-3xl bg-card border border-hairline shadow-subtle space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-espresso">
              Taste Pillar Affinities
            </h3>
            <span className="text-[10px] uppercase tracking-overline text-gold font-bold">
              Independent Scores
            </span>
          </div>
          {/* Explicit label that bars do NOT sum to 100 */}
          <div className="flex items-start gap-1.5 text-[11px] text-muted bg-ivory/60 p-2 rounded-lg border border-hairline/60">
            <Info className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Affinity meters evaluate independent culinary traits on a 0–100 scale; they do <em>not</em> sum to 100.
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <AffinityBar
            label="Crunch & Snap"
            sublabel="Layered pakwan, tawa blisters, fried crusts"
            percentage={user.dnaAffinities.crunch}
          />
          <AffinityBar
            label="Heat & Pungency"
            sublabel="Hand-crushed green chillies & roasted masalas"
            percentage={user.dnaAffinities.heat}
          />
          <AffinityBar
            label="Pure Ghee & Richness"
            sublabel="Country cow ghee & slow-simmered dals"
            percentage={user.dnaAffinities.ghee}
          />
          <AffinityBar
            label="Tang & Fermentation"
            sublabel="Fresh kokum acid, sour curd & tamarind"
            percentage={user.dnaAffinities.tang}
          />
          <AffinityBar
            label="Sweet Finish"
            sublabel="Cardamom rabdi, kesar doodh, saffron jalebi"
            percentage={user.dnaAffinities.sweet}
          />
        </div>
      </div>

      {/* Early Read Progress Card */}
      <div className="p-5 rounded-3xl bg-card border border-hairline shadow-subtle space-y-3">
        <div className="flex justify-between items-baseline text-xs">
          <span className="font-semibold text-espresso">
            Early read: <strong>{user.logCount} of 25 logs</strong>
          </span>
          <span className="font-serif font-bold text-gold text-sm">{progressPct}%</span>
        </div>

        <div className="h-2 w-full bg-ivory rounded-full overflow-hidden border border-hairline p-[1px]">
          <div 
            className="h-full bg-espresso rounded-full transition-all duration-700" 
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <p className="text-[11px] text-muted leading-relaxed">
          Log 15 more dining vouches to unlock deeper sub-regional profile clusters (e.g. Sindhi vs Malvani bias).
        </p>
      </div>

      {/* [SHARE MY PALATE] Action Button */}
      <button
        type="button"
        onClick={handleShare}
        className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl bg-espresso hover:bg-[#2B2119] text-gold-light font-bold text-xs uppercase tracking-luxury shadow-card active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-gold-light" />
            <span>Blueprint Copied to Clipboard</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-gold-light" />
            <span>Share My Palate</span>
          </>
        )}
      </button>
    </div>
  );
};
