import type { Dish, User, Vouch, DNAVector } from '../types/palate';

export function computeCosineSimilarity(a: DNAVector, b: DNAVector): number {
  const dot = a.crunch * b.crunch + a.heat * b.heat + a.ghee * b.ghee + a.tang * b.tang + a.sweet * b.sweet;
  const magA = Math.sqrt(a.crunch ** 2 + a.heat ** 2 + a.ghee ** 2 + a.tang ** 2 + a.sweet ** 2);
  const magB = Math.sqrt(b.crunch ** 2 + b.heat ** 2 + b.ghee ** 2 + b.tang ** 2 + b.sweet ** 2);
  if (magA === 0 || magB === 0) return 0.5;
  return dot / (magA * magB);
}

export function computeSharedTasteCount(userDNA: DNAVector, dishDNA: DNAVector, totalVouches: number): number {
  const similarity = computeCosineSimilarity(userDNA, dishDNA);
  const count = Math.round(similarity * Math.min(24, Math.max(4, totalVouches * 0.12)));
  return Math.max(4, count);
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  const mins = Math.max(1, Math.round(meters / 85));
  return `${meters} m · ${mins} min walk`;
}

export const CURRENT_USER: User = {
  id: 'user-default-1',
  name: 'Arjun K.',
  dnaAffinities: {
    crunch: 85,
    heat: 68,
    ghee: 74,
    tang: 48,
    sweet: 32,
  },
  vegRatio: 0.75, // 75% Pure Veg
  logCount: 10,
  primaryCorridor: 'Sector 17, Vashi',
  archetype: 'Texture & Crunch Devotee',
  archetypeSubtitle: 'Prioritizes golden tawa blistering, layered crunch, and pure ghee finishes over heavy cream bases.',
};

