import { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Utensils,
  Dices
} from 'lucide-react';
import { HeaderNav } from './components/HeaderNav';
import { BottomNav } from './components/BottomNav';
import { DishCard } from './components/DishCard';
import { DishDetailModal } from './components/DishDetailModal';
import { DishSearchView } from './components/DishSearchView';
import { PalateDNAView } from './components/PalateDNAView';
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
import { ThemeToggle } from './components/ThemeToggle';
import { DISHES, VENUES } from './data/mockData';
import type { CategoryFilter, Dish, Venue, CheckIn, NavigationTab } from './types';
import { useVault } from './hooks/useVault';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('radar');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Navi Mumbai');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'GOD_TIER' | 'UNDER_150'>('ALL');

  // Modals
  const [activeDishDetail, setActiveDishDetail] = useState<Dish | null>(null);
  const [activeSplitVenue, setActiveSplitVenue] = useState<Venue | null>(null);
  const [activeVoucherVenue, setActiveVoucherVenue] = useState<Venue | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [activeFlyerVenue, setActiveFlyerVenue] = useState<Venue | null>(null);
  const [checkInDish, setCheckInDish] = useState<Dish | null>(null);
  const [shareDishData, setShareDishData] = useState<{ dish: Dish; checkIn?: CheckIn } | null>(null);

  const { vaultItems } = useVault();

  // Instant Client-Side Filter & Search for Discover Feed
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

  // Open Dish Detail Hero Modal
  const handleSelectDish = (dish: Dish) => {
    setActiveDishDetail(dish);
  };

  // Open Venue Split-Card Modal
  const handleOpenSplit = (dish: Dish) => {
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
    <div className="min-h-screen w-full bg-[var(--canvas)] flex justify-center items-center p-0 sm:py-6 selection:bg-brand-orange selection:text-white transition-colors duration-250">
      <div className="mx-auto w-full max-w-lg min-h-[100dvh] bg-[var(--surface-1)] text-[var(--text-primary)] shadow-2xl relative sm:border-x border-[var(--border-subtle)] flex flex-col font-sans overflow-x-hidden transition-colors duration-250">
        {/* Network & Offline Status Banner */}
        <OfflineBanner />

        {/* Desktop / Tablet Sub-Header Bar */}
        <div className="hidden sm:flex items-center justify-between px-5 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border-subtle)] text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-muted)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-green" />
            <span className="text-[var(--text-secondary)]">Hyper-Local Dish Radar</span>
            <span>•</span>
            <span>Navi Mumbai Spine</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle variant="pill" />
            <span className="text-[var(--border-subtle)]">|</span>
            <button
              onClick={() => setIsWheelOpen(true)}
              className="text-[11px] font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Anti-Regret Spin</span>
            </button>
            <span className="text-[var(--border-subtle)]">|</span>
            <button
              onClick={() => handleOpenFlyer()}
              className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Merchant Flyer
            </button>
          </div>
        </div>

        {/* Sticky Top Navigation (Mounted on Discover/Radar tab) */}
        {currentTab === 'radar' && (
          <HeaderNav
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            onBrandClick={() => setCurrentTab('radar')}
          />
        )}

        {/* Main View Area with Generous Whitespace */}
        <main className="flex-1 w-full pb-28">
          {/* TAB 1: RADAR / DISCOVER */}
          {currentTab === 'radar' && (
            <div className="px-4 sm:px-5 py-4 space-y-4">
              {/* Editorial Welcome Micro-Banner */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-black text-[var(--text-primary)] tracking-tight leading-snug">
                    What would you love to eat?
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Curated God-Tier dishes & exact menu traps to avoid.
                  </p>
                </div>

                <button
                  onClick={() => setIsWheelOpen(true)}
                  title="Random Anti-Regret Spin"
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-brand-orange/20 border border-brand-orange/40 hover:border-brand-orange text-amber-500 dark:text-amber-400 hover:text-brand-orange text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <Dices className="w-4 h-4 text-amber-500 animate-pulse-subtle" />
                  <span className="hidden xs:inline">Spin</span>
                </button>
              </div>

              {/* Live Community Food Pulse Stream */}
              <LiveCommunityTicker />

              {/* Quick Verdict Sub-Filter Pills */}
              <div className="flex items-center justify-between gap-2 text-xs pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setVerdictFilter('ALL')}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs active:scale-95 cursor-pointer ${
                      verdictFilter === 'ALL'
                        ? 'bg-[var(--text-primary)] text-[var(--canvas)] shadow-sm'
                        : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    All ({DISHES.length})
                  </button>
                  <button
                    onClick={() => setVerdictFilter('GOD_TIER')}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs active:scale-95 cursor-pointer ${
                      verdictFilter === 'GOD_TIER'
                        ? 'bg-emerald-500 text-white shadow-glow-green'
                        : 'bg-[var(--surface-2)] text-emerald-600 dark:text-emerald-400 hover:bg-[var(--surface-3)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>God-Tier (95%+)</span>
                  </button>
                  <button
                    onClick={() => setVerdictFilter('UNDER_150')}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs active:scale-95 cursor-pointer ${
                      verdictFilter === 'UNDER_150'
                        ? 'bg-brand-orange text-white'
                        : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    Under ₹150
                  </button>
                </div>

                <span className="text-[11px] text-[var(--text-muted)] shrink-0 font-medium">
                  {filteredDishes.length} spots
                </span>
              </div>

              {/* Dish Cards Vertical Feed */}
              {filteredDishes.length === 0 ? (
                <div className="p-10 rounded-3xl bg-[var(--surface-2)] border border-[var(--border-subtle)] text-center space-y-3 my-8 shadow-xl">
                  <Utensils className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                  <h3 className="text-base font-bold text-[var(--text-primary)]">No dishes found</h3>
                  <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
                    Try clearing your search query or switching neighborhood hubs.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedArea('All Navi Mumbai');
                      setVerdictFilter('ALL');
                    }}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-glow-orange hover:bg-orange-600 transition-all active:scale-95 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  {filteredDishes.map((dish, index) => (
                    <div key={dish.id}>
                      <DishCard
                        dish={dish}
                        onSelectDish={handleSelectDish}
                        onOpenSplit={handleOpenSplit}
                        onCheckIn={handleOpenCheckIn}
                        onShare={handleOpenShare}
                      />
                      {/* Subtle inline install card after 3rd dish */}
                      {index === 2 && <InstallPrompt />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DISH SEARCH */}
          {currentTab === 'search' && (
            <div className="px-4 sm:px-5 py-4">
              <DishSearchView
                onSelectDish={handleSelectDish}
                onCheckIn={handleOpenCheckIn}
                onShare={handleOpenShare}
              />
            </div>
          )}

          {/* TAB 3: PALATE DNA (TASTE PROFILE) */}
          {currentTab === 'dna' && (
            <div className="px-4 sm:px-5 py-4">
              <PalateDNAView
                onSelectDish={handleSelectDish}
                onNavigateToDiscover={() => setCurrentTab('radar')}
              />
            </div>
          )}

          {/* TAB 4: MY FOOD VAULT */}
          {currentTab === 'vault' && (
            <VaultView onBackToRadar={() => setCurrentTab('radar')} />
          )}
        </main>

        {/* SCREEN 1: Dedicated Editorial Dish Detail Hero Modal */}
        {activeDishDetail && (
          <DishDetailModal
            dish={activeDishDetail}
            isOpen={Boolean(activeDishDetail)}
            onClose={() => setActiveDishDetail(null)}
            onOpenSplitVenue={(venue) => {
              setActiveDishDetail(null);
              setActiveSplitVenue(venue);
            }}
            onOpenVoucher={(venue) => {
              setActiveDishDetail(null);
              setActiveVoucherVenue(venue);
            }}
            onCheckIn={handleOpenCheckIn}
            onShare={handleOpenShare}
          />
        )}

        {/* SCREEN 2: Verdict Split-Card Modal */}
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

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          vaultCount={vaultItems.length}
        />
      </div>
    </div>
  );
}

export default App;
