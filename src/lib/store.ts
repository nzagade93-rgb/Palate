// ==============================================================================
// PALATE: Battles, Challenges, Leaderboard & Social Growth Store
// Brand Palette: Yellow (#FFD11A), Blue (#2748FF), Pink (#FF5C9A),
// Mint (#00B26B), Paper (#F6EFE2), Tar (#121212)
// ==============================================================================

import {
  Battle,
  Contestant,
  BattleChallenge,
  FoodPassport,
  UserProfile,
  HiddenGem,
  VoteResponse,
  Badge,
  AnalyticsEvent,
  AnalyticsEventName
} from './types';
import { supabase, isSupabaseConfigured } from './supabase';

// ------------------------------------------------------------------------------
// NAVI MUMBAI SEED DATA
// ------------------------------------------------------------------------------

export const SEED_BATTLES: Battle[] = [
  {
    id: 'battle_vada_pav_01',
    slug: 'vashi-vs-nerul-best-vada-pav',
    title: 'Vashi vs Nerul: The Street Vada Pav War',
    subtitle: 'Crispy golden batter, garlicky red dry thecha & pillowy pav',
    dishName: 'Crispy Butter Vada Pav with Lasun Chutney',
    battleType: 'dish',
    category: 'Street Food',
    city: 'Navi Mumbai',
    neighborhood: 'Vashi',
    status: 'live',
    endsAt: '2026-10-27T18:00:00Z',
    createdAt: '2026-10-18T10:00:00Z',
    description: 'Two legendary Navi Mumbai vendors battle for the crown of the city’s crunchiest and most fiery vada pav. Community votes only; no paid ads.',
    isTrending: true,
    isEndingSoon: false,
    votesA: 1842,
    votesB: 1530,
    totalVotes: 3372,
    percentA: 54.6,
    percentB: 45.4,
    isActive: true,
    challengeCount: 4,
    contestantA: {
      id: 'cont_vashi_vadapav',
      name: 'Sector 17 Famous Corner Vada Pav',
      restaurantName: 'Famous Vashi Tapri',
      neighborhood: 'Sector 17, Vashi',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Double-Fried Spiced Batata Vada with Fried Chilies',
      votes: 1842,
      percentage: 54.6
    },
    contestantB: {
      id: 'cont_nerul_vadapav',
      name: 'Nerul Station East Crunchy Vada Pav',
      restaurantName: 'Shivaji Chowk Stall',
      neighborhood: 'Sector 19A, Nerul',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Smoky Garlic Thecha Vada Pav with Hot Kadhi',
      votes: 1530,
      percentage: 45.4
    }
  },
  {
    id: 'battle_dal_khichdi_02',
    slug: 'the-legendary-dal-khichdi-clash',
    title: 'The Legendary Comfort Dal Khichdi Clash',
    subtitle: 'Pure desi ghee tadka, roasted cumin & comforting rice bowls',
    dishName: 'Tadka Dal Khichdi with Pure Ghee',
    battleType: 'restaurant',
    category: 'Comfort Food',
    city: 'Navi Mumbai',
    neighborhood: 'Vashi',
    status: 'live',
    endsAt: '2026-10-26T20:00:00Z',
    createdAt: '2026-10-18T10:00:00Z',
    description: 'A heavyweight culinary derby in Sector 17 Vashi. Shabari takes on Bhagat Tarachand for the comfort throne.',
    isTrending: true,
    isEndingSoon: false,
    votesA: 1421,
    votesB: 984,
    totalVotes: 2405,
    percentA: 59.1,
    percentB: 40.9,
    isActive: true,
    challengeCount: 2,
    contestantA: {
      id: 'res_shabari',
      name: 'Shabari',
      restaurantName: 'Shabari Fine Dine',
      neighborhood: 'Sector 17, Vashi',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Tadka Dal Khichdi with Pure Ghee',
      votes: 1421,
      percentage: 59.1
    },
    contestantB: {
      id: 'res_bhagat',
      name: 'Bhagat Tarachand',
      restaurantName: 'Bhagat Tarachand Vashi',
      neighborhood: 'Sector 17, Vashi',
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Papad Churi & Kutchi Moong Dal Tadka',
      votes: 984,
      percentage: 40.9
    }
  },
  {
    id: 'battle_seafood_03',
    slug: 'navi-mumbai-coastal-seafood-throne',
    title: 'Navi Mumbai Coastal Seafood Throne',
    subtitle: 'Fresh catch from the Arabian sea tossed in coastal spices',
    dishName: 'Butter Garlic Crab & Surmai Tawa Fry',
    battleType: 'restaurant',
    category: 'Seafood',
    city: 'Navi Mumbai',
    neighborhood: 'Belapur',
    status: 'live',
    endsAt: '2026-10-24T18:00:00Z',
    createdAt: '2026-10-18T10:00:00Z',
    description: 'Vashi iconic coastal joint vs Belapur harbour titan. Who plates the finest seafood in Navi Mumbai?',
    isTrending: false,
    isEndingSoon: true,
    votesA: 1856,
    votesB: 1521,
    totalVotes: 3377,
    percentA: 55.0,
    percentB: 45.0,
    isActive: true,
    challengeCount: 5,
    contestantA: {
      id: 'res_navratna',
      name: 'Navratna Veg & Seafood',
      restaurantName: 'Navratna',
      neighborhood: 'Sector 17, Vashi',
      imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Crispy Surmai Rava Fry & Prawn Curry',
      votes: 1856,
      percentage: 55.0
    },
    contestantB: {
      id: 'res_mahesh',
      name: 'Mahesh Lunch Home',
      restaurantName: 'Mahesh Lunch Home',
      neighborhood: 'CBD Belapur',
      imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Butter Garlic Mud Crab & Neer Dosa',
      votes: 1521,
      percentage: 45.0
    }
  },
  {
    id: 'battle_misal_04',
    slug: 'the-fiery-puneri-misal-war',
    title: 'The Fiery Puneri vs Kolhapuri Misal War',
    subtitle: 'Red-hot kat/tarri, crispy farsan, sprouted moth beans & warm pav',
    dishName: 'Kolhapuri Spicy Tarri Misal Pav',
    battleType: 'dish',
    category: 'Street Food',
    city: 'Navi Mumbai',
    neighborhood: 'Nerul',
    status: 'live',
    endsAt: '2026-10-24T12:00:00Z',
    createdAt: '2026-10-18T10:00:00Z',
    description: 'Nerul spicy powerhouse Guru Kripa locks horns with Vashi legendary Sainath Misal. Tears of spice guaranteed.',
    isTrending: false,
    isEndingSoon: true,
    votesA: 1105,
    votesB: 1340,
    totalVotes: 2445,
    percentA: 45.2,
    percentB: 54.8,
    isActive: true,
    challengeCount: 3,
    contestantA: {
      id: 'res_guru_kripa',
      name: 'Guru Kripa',
      restaurantName: 'Guru Kripa Snacks',
      neighborhood: 'Sector 19A, Nerul',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Kolhapuri Kat/Tarri Misal Pav with Dahi',
      votes: 1105,
      percentage: 45.2
    },
    contestantB: {
      id: 'res_sainath',
      name: 'Sainath Misal',
      restaurantName: 'Sainath Snacks',
      neighborhood: 'Sector 15, Vashi',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Zanzanit Farsan Misal with Extra Kat Bowl',
      votes: 1340,
      percentage: 54.8
    }
  },
  {
    id: 'battle_food_debate_05',
    slug: 'vada-pav-vs-pav-bhaji-mumbai-heartbeat',
    title: 'The Eternal Debate: Vada Pav vs Pav Bhaji',
    subtitle: 'Which iconic Mumbai street dish reigns supreme in Navi Mumbai?',
    dishName: 'Street Staple Debate',
    battleType: 'debate',
    category: 'Food Debate',
    city: 'Navi Mumbai',
    neighborhood: 'All',
    status: 'live',
    endsAt: '2026-10-28T22:00:00Z',
    createdAt: '2026-10-18T10:00:00Z',
    description: 'Not a restaurant battle—a fundamental debate on Mumbai food identity. Are you Team Vada Pav or Team Pav Bhaji?',
    isTrending: true,
    isEndingSoon: false,
    votesA: 2650,
    votesB: 2310,
    totalVotes: 4960,
    percentA: 53.4,
    percentB: 46.6,
    isActive: true,
    challengeCount: 1,
    contestantA: {
      id: 'debate_vada_pav',
      name: 'Team Vada Pav',
      restaurantName: 'Street Food Religion',
      neighborhood: 'Navi Mumbai All Nodes',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'The Grab-and-Go King with Fried Green Chili',
      votes: 2650,
      percentage: 53.4
    },
    contestantB: {
      id: 'debate_pav_bhaji',
      name: 'Team Pav Bhaji',
      restaurantName: 'Late Night Butter Indulgence',
      neighborhood: 'Navi Mumbai All Nodes',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Amul-Soaked Red Bhaji with Buttered Toast Pav',
      votes: 2310,
      percentage: 46.6
    }
  },
  // RECENT COMPLETED WINNER (Ready for "Challenge the Winner" loop!)
  {
    id: 'battle_completed_winner_06',
    slug: 'seawoods-grand-central-biryani-derby',
    title: 'Seawoods Grand Central Biryani Derby',
    subtitle: 'Mutton Dum vs Chicken Dum showdown',
    dishName: 'Slow-Cooked Dum Biryani',
    battleType: 'restaurant',
    category: 'Biryani & Kebabs',
    city: 'Navi Mumbai',
    neighborhood: 'Seawoods',
    status: 'completed',
    endsAt: '2026-10-17T20:00:00Z',
    createdAt: '2026-10-10T10:00:00Z',
    description: 'This battle has completed! Yasin’s Food Inn defeated Persian Darbar 54% to 46%. Propose a new contender to challenge the winner!',
    isTrending: false,
    isEndingSoon: false,
    votesA: 2840,
    votesB: 2410,
    totalVotes: 5250,
    percentA: 54.1,
    percentB: 45.9,
    isActive: false,
    winnerContestantId: 'res_yasins',
    challengeCount: 6,
    contestantA: {
      id: 'res_yasins',
      name: "Yasin's Food Inn",
      restaurantName: "Yasin's Food Inn",
      neighborhood: 'Sector 12, Kharghar',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Slow Dum Mutton Biryani',
      votes: 2840,
      percentage: 54.1,
      isWinner: true
    },
    contestantB: {
      id: 'res_persian',
      name: 'Persian Darbar',
      restaurantName: 'Persian Darbar Vashi',
      neighborhood: 'Sector 19, Vashi',
      imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
      signatureDish: 'Raan Dum Biryani & Chicken Seekh',
      votes: 2410,
      percentage: 45.9,
      isWinner: false
    }
  }
];

