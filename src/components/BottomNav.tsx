import React from 'react';
import { 
  Compass, 
  Dices, 
  Bookmark, 
  Printer 
} from 'lucide-react';

interface BottomNavProps {
  currentTab: 'radar' | 'vault';
  setCurrentTab: (tab: 'radar' | 'vault') => void;
  onOpenWheel: () => void;
  onOpenFlyer: () => void;
  vaultCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenWheel,
  onOpenFlyer,
  vaultCount,
}) => {
  return (
    <nav 
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-[#0E1116]/90 backdrop-blur-xl border-t border-[#262C36] px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl select-none"
    >
      <div className="grid grid-cols-4 items-center justify-items-center w-full">
        {/* Tab 1: Radar (Discovery) */}
        <button
          onClick={() => setCurrentTab('radar')}
          className={`flex flex-col items-center justify-center py-1 px-2 w-full rounded-xl transition-all active:scale-95 ${
            currentTab === 'radar'
              ? 'text-white'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Compass className={`w-5 h-5 transition-transform ${currentTab === 'radar' ? 'text-brand-orange scale-110' : ''}`} />
            {currentTab === 'radar' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-widest uppercase mt-1 font-semibold ${
            currentTab === 'radar' ? 'text-white font-bold' : 'text-neutral-400'
          }`}>
            Radar
          </span>
        </button>

        {/* Tab 2: Spin (Anti-Regret Wheel) */}
        <button
          onClick={onOpenWheel}
          className="flex flex-col items-center justify-center py-1 px-2 w-full rounded-xl transition-all active:scale-95 text-neutral-500 hover:text-amber-400 group"
        >
          <div className="relative flex items-center justify-center">
            <Dices className="w-5 h-5 text-amber-400/90 group-hover:rotate-45 transition-transform" />
          </div>
          <span className="text-[10px] tracking-widest uppercase mt-1 font-semibold text-neutral-400 group-hover:text-amber-300">
            Spin
          </span>
        </button>

        {/* Tab 3: Vault (Food Diary) */}
        <button
          onClick={() => setCurrentTab('vault')}
          className={`flex flex-col items-center justify-center py-1 px-2 w-full rounded-xl transition-all active:scale-95 ${
            currentTab === 'vault'
              ? 'text-white'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Bookmark className={`w-5 h-5 transition-transform ${currentTab === 'vault' ? 'text-brand-orange scale-110' : ''}`} />
            {vaultCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-3.5 rounded-full bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center leading-none">
                {vaultCount}
              </span>
            )}
            {currentTab === 'vault' && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-orange shadow-glow-orange" />
            )}
          </div>
          <span className={`text-[10px] tracking-widest uppercase mt-1 font-semibold ${
            currentTab === 'vault' ? 'text-white font-bold' : 'text-neutral-400'
          }`}>
            Vault
          </span>
        </button>

        {/* Tab 4: Fliers (B2B Perks) */}
        <button
          onClick={onOpenFlyer}
          className="flex flex-col items-center justify-center py-1 px-2 w-full rounded-xl transition-all active:scale-95 text-neutral-500 hover:text-neutral-300 group"
        >
          <div className="relative flex items-center justify-center">
            <Printer className="w-5 h-5 text-neutral-400 group-hover:text-brand-orange transition-colors" />
          </div>
          <span className="text-[10px] tracking-widest uppercase mt-1 font-semibold text-neutral-400 group-hover:text-neutral-200">
            Fliers
          </span>
        </button>
      </div>
    </nav>
  );
};
