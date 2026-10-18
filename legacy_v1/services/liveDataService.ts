import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { CheckIn, CheckInReaction, Dish, Venue } from '../types';
import { DISHES, VENUES } from '../data/mockData';

// 1. URL Sanitization: strip trailing slashes and /rest/v1/ suffix
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const sanitizedUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(sanitizedUrl && supabaseAnonKey);

// 2. Initialize Supabase Client with fail-safe fallback
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(sanitizedUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

const CHECKINS_STORAGE_KEY = 'vault_checkins';

// Local storage helper functions for robust offline PWA experience
export function getLocalCheckIns(): CheckIn[] {
  try {
    const stored = localStorage.getItem(CHECKINS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('[LiveDataService] Error reading local checkins', e);
  }
  return [];
}

export function saveLocalCheckIn(checkIn: CheckIn): void {
  try {
    const existing = getLocalCheckIns();
    const updated = [checkIn, ...existing.filter((c) => c.id !== checkIn.id)];
    localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('palate_checkin_updated'));
  } catch (e) {
    console.error('[LiveDataService] Error persisting local checkin', e);
  }
}

export function syncLocalCheckIns(liveList: CheckIn[]): void {
  try {
    const local = getLocalCheckIns();
    // Merge: prioritize newest by timestamp
    const map = new Map<string, CheckIn>();
    [...liveList, ...local].forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    const merged = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
    localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event('palate_checkin_updated'));
  } catch (e) {
    console.error('[LiveDataService] Error syncing local checkins', e);
  }
}

// 3. Service Layer Methods

/**
 * Health check & live database connectivity verification
 */
export async function testConnection(): Promise<{ ok: boolean; message: string; latencyMs?: number }> {
  if (!supabase) {
    return { 
      ok: false, 
      message: 'Supabase credentials missing. Running in local-only fallback mode.' 
    };
  }

  const start = performance.now();
  try {
    const { error } = await supabase
      .from('palate_checkins')
      .select('id')
      .limit(1);

    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      return { 
        ok: false, 
        message: `Database error: ${error.message}`, 
        latencyMs 
      };
    }

    return { 
      ok: true, 
      message: 'Connected to live Supabase database with real-time sync enabled.', 
      latencyMs 
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Connection failed';
    return { ok: false, message: errorMessage };
  }
}

/**
 * Fetch check-ins from live Supabase instance with offline cache fallback
 */
export async function fetchLiveCheckIns(): Promise<CheckIn[]> {
  if (!supabase) {
    return getLocalCheckIns();
  }

  try {
    const { data, error } = await supabase
      .from('palate_checkins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.warn('[LiveDataService] Error fetching checkins, using local cache:', error.message);
      return getLocalCheckIns();
    }

    if (data && Array.isArray(data)) {
      const mapped: CheckIn[] = data.map((row: Record<string, unknown>) => ({
        id: String(row.id),
        dishId: String(row.dish_id),
        dishName: String(row.dish_name),
        venueName: String(row.venue_name),
        reaction: row.reaction as CheckInReaction,
        timestamp: row.created_at ? new Date(String(row.created_at)).getTime() : Date.now(),
        note: row.note ? String(row.note) : undefined
      }));

      syncLocalCheckIns(mapped);
      return mapped;
    }

    return getLocalCheckIns();
  } catch (err) {
    console.warn('[LiveDataService] Live fetch failed, using local cache:', err);
    return getLocalCheckIns();
  }
}

/**
 * Record a check-in to Supabase and keep local storage in sync
 */
export async function recordLiveCheckIn(checkIn: CheckIn): Promise<{ ok: boolean; error?: string }> {
  // Always persist locally first for instant optimistic response
  saveLocalCheckIn(checkIn);

  if (!supabase) {
    return { ok: true };
  }

  try {
    const row = {
      id: checkIn.id,
      dish_id: checkIn.dishId,
      dish_name: checkIn.dishName,
      venue_name: checkIn.venueName,
      reaction: checkIn.reaction,
      note: checkIn.note || null,
      created_at: new Date(checkIn.timestamp).toISOString()
    };

    const { error } = await supabase
      .from('palate_checkins')
      .insert([row]);

    if (error) {
      console.error('[LiveDataService] Error recording check-in to Supabase:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unexpected insert error';
    console.error('[LiveDataService] Unexpected error recording checkin:', errorMessage);
    return { ok: false, error: errorMessage };
  }
}

/**
 * Subscribe to real-time check-in inserts across all active users
 */
export function subscribeToRealtimeCheckIns(callback: (checkIn: CheckIn) => void): () => void {
  if (!supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('palate_checkins_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'palate_checkins' },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          if (row && row.dish_id) {
            const checkIn: CheckIn = {
              id: String(row.id),
              dishId: String(row.dish_id),
              dishName: String(row.dish_name),
              venueName: String(row.venue_name),
              reaction: row.reaction as CheckInReaction,
              timestamp: row.created_at ? new Date(String(row.created_at)).getTime() : Date.now(),
              note: row.note ? String(row.note) : undefined
            };
            saveLocalCheckIn(checkIn);
            callback(checkIn);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('[LiveDataService] Realtime subscription could not be established:', e);
    return () => {};
  }
}

/**
 * Dishes and Venues data resolver with future cloud synchronization support
 */
export function getLiveDishes(): Dish[] {
  return DISHES;
}

export function getLiveVenues(): Record<string, Venue> {
  return VENUES;
}

// Re-export liveDataService instance for universal import compatibility
export { liveDataService } from './supabase';
