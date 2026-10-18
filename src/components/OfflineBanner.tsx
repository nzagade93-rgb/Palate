import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Sparkles } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedToast(true);
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedToast(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnectedToast) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-sm z-50 animate-slide-down pointer-events-none">
      {!isOnline ? (
        <div className="p-2.5 rounded-2xl bg-[var(--surface-1)]/95 backdrop-blur-md border border-amber-500/40 shadow-xl flex items-center justify-between gap-2.5 text-[var(--text-primary)] pointer-events-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h5 className="text-[11px] font-bold text-amber-300 leading-tight">
                Offline Mode Active
              </h5>
              <p className="text-[10px] text-slate-300 truncate">
                Cached menus & food vault 100% accessible
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono uppercase bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800 text-amber-400 shrink-0 font-bold">
            PWA
          </span>
        </div>
      ) : (
        <div className="p-2.5 rounded-2xl bg-emerald-950/95 backdrop-blur-md border border-emerald-500/40 shadow-xl flex items-center gap-2 text-white pointer-events-auto animate-fade-in">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <h5 className="text-[11px] font-bold text-emerald-300 leading-tight flex items-center gap-1">
              <span>Back Online</span>
              <Sparkles className="w-3 h-3 text-emerald-400" />
            </h5>
            <p className="text-[10px] text-emerald-200/80 truncate">
              Live multi-user sync restored
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
