import type { Dish, Venue } from '../types';

export const CORRIDORS = [
  'All Navi Mumbai',
  'Vashi',
  'Sanpada',
  'Juinagar',
  'Nerul',
  'CBD Belapur',
  'Kharghar'
] as const;

export const NEIGHBORHOODS = [
  'All Navi Mumbai',
  'Vashi',
  'Sanpada',
  'Juinagar',
  'Nerul',
  'CBD Belapur',
  'Kharghar'
];

export const VENUES: Record<string, Venue> = {
  "bhagat-tarachand": {
    "id": "bhagat-tarachand",
    "name": "Bhagat Tarachand",
    "area": "Sector 17, Vashi",
    "fullAddress": "Shop 14-16, Arenja Corner, Sector 17, Vashi, Navi Mumbai",
    "distanceMeters": 350,
    "walkingMinutes": 4,
    "vibeTags": [
      "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67 Family Crowd",
      "\u26a1 Fast Brass Thali Service",
      "\ud83e\uddc8 Pure Ghee Special"
    ],
    "mapsUrl": "https://maps.google.com/?q=Bhagat+Tarachand+Sector+17+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Complimentary Kutchi Beer Bottle",
      "description": "Present this badge when ordering Pav Bhaji or Thali to get a complimentary chilled glass-bottle Kutchi Chaas.",
      "code": "PALATE-BTC-CHAAS99"
    },
    "topDishIds": [
      "dish-btc-thali",
      "dish-btc-pavbhaji",
      "dish-btc-kutchi-beer"
    ],
    "skipDishes": [
      {
        "id": "skip-btc-1",
        "name": "Veg Hakka Noodles & Manchurian",
        "price": 210,
        "reason": "Greasy, overly sweet MSG sauce that contradicts their classic pure vegetarian Punjabi-Sindhi legacy. Strictly an afterthought.",
        "alternativeRecommendation": "Stick to the Special Veg Thali, Sev Tamatar, or Special Amul Pav Bhaji."
      }
    ]
  },
  "morumal-sweets": {
    "id": "morumal-sweets",
    "name": "Morumal Sweets & Snacks",
    "area": "Sector 17, Vashi",
    "fullAddress": "Near Blue Diamond Hotel, Sector 17, Vashi, Navi Mumbai",
    "distanceMeters": 280,
    "walkingMinutes": 3,
    "vibeTags": [
      "\u26a1 Quick Standing Counter",
      "\ud83c\udf05 Morning Rush 7:30 AM",
      "\ud83d\udc51 Sindhi Heritage"
    ],
    "mapsUrl": "https://maps.google.com/?q=Morumal+Sweets+Sector+17+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Extra Crispy Pakwan",
      "description": "Show voucher to cashier for a complimentary extra round of double-blistered black-pepper pakwan.",
      "code": "PALATE-MORU-PAKWAN"
    },
    "topDishIds": [
      "dish-moru-dalpakwan",
      "dish-moru-sevbarfi"
    ],
    "skipDishes": [
      {
        "id": "skip-moru-1",
        "name": "Samosa Dahi Chaat",
        "price": 60,
        "reason": "Soggy crust drowned in overly sweet supermarket curd; loses all crunch within 30 seconds.",
        "alternativeRecommendation": "Get the fiery Sunday morning Dal Pakwan or fresh hot Sindhi Koki."
      }
    ]
  },
  "arenja-midnight-bhurji": {
    "id": "arenja-midnight-bhurji",
    "name": "Arenja Corner Midnight Bhurji",
    "area": "Arenja Corner, Vashi",
    "fullAddress": "Kiosk 2, Arenja Corner Circle, Sector 17, Vashi, Navi Mumbai",
    "distanceMeters": 330,
    "walkingMinutes": 4,
    "vibeTags": [
      "\ud83c\udf19 Open Till 2:30 AM",
      "\ud83e\uddc8 Double Amul Butter",
      "\u26a1 High Heat Tawa Clatter"
    ],
    "mapsUrl": "https://maps.google.com/?q=Arenja+Corner+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Extra Grated Boiled Egg Topping",
      "description": "Show badge to chef for free mountain of grated boiled egg showered over your bhurji.",
      "code": "PALATE-ARENJA-EGG"
    },
    "topDishIds": [
      "dish-arenja-bhurji"
    ],
    "skipDishes": [
      {
        "id": "skip-arenja-1",
        "name": "Generic Dry Chicken Roll",
        "price": 120,
        "reason": "Pre-shredded cold tandoori chicken reheated in a dry maida paratha; completely misses the fresh tawa magic.",
        "alternativeRecommendation": "Stick strictly to the live scrambled 4-Egg Butter Boil Bhurji Pav."
      }
    ]
  },
  "apmc-grain-market-canteen": {
    "id": "apmc-grain-market-canteen",
    "name": "APMC Market Spice Canteen",
    "area": "APMC Market, Vashi",
    "fullAddress": "Dana Bazar Gate 3, APMC Market, Vashi, Navi Mumbai",
    "distanceMeters": 1800,
    "walkingMinutes": 20,
    "vibeTags": [
      "\ud83c\udf3e Wholesale Market Energy",
      "\ud83d\udd25 Fiery Maharashtrian Kat",
      "\ud83c\udf05 Opens 6:00 AM"
    ],
    "mapsUrl": "https://maps.google.com/?q=APMC+Market+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Extra Bowl of Rassa Tari",
      "description": "Show badge for a piping hot extra bowl of fragrant roasted coconut red tari.",
      "code": "PALATE-APMC-TARI"
    },
    "topDishIds": [
      "dish-apmc-kat-usal"
    ],
    "skipDishes": [
      {
        "id": "skip-apmc-1",
        "name": "Cold Showcase Samosa",
        "price": 25,
        "reason": "Sitting in the counter display case since early dawn; oil separates and pastry turns dense.",
        "alternativeRecommendation": "Always order the simmering fresh Kat Usal Pav with smoking red tari."
      }
    ]
  },
  "al-bake-arabian": {
    "id": "al-bake-arabian",
    "name": "Al-Bake Arabian Nights",
    "area": "Sector 17, Vashi",
    "fullAddress": "Near Arenja Arcade, Sector 17, Vashi, Navi Mumbai",
    "distanceMeters": 320,
    "walkingMinutes": 3,
    "vibeTags": [
      "\ud83d\udd25 Charcoal Spit Roast",
      "\ud83c\udf19 Midnight Shawarma Line",
      "\ud83e\uddc4 Authentic Garlic Toum"
    ],
    "mapsUrl": "https://maps.google.com/?q=Al+Bake+Sector+17+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Extra Dip of Garlic Toum",
      "description": "Unlock a complimentary pot of thick authentic garlic toum emulsion.",
      "code": "PALATE-ALBAKE-TOUM"
    },
    "topDishIds": [
      "dish-albake-shawarma"
    ],
    "skipDishes": [
      {
        "id": "skip-albake-1",
        "name": "Chicken Dum Biryani",
        "price": 240,
        "reason": "Dry, pre-portioned rice reheated in microwave; chicken is stringy and lacks aromatic saffron dum.",
        "alternativeRecommendation": "Stick strictly to the rotating spit Rumali Chicken Shawarma."
      }
    ]
  },
  "shree-durga": {
    "id": "shree-durga",
    "name": "Shree Durga Snacks",
    "area": "Sector 17, Vashi",
    "fullAddress": "Opposite Municipal Market, Sector 17, Vashi, Navi Mumbai",
    "distanceMeters": 420,
    "walkingMinutes": 5,
    "vibeTags": [
      "\u2615 Filter Coffee Sips",
      "\u26a1 Udupi Fast Service",
      "\ud83e\udd65 Fresh Chutney Refills"
    ],
    "mapsUrl": "https://maps.google.com/?q=Shree+Durga+Snacks+Sector+17+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Secret Red Garlic Podi Bowl",
      "description": "Unlock their reserve fiery dry-roasted coconut garlic podi chutney bowl with any dosa.",
      "code": "PALATE-DURGA-PODI"
    },
    "topDishIds": [
      "dish-durga-mysoredosa"
    ],
    "skipDishes": [
      {
        "id": "skip-durga-1",
        "name": "Street Pav Bhaji",
        "price": 130,
        "reason": "Dull canned tomato paste flavor that lacks street spice aromatics; an afterthought on an authentic South Indian griddle.",
        "alternativeRecommendation": "Order the butter-slathered Mysore Masala Dosa with red garlic paste."
      }
    ]
  },
  "prashant-corner": {
    "id": "prashant-corner",
    "name": "Prashant Corner",
    "area": "Sector 17, Vashi",
    "fullAddress": "Plot 12, Sector 17 Market, Vashi, Navi Mumbai",
    "distanceMeters": 290,
    "walkingMinutes": 3,
    "vibeTags": [
      "\ud83c\udf6c Master Halwai Confections",
      "\u2728 Pure Desi Ghee",
      "\ud83c\udfc6 Navi Mumbai Landmark"
    ],
    "mapsUrl": "https://maps.google.com/?q=Prashant+Corner+Sector+17+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Warm Baked Rasgulla Tasting Cup",
      "description": "Complimentary warm caramel-glazed baked rasgulla sample with sweet purchase.",
      "code": "PALATE-PRASHANT-BAKED"
    },
    "topDishIds": [
      "dish-prashant-baked-rasgulla"
    ],
    "skipDishes": [
      {
        "id": "skip-prashant-1",
        "name": "Packaged Dry Diet Chivda",
        "price": 120,
        "reason": "Mass-manufactured shelf item with bland seasoning. You come here for fresh halwai mastery, not factory chivda.",
        "alternativeRecommendation": "Get the fresh warm Baked Rasgulla or Motichoor Ladoo made with pure desi ghee."
      }
    ]
  },
  "madras-cafe-sanpada": {
    "id": "madras-cafe-sanpada",
    "name": "Madras Cafe & Tiffin Corner",
    "area": "Sanpada",
    "fullAddress": "Station Complex, Sector 3, Sanpada, Navi Mumbai",
    "distanceMeters": 1400,
    "walkingMinutes": 16,
    "vibeTags": [
      "\u2615 Steaming Filter Kaapi",
      "\ud83e\uddc8 Pure Ghee Podi",
      "\u26a1 Commuter Hotspot"
    ],
    "mapsUrl": "https://maps.google.com/?q=Sanpada+Station+Food+Corner",
    "counterPerk": {
      "title": "Show at Counter: Extra Gunpowder Podi Cup",
      "description": "Complimentary small bowl of house-ground roasted dal gunpowder podi drenched in hot ghee.",
      "code": "PALATE-SANPADA-PODI"
    },
    "topDishIds": [
      "dish-sanpada-ghee-dosa"
    ],
    "skipDishes": [
      {
        "id": "skip-sanpada-1",
        "name": "Schezwan Fried Rice",
        "price": 150,
        "reason": "Commercial bottled red sauce and stale cabbage tossed on a dosa tawa. Never order Chinese at an Udupi tiffin spot.",
        "alternativeRecommendation": "Stick strictly to the Ghee Podi Masala Dosa or fluffy Thatte Idli."
      }
    ]
  },
  "palm-beach-dhaba-sanpada": {
    "id": "palm-beach-dhaba-sanpada",
    "name": "Palm Beach Tandoor & Dhaba",
    "area": "Sanpada",
    "fullAddress": "Service Road, Palm Beach Road, Sanpada, Navi Mumbai",
    "distanceMeters": 2100,
    "walkingMinutes": 24,
    "vibeTags": [
      "\ud83e\udd58 14-Hour Slow Dal",
      "\ud83d\udd25 Tandoori Clay Oven",
      "\ud83c\udf19 Palm Beach Night Drive"
    ],
    "mapsUrl": "https://maps.google.com/?q=Palm+Beach+Road+Sanpada",
    "counterPerk": {
      "title": "Show at Counter: Extra Butter Tandoori Roti",
      "description": "Complimentary hot puffed tandoori roti slathered in butter with your main gravy.",
      "code": "PALATE-PALMBEACH-ROTI"
    },
    "topDishIds": [
      "dish-sanpada-dal-makhani"
    ],
    "skipDishes": [
      {
        "id": "skip-sanpada-2",
        "name": "Cornstarch Heavy Paneer Chilli",
        "price": 220,
        "reason": "Rubber-textured paneer cubes drowned in gelatinous MSG brown sauce; completely out of place in a Punjabi kitchen.",
        "alternativeRecommendation": "Order the rich, slow-simmered Dal Makhani with hot Tandoori Butter Roti."
      }
    ]
  },
  "juinagar-station-bhurji": {
    "id": "juinagar-station-bhurji",
    "name": "Juinagar Station Midnight Bhurji Kiosk",
    "area": "Juinagar",
    "fullAddress": "Station Plaza, West Exit, Juinagar, Navi Mumbai",
    "distanceMeters": 2800,
    "walkingMinutes": 30,
    "vibeTags": [
      "\ud83c\udf19 Open Till 2:30 AM",
      "\ud83c\udf73 Amul Runny Yolk",
      "\u26a1 Fast Railway Standee"
    ],
    "mapsUrl": "https://maps.google.com/?q=Juinagar+Railway+Station",
    "counterPerk": {
      "title": "Show at Counter: Extra Roasted Kadak Pav Pair",
      "description": "Show badge to tawa chef for an extra butter-roasted kadak pav pair on the house.",
      "code": "PALATE-JUINAGAR-PAV"
    },
    "topDishIds": [
      "dish-juinagar-halffry"
    ],
    "skipDishes": [
      {
        "id": "skip-juinagar-1",
        "name": "Misal Pav past 2 PM",
        "price": 60,
        "reason": "By afternoon the rassa is thinned down with warm water and the matki sprouts turn mushy.",
        "alternativeRecommendation": "Stick strictly to live egg orders: the Amul Butter Half-Fry Pav."
      }
    ]
  },
  "hotel-ram-krishna-juinagar": {
    "id": "hotel-ram-krishna-juinagar",
    "name": "Hotel Ram Krishna",
    "area": "Juinagar",
    "fullAddress": "Plot 8, Sector 24, Near Railway Colony, Juinagar, Navi Mumbai",
    "distanceMeters": 2900,
    "walkingMinutes": 32,
    "vibeTags": [
      "\ud83c\udf05 7 AM Breakfast Rush",
      "\ud83c\udf69 Golden Air-Puffed Vada",
      "\ud83e\udd65 Thick Coconut Chutney"
    ],
    "mapsUrl": "https://maps.google.com/?q=Sector+24+Juinagar",
    "counterPerk": {
      "title": "Show at Counter: Extra Bowl of Spiced Drumstick Sambhar",
      "description": "Complimentary piping hot bowl of thick dal sambhar loaded with shallots and drumstick.",
      "code": "PALATE-RAMKRISHNA-SAMBHAR"
    },
    "topDishIds": [
      "dish-juinagar-medu-vada"
    ],
    "skipDishes": [
      {
        "id": "skip-juinagar-2",
        "name": "Cold Afternoon Upma",
        "price": 40,
        "reason": "Clumpy and lukewarm when ordered after 11:30 AM; loses its semolina aroma.",
        "alternativeRecommendation": "Always catch the morning hot-oil Medu Vada straight out of the kadai."
      }
    ]
  },
  "navratna-veg": {
    "id": "navratna-veg",
    "name": "Navratna Veg Restaurant",
    "area": "Nerul",
    "fullAddress": "Near LP Junction, Sion-Panvel Highway, Nerul, Navi Mumbai",
    "distanceMeters": 3500,
    "walkingMinutes": 36,
    "vibeTags": [
      "\u2615 Degree Filter Coffee",
      "\ud83e\uddc8 Pure Ghee Roast",
      "\ud83d\udc51 Highway Institution"
    ],
    "mapsUrl": "https://maps.google.com/?q=Navratna+Nerul+LP",
    "counterPerk": {
      "title": "Show at Counter: Complimentary Degree Filter Coffee",
      "description": "Show code when ordering any Ghee Roast Dosa to get a complimentary brass dabara filter coffee.",
      "code": "PALATE-NAVRATNA-COFFEE"
    },
    "topDishIds": [
      "dish-navratna-filtercoffee",
      "dish-navratna-gheeroast"
    ],
    "skipDishes": [
      {
        "id": "skip-navratna-1",
        "name": "North Indian Paneer Makhanwala",
        "price": 220,
        "reason": "Overly sweet commercial orange gravy overloaded with cream; completely dilutes their authentic South Indian mastery.",
        "alternativeRecommendation": "Stick to the legendary Ghee Roast Paper Dosa with fresh hot coconut chutney."
      }
    ]
  },
  "seawoods-grill-nerul": {
    "id": "seawoods-grill-nerul",
    "name": "Seawoods Charcoal & Tandoori Corner",
    "area": "Nerul",
    "fullAddress": "Plot 15, Sector 40, Seawoods Border, Nerul, Navi Mumbai",
    "distanceMeters": 3900,
    "walkingMinutes": 40,
    "vibeTags": [
      "\ud83d\udd25 Clay Tandoor Smoke",
      "\ud83c\udf57 Mustard Hung Curd Marinade",
      "\ud83c\udf19 Late Evening Crowd"
    ],
    "mapsUrl": "https://maps.google.com/?q=Sector+40+Seawoods+Nerul",
    "counterPerk": {
      "title": "Show at Counter: Extra Tandoori Butter Rumali",
      "description": "Complimentary hot folded butter rumali with any full tandoori plate.",
      "code": "PALATE-SEAWOODS-GRILL"
    },
    "topDishIds": [
      "dish-seawoods-tikka"
    ],
    "skipDishes": [
      {
        "id": "skip-seawoods-1",
        "name": "Overpriced Soggy Chicken Sizzler",
        "price": 380,
        "reason": "Cabbage bed burns to bitter ash while french fries underneath turn into soggy limp potato mash.",
        "alternativeRecommendation": "Stick strictly to the direct charcoal flame-licked Tandoori Chicken Tikka."
      }
    ]
  },
  "sai-krupa-nerul": {
    "id": "sai-krupa-nerul",
    "name": "Sai Krupa Udupi",
    "area": "Nerul",
    "fullAddress": "Near Nerul Railway Station East, Sector 19, Nerul, Navi Mumbai",
    "distanceMeters": 3200,
    "walkingMinutes": 32,
    "vibeTags": [
      "\ud83e\udd5e Giant Steamed Thatte Idli",
      "\ud83e\udd65 Fresh Grated Coconut",
      "\u26a1 High-Volume Morning"
    ],
    "mapsUrl": "https://maps.google.com/?q=Sai+Krupa+Nerul",
    "counterPerk": {
      "title": "Show at Counter: Extra Spicy Podi & Molten Ghee Cup",
      "description": "Double ladle of fiery gun-powder podi and hot ghee poured over your idli.",
      "code": "PALATE-NERUL-THATTE"
    },
    "topDishIds": [
      "dish-sai-thatte-idli"
    ],
    "skipDishes": [
      {
        "id": "skip-sai-1",
        "name": "Veg Hakka Noodles",
        "price": 140,
        "reason": "Oily packaged noodles drenched in synthetic vinegar and ketchup; an embarrassment next to their heavenly idlis.",
        "alternativeRecommendation": "Stick to their master dish: Thatte Idli with Molagapodi & Pure Ghee."
      }
    ]
  },
  "shri-krishna-misal-nerul": {
    "id": "shri-krishna-misal-nerul",
    "name": "Shri Krishna Bhuvan",
    "area": "Nerul",
    "fullAddress": "Shop 3, Sector 19, Nerul West, Navi Mumbai",
    "distanceMeters": 3100,
    "walkingMinutes": 30,
    "vibeTags": [
      "\ud83c\udf36\ufe0f Kolhapuri Red Tarri",
      "\ud83d\udd25 Sweat-Inducing Heat",
      "\ud83c\udf5e Fresh Crusty Pav"
    ],
    "mapsUrl": "https://maps.google.com/?q=Shri+Krishna+Misal+Nerul",
    "counterPerk": {
      "title": "Show at Counter: Extra Kat Bowl & Dahi Cup",
      "description": "Complimentary small bowl of cooling sweet dahi to tame the Kolhapuri tarri.",
      "code": "PALATE-KRISHNA-MISAL"
    },
    "topDishIds": [
      "dish-krishna-misal"
    ],
    "skipDishes": [
      {
        "id": "skip-krishna-1",
        "name": "Kanda Poha",
        "price": 40,
        "reason": "Pre-made batch kept in tray; dries out into bland flakes after 10 AM.",
        "alternativeRecommendation": "Fiery Kolhapuri Kat Misal with double butter pav & chilled dahi."
      }
    ]
  },
  "lp-junction-grill": {
    "id": "lp-junction-grill",
    "name": "LP Junction Charcoal Tandoor & Rolls",
    "area": "Nerul",
    "fullAddress": "Opposite LP Complex, Sion-Panvel Highway, Nerul, Navi Mumbai",
    "distanceMeters": 3400,
    "walkingMinutes": 35,
    "vibeTags": [
      "\ud83d\udd25 Open Pit Live Charcoal",
      "\ud83c\udf57 Overnight Malai Marinade",
      "\ud83c\udf19 Highway Late Night"
    ],
    "mapsUrl": "https://maps.google.com/?q=LP+Junction+Nerul",
    "counterPerk": {
      "title": "Show at Counter: Free Mint Chutney & Butter Rumali Refill",
      "description": "Complimentary hot butter rumali roti and signature mint-coriander dip refill.",
      "code": "PALATE-LP-CHUTNEY"
    },
    "topDishIds": [
      "dish-lp-malai-tikka"
    ],
    "skipDishes": [
      {
        "id": "skip-lp-1",
        "name": "Boneless Chilli Chicken Gravy",
        "price": 190,
        "reason": "Cornstarch heavy soy sauce glaze over rubbery chicken nuggets.",
        "alternativeRecommendation": "Juicy Charcoal Grilled Tandoori Malai Chicken Tikka."
      }
    ]
  },
  "hotel-shabari": {
    "id": "hotel-shabari",
    "name": "Hotel Shabari Coastal Cuisine",
    "area": "CBD Belapur",
    "fullAddress": "Sector 11, CBD Belapur, Navi Mumbai",
    "distanceMeters": 5100,
    "walkingMinutes": 48,
    "vibeTags": [
      "\ud83d\udc1f Authentic Coastal Seenu",
      "\ud83e\udd65 Kundapur Coconut Curry",
      "\ud83d\udc51 Belapur Legend"
    ],
    "mapsUrl": "https://maps.google.com/?q=Hotel+Shabari+CBD+Belapur",
    "counterPerk": {
      "title": "Show at Counter: Extra Lacy Neer Dosa Stack",
      "description": "Complimentary fresh warm pair of lacy neer dosas with any seafood gawa curry.",
      "code": "PALATE-SHABARI-NEER"
    },
    "topDishIds": [
      "dish-shabari-surmai-gawa"
    ],
    "skipDishes": [
      {
        "id": "skip-shabari-1",
        "name": "Generic Butter Chicken",
        "price": 260,
        "reason": "Sickly sweet tomato puree with store-bought dried fenugreek. Coming to an authentic coastal Mangalorean temple to order butter chicken is a crime.",
        "alternativeRecommendation": "Order the Neer Dosa with Surmai Gawa Curry or Prawns Sukka."
      }
    ]
  },
  "belapur-pub-street-cafe": {
    "id": "belapur-pub-street-cafe",
    "name": "The Belapur Social & Craft Cafe",
    "area": "CBD Belapur",
    "fullAddress": "Pub Street, Sector 15, CBD Belapur, Navi Mumbai",
    "distanceMeters": 5300,
    "walkingMinutes": 50,
    "vibeTags": [
      "\ud83c\udf5f Hand-Cut Truffle Fries",
      "\ud83c\udf7a Craft Brews & Cold Brew",
      "\ud83c\udfb6 Vibrant Vibe"
    ],
    "mapsUrl": "https://maps.google.com/?q=Sector+15+CBD+Belapur",
    "counterPerk": {
      "title": "Show at Counter: Complimentary Dip Trio",
      "description": "Unlock house-made garlic aioli, smoked jalapeno, and sriracha mayo dips.",
      "code": "PALATE-BELAPUR-TRUFFLE"
    },
    "topDishIds": [
      "dish-belapur-truffle-fries"
    ],
    "skipDishes": [
      {
        "id": "skip-belapur-pub-1",
        "name": "Pre-Made Refrigerated Pasta Bowl",
        "price": 280,
        "reason": "Overcooked penne sitting in cold cream sauce that splits upon microwaving.",
        "alternativeRecommendation": "Stick to hot hand-cut Truffle Parmesan Fries and craft beverages."
      }
    ]
  },
  "vada-pav-samrat-belapur": {
    "id": "vada-pav-samrat-belapur",
    "name": "Vada Pav Samrat",
    "area": "CBD Belapur",
    "fullAddress": "Stall 4, Station Khau Galli, CBD Belapur, Navi Mumbai",
    "distanceMeters": 5200,
    "walkingMinutes": 50,
    "vibeTags": [
      "\ud83e\udd54 Ulta Vada Pav Special",
      "\ud83e\uddc4 Roasted Garlic Thecha",
      "\u26a1 30-Second Rush Grab"
    ],
    "mapsUrl": "https://maps.google.com/?q=Belapur+Station+Khau+Galli",
    "counterPerk": {
      "title": "Show at Counter: Extra Garlic Thecha & Fried Chillies",
      "description": "Double scoop of crunchy fiery dry peanut-garlic thecha and salted fried chillies.",
      "code": "PALATE-SAMRAT-THECHA"
    },
    "topDishIds": [
      "dish-samrat-ulta-vadapav"
    ],
    "skipDishes": [
      {
        "id": "skip-samrat-1",
        "name": "Bread Pakora",
        "price": 30,
        "reason": "Spongy sandwich bread heavily soaked in residual kadai oil.",
        "alternativeRecommendation": "Hot Ulta Vada Pav with dry garlic thecha right out of bubbling oil."
      }
    ]
  },
  "artist-village-canteen": {
    "id": "artist-village-canteen",
    "name": "Artist Village Coastal Canteen",
    "area": "CBD Belapur",
    "fullAddress": "Near Ceramic Centre, Artist Village, Sector 8, CBD Belapur, Navi Mumbai",
    "distanceMeters": 4800,
    "walkingMinutes": 45,
    "vibeTags": [
      "\ud83c\udf3f Serene Green Courtyard",
      "\ud83e\udd90 Fresh Prawns Sukka",
      "\ud83e\udd65 Authentic Solkadhi"
    ],
    "mapsUrl": "https://maps.google.com/?q=Artist+Village+CBD+Belapur",
    "counterPerk": {
      "title": "Show at Counter: Chilled Solkadhi Refill",
      "description": "Complimentary chilled glass of hand-pressed pink kokum solkadhi.",
      "code": "PALATE-ARTIST-SOLKADHI"
    },
    "topDishIds": [
      "dish-artist-prawns-sukka"
    ],
    "skipDishes": [
      {
        "id": "skip-artist-1",
        "name": "Schezwan Triple Fried Rice",
        "price": 210,
        "reason": "Massive pile of food-colored rice that completely clashes with the soulful quiet coastal atmosphere.",
        "alternativeRecommendation": "Fresh Arabian Sea Prawns Sukka with piping hot Bhakri & Solkadhi."
      }
    ]
  },
  "durga-coastal-cbd": {
    "id": "durga-coastal-cbd",
    "name": "Durga Coastal Delights",
    "area": "CBD Belapur",
    "fullAddress": "Plot 44, Sector 15 Cafe Strip, CBD Belapur, Navi Mumbai",
    "distanceMeters": 5500,
    "walkingMinutes": 55,
    "vibeTags": [
      "\ud83e\udd80 Authentic Mangalorean Curry",
      "\ud83e\udd65 Hand-Pressed Coconut Milk",
      "\ud83c\udf36\ufe0f Byadagi Red Chilli"
    ],
    "mapsUrl": "https://maps.google.com/?q=CBD+Belapur+Sector+15+Food+Strip",
    "counterPerk": {
      "title": "Show at Counter: Extra Crispy Rotti Sheets",
      "description": "Complimentary plate of paper-crisp dry rice rotti wafers.",
      "code": "PALATE-DURGA-ROTTI"
    },
    "topDishIds": [
      "dish-cbd-kori-rotti"
    ],
    "skipDishes": [
      {
        "id": "skip-cbd-durga-1",
        "name": "Veg Fried Rice with Manchurian",
        "price": 180,
        "reason": "Soggy cafeteria-style fried rice that misses the glory of fresh coastal cooking.",
        "alternativeRecommendation": "Crisp hand-crumbled Kori Rotti with Kundapur Chicken Curry."
      }
    ]
  },
  "shilp-chowk-shawarma": {
    "id": "shilp-chowk-shawarma",
    "name": "Arabian Knights Shawarma",
    "area": "Kharghar",
    "fullAddress": "Shop 6, Shilp Chowk, Sector 7, Kharghar, Navi Mumbai",
    "distanceMeters": 7200,
    "walkingMinutes": 75,
    "vibeTags": [
      "\ud83e\udd59 Lebanese Charcoal Spit",
      "\ud83e\uddc4 Hand-Whipped Toum",
      "\ud83c\udf19 Student Hub Till 1:30 AM"
    ],
    "mapsUrl": "https://maps.google.com/?q=Shilp+Chowk+Kharghar",
    "counterPerk": {
      "title": "Show at Counter: Extra Garlic Toum & Pickled Beetroot",
      "description": "Double portion of thick garlicky toum and house-brined crunchy pink turnip slices.",
      "code": "PALATE-SHILP-TOUM"
    },
    "topDishIds": [
      "dish-shilp-shawarma"
    ],
    "skipDishes": [
      {
        "id": "skip-shilp-1",
        "name": "Mayo-Drenched 'Mexican' Chicken Roll",
        "price": 140,
        "reason": "Cheap commercial sandwich mayonnaise masquerading as salsa, drowning out the chicken.",
        "alternativeRecommendation": "Stick to the authentic Classic Lebanese Garlic Shawarma wrapped in thin rumali."
      }
    ]
  },
  "utsav-chowk-chaat": {
    "id": "utsav-chowk-chaat",
    "name": "Utsav Chowk Iconic Chaat Kiosk",
    "area": "Kharghar",
    "fullAddress": "Near Landmark Fountain, Utsav Chowk, Kharghar, Navi Mumbai",
    "distanceMeters": 6800,
    "walkingMinutes": 70,
    "vibeTags": [
      "\ud83c\udfdb\ufe0f Roman Pillar Landmark",
      "\ud83c\udf36\ufe0f Chilled Saunth Chutney",
      "\u26a1 1-Minute Service"
    ],
    "mapsUrl": "https://maps.google.com/?q=Utsav+Chowk+Kharghar",
    "counterPerk": {
      "title": "Show at Counter: Extra Crispy Sev Puri Round",
      "description": "Show badge to chaat master for 2 complimentaryLoaded Sev Puris.",
      "code": "PALATE-UTSAV-CHAAT"
    },
    "topDishIds": [
      "dish-utsav-sev-puri"
    ],
    "skipDishes": [
      {
        "id": "skip-utsav-1",
        "name": "Kharghar Street Pav Bhaji",
        "price": 110,
        "reason": "Watery mashed potato base lacking dark bhuna masala depth; tastes of generic food coloring.",
        "alternativeRecommendation": "Go for the crisp, cold, tangy masterclass of Sev Puri & Dahi Puri."
      }
    ]
  },
  "hiranandani-tawa-pulao": {
    "id": "hiranandani-tawa-pulao",
    "name": "Hiranandani Street Grill",
    "area": "Kharghar",
    "fullAddress": "Medley Arcade, Sector 7, Hiranandani Complex, Kharghar, Navi Mumbai",
    "distanceMeters": 7400,
    "walkingMinutes": 78,
    "vibeTags": [
      "\ud83e\uddc8 Sizzling Cast Iron",
      "\ud83e\uddc0 Amul Cheese Snow",
      "\ud83c\udf19 Evening Student Buzz"
    ],
    "mapsUrl": "https://maps.google.com/?q=Hiranandani+Sector+7+Kharghar",
    "counterPerk": {
      "title": "Show at Counter: Extra Grated Amul Cheese Blanket",
      "description": "Generous free snow of grated Amul processed cheese across your hot tawa pulao.",
      "code": "PALATE-HIRANANDANI-CHEESE"
    },
    "topDishIds": [
      "dish-hiranandani-tawapulao"
    ],
    "skipDishes": [
      {
        "id": "skip-hiranandani-1",
        "name": "Soggy Steamed Vegetable Momos",
        "price": 90,
        "reason": "Thick rubbery maida wrapper filled with watery unseasoned cabbage.",
        "alternativeRecommendation": "Order the piping hot, butter-fried Cheese Burst Tawa Pulao."
      }
    ]
  },
  "amritsari-kulcha-kharghar": {
    "id": "amritsari-kulcha-kharghar",
    "name": "Delhi Amritsari Kulcha Hut",
    "area": "Kharghar",
    "fullAddress": "Shop 11, Sector 12, Near Glomax Mall, Kharghar, Navi Mumbai",
    "distanceMeters": 6900,
    "walkingMinutes": 72,
    "vibeTags": [
      "\ud83d\udd25 Tandoor Blistered",
      "\ud83e\uddc8 Chur-Chur Flaky Crunch",
      "\ud83e\udd58 Pindi Chhole & Imli Pyaaz"
    ],
    "mapsUrl": "https://maps.google.com/?q=Sector+12+Kharghar",
    "counterPerk": {
      "title": "Show at Counter: Extra Bowl of Spiced Pindi Chhole",
      "description": "Complimentary hot bowl of authentic black tea brewed pindi chhole.",
      "code": "PALATE-KHARGHAR-KULCHA"
    },
    "topDishIds": [
      "dish-kharghar-churchur-kulcha"
    ],
    "skipDishes": [
      {
        "id": "skip-kharghar-kulcha-1",
        "name": "Over-Sweetened Commercial Lassi",
        "price": 60,
        "reason": "Made with bottled sugar syrup and thin curd; misses the thick malai crust of true Amritsari lassi.",
        "alternativeRecommendation": "Stick to the hand-crushed Chur-Chur Kulcha with spicy imli pyaaz chutney."
      }
    ]
  },
  "kathi-rolls-corner": {
    "id": "kathi-rolls-corner",
    "name": "Kathi Rolls Corner",
    "area": "Arenja Corner, Vashi",
    "fullAddress": "Stall 4, Arenja Corner Shopping Arcade, Sector 17, Vashi",
    "distanceMeters": 310,
    "walkingMinutes": 3,
    "vibeTags": [
      "\ud83c\udf19 Open Till 1:30 AM",
      "\ud83e\udd69 Fresh Tawa Smoked",
      "\u26a1 Street Counter"
    ],
    "mapsUrl": "https://maps.google.com/?q=Kathi+Rolls+Sector+17+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Free Double Egg Upgrade",
      "description": "Show code at tawa window for an extra free farm egg layered inside your chicken kathi roll.",
      "code": "PALATE-KATHI-EGG"
    },
    "topDishIds": [
      "dish-kathi-doublechicken"
    ],
    "skipDishes": [
      {
        "id": "skip-kathi-1",
        "name": "Paneer Tikka Roll",
        "price": 150,
        "reason": "Rubbery cold paneer cubes drenched in sweet mayo. Never again. Stick to Double Chicken Egg.",
        "alternativeRecommendation": "Order the Double Chicken Double Egg Kathi Roll with extra green chillies."
      }
    ]
  },
  "yum-yum-dosa": {
    "id": "yum-yum-dosa",
    "name": "Yum Yum Dosa Corner",
    "area": "Sector 17, Vashi",
    "fullAddress": "Lane 3, Sector 17 Market, Vashi, Navi Mumbai",
    "distanceMeters": 390,
    "walkingMinutes": 4,
    "vibeTags": [
      "\ud83e\uddc0 Molten Amul Cheese",
      "\u26a1 Fusion Street Tawa",
      "\ud83c\udf19 Late Night 1 AM"
    ],
    "mapsUrl": "https://maps.google.com/?q=Sector+17+Dosa+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Extra Shredded Cheese Blanket",
      "description": "Double cheese grating across any fusion dosa order.",
      "code": "PALATE-YUM-CHEESE"
    },
    "topDishIds": [
      "dish-yum-jinidosa"
    ],
    "skipDishes": [
      {
        "id": "skip-yum-1",
        "name": "Plain Sadha Dosa",
        "price": 70,
        "reason": "Tawa is seasoned with garlic and butter for fusion dosas; plain dosas turn out greasy without their signature punch.",
        "alternativeRecommendation": "Go for the legendary Jinny Dosa cut into bite-sized rolls."
      }
    ]
  },
  "gupta-sandwich": {
    "id": "gupta-sandwich",
    "name": "Gupta Sandwich & Toast Corner",
    "area": "Sector 17, Vashi",
    "fullAddress": "Corner Shop, Sector 17 Market, Vashi, Navi Mumbai",
    "distanceMeters": 260,
    "walkingMinutes": 3,
    "vibeTags": [
      "\ud83e\udd6a Charcoal Toast Master",
      "\ud83e\uddc0 Amul Cheese Slice",
      "\u26a1 2-Minute Grab"
    ],
    "mapsUrl": "https://maps.google.com/?q=Gupta+Sandwich+Sector+17+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Extra Mint Chutney & Sev Dip",
      "description": "Complimentary side cup of fiery spicy mint chutney and crunchy nylon sev.",
      "code": "PALATE-GUPTA-CHUTNEY"
    },
    "topDishIds": [
      "dish-gupta-veggie-toast"
    ],
    "skipDishes": [
      {
        "id": "skip-gupta-1",
        "name": "Chocolate Sandwich",
        "price": 90,
        "reason": "Overly sweet compound chocolate syrup on non-toasted white bread.",
        "alternativeRecommendation": "Stick to the savory classic Veggie Cheese Toast Sandwich."
      }
    ]
  },
  "natural-icecream": {
    "id": "natural-icecream",
    "name": "Naturals Ice Cream",
    "area": "Sector 17, Vashi",
    "fullAddress": "Shop 8, Arenja Arcade, Sector 17, Vashi, Navi Mumbai",
    "distanceMeters": 310,
    "walkingMinutes": 3,
    "vibeTags": [
      "\ud83c\udf68 Real Fruit Chunks",
      "\ud83e\udd65 Tender Coconut Legend",
      "\ud83c\udf19 Post-Dinner Crowd"
    ],
    "mapsUrl": "https://maps.google.com/?q=Naturals+Ice+Cream+Sector+17+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Waffle Cone Upgrade",
      "description": "Complimentary fresh-baked waffle cone with double scoop order.",
      "code": "PALATE-NATURAL-CONE"
    },
    "topDishIds": [
      "dish-natural-tender-coconut"
    ],
    "skipDishes": [
      {
        "id": "skip-natural-1",
        "name": "Choco Almond Scoop",
        "price": 80,
        "reason": "Ordinary cocoa flavor that misses the pure fruit extraction magic that makes Naturals famous.",
        "alternativeRecommendation": "Always order seasonal fruit scoops: Tender Coconut or Alphonso Mango."
      }
    ]
  },
  "yewale-amruttulya": {
    "id": "yewale-amruttulya",
    "name": "Yewale Amruttulya",
    "area": "Sector 17, Vashi",
    "fullAddress": "Shop 2, Near Municipal Bus Stop, Sector 17, Vashi, Navi Mumbai",
    "distanceMeters": 210,
    "walkingMinutes": 2,
    "vibeTags": [
      "\u2615 Jaggery Cardamom Chai",
      "\u26a1 10-Second Service",
      "\ud83e\ude99 \u20b915 Morning Cuppa"
    ],
    "mapsUrl": "https://maps.google.com/?q=Yewale+Amruttulya+Sector+17+Vashi",
    "counterPerk": {
      "title": "Show at Counter: Complimentary Maska Khari",
      "description": "Complimentary flaky butter khari biscuit with hot cutting chai.",
      "code": "PALATE-YEWALE-KHARI"
    },
    "topDishIds": [
      "dish-yewale-special-chai"
    ],
    "skipDishes": [
      {
        "id": "skip-yewale-1",
        "name": "Pre-Packaged Cream Roll",
        "price": 20,
        "reason": "Waxy palm oil cream inside dry stale puff casing.",
        "alternativeRecommendation": "Dip fresh buttery Maska Khari into boiling hot Special Jaggery Chai."
      }
    ]
  }
};