export const INITIAL_CHALLENGES: BattleChallenge[] = [
  {
    id: 'chal_01',
    previousBattleId: 'battle_completed_winner_06',
    previousBattleTitle: 'Seawoods Grand Central Biryani Derby',
    winnerContestantName: "Yasin's Food Inn (Winner)",
    challengerName: 'Noor Mohammadi Sanpada',
    challengerRestaurant: 'Noor Mohammadi Sanpada',
    neighborhood: 'Sanpada',
    dishCategory: 'Biryani',
    reason: 'Their White Mutton Biryani has way more aromatic saffron and caramelized onions than Yasin’s.',
    submitterFingerprint: 'seed_chal_01',
    status: 'approved',
    createdAt: '2026-10-18T16:00:00Z',
    upvotes: 34
  },
  {
    id: 'chal_02',
    previousBattleId: 'battle_completed_winner_06',
    previousBattleTitle: 'Seawoods Grand Central Biryani Derby',
    winnerContestantName: "Yasin's Food Inn (Winner)",
    challengerName: 'Lucky Biryani Belapur',
    challengerRestaurant: 'Lucky Restaurant Belapur',
    neighborhood: 'CBD Belapur',
    dishCategory: 'Biryani',
    reason: 'Classic Mumbai Bohri-style biryani with tender potatoes. They can definitely take down Yasin’s.',
    submitterFingerprint: 'seed_chal_02',
    status: 'approved',
    createdAt: '2026-10-19T11:00:00Z',
    upvotes: 27
  }
];

