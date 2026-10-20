// ==============================================================================
// PALATE: Core Types & Interfaces
// Brand Palette: Yellow (#FFD11A), Blue (#2748FF), Pink (#FF5C9A),
// Mint (#00B26B), Paper (#F6EFE2), Concrete (#DDD4C2), Tar (#121212)
// ==============================================================================

export type NaviMumbaiNode =
  | 'All'
  | 'Vashi'
  | 'Nerul'
  | 'Belapur'
  | 'Kharghar'
  | 'Seawoods'
  | 'Sanpada';

export type BattleType = 'dish' | 'restaurant' | 'debate';
export type BattleStatus = 'live' | 'ending_soon' | 'completed';

export interface Contestant {
  id: string;
  name: string;
  restaurantName?: string;
  neighborhood: string;
  imageUrl: string;
  signatureDish?: string;
  votes: number;
  percentage: number;
  isWinner?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  neighborhood: string;
  imageUrl: string;
  createdAt?: string;
  signatureDish?: string;
}

export interface Battle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  dishName: string;
  battleType: BattleType;
  category: string;
  city: string;
  neighborhood: string;
  status: BattleStatus;
  endsAt: string;
  createdAt: string;

  // Contestant A (Team Blue - #2748FF)
  contestantA: Contestant;
  restaurantAId?: string;
  restaurantA?: any;

  // Contestant B (Team Pink - #FF5C9A)
  contestantB: Contestant;
  restaurantBId?: string;
  restaurantB?: any;

  totalVotes: number;
  votesA: number;
  votesB: number;
  percentA: number;
  percentB: number;

  isActive: boolean;
  userVotedChoice?: string | null;

  // Challenge the Winner Lineage
  previousBattleId?: string;
  winnerContestantId?: string | null;
  challengeCount?: number;
  description?: string;
  isTrending?: boolean;
  isEndingSoon?: boolean;
}

export interface BattleChallenge {
  id: string;
  previousBattleId: string;
  previousBattleTitle: string;
  winnerContestantName: string;
  challengerName: string;
  challengerRestaurant: string;
  neighborhood: string;
  dishCategory: string;
  reason: string;
  submitterFingerprint: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  upvotes: number;
}

export interface UserProfile {
  id?: string;
  fingerprint: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  dishesTriedCount: number;
  battlesVotedCount: number;
  battlesCreatedCount: number;
  neighborhoodsExploredCount: number;
  badges: Badge[];
  favoriteCategories: string[];
  levelTitle: string;
  levelNumber: number;
  levelProgress: number;
  updatedAt?: string;
}

export interface FoodPassport extends UserProfile {
  votedBattleIds?: string[];
  restaurantsDiscoveredCount: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  current: number;
  target: number;
}

export interface HiddenGem {
  id: string;
  submitterFingerprint: string;
  restaurantName: string;
  neighborhood: string;
  dishRecommendation: string;
  secretTip?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  upvotes?: number;
}

export interface VoteResponse {
  success: boolean;
  message?: string;
  battle?: Battle;
  passport?: FoodPassport;
  alreadyVoted?: boolean;
  isPopularityNotice?: string;
}

export type AnalyticsEventName =
  | 'battle_viewed'
  | 'contestant_selected'
  | 'vote_submitted'
  | 'battle_shared'
  | 'share_link_opened'
  | 'challenge_started'
  | 'battle_created'
  | 'user_registered';

export interface AnalyticsEvent {
  event: AnalyticsEventName;
  properties: Record<string, any>;
  timestamp: string;
  fingerprint?: string;
}
