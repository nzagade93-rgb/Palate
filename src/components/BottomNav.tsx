'use client';

import React from 'react';
import { 
  Compass, 
  Search, 
  Dna, 
  Bookmark 
} from 'lucide-react';
import type { ScreenTab } from '../types/palate';

interface BottomNavProps {
  currentTab: ScreenTab;
  setCurrentTab: (tab: ScreenTab) => void;
  vaultCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  vaultCount,
}) => {
  return (
    <nav 
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[430px] z-40 h-16 bg-ivory/95 backdrop-blur-xl border-t border-gold-light/60 px-2 flex items-center pb-[env(safe-area-inset-bottom,0px)] shadow-sheet select-none"
    >
      <div className="grid grid-cols-4 items-center text-center w-full">
        {/* Tab 1: Discover */}
        <button
          type="button"
          onClick={() => setCurrentTab('discover')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 w-full rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentTab === 'discover'
              ? 'text-espresso font-bold'
              : 'text-muted hover:text-espresso'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Compass className={`w-5 h-5 transition-transform ${currentTab === 'discover' ? 'text-espresso scale-110' : ''}`} />
            {currentTab === 'discover' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold" />
            )}
          </div>
          <span className={`text-[10px] tracking-luxury uppercase mt-1 ${
            currentTab === 'discover' ? 'text-espresso font-extrabold' : 'text-muted'
          }`}>
            Discover
          </span>
        </button>

        {/* Tab 2: Search */}
        <button
          type="button"
          onClick={() => setCurrentTab('search')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 w-full rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentTab === 'search'
              ? 'text-espresso font-bold'
              : 'text-muted hover:text-espresso'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Search className={`w-5 h-5 transition-transform ${currentTab === 'search' ? 'text-espresso scale-110' : ''}`} />
            {currentTab === 'search' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold" />
            )}
          </div>
          <span className={`text-[10px] tracking-luxury uppercase mt-1 ${
            currentTab === 'search' ? 'text-espresso font-extrabold' : 'text-muted'
          }`}>
            Search
          </span>
        </button>

        {/* Tab 3: DNA */}
        <button
          type="button"
          onClick={() => setCurrentTab('dna')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 w-full rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentTab === 'dna'
              ? 'text-espresso font-bold'
              : 'text-muted hover:text-espresso'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Dna className={`w-5 h-5 transition-transform ${currentTab === 'dna' ? 'text-espresso scale-110' : ''}`} />
            {currentTab === 'dna' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold" />
            )}
          </div>
          <span className={`text-[10px] tracking-luxury uppercase mt-1 ${
            currentTab === 'dna' ? 'text-espresso font-extrabold' : 'text-muted'
          }`}>
            DNA
          </span>
        </button>

        {/* Tab 4: Vault */}
        <button
          type="button"
          onClick={() => setCurrentTab('vault')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 w-full rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentTab === 'vault'
              ? 'text-espresso font-bold'
              : 'text-muted hover:text-espresso'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Bookmark className={`w-5 h-5 transition-transform ${currentTab === 'vault' ? 'text-espresso scale-110' : ''}`} />
            {vaultCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[15px] h-3.5 rounded-full bg-gold text-white text-[9px] font-black flex items-center justify-center leading-none">
                {vaultCount}
              </span>
            )}
            {currentTab === 'vault' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-gold" />
            )}
          </div>
          <span className={`text-[10px] tracking-luxury uppercase mt-1 ${
            currentTab === 'vault' ? 'text-espresso font-extrabold' : 'text-muted'
          }`}>
            Vault
          </span>
        </button>
      </div>
    </nav>
  );
};