export const INITIAL_GEMS: HiddenGem[] = [
  {
    id: 'gem_01',
    submitterFingerprint: 'seed_fp_01',
    restaurantName: 'Darjeeling Momos Corner',
    neighborhood: 'Sector 19A, Nerul East',
    dishRecommendation: 'Steamed Chicken Kothey Momos with Fire-Roasted Red Sesame Chutney',
    secretTip: 'Ask for the smoky roasted chili oil poured on top after 6:30 PM.',
    status: 'approved',
    createdAt: '2026-10-18T14:30:00Z',
    upvotes: 42
  },
  {
    id: 'gem_02',
    submitterFingerprint: 'seed_fp_02',
    restaurantName: 'Jai Bhavani Koliwada',
    neighborhood: 'CBD Belapur Artist Village',
    dishRecommendation: 'Crispy Bombil Fry with Garlic Green Thecha',
    secretTip: 'Arrive right when the fresh evening catch hits the hot oil at 7:00 PM.',
    status: 'approved',
    createdAt: '2026-10-18T16:15:00Z',
    upvotes: 38
  },
  {
    id: 'gem_03',
    submitterFingerprint: 'seed_fp_03',
    restaurantName: "Raju's Secret Frankie Counter",
    neighborhood: 'Utsav Chowk, Kharghar',
    dishRecommendation: 'Double Egg Mutton Cheesy Frankie',
    secretTip: 'Request them to toast both sides with amul butter and sprinkle extra chaat masala.',
    status: 'approved',
    createdAt: '2026-10-18T18:00:00Z',
    upvotes: 56
  }
];

