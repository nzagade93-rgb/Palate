export type CategoryType = 
  | 'All' 
  | 'Must-Try Icons' 
  | 'Quick Bites' 
  | 'Late Night' 
  | 'Spicy';

export interface DNAVector {
  crunch: number; // 0 - 100
  heat: number;   // 0 - 100
  ghee: number;   // 0 - 100
  tang: number;   // 0 - 100
  sweet: number;  // 0 - 100
}

export interface Dish {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  area: string;
  distanceMeters: number;
  price: number;
  photoUrl: string;
  category: CategoryType[];
  isVeg: boolean;
  tags: string[];
  orderNote: string;
  skipNote: string;
  godTierPct: number;
  vouchCount: number;
  vouchesThisMonth: number;
  dnaVector: DNAVector;
  curatorPick?: boolean;
}

export interface Vouch {
  id: string;
  userId: string;
  userName?: string;
  dishId: string;
  dishName: string;
  restaurantName: string;
  createdAt: number;
  verdict: 'vouch' | 'skip';
  note?: string;
}

export interface User {
  id: string;
  name: string;
  dnaAffinities: DNAVector;
  vegRatio: number; // 0.0 - 1.0 (0.75 = 75% Veg)
  logCount: number;
  primaryCorridor: string;
  archetype: string;
  archetypeSubtitle: string;
}

export type ScreenTab = 'discover' | 'search' | 'dna' | 'vault';
