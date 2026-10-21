import { createClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://djieoowubsoeigcxmkwk.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqaWVvb3d1YnNvZWlnY3hta3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMDMwMTcsImV4cCI6MjEwNzY3OTAxN30.X1e7KFjdv57ttFcgdRzZIR16eBVOUgacMJJPo9ODilI';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-url')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ==============================================================================
// 1. SUPABASE AUTHENTICATION HELPERS
// ==============================================================================

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0],
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithMagicLink(email: string) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithPhoneOtp(phoneNumber: string) {
  if (!supabase) throw new Error('Supabase client not initialized');
  let formatted = phoneNumber.trim().replace(/[\s-]/g, '');
  if (!formatted.startsWith('+')) {
    // Default to India (+91)
    formatted = '+91' + formatted.replace(/^0+/, '');
  }
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: formatted,
  });
  if (error) throw error;
  return data;
}

export async function verifyPhoneOtp(phoneNumber: string, token: string) {
  if (!supabase) throw new Error('Supabase client not initialized');
  let formatted = phoneNumber.trim().replace(/[\s-]/g, '');
  if (!formatted.startsWith('+')) {
    formatted = '+91' + formatted.replace(/^0+/, '');
  }
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formatted,
    token: token.trim(),
    type: 'sms',
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ==============================================================================
// 2. CHECK-INS CLOUD SYNC HELPERS (palate_checkins table)
// ==============================================================================

export interface CloudCheckin {
  id: string;
  dish_id: string;
  dish_name: string;
  venue_name: string;
  reaction: 'GOD_TIER' | 'SKIP';
  note?: string | null;
  user_name?: string | null;
  user_avatar?: string | null;
  created_at: string;
  has_receipt?: boolean;
}

export async function fetchCloudCheckins(limit = 20): Promise<CloudCheckin[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('palate_checkins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Could not fetch cloud check-ins, falling back to local:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching check-ins:', err);
    return [];
  }
}

export async function insertCloudCheckin(checkin: {
  dish_id: string;
  dish_name: string;
  venue_name: string;
  reaction: 'GOD_TIER' | 'SKIP';
  note?: string;
  user_name?: string;
  user_avatar?: string;
}): Promise<CloudCheckin | null> {
  const newId = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record: CloudCheckin = {
    id: newId,
    dish_id: checkin.dish_id,
    dish_name: checkin.dish_name,
    venue_name: checkin.venue_name,
    reaction: checkin.reaction,
    note: checkin.note || null,
    user_name: checkin.user_name || 'Anonymous Foodie',
    user_avatar: checkin.user_avatar || null,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('palate_checkins')
        .insert([record])
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn('Failed to insert check-in to Supabase, continuing locally:', e);
    }
  }

  return record;
}

// Real-time listener for check-ins
export function subscribeToCloudCheckins(onNewCheckin: (checkin: CloudCheckin) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('palate_checkins_realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'palate_checkins' },
      (payload) => {
        if (payload.new) {
          onNewCheckin(payload.new as CloudCheckin);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ==============================================================================
// 3. RECEIPT UPLOAD & VERIFICATION HELPERS
// ==============================================================================

export interface ReceiptRecord {
  id: string;
  userId?: string;
  venueName: string;
  billAmountInr: number;
  photoUrl: string;
  verified: boolean;
  dishName?: string;
  createdAt: string;
}

export async function uploadReceiptPhoto(file: File): Promise<string> {
  const fileName = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${file.name.split('.').pop() || 'jpg'}`;

  if (supabase) {
    try {
      // Try uploading to Supabase Storage 'palate-receipts' bucket
      const { data, error } = await supabase.storage
        .from('palate-receipts')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('palate-receipts')
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch {
      // fallback to FileReader data-URL
    }
  }

  // Fallback: Convert file to Base64 data-URL so it works seamlessly offline/without bucket
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
