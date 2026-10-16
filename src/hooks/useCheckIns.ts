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

  // Sync state when other components or tabs trigger check-ins
  useEffect(() => {
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

    setCheckIns((prev) => {
      const updated = [newCheckIn, ...prev];
      try {
        localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('palate_checkin_updated'));
      } catch (e) {
        console.error('Error saving check-in', e);
      }
      return updated;
    });

    // Also publish to multi-user live feed (Supabase + BroadcastChannel)
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