// Global Memory Data Store
class PalateMemoryStore {
  battles: Map<string, Battle> = new Map();
  voteLogs: Map<string, string> = new Map(); // key: `${battleId}#${voterFingerprint}` -> chosenContestantId
  passports: Map<string, FoodPassport> = new Map();
  challenges: BattleChallenge[] = [...INITIAL_CHALLENGES];
  hiddenGems: HiddenGem[] = [...INITIAL_GEMS];
  analyticsEvents: AnalyticsEvent[] = [];

  constructor() {
    SEED_BATTLES.forEach((b) => this.battles.set(b.id, { ...b }));
  }

  calculatePercentages(b: Battle) {
    const total = b.votesA + b.votesB;
    b.totalVotes = total;
    if (total > 0) {
      b.percentA = Math.round((b.votesA / total) * 1000) / 10;
      b.percentB = Math.round((b.votesB / total) * 1000) / 10;
      b.contestantA.percentage = b.percentA;
      b.contestantB.percentage = b.percentB;
      b.contestantA.votes = b.votesA;
      b.contestantB.votes = b.votesB;
    } else {
      b.percentA = 50;
      b.percentB = 50;
      b.contestantA.percentage = 50;
      b.contestantB.percentage = 50;
    }

    if (!b.isActive && !b.winnerContestantId) {
      b.winnerContestantId = b.votesA >= b.votesB ? b.contestantA.id : b.contestantB.id;
      b.contestantA.isWinner = b.winnerContestantId === b.contestantA.id;
      b.contestantB.isWinner = b.winnerContestantId === b.contestantB.id;
    }
  }

