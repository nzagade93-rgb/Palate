import type { Dish, Venue } from '../types';

export const VENUES: Record<string, Venue> = {
  'bhagat-tarachand': {
    id: 'bhagat-tarachand',
    name: 'Bhagat Tarachand',
    area: 'Sector 17, Vashi',
    fullAddress: 'Shop 14-16, Arenja Corner, Sector 17, Vashi, Navi Mumbai',
    distanceMeters: 350,
    walkingMinutes: 4,
    vibeTags: ['👨‍👩‍👧 Family Crowd', '⚡ Fast Brass Thali Service', '🧈 Pure Ghee Special'],
    mapsUrl: 'https://maps.google.com/?q=Bhagat+Tarachand+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Complimentary Kutchi Beer Bottle',
      description: 'Present this badge when ordering Pav Bhaji or Thali to get a complimentary chilled glass-bottle Kutchi Chaas.',
      code: 'PALATE-BTC-CHAAS99'
    },
    topDishIds: ['dish-btc-pavbhaji', 'dish-btc-kutchi-beer', 'dish-btc-sev-tamatar'],
    skipDishes: [
      {
        id: 'skip-btc-1',
        name: 'Veg Schezwan Fried Rice',
        price: 240,
        reason: 'Greasy, overly sweet MSG sauce that contradicts their classic pure vegetarian Punjabi-Sindhi legacy.',
        alternativeRecommendation: 'Stick to Sev Tamatar or Special Amul Pav Bhaji.'
      },
      {
        id: 'skip-btc-2',
        name: 'Tava Veg Pulav',
        price: 220,
        reason: 'Lacks the tawa punch; rice is clumpy and pre-boiled with excessive artificial food color.',
        alternativeRecommendation: 'Order the freshly toasted Kadak Chapati with white makhan.'
      }
    ]
  },

  'morumal-sweets': {
    id: 'morumal-sweets',
    name: 'Morumal Sweets & Snacks',
    area: 'Sector 17, Vashi',
    fullAddress: 'Near Blue Diamond Hotel, Sector 17, Vashi, Navi Mumbai',
    distanceMeters: 280,
    walkingMinutes: 3,
    vibeTags: ['⚡ Quick Standing Counter', '🌅 Morning Rush 7:30 AM', '👑 Sindhi Heritage'],
    mapsUrl: 'https://maps.google.com/?q=Morumal+Sweets+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Extra Crispy Pakwan',
      description: 'Show voucher to cashier Suresh for a complimentary extra round of double-blistered pepper pakwan.',
      code: 'PALATE-MORU-PAKWAN'
    },
    topDishIds: ['dish-moru-dalpakwan', 'dish-moru-sindhikoki', 'dish-moru-gulabjamun'],
    skipDishes: [
      {
        id: 'skip-moru-1',
        name: 'Samosa Dahi Chaat',
        price: 90,
        reason: 'Soggy crust drowned in overly sweet supermarket curd; loses all crunch within 30 seconds.',
        alternativeRecommendation: 'Get the fiery Sunday Dal Pakwan or fresh hot Sindhi Koki.'
      }
    ]
  },

  'shree-durga': {
    id: 'shree-durga',
    name: 'Shree Durga Snacks',
    area: 'Sector 17, Vashi',
    fullAddress: 'Opposite Municipal Market, Sector 17, Vashi, Navi Mumbai',
    distanceMeters: 420,
    walkingMinutes: 5,
    vibeTags: ['☕ Filter Coffee Sips', '⚡ Udupi Fast Service', '🥥 Fresh Chutney Refills'],
    mapsUrl: 'https://maps.google.com/?q=Shree+Durga+Snacks+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Secret Red Garlic Dip Bowl',
      description: 'Unlock their reserve fiery dry-roasted coconut garlic podi chutney bowl with any dosa.',
      code: 'PALATE-DURGA-PODI'
    },
    topDishIds: ['dish-durga-mysoredosa', 'dish-durga-meduvada', 'dish-durga-ravadosa'],
    skipDishes: [
      {
        id: 'skip-durga-1',
        name: 'Pav Bhaji',
        price: 160,
        reason: 'Dull tomato paste flavor that lacks street spice aromatics; clearly an afterthought on a South Indian menu.',
        alternativeRecommendation: 'Order the butter-slathered Mysore Masala Dosa.'
      }
    ]
  },

  'kathi-rolls-corner': {
    id: 'kathi-rolls-corner',
    name: 'Kathi Rolls Corner',
    area: 'Arenja Corner, Sec 17',
    fullAddress: 'Stall 4, Arenja Corner Shopping Arcade, Sector 17, Vashi',
    distanceMeters: 310,
    walkingMinutes: 3,
    vibeTags: ['🌙 Open Till 1:30 AM', '🥩 Fresh Tawa Smoked', '⚡ Street Counter'],
    mapsUrl: 'https://maps.google.com/?q=Kathi+Rolls+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Double Egg Upgrade',
      description: 'Show code at tawa window for an extra free farm egg layered inside your chicken kathi roll.',
      code: 'PALATE-KATHI-EGG2'
    },
    topDishIds: ['dish-kathi-doublechicken', 'dish-kathi-bhunamutton'],
    skipDishes: [
      {
        id: 'skip-kathi-1',
        name: 'Paneer Tikka Roll',
        price: 150,
        reason: 'Rubbery, bland paneer cubes drowned in bottled mint mayonnaise; lacks authentic tandoori smoke.',
        alternativeRecommendation: 'Go for the Double Chicken Egg Roll with pickled vinegar onions.'
      }
    ]
  },

  'yum-yum-dosa': {
    id: 'yum-yum-dosa',
    name: 'Yum Yum Fusion Dosa Cart',
    area: 'Sector 17, Vashi',
    fullAddress: 'Near City Center Mall Back Alley, Sector 17, Vashi',
    distanceMeters: 500,
    walkingMinutes: 6,
    vibeTags: ['🧀 Molten Cheese Cascades', '🔥 Late Night Street Eats', '⚡ High Energy Griddle'],
    mapsUrl: 'https://maps.google.com/?q=Yum+Yum+Dosa+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Extra Grated Amul Cheese Crown',
      description: 'Get an avalanche of freshly shredded Amul cheese crowned on your Jinny Dosa roll cuts.',
      code: 'PALATE-YUM-CHEESE'
    },
    topDishIds: ['dish-yum-jinnydosa', 'dish-yum-dilkhushdosa'],
    skipDishes: [
      {
        id: 'skip-yum-1',
        name: 'Plain Sada Dosa',
        price: 80,
        reason: 'Too thick and under-fermented; buying a plain dosa at a fusion cheese cart misses the whole point.',
        alternativeRecommendation: 'Jinny Dosa with sweet-spicy garlic butter glaze.'
      }
    ]
  },

  'tibbs-frankie': {
    id: 'tibbs-frankie',
    name: 'Tibbs Frankie Original',
    area: 'Sector 17 Market',
    fullAddress: 'Shop 7, Sector 17 Main Road, Vashi, Navi Mumbai',
    distanceMeters: 240,
    walkingMinutes: 3,
    vibeTags: ['🌯 The Bombay Original', '⚡ Grab & Walk', '🌶️ Vinegar Chilies'],
    mapsUrl: 'https://maps.google.com/?q=Tibbs+Frankie+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Extra Magic Masala Dust & Green Chilies',
      description: 'Extra dash of their secret 1969 Tibbs seasoning blend and vinegar soaked green chilies.',
      code: 'PALATE-TIBBS-DUST'
    },
    topDishIds: ['dish-tibbs-mutton', 'dish-tibbs-bbqchicken'],
    skipDishes: [
      {
        id: 'skip-tibbs-1',
        name: 'Veg Cheese Schezwan Frankie',
        price: 130,
        reason: 'Overpowered by artificial liquid cheese spread and syrupy chili sauce; mushy texture.',
        alternativeRecommendation: 'Stick to the classic Mutton Frankie with egg roti.'
      }
    ]
  },

  'navratna-veg': {
    id: 'navratna-veg',
    name: 'Navratna Pure Veg',
    area: 'Sector 17, Vashi',
    fullAddress: 'Opposite Vashi Bus Depot, Sector 17, Vashi, Navi Mumbai',
    distanceMeters: 450,
    walkingMinutes: 5,
    vibeTags: ['❄️ AC Family Dining', '🥘 North & South Curries', '🥛 Thick Badam Milk'],
    mapsUrl: 'https://maps.google.com/?q=Navratna+Pure+Veg+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Saffron Kheer Cup',
      description: 'Show code with any main course order to get a complimentary silver-leaf saffron badam kheer.',
      code: 'PALATE-NAV-KHEER'
    },
    topDishIds: ['dish-nav-kajucurry', 'dish-nav-ravamasala'],
    skipDishes: [
      {
        id: 'skip-nav-1',
        name: 'Veg Manchurian Gravy',
        price: 230,
        reason: 'Cornstarch heavy sludge with spongy dough balls; zero wok breath or ginger punch.',
        alternativeRecommendation: 'Rich Kaju Curry with crisp Butter Naan.'
      }
    ]
  },

  'prashant-corner': {
    id: 'prashant-corner',
    name: 'Prashant Corner',
    area: 'Sector 17, Vashi',
    fullAddress: 'Plot 31, Sector 17, Near Arenja Circle, Vashi, Navi Mumbai',
    distanceMeters: 380,
    walkingMinutes: 4,
    vibeTags: ['🥥 Fresh Steamed Modaks', '👑 Maharashtrian Royalty', '🥮 Mithai Artisans'],
    mapsUrl: 'https://maps.google.com/?q=Prashant+Corner+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Warm Pure Ghee Modak Sample',
      description: 'Taste a warm, hand-rolled coconut-jaggery steamed Ukadiche Modak fresh off the steamer.',
      code: 'PALATE-PRASHANT-MODAK'
    },
    topDishIds: ['dish-prashant-modak', 'dish-prashant-ragdapattice', 'dish-prashant-kajukatli'],
    skipDishes: [
      {
        id: 'skip-prashant-1',
        name: 'Nylon Khaman Dhokla',
        price: 90,
        reason: 'Dry center and uneven sugar-water tempering; often cold if bought in the evening.',
        alternativeRecommendation: 'Order the freshly griddled, steaming hot Ragda Pattice.'
      }
    ]
  },

  'al-bake-arabian': {
    id: 'al-bake-arabian',
    name: 'Al-Bake Arabian Hub',
    area: 'Vashi Plaza, Sector 17',
    fullAddress: 'Shop 12, Ground Floor, Vashi Plaza, Sector 17, Navi Mumbai',
    distanceMeters: 550,
    walkingMinutes: 7,
    vibeTags: ['🌙 Open Till 2:00 AM', '🥩 Rotating Vertical Spit', '🧄 House-made Garlic Toum'],
    mapsUrl: 'https://maps.google.com/?q=Al+Bake+Shawarma+Vashi+Plaza',
    counterPerk: {
      title: 'Show at Counter: Free Garlic Toum Extra Dip',
      description: 'Double portion of their velvety authentic Lebanese egg-white garlic toum dip.',
      code: 'PALATE-ALBAKE-TOUM'
    },
    topDishIds: ['dish-albake-rumalishawarma', 'dish-albake-alfaham'],
    skipDishes: [
      {
        id: 'skip-albake-1',
        name: 'Falafel Pita Pocket',
        price: 130,
        reason: 'Hard, over-fried dry chickpea patties with thick floury pita pockets; lacks tahini moisture.',
        alternativeRecommendation: 'The slow-roasted Charcoal Chicken Shawarma in thin Rumali.'
      }
    ]
  },

  'appetite-momos': {
    id: 'appetite-momos',
    name: 'Appetite Momo Station',
    area: 'Sector 17, Near Real Tech',
    fullAddress: 'Stall 2, Opposite Real Tech Park, Sector 17, Vashi',
    distanceMeters: 480,
    walkingMinutes: 6,
    vibeTags: ['🔥 Fiery Dalle Chutney', '⚡ Crispy Panko Batter', '🥟 College Crowd Favorite'],
    mapsUrl: 'https://maps.google.com/?q=Appetite+Momos+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Extra Fiery Chili Dip',
      description: 'Unlimited refills of the Himalayan fire-roasted garlic chili dip with your platter.',
      code: 'PALATE-MOMO-CHILI'
    },
    topDishIds: ['dish-momo-kurkurechicken', 'dish-momo-steamedchicken'],
    skipDishes: [
      {
        id: 'skip-momo-1',
        name: 'Veg Cheesy Fried Momos',
        price: 140,
        reason: 'Dense, oily outer jacket with processed cheese sauce that turns unpleasantly coagulated.',
        alternativeRecommendation: 'Super crunchy Kurkure Chicken Momos.'
      }
    ]
  },

  'vashi-fast-food': {
    id: 'vashi-fast-food',
    name: 'Vashi Fast Food Center (VFF)',
    area: 'Sector 9, Near Vashi Depot',
    fullAddress: 'Near Father Agnel School Corner, Sector 9, Vashi',
    distanceMeters: 750,
    walkingMinutes: 9,
    vibeTags: ['🧀 Cheese Grater Heaven', '🥪 Legendary Toasties', '🥤 Cold Fresh Juices'],
    mapsUrl: 'https://maps.google.com/?q=Vashi+Fast+Food+Sector+9',
    counterPerk: {
      title: 'Show at Counter: Extra Grated Butter Amul Dome',
      description: 'Free extra mountain of finely grated salted Amul cheese over your toast sandwich.',
      code: 'PALATE-VFF-CHEESE'
    },
    topDishIds: ['dish-vff-cheesetoast', 'dish-vff-sevpuri'],
    skipDishes: [
      {
        id: 'skip-vff-1',
        name: 'Grilled Chocolate Cheese Sandwich',
        price: 150,
        reason: 'Cheap artificial syrup mixed with salted cheddar creates an intensely cloying, oily disaster.',
        alternativeRecommendation: 'Special Vegetable Cheese Masala Toast Sandwich.'
      }
    ]
  },

  'gupta-sandwich': {
    id: 'gupta-sandwich',
    name: 'Gupta Sandwich & Juice Bar',
    area: 'Sector 17, Vashi',
    fullAddress: 'Sector 17 Center Square, Near Shabari Hotel, Vashi',
    distanceMeters: 320,
    walkingMinutes: 4,
    vibeTags: ['🥪 Triple Decker Grills', '🍉 Cold Pressed Seasonal', '⚡ Bustling Evening Hangout'],
    mapsUrl: 'https://maps.google.com/?q=Gupta+Sandwich+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Extra Spicy Green Coriander Chutney Jar',
      description: 'Fresh portion of spicy mint chutney and crunchy sev toppings.',
      code: 'PALATE-GUPTA-CHUTNEY'
    },
    topDishIds: ['dish-gupta-bahubali', 'dish-gupta-gangajamuna'],
    skipDishes: [
      {
        id: 'skip-gupta-1',
        name: 'Cold Coffee with Ice Cream',
        price: 120,
        reason: 'Filled with icy water crystals and overly sugary dairy creamer instead of brewed espresso.',
        alternativeRecommendation: 'Fresh Cold Pressed Mara-Mari (Pineapple + Mosambi) Juice.'
      }
    ]
  },

  'mahesh-lunch-home': {
    id: 'mahesh-lunch-home',
    name: 'Mahesh Lunch Home',
    area: 'Palm Beach Road, Sec 15',
    fullAddress: 'Platinum Techno Park, Sector 30A / Near Palm Beach Rd, Vashi',
    distanceMeters: 850,
    walkingMinutes: 11,
    vibeTags: ['🦀 Legendary Coastal Seafood', '🌶️ Mangalorean Ghee Roast', '🍷 Premium Dining'],
    mapsUrl: 'https://maps.google.com/?q=Mahesh+Lunch+Home+Vashi',
    counterPerk: {
      title: 'Show at Counter: Complimentary Sol Kadhi Shot',
      description: 'Authentic freshly pressed kokum and coconut milk digestive shot to start your coastal feast.',
      code: 'PALATE-MAHESH-SOLKADHI'
    },
    topDishIds: ['dish-mahesh-surmairava', 'dish-mahesh-buttergarliccrab', 'dish-mahesh-neerdosa'],
    skipDishes: [
      {
        id: 'skip-mahesh-1',
        name: 'Chicken Dum Biryani',
        price: 390,
        reason: 'Lacks fragrant aromatics; rice grains are overly dry and chicken feels reheated.',
        alternativeRecommendation: 'Order Neer Dosa with Fiery Prawns Ghee Roast.'
      }
    ]
  },

  'yewale-amruttulya': {
    id: 'yewale-amruttulya',
    name: 'Yewale Amruttulya',
    area: 'Sector 17, Vashi',
    fullAddress: 'Arenja Arcade Corner, Sector 17, Vashi, Navi Mumbai',
    distanceMeters: 290,
    walkingMinutes: 3,
    vibeTags: ['☕ 2-Minute Cutting Chai', '🫚 Cardamom Ginger Brew', '⚡ Standing Only'],
    mapsUrl: 'https://maps.google.com/?q=Yewale+Amruttulya+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Butter Khari Biscuit Pair',
      description: 'Two golden, flaky bakery khari biscuits to dunk into your piping hot cutting chai.',
      code: 'PALATE-YEWALE-KHARI'
    },
    topDishIds: ['dish-yewale-chai', 'dish-yewale-creambun'],
    skipDishes: [
      {
        id: 'skip-yewale-1',
        name: 'Packaged Upma',
        price: 45,
        reason: 'Microwaved, dry, and bland with rubbery texture; stick strictly to the tea kettle.',
        alternativeRecommendation: 'Steaming Hot Special Cardamom Tea with Khari.'
      }
    ]
  },

  'pop-tates-vashi': {
    id: 'pop-tates-vashi',
    name: 'Pop Tate’s Unplugged',
    area: 'Sector 19, Vashi',
    fullAddress: 'First Floor, Haware Infotech Park, Sector 30A / 19, Vashi',
    distanceMeters: 920,
    walkingMinutes: 12,
    vibeTags: ['🍕 Thin Crust Bar Bites', '🎵 Retro Rock Vibes', '🌙 Late Night Hangout'],
    mapsUrl: 'https://maps.google.com/?q=Pop+Tates+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Loaded Jalapeño Dip',
      description: 'Complimentary molten smoked cheddar dip served alongside your sizzling loaded nachos.',
      code: 'PALATE-POPTATES-DIP'
    },
    topDishIds: ['dish-poptates-nachos', 'dish-poptates-wings'],
    skipDishes: [
      {
        id: 'skip-poptates-1',
        name: 'Sizzling Chocolate Brownie',
        price: 240,
        reason: 'Burned sizzling plate smokes out the vanilla ice cream; brownie has a dense rubbery center.',
        alternativeRecommendation: 'Classic BBQ Glazed Crispy Chicken Wings.'
      }
    ]
  }
};