export const DISHES: Dish[] = [
  {
    "id": "dish-btc-thali",
    "name": "Special Veg Thali with Kutchi Chaas",
    "venueId": "bhagat-tarachand",
    "venueName": "Bhagat Tarachand",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 350,
    "walkingMinutes": 4,
    "price": 260,
    "verdict": "GOD_TIER",
    "scorePercent": 98,
    "microVerdict": "Pure ghee thali, kadak chapati with white makhan, kachori, paneer sabzi & chilled kutchi beer chaas.",
    "detailedReview": "The quintessential Vashi feast. Served in glistening brass plates, loaded with piping hot Kadak Phulkas dripping in pure white butter, spiced dal fry, seasonal vegetable, crisp kachori, and their signature amber beer bottle buttermilk.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83e\uddc8 Pure Ghee",
      "\ud83c\udf5e Kadak Chapati & Makhan",
      "\ud83d\udc51 Vashi Legend"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask the captain for 'Kadak Roti' so they toast your chapatis extra crisp directly on the tawa."
  },
  {
    "id": "dish-btc-pavbhaji",
    "name": "Special Amul Butter Pav Bhaji",
    "venueId": "bhagat-tarachand",
    "venueName": "Bhagat Tarachand",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 350,
    "walkingMinutes": 4,
    "price": 150,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Extra crisp double-roasted pav with rich, dark spiced masala. Don't order Chinese or pulav here.",
    "detailedReview": "Simmered slowly on heavy cast iron until deeply caramelized, finished with molten Amul butter and hand-crushed roasted cumin. The pavs arrive golden and blistered.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83e\uddc8 High Amul Butter",
      "\ud83c\udf5e Extra Crisp Pav",
      "\ud83d\udc51 Neighborhood Icon"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask the waiter explicitly for 'Kadak Pav' \u2014 they fry it 30 seconds longer on the tawa edges."
  },
  {
    "id": "dish-btc-kutchi-beer",
    "name": "Kutchi Beer (Spiced Buttermilk)",
    "venueId": "bhagat-tarachand",
    "venueName": "Bhagat Tarachand",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 350,
    "walkingMinutes": 4,
    "price": 50,
    "verdict": "GOD_TIER",
    "scorePercent": 95,
    "microVerdict": "Chilled glass bottle chaas with fresh mint, hing & crushed roasted jeera. The ultimate palate cleanser.",
    "detailedReview": "Served tongue-in-cheek in a chilled amber beer bottle, this churned buttermilk is thick, tangy, and bursting with black salt, asafetida, and fresh mint leaves.",
    "category": "Quick Bites",
    "flavorTags": [
      "\ud83e\uddca Ice Chilled",
      "\ud83c\udf3f Roasted Jeera & Mint",
      "\u26a1 Instant Digestif"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Order it before your food arrives so you can sip it as an aperitif while waiting for your table."
  },
  {
    "id": "dish-moru-dalpakwan",
    "name": "Sunday Morning Dal Pakwan",
    "venueId": "morumal-sweets",
    "venueName": "Morumal Sweets & Snacks",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 280,
    "walkingMinutes": 3,
    "price": 70,
    "verdict": "GOD_TIER",
    "scorePercent": 98,
    "microVerdict": "Shatteringly crisp cumin pakwan layered with creamy chana dal, raw onions & tamarind drizzle.",
    "detailedReview": "Only served until 11:00 AM before selling out. The pakwan is hand-docked and deep-fried to a golden glass-like crackle. The chana dal is cooked al-dente, seasoned with dried amchur and green chilies.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\u2728 Shatter Crisp",
      "\ud83d\udc51 Authentic Sindhi Heritage",
      "\ud83e\uddc5 Raw Onion Crunch"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Reach before 9:45 AM on Sundays; the crowd swells and pakwans run out fast."
  },
  {
    "id": "dish-moru-sevbarfi",
    "name": "Signature Singhar Ji Mithai (Sev Barfi)",
    "venueId": "morumal-sweets",
    "venueName": "Morumal Sweets & Snacks",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 280,
    "walkingMinutes": 3,
    "price": 90,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Dense unsalted sev simmered in mawa, rose essence & saffron syrup. Melts like fudge.",
    "detailedReview": "The crown jewel of traditional Sindhi confectionery. Unsalted crispy gram flour sev is slowly cooked down into rich khoya and saffron milk until it achieves a decadent fudge-like density.",
    "category": "Sweet Tooth",
    "flavorTags": [
      "\ud83c\udf6f Mawa Rich",
      "\ud83c\udf39 Rose & Cardamom",
      "\u2728 Melt in Mouth"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for a fresh cut slice from the center of the brass tray."
  },
  {
    "id": "dish-arenja-bhurji",
    "name": "4-Egg Butter Boil Bhurji Pav",
    "venueId": "arenja-midnight-bhurji",
    "venueName": "Arenja Corner Midnight Bhurji",
    "venueArea": "Arenja Corner, Vashi",
    "distanceMeters": 330,
    "walkingMinutes": 4,
    "price": 130,
    "verdict": "GOD_TIER",
    "scorePercent": 97,
    "microVerdict": "2 raw eggs + 2 boiled eggs minced with chopped onions, green chillies & melted Amul block.",
    "detailedReview": "Navi Mumbai's premier 1 AM sustenance. The chef minces boiled eggs directly into raw whisked eggs on a blazing iron griddle, creating a creamy yet chunky texture that grips the butter-soaked kadak pav.",
    "category": "Late Night",
    "flavorTags": [
      "\ud83e\udd5a Double Texture Eggs",
      "\ud83c\udf36\ufe0f Green Chilli Heat",
      "\ud83e\uddc8 Sizzling Amul Butter"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask the tawa chef for 'Kadak Pav' and extra chopped green chillies on top."
  },
  {
    "id": "dish-apmc-kat-usal",
    "name": "Kolhapuri Kat Usal Pav with Tari",
    "venueId": "apmc-grain-market-canteen",
    "venueName": "APMC Market Spice Canteen",
    "venueArea": "APMC Market, Vashi",
    "distanceMeters": 1800,
    "walkingMinutes": 20,
    "price": 50,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Sprouted moth beans simmered in dark roasted goda masala topped with crunchy farsan & fiery rassa.",
    "detailedReview": "Fueled by the spice merchants of APMC Dana Bazar. The usal is hearty, unadulterated, and served with a ladle of dark red tari that leaves a pleasant lingering heat on your tongue.",
    "category": "Spicy",
    "flavorTags": [
      "\ud83c\udf36\ufe0f Goda Masala Heat",
      "\ud83c\udf31 Sprouted Matki",
      "\ud83c\udf5e Bakery Fresh Pav"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for 'Limbu aani kanda jaada' (extra lime wedge and chopped raw onions) to cut the tari spice."
  },
  {
    "id": "dish-albake-shawarma",
    "name": "Rumali Chicken Shawarma with Garlic Toum",
    "venueId": "al-bake-arabian",
    "venueName": "Al-Bake Arabian Nights",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 320,
    "walkingMinutes": 3,
    "price": 120,
    "verdict": "GOD_TIER",
    "scorePercent": 97,
    "microVerdict": "Thin tissue rumali wrapped around juicy spiced vertical-spit chicken, French fries & creamy garlic toum.",
    "detailedReview": "Zero cabbage filler. Sliced hot right off the vertical charcoal spit with charred crisp edges and tender juicy center, wrapped with pickled cucumbers and house garlic paste.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83c\udf57 Spit-Roasted Chicken",
      "\ud83e\uddc4 Authentic Toum",
      "\ud83c\udf2f Thin Paper Rumali"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for 'No cabbage, only chicken and extra garlic toum'."
  },
  {
    "id": "dish-durga-mysoredosa",
    "name": "Butter Mysore Masala Dosa",
    "venueId": "shree-durga",
    "venueName": "Shree Durga Snacks",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 420,
    "walkingMinutes": 5,
    "price": 110,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Lacquered with fiery red garlic chutney, filled with turmeric potato bhaji & melted Amul butter.",
    "detailedReview": "Golden, lacy, and deeply aromatic. The griddle masters spread their signature garlic-byadgi chilli paste across the fermented rice batter, layering real butter before folding over seasoned potato mash.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83e\uddc8 Golden Crust",
      "\ud83e\uddc4 Red Garlic Spread",
      "\ud83e\udd65 Fresh Coconut Chutney"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for 'Extra Red Paste on the sides' for an assertive garlic kick."
  },
  {
    "id": "dish-prashant-baked-rasgulla",
    "name": "Warm Caramel Baked Rasgulla",
    "venueId": "prashant-corner",
    "venueName": "Prashant Corner",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 290,
    "walkingMinutes": 3,
    "price": 95,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Juicy chenna rasgullas baked in thickened saffron rabdi with a caramelized golden blistered skin.",
    "detailedReview": "A modern dessert masterpiece. Spongy handmade chenna balls are drenched in reduced condensed milk infused with saffron and green cardamom, then baked until the top forms a decadent crusted skin.",
    "category": "Sweet Tooth",
    "flavorTags": [
      "\ud83d\udd25 Caramelized Crust",
      "\ud83e\udd5b Saffron Rabdi",
      "\ud83d\udc51 Dessert Royalty"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask the counter staff to serve it 'Garam' (warm) so the rabdi flows like liquid custard."
  },
  {
    "id": "dish-sanpada-ghee-dosa",
    "name": "Ghee Podi Masala Dosa with Ginger Chutney",
    "venueId": "madras-cafe-sanpada",
    "venueName": "Madras Cafe & Tiffin Corner",
    "venueArea": "Sanpada",
    "distanceMeters": 1400,
    "walkingMinutes": 16,
    "price": 90,
    "verdict": "GOD_TIER",
    "scorePercent": 97,
    "microVerdict": "Shatter-crisp dosa griddled in pure ghee, dusted with fiery lentil podi, potato masala & tangy ginger chutney.",
    "detailedReview": "Sanpada's undisputed morning champion right outside the station. The batter is fermented for 14 hours, griddled paper-thin, and showered with fragrant roasted chana podi and clarified butter.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83e\uddc8 Golden Clarified Ghee",
      "\ud83c\udf36\ufe0f Gunpowder Podi",
      "\ud83e\udd65 Fresh Coconut Ginger"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for the chutney to be served unmixed so you can experience the fiery ginger dip separately."
  },
  {
    "id": "dish-sanpada-dal-makhani",
    "name": "14-Hour Slow Dal Makhani & Kadak Butter Roti",
    "venueId": "palm-beach-dhaba-sanpada",
    "venueName": "Palm Beach Tandoor & Dhaba",
    "venueArea": "Sanpada",
    "distanceMeters": 2100,
    "walkingMinutes": 24,
    "price": 210,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Slow-cooked black urad dal simmered overnight with tomatoes, butter & cream over wood charcoal.",
    "detailedReview": "Comfort food perfection on the Palm Beach corridor. The lentils break down into a velvet consistency without artificial starch, finished with kasuri methi and white butter.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83e\uddc8 Velvet Butter",
      "\ud83c\udf3f Kasuri Methi Aroma",
      "\ud83d\udd25 Clay Oven Smoke"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Pair strictly with Tandoori Kadak Roti \u2014 naans get too heavy for this velvety dal."
  },
  {
    "id": "dish-juinagar-halffry",
    "name": "Amul Butter Half-Fry Pav with Roasted Onion",
    "venueId": "juinagar-station-bhurji",
    "venueName": "Juinagar Station Midnight Bhurji Kiosk",
    "venueArea": "Juinagar",
    "distanceMeters": 2800,
    "walkingMinutes": 30,
    "price": 70,
    "verdict": "GOD_TIER",
    "scorePercent": 97,
    "microVerdict": "Two sunny-side farm eggs basted with sizzling Amul butter, cracked black pepper & caramelized onions.",
    "detailedReview": "The late-night commuter's secret weapon. The tawa chef fries the whites until lace-crisp while preserving golden molten yolks that burst into rich sauce when dipped with warm pav.",
    "category": "Late Night",
    "flavorTags": [
      "\ud83c\udf73 Golden Molten Yolk",
      "\ud83e\uddc5 Sweet Caramelized Onion",
      "\ud83e\uddc8 Sizzling Amul Butter"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for 'Papad jaisa kadak pav' so they press the pav into sizzling tawa butter twice."
  },
  {
    "id": "dish-juinagar-medu-vada",
    "name": "7 AM Crispy Medu Vada Sambhar",
    "venueId": "hotel-ram-krishna-juinagar",
    "venueName": "Hotel Ram Krishna",
    "venueArea": "Juinagar",
    "distanceMeters": 2900,
    "walkingMinutes": 32,
    "price": 50,
    "verdict": "GOD_TIER",
    "scorePercent": 95,
    "microVerdict": "Shatter-crisp exterior with a feather-light airy center, cracked black pepper & curry leaf aroma.",
    "detailedReview": "Freshly ground urad dal batter whipped to trap maximum air, shaped and dropped into shimmering peanut oil. Crispy outer crust yields to a cloud-like interior that soaks up spiced lentil sambhar.",
    "category": "Quick Bites",
    "flavorTags": [
      "\u2728 Glass-Crisp Skin",
      "\ud83c\udf31 Fresh Curry Leaves",
      "\ud83e\udd65 Thick Chutney Dip"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Order 'Sambhar dip alag se' so the vada stays crackling crisp till the very last bite."
  },
  {
    "id": "dish-navratna-filtercoffee",
    "name": "Authentic Degree Filter Coffee",
    "venueId": "navratna-veg",
    "venueName": "Navratna Veg Restaurant",
    "venueArea": "Nerul",
    "distanceMeters": 3500,
    "walkingMinutes": 36,
    "price": 45,
    "verdict": "GOD_TIER",
    "scorePercent": 98,
    "microVerdict": "Frothy chicory-peaberry decoction poured from brass davarah tumbler. Rich, nutty & invigorating.",
    "detailedReview": "Navi Mumbai's filter coffee benchmark. Hand-dripped chicory-blended roast brewed thick, frothed between brass cups to create a velvety micro-foam head.",
    "category": "Quick Bites",
    "flavorTags": [
      "\u2615 Peaberry & Chicory",
      "\ud83e\udd5b Frothy Foam Head",
      "\u2728 Brass Davarah"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for 'Strong Decoction, Less Sugar' for the true South Indian kick."
  },
  {
    "id": "dish-navratna-gheeroast",
    "name": "Golden Ghee Roast Paper Dosa",
    "venueId": "navratna-veg",
    "venueName": "Navratna Veg Restaurant",
    "venueArea": "Nerul",
    "distanceMeters": 3500,
    "walkingMinutes": 36,
    "price": 120,
    "verdict": "GOD_TIER",
    "scorePercent": 97,
    "microVerdict": "Two-foot long golden cone dripping in fragrant melted desi ghee with spiced potato mash.",
    "detailedReview": "Shattering crisp paper-thin fermented batter roasted in aromatic golden ghee on a heavy iron tava. Arrives like a golden architectural cone with trio of chutneys.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83e\uddc8 Desi Ghee Aroma",
      "\u2728 Giant Paper Cone",
      "\ud83e\udd65 Trio Chutneys"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Break the tip and dip into the hot shallot sambhar first before tackling the sides."
  },
  {
    "id": "dish-seawoods-tikka",
    "name": "Char-Smoked Tandoori Chicken Tikka",
    "venueId": "seawoods-grill-nerul",
    "venueName": "Seawoods Charcoal & Tandoori Corner",
    "venueArea": "Nerul",
    "distanceMeters": 3900,
    "walkingMinutes": 40,
    "price": 180,
    "verdict": "GOD_TIER",
    "scorePercent": 97,
    "microVerdict": "Boneless chicken marinated in kashmiri chili, mustard oil & hung curd, charred over open live coal.",
    "detailedReview": "The smoke penetration on this tikka is legendary along the Seawoods-Nerul belt. Juicy interior with deeply blackened caramelized edges and tangy chaat masala.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83d\udd25 Live Coal Smoke",
      "\ud83c\udf57 Mustard Oil Marinade",
      "\ud83e\uddc5 Sliced Laccha Onions"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Squeeze the fresh lime wedge while the skewers are still sizzling hot on the plate."
  },
  {
    "id": "dish-sai-thatte-idli",
    "name": "Thatte Idli with Molagapodi & Ghee",
    "venueId": "sai-krupa-nerul",
    "venueName": "Sai Krupa Udupi",
    "venueArea": "Nerul",
    "distanceMeters": 3200,
    "walkingMinutes": 32,
    "price": 65,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Plate-sized airy steamed rice cake crowned with roasted lentil gunpowder & bubbling desi ghee.",
    "detailedReview": "Steamed in traditional wide flat plates, this idli is as light as down feathers. It arrives bathed in bright orange gun-powder podi and hot clarified butter.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83e\udd5e Plate-Sized Cloud",
      "\ud83e\uddc8 Molten Desi Ghee",
      "\ud83c\udf36\ufe0f Coarse Gunpowder"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Order an extra Medu Vada on the side to alternate between cloud-soft and shatter-crisp."
  },
  {
    "id": "dish-krishna-misal",
    "name": "Kolhapuri Rassa Tarri Misal with Farsan",
    "venueId": "shri-krishna-misal-nerul",
    "venueName": "Shri Krishna Bhuvan",
    "venueArea": "Nerul",
    "distanceMeters": 3100,
    "walkingMinutes": 30,
    "price": 80,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Smoked Kolhapuri chili rassa over crunchy moth beans, potato base & thick besan farsan.",
    "detailedReview": "A temple for spice purists in Nerul. The tarri is oil-rich and dark crimson, redolent with dagad phool and roasted coconut. Hits you with a deep, creeping heat.",
    "category": "Spicy",
    "flavorTags": [
      "\ud83c\udf36\ufe0f Dark Crimson Tarri",
      "\ud83e\uddc5 Diced Red Onions",
      "\ud83c\udf5e Double Kadak Pav"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Order 'Dahi on the side' to douse the flames if the Kolhapuri kat gets too fiery."
  },
  {
    "id": "dish-lp-malai-tikka",
    "name": "Murgh Malai Tikka Roll in Butter Rumali",
    "venueId": "lp-junction-grill",
    "venueName": "LP Junction Charcoal Tandoor & Rolls",
    "venueArea": "Nerul",
    "distanceMeters": 3400,
    "walkingMinutes": 35,
    "price": 150,
    "verdict": "GOD_TIER",
    "scorePercent": 95,
    "microVerdict": "Tender chicken steeped in cardamom-scented cream and melted cheese, charcoal grilled in paper rumali.",
    "detailedReview": "Highway late night perfection. The chicken thigh chunks are velvety and fall apart on touch, wrapped in a paper-thin butter-brushed rumali roti with pickled ring onions.",
    "category": "Late Night",
    "flavorTags": [
      "\ud83e\uddc0 Cream & Cardamom",
      "\ud83d\udd25 Smokey Char",
      "\ud83c\udf2f Paper Thin Rumali"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask the grill master for 'Extra Char' so the edges get caramelized and crispy."
  },
  {
    "id": "dish-shabari-surmai-gawa",
    "name": "Neer Dosa with Surmai Gawa Curry",
    "venueId": "hotel-shabari",
    "venueName": "Hotel Shabari Coastal Cuisine",
    "venueArea": "CBD Belapur",
    "distanceMeters": 5100,
    "walkingMinutes": 48,
    "price": 290,
    "verdict": "GOD_TIER",
    "scorePercent": 98,
    "microVerdict": "Feather-light lacy rice crepes served with fiery coconut-kokum kingfish curry.",
    "detailedReview": "The culinary pride of Belapur. The neer dosas are translucent, moist, and fold like silk. The Surmai (Kingfish) steak is simmered in freshly ground roasted coconut, Byadgi chilies, and tart kokum.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83d\udc1f Fresh Kingfish",
      "\ud83e\udd65 Rich Kokum Coconut",
      "\ud83e\udd5e Lacy Silk Neer Dosa"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Pour the hot gawa gravy directly over folded neer dosas and let them absorb the juices for 30 seconds."
  },
  {
    "id": "dish-belapur-truffle-fries",
    "name": "Truffle Parmesan Hand-Cut Fries & Cold Brew",
    "venueId": "belapur-pub-street-cafe",
    "venueName": "The Belapur Social & Craft Cafe",
    "venueArea": "CBD Belapur",
    "distanceMeters": 5300,
    "walkingMinutes": 50,
    "price": 190,
    "verdict": "GOD_TIER",
    "scorePercent": 95,
    "microVerdict": "Double-fried skin-on russet potatoes tossed in aromatic truffle oil, aged parmesan & rosemary.",
    "detailedReview": "The best snacking item on Belapur's bustling Pub Street corridor. Crispy golden exterior with fluffy potato interior, coated in black truffle essence and micro-planed sharp cheese.",
    "category": "Quick Bites",
    "flavorTags": [
      "\ud83c\udf5f Truffle Oil Fragrance",
      "\ud83e\uddc0 Shaved Parmesan",
      "\ud83c\udf3f Fresh Rosemary"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Dip immediately into the chilled garlic aioli while the fries are steaming hot."
  },
  {
    "id": "dish-samrat-ulta-vadapav",
    "name": "Giant Ulta Stuffed Vada Pav",
    "venueId": "vada-pav-samrat-belapur",
    "venueName": "Vada Pav Samrat",
    "venueArea": "CBD Belapur",
    "distanceMeters": 5200,
    "walkingMinutes": 50,
    "price": 35,
    "verdict": "GOD_TIER",
    "scorePercent": 97,
    "microVerdict": "Fresh bakery pav stuffed with spicy potato masala, dipped in spiced besan batter, fried & smeared with garlic thecha.",
    "detailedReview": "Belapur Station Khau Galli legend. Unlike ordinary vada pav where the batata vada is tucked inside bread, here the entire pav is stuffed, sealed in gram flour batter, and deep fried into a giant golden pillow.",
    "category": "Quick Bites",
    "flavorTags": [
      "\ud83e\udd54 Ulta Stuffed Pav",
      "\ud83e\uddc4 Fiery Dry Garlic Thecha",
      "\u26a1 Piping Hot Kadai Fry"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for 'Thecha dabake' (extra dry roasted garlic thecha pressed into the pav)."
  },
  {
    "id": "dish-artist-prawns-sukka",
    "name": "Fresh Prawns Sukka & Chilled Solkadhi",
    "venueId": "artist-village-canteen",
    "venueName": "Artist Village Coastal Canteen",
    "venueArea": "CBD Belapur",
    "distanceMeters": 4800,
    "walkingMinutes": 45,
    "price": 240,
    "verdict": "GOD_TIER",
    "scorePercent": 97,
    "microVerdict": "Succulent sea prawns tossed with toasted coconut, crushed peppercorn, garlic & tart solkadhi.",
    "detailedReview": "Tucked away in the leafy bohemian alleys of Artist Village. Medium prawns flash-seared with shallots, curry leaves, and dry-roasted Malvani spices, served alongside pink kokum digestive nectar.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83e\udd90 Sweet Sea Prawns",
      "\ud83e\udd65 Dry Toasted Coconut",
      "\ud83c\udf38 Tart Kokum Solkadhi"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for warm rice bhakri to scoop up the spicy dry roasted coconut masala."
  },
  {
    "id": "dish-cbd-kori-rotti",
    "name": "Crisp Kori Rotti with Kundapur Chicken Curry",
    "venueId": "durga-coastal-cbd",
    "venueName": "Durga Coastal Delights",
    "venueArea": "CBD Belapur",
    "distanceMeters": 5500,
    "walkingMinutes": 55,
    "price": 230,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Bone-in country chicken in spicy coconut gravy ladled over paper-crisp dry rice wafers.",
    "detailedReview": "A Mangalorean culinary ritual. You crumble the wafer-thin sun-dried rice sheets onto your plate and pour over the boiling hot, chili-red coconut chicken gravy, watching the crisp rotti soften into savory perfection.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83c\udf57 Tender Country Chicken",
      "\ud83e\udd65 Byadagi Chili Gravy",
      "\u2728 Shatter-Crisp Rice Wafers"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Don't soak all the rotti at once \u2014 crumble half, eat, and crumble the rest to enjoy the contrast of textures."
  },
  {
    "id": "dish-shilp-shawarma",
    "name": "Classic Lebanese Garlic Shawarma (Rumali)",
    "venueId": "shilp-chowk-shawarma",
    "venueName": "Arabian Knights Shawarma",
    "venueArea": "Kharghar",
    "distanceMeters": 7200,
    "walkingMinutes": 75,
    "price": 110,
    "verdict": "GOD_TIER",
    "scorePercent": 98,
    "microVerdict": "Slow-turned spiced chicken shavings, crisp pickled pink turnip, and rich garlicky toum in thin rumali.",
    "detailedReview": "The golden standard of Kharghar shawarma culture. Zero cabbage fillers. Only tender spiced chicken thighs shaved hot off the vertical spit, wrapped in soft rumali with authentic garlic toum.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\ud83c\udf57 Spit-Turned Chicken",
      "\ud83e\uddc4 Authentic Garlic Toum",
      "\ud83c\udf2f Paper Thin Rumali"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for 'Extra Pickles and No Fries inside' for an intense, juicy meat bite."
  },
  {
    "id": "dish-utsav-sev-puri",
    "name": "Special Sev Puri & Dahi Puri with Chilled Saunth",
    "venueId": "utsav-chowk-chaat",
    "venueName": "Utsav Chowk Iconic Chaat Kiosk",
    "venueArea": "Kharghar",
    "distanceMeters": 6800,
    "walkingMinutes": 70,
    "price": 60,
    "verdict": "GOD_TIER",
    "scorePercent": 97,
    "microVerdict": "Paper-thin flat puris loaded with spiced potatoes, raw mango, sweet tamarind & mountain of nylon sev.",
    "detailedReview": "Navi Mumbai's iconic evening ritual. The puris retain their audible snap even under layers of sweet tamarind-date chutney, spicy coriander paste, and golden chickpea sev.",
    "category": "Quick Bites",
    "flavorTags": [
      "\u2728 Crackling Crisp Puri",
      "\ud83e\udd6d Raw Mango Zing",
      "\ud83c\udf6f Chilled Tamarind Saunth"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask the bhel-wala for 'Kairi thoda zyada' (extra shredded green raw mango on top)."
  },
  {
    "id": "dish-hiranandani-tawapulao",
    "name": "Cheese Burst Tawa Pulao",
    "venueId": "hiranandani-tawa-pulao",
    "venueName": "Hiranandani Street Grill",
    "venueArea": "Kharghar",
    "distanceMeters": 7400,
    "walkingMinutes": 78,
    "price": 140,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Long-grain basmati tossed on smoking pav bhaji griddle with kasuri methi & shredded Amul cheese.",
    "detailedReview": "Stir-fried on a massive concave steel griddle seasoned by decades of pav bhaji butter. Every grain of rice is separate, glistening with butter and tomato-garlic masala, finished under a mountain of fresh grated cheese.",
    "category": "Late Night",
    "flavorTags": [
      "\ud83e\uddc8 Pav Bhaji Butter Masala",
      "\ud83e\uddc0 Amul Cheese Blanket",
      "\ud83c\udf5a Fluffy Long Grain Basmati"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Pair with a cold glass of salted jeera chaas to cut through the rich cheese and butter."
  },
  {
    "id": "dish-kharghar-churchur-kulcha",
    "name": "Chur-Chur Amritsari Aloo Pyaaz Kulcha",
    "venueId": "amritsari-kulcha-kharghar",
    "venueName": "Delhi Amritsari Kulcha Hut",
    "venueArea": "Kharghar",
    "distanceMeters": 6900,
    "walkingMinutes": 72,
    "price": 120,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Layered clay-oven flatbread crushed by hand with butter, served with dark pindi chhole & imli pyaaz.",
    "detailedReview": "Laminated with butter and stuffed with spiced potatoes and pungent onions, roasted on the clay walls of a coal tandoor until blistered. The chef crushes it between palms with a loud crackle before serving with tangy imli chutney.",
    "category": "Must-Try Icons",
    "flavorTags": [
      "\u2728 Shatter Layered Crust",
      "\ud83e\udd54 Spiced Aloo Mash",
      "\ud83e\uddc5 Tangy Imli Pyaaz"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Spoon the watery onion-tamarind chutney directly over the crushed warm kulcha layers."
  },
  {
    "id": "dish-kathi-doublechicken",
    "name": "Double Chicken Double Egg Kathi Roll",
    "venueId": "kathi-rolls-corner",
    "venueName": "Kathi Rolls Corner",
    "venueArea": "Arenja Corner, Vashi",
    "distanceMeters": 310,
    "walkingMinutes": 3,
    "price": 140,
    "verdict": "GOD_TIER",
    "scorePercent": 96,
    "microVerdict": "Flaky layered paratha lined with two eggs, stuffed with charcoal-smoked chicken & sliced onions.",
    "detailedReview": "The late night heartbeat of Arenja Corner. The paratha is fried to a crackle, sealed with beaten eggs, and wrapped around generous spiced chicken tossed with chaat masala and lime.",
    "category": "Late Night",
    "flavorTags": [
      "\ud83c\udf73 Double Layered Egg",
      "\ud83c\udf57 Smokey Tawa Chicken",
      "\ud83e\uddc5 Chaat Masala Onions"
    ],
    "isVeg": false,
    "imageUrl": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for 'Extra green chili paste and lime' for the best flavor balance."
  },
  {
    "id": "dish-yum-jinidosa",
    "name": "Signature Jini Dosa (Cheese Burst)",
    "venueId": "yum-yum-dosa",
    "venueName": "Yum Yum Dosa Corner",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 390,
    "walkingMinutes": 4,
    "price": 140,
    "verdict": "GOD_TIER",
    "scorePercent": 95,
    "microVerdict": "Dosa rolled with butter, garlic paste, sweet-spicy chutney, sweet corn, cut into vertical rolls & smothered in cheese.",
    "detailedReview": "Mumbai-style fusion dosa at its finest. Cooked on an enormous cast-iron flat top with generous butter, rolled and cut into six vertical cylinders, then crowned with shredded cheese.",
    "category": "Quick Bites",
    "flavorTags": [
      "\ud83e\uddc0 Cheese Mountain",
      "\ud83e\uddc4 Garlic Masala",
      "\ud83c\udf3d Sweet Corn Crunch"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Eat immediately at the counter while the cheese is bubbling hot."
  },
  {
    "id": "dish-gupta-veggie-toast",
    "name": "Veggie Cheese Toast Sandwich with Green Chutney",
    "venueId": "gupta-sandwich",
    "venueName": "Gupta Sandwich & Toast Corner",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 260,
    "walkingMinutes": 3,
    "price": 85,
    "verdict": "WORTH_IT",
    "scorePercent": 93,
    "microVerdict": "Crispy pressed sandwich stuffed with boiled beetroot, potato, cucumber, bell peppers & Amul cheese slice.",
    "detailedReview": "The golden standard of Mumbai street sandwiches. Thinly sliced beetroots, cucumbers, and boiled potatoes seasoned with tangy sandwich masala, toasted in a hand-held gas clamp until crackling crisp.",
    "category": "Quick Bites",
    "flavorTags": [
      "\ud83e\udd6a Golden Toasted",
      "\ud83c\udf3f Spicy Green Chutney",
      "\ud83e\uddc0 Melting Cheese"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Ask for 'Extra Toast' so the crust gets deeply browned and holds up to the chutneys."
  },
  {
    "id": "dish-natural-tender-coconut",
    "name": "Signature Tender Coconut Ice Cream",
    "venueId": "natural-icecream",
    "venueName": "Naturals Ice Cream",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 310,
    "walkingMinutes": 3,
    "price": 85,
    "verdict": "GOD_TIER",
    "scorePercent": 98,
    "microVerdict": "Creamy milk base churned with fresh tender coconut malai shreds. Pure, subtle, sublime.",
    "detailedReview": "Only milk, sugar, and real tender coconut flesh. Zero artificial stabilizers. Every spoonful yields tender chewy chunks of sweet fresh coconut meat.",
    "category": "Sweet Tooth",
    "flavorTags": [
      "\ud83e\udd65 Fresh Malai Chunks",
      "\ud83e\udd5b Pure Cream",
      "\ud83e\uddca Natural Sweetness"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Pair one scoop of Tender Coconut with one scoop of Roasted Almond for the ultimate texture contrast."
  },
  {
    "id": "dish-yewale-special-chai",
    "name": "Special Cardamom Jaggery Chai with Maska Khari",
    "venueId": "yewale-amruttulya",
    "venueName": "Yewale Amruttulya",
    "venueArea": "Sector 17, Vashi",
    "distanceMeters": 210,
    "walkingMinutes": 2,
    "price": 20,
    "verdict": "WORTH_IT",
    "scorePercent": 94,
    "microVerdict": "Piping hot tea boiled with crushed green cardamom, ginger & natural sugarcane jaggery.",
    "detailedReview": "Maharashtra's favorite cutting chai. Brewed in heavy brass samovars with rich milk and cracked cardamom pods, served in miniature glasses.",
    "category": "Quick Bites",
    "flavorTags": [
      "\u2615 Crushed Cardamom",
      "\ud83c\udf6f Organic Jaggery",
      "\ud83e\uddc8 Maska Khari Dip"
    ],
    "isVeg": true,
    "imageUrl": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
    "insiderTip": "Tap the glass to let the sediment settle for 10 seconds before your first sip."
  }
];
