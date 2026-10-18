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
        className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-[#0E1116] via-[#161B22] to-[#0E1116] border border-[#262C36] hover:border-slate-500 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between gap-2 shadow-sm group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold text-white">
                {stats.activeFoodiesNearby} foodies checked in
              </span>
              <span className="text-[9px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-1 rounded">
                {stats.godTierPercent}% God-Tier
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {latest 
                ? `Latest: ${latest.dishName} at ${latest.venueName} (${formatTimeAgo(latest.timestamp)})`
                : 'Real-time anti-regret radar active across Navi Mumbai'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-white shrink-0 font-medium">
          <span>Live Feed</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Modal Feed */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl bg-[#0E1116] border border-[#262C36] shadow-2xl overflow-hidden relative animate-slide-up flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-[#161B22] border-b border-[#262C36] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Live Food Pulse</span>
                    {isSupabaseConfigured ? (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/50 flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5" /> Cloud Sync
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800/50">
                        P2P Live
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Live community check-ins in Sector 17, Sector 9, Nerul & Belapur
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
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
                    className="p-3 rounded-2xl bg-[#161B22] border border-[#262C36] space-y-1.5 text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isGodTier
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                          : 'bg-red-950/80 text-red-300 border-red-700/60'
                      }`}>
                        {isGodTier ? <ThumbsUp className="w-2.5 h-2.5" /> : <ThumbsDown className="w-2.5 h-2.5" />}
                        <span>{isGodTier ? 'God-Tier' : 'Skip Warning'}</span>
                      </span>

                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{formatTimeAgo(item.timestamp)}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {item.dishName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.venueName}
                      </div>
                    </div>

                    {item.note && (
                      <p className="text-[11px] text-slate-300 italic bg-[#0E1116] p-2 rounded-xl border border-[#262C36]/80">
                        "{item.note}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#161B22] border-t border-[#262C36] text-center shrink-0">
              <span className="text-[10px] text-slate-400 font-medium">
                Tap "Check In" on any dish card to broadcast your bite to the radar!
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
