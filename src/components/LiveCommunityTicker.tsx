import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  ChevronRight, 
  X, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  Globe
} from 'lucide-react';
import { useLiveCheckIns } from '../hooks/useLiveCheckIns';

export const LiveCommunityTicker: React.FC = () => {
  const { liveStream, stats, isSupabaseConfigured } = useLiveCheckIns();
  const [isOpen, setIsOpen] = useState(false);

  const latest = liveStream[0];

  const formatTimeAgo = (ts: number) => {
    const diffMins = Math.floor((Date.now() - ts) / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const hours = Math.floor(diffMins / 60);
    return `${hours}h ago`;
  };

  return (
    <>
      {/* Ticker Bar */}
      <div 
        onClick={() => setIsOpen(true)}
        className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-[var(--surface-1)] via-[var(--surface-2)] to-[var(--surface-1)] border border-[var(--border-subtle)] hover:border-gold-500/40 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between gap-2 shadow-sm group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold text-[var(--text-primary)]">
                {stats.activeFoodiesNearby} foodies checked in
              </span>
              <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1 rounded">
                {stats.godTierPercent}% God-Tier
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] truncate">
              {latest 
                ? `Latest: ${latest.dishName} at ${latest.venueName} (${formatTimeAgo(latest.timestamp)})`
                : 'Real-time anti-regret radar active across Navi Mumbai'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] shrink-0 font-medium">
          <span>Live Feed</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Modal Feed */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--modal-backdrop)] backdrop-blur-md animate-fade-in font-sans"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl bg-[var(--surface-1)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden relative animate-slide-up flex flex-col max-h-[80vh] text-[var(--text-primary)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-[var(--surface-2)] border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>Live Food Pulse</span>
                    {isSupabaseConfigured ? (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5" /> Cloud Sync
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
                        P2P Live
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Live community check-ins in Sector 17, Sector 9, Nerul & Belapur
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 no-scrollbar">
              {liveStream.map((item) => {
                const isGodTier = item.reaction === 'GOD_TIER';
                return (
                  <div 
                    key={item.id}
                    className="p-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--border-subtle)] space-y-1.5 text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isGodTier
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                          : 'bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30'
                      }`}>
                        {isGodTier ? <ThumbsUp className="w-2.5 h-2.5" /> : <ThumbsDown className="w-2.5 h-2.5" />}
                        <span>{isGodTier ? 'God-Tier' : 'Skip Warning'}</span>
                      </span>

                      <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                        <span>{formatTimeAgo(item.timestamp)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                        {item.dishName}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {item.venueName}
                      </div>
                    </div>

                    {item.note && (
                      <p className="text-[11px] text-[var(--text-secondary)] italic bg-[var(--surface-1)] p-2 rounded-xl border border-[var(--border-subtle)]">
                        "{item.note}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[var(--surface-2)] border-t border-[var(--border-subtle)] text-center shrink-0">
              <span className="text-[10px] text-[var(--text-muted)] font-medium">
                Tap "Check In" on any dish card to broadcast your bite to the radar!
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
