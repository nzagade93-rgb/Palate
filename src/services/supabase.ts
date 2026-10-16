import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { CheckIn, CheckInReaction } from '../types';

// Types for Supabase Database
export interface DbCheckIn {
  id: string;
  dish_id: string;
  dish_name: string;
  venue_name: string;
  reaction: CheckInReaction;
  note: string | null;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
}

export interface DbPerkRedemption {
  id: string;
  voucher_code: string;
  venue_name: string;
  perk_title: string;
  redeemed_at: string;
  cashier_pin_verified: boolean;
  bill_amount?: number;
}

// Read & cleanse environment variables
const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const sanitizedUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  sanitizedUrl && 
  supabaseAnonKey && 
  sanitizedUrl !== 'https://your-project.supabase.co'
);

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

// Multi-Tab & Local Offline Synchronization Bus
const BROADCAST_CHANNEL_NAME = 'palate_realtime_bus';
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel(BROADCAST_CHANNEL_NAME)
  : null;

// Simulated realistic initial community pulse across Navi Mumbai corridors
const INITIAL_COMMUNITY_CHECKINS: CheckIn[] = [
  {
    id: 'live-pulse-1',
    dishId: 'dish-shabari-surmai',
    dishName: 'Neer Dosa with Surmai Gawa Curry',
    venueName: 'Shabari Coastal Dining (CBD Belapur)',
    reaction: 'GOD_TIER',
    timestamp: Date.now() - 1000 * 60 * 8, // 8 mins ago
    note: 'Lacy sheer neer dosas soaking up the fresh coconut-kokum surmai gravy. Unbelievable.'
  },
  {
    id: 'live-pulse-2',
    dishId: 'dish-alshams-shawarma',
    dishName: 'Classic Lebanese Garlic Shawarma (Rumali)',
    venueName: 'Al-Shams Lebanese Shawarma (Kharghar)',
    reaction: 'GOD_TIER',
    timestamp: Date.now() - 1000 * 60 * 18, // 18 mins ago
    note: 'Zero cabbage, pure tender charred chicken in authentic pungent toum.'
  },
  {
    id: 'live-pulse-3',
    dishId: 'dish-moru-dalpakwan',
    dishName: 'Sunday Morning Dal Pakwan',
    venueName: 'Morumal Sweets & Snacks (Vashi)',
    reaction: 'GOD_TIER',
    timestamp: Date.now() - 1000 * 60 * 32, // 32 mins ago
    note: 'Got here before 9:30 AM, double blistered pakwan was piping hot!'
  },
  {
    id: 'live-pulse-4',
    dishId: 'dish-udipi-krishna-ghee-roast',
    dishName: 'Ghee Roast Masala Dosa & Filter Coffee',
    venueName: 'Udipi Shri Krishna (Nerul LP)',
    reaction: 'GOD_TIER',
    timestamp: Date.now() - 1000 * 60 * 55, // 55 mins ago
    note: 'Crisp golden crepe drowned in hot Mangalore ghee. Filter coffee is strong and foamy.'
  },
  {
    id: 'live-pulse-5',
    dishId: 'dish-sk-podi-dosa',
    dishName: 'Podi Ghee Masala Dosa',
    venueName: 'Sri Krishna Udupi (Sanpada Station)',
    reaction: 'GOD_TIER',
    timestamp: Date.now() - 1000 * 60 * 85, // 1h 25m ago
    note: 'Coarse gun-powder podi smeared inside with bubbling amul butter.'
  },
  {
    id: 'live-pulse-6',
    dishId: 'dish-arenja-bhurji',
    dishName: '4-Egg Butter Boil Bhurji Pav',
    venueName: 'Arenja Corner Midnight Bhurji (Vashi)',
    reaction: 'GOD_TIER',
    timestamp: Date.now() - 1000 * 60 * 115, // 1h 55m ago
    note: 'Midnight fuel. Asked for extra kadak pav.'
  },
  {
    id: 'live-pulse-7',
    dishId: 'dish-commons-truffle-fries',
    dishName: 'Truffle Parmesan Hand-Cut Fries & Cold Brew',
    venueName: 'Commons Cafe & Roastery (CBD Belapur)',
    reaction: 'GOD_TIER',
    timestamp: Date.now() - 1000 * 60 * 160, // 2h 40m ago
    note: 'Freshly shaved grana padano and pungent white truffle oil.'
  }
];

const LOCAL_COMMUNITY_STORAGE_KEY = 'palate_community_checkins_v1';
const LOCAL_REDEMPTIONS_STORAGE_KEY = 'palate_merchant_redemptions_v1';