export const SEED_DISHES: Dish[] = [
  {
    id: 'dish-dal-pakwan',
    name: 'Sindhi Dal Pakwan with Fiery Chutney',
    restaurantId: 'venue-morumal',
    restaurantName: 'Morumal Sweets & Snacks',
    area: 'Sector 17, Vashi',
    distanceMeters: 280,
    price: 90,
    photoUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: ['All', 'Must-Try Icons', 'Quick Bites'],
    isVeg: true,
    tags: ['Crispy', 'Sindhi Heritage', 'Chana Dal', 'Breakfast Legend'],
    orderNote: 'The double-blistered black-pepper pakwan with piping hot yellow chana dal, laced with green chilli & sour tamarind.',
    skipNote: 'Samosa Dahi Chaat (soggy crust drowned in overly sweet supermarket curd; loses all crunch within 30 seconds).',
    godTierPct: 96,
    vouchCount: 212,
    vouchesThisMonth: 41,
    dnaVector: { crunch: 95, heat: 75, ghee: 55, tang: 80, sweet: 20 },
    curatorPick: true,
  },
  {
    id: 'dish-btc-thali',
    name: 'Special Ghee Thali with Kutchi Beer',
    restaurantId: 'venue-btc',
    restaurantName: 'Bhagat Tarachand',
    area: 'Arenja Corner, Vashi',
    distanceMeters: 350,
    price: 320,
    photoUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    category: ['All', 'Must-Try Icons'],
    isVeg: true,
    tags: ['Pure Ghee', 'Punjabi Heritage', 'Kutchi Chaas', 'Slow Simmered'],
    orderNote: 'Ghee-drenched chapattis, rich Sev Tamatar, and the iconic ice-chilled Kutchi Chaas served in a vintage glass beer bottle.',
    skipNote: 'Veg Hakka Noodles & Manchurian (greasy, overly sweet MSG sauce that contradicts their classic 1895 pure ghee legacy).',
    godTierPct: 94,
    vouchCount: 384,
    vouchesThisMonth: 68,
    dnaVector: { crunch: 45, heat: 50, ghee: 98, tang: 60, sweet: 35 },
    curatorPick: true,
  },
  {
    id: 'dish-midnight-bhurji',
    name: 'Double Amul Butter Egg Bhurji & Kadak Pav',
    restaurantId: 'venue-arenja-bhurji',
    restaurantName: 'Arenja Corner Midnight Kiosk',
    area: 'Arenja Corner, Vashi',
    distanceMeters: 330,
    price: 130,
    photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    category: ['All', 'Late Night', 'Spicy'],
    isVeg: false,
    tags: ['Open Till 2:30 AM', 'Double Amul', 'Fiery', 'Street Legend'],
    orderNote: 'Slowly scrambled on a roaring iron tawa with hand-crushed green chillies, caramelized onions, and whole coriander seeds.',
    skipNote: 'Boiled Egg Kheema (watery tomato paste gravy that fails to bind with the egg crumb; dry and bland).',
    godTierPct: 95,
    vouchCount: 189,
    vouchesThisMonth: 52,
    dnaVector: { crunch: 60, heat: 92, ghee: 85, tang: 40, sweet: 10 },
    curatorPick: true,
  },
  {
    id: 'dish-ghee-roast-dosa',
    name: 'Paper Ghee Roast Masala Dosa with Gunpowder',
    restaurantId: 'venue-navratna',
    restaurantName: 'Navratna Pure Veg',
    area: 'Sector 17, Vashi',
    distanceMeters: 420,
    price: 160,
    photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    category: ['All', 'Must-Try Icons', 'Quick Bites'],
    isVeg: true,
    tags: ['Tawa Crisp', 'South Indian', 'Ghee Podi', 'Udupi Heritage'],
    orderNote: 'Impossibly thin fermented rice crepe roasted in aromatic country ghee, coated with fiery molagapodi and velvety potato masala.',
    skipNote: 'Schezwan Cheese Spring Dosa (rubbery supermarket cheese processed with commercial sweet schezwan sauce; soggy center).',
    godTierPct: 93,
    vouchCount: 276,
    vouchesThisMonth: 44,
    dnaVector: { crunch: 96, heat: 68, ghee: 88, tang: 50, sweet: 15 },
    curatorPick: true,
  },
  {
    id: 'dish-chole-bhature',
    name: 'Amritsari Pindi Chole Bhature with Pista Lassi',
    restaurantId: 'venue-vig',
    restaurantName: 'Vig Refreshments',
    area: 'Sector 17, Vashi',
    distanceMeters: 490,
    price: 180,
    photoUrl: 'https://images.unsplash.com/photo-1626777553634-5867a5b3a322?auto=format&fit=crop&w=800&q=80',
    category: ['All', 'Must-Try Icons'],
    isVeg: true,
    tags: ['Puffed Bhatura', 'Anardana Spice', 'Clay Glass Lassi', 'Punjab Icon'],
    orderNote: 'Dark, tea-leaf infused black chickpeas cooked in anardana & black cardamom, paired with balloon-puffed bhaturas.',
    skipNote: 'Veg Hakka Fried Rice (an industrial oil afterthought that sits cold in pre-portioned steam trays).',
    godTierPct: 92,
    vouchCount: 164,
    vouchesThisMonth: 29,
    dnaVector: { crunch: 70, heat: 75, ghee: 90, tang: 82, sweet: 25 },
    curatorPick: false,
  },
  {
    id: 'dish-surmai-fry',
    name: 'Malvani Surmai Tawa Fry with Solkadhi',
    restaurantId: 'venue-sanman',
    restaurantName: 'Hotel Sanman Malvani',
    area: 'Sector 19, Vashi',
    distanceMeters: 1250,
    price: 440,
    photoUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    category: ['All', 'Spicy'],
    isVeg: false,
    tags: ['Semolina Crust', 'Kokum Acid', 'Tirphal Spiced', 'Coastal Fresh'],
    orderNote: 'Thick cut King Mackerel dredged in coarse rava and house-milled Malvani masala, pan-fried crisp with chilling fresh solkadhi.',
    skipNote: 'Paneer Butter Masala (never order North Indian gravy at an authentic 40-year coastal Konkani fish kitchen).',
    godTierPct: 97,
    vouchCount: 318,
    vouchesThisMonth: 59,
    dnaVector: { crunch: 88, heat: 85, ghee: 40, tang: 90, sweet: 10 },
    curatorPick: true,
  },
  {
    id: 'dish-rabdi-jalebi',
    name: 'Kesar Doodh Jalebi with Slow-Simmered Rabdi',
    restaurantId: 'venue-prashant',
    restaurantName: 'Prashant Corner',
    area: 'Sector 17, Vashi',
    distanceMeters: 310,
    price: 120,
    photoUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    category: ['All', 'Quick Bites'],
    isVeg: true,
    tags: ['Pure Ghee Fry', 'Lachha Rabdi', 'Saffron Fragrance', 'Dessert Temple'],
    orderNote: 'Paper-thin spiral jalebis fried golden in pure cow ghee, soaked in saffron syrup and buried under chilled, clotted lachha rabdi.',
    skipNote: 'White Bread Sandwich (stale convenience loaf with raw butter; completely unworthy of their master halwai counter).',
    godTierPct: 91,
    vouchCount: 142,
    vouchesThisMonth: 36,
    dnaVector: { crunch: 80, heat: 10, ghee: 95, tang: 20, sweet: 98 },
    curatorPick: false,
  },
  {
    id: 'dish-cheese-pavbhaji',
    name: 'Tawa-Smoked Amul Butter Pav Bhaji',
    restaurantId: 'venue-tarachand-pav',
    restaurantName: 'Tarachand Pav Bhaji Kiosk',
    area: 'Sector 17, Vashi',
    distanceMeters: 360,
    price: 150,
    photoUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    category: ['All', 'Quick Bites', 'Late Night'],
    isVeg: true,
    tags: ['Cast Iron Simmered', 'Kashmiri Red', 'Double Pav', 'Local Religion'],
    orderNote: 'Crushed hand-selected potatoes and heirloom tomatoes simmered over 4 hours with slab butter, deglazed with coriander water.',
    skipNote: 'Veg Fried Rice (dry day-old long grain rice tossed with raw cabbage; tasteless fast food filler).',
    godTierPct: 93,
    vouchCount: 420,
    vouchesThisMonth: 77,
    dnaVector: { crunch: 40, heat: 72, ghee: 92, tang: 84, sweet: 18 },
    curatorPick: true,
  },
];

