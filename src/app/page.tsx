'use client';

import React, { useState, useEffect } from 'react';
import { BottomNav } from '../components/BottomNav';
import { DiscoverView } from '../components/views/DiscoverView';
import { SearchView } from '../components/views/SearchView';
import { DNAView } from '../components/views/DNAView';
import { VaultView } from '../components/views/VaultView';
import { DetailSheet } from '../components/DetailSheet';
import { CheckInModal } from '../components/CheckInModal';
import { SplitModal } from '../components/SplitModal';
import { 
  SEED_DISHES, 
  LIVE_CHECKIN_STREAM, 
  CURRENT_USER, 
  computeCosineSimilarity 
} from '../data/seedData';
import type { Dish, ScreenTab, Vouch, User } from '../types/palate';

export default function PalatePage() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('discover');
  const [dishes, setDishes] = useState<Dish[]>(SEED_DISHES);
  const [savedDishIds, setSavedDishIds] = useState<Set<string>>(new Set(['dish-dal-pakwan']));
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);

  // Modals & Sheets
  const [activeDetailDish, setActiveDetailDish] = useState<Dish | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeCheckInDish, setActiveCheckInDish] = useState<Dish | null>(null);
  const [activeSplitDish, setActiveSplitDish] = useState<Dish | null>(null);

  // Live Stream Ticker state
  const [liveStreamIndex, setLiveStreamIndex] = useState(0);

  // Load saved dishes from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('palate_light_vault');
      if (stored) {
        setSavedDishIds(new Set(JSON.parse(stored)));
      }
    } catch {}
  }, []);

  // Save to localStorage
  const handleToggleSave = (dishId: string) => {
    setSavedDishIds((prev) => {
      const next = new Set(prev);
      if (next.has(dishId)) {
        next.delete(dishId);
      } else {
        next.add(dishId);
      }
      try {
        localStorage.setItem('palate_light_vault', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  // Open Detail Sheet
  const handleOpenDetail = (dish: Dish) => {
    setActiveDetailDish(dish);
    setIsDetailOpen(true);
  };

  // "Decide for me" implementation
  const handleDecideForMe = () => {
    // 1. Light haptic feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }

    // 2. Select highest cosine-similarity match to User DNA
    let bestDish = dishes[0];
    let highestSim = -1;

    for (const d of dishes) {
      const sim = computeCosineSimilarity(currentUser.dnaAffinities, d.dnaVector);
      if (sim > highestSim) {
        highestSim = sim;
        bestDish = d;
      }
    }

    // 3. Open Detail Sheet
    setActiveDetailDish(bestDish);
    setIsDetailOpen(true);
  };

  // Handle New Vouch from CheckIn Modal
  const handleSubmitVouch = (vouch: Vouch) => {
    // Update dish vouch counts
    setDishes((prev) =>
      prev.map((d) => {
        if (d.id === vouch.dishId) {
          const isVouch = vouch.verdict === 'vouch';
          const newVouchCount = d.vouchCount + 1;
          const newGodTierPct = isVouch 
            ? Math.min(99, Math.round((d.godTierPct * d.vouchCount + 100) / newVouchCount))
            : Math.max(60, Math.round((d.godTierPct * d.vouchCount) / newVouchCount));
          return {
            ...d,
            vouchCount: newVouchCount,
            vouchesThisMonth: d.vouchesThisMonth + 1,
            godTierPct: newGodTierPct,
          };
        }
        return d;
      })
    );

    // Update user log count
    setCurrentUser((prev) => ({
      ...prev,
      logCount: prev.logCount + 1,
    }));
  };

  // Saved Dishes list
  const savedDishesList = dishes.filter((d) => savedDishIds.has(d.id));

  // Current live stream item
  const activeLiveItem = LIVE_CHECKIN_STREAM[liveStreamIndex % LIVE_CHECKIN_STREAM.length];

  return (
    <div className="min-h-screen w-full bg-ivory flex justify-center items-start text-espresso">
      {/* 430px Max-Width App Shell */}
      <main className="w-full max-w-[430px] min-h-[100dvh] bg-ivory text-espresso px-4 pt-3 pb-24 relative shadow-2xl border-x border-hairline/60 flex flex-col font-sans">
        
        {/* Screen 1: Discover */}
        {currentTab === 'discover' && (
          <DiscoverView
            dishes={dishes}
            savedDishIds={savedDishIds}
            onToggleSave={handleToggleSave}
            onOpenDetail={handleOpenDetail}
            onCheckIn={(dish) => setActiveCheckInDish(dish)}
            onSplit={(dish) => setActiveSplitDish(dish)}
            onDecideForMe={handleDecideForMe}
            liveVouch={
              activeLiveItem
                ? {
                    userName: activeLiveItem.userName,
                    dishName: activeLiveItem.dishName,
                    restaurantName: activeLiveItem.restaurantName,
                    timeAgo: 'Just now',
                  }
                : null
            }
          />
        )}

        {/* Screen 2: Search */}
        {currentTab === 'search' && (
          <SearchView
            dishes={dishes}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {/* Screen 3: DNA */}
        {currentTab === 'dna' && (
          <DNAView user={currentUser} />
        )}

        {/* Screen 4: Vault */}
        {currentTab === 'vault' && (
          <VaultView
            savedDishes={savedDishesList}
            onToggleSave={handleToggleSave}
            onOpenDetail={handleOpenDetail}
            onNavigateToDiscover={() => setCurrentTab('discover')}
          />
        )}

        {/* Detail Bottom Sheet */}
        <DetailSheet
          dish={activeDetailDish}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          isSaved={activeDetailDish ? savedDishIds.has(activeDetailDish.id) : false}
          onToggleSave={() => {
            if (activeDetailDish) handleToggleSave(activeDetailDish.id);
          }}
          onReserveTable={() => {
            alert(`Table reservation request sent for ${activeDetailDish?.restaurantName}. They will hold a table for 15 minutes!`);
            setIsDetailOpen(false);
          }}
          onOrderDirect={() => {
            alert(`Opening verified dining directions to ${activeDetailDish?.restaurantName}...`);
            setIsDetailOpen(false);
          }}
        />

        {/* 10-Second Fast Meal Logger Modal */}
        <CheckInModal
          dish={activeCheckInDish}
          isOpen={Boolean(activeCheckInDish)}
          onClose={() => setActiveCheckInDish(null)}
          onSubmitVouch={handleSubmitVouch}
        />

        {/* Bill / Order Split Modal */}
        <SplitModal
          dish={activeSplitDish}
          isOpen={Boolean(activeSplitDish)}
          onClose={() => setActiveSplitDish(null)}
        />

        {/* Bottom Navigation Dock (Exactly 4, Always Visible, Solid Blurred Ivory) */}
        <BottomNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          vaultCount={savedDishIds.size}
        />
      </main>
    </div>
  );
}