  getBadgesForPassport(dishesCount: number, neighborhoodsCount: number, gemsCount: number, createdCount: number): Badge[] {
    return [
      {
        id: 'badge_first_bite',
        name: 'First Bite',
        description: 'Cast your first vote in a Navi Mumbai Food Fight',
        icon: '🥢',
        unlocked: dishesCount >= 1,
        unlockedAt: dishesCount >= 1 ? '2026-10-18' : undefined,
        current: Math.min(dishesCount, 1),
        target: 1
      },
      {
        id: 'badge_vashi_veteran',
        name: 'Vashi Street Veteran',
        description: 'Voted on 3+ intense culinary street rivalries',
        icon: '⚔️',
        unlocked: dishesCount >= 3,
        unlockedAt: dishesCount >= 3 ? '2026-10-18' : undefined,
        current: Math.min(dishesCount, 3),
        target: 3
      },
      {
        id: 'badge_navi_explorer',
        name: 'Navi Mumbai Scout',
        description: 'Discovered dishes across 3 distinct nodes (Vashi, Nerul, Belapur, etc.)',
        icon: '📍',
        unlocked: neighborhoodsCount >= 3,
        unlockedAt: neighborhoodsCount >= 3 ? '2026-10-18' : undefined,
        current: Math.min(neighborhoodsCount, 3),
        target: 3
      },
      {
        id: 'badge_challenger',
        name: 'Kingmaker',
        description: 'Challenged a winning dish or created a community food battle',
        icon: '👑',
        unlocked: createdCount >= 1,
        unlockedAt: createdCount >= 1 ? '2026-10-18' : undefined,
        current: Math.min(createdCount, 1),
        target: 1
      },
      {
        id: 'badge_gem_hunter',
        name: 'Gem Hunter',
        description: 'Pitched an underrated local food stall to the radar',
        icon: '💎',
        unlocked: gemsCount >= 1,
        unlockedAt: gemsCount >= 1 ? '2026-10-18' : undefined,
        current: Math.min(gemsCount, 1),
        target: 1
      }
    ];
  }

  calculateLevel(dishesCount: number): { title: string; number: number; progress: number } {
    if (dishesCount >= 10) return { title: 'Legendary Food Critic', number: 5, progress: 100 };
    if (dishesCount >= 5) return { title: 'Senior Palate Master', number: 4, progress: Math.min(100, Math.round(((dishesCount - 5) / 5) * 100)) };
    if (dishesCount >= 3) return { title: 'Street Food Explorer', number: 3, progress: Math.min(100, Math.round(((dishesCount - 3) / 2) * 100)) };
    if (dishesCount >= 1) return { title: 'Navi Mumbai Foodie', number: 2, progress: Math.min(100, Math.round(((dishesCount - 1) / 2) * 100)) };
    return { title: 'Taste Novice', number: 1, progress: 0 };
  }

  getPassport(fingerprint: string): FoodPassport {
    let passport = this.passports.get(fingerprint);
    if (!passport) {
      const userVotes: string[] = [];
      const userNodes = new Set<string>();
      const userRestaurants = new Set<string>();

      for (const [key, chosenRes] of this.voteLogs.entries()) {
        const [bId, fp] = key.split('#');
        if (fp === fingerprint) {
          userVotes.push(bId);
          userRestaurants.add(chosenRes);
          const battle = this.battles.get(bId);
          if (battle) {
            userNodes.add(battle.neighborhood);
          }
        }
      }

      const gemsCount = this.hiddenGems.filter((g) => g.submitterFingerprint === fingerprint).length;
      const challengesCount = this.challenges.filter((c) => c.submitterFingerprint === fingerprint).length;
      const dishesCount = userVotes.length;
      const neighborhoodsCount = userNodes.size;
      const level = this.calculateLevel(dishesCount);

      passport = {
        fingerprint,
        displayName: `Palate Voter #${fingerprint.slice(-4).toUpperCase()}`,
        dishesTriedCount: dishesCount,
        battlesVotedCount: dishesCount,
        battlesCreatedCount: challengesCount,
        restaurantsDiscoveredCount: userRestaurants.size,
        neighborhoodsExploredCount: neighborhoodsCount,
        badges: this.getBadgesForPassport(dishesCount, neighborhoodsCount, gemsCount, challengesCount),
        favoriteCategories: ['Street Food', 'Biryani', 'Seafood'],
        votedBattleIds: userVotes,
        levelTitle: level.title,
        levelNumber: level.number,
        levelProgress: level.progress,
        updatedAt: new Date().toISOString()
      };
      this.passports.set(fingerprint, passport);
    }
    return passport;
  }
}

