import { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  Utensils,
  Dices
} from 'lucide-react';
import { HeaderNav } from './components/HeaderNav';
import { DishCard } from './components/DishCard';
import { VerdictSplitCard } from './components/VerdictSplitCard';
import { VoucherModal } from './components/VoucherModal';
import { VaultView } from './components/VaultView';
import { AntiRegretWheel } from './components/AntiRegretWheel';
import { CounterFlyerModal } from './components/CounterFlyerModal';
import { CheckInModal } from './components/CheckInModal';
import { SocialShareModal } from './components/SocialShareModal';
import { InstallPrompt } from './components/InstallPrompt';
import { DISHES, VENUES } from './data/mockData';
import type { CategoryFilter, Dish, Venue, CheckIn } from './types';
import { useVault } from './hooks/useVault';

export function App() {
  const [currentTab, setCurrentTab] = useState<'radar' | 'vault'>('radar');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('Sector 17, Vashi');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'GOD_TIER' | 'UNDER_150'>('ALL');

  // Modals
  const [activeSplitVenue, setActiveSplitVenue] = useState<Venue | null>(null);
  const [activeVoucherVenue, setActiveVoucherVenue] = useState<Venue | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [activeFlyerVenue, setActiveFlyerVenue] = useState<Venue | null>(null);
  const [checkInDish, setCheckInDish] = useState<Dish | null>(null);
  const [shareDishData, setShareDishData] = useState<{ dish: Dish; checkIn?: CheckIn } | null>(null);

  const { vaultItems } = useVault();

  // Instant Client-Side Filter & Search
  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesVenue = dish.venueName.toLowerCase().includes(q);
        const matchesMicroVerdict = dish.microVerdict.toLowerCase().includes(q);
        const matchesTags = dish.flavorTags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesVenue && !matchesMicroVerdict && !matchesTags) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'All' && dish.category !== selectedCategory) {
        return false;
      }

      // 3. Area Filter (if not 'All Navi Mumbai' or 'All Sector 17 & Arenja')
      if (selectedArea !== 'All Navi Mumbai' && selectedArea !== 'All Sector 17 & Arenja') {
        const areaClean = selectedArea.toLowerCase();
        const dishAreaClean = dish.venueArea.toLowerCase();
        if (!dishAreaClean.includes(areaClean) && !areaClean.includes(dishAreaClean)) {
          // If searching for Sector 17, also include Arenja Corner which is inside Sector 17
          const isSector17 = areaClean.includes('sector 17') || areaClean.includes('sec 17') || areaClean.includes('arenja');
          const isDishSector17 = dishAreaClean.includes('sector 17') || dishAreaClean.includes('sec 17') || dishAreaClean.includes('arenja');
          if (isSector17 && isDishSector17) {
            // match
          } else {
            return false;
          }
        }
      }

      // 4. Verdict / Price Quick Filter
      if (verdictFilter === 'GOD_TIER' && dish.verdict !== 'GOD_TIER') {
        return false;
      }
      if (verdictFilter === 'UNDER_150' && dish.price > 150) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedArea, verdictFilter]);

  const handleSelectDish = (dish: Dish) => {
    const venue = VENUES[dish.venueId];
    if (venue) {
      setActiveSplitVenue(venue);
    }
  };

  const handleOpenVoucherFromSplit = (venue: Venue) => {
    setActiveVoucherVenue(venue);
  };

  const handleOpenFlyer = (venue?: Venue) => {
    setActiveFlyerVenue(venue || null);
    setIsFlyerOpen(true);
  };

  const handleOpenCheckIn = (dish: Dish) => {
    setCheckInDish(dish);
  };

  const handleOpenShare = (dish: Dish, checkIn?: CheckIn) => {
    setShareDishData({ dish, checkIn });
  };

  return (
    <div className="min-h-screen w-full bg-[#07090c] flex justify-center">
      <div className="mx-auto w-full max-w-md min-h-screen bg-[#0e1117] text-white shadow-2xl relative border-x border-neutral-800/60 flex flex-col font-sans">
        {/* Sticky Top Navigation */}
        <HeaderNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          onOpenWheel={() => setIsWheelOpen(true)}
          onOpenFlyer={() => handleOpenFlyer()}
          vaultCount={vaultItems.length}
        />

        {/* Main View Area */}
        <main className="flex-1 w-full pb-20">
          {currentTab === 'vault' ? (
            <VaultView onBackToRadar={() => setCurrentTab('radar')} />
          ) : (
            <div className="px-3.5 sm:px-4 py-3 space-y-3.5">
            
            {/* Anti-Regret Value Proposition Bar */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#171924] via-[#141620] to-[#171924] border border-[#272B3C] flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-brand-orange" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>The Anti-Regret Radar</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">
                    No 10-page menus • Strictly God-Tier dishes & exact items to skip
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsWheelOpen(true)}
                className="shrink-0 text-[11px] font-bold text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/60 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all active:scale-95"
              >
                <Dices className="w-3.5 h-3.5 text-amber-400" />
                <span>Spin</span>
              </button>
            </div>

            {/* Quick Verdict Sub-Filter Pills */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setVerdictFilter('ALL')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    verdictFilter === 'ALL'
                      ? 'bg-[#2B3044] text-white'
                      : 'bg-[#151722] text-gray-400 hover:text-white border border-[#222638]'
                  }`}
                >
                  All ({DISHES.length})
                </button>
                <button
                  onClick={() => setVerdictFilter('GOD_TIER')}
                  className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                    verdictFilter === 'GOD_TIER'
                      ? 'bg-emerald-500 text-white shadow-glow-green'
                      : 'bg-[#151722] text-emerald-400 hover:bg-[#1E2333] border border-emerald-900/40'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>God-Tier (95%+)</span>
                </button>
                <button
                  onClick={() => setVerdictFilter('UNDER_150')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    verdictFilter === 'UNDER_150'
                      ? 'bg-brand-orange text-white'
                      : 'bg-[#151722] text-gray-400 hover:text-white border border-[#222638]'
                  }`}
                >
                  Pocket Friendly (&lt; ₹150)
                </button>
              </div>

              <span className="text-[11px] text-gray-500 shrink-0 font-medium">
                {filteredDishes.length} matches
              </span>
            </div>

            {/* Dish Cards Vertical Feed */}
            {filteredDishes.length === 0 ? (
              <div className="p-10 rounded-3xl bg-[#141620] border border-[#242838] text-center space-y-3 my-6">
                <Utensils className="w-8 h-8 text-gray-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No dishes found</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Try clearing your search query or switching neighborhood hubs.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedArea('All Navi Mumbai');
                    setVerdictFilter('ALL');
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-md hover:bg-orange-600 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onSelectDish={handleSelectDish}
                    onCheckIn={handleOpenCheckIn}
                    onShare={handleOpenShare}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Screen 2: Verdict Split-Card Modal */}
      {activeSplitVenue && (
        <VerdictSplitCard
          venue={activeSplitVenue}
          isOpen={Boolean(activeSplitVenue)}
          onClose={() => setActiveSplitVenue(null)}
          onOpenVoucher={handleOpenVoucherFromSplit}
          onOpenFlyer={handleOpenFlyer}
          onCheckIn={handleOpenCheckIn}
          onShare={handleOpenShare}
        />
      )}

      {/* Digital Counter Voucher Modal */}
      {activeVoucherVenue && (
        <VoucherModal
          isOpen={Boolean(activeVoucherVenue)}
          onClose={() => setActiveVoucherVenue(null)}
          venueName={activeVoucherVenue.name}
          perkTitle={activeVoucherVenue.counterPerk.title}
          perkDescription={activeVoucherVenue.counterPerk.description}
          voucherCode={activeVoucherVenue.counterPerk.code}
        />
      )}

      {/* Anti-Regret Wheel Modal */}
      <AntiRegretWheel
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        onSelectDish={handleSelectDish}
      />

      {/* Merchant Table-Tent Flyer Modal */}
      <CounterFlyerModal
        isOpen={isFlyerOpen}
        onClose={() => setIsFlyerOpen(false)}
        initialVenue={activeFlyerVenue}
      />

      {/* 1-Tap Eating Here Check-In Modal */}
      <CheckInModal
        isOpen={Boolean(checkInDish)}
        onClose={() => setCheckInDish(null)}
        dish={checkInDish}
        onOpenShare={handleOpenShare}
      />

      {/* 9:16 Social Flex Story Export Modal */}
      <SocialShareModal
        isOpen={Boolean(shareDishData)}
        onClose={() => setShareDishData(null)}
        dish={shareDishData?.dish || null}
        checkIn={shareDishData?.checkIn}
      />

      {/* PWA Floating Install Prompt */}
      <InstallPrompt />
      </div>
    </div>
  );
}

export default App;
