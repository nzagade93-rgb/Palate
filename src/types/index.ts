export type NaviMumbaiNode =
  | 'Vashi'
  | 'Nerul'
  | 'Belapur'
  | 'Kharghar'
  | 'Seawoods'
  | 'Sanpada';

export type ConsensusVote = 'must_order' | 'safe_to_skip';

export type DishCategory =
  | 'All'
  | 'Street Food'
  | 'Main'
  | 'Seafood'
  | 'South Indian'
  | 'Dessert & Bakery'
  | 'Fast Food & Snacks'
  | 'Biryani & Tandoor';

export interface DiningLog {
  id: string;
  dishId: string;
  restaurantId: string;
  userHandle: string;
  vote: ConsensusVote;
  pricePaidInr?: number;
  note?: string;
  photoUrl?: string;
  node: NaviMumbaiNode;
  createdAt: string;
}

export interface Dish {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  category: string;
  isVeg: boolean;
  priceInr: number;
  photoUrl: string;
  mustOrderCount: number;
  skipCount: number;
  totalVotes: number;
  consensusPercentage: number;
  highlightQuote: string;
  node: NaviMumbaiNode;
  sector: string;
  landmark?: string;
  googleMapsUrl?: string;
  recentLogs?: DiningLog[];
  userVote?: ConsensusVote | null;
}

export interface Restaurant {
  id: string;
  name: string;
  node: NaviMumbaiNode;
  sector: string;
  address?: string;
  landmark?: string;
  googleMapsUrl?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedNode: NaviMumbaiNode | 'All';
  consensusFilter: 'all' | 'must_order' | 'safe_to_skip';
  dietaryFilter: 'all' | 'veg' | 'non_veg';
  sortBy: 'consensus_desc' | 'votes_desc' | 'price_asc' | 'price_desc' | 'newest';
}
