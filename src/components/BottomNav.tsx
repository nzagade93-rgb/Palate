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
      className="fixed bottom-0 inset-x-0 mx-auto w-full max-w-[430px] z-40 h-[68px] bg-[var(--glass-nav-bg)] backdrop-blur-xl border-t border-[var(--border-subtle)] px-2 flex items-center pb-[env(safe-area-inset-bottom,0px)] shadow-[var(--card-shadow)] select-none transition-colors duration-250"
    >
      <div className="grid grid-cols-4 items-center text-center w-full h-full">
        {/* Tab 1: Discover / Radar */}
        <button
          onClick={() => setCurrentTab('radar')}
          aria-label="Discover Food Radar"
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 px-1.5 w-full rounded-2xl transition-all active:scale-90 cursor-pointer ${
            currentTab === 'radar'
              ? 'text-[var(--text-primary)] font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Compass className={`w-5 h-5 transition-transform duration-200 ${currentTab === 'radar' ? 'text-brand-orange scale-110' : ''}`} />
            {currentTab === 'radar' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-wider uppercase mt-1 transition-colors ${
            currentTab === 'radar' ? 'text-brand-orange font-extrabold' : 'text-[var(--text-muted)] font-semibold'
          }`}>
            Radar
          </span>
        </button>

        {/* Tab 2: Dish Search */}
        <button
          onClick={() => setCurrentTab('search')}
          aria-label="Search Dishes and Venues"
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 px-1.5 w-full rounded-2xl transition-all active:scale-90 cursor-pointer ${
            currentTab === 'search'
              ? 'text-[var(--text-primary)] font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Search className={`w-5 h-5 transition-transform duration-200 ${currentTab === 'search' ? 'text-brand-orange scale-110' : ''}`} />
            {currentTab === 'search' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-wider uppercase mt-1 transition-colors ${
            currentTab === 'search' ? 'text-brand-orange font-extrabold' : 'text-[var(--text-muted)] font-semibold'
          }`}>
            Khojo
          </span>
        </button>

        {/* Tab 3: Palate DNA */}
        <button
          onClick={() => setCurrentTab('dna')}
          aria-label="Taste DNA Profile"
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 px-1.5 w-full rounded-2xl transition-all active:scale-90 cursor-pointer ${
            currentTab === 'dna'
              ? 'text-[var(--text-primary)] font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Dna className={`w-5 h-5 transition-transform duration-200 ${currentTab === 'dna' ? 'text-brand-orange scale-110' : ''}`} />
            {currentTab === 'dna' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-wider uppercase mt-1 transition-colors ${
            currentTab === 'dna' ? 'text-brand-orange font-extrabold' : 'text-[var(--text-muted)] font-semibold'
          }`}>
            Taste DNA
          </span>
        </button>

        {/* Tab 4: Vault (Food Notebook) */}
        <button
          onClick={() => setCurrentTab('vault')}
          aria-label="Saved Vault"
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 px-1.5 w-full rounded-2xl transition-all active:scale-90 cursor-pointer ${
            currentTab === 'vault'
              ? 'text-[var(--text-primary)] font-bold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Bookmark className={`w-5 h-5 transition-transform duration-200 ${currentTab === 'vault' ? 'text-brand-orange scale-110' : ''}`} />
            {vaultCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 min-w-[16px] h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center leading-none shadow-sm">
                {vaultCount}
              </span>
            )}
            {currentTab === 'vault' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-wider uppercase mt-1 transition-colors ${
            currentTab === 'vault' ? 'text-brand-orange font-extrabold' : 'text-[var(--text-muted)] font-semibold'
          }`}>
            My Vault
          </span>
        </button>
      </div>
    </nav>
  );
};

