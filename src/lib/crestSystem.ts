'use client';

// ==============================================================================
// PALATE: Crest Points & Perks System (Gamification Engine)
// Diners earn Crest Points through active community contributions:
// - Voting in battles & challenges
// - Checking in with verified meal receipts
// - Upvoting & commenting on dishes
// - Submitting hidden gem suggestions
//
// Crest Points unlock real diner perks:
// 1. Bill discount vouchers (15% Off)
// 2. Free menu items / signature sides
// 3. VIP table reservations at crowded eateries
// 4. Navi Mumbai Food Critic Crest & Tasting Panel membership
// ==============================================================================

export interface CrestPerk {
  id: string;
  title: string;
  tagline: string;
  cost: number; // in Crest Points
  category: 'discount' | 'free_item' | 'table_reservation' | 'critic_status';
  categoryLabel: string;
  badgeColor: string;
  description: string;
  applicableNodes: string[];
  terms: string;
}

export interface RedeemedPerk {
  id: string;
  perkId: string;
  title: string;
  couponCode: string;
  redeemedAt: string;
  expiresAt: string;
  status: 'active' | 'used';
  cost: number;
}

export interface CrestActivityItem {
  id: string;
  action: string;
  points: number;
  timestamp: string;
}

export const CREST_EARNING_RULES = [
  { action: 'Vote in Food Battle or Challenge', points: 10, icon: '⚔️', desc: 'Cast your vote in any live community rivalry' },
  { action: 'Check-in with Verified Receipt', points: 50, icon: '🧾', desc: 'Upload proof of dining with masked billing details' },
  { action: 'Quick Node Check-in', points: 20, icon: '📍', desc: 'Log a dish you ate without receipt' },
  { action: 'Community Upvote on Ranked Dish', points: 5, icon: '👍', desc: 'Upvote a dish in search or leaderboard' },
  { action: 'Submit Hidden Gem Suggestion', points: 15, icon: '💡', desc: 'Nominate an under-the-radar stall' },
  { action: 'Challenge a Reigning Champion', points: 30, icon: '🏆', desc: 'Nominate a challenger against a battle winner' },
];

export const AVAILABLE_CREST_PERKS: CrestPerk[] = [
  {
    id: 'perk_bill_discount',
    title: '15% Off Total Bill Voucher',
    tagline: 'Save up to ₹75 on your order',
    cost: 100,
    category: 'discount',
    categoryLabel: 'DINING DISCOUNT',
    badgeColor: 'bg-[#2748FF]',
    description: 'Instant discount voucher valid at any verified partner restaurant across Navi Mumbai (Bhagwati, Gupta Snacks, Sainath, etc.).',
    applicableNodes: ['Vashi', 'Nerul', 'Belapur', 'Kharghar', 'Seawoods', 'Sanpada'],
    terms: 'Valid on min. order of ₹250. Present voucher code to counter staff before bill generation.',
  },
  {
    id: 'perk_free_menu_item',
    title: 'Free Signature Menu Item',
    tagline: 'Extra Pav, Special Chaas or Gulab Jamun',
    cost: 250,
    category: 'free_item',
    categoryLabel: 'FREE FOOD PERK',
    badgeColor: 'bg-[#00B26B]',
    description: 'Complimentary signature companion dish with your main order (e.g. Free Extra Butter Pav pair at Pav Bhaji stalls, Sweet Kutchi Chaas, or Gulab Jamun).',
    applicableNodes: ['Vashi', 'Nerul', 'Belapur'],
    terms: 'Valid with any main dish order at participating consensus champion eateries.',
  },
  {
    id: 'perk_vip_reservation',
    title: 'VIP Priority Table Reservation',
    tagline: 'Skip the weekend waiting queue',
    cost: 500,
    category: 'table_reservation',
    categoryLabel: 'VIP RESERVATION',
    badgeColor: 'bg-[#FF5C9A]',
    description: 'Guaranteed priority seating during peak weekend rush hours at legendary crowded spots (Bhagat Tarachand, Shabari, Mahesh Lunch Home).',
    applicableNodes: ['Vashi', 'Belapur', 'Nerul'],
    terms: 'Requires 2-hour advance booking notice via Palate concierge. Priority table held for 15 minutes.',
  },
  {
    id: 'perk_critic_crest',
    title: 'Navi Mumbai Critic Crest & Tasting Panel',
    tagline: 'Official Gold Food Critic Status',
    cost: 1000,
    category: 'critic_status',
    categoryLabel: 'ELITE STATUS',
    badgeColor: 'bg-[#FFD11A]',
    description: 'Permanent Gold Food Critic Crest on your profile + personal invitations to private restaurant menu previews and community battle jury panels.',
    applicableNodes: ['All Navi Mumbai Nodes'],
    terms: 'Permanent title on your Food Passport. Access to private tasting events and seasonal battle jury rounds.',
  },
];