// Global singleton
declare global {
  // eslint-disable-next-line no-var
  var __palateCoreStore: PalateMemoryStore | undefined;
}

const coreStore = globalThis.__palateCoreStore || new PalateMemoryStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__palateCoreStore = coreStore;
}

// ------------------------------------------------------------------------------
// PUBLIC DATA ACCESS METHODS
// ------------------------------------------------------------------------------

export async function getBattles(voterFingerprint?: string): Promise<Battle[]> {
  const battles = Array.from(coreStore.battles.values());
  return battles.map((b) => {
    let choice: string | null = null;
    if (voterFingerprint) {
      choice = coreStore.voteLogs.get(`${b.id}#${voterFingerprint}`) || null;
    }
    return {
      ...b,
      userVotedChoice: choice,
      // Compatibility aliases
      restaurantA: {
        id: b.contestantA.id,
        name: b.contestantA.name,
        neighborhood: b.contestantA.neighborhood,
        imageUrl: b.contestantA.imageUrl,
        signatureDish: b.contestantA.signatureDish
      },
      restaurantB: {
        id: b.contestantB.id,
        name: b.contestantB.name,
        neighborhood: b.contestantB.neighborhood,
        imageUrl: b.contestantB.imageUrl,
        signatureDish: b.contestantB.signatureDish
      },
      restaurantAId: b.contestantA.id,
      restaurantBId: b.contestantB.id
    };
  });
}

export async function getBattleBySlug(slug: string, voterFingerprint?: string): Promise<Battle | null> {
  const battles = await getBattles(voterFingerprint);
  const found = battles.find((b) => b.slug === slug || b.id === slug);
  return found || null;
}

export async function castVote(
  battleId: string,
  chosenContestantId: string,
  voterFingerprint: string
): Promise<VoteResponse> {
  if (!battleId || !chosenContestantId || !voterFingerprint) {
    return { success: false, message: 'Invalid vote parameters' };
  }

  const battle = coreStore.battles.get(battleId);
  if (!battle) {
    return { success: false, message: 'Battle not found' };
  }

  if (!battle.isActive || battle.status === 'completed') {
    return {
      success: false,
      message: 'This battle has ended. Community voting is locked. Challenge the winner instead!'
    };
  }

  const voteKey = `${battleId}#${voterFingerprint}`;
  if (coreStore.voteLogs.has(voteKey)) {
    return {
      success: false,
      alreadyVoted: true,
      message: 'You have already voted in this battle! One vote per device enforced.',
      battle: {
        ...battle,
        userVotedChoice: coreStore.voteLogs.get(voteKey)
      }
    };
  }

  // Increment contestant votes
  if (chosenContestantId === battle.contestantA.id) {
    battle.votesA += 1;
    battle.contestantA.votes += 1;
  } else if (chosenContestantId === battle.contestantB.id) {
    battle.votesB += 1;
    battle.contestantB.votes += 1;
  } else {
    return { success: false, message: 'Invalid chosen contestant for this battle' };
  }

  coreStore.calculatePercentages(battle);
  coreStore.voteLogs.set(voteKey, chosenContestantId);

  // Invalidate passport cache
  coreStore.passports.delete(voterFingerprint);
  const passport = coreStore.getPassport(voterFingerprint);

  // Track analytics event
  trackAnalyticsEvent('vote_submitted', { battleId, chosenContestantId }, voterFingerprint);

  return {
    success: true,
    message: 'Vote cast! Your voice has been recorded in the community score.',
    isPopularityNotice: 'Notice: Community votes reflect crowd popularity and taste debate, not verified food quality inspection.',
    battle: {
      ...battle,
      userVotedChoice: chosenContestantId
    },
    passport
  };
}

export async function getPassport(fingerprint: string): Promise<FoodPassport> {
  return coreStore.getPassport(fingerprint);
}