export const DISHES: Dish[] = [
  // 1. Bhagat Tarachand
  {
    id: 'dish-btc-pavbhaji',
    name: 'Special Amul Butter Pav Bhaji',
    venueId: 'bhagat-tarachand',
    venueName: 'Bhagat Tarachand',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 350,
    walkingMinutes: 4,
    price: 190,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Extra crisp double-roasted pav with rich, dark spiced masala. Don\'t touch the pulav here.',
    detailedReview: 'The defining benchmark for Sector 17 street dining. The bhaji is simmered on heavy cast iron until deeply caramelized, finished with molten Amul butter and hand-crushed roasted cumin. The pavs arrive golden and blistered, perfectly crackling on the outside.',
    category: 'Must-Try Icons',
    flavorTags: ['🧈 High Amul Butter', '🍞 Extra Crisp Pav', '👑 Neighborhood Icon'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask the waiter explicitly for "Kadak Pav" — they fry it 30 seconds longer on the tawa edges.'
  },
  {
    id: 'dish-btc-kutchi-beer',
    name: 'Kutchi Beer (Spiced Buttermilk)',
    venueId: 'bhagat-tarachand',
    venueName: 'Bhagat Tarachand',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 350,
    walkingMinutes: 4,
    price: 85,
    verdict: 'GOD_TIER',
    scorePercent: 95,
    microVerdict: 'Chilled glass bottle chaas with fresh mint, hing & crushed roasted jeera. The ultimate palate refresher.',
    detailedReview: 'Served tongue-in-cheek in a chilled amber beer bottle, this churned buttermilk is thick, tangy, and bursting with black salt, asafetida, and fresh mint leaves. It cuts through buttery bhaji grease instantly.',
    category: 'Quick Bites',
    flavorTags: ['🧊 Ice Chilled', '🌿 Roasted Jeera & Mint', '⚡ Instant Digestif'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Order it before your food arrives so you can sip it as an aperitif while waiting for your table.'
  },
  {
    id: 'dish-btc-sev-tamatar',
    name: 'Kathiyawadi Sev Tamatar',
    venueId: 'bhagat-tarachand',
    venueName: 'Bhagat Tarachand',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 350,
    walkingMinutes: 4,
    price: 180,
    verdict: 'WORTH_IT',
    scorePercent: 88,
    microVerdict: 'Sweet-tangy tomato gravy topped with crunchy ratlami sev. Eat within 2 minutes before sev softens.',
    detailedReview: 'Juicy country tomatoes stewed with ginger and green chilies, finished with a fresh handful of thick Ratlami sev right before landing on the table. Pair with soft Phulkas dripping in pure ghee.',
    category: 'Must-Try Icons',
    flavorTags: ['🍅 Tangy Desi Tomato', '🌶️ Ratlami Sev Crunch', '🧈 Pure Ghee'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for extra sev on the side so you can refresh the crunch throughout the meal.'
  },

  // 2. Morumal Sweets
  {
    id: 'dish-moru-dalpakwan',
    name: 'Sunday Morning Dal Pakwan',
    venueId: 'morumal-sweets',
    venueName: 'Morumal Sweets & Snacks',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 280,
    walkingMinutes: 3,
    price: 110,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    microVerdict: 'Shatteringly crisp cumin pakwan layered with creamy chana dal, raw onions & tamarind drizzle.',
    detailedReview: 'Only served until 11:30 AM before selling out. The pakwan is hand-docked and deep-fried to a golden glass-like crackle. The chana dal is cooked al-dente, seasoned with dried amchur and green chilies, topped with diced red onions.',
    category: 'Must-Try Icons',
    flavorTags: ['✨ Shatter Crisp', '👑 Authentic Sindhi Heritage', '🧅 Raw Onion Crunch'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Reach before 9:45 AM on Sundays; the line stretches around the corner and pakwans run out fast.'
  },
  {
    id: 'dish-moru-sindhikoki',
    name: 'Special Ghee Sindhi Koki',
    venueId: 'morumal-sweets',
    venueName: 'Morumal Sweets & Snacks',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 280,
    walkingMinutes: 3,
    price: 70,
    verdict: 'WORTH_IT',
    scorePercent: 89,
    microVerdict: 'Dense, flaky griddled flatbread stuffed with chopped onions, crushed black pepper & ajwain.',
    detailedReview: 'A breakfast masterpiece. Double rolled with shortening ghee and spiced with cracked peppercorns and carom seeds. Golden brown blistered exterior with a crumbly, melt-in-mouth texture.',
    category: 'Quick Bites',
    flavorTags: ['🧈 Ghee Infused', '🌱 Carom & Black Pepper', '☕ Best with Chai'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Pair with their house raw mango pickle and a cup of ginger tea.'
  },

  // 3. Shree Durga Snacks
  {
    id: 'dish-durga-mysoredosa',
    name: 'Butter Mysore Masala Dosa',
    venueId: 'shree-durga',
    venueName: 'Shree Durga Snacks',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 420,
    walkingMinutes: 5,
    price: 130,
    verdict: 'GOD_TIER',
    scorePercent: 94,
    microVerdict: 'Molten red garlic paste smeared on crisp crepe with warm spiced potato mash.',
    detailedReview: 'The crepe has an unmistakable fermented tang and uniform golden brown crispness. The inside is painted with their signature red chili, roasted chana dal, and garlic paste that delivers a slow, warming heat.',
    category: 'Must-Try Icons',
    flavorTags: ['🧄 Red Garlic Podi', '🧈 Amul Butter Glaze', '🥥 Wet Coconut Chutney'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Always request the coconut chutney unsweetened — their batch freshness is unmatched.'
  },
  {
    id: 'dish-durga-meduvada',
    name: 'Piping Hot Medu Vada Sambhar',
    venueId: 'shree-durga',
    venueName: 'Shree Durga Snacks',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 420,
    walkingMinutes: 5,
    price: 80,
    verdict: 'WORTH_IT',
    scorePercent: 87,
    microVerdict: 'Cloud-soft fermented urad interior encased in a golden, non-greasy crackling donut shell.',
    detailedReview: 'Fried continuously in small batches during peak breakfast and tea hours. The sambhar is light, drumstick-infused, and not excessively sweet like Udipi chains in malls.',
    category: 'Quick Bites',
    flavorTags: ['⚡ Golden Crisp Shell', '🌱 Fresh Curry Leaves', '🥣 Drumstick Sambhar'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for "Sambhar Dip" to have the vadas submerged in boiling hot broth.'
  },

  // 4. Kathi Rolls Corner
  {
    id: 'dish-kathi-doublechicken',
    name: 'Double Chicken Egg Kathi Roll',
    venueId: 'kathi-rolls-corner',
    venueName: 'Kathi Rolls Corner',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 310,
    walkingMinutes: 3,
    price: 180,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Flaky laccha paratha glued to golden egg, stuffed with juicy charred tawa chicken chunks.',
    detailedReview: 'The paratha is kneaded fresh and rolled thin on an inverted cast iron tawa. Marinated chicken chunks are flash-fried with raw green chilies, chaat masala, and crunchy vinegar soaked onions.',
    category: 'Late Night',
    flavorTags: ['🥩 Charred Tawa Chicken', '🧅 Vinegar Pickled Onions', '🌙 Open till 1:30 AM'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Tell the roll master "Bhaiya chilies double, sauce mat daalna" to avoid ketchup ruining the spices.'
  },
  {
    id: 'dish-kathi-bhunamutton',
    name: 'Slow-Cooked Bhuna Mutton Roll',
    venueId: 'kathi-rolls-corner',
    venueName: 'Kathi Rolls Corner',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 310,
    walkingMinutes: 3,
    price: 220,
    verdict: 'WORTH_IT',
    scorePercent: 90,
    microVerdict: 'Shredded tender mutton braised in whole spices wrapped in a crisp egg-washed paratha.',
    detailedReview: 'Rich, peppery mutton shreds that melt effortlessly without chewing. Wrapped tight in foil for easy roadside munching under the neon streetlights.',
    category: 'Late Night',
    flavorTags: ['🥩 Slow Braised Mutton', '🌶️ Cracked Black Pepper', '🔥 Late Night Fuel'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Get it with a cold Thums Up from the adjacent paan kiosk for the classic Vashi night out.'
  },

  // 5. Yum Yum Fusion Dosa Cart
  {
    id: 'dish-yum-jinnydosa',
    name: 'Special Amul Cheese Jinny Dosa',
    venueId: 'yum-yum-dosa',
    venueName: 'Yum Yum Fusion Dosa Cart',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 500,
    walkingMinutes: 6,
    price: 180,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Crispy rolled dosa cylinders filled with molten cheese, capsicum, garlic sauce & butter pool.',
    detailedReview: 'Street food theater at its best. Butter, garlic chutney, schezwan paste, and shredded vegetables are mashed directly on the griddle, rolled tight, sliced into four standing pillars, and buried in shredded Amul cheese.',
    category: 'Spicy',
    flavorTags: ['🧀 Molten Cheese Avalanche', '🧄 Fiery Garlic Glaze', '⚡ High Energy Griddle'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Eat immediately at the counter — after 5 minutes the crispy towers absorb steam and soften.'
  },

  // 6. Tibbs Frankie Original
  {
    id: 'dish-tibbs-mutton',
    name: 'Classic Mutton Frankie with Egg',
    venueId: 'tibbs-frankie',
    venueName: 'Tibbs Frankie Original',
    venueArea: 'Sector 17 Market',
    distanceMeters: 240,
    walkingMinutes: 3,
    price: 170,
    verdict: 'GOD_TIER',
    scorePercent: 95,
    microVerdict: 'The nostalgic Mumbai original. Egg-washed roti dusted with Tibbs secret masala powder.',
    detailedReview: 'Tender spiced minced mutton rolled in a thin maida flatbread sealed with an egg layer. Dusted liberally with the iconic salty, sour, secret frankie spice blend and topped with vinegar-dunked green chilies.',
    category: 'Quick Bites',
    flavorTags: ['🌯 The 1969 Original', '🌶️ Vinegar Chili Pucker', '⚡ 3-Minute Grab'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask the counter guy for "Extra spice powder sprinkle on top" before folding.'
  },

  // 7. Prashant Corner
  {
    id: 'dish-prashant-modak',
    name: 'Fresh Steamed Ukadiche Modak',
    venueId: 'prashant-corner',
    venueName: 'Prashant Corner',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 380,
    walkingMinutes: 4,
    price: 60,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    microVerdict: 'Velvety rice flour casing filled with juicy freshly grated coconut, organic jaggery & nutmeg.',
    detailedReview: 'Steamed fresh multiple times daily. The rice flour skin is gossamer thin and translucent, encasing warm, cardamom-scented freshly grated coconut soaked in melted amber jaggery. Pure bliss.',
    category: 'Sweet Tooth',
    flavorTags: ['🥥 Fresh Grated Coconut', '🍯 Organic Amber Jaggery', '👑 Steamed Royal Treat'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Pour a spoonful of warm pure ghee into the top aperture before taking your first bite.'
  },
  {
    id: 'dish-prashant-ragdapattice',
    name: 'Tawa Roasted Ragda Pattice',
    venueId: 'prashant-corner',
    venueName: 'Prashant Corner',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 380,
    walkingMinutes: 4,
    price: 95,
    verdict: 'WORTH_IT',
    scorePercent: 91,
    microVerdict: 'Golden shallow-fried potato patties submerged in piping hot white vatana stew with saunth chutney.',
    detailedReview: 'Crispy skin on the potato cakes withstands the hot vatana curry. Garnished with finely chopped cilantro, fresh pomegranate pearls, and nylon sev.',
    category: 'Must-Try Icons',
    flavorTags: ['🥔 Golden Crust Patties', '🥣 Warm White Vatana', '🌿 Fresh Coriander Chutney'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Tell them to go heavy on green chutney and light on sweet dates chutney for optimal balance.'
  },

  // 8. Al-Bake Arabian Hub
  {
    id: 'dish-albake-rumalishawarma',
    name: 'Smoked Charcoal Rumali Shawarma',
    venueId: 'al-bake-arabian',
    venueName: 'Al-Bake Arabian Hub',
    venueArea: 'Vashi Plaza, Sector 17',
    distanceMeters: 550,
    walkingMinutes: 7,
    price: 160,
    verdict: 'GOD_TIER',
    scorePercent: 95,
    microVerdict: 'Pure slow-roasted chicken shaved off the vertical spit, wrapped with pungent garlic toum.',
    detailedReview: 'No cabbage fillers, no mayo dilution. Only paper-thin rumali roti wrapped around succulent chicken slices crisped by charcoal heat, laced with pickle batons and creamy garlic sauce.',
    category: 'Late Night',
    flavorTags: ['🥩 Real Charcoal Smoke', '🧄 Pure Garlic Toum', '🌙 Open till 2 AM'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for "Open Plate Shawarma" if you want to dip the meat directly into extra garlic cream.'
  },

  // 9. Appetite Momo Station
  {
    id: 'dish-momo-kurkurechicken',
    name: 'Kurkure Crispy Fried Chicken Momos',
    venueId: 'appetite-momos',
    venueName: 'Appetite Momo Station',
    venueArea: 'Sector 17, Near Real Tech',
    distanceMeters: 480,
    walkingMinutes: 6,
    price: 160,
    verdict: 'GOD_TIER',
    scorePercent: 94,
    microVerdict: 'Loud crunch panko jacket with juicy minced chicken center and incendiary red chili paste.',
    detailedReview: 'Juicy steamed momos coated in seasoned crushed cornflake-panko crust and flash-fried to an audible crunch. The inside stays steaming and moist. The fiery red chutney has serious heat.',
    category: 'Spicy',
    flavorTags: ['⚡ Super Loud Crunch', '🌶️ Incendiary Dalle Sauce', '🍗 Juicy Chicken Core'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Keep a cold beverage handy — their fiery red chutney is not for beginners.'
  },

  // 10. Vashi Fast Food Center (VFF)
  {
    id: 'dish-vff-cheesetoast',
    name: 'Special Cheese Masala Toast Sandwich',
    venueId: 'vashi-fast-food',
    venueName: 'Vashi Fast Food Center (VFF)',
    venueArea: 'Sector 9, Near Vashi Depot',
    distanceMeters: 750,
    walkingMinutes: 9,
    price: 140,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Smoky hand-clamped cast iron grill toast topped with a snowy dome of grated Amul cheese.',
    detailedReview: 'Bread buttered on both sides, loaded with boiled potato masala, onions, beetroot, and capsicum. Grilled in a vintage hand clamp over open flames, then showered in an avalanche of freshly grated cheese and nylon sev.',
    category: 'Must-Try Icons',
    flavorTags: ['🧀 Snowy Amul Cheese Dome', '🔥 Open Flame Clamp Grill', '🥪 Street Toast Icon'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask them to trim the crusts and slice it into 6 pieces for easier sharing.'
  },

  // 11. Mahesh Lunch Home
  {
    id: 'dish-mahesh-surmairava',
    name: 'Mangalorean Surmai Rava Fry',
    venueId: 'mahesh-lunch-home',
    venueName: 'Mahesh Lunch Home',
    venueArea: 'Palm Beach Road, Sec 15',
    distanceMeters: 850,
    walkingMinutes: 11,
    price: 520,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Fresh kingfish steak coated in fiery Byadgi chili marinade and golden semolina crust.',
    detailedReview: 'Direct from the morning catch. The kingfish steak is thick, moist, and flaky under a micro-crisp semolina shell spiced with tamarind, garlic, and authentic Mangalorean red chili paste.',
    category: 'Must-Try Icons',
    flavorTags: ['🐟 Fresh Catch Kingfish', '🌶️ Fiery Byadgi Chili', '✨ Crisp Semolina Shell'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Drizzle fresh lemon wedge immediately while the rava crust is sizzling.'
  },
  {
    id: 'dish-mahesh-buttergarliccrab',
    name: 'Coastal Butter Garlic Crab Meat',
    venueId: 'mahesh-lunch-home',
    venueName: 'Mahesh Lunch Home',
    venueArea: 'Palm Beach Road, Sec 15',
    distanceMeters: 850,
    walkingMinutes: 11,
    price: 680,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Sweet lump mud crab meat swimming in silky golden butter and slow-simmered garlic cloves.',
    detailedReview: 'An iconic coastal indulgence. Tender sweet crab meat tossed gently in clarified butter and sweet mellowed garlic. Best scooped up with paper-thin Neer Dosas.',
    category: 'Must-Try Icons',
    flavorTags: ['🦀 Sweet Mud Crab', '🧄 Mellowed Golden Garlic', '🧈 Decadent Butter Emulsion'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1559742811-822863ccbaee?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Order 3 stacks of Neer Dosa to soak up every drop of the garlic butter emulsion.'
  },

  // 12. Yewale Amruttulya
  {
    id: 'dish-yewale-chai',
    name: 'Kadak Ginger Cardamom Cutting Chai',
    venueId: 'yewale-amruttulya',
    venueName: 'Yewale Amruttulya',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 290,
    walkingMinutes: 3,
    price: 20,
    verdict: 'GOD_TIER',
    scorePercent: 95,
    microVerdict: 'Boiled down full cream milk steeped with crushed ginger and green cardamom. Pure comfort.',
    detailedReview: 'Served piping hot in mini glass cutting cups. The brew is thick, velvety, and naturally sweetened, balancing ginger sting with floral cardamom aroma. Zero bitterness.',
    category: 'Sweet Tooth',
    flavorTags: ['🫚 Crushed Fresh Ginger', '☕ Thick Cream Milk', '⚡ Instant Energy Shot'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for it "Extra Kadak" if you love a sharper ginger punch.'
  },

  // 13. Gupta Sandwich & Juice Bar
  {
    id: 'dish-gupta-bahubali',
    name: 'Bahubali 3-Tier Grilled Sandwich',
    venueId: 'gupta-sandwich',
    venueName: 'Gupta Sandwich & Juice Bar',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 320,
    walkingMinutes: 4,
    price: 190,
    verdict: 'WORTH_IT',
    scorePercent: 88,
    microVerdict: 'Three tiers of spicy aloo, fresh veggies, paneer tikka shreds & molten cheese.',
    detailedReview: 'An absolute beast of a sandwich built for sharing between two people. Perfectly toasted on heavy commercial panini grills with garlic butter and spicy green mint sauce.',
    category: 'Quick Bites',
    flavorTags: ['🥪 Triple Decker', '🧀 Molten Mozzarella', '⚡ Sharing Sized'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Order it half-spicy if eating with family as the chutney layer packs a kick.'
  },

  // 14. Navratna Pure Veg
  {
    id: 'dish-nav-kajucurry',
    name: 'Navratna Special Shahi Kaju Curry',
    venueId: 'navratna-veg',
    venueName: 'Navratna Pure Veg',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 450,
    walkingMinutes: 5,
    price: 260,
    verdict: 'WORTH_IT',
    scorePercent: 89,
    microVerdict: 'Whole roasted cashew nuts simmered in a velvety onion-cashew brown gravy with butter naan.',
    detailedReview: 'Generous quantity of whole golden cashews that still maintain a slight toothsome crunch inside a fragrant, mildly spiced Mughlai-style gravy.',
    category: 'Must-Try Icons',
    flavorTags: ['🌰 Whole Roasted Cashews', '🥘 Creamy Onion Gravy', '🧈 Butter Tandoori Naan'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Pair with Tandoori Garlic Naan to contrast the mild richness of the cashew gravy.'
  },

  // 15. Pop Tate's Unplugged
  {
    id: 'dish-poptates-nachos',
    name: 'Loaded Sizzling Mexican Nachos',
    venueId: 'pop-tates-vashi',
    venueName: 'Pop Tate’s Unplugged',
    venueArea: 'Sector 19, Vashi',
    distanceMeters: 920,
    walkingMinutes: 12,
    price: 290,
    verdict: 'WORTH_IT',
    scorePercent: 86,
    microVerdict: 'Warm corn tortilla chips drowned in house refried beans, pico de gallo, salsa & smoked cheese.',
    detailedReview: 'Arrives piping hot with crisp edges and great cheese coverage that reaches all the way to the bottom layers without getting soggy.',
    category: 'Late Night',
    flavorTags: ['🧀 Smoked Melted Cheese', '🌶️ Spicy Pickled Jalapeños', '🌽 Crisp Tortilla Base'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for the sour cream in a side ramekin to keep the top chips extra crunchy.'
  }
];

export const NEIGHBORHOODS = [
  'Sector 17, Vashi',
  'Vashi Plaza / Sec 17',
  'Arenja Corner, Sec 17',
  'Palm Beach Road, Sec 15',
  'Sector 9, Vashi',
  'Sector 19, Vashi'
];
