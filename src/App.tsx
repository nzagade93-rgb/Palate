import { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  Utensils,
  Dices
} from 'lucide-react';
import { HeaderNav } from './components/HeaderNav';
import { BottomNav } from './components/BottomNav';
import { DishCard } from './components/DishCard';
import { VerdictSplitCard } from './components/VerdictSplitCard';
import { VoucherModal } from './components/VoucherModal';
import { VaultView } from './components/VaultView';
import { AntiRegretWheel } from './components/AntiRegretWheel';
import { CounterFlyerModal } from './components/CounterFlyerModal';
import { CheckInModal } from './components/CheckInModal';
import { SocialShareModal } from './components/SocialShareModal';
import { InstallPrompt } from './components/InstallPrompt';
import { OfflineBanner } from './components/OfflineBanner';
import { LiveCommunityTicker } from './components/LiveCommunityTicker';
import { MerchantValidatorModal } from './components/MerchantValidatorModal';
import { DISHES, VENUES } from './data/mockData';
import type { CategoryFilter, Dish, Venue, CheckIn } from './types';
import { useVault } from './hooks/useVault';

export function App() {
  const [currentTab, setCurrentTab] = useState<'radar' | 'vault'>('radar');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Navi Mumbai');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'GOD_TIER' | 'UNDER_150'>('ALL');

  // Modals
  const [activeSplitVenue, setActiveSplitVenue] = useState<Venue | null>(null);
  const [activeVoucherVenue, setActiveVoucherVenue] = useState<Venue | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
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

      // 3. Corridor / Node Area Filter
      if (selectedArea && selectedArea !== 'All Navi Mumbai' && selectedArea !== 'All Sector 17 & Arenja') {
        const areaClean = selectedArea.toLowerCase().trim();
        const dishAreaClean = dish.venueArea.toLowerCase();

        let matchesCorridor = false;
        if (areaClean === 'vashi') {
          matchesCorridor =
            dishAreaClean.includes('vashi') ||
            dishAreaClean.includes('sector 17') ||
            dishAreaClean.includes('sec 17') ||
            dishAreaClean.includes('arenja') ||
            dishAreaClean.includes('apmc') ||
            dishAreaClean.includes('sector 9');
        } else if (areaClean === 'sanpada') {
          matchesCorridor = dishAreaClean.includes('sanpada');
        } else if (areaClean === 'juinagar') {
          matchesCorridor = dishAreaClean.includes('juinagar');
        } else if (areaClean === 'nerul') {
          matchesCorridor =
            dishAreaClean.includes('nerul') ||
            dishAreaClean.includes('seawoods') ||
            dishAreaClean.includes('lp');
        } else if (areaClean === 'cbd belapur' || areaClean === 'belapur') {
          matchesCorridor =
            dishAreaClean.includes('belapur') ||
            dishAreaClean.includes('cbd');
        } else if (areaClean === 'kharghar') {
          matchesCorridor =
            dishAreaClean.includes('kharghar') ||
            dishAreaClean.includes('shilp') ||
            dishAreaClean.includes('utsav') ||
            dishAreaClean.includes('hiranandani');
        } else {
          matchesCorridor = dishAreaClean.includes(areaClean) || areaClean.includes(dishAreaClean);
        }

        if (!matchesCorridor) {
          return false;
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
    <div className="min-h-screen w-full bg-[#07090C] flex justify-center selection:bg-brand-orange selection:text-white">
      <div className="mx-auto w-full max-w-md min-h-screen bg-[#07090C] text-white shadow-2xl relative border-x border-[#262C36] flex flex-col font-sans">
        {/* Network & Offline Status Banner */}
        <OfflineBanner />

        {/* Sticky Top Navigation (Zero Clipping) */}
        <HeaderNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          onBrandClick={() => setCurrentTab('radar')}
        />

        {/* Main View Area with Generous Whitespace */}
        <main className="flex-1 w-full pb-28">
          {currentTab === 'vault' ? (
            <VaultView onBackToRadar={() => setCurrentTab('radar')} />
          ) : (
            <div className="px-4 py-4 space-y-4">
            
            {/* Anti-Regret Value Proposition Bar (High-Luxury Minimal) */}
            <div className="p-4 rounded-2xl bg-[#0E1116] border border-[#262C36] flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-brand-orange" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-white flex items-center gap-1.5 tracking-wide">
                    <span>The Anti-Regret Radar</span>
                    <span className="text-[9px] font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    No 10-page menus • Only God-Tier dishes & verified items to skip
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsWheelOpen(true)}
                className="shrink-0 min-h-[40px] text-xs font-bold text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/50 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Dices className="w-4 h-4 text-amber-400" />
                <span>Spin</span>
              </button>
            </div>

            {/* Live Community Food Pulse Stream */}
            <LiveCommunityTicker />

            {/* Quick Verdict Sub-Filter Pills with Ample Negative Space */}
            <div className="flex items-center justify-between gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setVerdictFilter('ALL')}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs active:scale-95 ${
                    verdictFilter === 'ALL'
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[#0E1116] text-slate-400 hover:text-white border border-[#262C36]'
                  }`}
                >
                  All ({DISHES.length})
                </button>
                <button
                  onClick={() => setVerdictFilter('GOD_TIER')}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs active:scale-95 ${
                    verdictFilter === 'GOD_TIER'
                      ? 'bg-emerald-500 text-white shadow-glow-green'
                      : 'bg-[#0E1116] text-emerald-400 hover:bg-[#161B22] border border-[#262C36]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>God-Tier (95%+)</span>
                </button>
                <button
                  onClick={() => setVerdictFilter('UNDER_150')}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs active:scale-95 ${
                    verdictFilter === 'UNDER_150'
                      ? 'bg-brand-orange text-white'
                      : 'bg-[#0E1116] text-slate-400 hover:text-white border border-[#262C36]'
                  }`}
                >
                  Under ₹150
                </button>
              </div>

              <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                {filteredDishes.length} spots
              </span>
            </div>

            {/* Dish Cards Vertical Feed (mb-10 applied on each card for massive whitespace) */}
            {filteredDishes.length === 0 ? (
              <div className="p-10 rounded-3xl bg-[#0E1116] border border-[#262C36] text-center space-y-3 my-8 shadow-xl">
                <Utensils className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No dishes found</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Try clearing your search query or switching neighborhood hubs.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedArea('All Navi Mumbai');
                    setVerdictFilter('ALL');
                  }}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-glow-orange hover:bg-orange-600 transition-all active:scale-95"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="pt-2">
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
        onOpenValidator={() => {
          setIsFlyerOpen(false);
          setIsValidatorOpen(true);
        }}
      />

      {/* Cashier Perk Validator Modal */}
      <MerchantValidatorModal
        isOpen={isValidatorOpen}
        onClose={() => setIsValidatorOpen(false)}
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

      {/* Fixed Elegant Bottom Navigation Bar (Zero Clipping across mobile viewports) */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenWheel={() => setIsWheelOpen(true)}
        onOpenFlyer={() => handleOpenFlyer()}
        vaultCount={vaultItems.length}
      />
      </div>
    </div>
  );
}

export default App;
