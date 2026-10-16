import type { Dish, Venue } from '../types';

export const VENUES: Record<string, Venue> = {
  'bhagat-tarachand': {
    id: 'bhagat-tarachand',
    name: 'Bhagat Tarachand',
    area: 'Arenja Corner, Sec 17',
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
    topDishIds: ['dish-btc-thali', 'dish-btc-pavbhaji', 'dish-btc-kutchi-beer'],
    skipDishes: [
      {
        id: 'skip-btc-1',
        name: 'Veg Hakka Noodles & Manchurian',
        price: 210,
        reason: 'Greasy, overly sweet MSG sauce that contradicts their classic pure vegetarian Punjabi-Sindhi legacy. Strictly an afterthought.',
        alternativeRecommendation: 'Stick to the Special Veg Thali, Sev Tamatar, or Special Amul Pav Bhaji.'
      },
      {
        id: 'skip-btc-2',
        name: 'Tava Veg Pulav',
        price: 180,
        reason: 'Clumpy pre-boiled rice with artificial red food color; dry and lacks genuine tawa punch.',
        alternativeRecommendation: 'Order freshly griddled Kadak Chapati with white makhan.'
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
      description: 'Show voucher to cashier for a complimentary extra round of double-blistered black-pepper pakwan.',
      code: 'PALATE-MORU-PAKWAN'
    },
    topDishIds: ['dish-moru-dalpakwan', 'dish-moru-sindhikoki', 'dish-moru-sevbarfi'],
    skipDishes: [
      {
        id: 'skip-moru-1',
        name: 'Samosa Dahi Chaat',
        price: 60,
        reason: 'Soggy crust drowned in overly sweet supermarket curd; loses all crunch within 30 seconds.',
        alternativeRecommendation: 'Get the fiery Sunday morning Dal Pakwan or fresh hot Sindhi Koki.'
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
      title: 'Show at Counter: Secret Red Garlic Podi Bowl',
      description: 'Unlock their reserve fiery dry-roasted coconut garlic podi chutney bowl with any dosa.',
      code: 'PALATE-DURGA-PODI'
    },
    topDishIds: ['dish-durga-mysoredosa', 'dish-durga-meduvada', 'dish-durga-filtercoffee'],
    skipDishes: [
      {
        id: 'skip-durga-1',
        name: 'Street Pav Bhaji',
        price: 130,
        reason: 'Dull canned tomato paste flavor that lacks street spice aromatics; an afterthought on an authentic South Indian griddle.',
        alternativeRecommendation: 'Order the butter-slathered Mysore Masala Dosa with red garlic paste.'
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
        price: 120,
        reason: 'Rubbery, bland paneer cubes drowned in bottled mint mayonnaise; lacks authentic tandoori charcoal smoke.',
        alternativeRecommendation: 'Go for the Double Chicken Egg Roll with vinegar pickled onions.'
      }
    ]
  },

  'al-bake-arabian': {
    id: 'al-bake-arabian',
    name: 'Al-Bake Arabian Hub',
    area: 'Arenja Corner, Sec 17',
    fullAddress: 'Shop 12, Ground Floor, Vashi Plaza / Arenja Arcade, Sector 17, Vashi',
    distanceMeters: 330,
    walkingMinutes: 4,
    vibeTags: ['🌙 Open Till 2:00 AM', '🥩 Rotating Vertical Spit', '🧄 House-made Garlic Toum'],
    mapsUrl: 'https://maps.google.com/?q=Al+Bake+Shawarma+Vashi+Sector+17',
    counterPerk: {
      title: 'Show at Counter: Free Garlic Toum Extra Dip',
      description: 'Double portion of their velvety authentic Lebanese egg-white garlic toum dip.',
      code: 'PALATE-ALBAKE-TOUM'
    },
    topDishIds: ['dish-albake-rumalishawarma', 'dish-albake-openplate'],
    skipDishes: [
      {
        id: 'skip-albake-1',
        name: 'Falafel Pita Pocket',
        price: 110,
        reason: 'Hard, over-fried dry chickpea patties with thick floury pita pockets; completely lacks tahini moisture.',
        alternativeRecommendation: 'The slow-roasted Charcoal Chicken Shawarma in paper-thin Rumali.'
      }
    ]
  },

  'yum-yum-dosa': {
    id: 'yum-yum-dosa',
    name: 'Yum Yum Fusion Dosa Cart',
    area: 'Sector 17, Vashi',
    fullAddress: 'Near City Center Mall Back Alley, Sector 17, Vashi',
    distanceMeters: 480,
    walkingMinutes: 6,
    vibeTags: ['🧀 Molten Cheese Cascades', '🔥 Late Night Street Eats', '⚡ High Energy Griddle'],
    mapsUrl: 'https://maps.google.com/?q=Yum+Yum+Dosa+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Extra Grated Amul Cheese Crown',
      description: 'Get an avalanche of freshly shredded Amul cheese crowned on your Jinny Dosa roll cuts.',
      code: 'PALATE-YUM-CHEESE'
    },
    topDishIds: ['dish-yum-jinnydosa', 'dish-yum-matkadosa'],
    skipDishes: [
      {
        id: 'skip-yum-1',
        name: 'Plain Sada Dosa',
        price: 70,
        reason: 'Too thick and under-fermented; buying a plain dosa at a high-butter fusion cheese griddle misses the whole point.',
        alternativeRecommendation: 'Amul Cheese Jinny Dosa with spicy-sweet garlic butter glaze.'
      }
    ]
  },

  'tibbs-frankie': {
    id: 'tibbs-frankie',
    name: 'Tibbs Frankie Original',
    area: 'Sector 17 Market',
    fullAddress: 'Shop 7, Sector 17 Main Road Market, Vashi, Navi Mumbai',
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
        price: 110,
        reason: 'Overpowered by artificial liquid cheese spread and syrupy chili sauce; mushy texture.',
        alternativeRecommendation: 'Stick to the classic Mutton Frankie with egg-washed roti.'
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
    topDishIds: ['dish-prashant-modak', 'dish-prashant-ragdapattice'],
    skipDishes: [
      {
        id: 'skip-prashant-1',
        name: 'Nylon Khaman Dhokla',
        price: 60,
        reason: 'Dry center and uneven sugar-water tempering; often cold if bought in the evening.',
        alternativeRecommendation: 'Order the freshly griddled, steaming hot Ragda Pattice.'
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
    vibeTags: ['🥪 Hand Clamp Toasties', '🍉 Cold Pressed Juices', '⚡ Bustling Evening Hangout'],
    mapsUrl: 'https://maps.google.com/?q=Gupta+Sandwich+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Extra Spicy Green Mint Chutney Jar',
      description: 'Fresh portion of spicy mint chutney and crunchy sev toppings.',
      code: 'PALATE-GUPTA-CHUTNEY'
    },
    topDishIds: ['dish-gupta-toastsandwich', 'dish-gupta-maramari'],
    skipDishes: [
      {
        id: 'skip-gupta-1',
        name: 'Cold Coffee with Ice Cream',
        price: 90,
        reason: 'Filled with icy water crystals and overly sugary dairy creamer powder instead of brewed espresso.',
        alternativeRecommendation: 'Fresh Cold Pressed Mara-Mari (Pineapple + Mosambi) Juice with black salt.'
      }
    ]
  },

  'yewale-amruttulya': {
    id: 'yewale-amruttulya',
    name: 'Yewale Amruttulya',
    area: 'Arenja Corner, Sec 17',
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
    topDishIds: ['dish-yewale-chai', 'dish-yewale-bunmaska'],
    skipDishes: [
      {
        id: 'skip-yewale-1',
        name: 'Packaged Ready Upma / Poha',
        price: 35,
        reason: 'Microwaved, dry, and bland with rubbery texture; stick strictly to the tea kettle and bakery buns.',
        alternativeRecommendation: 'Steaming Hot Special Cardamom Tea with salted Khari biscuits.'
      }
    ]
  },

  'appetite-momos': {
    id: 'appetite-momos',
    name: 'Appetite Momo Station',
    area: 'Sector 17, Vashi',
    fullAddress: 'Stall 2, Real Tech Park Lane, Sector 17, Vashi',
    distanceMeters: 450,
    walkingMinutes: 5,
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
        price: 110,
        reason: 'Dense, oily outer jacket with processed cheese spread that solidifies into rubber when cooled.',
        alternativeRecommendation: 'Super crunchy Kurkure Chicken Momos with roasted chili dip.'
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
    vibeTags: ['❄️ AC Family Dining', '🥘 South & North Classics', '🥛 Thick Filter Coffee'],
    mapsUrl: 'https://maps.google.com/?q=Navratna+Pure+Veg+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Saffron Badam Kheer Cup',
      description: 'Show code with any main course order to get a complimentary silver-leaf saffron badam kheer.',
      code: 'PALATE-NAV-KHEER'
    },
    topDishIds: ['dish-nav-ravamasala', 'dish-nav-kajucurry'],
    skipDishes: [
      {
        id: 'skip-nav-1',
        name: 'Veg Manchurian Gravy',
        price: 180,
        reason: 'Cornstarch heavy sludge with spongy dough balls; zero wok breath or ginger punch. Avoid Indo-Chinese at classic Udipi family diners.',
        alternativeRecommendation: 'Rich Kaju Curry with crisp Butter Naan or Golden Rava Dosa.'
      }
    ]
  },

  'hotel-shabari': {
    id: 'hotel-shabari',
    name: 'Hotel Shabari',
    area: 'Sector 17, Vashi',
    fullAddress: 'Plot 32, Sector 17 Center Square, Vashi, Navi Mumbai',
    distanceMeters: 310,
    walkingMinutes: 4,
    vibeTags: ['🦀 Legendary Coastal Seafood', '🌶️ Mangalorean Ghee Roast', '🥥 Silky Neer Dosas'],
    mapsUrl: 'https://maps.google.com/?q=Hotel+Shabari+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Sol Kadhi Shot',
      description: 'Authentic freshly pressed kokum and coconut milk digestive shot to begin your coastal meal.',
      code: 'PALATE-SHABARI-SOL'
    },
    topDishIds: ['dish-shabari-surmairava', 'dish-shabari-neerdosa-gheeroast'],
    skipDishes: [
      {
        id: 'skip-shabari-1',
        name: 'Chicken Dum Biryani',
        price: 260,
        reason: 'Lacks fragrant aromatics; rice grains are dry and meat feels reheated. Avoid non-coastal items.',
        alternativeRecommendation: 'Order 3 stacks of Neer Dosa with spicy Chicken or Prawns Ghee Roast.'
      }
    ]
  },

  'natural-icecream': {
    id: 'natural-icecream',
    name: 'Natural Ice Cream',
    area: 'Sector 17 Market',
    fullAddress: 'Shop 4, Sector 17 Market Road, Vashi, Navi Mumbai',
    distanceMeters: 260,
    walkingMinutes: 3,
    vibeTags: ['🥥 Fresh Fruit Artisans', '🍨 100% Real Milk & Cream', '👑 Vashi Post-Dinner Ritual'],
    mapsUrl: 'https://maps.google.com/?q=Natural+Ice+Cream+Sector+17+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Waffle Cone Upgrade',
      description: 'Upgrade any single or double seasonal fruit scoop to a freshly baked crisp waffle cone.',
      code: 'PALATE-NATURAL-WAFFLE'
    },
    topDishIds: ['dish-natural-tendercoconut', 'dish-natural-sitaphal'],
    skipDishes: [
      {
        id: 'skip-natural-1',
        name: 'Choco Bite / Generic Chocolate Scoop',
        price: 85,
        reason: 'Standard cocoa flavor. Coming to Natural Ice Cream for chocolate instead of seasonal fresh fruit is the quintessential rookie mistake.',
        alternativeRecommendation: 'Fresh Tender Coconut (Malai) or seasonal Sitaphal / Mango.'
      }
    ]
  },

  'arenja-midnight-pavbhaji': {
    id: 'arenja-midnight-pavbhaji',
    name: 'Arenja Midnight Pav Bhaji Corner',
    area: 'Arenja Corner, Sec 17',
    fullAddress: 'Opposite Arenja Tower, Sector 17, Vashi, Navi Mumbai',
    distanceMeters: 360,
    walkingMinutes: 4,
    vibeTags: ['🌙 Open Till 2:30 AM', '🧈 Half Slab Amul Butter', '🔥 Giant Cast Iron Tawa'],
    mapsUrl: 'https://maps.google.com/?q=Arenja+Corner+Pav+Bhaji+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Kadak Masala Pav Pair',
      description: 'Show code for an extra pair of pavs griddled in hot red garlic bhaji butter.',
      code: 'PALATE-ARENJA-PAV'
    },
    topDishIds: ['dish-arenja-blackpavbhaji', 'dish-arenja-masalapav'],
    skipDishes: [
      {
        id: 'skip-arenja-1',
        name: 'Tawa Veg Pulav',
        price: 150,
        reason: 'Pre-cooked basmati tossed with artificial red food color; dry and lacking wok char.',
        alternativeRecommendation: 'Stick to the Midnight Special Black Masala Pav Bhaji.'
      }
    ]
  },

  // 11. Shiv Krupa Farsan & Jalebi (Sector 9 Vashi)
  'shiv-krupa-farsan': {
    id: 'shiv-krupa-farsan',
    name: 'Shiv Krupa Farsan & Sweets',
    area: 'Sector 9 Food Street',
    fullAddress: 'Shop 12, Sector 9 Market Lane, Vashi, Navi Mumbai',
    distanceMeters: 620,
    walkingMinutes: 8,
    vibeTags: ['🌅 7:00 AM Morning Rush', '🍯 Piping Hot Kesar Jalebis', '⚡ Authentic Gujarati Farsan'],
    mapsUrl: 'https://maps.google.com/?q=Shiv+Krupa+Farsan+Sector+9+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Papaya Sambharo Bowl',
      description: 'Show code with any 250g jalebi or fafda order for a complimentary spiced raw papaya & kadhi bowl.',
      code: 'PALATE-SHIV-SAMBHARO'
    },
    topDishIds: ['dish-shiv-jalebi-fafda', 'dish-shiv-khaman'],
    skipDishes: [
      {
        id: 'skip-shiv-1',
        name: 'Samosa Chaat',
        price: 65,
        reason: 'Pre-fried samosa crushed under cold sweetened curd; gets limp in seconds.',
        alternativeRecommendation: 'Stick to hot golden Kesar Jalebi with wafer-thin crispy Fafda.'
      }
    ]
  },

  // 12. Sector 9 Khau Galli Frankies (Sector 9 Vashi)
  'sec9-frankie-corner': {
    id: 'sec9-frankie-corner',
    name: 'Sector 9 Khau Galli Frankies',
    area: 'Sector 9 Food Street',
    fullAddress: 'Khau Galli, Near Shabari Corner, Sector 9, Vashi',
    distanceMeters: 680,
    walkingMinutes: 9,
    vibeTags: ['🌯 Flaky Egg Paratha Wraps', '🔥 Chatpata Secret Masala', '🌙 Late Night Khau Galli'],
    mapsUrl: 'https://maps.google.com/?q=Sector+9+Khau+Galli+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Double Egg / Cheese Grating',
      description: 'Upgrade any chicken or mutton roll to double egg or melted Amul cheese layer.',
      code: 'PALATE-SEC9-CHEESE'
    },
    topDishIds: ['dish-sec9-mutton-frankie', 'dish-sec9-paneer-frankie'],
    skipDishes: [
      {
        id: 'skip-sec9-1',
        name: 'Schezwan Cheese Mayo Frankie',
        price: 140,
        reason: 'Bottled sweet sour schezwan sauce drowns all meat and masala flavor.',
        alternativeRecommendation: 'Authentic Mutton Bhuna Masala or Tawa Paneer Tikka Frankie.'
      }
    ]
  },

  // 13. Arenja Midnight Egg & Bhurji King (Arenja Corner Evening)
  'arenja-midnight-bhurji': {
    id: 'arenja-midnight-bhurji',
    name: 'Arenja Midnight Egg & Bhurji King',
    area: 'Arenja Corner Evening',
    fullAddress: 'Arenja Arcade Corner, Sector 17 / Arenja Junction, Vashi',
    distanceMeters: 380,
    walkingMinutes: 4,
    vibeTags: ['🌙 Open Till 3:00 AM', '🍳 4-Egg Giant Tawa Boil Bhurji', '🧈 Drenched in Amul Makhan'],
    mapsUrl: 'https://maps.google.com/?q=Arenja+Corner+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Extra Buttery Kadak Pav Pair',
      description: 'Complimentary pair of extra toasted butter pavs to wipe clean your bhurji plate.',
      code: 'PALATE-ARENJA-BHURJI-PAV'
    },
    topDishIds: ['dish-arenja-bhurji', 'dish-arenja-egg-ghotala'],
    skipDishes: [
      {
        id: 'skip-arenja-bhurji-1',
        name: 'Plain Boiled Egg Plate',
        price: 40,
        reason: 'Cold hard yolks sprinkled with generic salt; total disservice to an artisan tawa cart.',
        alternativeRecommendation: 'Get the legendary 4-Egg Butter Boil Bhurji with green thecha.'
      }
    ]
  },

  // 14. The Royal Shawarma Cart (Arenja Evening)
  'royal-shawarma-cart': {
    id: 'royal-shawarma-cart',
    name: 'The Royal Charcoal Shawarma',
    area: 'Arenja Corner Evening',
    fullAddress: 'Opposite Arenja Plaza, Sector 17, Vashi',
    distanceMeters: 340,
    walkingMinutes: 4,
    vibeTags: ['🍗 Vertical Spit Rotisserie', '🧄 Hand-Whipped Garlic Toum', '🌙 Post-Midnight Crowds'],
    mapsUrl: 'https://maps.google.com/?q=Arenja+Corner+Vashi',
    counterPerk: {
      title: 'Show at Counter: Free Extra Lebanese Toum Tub',
      description: 'Free extra tub of whipped garlic toum and pickled beetroot with your open plate.',
      code: 'PALATE-ROYAL-TOUM'
    },
    topDishIds: ['dish-royal-open-shawarma'],
    skipDishes: [
      {
        id: 'skip-royal-1',
        name: 'Crispy Chicken Mayo Burger',
        price: 110,
        reason: 'Frozen factory breaded patty; completely misses the authentic charcoal rotisserie magic.',
        alternativeRecommendation: 'Smoked Charcoal Chicken Open Shawarma Plate with garlic toum.'
      }
    ]
  },

  // 15. Sai Krupa Udupi Restaurant (Sector 19 Nerul)
  'sai-krupa-nerul': {
    id: 'sai-krupa-nerul',
    name: 'Sai Krupa Udupi Restaurant',
    area: 'Nerul Food Corridor',
    fullAddress: 'Plot 18, Sector 19, Near Nerul Railway Station (East), Navi Mumbai',
    distanceMeters: 2800,
    walkingMinutes: 28,
    vibeTags: ['🥞 Giant Karnataka Thatte Idli', '🧈 Sizzling Podi Ghee', '☕ Authentic Decoction Coffee'],
    mapsUrl: 'https://maps.google.com/?q=Sai+Krupa+Restaurant+Sector+19+Nerul',
    counterPerk: {
      title: 'Show at Counter: Extra Hot Desi Ghee Ladle',
      description: 'Show voucher for an extra ladle of smoking desi ghee and podi over your Thatte Idli.',
      code: 'PALATE-SAI-GHEE'
    },
    topDishIds: ['dish-sai-thatte-idli', 'dish-sai-benne-dosa'],
    skipDishes: [
      {
        id: 'skip-sai-1',
        name: 'Veg Dum Biryani',
        price: 170,
        reason: 'Dry rice grains tossed with canned peas and carrots; no dum aroma.',
        alternativeRecommendation: 'Stick strictly to Karnataka Thatte Idli or Davangere Benne Dosa.'
      }
    ]
  },

  // 16. Shri Krishna Kolhapuri Misal (Nerul)
  'shri-krishna-misal-nerul': {
    id: 'shri-krishna-misal-nerul',
    name: 'Shri Krishna Kolhapuri Misal',
    area: 'Nerul Food Corridor',
    fullAddress: 'Shop 5, Sector 15 Food Lane, Near LP Junction, Nerul',
    distanceMeters: 3100,
    walkingMinutes: 32,
    vibeTags: ['🌶️ Spicy Kolhapuri Kat', '🥣 Crispy Farsan Crunch', '👑 Morning Breakfast Destination'],
    mapsUrl: 'https://maps.google.com/?q=Shri+Krishna+Misal+Nerul',
    counterPerk: {
      title: 'Show at Counter: Free Extra Farsan & Tarri Bowl',
      description: 'Unlimited piping hot spicy tarri gravy and a complimentary crunchy farsan refill.',
      code: 'PALATE-MISAL-TARRI'
    },
    topDishIds: ['dish-krishna-misal'],
    skipDishes: [
      {
        id: 'skip-krishna-1',
        name: 'Kanda Poha',
        price: 40,
        reason: 'Pre-made batch kept in tray; dries out into bland flakes after 10 AM.',
        alternativeRecommendation: 'Fiery Kolhapuri Kat Misal with double butter pav & chilled dahi.'
      }
    ]
  },

  // 17. LP Junction Charcoal Tandoor (Nerul)
  'lp-junction-grill': {
    id: 'lp-junction-grill',
    name: 'LP Junction Charcoal Tandoor & Rolls',
    area: 'Nerul Food Corridor',
    fullAddress: 'Opposite LP Complex, Sion-Panvel Highway, Nerul, Navi Mumbai',
    distanceMeters: 3400,
    walkingMinutes: 35,
    vibeTags: ['🔥 Open Pit Live Charcoal', '🍗 Overnight Malai Marinade', '🌙 Highway Late Night'],
    mapsUrl: 'https://maps.google.com/?q=LP+Junction+Nerul',
    counterPerk: {
      title: 'Show at Counter: Free Mint Chutney & Butter Rumali Refill',
      description: 'Complimentary hot butter rumali roti and signature mint-coriander dip refill.',
      code: 'PALATE-LP-CHUTNEY'
    },
    topDishIds: ['dish-lp-malai-tikka'],
    skipDishes: [
      {
        id: 'skip-lp-1',
        name: 'Boneless Chilli Chicken Gravy',
        price: 190,
        reason: 'Cornstarch heavy soy sauce glaze over rubbery chicken nuggets.',
        alternativeRecommendation: 'Juicy Charcoal Grilled Tandoori Malai Chicken Tikka.'
      }
    ]
  },

  // 18. Durga Coastal Delights (CBD Belapur Sector 15)
  'durga-coastal-cbd': {
    id: 'durga-coastal-cbd',
    name: 'Durga Coastal Delights',
    area: 'CBD Belapur Strip',
    fullAddress: 'Plot 44, Sector 15 Cafe Strip, CBD Belapur, Navi Mumbai',
    distanceMeters: 5500,
    walkingMinutes: 55,
    vibeTags: ['🦀 Authentic Mangalorean Curry', '🥥 Hand-Pressed Coconut Milk', '🌶️ Byadagi Red Chilli'],
    mapsUrl: 'https://maps.google.com/?q=CBD+Belapur+Sector+15+Food+Strip',
    counterPerk: {
      title: 'Show at Counter: Free Chilled Kokum Sol Kadhi Shot',
      description: 'Complimentary freshly prepared coconut kokum digestive shot with your meal.',
      code: 'PALATE-CBD-SOLKADHI'
    },
    topDishIds: ['dish-cbd-kori-rotti', 'dish-cbd-surmai-tawa'],
    skipDishes: [
      {
        id: 'skip-cbd-durga-1',
        name: 'Veg Fried Rice with Manchurian',
        price: 180,
        reason: 'Soggy cafeteria-style fried rice that misses the glory of fresh coastal cooking.',
        alternativeRecommendation: 'Crisp hand-crumbled Kori Rotti with Kundapur Chicken Curry.'
      }
    ]
  },

  // 19. Vada Pav Samrat (CBD Belapur Station)
  'vada-pav-samrat-belapur': {
    id: 'vada-pav-samrat-belapur',
    name: 'Vada Pav Samrat',
    area: 'CBD Belapur Strip',
    fullAddress: 'Stall 4, Station Khau Galli, CBD Belapur, Navi Mumbai',
    distanceMeters: 5200,
    walkingMinutes: 50,
    vibeTags: ['🥔 Ulta Vada Pav Special', '🧄 Roasted Garlic Thecha', '⚡ 30-Second Rush Grab'],
    mapsUrl: 'https://maps.google.com/?q=Belapur+Station+Khau+Galli',
    counterPerk: {
      title: 'Show at Counter: Extra Garlic Thecha & Fried Chillies',
      description: 'Double scoop of crunchy fiery dry peanut-garlic thecha and salted fried chillies.',
      code: 'PALATE-SAMRAT-THECHA'
    },
    topDishIds: ['dish-samrat-ulta-vadapav'],
    skipDishes: [
      {
        id: 'skip-samrat-1',
        name: 'Bread Pakora',
        price: 30,
        reason: 'Spongy sandwich bread heavily soaked in residual kadai oil.',
        alternativeRecommendation: 'Hot Ulta Vada Pav with dry garlic thecha right out of bubbling oil.'
      }
    ]
  }
};