export async function submitChallenge(data: {
  previousBattleId: string;
  challengerName: string;
  challengerRestaurant: string;
  neighborhood: string;
  dishCategory: string;
  reason: string;
  submitterFingerprint: string;
}): Promise<BattleChallenge> {
  const previousBattle = coreStore.battles.get(data.previousBattleId);
  const winnerName = previousBattle?.winnerContestantId === previousBattle?.contestantA.id
    ? previousBattle?.contestantA.name
    : previousBattle?.contestantB.name || 'Current Champion';

  const newChallenge: BattleChallenge = {
    id: `chal_${Date.now()}`,
    previousBattleId: data.previousBattleId,
    previousBattleTitle: previousBattle?.title || 'Previous Battle',
    winnerContestantName: `${winnerName} (Winner)`,
    challengerName: data.challengerName,
    challengerRestaurant: data.challengerRestaurant,
    neighborhood: data.neighborhood,
    dishCategory: data.dishCategory,
    reason: data.reason,
    submitterFingerprint: data.submitterFingerprint,
    status: 'approved',
    createdAt: new Date().toISOString(),
    upvotes: 1
  };

  coreStore.challenges.unshift(newChallenge);
  if (previousBattle) {
    previousBattle.challengeCount = (previousBattle.challengeCount || 0) + 1;
  }

  // Update passport
  coreStore.passports.delete(data.submitterFingerprint);
  trackAnalyticsEvent('challenge_started', { previousBattleId: data.previousBattleId, challenger: data.challengerName }, data.submitterFingerprint);

  return newChallenge;
}

export async function getChallenges(battleId?: string): Promise<BattleChallenge[]> {
  if (battleId) {
    return coreStore.challenges.filter((c) => c.previousBattleId === battleId);
  }
  return coreStore.challenges;
}

export async function createBattle(battleData: {
  title: string;
  battleType: 'dish' | 'restaurant' | 'debate';
  dishName: string;
  category: string;
  city: string;
  neighborhood: string;
  contestantAName: string;
  contestantARestaurant?: string;
  contestantAImage: string;
  contestantBName: string;
  contestantBRestaurant?: string;
  contestantBImage: string;
  description?: string;
  submitterFingerprint: string;
}): Promise<Battle> {
  const id = `battle_user_${Date.now()}`;
  const slug = battleData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newBattle: Battle = {
    id,
    slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
    title: battleData.title,
    subtitle: `Community food debate created by locals`,
    dishName: battleData.dishName,
    battleType: battleData.battleType,
    category: battleData.category,
    city: battleData.city || 'Navi Mumbai',
    neighborhood: battleData.neighborhood || 'Vashi',
    status: 'live',
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    description: battleData.description || 'Community food fight. Vote and settle the score.',
    votesA: 0,
    votesB: 0,
    totalVotes: 0,
    percentA: 50,
    percentB: 50,
    isActive: true,
    challengeCount: 0,
    contestantA: {
      id: `cont_a_${Date.now()}`,
      name: battleData.contestantAName,
      restaurantName: battleData.contestantARestaurant || battleData.contestantAName,
      neighborhood: battleData.neighborhood,
      imageUrl: battleData.contestantAImage || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      votes: 0,
      percentage: 50
    },
    contestantB: {
      id: `cont_b_${Date.now()}`,
      name: battleData.contestantBName,
      restaurantName: battleData.contestantBRestaurant || battleData.contestantBName,
      neighborhood: battleData.neighborhood,
      imageUrl: battleData.contestantBImage || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80',
      votes: 0,
      percentage: 50
    }
  };

  coreStore.battles.set(id, newBattle);
  coreStore.passports.delete(battleData.submitterFingerprint);
  trackAnalyticsEvent('battle_created', { battleId: id, title: newBattle.title }, battleData.submitterFingerprint);

  return newBattle;
}

