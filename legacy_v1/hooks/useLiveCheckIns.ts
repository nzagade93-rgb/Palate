import { useState, useEffect, useCallback } from 'react';
import type { Dish, CheckIn, CheckInReaction } from '../types';
import { liveDataService, isSupabaseConfigured } from '../services/supabase';

const USER_CHECKINS_KEY = 'vault_checkins';

export function useLiveCheckIns() {
  // 1. Current user's own check-ins
  const [userCheckIns, setUserCheckIns] = useState<CheckIn[]>(() => {
    try {
      const stored = localStorage.getItem(USER_CHECKINS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 2. Global Live Community Check-in Stream
  const [liveStream, setLiveStream] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial stream & setup subscription
  useEffect(() => {
    let isMounted = true;

    liveDataService.getLiveCheckIns().then((data) => {
      if (isMounted) {
        setLiveStream(data);
        setIsLoading(false);
      }
    });

    const unsubscribe = liveDataService.subscribeToLiveCheckIns((newCheckIn) => {
      setLiveStream((prev) => {
        if (prev.some((c) => c.id === newCheckIn.id)) return prev;
        return [newCheckIn, ...prev].slice(0, 50);
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Sync user's checkins across tabs
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem(USER_CHECKINS_KEY);
        if (stored) setUserCheckIns(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('palate_user_checkin_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('palate_user_checkin_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Method to record a new check-in
  const addCheckIn = useCallback(async (
    dish: Dish,
    reaction: CheckInReaction,
    note?: string
  ): Promise<CheckIn> => {
    const newCheckIn: CheckIn = {
      id: `checkin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dishId: dish.id,
      dishName: dish.name,
      venueName: dish.venueName,
      reaction,
      timestamp: Date.now(),
      note: note?.trim() || undefined
    };

    // Save locally to user list
    setUserCheckIns((prev) => {
      const updated = [newCheckIn, ...prev];
      try {
        localStorage.setItem(USER_CHECKINS_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('palate_user_checkin_updated'));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Publish to live multi-user network (Supabase / BroadcastChannel)
    await liveDataService.publishCheckIn(newCheckIn);

    return newCheckIn;
  }, []);

  const isCheckedInToday = useCallback((dishId: string): boolean => {
    const todayStr = new Date().toDateString();
    return userCheckIns.some(
      (c) => c.dishId === dishId && new Date(c.timestamp).toDateString() === todayStr
    );
  }, [userCheckIns]);

  const getLatestUserCheckIn = useCallback((dishId: string): CheckIn | undefined => {
    return userCheckIns.find((c) => c.dishId === dishId);
  }, [userCheckIns]);

  // Derived community stats
  const todayCount = liveStream.filter(
    (c) => Date.now() - c.timestamp < 24 * 60 * 60 * 1000
  ).length;

  const godTierCount = liveStream.filter((c) => c.reaction === 'GOD_TIER').length;
  const godTierPercent = liveStream.length > 0
    ? Math.round((godTierCount / liveStream.length) * 100)
    : 96;

  return {
    userCheckIns,
    liveStream,
    isLoading,
    isSupabaseConfigured,
    addCheckIn,
    isCheckedInToday,
    getLatestUserCheckIn,
    stats: {
      todayCount: Math.max(todayCount, 18), // minimum realistic count
      godTierPercent,
      activeFoodiesNearby: Math.max(Math.floor(todayCount * 1.5), 14)
    }
  };
}