const STORAGE_KEY_BALANCE = 'palate_crest_balance';
const STORAGE_KEY_REDEEMED = 'palate_crest_redeemed';
const STORAGE_KEY_HISTORY = 'palate_crest_history';

// Initial starter balance for engaging new users
const DEFAULT_INITIAL_BALANCE = 75;

export function getCrestBalance(): number {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_BALANCE;
  const stored = localStorage.getItem(STORAGE_KEY_BALANCE);
  if (stored !== null) {
    const val = parseInt(stored, 10);
    return isNaN(val) ? DEFAULT_INITIAL_BALANCE : val;
  }
  localStorage.setItem(STORAGE_KEY_BALANCE, DEFAULT_INITIAL_BALANCE.toString());
  return DEFAULT_INITIAL_BALANCE;
}

export function getRedeemedPerks(): RedeemedPerk[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY_REDEEMED);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getCrestActivityLog(): CrestActivityItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
  if (!stored) {
    return [
      {
        id: 'init_welcome',
        action: 'Welcome to Palate Foodie Community',
        points: DEFAULT_INITIAL_BALANCE,
        timestamp: 'Welcome Bonus',
      },
    ];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addCrestPoints(
  amount: number,
  actionLabel: string
): { newBalance: number; activityItem: CrestActivityItem } {
  const current = getCrestBalance();
  const newBalance = current + amount;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_BALANCE, newBalance.toString());

    const history = getCrestActivityLog();
    const item: CrestActivityItem = {
      id: 'act_' + Date.now(),
      action: actionLabel,
      points: amount,
      timestamp: 'Just now',
    };
    const updatedHistory = [item, ...history.slice(0, 19)];
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));

    // Dispatch global event for responsive UI updates
    window.dispatchEvent(
      new CustomEvent('palate_crest_updated', {
        detail: { balance: newBalance, added: amount, action: actionLabel },
      })
    );
    return { newBalance, activityItem: item };
  }
  return {
    newBalance,
    activityItem: {
      id: 'act_' + Date.now(),
      action: actionLabel,
      points: amount,
      timestamp: 'Just now',
    },
  };
}

export function redeemPerk(perkId: string): { success: boolean; error?: string; perk?: RedeemedPerk } {
  const current = getCrestBalance();
  const perkDef = AVAILABLE_CREST_PERKS.find((p) => p.id === perkId);

  if (!perkDef) {
    return { success: false, error: 'Perk not found' };
  }

  if (current < perkDef.cost) {
    return {
      success: false,
      error: `Insufficient Crest Points. You need ${perkDef.cost - current} more CP.`,
    };
  }

  const newBalance = current - perkDef.cost;
  const couponCode = `PLT-${perkDef.category.slice(0, 3).toUpperCase()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const redeemed: RedeemedPerk = {
    id: 'rdm_' + Date.now(),
    perkId: perkDef.id,
    title: perkDef.title,
    couponCode,
    redeemedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    expiresAt: new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: 'active',
    cost: perkDef.cost,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_BALANCE, newBalance.toString());
    const existing = getRedeemedPerks();
    localStorage.setItem(STORAGE_KEY_REDEEMED, JSON.stringify([redeemed, ...existing]));

    const history = getCrestActivityLog();
    const item: CrestActivityItem = {
      id: 'act_' + Date.now(),
      action: `Redeemed: ${perkDef.title}`,
      points: -perkDef.cost,
      timestamp: 'Just now',
    };
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([item, ...history.slice(0, 19)]));

    window.dispatchEvent(
      new CustomEvent('palate_crest_updated', {
        detail: { balance: newBalance, deducted: perkDef.cost, action: `Redeemed ${perkDef.title}` },
      })
    );
  }

  return { success: true, perk: redeemed };
}
