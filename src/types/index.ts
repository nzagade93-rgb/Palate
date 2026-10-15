export type VerdictType = 'GOD_TIER' | 'WORTH_IT' | 'SKIP';

export type CategoryFilter = 
  | 'All' 
  | 'Must-Try Icons' 
  | 'Quick Bites' 
  | 'Late Night' 
  | 'Spicy' 
  | 'Sweet Tooth';

export interface SkipItem {
  id: string;
  name: string;
  price: number;
  reason: string;
  alternativeRecommendation: string;
}

export interface Dish {
  id: string;
  name: string;
  venueId: string;
  venueName: string;
  venueArea: string;
  distanceMeters: number;
  walkingMinutes: number;
  price: number;
  verdict: VerdictType;
  scorePercent: number;
  microVerdict: string;
  detailedReview: string;
  category: CategoryFilter;
  flavorTags: string[];
  isVeg: boolean;
  imageUrl: string;
  insiderTip: string;
}

export interface Venue {
  id: string;
  name: string;
  area: string;
  fullAddress: string;
  distanceMeters: number;
  walkingMinutes: number;
  vibeTags: string[];
  mapsUrl: string;
  counterPerk: {
    title: string;
    description: string;
    code: string;
  };
  topDishIds: string[];
  skipDishes: SkipItem[];
}

export type VaultTab = 'LOVED' | 'AVOID' | 'SAVED';

export interface VaultItem {
  id: string;
  dishId: string;
  dishName: string;
  venueName: string;
  venueArea: string;
  price: number;
  verdict: VerdictType;
  scorePercent: number;
  imageUrl: string;
  status: VaultTab;
  userNotes: string;
  updatedAt: number;
  tags?: string[];
}
