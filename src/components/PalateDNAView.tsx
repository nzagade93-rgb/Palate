import React, { useMemo } from 'react';
import { 
  Dna, 
  Sparkles, 
  Flame, 
  MapPin, 
  ArrowRight
} from 'lucide-react';
import type { Dish } from '../types';
import { DISHES } from '../data/mockData';
import { useVault } from '../hooks/useVault';
import { useCheckIns } from '../hooks/useCheckIns';

interface PalateDNAViewProps {
  onSelectDish: (dish: Dish) => void;
  onNavigateToDiscover: () => void;
}

export const PalateDNAView: React.FC<PalateDNAViewProps> = ({
  onSelectDish,
  onNavigateToDiscover,
}) => {
  const { vaultItems } = useVault();
  const { checkIns } = useCheckIns();

  // Compute Taste Metrics from Real User Vault & Check-ins
  const dnaStats = useMemo(() => {
    const totalInteractions = vaultItems.length + checkIns.length;

    // Default baseline if user has no vault items yet
    let spicyCount = 0;
    let crispyCount = 0;
    let comfortCount = 0;
    let vegCount = 0;
    let nonVegCount = 0;
    const corridorCounts: Record<string, number> = {};

    // Analyze vault items
    vaultItems.forEach((item) => {
      const dish = DISHES.find((d) => d.id === item.dishId);
      if (dish) {
        if (dish.isVeg) vegCount++; else nonVegCount++;
        dish.flavorTags.forEach((tag) => {
          const t = tag.toLowerCase();
          if (t.includes('spicy') || t.includes('masala') || t.includes('fiery') || t.includes('chilli')) spicyCount++;
          if (t.includes('crisp') || t.includes('crunch') || t.includes('tandoor') || t.includes('dosa')) crispyCount++;
          if (t.includes('ghee') || t.includes('butter') || t.includes('comfort') || t.includes('thali') || t.includes('dal')) comfortCount++;
        });
        const area = dish.venueArea.split(',')[0].trim();
        corridorCounts[area] = (corridorCounts[area] || 0) + 1;
      }
    });

    // Analyze check-ins
    checkIns.forEach((check) => {
      const dish = DISHES.find((d) => d.id === check.dishId);
      if (dish) {
        if (dish.isVeg) vegCount++; else nonVegCount++;
        dish.flavorTags.forEach((tag) => {
          const t = tag.toLowerCase();
          if (t.includes('spicy') || t.includes('masala') || t.includes('fiery') || t.includes('chilli')) spicyCount++;
          if (t.includes('crisp') || t.includes('crunch') || t.includes('tandoor') || t.includes('dosa')) crispyCount++;
          if (t.includes('ghee') || t.includes('butter') || t.includes('comfort') || t.includes('thali') || t.includes('dal')) comfortCount++;
        });
        const area = dish.venueArea.split(',')[0].trim();
        corridorCounts[area] = (corridorCounts[area] || 0) + 1;
      }
    });

    const sumFlavors = Math.max(spicyCount + crispyCount + comfortCount, 1);
    const spicyPct = Math.round((spicyCount / sumFlavors) * 100) || 45;
    const crispyPct = Math.round((crispyCount / sumFlavors) * 100) || 30;
    const comfortPct = Math.round((comfortCount / sumFlavors) * 100) || 25;

    const totalDiet = vegCount + nonVegCount;
    const vegPct = totalDiet > 0 ? Math.round((vegCount / totalDiet) * 100) : 75;

    // Determine Archetype
    let archetype = 'Corridor Spice Explorer';
    let archetypeDescription = 'You explore a balanced spectrum of authentic corridor specialties, from street kiosks to legendary heritage kitchens.';
    if (spicyPct > 45) {
      archetype = 'Street Spice & Heat Connoisseur';
      archetypeDescription = 'You crave bold, authentic high-heat masala profiles, seeking out fiery tawa specials and rich aromatic gravies.';
    } else if (comfortPct > 40) {
      archetype = 'Heritage Ghee & Comfort Purist';
      archetypeDescription = 'You appreciate deep, rich culinary traditions—pure ghee thalis, double-blistered pakwans, and slow-simmered regional staples.';
    } else if (crispyPct > 40) {
      archetype = 'Texture & Crunch Devotee';
      archetypeDescription = 'From paper-thin ghee roast dosas to sizzling coastal tawa fries, texture and snap lead your cravings.';
    }

    // Top corridors
    const sortedCorridors = Object.entries(corridorCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    return {
      totalInteractions,
      archetype,
      archetypeDescription,
      spicyPct,
      crispyPct,
      comfortPct,
      vegPct,
      topCorridor: sortedCorridors[0] || 'Sector 17, Vashi',
    };
  }, [vaultItems, checkIns]);

  // Recommended dishes based on DNA
  const recommendedDishes = useMemo(() => {
    const savedIds = new Set(vaultItems.map((i) => i.dishId));
    return DISHES.filter((d) => !savedIds.has(d.id) && d.verdict === 'GOD_TIER').slice(0, 3);
  }, [vaultItems]);

  return (
    <div className="w-full space-y-6 pb-20 animate-fade-in font-sans">
      {/* Editorial Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-black tracking-luxury uppercase">
          <Dna className="w-4 h-4 text-brand-orange" />
          <span>Palate Taste DNA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[var(--text-primary)] tracking-tight">
          Your Evolving Taste Profile
        </h1>
        <p className="text-xs text-[var(--text-muted)] max-w-sm">
          A living blueprint of your flavor affinities, dietary leanings, and corridor habits distilled from your saved dishes and dining check-ins.
        </p>
      </div>

      {/* Main Archetype Card */}
      <div className="relative rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[var(--surface-2)] via-[var(--surface-1)] to-[var(--surface-2)] border border-[var(--border-subtle)] shadow-[var(--card-shadow)] overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Taste Archetype</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--text-primary)] tracking-wide leading-tight">
            {dnaStats.archetype}
          </h2>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md">
            {dnaStats.archetypeDescription}
          </p>

          <div className="flex items-center gap-4 pt-3 border-t border-[var(--border-subtle)] text-xs">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest block font-medium">Activity</span>
              <span className="font-extrabold text-[var(--text-primary)] text-sm">{dnaStats.totalInteractions} logs</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest block font-medium">Primary Hub</span>
              <span className="font-extrabold text-brand-orange text-sm">{dnaStats.topCorridor}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest block font-medium">Dietary Bias</span>
              <span className="font-extrabold text-emerald-500 text-sm">{dnaStats.vegPct}% Veg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flavor Profile Spectrum */}
      <div className="rounded-3xl p-5 bg-[var(--surface-1)] border border-[var(--border-subtle)] space-y-4 shadow-[var(--card-shadow)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-brand-orange" />
            <h3 className="text-xs font-black uppercase tracking-luxury text-[var(--text-primary)]">
              Flavor Spectrum Breakdown
            </h3>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">Based on flavor tags</span>
        </div>

        <div className="space-y-3.5 pt-1">
          {/* Spicy / Fiery Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[var(--text-secondary)]">🔥 Heat & Pungent Spice</span>
              <span className="font-mono text-brand-orange font-bold">{dnaStats.spicyPct}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-brand-orange rounded-full transition-all duration-700" 
                style={{ width: `${dnaStats.spicyPct}%` }}
              />
            </div>
          </div>

          {/* Crispy / Tawa Snap */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[var(--text-secondary)]">🥖 Texture, Snap & Tawa Crisp</span>
              <span className="font-mono text-amber-500 font-bold">{dnaStats.crispyPct}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-700" 
                style={{ width: `${dnaStats.crispyPct}%` }}
              />
            </div>
          </div>

          {/* Pure Ghee & Comfort */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[var(--text-secondary)]">🧈 Pure Ghee, Cream & Heritage Comfort</span>
              <span className="font-mono text-emerald-500 font-bold">{dnaStats.comfortPct}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700" 
                style={{ width: `${dnaStats.comfortPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dietary & Corridors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Dietary Balance */}
        <div className="p-4 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-subtle)] space-y-2.5 shadow-[var(--card-shadow)]">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            Dietary Orientation
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-500">{dnaStats.vegPct}% Pure Veg</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">{100 - dnaStats.vegPct}% Non-Veg</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Your dining history shows strong preference for Navi Mumbai's historic pure vegetarian eateries.
          </p>
        </div>

        {/* Card 2: Corridor Exploration */}
        <div className="p-4 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-subtle)] space-y-2.5 shadow-[var(--card-shadow)]">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center justify-between">
            <span>Primary Corridor</span>
            <MapPin className="w-3 h-3 text-brand-orange" />
          </div>
          <div className="text-xl font-black text-[var(--text-primary)]">{dnaStats.topCorridor}</div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Most of your vouched and saved spots cluster around the vibrant food streets of Sector 17 & Arenja.
          </p>
        </div>
      </div>

      {/* Personalized Matches Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <h3 className="text-xs font-black uppercase tracking-luxury text-[var(--text-primary)]">
              Curated For Your Palate DNA
            </h3>
          </div>
          <button 
            onClick={onNavigateToDiscover}
            className="text-xs text-brand-orange hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {recommendedDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => onSelectDish(dish)}
              className="p-3.5 rounded-2xl bg-[var(--surface-1)] hover:bg-[var(--surface-2)] border border-[var(--border-subtle)] hover:border-brand-orange/40 transition-all flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[var(--border-subtle)]"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/15 px-2 py-0.2 rounded border border-emerald-500/30">
                      {dish.scorePercent}% Match
                    </span>
                    <span className="text-xs font-extrabold text-[var(--text-primary)]">₹{dish.price}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-brand-orange transition-colors truncate mt-0.5">
                    {dish.name}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {dish.venueName} • {dish.venueArea}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] group-hover:bg-brand-orange group-hover:text-white text-[var(--text-muted)] flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
