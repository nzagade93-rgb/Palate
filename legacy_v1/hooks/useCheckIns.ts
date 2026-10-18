import { useState, useEffect, useCallback } from 'react';
import type { Dish, CheckIn, CheckInReaction } from '../types';
import { liveDataService } from '../services/supabase';

const CHECKINS_STORAGE_KEY = 'vault_checkins';

export function useCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    try {
      const stored = localStorage.getItem(CHECKINS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading check-ins from localStorage', e);
    }
    return [];
  });

  // 1. Initial hydration from live Supabase + multi-tab / storage listeners
  useEffect(() => {
    // Sync with live Supabase check-ins
    liveDataService.getLiveCheckIns().then((live) => {
      if (live && live.length > 0) {
        setCheckIns((prev) => {
          const map = new Map<string, CheckIn>();
          [...live, ...prev].forEach((item) => {
            if (!map.has(item.id)) {
              map.set(item.id, item);
            }
          });
          const merged = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
          try {
            localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.error(e);
          }
          return merged;
        });
      }
    });

    // Real-time subscription across Supabase and cross-tab BroadcastChannel
    const unsubscribe = liveDataService.subscribeToLiveCheckIns((newCheckIn) => {
      setCheckIns((prev) => [newCheckIn, ...prev.filter((c) => c.id !== newCheckIn.id)]);
    });

    const handleStorageUpdate = () => {
      try {
        const stored = localStorage.getItem(CHECKINS_STORAGE_KEY);
        if (stored) {
          setCheckIns(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error reloading check-ins', e);
      }
    };

    window.addEventListener('palate_checkin_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('palate_checkin_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const addCheckIn = useCallback((
    dish: Dish,
    reaction: CheckInReaction,
    note?: string
  ): CheckIn => {
    const newCheckIn: CheckIn = {
      id: `checkin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dishId: dish.id,
      dishName: dish.name,
      venueName: dish.venueName,
      reaction,
      timestamp: Date.now(),
      note: note?.trim() || undefined
    };

    // Optimistic local state update
    setCheckIns((prev) => {
      const updated = [newCheckIn, ...prev.filter((c) => c.id !== newCheckIn.id)];
      try {
        localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('palate_checkin_updated'));
      } catch (e) {
        console.error('Error saving check-in', e);
      }
      return updated;
    });

    // Publish to Supabase database and multi-tab BroadcastChannel
    liveDataService.publishCheckIn(newCheckIn).catch((err) => {
      console.warn('Network sync notice:', err);
    });

    return newCheckIn;
  }, []);

  const isCheckedInToday = useCallback((dishId: string): boolean => {
    const todayStr = new Date().toDateString();
    return checkIns.some(
      (c) => c.dishId === dishId && new Date(c.timestamp).toDateString() === todayStr
    );
  }, [checkIns]);

  const getLatestCheckIn = useCallback((dishId: string): CheckIn | undefined => {
    return checkIns.find((c) => c.dishId === dishId);
  }, [checkIns]);

  return {
    checkIns,
    addCheckIn,
    isCheckedInToday,
    getLatestCheckIn
  };
}