export async function submitHiddenGem(gem: {
  submitterFingerprint: string;
  restaurantName: string;
  neighborhood: string;
  dishRecommendation: string;
  secretTip?: string;
}): Promise<HiddenGem> {
  const newGem: HiddenGem = {
    id: `gem_${Date.now()}`,
    submitterFingerprint: gem.submitterFingerprint,
    restaurantName: gem.restaurantName,
    neighborhood: gem.neighborhood,
    dishRecommendation: gem.dishRecommendation,
    secretTip: gem.secretTip,
    status: 'approved',
    createdAt: new Date().toISOString(),
    upvotes: 1
  };

  coreStore.hiddenGems.unshift(newGem);
  coreStore.passports.delete(gem.submitterFingerprint);
  return newGem;
}

export async function getHiddenGems(): Promise<HiddenGem[]> {
  return coreStore.hiddenGems;
}

export async function getLeaderboard(filter?: { category?: string; neighborhood?: string; type?: string }) {
  const battles = await getBattles();
  const contenderMap = new Map<
    string,
    { name: string; restaurantName: string; neighborhood: string; wins: number; totalBattles: number; totalVotes: number; imageUrl: string; dishName: string; battleType: string }
  >();

  battles.forEach((b) => {
    // If filter applied
    if (filter?.neighborhood && filter.neighborhood !== 'All' && !b.neighborhood.includes(filter.neighborhood)) return;
    if (filter?.category && filter.category !== 'All' && b.category !== filter.category) return;
    if (filter?.type && filter.type !== 'All' && b.battleType !== filter.type) return;

    // Contender A
    const idA = b.contestantA.name;
    if (!contenderMap.has(idA)) {
      contenderMap.set(idA, {
        name: b.contestantA.name,
        restaurantName: b.contestantA.restaurantName || b.contestantA.name,
        neighborhood: b.contestantA.neighborhood,
        imageUrl: b.contestantA.imageUrl,
        dishName: b.dishName,
        battleType: b.battleType,
        wins: 0,
        totalBattles: 0,
        totalVotes: 0
      });
    }
    const statA = contenderMap.get(idA)!;
    statA.totalBattles += 1;
    statA.totalVotes += b.votesA;
    if (b.votesA > b.votesB) statA.wins += 1;

    // Contender B
    const idB = b.contestantB.name;
    if (!contenderMap.has(idB)) {
      contenderMap.set(idB, {
        name: b.contestantB.name,
        restaurantName: b.contestantB.restaurantName || b.contestantB.name,
        neighborhood: b.contestantB.neighborhood,
        imageUrl: b.contestantB.imageUrl,
        dishName: b.dishName,
        battleType: b.battleType,
        wins: 0,
        totalBattles: 0,
        totalVotes: 0
      });
    }
    const statB = contenderMap.get(idB)!;
    statB.totalBattles += 1;
    statB.totalVotes += b.votesB;
    if (b.votesB > b.votesA) statB.wins += 1;
  });

  const sorted = Array.from(contenderMap.values())
    .map((item) => ({
      ...item,
      winRate: Math.round((item.wins / Math.max(1, item.totalBattles)) * 100),
      restaurant: {
        id: item.name,
        name: item.name,
        neighborhood: item.neighborhood,
        imageUrl: item.imageUrl
      }
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes);

  return sorted.map((item, idx) => ({
    rank: idx + 1,
    ...item
  }));
}

// ------------------------------------------------------------------------------
// ANALYTICS & GROWTH LOOP TRACKING
// ------------------------------------------------------------------------------

export function trackAnalyticsEvent(
  event: AnalyticsEventName,
  properties: Record<string, any> = {},
  fingerprint?: string
) {
  const record: AnalyticsEvent = {
    event,
    properties,
    fingerprint,
    timestamp: new Date().toISOString()
  };
  coreStore.analyticsEvents.push(record);
  console.log(`[PALATE Analytics] ${event}:`, properties);
}

export function getAnalyticsSummary() {
  const counts: Record<string, number> = {};
  coreStore.analyticsEvents.forEach((e) => {
    counts[e.event] = (counts[e.event] || 0) + 1;
  });
  return {
    totalEvents: coreStore.analyticsEvents.length,
    funnel: counts,
    recentEvents: coreStore.analyticsEvents.slice(-20)
  };
}
