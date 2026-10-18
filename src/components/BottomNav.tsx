import React from 'react';
import { 
  Compass, 
  Search, 
  Dna, 
  Bookmark 
} from 'lucide-react';
import type { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
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
      className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[430px] z-40 h-16 bg-[var(--glass-nav-bg)] backdrop-blur-xl border-t border-[var(--border-subtle)] px-2 flex items-center pb-[env(safe-area-inset-bottom,0px)] shadow-[var(--card-shadow)] select-none transition-colors duration-250"
    >
      <div className="grid grid-cols-4 items-center text-center w-full">
        {/* Tab 1: Discover / Radar */}
        <button
          onClick={() => setCurrentTab('radar')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 w-full rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentTab === 'radar'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Compass className={`w-5 h-5 transition-transform ${currentTab === 'radar' ? 'text-brand-orange scale-110' : ''}`} />
            {currentTab === 'radar' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-widest uppercase mt-1 font-semibold ${
            currentTab === 'radar' ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'
          }`}>
            Discover
          </span>
        </button>

        {/* Tab 2: Dish Search */}
        <button
          onClick={() => setCurrentTab('search')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 w-full rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentTab === 'search'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Search className={`w-5 h-5 transition-transform ${currentTab === 'search' ? 'text-brand-orange scale-110' : ''}`} />
            {currentTab === 'search' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-widest uppercase mt-1 font-semibold ${
            currentTab === 'search' ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'
          }`}>
            Search
          </span>
        </button>

        {/* Tab 3: Palate DNA */}
        <button
          onClick={() => setCurrentTab('dna')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 w-full rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentTab === 'dna'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Dna className={`w-5 h-5 transition-transform ${currentTab === 'dna' ? 'text-brand-orange scale-110' : ''}`} />
            {currentTab === 'dna' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-widest uppercase mt-1 font-semibold ${
            currentTab === 'dna' ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'
          }`}>
            DNA
          </span>
        </button>

        {/* Tab 4: Vault (Food Notebook) */}
        <button
          onClick={() => setCurrentTab('vault')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 w-full rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentTab === 'vault'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Bookmark className={`w-5 h-5 transition-transform ${currentTab === 'vault' ? 'text-brand-orange scale-110' : ''}`} />
            {vaultCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-3.5 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
                {vaultCount}
              </span>
            )}
            {currentTab === 'vault' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-widest uppercase mt-1 font-semibold ${
            currentTab === 'vault' ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'
          }`}>
            Vault
          </span>
        </button>
      </div>
    </nav>
  );
};