export const LIVE_CHECKIN_STREAM: Vouch[] = [
  {
    id: 'vouch-1',
    userId: 'u-1',
    userName: 'Tanvi M.',
    dishId: 'dish-dal-pakwan',
    dishName: 'Sindhi Dal Pakwan',
    restaurantName: 'Morumal Sweets',
    createdAt: Date.now() - 1000 * 60 * 3, // 3 mins ago
    verdict: 'vouch',
    note: 'The Sunday morning batch is blistered to absolute perfection today.',
  },
  {
    id: 'vouch-2',
    userId: 'u-2',
    userName: 'Karan S.',
    dishId: 'dish-btc-thali',
    dishName: 'Special Ghee Thali',
    restaurantName: 'Bhagat Tarachand',
    createdAt: Date.now() - 1000 * 60 * 12, // 12 mins ago
    verdict: 'vouch',
    note: 'Chilled Kutchi beer bottle paired with piping hot sev tamatar. 10/10.',
  },
  {
    id: 'vouch-3',
    userId: 'u-3',
    userName: 'Rhea D.',
    dishId: 'dish-ghee-roast-dosa',
    dishName: 'Paper Ghee Roast Masala Dosa',
    restaurantName: 'Navratna Pure Veg',
    createdAt: Date.now() - 1000 * 60 * 25, // 25 mins ago
    verdict: 'vouch',
    note: 'Crispiest edge in Sector 17. The molagapodi ghee coating is unreal.',
  },
];
