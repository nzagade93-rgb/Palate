import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'pill' | 'expanded';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'pill',
  className = '' 
}) => {
  const { toggleTheme, isDark } = useTheme();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'White Elite' : 'Dark Elite'} theme`}
        title={`Click for ${isDark ? 'White Elite' : 'Dark Elite'} theme`}
        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer border ${
          isDark
            ? 'bg-[#151922] border-gold-500/30 text-amber-300 hover:border-gold-400 hover:text-amber-200 shadow-sm'
            : 'bg-[#F0ECE1] border-gold-600/40 text-amber-700 hover:border-gold-600 hover:text-amber-800 shadow-sm'
        } ${className}`}
      >
        <span className="sr-only">Toggle Theme</span>
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Moon 
            className={`w-3.5 h-3.5 text-amber-300 absolute transition-all duration-300 ${
              isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            }`} 
          />
          <Sun 
            className={`w-3.5 h-3.5 text-amber-600 absolute transition-all duration-300 ${
              isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`} 
          />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'White Elite' : 'Dark Elite'} theme (1-Click)`}
      title={`Click to switch to ${isDark ? 'White Elite (Michelin Alabaster)' : 'Dark Elite (Obsidian Noir)'}`}
      className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 active:scale-95 cursor-pointer border select-none ${
        isDark
          ? 'bg-[#141821] hover:bg-[#1B202C] border-gold-500/35 hover:border-gold-400/60 text-amber-200 shadow-[0_2px_10px_-2px_rgba(212,175,55,0.25)]'
          : 'bg-[#FFFFFF] hover:bg-[#F9F7F2] border-gold-600/40 hover:border-gold-600 text-amber-900 shadow-[0_2px_10px_-2px_rgba(184,134,11,0.2)]'
      } ${className}`}
    >
      {/* Icon Capsule with subtle gold glow */}
      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 ${
        isDark ? 'bg-amber-400/15 text-amber-300' : 'bg-amber-500/15 text-amber-700'
      }`}>
        {isDark ? (
          <Moon className="w-3 h-3 fill-amber-300/60" />
        ) : (
          <Sun className="w-3 h-3 fill-amber-600/50" />
        )}
      </div>

      {/* Label */}
      <span className="flex items-center gap-1 font-semibold text-[10.5px]">
        <span>{isDark ? 'Dark Elite' : 'White Elite'}</span>
        <Sparkles className={`w-2.5 h-2.5 ${isDark ? 'text-amber-400' : 'text-amber-600'} opacity-75`} />
      </span>

      {/* Micro Status Dot */}
      <span className={`w-1.5 h-1.5 rounded-full ${
        isDark ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]' : 'bg-amber-600 shadow-[0_0_6px_#D97706]'
      }`} />
    </button>
  );
};