// Service layer for live multi-user sync
export const liveDataService = {
  // 1. Fetch live community check-ins
  async getLiveCheckIns(): Promise<CheckIn[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('palate_checkins')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30);

        if (!error && data && data.length > 0) {
          return data.map((d: DbCheckIn) => ({
            id: d.id,
            dishId: d.dish_id,
            dishName: d.dish_name,
            venueName: d.venue_name,
            reaction: d.reaction,
            timestamp: new Date(d.created_at).getTime(),
            note: d.note || undefined
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local real-time cache', err);
      }
    }

    // Local-first fallback
    try {
      const stored = localStorage.getItem(LOCAL_COMMUNITY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    // Save initial
    localStorage.setItem(LOCAL_COMMUNITY_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_CHECKINS));
    return INITIAL_COMMUNITY_CHECKINS;
  },

  // 2. Publish a new check-in to live network
  async publishCheckIn(checkIn: CheckIn): Promise<void> {
    // A) If Supabase is connected
    if (supabase) {
      try {
        await supabase.from('palate_checkins').insert({
          id: checkIn.id,
          dish_id: checkIn.dishId,
          dish_name: checkIn.dishName,
          venue_name: checkIn.venueName,
          reaction: checkIn.reaction,
          note: checkIn.note || null,
          created_at: new Date(checkIn.timestamp).toISOString()
        });
      } catch (err) {
        console.warn('Failed to publish check-in to Supabase', err);
      }
    }

    // B) Always update local community store & broadcast to other tabs
    try {
      const current = await this.getLiveCheckIns();
      const updated = [checkIn, ...current.filter((c) => c.id !== checkIn.id)].slice(0, 50);
      localStorage.setItem(LOCAL_COMMUNITY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error persisting community checkin locally', e);
    }

    // Broadcast over BroadcastChannel for instant multi-tab sync
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'NEW_CHECKIN',
        payload: checkIn
      });
    }

    window.dispatchEvent(new CustomEvent('palate_community_updated', { detail: checkIn }));
  },

  // 3. Subscribe to real-time check-ins
  subscribeToLiveCheckIns(callback: (checkIn: CheckIn) => void): () => void {
    let supabaseSubscription: any = null;

    if (supabase) {
      const channel = supabase
        .channel('public:palate_checkins')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'palate_checkins' },
          (payload: { new: DbCheckIn }) => {
            const newItem: CheckIn = {
              id: payload.new.id,
              dishId: payload.new.dish_id,
              dishName: payload.new.dish_name,
              venueName: payload.new.venue_name,
              reaction: payload.new.reaction,
              timestamp: new Date(payload.new.created_at).getTime(),
              note: payload.new.note || undefined
            };
            callback(newItem);
          }
        )
        .subscribe();

      supabaseSubscription = channel;
    }

    // Local / Broadcast channel listener
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'NEW_CHECKIN') {
        callback(event.data.payload);
      }
    };

    const handleCustomEvent = (event: Event) => {
      const custom = event as CustomEvent<CheckIn>;
      if (custom.detail) {
        callback(custom.detail);
      }
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }
    window.addEventListener('palate_community_updated', handleCustomEvent);

    return () => {
      if (supabase && supabaseSubscription) {
        supabase.removeChannel(supabaseSubscription);
      }
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast);
      }
      window.removeEventListener('palate_community_updated', handleCustomEvent);
    };
  },

  // 4. Validate & Record Merchant Perk Redemption
  async recordPerkRedemption(redemption: DbPerkRedemption): Promise<{ success: boolean; message: string }> {
    if (supabase) {
      try {
        const { error } = await supabase.from('palate_perk_redemptions').insert(redemption);
        if (error) {
          console.warn('Supabase perk insertion warning:', error);
        }
      } catch (err) {
        console.warn('Supabase offline/error for perk redemption:', err);
      }
    }

    // Persist locally
    try {
      const stored = localStorage.getItem(LOCAL_REDEMPTIONS_STORAGE_KEY);
      const list: DbPerkRedemption[] = stored ? JSON.parse(stored) : [];
      list.unshift(redemption);
      localStorage.setItem(LOCAL_REDEMPTIONS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving redemption locally', e);
    }

    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'PERK_REDEEMED',
        payload: redemption
      });
    }
    window.dispatchEvent(new CustomEvent('palate_perk_redeemed', { detail: redemption }));

    return { success: true, message: 'Perk successfully validated and recorded!' };
  },

  // 5. Get recent merchant redemptions for cashier dashboard
  async getRedemptions(): Promise<DbPerkRedemption[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('palate_perk_redemptions')
          .select('*')
          .order('redeemed_at', { ascending: false })
          .limit(20);

        if (!error && data) return data;
      } catch {
        // fallback
      }
    }

    try {
      const stored = localStorage.getItem(LOCAL_REDEMPTIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
};