export const DISHES: Dish[] = [
  // 1. Bhagat Tarachand
  {
    id: 'dish-btc-thali',
    name: 'Special Veg Thali with Kutchi Chaas',
    venueId: 'bhagat-tarachand',
    venueName: 'Bhagat Tarachand',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 350,
    walkingMinutes: 4,
    price: 260,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    microVerdict: 'Pure ghee thali, kadak chapati with white makhan, kachori, paneer sabzi & chilled kutchi beer chaas.',
    detailedReview: 'The quintessential Vashi feast. Served in glistening brass plates, the thali comes loaded with piping hot Kadak Phulkas dripping in pure white butter, spiced dal fry, seasonal vegetable, crisp kachori, and their signature amber beer bottle buttermilk. Unbeatable value and comfort.',
    category: 'Must-Try Icons',
    flavorTags: ['🧈 Pure Ghee', '🍞 Kadak Chapati & Makhan', '👑 Vashi Legend'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask the captain for "Kadak Roti" so they toast your chapatis extra crisp directly on the tawa.'
  },
  {
    id: 'dish-btc-pavbhaji',
    name: 'Special Amul Butter Pav Bhaji',
    venueId: 'bhagat-tarachand',
    venueName: 'Bhagat Tarachand',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 350,
    walkingMinutes: 4,
    price: 150,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Extra crisp double-roasted pav with rich, dark spiced masala. Don\'t order Chinese or pulav here.',
    detailedReview: 'Simmered slowly on heavy cast iron until deeply caramelized, finished with molten Amul butter and hand-crushed roasted cumin. The pavs arrive golden and blistered, perfectly crackling on the outside.',
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
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 350,
    walkingMinutes: 4,
    price: 50,
    verdict: 'GOD_TIER',
    scorePercent: 95,
    microVerdict: 'Chilled glass bottle chaas with fresh mint, hing & crushed roasted jeera. The ultimate palate cleanser.',
    detailedReview: 'Served tongue-in-cheek in a chilled amber beer bottle, this churned buttermilk is thick, tangy, and bursting with black salt, asafetida, and fresh mint leaves. It cuts through buttery grease instantly.',
    category: 'Quick Bites',
    flavorTags: ['🧊 Ice Chilled', '🌿 Roasted Jeera & Mint', '⚡ Instant Digestif'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Order it before your food arrives so you can sip it as an aperitif while waiting for your table.'
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
    price: 70,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    microVerdict: 'Shatteringly crisp cumin pakwan layered with creamy chana dal, raw onions & tamarind drizzle.',
    detailedReview: 'Only served until 11:00 AM before selling out. The pakwan is hand-docked and deep-fried to a golden glass-like crackle. The chana dal is cooked al-dente, seasoned with dried amchur and green chilies, topped with diced red onions.',
    category: 'Must-Try Icons',
    flavorTags: ['✨ Shatter Crisp', '👑 Authentic Sindhi Heritage', '🧅 Raw Onion Crunch'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Reach before 9:45 AM on Sundays; the crowd swells and pakwans run out fast.'
  },
  {
    id: 'dish-moru-sindhikoki',
    name: 'Special Ghee Sindhi Koki',
    venueId: 'morumal-sweets',
    venueName: 'Morumal Sweets & Snacks',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 280,
    walkingMinutes: 3,
    price: 50,
    verdict: 'WORTH_IT',
    scorePercent: 89,
    microVerdict: 'Dense, flaky griddled flatbread stuffed with chopped onions, crushed black pepper & ajwain.',
    detailedReview: 'A Sindhi breakfast classic. Double rolled with shortening ghee and spiced with cracked peppercorns and carom seeds. Golden brown blistered exterior with a crumbly, melt-in-mouth texture.',
    category: 'Quick Bites',
    flavorTags: ['🧈 Ghee Infused', '🌱 Carom & Black Pepper', '☕ Best with Chai'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Pair with their house raw mango pickle and a cup of cutting chai.'
  },
  {
    id: 'dish-moru-sevbarfi',
    name: 'Signature Singhar Ji Mithai (Sev Barfi)',
    venueId: 'morumal-sweets',
    venueName: 'Morumal Sweets & Snacks',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 280,
    walkingMinutes: 3,
    price: 60,
    verdict: 'GOD_TIER',
    scorePercent: 94,
    microVerdict: 'Rich, melt-in-mouth Sindhi fudge made of unsalted sev, thickened mawa, rose water & cardamom.',
    detailedReview: 'Crafted following decades-old Sindhi tradition. The unsalted gram flour vermicelli is slow-cooked in whole milk solids and sugar syrup, creating a distinct fudgy chew finished with slivered pistachios.',
    category: 'Sweet Tooth',
    flavorTags: ['🥮 Pure Mawa Chew', '🌹 Rose & Cardamom', '👑 Sindhi Specialty'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for pieces cut from the center of the fresh morning batch for the softest texture.'
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
    price: 110,
    verdict: 'GOD_TIER',
    scorePercent: 95,
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
    name: 'Piping Hot Medu Vada Dip',
    venueId: 'shree-durga',
    venueName: 'Shree Durga Snacks',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 420,
    walkingMinutes: 5,
    price: 50,
    verdict: 'GOD_TIER',
    scorePercent: 94,
    microVerdict: 'Feather-light fermented urad interior encased in a golden crackling shell submerged in drumstick sambhar.',
    detailedReview: 'Fried continuously in small batches during peak breakfast hours. The exterior stays audibly crisp even while soaking in boiling hot, drumstick-infused sambhar.',
    category: 'Quick Bites',
    flavorTags: ['⚡ Golden Crisp Shell', '🌱 Fresh Curry Leaves', '🥣 Drumstick Sambhar'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for "Sambhar Dip" to have the vadas submerged directly in a boiling bowl of sambhar.'
  },
  {
    id: 'dish-durga-filtercoffee',
    name: 'Strong Degree Filter Coffee',
    venueId: 'shree-durga',
    venueName: 'Shree Durga Snacks',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 420,
    walkingMinutes: 5,
    price: 40,
    verdict: 'WORTH_IT',
    scorePercent: 92,
    microVerdict: 'Chicory-rich decoction poured back and forth from brass tumbler with dense milk foam froth.',
    detailedReview: 'Freshly brewed South Indian filter coffee with an intense aroma, strong chicory spine, and velvet-smooth froth. The quintessential morning fuel.',
    category: 'Quick Bites',
    flavorTags: ['☕ Chicory Decoction', '🥛 Frothy Milk Head', '⚡ Morning Energizer'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Drink it immediately while the foam is towering over the brass tumbler rim.'
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
    price: 140,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Flaky laccha paratha glued to golden egg, stuffed with juicy charred tawa chicken chunks.',
    detailedReview: 'The paratha is kneaded fresh and rolled thin on an inverted cast iron tawa. Marinated chicken chunks are flash-fried with raw green chilies, chaat masala, and crunchy vinegar soaked onions.',
    category: 'Late Night',
    flavorTags: ['🥩 Charred Tawa Chicken', '🧅 Vinegar Pickled Onions', '🌙 Open till 1:30 AM'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Tell the roll master "Bhaiya chilies double, ketchup mat daalna" to avoid sweet sauce ruining the spices.'
  },
  {
    id: 'dish-kathi-bhunamutton',
    name: 'Slow-Cooked Bhuna Mutton Roll',
    venueId: 'kathi-rolls-corner',
    venueName: 'Kathi Rolls Corner',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 310,
    walkingMinutes: 3,
    price: 180,
    verdict: 'WORTH_IT',
    scorePercent: 90,
    microVerdict: 'Shredded tender mutton braised in whole spices wrapped in a crisp egg-washed paratha.',
    detailedReview: 'Rich, peppery mutton shreds that melt effortlessly without chewing. Wrapped tight in foil for easy roadside munching under the neon streetlights.',
    category: 'Late Night',
    flavorTags: ['🥩 Slow Braised Mutton', '🌶️ Cracked Black Pepper', '🔥 Late Night Fuel'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Get it with a chilled Thums Up from the adjacent stall for the quintessential Vashi night-out ritual.'
  },

  // 5. Al-Bake Arabian Hub
  {
    id: 'dish-albake-rumalishawarma',
    name: 'Smoked Charcoal Rumali Shawarma',
    venueId: 'al-bake-arabian',
    venueName: 'Al-Bake Arabian Hub',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 330,
    walkingMinutes: 4,
    price: 130,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Pure slow-roasted chicken shaved off the vertical spit, wrapped with pungent garlic toum.',
    detailedReview: 'No shredded cabbage fillers, no mayonnaise dilution. Pure chicken slices crisping over charcoal heat, wrapped in translucent rumali with pickled turnip batons and house garlic toum.',
    category: 'Late Night',
    flavorTags: ['🥩 Real Charcoal Smoke', '🧄 Pure Garlic Toum', '🌙 Open till 2 AM'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Tell them "Extra Garlic Toum, no cabbage" to get the purist Middle-Eastern flavor profile.'
  },
  {
    id: 'dish-albake-openplate',
    name: 'Open Plate Chicken Shawarma Platter',
    venueId: 'al-bake-arabian',
    venueName: 'Al-Bake Arabian Hub',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 330,
    walkingMinutes: 4,
    price: 180,
    verdict: 'GOD_TIER',
    scorePercent: 94,
    microVerdict: 'Heaping mound of shaved spit chicken served with 2 fresh kuboos, pickled veggies & garlic dip bowl.',
    detailedReview: 'Perfect for dining at the standing tables. You get a double portion of juicy spit chicken, charred on edges, ready to dip directly into an overflowing tub of garlic toum.',
    category: 'Must-Try Icons',
    flavorTags: ['🥩 Double Chicken Portion', '🫓 Warm Fluffy Kuboos', '🧄 Velvet Garlic Dip'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Drizzle the spicy pickled chili oil over the meat before wrapping into kuboos.'
  },

  // 6. Yum Yum Fusion Dosa Cart
  {
    id: 'dish-yum-jinnydosa',
    name: 'Special Amul Cheese Jinny Dosa',
    venueId: 'yum-yum-dosa',
    venueName: 'Yum Yum Fusion Dosa Cart',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 480,
    walkingMinutes: 6,
    price: 150,
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
  {
    id: 'dish-yum-matkadosa',
    name: 'Cheese Matka Gravy Dosa',
    venueId: 'yum-yum-dosa',
    venueName: 'Yum Yum Fusion Dosa Cart',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 480,
    walkingMinutes: 6,
    price: 160,
    verdict: 'WORTH_IT',
    scorePercent: 90,
    microVerdict: 'Bubbling terracotta pot filled with spiced buttery cheese gravy served with 3 crisp dosa cones.',
    detailedReview: 'Simmered in an earthen pot right on the tawa. The gravy is rich with butter, paneer, and schezwan spices, meant for tearing and dipping the wafer-thin dosa cones.',
    category: 'Must-Try Icons',
    flavorTags: ['🏺 Terracotta Clay Pot', '🧀 Molten Butter Gravy', '🍦 Wafer Dosa Cones'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Dunk the cones fast before the bubbling cheese skin hardens.'
  },

  // 7. Tibbs Frankie Original
  {
    id: 'dish-tibbs-mutton',
    name: 'Classic Mutton Frankie with Egg',
    venueId: 'tibbs-frankie',
    venueName: 'Tibbs Frankie Original',
    venueArea: 'Sector 17 Market',
    distanceMeters: 240,
    walkingMinutes: 3,
    price: 140,
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
  {
    id: 'dish-tibbs-bbqchicken',
    name: 'Tangy Chicken Frankie with Egg',
    venueId: 'tibbs-frankie',
    venueName: 'Tibbs Frankie Original',
    venueArea: 'Sector 17 Market',
    distanceMeters: 240,
    walkingMinutes: 3,
    price: 120,
    verdict: 'WORTH_IT',
    scorePercent: 91,
    microVerdict: 'Shredded chicken boti in spiced gravy with chopped red onions and vinegar chilies inside egg wrap.',
    detailedReview: 'A staple after-school and after-work snack in Sector 17. The chicken stays tender, accented by the crunch of raw onions and the sharp kick of pickled green chilies.',
    category: 'Quick Bites',
    flavorTags: ['🍗 Spiced Chicken Boti', '🧅 Raw Onion Crunch', '🌯 Hot Foil Wrap'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Request extra pickled chilies for maximum tang.'
  },

  // 8. Prashant Corner
  {
    id: 'dish-prashant-modak',
    name: 'Fresh Steamed Ukadiche Modak',
    venueId: 'prashant-corner',
    venueName: 'Prashant Corner',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 380,
    walkingMinutes: 4,
    price: 50,
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
    price: 65,
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

  // 9. Gupta Sandwich & Juice Bar
  {
    id: 'dish-gupta-toastsandwich',
    name: 'Special Toast Masala Cheese Sandwich',
    venueId: 'gupta-sandwich',
    venueName: 'Gupta Sandwich & Juice Bar',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 320,
    walkingMinutes: 4,
    price: 90,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Smoky hand-clamped cast iron grill toast topped with a snowy dome of grated Amul cheese.',
    detailedReview: 'Bread buttered on both sides, loaded with boiled potato masala, onions, beetroot, and capsicum. Grilled in a vintage hand clamp over open flames, then showered in an avalanche of freshly grated cheese and nylon sev.',
    category: 'Must-Try Icons',
    flavorTags: ['🧀 Snowy Amul Cheese Dome', '🔥 Open Flame Clamp Grill', '🥪 Street Toast Icon'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask them to trim the crusts and slice it into 6 bite-sized pieces for optimal sharing.'
  },
  {
    id: 'dish-gupta-maramari',
    name: 'Fresh Cold-Pressed Mara-Mari Juice',
    venueId: 'gupta-sandwich',
    venueName: 'Gupta Sandwich & Juice Bar',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 320,
    walkingMinutes: 4,
    price: 70,
    verdict: 'GOD_TIER',
    scorePercent: 94,
    microVerdict: 'Sweet mosambi & tart pineapple freshly pressed together with black salt & roasted jeera.',
    detailedReview: 'Pressed on demand without added sugar or ice dilution. The blend balances sweet citrus with refreshing pineapple acidity, seasoned with black rock salt.',
    category: 'Quick Bites',
    flavorTags: ['🍍 Tart Pineapple Press', '🍊 Sweet Mosambi Juice', '🧂 Black Salt Kick'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Always order "Bina Barf" (no ice) to enjoy the pure 100% cold-pressed fruit nectar.'
  },

  // 10. Yewale Amruttulya
  {
    id: 'dish-yewale-chai',
    name: 'Kadak Ginger Cardamom Cutting Chai',
    venueId: 'yewale-amruttulya',
    venueName: 'Yewale Amruttulya',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 290,
    walkingMinutes: 3,
    price: 15,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Boiled down full cream milk steeped with crushed ginger and green cardamom. Pure comfort.',
    detailedReview: 'Served piping hot in mini glass cutting cups. The brew is thick, velvety, and naturally sweetened, balancing ginger sting with floral cardamom aroma. Zero bitterness.',
    category: 'Sweet Tooth',
    flavorTags: ['🫚 Crushed Fresh Ginger', '☕ Thick Cream Milk', '⚡ Instant Energy Shot'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for it "Extra Kadak" if you want a sharper ginger sting.'
  },
  {
    id: 'dish-yewale-bunmaska',
    name: 'Fresh Bun Maska with Amul Butter',
    venueId: 'yewale-amruttulya',
    venueName: 'Yewale Amruttulya',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 290,
    walkingMinutes: 3,
    price: 30,
    verdict: 'WORTH_IT',
    scorePercent: 91,
    microVerdict: 'Ultra-soft local bakery bun sliced open and layered thick with salted Amul butter for dunking.',
    detailedReview: 'Pillowy soft bun slathered with refrigerated salted butter that slowly melts when dunked into boiling hot cardamom tea.',
    category: 'Quick Bites',
    flavorTags: ['🧈 Salted Amul Butter', '🍞 Soft Bakery Bun', '☕ Dunking Perfection'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Dunk only half of the slice so the crust stays intact while soaking up tea.'
  },

  // 11. Appetite Momo Station
  {
    id: 'dish-momo-kurkurechicken',
    name: 'Kurkure Crispy Fried Chicken Momos',
    venueId: 'appetite-momos',
    venueName: 'Appetite Momo Station',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 450,
    walkingMinutes: 5,
    price: 130,
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
  {
    id: 'dish-momo-steamedchicken',
    name: 'Classic Steamed Chicken Momos',
    venueId: 'appetite-momos',
    venueName: 'Appetite Momo Station',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 450,
    walkingMinutes: 5,
    price: 100,
    verdict: 'WORTH_IT',
    scorePercent: 90,
    microVerdict: 'Thin gossamer dumpling skin bursting with coriander and scallion spiced chicken broth.',
    detailedReview: 'Served piping hot in traditional aluminum steamers. The casing is thin and supple, holding together seasoned minced chicken and aromatics that release savoury juices on first bite.',
    category: 'Quick Bites',
    flavorTags: ['🥟 Thin Gossamer Skin', '🍗 Steaming Broth Pocket', '🌱 Fresh Scallions'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Dip halfway in mayonnaise first to coat your tongue before hitting the red chili paste.'
  },

  // 12. Navratna Pure Veg
  {
    id: 'dish-nav-ravamasala',
    name: 'Butter Rava Mysore Masala Dosa',
    venueId: 'navratna-veg',
    venueName: 'Navratna Pure Veg',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 450,
    walkingMinutes: 5,
    price: 130,
    verdict: 'GOD_TIER',
    scorePercent: 95,
    microVerdict: 'Golden semolina web laced with roasted cashews, curry leaves & fiery red garlic chutney.',
    detailedReview: 'Pouring the watery rava batter on smoking hot cast iron creates an intricate crispy lace. Golden fried cashews, whole cumin, and cracked black pepper are embedded in the lattice, lined with spiced potato mash.',
    category: 'Must-Try Icons',
    flavorTags: ['✨ Golden Semolina Lace', '🌰 Roasted Whole Cashews', '🧄 Red Garlic Podi'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Tell the captain "Rava extra kadak roast" to guarantee maximum wafer crunch.'
  },
  {
    id: 'dish-nav-kajucurry',
    name: 'Navratna Special Shahi Kaju Curry',
    venueId: 'navratna-veg',
    venueName: 'Navratna Pure Veg',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 450,
    walkingMinutes: 5,
    price: 240,
    verdict: 'WORTH_IT',
    scorePercent: 89,
    microVerdict: 'Whole roasted cashew nuts simmered in a velvety onion-cashew brown gravy with butter naan.',
    detailedReview: 'Generous quantity of whole golden cashews that maintain a toothsome crunch inside a fragrant, mildly spiced Mughlai-style gravy.',
    category: 'Must-Try Icons',
    flavorTags: ['🌰 Whole Roasted Cashews', '🥘 Creamy Onion Gravy', '🧈 Butter Tandoori Naan'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Pair with Tandoori Garlic Naan to contrast the rich sweetness of the cashew gravy.'
  },

  // 13. Hotel Shabari
  {
    id: 'dish-shabari-surmairava',
    name: 'Mangalorean Surmai Rava Fry',
    venueId: 'hotel-shabari',
    venueName: 'Hotel Shabari',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 310,
    walkingMinutes: 4,
    price: 360,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Fresh kingfish steak coated in fiery Byadgi chili marinade and golden semolina crust.',
    detailedReview: 'Direct from the morning dock catch. The kingfish steak is thick, moist, and flaky under a micro-crisp semolina shell spiced with tamarind, garlic, and authentic Mangalorean red chili paste.',
    category: 'Must-Try Icons',
    flavorTags: ['🐟 Fresh Catch Kingfish', '🌶️ Fiery Byadgi Chili', '✨ Crisp Semolina Shell'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Drizzle fresh lemon wedge immediately while the rava crust is sizzling.'
  },
  {
    id: 'dish-shabari-neerdosa-gheeroast',
    name: 'Neer Dosa with Chicken Ghee Roast',
    venueId: 'hotel-shabari',
    venueName: 'Hotel Shabari',
    venueArea: 'Sector 17, Vashi',
    distanceMeters: 310,
    walkingMinutes: 4,
    price: 280,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Gossamer-thin rice crepes paired with Kundapur-style slow-roasted chicken in clarified butter.',
    detailedReview: 'Three layers of cloud-like Neer Dosa that melt on your tongue, paired with chicken chunks braised in whole coriander, peppercorns, roasted red chilies, and generous ladlefuls of aromatic pure ghee.',
    category: 'Must-Try Icons',
    flavorTags: ['🧈 Kundapur Pure Ghee', '🫓 Cloud-Soft Neer Dosa', '🌶️ Byadgi Chili Roast'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Order 2 extra plates of Neer Dosa — the ghee roast masala gravy is impossible to leave behind.'
  },

  // 14. Natural Ice Cream
  {
    id: 'dish-natural-tendercoconut',
    name: 'Fresh Tender Coconut (Malai) Scoop',
    venueId: 'natural-icecream',
    venueName: 'Natural Ice Cream',
    venueArea: 'Sector 17 Market',
    distanceMeters: 260,
    walkingMinutes: 3,
    price: 85,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    microVerdict: 'Real fresh coastal tender coconut malai chunks churned with whole milk and light sugar.',
    detailedReview: 'The uncontested gold standard of fresh fruit ice cream in Mumbai. Every spoonful contains crunchy-soft shreds of young green coconut tender meat suspended in smooth, non-crystallized whole milk ice cream.',
    category: 'Sweet Tooth',
    flavorTags: ['🥥 Real Fresh Malai', '🥛 100% Whole Milk', '👑 Vashi Legend'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Pair one scoop of Tender Coconut with one scoop of roasted almond for an incredible contrast.'
  },
  {
    id: 'dish-natural-sitaphal',
    name: 'Seasonal Sitaphal (Custard Apple) Scoop',
    venueId: 'natural-icecream',
    venueName: 'Natural Ice Cream',
    venueArea: 'Sector 17 Market',
    distanceMeters: 260,
    walkingMinutes: 3,
    price: 85,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Hand-deseeded fresh custard apple pulp with delicate floral sweetness and zero artificial essence.',
    detailedReview: 'Available during autumn/winter season. The natural granular texture of custard apple is preserved perfectly without feeling icy or overly sweetened.',
    category: 'Sweet Tooth',
    flavorTags: ['🍐 Hand Deseeded Sitaphal', '🍯 Floral Natural Sugar', '❄️ Winter Special'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask the server if today\'s batch is freshly opened — peak seasonal batches are unmatched.'
  },

  // 15. Arenja Midnight Pav Bhaji Corner
  {
    id: 'dish-arenja-blackpavbhaji',
    name: 'Midnight Special Black Masala Pav Bhaji',
    venueId: 'arenja-midnight-pavbhaji',
    venueName: 'Arenja Midnight Pav Bhaji Corner',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 360,
    walkingMinutes: 4,
    price: 140,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Simmered on giant iron tawa with stone-ground black garam masala & molten Amul butter pool.',
    detailedReview: 'The ultimate late-night savior in Vashi. Unlike standard red food-colored bhaji, this uses roasted black whole spices (dagad phool, cloves, peppercorns) simmered for hours, served with butter-soaked toasted pavs and lemon slices.',
    category: 'Late Night',
    flavorTags: ['🧈 Half Slab Amul Butter', '🌶️ Stone Ground Black Masala', '🌙 Open till 2:30 AM'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Tell them "Bhaji extra spicy aur pav kadak butter" for the authentic late-night experience.'
  },
  {
    id: 'dish-arenja-masalapav',
    name: 'Tawa Kadak Masala Butter Pav',
    venueId: 'arenja-midnight-pavbhaji',
    venueName: 'Arenja Midnight Pav Bhaji Corner',
    venueArea: 'Arenja Corner, Sec 17',
    distanceMeters: 360,
    walkingMinutes: 4,
    price: 80,
    verdict: 'WORTH_IT',
    scorePercent: 92,
    microVerdict: 'Pavs split open on cast iron and drenched in bubbling red garlic bhaji butter and coriander.',
    detailedReview: 'Two fluffy local bakery pavs fried directly in the rich residual spicy butter and masala gravy coating the tawa edge. Crispy bottoms, moist spiced interiors.',
    category: 'Quick Bites',
    flavorTags: ['🧈 Tawa Spiced Butter', '🍞 Fluffy Bakery Pav', '🧄 Red Garlic Masala'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Order this alongside your bhaji instead of plain pavs for double the flavor punch.'
  },

  // 11. Shiv Krupa Farsan (Sector 9 Vashi)
  {
    id: 'dish-shiv-jalebi-fafda',
    name: 'Hot Kesar Jalebi & Papdi Fafda',
    venueId: 'shiv-krupa-farsan',
    venueName: 'Shiv Krupa Farsan & Sweets',
    venueArea: 'Sector 9 Food Street',
    distanceMeters: 620,
    walkingMinutes: 8,
    price: 90,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    microVerdict: 'Piping hot spiraled saffron jalebis dunked live with wafer-thin crunchy fafda & raw papaya sambharo.',
    detailedReview: 'The absolute morning breakfast holy grail of Vashi Sector 9. The jalebis are thin-crusted, exploding with warm saffron cardamom syrup, while the gram-flour fafda is feather-light and crackles on the tongue.',
    category: 'Must-Try Icons',
    flavorTags: ['🍯 Saffron Jalebi', '⚡ Thin Crunchy Fafda', '🥣 Papaya Sambharo'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Arrive between 7:30 AM and 9:30 AM to catch the jalebis straight out of the boiling sugar kadai.'
  },
  {
    id: 'dish-shiv-khaman',
    name: 'Nylon Khaman Dhokla with Mustard Tempering',
    venueId: 'shiv-krupa-farsan',
    venueName: 'Shiv Krupa Farsan & Sweets',
    venueArea: 'Sector 9 Food Street',
    distanceMeters: 620,
    walkingMinutes: 8,
    price: 60,
    verdict: 'GOD_TIER',
    scorePercent: 95,
    microVerdict: 'Airy melt-in-mouth sponge drenched in green chilli-mustard seed tadka and fresh grated coconut.',
    detailedReview: 'Steamed to airy cloud perfection. So juicy with tempered sugar-lemon water that it dissolves on your palate without needing water.',
    category: 'Quick Bites',
    flavorTags: ['☁️ Pillow Soft', '🥥 Coconut Garnish', '🌱 Mustard Tadka'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for the green coriander-papaya chutney on the side.'
  },

  // 12. Sector 9 Khau Galli Frankies
  {
    id: 'dish-sec9-mutton-frankie',
    name: 'Mutton Bhuna Masala Frankie',
    venueId: 'sec9-frankie-corner',
    venueName: 'Sector 9 Khau Galli Frankies',
    venueArea: 'Sector 9 Food Street',
    distanceMeters: 680,
    walkingMinutes: 9,
    price: 160,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Egg-layered paratha rolled around tender braised mutton chunks and secret tangy frankie masala.',
    detailedReview: 'The defining street wrap of Navi Mumbai. The paratha is griddled with an egg layer, rolled around slow-cooked spiced mutton mince and pieces, crunchy raw red onions, and vinegar-chilli spritz.',
    category: 'Late Night',
    flavorTags: ['🌯 Flaky Paratha Wrap', '🍖 Tender Braised Mutton', '🌶️ Tangy Masala Dust'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for "Extra Masala and Double Onion" for maximum street tang.'
  },
  {
    id: 'dish-sec9-paneer-frankie',
    name: 'Tawa Paneer Tikka Frankie',
    venueId: 'sec9-frankie-corner',
    venueName: 'Sector 9 Khau Galli Frankies',
    venueArea: 'Sector 9 Food Street',
    distanceMeters: 680,
    walkingMinutes: 9,
    price: 120,
    verdict: 'WORTH_IT',
    scorePercent: 93,
    microVerdict: 'Fresh malai paneer batons seared on butter tawa with green peppers and roasted cumin masala.',
    detailedReview: 'Far superior to typical fast-food paneer rolls. Soft, milky paneer tossed live on the flat-top with crisp peppers and rolled tight.',
    category: 'Quick Bites',
    flavorTags: ['🧀 Soft Malai Paneer', '🧈 Butter Tawa Seared', '🧅 Crisp Onions'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Pair with their chilled mint-masala soda at the corner stall.'
  },

  // 13. Arenja Midnight Egg & Bhurji King
  {
    id: 'dish-arenja-bhurji',
    name: '4-Egg Butter Boil Bhurji Pav',
    venueId: 'arenja-midnight-bhurji',
    venueName: 'Arenja Midnight Egg & Bhurji King',
    venueArea: 'Arenja Corner Evening',
    distanceMeters: 380,
    walkingMinutes: 4,
    price: 160,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    microVerdict: 'Grated boiled eggs blended into creamy scrambled eggs with garlic-chilli thecha and half a slab of Amul.',
    detailedReview: 'The reigning crown jewel of Navi Mumbai midnight food runs. The combination of grated boiled egg yolks and tender scrambled whites creates an intensely rich sauce that pairs phenomenally with extra toasted kadak pav.',
    category: 'Late Night',
    flavorTags: ['🍳 4-Egg Protein Feast', '🧈 Golden Amul Butter', '🌶️ Green Chilli Thecha'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Insist on "Boil Bhurji Kadak Pav" — do not settle for regular raw egg bhurji.'
  },
  {
    id: 'dish-arenja-egg-ghotala',
    name: 'Surti Style Special Egg Ghotala',
    venueId: 'arenja-midnight-bhurji',
    venueName: 'Arenja Midnight Egg & Bhurji King',
    venueArea: 'Arenja Corner Evening',
    distanceMeters: 380,
    walkingMinutes: 4,
    price: 180,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'A spiced egg gravy lake crowned with a molten sunny-side-up fried egg and grated cheese.',
    detailedReview: 'Surat-style decadence at Arenja Corner. Liquid gold yolk that punctures into fiery spiced minced egg gravy. Outstanding post-midnight comfort.',
    category: 'Late Night',
    flavorTags: ['🍳 Molten Yolk', '🧀 Cheese Blanket', '🔥 Tawa Char'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Dip the crusty pav directly into the center yolk before mixing the gravy.'
  },

  // 14. The Royal Shawarma Cart (Arenja Evening)
  {
    id: 'dish-royal-open-shawarma',
    name: 'Smoked Charcoal Chicken Open Shawarma Plate',
    venueId: 'royal-shawarma-cart',
    venueName: 'The Royal Charcoal Shawarma',
    venueArea: 'Arenja Corner Evening',
    distanceMeters: 340,
    walkingMinutes: 4,
    price: 170,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Carved spit-fire chicken served openly over pillowy pita, mountains of toum garlic dip & pickled turnip.',
    detailedReview: 'Unlike street rolls stuffed with cabbage fillers, this open plate gives you pure roasted shredded chicken marinated in sumac and Lebanese spices with thick, punchy homemade garlic toum.',
    category: 'Late Night',
    flavorTags: ['🍗 Rotisserie Charcoal Chicken', '🧄 Heavy Garlic Toum', '🥙 Authentic Pita Bread'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for the open plate instead of the wrapped roll so you get double the chicken portion and fresh garlic dip.'
  },

  // 15. Sai Krupa Udupi Restaurant (Sector 19 Nerul)
  {
    id: 'dish-sai-thatte-idli',
    name: 'Thatte Idli with Ghee Podi & Sambar',
    venueId: 'sai-krupa-nerul',
    venueName: 'Sai Krupa Udupi Restaurant',
    venueArea: 'Nerul Food Corridor',
    distanceMeters: 2800,
    walkingMinutes: 28,
    price: 85,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    microVerdict: 'Platter-sized Karnataka Thatte Idli, streaming with sizzling spicy podi gun powder and pure desi ghee.',
    detailedReview: 'Steamed on wide flat plates, this idli is unbelievably light and airy. The server dumps a generous mountain of coarse red podi and douses it with a ladle of boiling aromatic ghee right at your table.',
    category: 'Must-Try Icons',
    flavorTags: ['🥞 Giant Karnataka Thatte Idli', '🧈 Sizzling Podi Ghee', '🥥 Silky Coconut Chutney'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Cut each bite into quarters and let the melted podi ghee saturate into the sponge before dipping into sambar.'
  },
  {
    id: 'dish-sai-benne-dosa',
    name: 'Davangere Benne Dosa',
    venueId: 'sai-krupa-nerul',
    venueName: 'Sai Krupa Udupi Restaurant',
    venueArea: 'Nerul Food Corridor',
    distanceMeters: 2800,
    walkingMinutes: 28,
    price: 110,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Thick fermented rice crepe with crisp lace exterior, fluffy butter sponge interior & spiced potato palya.',
    detailedReview: 'Prepared using traditional Davangere white butter on an iron tawa. The crust has deep caramelized pores, while the center remains cloud-soft.',
    category: 'Must-Try Icons',
    flavorTags: ['🧈 White Butter (Benne)', '🥞 Golden Crispy Crust', '🥔 Spiced Potato Palya'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Best paired with their freshly ground decoction filter coffee.'
  },

  // 16. Shri Krishna Kolhapuri Misal (Nerul)
  {
    id: 'dish-krishna-misal',
    name: 'Fiery Kolhapuri Kat Misal with Dahi',
    venueId: 'shri-krishna-misal-nerul',
    venueName: 'Shri Krishna Kolhapuri Misal',
    venueArea: 'Nerul Food Corridor',
    distanceMeters: 3100,
    walkingMinutes: 32,
    price: 95,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Sprouted moth beans, crunchy farsan, crowned with deep crimson Kolhapuri tarri and cooling sweet curd.',
    detailedReview: 'Real Kolhapuri heat that tingles without burning your stomach. The tarri is rendered with roasted coconut, Byadagi chillies, and stone-ground garam masala, poured over crunchy farsan.',
    category: 'Spicy',
    flavorTags: ['🌶️ Fiery Kolhapuri Kat', '🥣 Crunchy Farsan', '🥛 Sweet Dahi Balance'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Order an extra vati of "Kat" and sweet dahi together to customize your heat level.'
  },

  // 17. LP Junction Charcoal Tandoor (Nerul)
  {
    id: 'dish-lp-malai-tikka',
    name: 'Charcoal Grilled Tandoori Malai Chicken Tikka',
    venueId: 'lp-junction-grill',
    venueName: 'LP Junction Charcoal Tandoor & Rolls',
    venueArea: 'Nerul Food Corridor',
    distanceMeters: 3400,
    walkingMinutes: 35,
    price: 240,
    verdict: 'GOD_TIER',
    scorePercent: 96,
    microVerdict: 'Smoky, melt-in-mouth chicken chunks marinated in cream, cashews and green cardamom over open charcoal.',
    detailedReview: 'Highway food royalty at LP Junction. Giant chicken thigh pieces charred over live coal embers. The tandoor smoke penetrates deep, while the cream-cheese marinade keeps the meat luscious.',
    category: 'Late Night',
    flavorTags: ['🔥 Open Pit Charcoal', '🍗 Cream & Cashew Marinade', '🌿 Fresh Mint Dip'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Wrap a tikka piece inside hot butter rumali roti with raw onions and mint chutney.'
  },

  // 18. Durga Coastal Delights (CBD Belapur Sector 15)
  {
    id: 'dish-cbd-kori-rotti',
    name: 'Mangalorean Kori Rotti with Kundapur Chicken Curry',
    venueId: 'durga-coastal-cbd',
    venueName: 'Durga Coastal Delights',
    venueArea: 'CBD Belapur Strip',
    distanceMeters: 5500,
    walkingMinutes: 55,
    price: 260,
    verdict: 'GOD_TIER',
    scorePercent: 98,
    microVerdict: 'Hand-crumbled crispy rice rottis drowned in bubbling Kundapur coconut chicken curry.',
    detailedReview: 'The pinnacle of coastal Karnataka cooking. Sun-crisped paper-thin rice wafers are broken onto your plate, and a steaming bowl of red roasted coconut chicken curry is poured over it, transforming from crunchy to velvet tender in seconds.',
    category: 'Must-Try Icons',
    flavorTags: ['🥥 Kundapur Coconut Curry', '🥣 Crispy Rice Rotti', '🌶️ Byadagi Red Chilli'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Eat immediately after pouring the gravy so you experience both the crunchy and softened textures in one bite.'
  },
  {
    id: 'dish-cbd-surmai-tawa',
    name: 'Fresh Surmai Tawa Fry Masala',
    venueId: 'durga-coastal-cbd',
    venueName: 'Durga Coastal Delights',
    venueArea: 'CBD Belapur Strip',
    distanceMeters: 5500,
    walkingMinutes: 55,
    price: 320,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Thick Kingfish steak marinated in red coastal masala and coated with crispy semolina on iron tawa.',
    detailedReview: 'Fresh catch delivered daily. Coated in a fiery, sour tamarind Byadagi chilli paste, dredged in coarse rava, and shallow fried until golden brown. Unbeatable coastal crunch.',
    category: 'Spicy',
    flavorTags: ['🐟 Fresh Surmai Kingfish', '🌾 Crispy Rava Crust', '🍋 Tangy Tamarind Masala'],
    isVeg: false,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Squeeze fresh lime and pair with their complimentary Sol Kadhi shot.'
  },

  // 19. Vada Pav Samrat (CBD Belapur Station)
  {
    id: 'dish-samrat-ulta-vadapav',
    name: 'Special Ulta Vada Pav with Lasun Thecha',
    venueId: 'vada-pav-samrat-belapur',
    venueName: 'Vada Pav Samrat',
    venueArea: 'CBD Belapur Strip',
    distanceMeters: 5200,
    walkingMinutes: 50,
    price: 35,
    verdict: 'GOD_TIER',
    scorePercent: 97,
    microVerdict: 'Fresh bakery pav stuffed with spicy potato masala, dipped in spiced besan batter, fried & smeared with garlic thecha.',
    detailedReview: 'Belapur Station Khau Galli legend. Unlike ordinary vada pav where the batata vada is tucked inside bread, here the entire pav is stuffed, sealed in gram flour batter, and deep fried into a giant golden pillow.',
    category: 'Quick Bites',
    flavorTags: ['🥔 Ulta Stuffed Pav', '🧄 Fiery Dry Garlic Thecha', '⚡ Piping Hot Kadai Fry'],
    isVeg: true,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    insiderTip: 'Ask for "Thecha dabake" (extra dry roasted garlic thecha pressed into the pav).'
  }
];

export const NEIGHBORHOODS = [
  'All Navi Mumbai',
  'Sector 17, Vashi',
  'Sector 9 Food Street',
  'Arenja Corner Evening',
  'Nerul Food Corridor',
  'CBD Belapur Strip'
];

