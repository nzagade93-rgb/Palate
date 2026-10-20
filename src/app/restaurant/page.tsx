'use client';

// ==============================================================================
// PALATE: Restaurant Monetization Portal
// Promotional Campaign Builder, Champion Verification & Customer Acquisition
// "Build Now, Activate Later" Architecture
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MonetizationSettings,
  CampaignPackage,
  RestaurantCampaign,
  RestaurantOffer,
  OfferRedemption,
} from '@/lib/monetizationTypes';
import { Battle } from '@/lib/types';
import {
  ArrowLeft,
  Store,
  Sparkles,
  Trophy,
  Tag,
  DollarSign,
  Lock,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  AlertCircle,
  HelpCircle,
  Check,
  CreditCard,
  Building2,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SEED_RESTAURANTS = [
  { id: 'res_yasins', name: "Yasin's Food Inn", node: 'Sector 12, Kharghar' },
  { id: 'cont_vashi_vadapav', name: 'Sector 17 Famous Corner Vada Pav', node: 'Sector 17, Vashi' },
  { id: 'cont_nerul_vadapav', name: 'Nerul Station East Crunchy Vada Pav', node: 'Sector 19A, Nerul' },
  { id: 'res_shabari', name: 'Shabari Restaurant', node: 'Sector 17, Vashi' },
  { id: 'res_bhagat', name: 'Bhagat Tarachand', node: 'Sector 17, Vashi' },
  { id: 'res_mahesh', name: 'Mahesh Lunch Home', node: 'CBD Belapur' },
];

export default function RestaurantPortalPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(SEED_RESTAURANTS[0]);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'champion' | 'offers'>('campaigns');

  const [settings, setSettings] = useState<MonetizationSettings | null>(null);
  const [packages, setPackages] = useState<CampaignPackage[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<RestaurantCampaign[]>([]);
  const [myOffers, setMyOffers] = useState<RestaurantOffer[]>([]);
  const [championWins, setChampionWins] = useState<any[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Campaign Creation Form State
  const [selectedPackage, setSelectedPackage] = useState<CampaignPackage | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [selectedBattleId, setSelectedBattleId] = useState('');
  const [placementType, setPlacementType] = useState<'battle_spotlight' | 'neighborhood_banner'>('battle_spotlight');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Offer Creation State
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDiscount, setOfferDiscount] = useState('30');
  const [offerMinOrder, setOfferMinOrder] = useState('150');
  const [offerLimit, setOfferLimit] = useState('100');
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);

  // Fetch restaurant specific data
  const loadPortalData = async () => {
    try {
      setIsLoading(true);
      const [sRes, cRes, oRes, champRes, bRes] = await Promise.all([
        fetch('/api/monetization/settings'),
        fetch(`/api/monetization/campaigns?restaurantId=${encodeURIComponent(selectedRestaurant.id)}`),
        fetch(`/api/monetization/offers?restaurantId=${encodeURIComponent(selectedRestaurant.id)}`),
        fetch(`/api/monetization/champion?restaurantId=${encodeURIComponent(selectedRestaurant.id)}`),
        fetch('/api/battles'),
      ]);

      const sData = await sRes.json();
      const cData = await cRes.json();
      const oData = await oRes.json();
      const champData = await champRes.json();
      const bData = await bRes.json();

      if (sData.success) {
        setSettings(sData.settings);
        setPackages(sData.packages || []);
        if (sData.packages?.length > 0 && !selectedPackage) {
          setSelectedPackage(sData.packages[0]);
        }
      }
      if (cData.success) setMyCampaigns(cData.campaigns || []);
      if (oData.success) setMyOffers(oData.offers || []);
      if (champData.success) setChampionWins(champData.eligibleWins || []);
      if (bData.success) {
        setBattles(bData.battles || []);
        if (bData.battles?.length > 0 && !selectedBattleId) {
          setSelectedBattleId(bData.battles[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading restaurant portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, [selectedRestaurant.id]);

  const isMonetizationActive = Boolean(settings?.monetization_enabled);
  const isSponsoredActive = Boolean(settings?.monetization_enabled && settings?.sponsored_battles_enabled);
  const isChampionActive = Boolean(settings?.monetization_enabled && settings?.champion_packages_enabled);
  const isOffersActive = Boolean(settings?.monetization_enabled && settings?.restaurant_offers_enabled);

  // Submit Campaign Handler
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedPackage) {
      setErrorMsg('Please select a campaign package');
      return;
    }
    if (!campaignName.trim()) {
      setErrorMsg('Please enter a campaign name');
      return;
    }

    if (!isSponsoredActive) {
      setErrorMsg('Sponsored Food Battles are currently disabled by the platform administrator.');
      return;
    }

    try {
      setIsSubmitting(true);
      const chosenBattle = battles.find((b) => b.id === selectedBattleId);

      const res = await fetch('/api/monetization/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          restaurantName: selectedRestaurant.name,
          packageId: selectedPackage.id,
          campaignName: campaignName.trim(),
          promotionalDescription: promoDesc.trim(),
          relatedBattleId: chosenBattle?.id,
          relatedBattleTitle: chosenBattle?.title,
          placementType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionSuccess(true);
        setCampaignName('');
        setPromoDesc('');
        loadPortalData();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FFD11A', '#2748FF', '#00B26B'],
          });
        } catch {}
      } else {
        setErrorMsg(data.error || 'Campaign submission failed');
      }
    } catch {
      setErrorMsg('Network error submitting campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Claim Champion Package Handler
  const handleClaimChampionPackage = async (battleId: string, pkgId: string) => {
    if (!isChampionActive) {
      alert('Champion Packages are currently disabled by the platform administrator.');
      return;
    }

    try {
      const res = await fetch('/api/monetization/champion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          restaurantName: selectedRestaurant.name,
          battleId,
          packageId: pkgId,
          campaignName: `Champion Celebration: ${selectedRestaurant.name}`,
          promotionalDescription: `Celebrating earned victory in Navi Mumbai Food Battles!`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Champion promotional package claimed! Awaiting admin review and artwork generation.');
        loadPortalData();
      } else {
        alert(data.error || 'Failed to claim champion package');
      }
    } catch {
      alert('Network error claiming champion package');
    }
  };

  // Create Offer Handler
  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOffersActive) {
      alert('Customer offers are currently disabled by the administrator.');
      return;
    }

    try {
      setIsCreatingOffer(true);
      const res = await fetch('/api/monetization/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: selectedRestaurant.id,
          restaurantName: selectedRestaurant.name,
          title: offerTitle.trim(),
          discountType: 'flat',
          discountValue: Number(offerDiscount),
          minOrderValue: Number(offerMinOrder),
          redemptionLimit: Number(offerLimit),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Promotional offer created successfully!');
        setOfferTitle('');
        loadPortalData();
      } else {
        alert(data.error || 'Failed to create offer');
      }
    } catch {
      alert('Network error creating offer');
    } finally {
      setIsCreatingOffer(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6EFE2] text-[#121212] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Top Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#121212] pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#121212] bg-[#FFFFFF] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A] transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="stamp-tag bg-[#FFD11A] text-[#121212] text-[9px]">
                RESTAURANT PORTAL
              </span>
              <h1 className="text-2xl font-black text-[#121212] uppercase tracking-tight">
                PALATE Partner Dashboard
              </h1>
            </div>
          </div>

          {/* Restaurant Selector */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border-2 border-[#121212] shadow-[2px_2px_0px_#121212]">
            <Store className="h-4 w-4 text-[#2748FF]" />
            <select
              value={selectedRestaurant.id}
              onChange={(e) => {
                const found = SEED_RESTAURANTS.find((r) => r.id === e.target.value);
                if (found) setSelectedRestaurant(found);
              }}
              className="font-bold text-xs bg-transparent outline-none cursor-pointer"
            >
              {SEED_RESTAURANTS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.node})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Monetization Status Banner */}
        {!isMonetizationActive ? (
          <div className="rounded-2xl border-[2.5px] border-[#121212] bg-[#FFFFFF] p-4 text-[#121212] shadow-[4px_4px_0px_#121212] mb-6">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 shrink-0 mt-0.5 text-[#2748FF]" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="stamp-tag bg-[#DDD4C2] text-[#121212] text-[9px]">
                    COMING SOON
                  </span>
                  <h3 className="text-sm font-black uppercase">
                    Paid Promotional Features Are In Launch Preparation
                  </h3>
                </div>
                <p className="mt-1 text-xs font-medium text-[#121212]/75 leading-relaxed">
                  PALATE is currently focused on organic community battles and voter discovery in Navi Mumbai.
                  Campaign packages and customer acquisition offers can be previewed below. Paid checkouts will become active once administrative activation begins.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-[2.5px] border-[#121212] bg-[#00B26B] p-4 text-white shadow-[4px_4px_0px_#121212] mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-[#FFD11A]" />
              <h3 className="text-sm font-black uppercase">
                Monetization Active: Promotional Tools Unlocked
              </h3>
            </div>
            <p className="mt-1 text-xs font-medium text-white/90">
              Submit sponsored food battle placements or activate diner acquisition discounts across Navi Mumbai.
            </p>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 mb-6 border-b-2 border-[#121212] pb-3">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`rounded-xl border-2 border-[#121212] px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
              activeTab === 'campaigns'
                ? 'bg-[#121212] text-[#FFD11A] shadow-[2px_2px_0px_#121212]'
                : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
            }`}
          >
            🔥 Sponsored Battles ({myCampaigns.length})
          </button>

          <button
            onClick={() => setActiveTab('champion')}
            className={`rounded-xl border-2 border-[#121212] px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
              activeTab === 'champion'
                ? 'bg-[#121212] text-[#FFD11A] shadow-[2px_2px_0px_#121212]'
                : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
            }`}
          >
            🏆 Champion Packages ({championWins.length} Won)
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`rounded-xl border-2 border-[#121212] px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
              activeTab === 'offers'
                ? 'bg-[#121212] text-[#FFD11A] shadow-[2px_2px_0px_#121212]'
                : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
            }`}
          >
            🏷️ Customer Acquisition Offers ({myOffers.length})
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: SPONSORED BATTLES & CAMPAIGN BUILDER */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            {/* Package Selector */}
            <div className="poster-card p-5 bg-[#FFFFFF]">
              <div className="mb-4">
                <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px] mb-1">
                  STAGE 1: SELECT PACKAGE
                </span>
                <h3 className="text-base font-black uppercase text-[#121212]">
                  Available Promotional Battle Packages
                </h3>
                <p className="text-xs text-[#121212]/70">
                  Transparent placement packages. Does NOT buy votes or alter battle scoring.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {packages
                  .filter((p) => p.type === 'sponsored_battle')
                  .map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all flex flex-col justify-between ${
                        selectedPackage?.id === pkg.id
                          ? 'border-[#2748FF] bg-[#2748FF]/5 shadow-[4px_4px_0px_#2748FF]'
                          : 'border-[#121212] bg-[#F6EFE2] hover:border-[#2748FF]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-[#121212]/60">
                            {pkg.minDurationDays} Days
                          </span>
                          {!isSponsoredActive && (
                            <span className="rounded-full bg-[#DDD4C2] px-2 py-0.5 text-[8px] font-mono font-black uppercase text-[#121212]">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-[#121212] mb-1">{pkg.name}</h4>
                        <p className="text-[11px] text-[#121212]/75 mb-3">{pkg.description}</p>
                      </div>

                      <div className="border-t border-[#121212]/20 pt-2 flex items-center justify-between">
                        <span className="font-mono text-base font-black text-[#00B26B]">
                          ₹{(pkg.priceInPaise / 100).toLocaleString('en-IN')}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#2748FF]">
                          {selectedPackage?.id === pkg.id ? '✓ Selected' : 'Choose'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Campaign Information Form */}
            <div className="poster-card p-5 bg-[#FFFFFF]">
              <div className="mb-4">
                <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px] mb-1">
                  STAGE 2: CAMPAIGN DETAILS & PREVIEW
                </span>
                <h3 className="text-base font-black uppercase text-[#121212]">
                  Configure Campaign for {selectedRestaurant.name}
                </h3>
              </div>

              {errorMsg && (
                <div className="mb-4 rounded-xl border-2 border-red-600 bg-red-50 p-3 text-xs font-bold text-red-600">
                  {errorMsg}
                </div>
              )}

              {submissionSuccess && (
                <div className="mb-4 rounded-xl border-2 border-[#00B26B] bg-[#00B26B]/10 p-3 text-xs font-bold text-[#00B26B]">
                  Campaign submitted successfully! An administrator will review your placement before payment.
                </div>
              )}

              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase text-[#121212]/70 block mb-1">
                      Campaign Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vashi's Crispiest Vada Pav Showdown"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-2.5 font-bold text-xs text-[#121212] shadow-[2px_2px_0px_#121212] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase text-[#121212]/70 block mb-1">
                      Target Food Battle
                    </label>
                    <select
                      value={selectedBattleId}
                      onChange={(e) => setSelectedBattleId(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-2.5 font-bold text-xs text-[#121212] shadow-[2px_2px_0px_#121212] outline-none"
                    >
                      {battles.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title} ({b.neighborhood})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[11px] font-bold uppercase text-[#121212]/70 block mb-1">
                    Promotional Callout (Displayed on Battle Page)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Try our double-fried crispy thecha vada pav. Settle the debate yourself!"
                    value={promoDesc}
                    onChange={(e) => setPromoDesc(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-2.5 font-bold text-xs text-[#121212] shadow-[2px_2px_0px_#121212] outline-none"
                  />
                </div>

                <div className="border-t border-[#121212]/15 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-mono">
                    <span className="text-[#121212]/60 block">Selected Package:</span>
                    <span className="font-black text-[#121212]">
                      {selectedPackage?.name} — ₹{((selectedPackage?.priceInPaise || 0) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isSponsoredActive}
                    className={`rounded-xl border-2 border-[#121212] px-6 py-2.5 font-mono text-xs font-black uppercase shadow-[3px_3px_0px_#121212] transition-all ${
                      isSponsoredActive
                        ? 'bg-[#FFD11A] text-[#121212] hover:bg-[#e0b815]'
                        : 'bg-[#DDD4C2] text-[#121212]/40 cursor-not-allowed'
                    }`}
                  >
                    {isSponsoredActive ? 'Submit Campaign for Review' : 'Purchases Disabled (Coming Soon)'}
                  </button>
                </div>
              </form>
            </div>

            {/* Campaign History */}
            <div className="poster-card p-5 bg-[#FFFFFF]">
              <h3 className="text-base font-black uppercase text-[#121212] mb-3">
                Campaign History for {selectedRestaurant.name}
              </h3>

              {myCampaigns.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-[#121212]/60">
                  No campaigns submitted yet for this restaurant.
                </div>
              ) : (
                <div className="space-y-3">
                  {myCampaigns.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px]">
                            {c.packageName}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#121212]">
                            ₹{(c.priceInPaise / 100).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-[#121212] mt-1">{c.campaignName}</h4>
                        <p className="text-[10px] text-[#121212]/60 font-mono">
                          Battle: {c.relatedBattleTitle || 'City Wide'} • Status: {c.status} • Payment: {c.paymentStatus}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[9px] font-mono font-black uppercase border border-[#121212] ${
                            c.status === 'active' ? 'bg-[#00B26B] text-white' : 'bg-[#DDD4C2] text-[#121212]'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: CHAMPION PACKAGES */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'champion' && (
          <div className="space-y-6">
            <div className="poster-card p-5 bg-[#FFFFFF]">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="h-5 w-5 text-[#FFD11A]" />
                <h3 className="text-base font-black uppercase text-[#121212]">
                  Verified Food Battle Champion Packages
                </h3>
              </div>
              <p className="text-xs text-[#121212]/75 mb-4">
                Champion packages are strictly reserved for restaurants that won a verified, completed food fight.
                The badge itself is earned and cannot be bought; packages provide social artwork, counter QR standees, and victory promotion.
              </p>

              {championWins.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-[#121212]/30 p-8 text-center text-xs font-mono text-[#121212]/60">
                  {selectedRestaurant.name} has not won a completed food fight battle yet.
                  Participate in community battles and win the vote to unlock Champion packages!
                </div>
              ) : (
                <div className="space-y-4">
                  {championWins.map((win) => (
                    <div
                      key={win.battleId}
                      className="rounded-2xl border-2 border-[#121212] bg-[#FFD11A]/10 p-5 shadow-[4px_4px_0px_#121212]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b-2 border-[#121212] pb-3">
                        <div>
                          <span className="stamp-tag bg-[#FFD11A] text-[#121212] text-[9px] mb-1">
                            VERIFIED ORGANIC CHAMPION
                          </span>
                          <h4 className="text-sm font-black text-[#121212] uppercase">
                            Winner of: {win.battleTitle}
                          </h4>
                          <span className="font-mono text-xs font-bold text-[#121212]/70">
                            Won with {win.winningPercent}% votes ({win.winningVotes.toLocaleString()} votes)
                          </span>
                        </div>

                        <span className="font-mono text-xs font-black text-[#00B26B]">
                          Achievement Verified ✓
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="rounded-xl border border-[#121212] bg-white p-3 flex flex-col justify-between">
                          <div>
                            <h5 className="text-xs font-black text-[#121212]">Champion Spotlight Package</h5>
                            <p className="text-[11px] text-[#121212]/70 my-1">
                              Victory crest on leaderboard + printable QR standee + social media certificate card.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#121212]/15">
                            <span className="font-mono text-xs font-black text-[#00B26B]">₹1,499</span>
                            <button
                              disabled={!isChampionActive}
                              onClick={() => handleClaimChampionPackage(win.battleId, 'pkg_champion_spotlight')}
                              className={`rounded-lg border border-[#121212] px-2.5 py-1 text-[10px] font-bold uppercase font-mono ${
                                isChampionActive ? 'bg-[#FFD11A] text-[#121212]' : 'bg-[#DDD4C2] text-[#121212]/40'
                              }`}
                            >
                              {isChampionActive ? 'Claim Package' : 'Disabled (Coming Soon)'}
                            </button>
                          </div>
                        </div>

                        <div className="rounded-xl border border-[#121212] bg-white p-3 flex flex-col justify-between">
                          <div>
                            <h5 className="text-xs font-black text-[#121212]">Champion Legend Showcase</h5>
                            <p className="text-[11px] text-[#121212]/70 my-1">
                              Hall of Fame feature + Challenger Arena Defending Champion branding + diner acquisition offer.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#121212]/15">
                            <span className="font-mono text-xs font-black text-[#00B26B]">₹2,999</span>
                            <button
                              disabled={!isChampionActive}
                              onClick={() => handleClaimChampionPackage(win.battleId, 'pkg_champion_feature')}
                              className={`rounded-lg border border-[#121212] px-2.5 py-1 text-[10px] font-bold uppercase font-mono ${
                                isChampionActive ? 'bg-[#FFD11A] text-[#121212]' : 'bg-[#DDD4C2] text-[#121212]/40'
                              }`}
                            >
                              {isChampionActive ? 'Claim Package' : 'Disabled (Coming Soon)'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: CUSTOMER ACQUISITION OFFERS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="poster-card p-5 bg-[#FFFFFF]">
              <div className="mb-4">
                <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px] mb-1">
                  GROWTH ENGINE
                </span>
                <h3 className="text-base font-black uppercase text-[#121212]">
                  Create Customer Acquisition Offer
                </h3>
                <p className="text-xs text-[#121212]/70">
                  Incentivize food fight voters to visit your restaurant with single-use promotional discounts.
                </p>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block mb-1">
                      Offer Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹30 Off on Signature Dish"
                      value={offerTitle}
                      onChange={(e) => setOfferTitle(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block mb-1">
                      Discount (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={offerDiscount}
                      onChange={(e) => setOfferDiscount(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-2 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block mb-1">
                      Min Order Value (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={offerMinOrder}
                      onChange={(e) => setOfferMinOrder(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-2 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-[#121212]/60">
                    Pricing: ₹30 fee per verified in-store redemption
                  </span>

                  <button
                    type="submit"
                    disabled={isCreatingOffer || !isOffersActive}
                    className={`rounded-xl border-2 border-[#121212] px-4 py-2 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_#121212] ${
                      isOffersActive
                        ? 'bg-[#FFD11A] text-[#121212] hover:bg-[#e0b815]'
                        : 'bg-[#DDD4C2] text-[#121212]/40 cursor-not-allowed'
                    }`}
                  >
                    {isOffersActive ? 'Publish Offer' : 'Offers Disabled (Coming Soon)'}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Offers */}
            <div className="poster-card p-5 bg-[#FFFFFF]">
              <h3 className="text-base font-black uppercase text-[#121212] mb-3">
                Active Offers for {selectedRestaurant.name}
              </h3>

              {myOffers.length === 0 ? (
                <div className="py-6 text-center text-xs font-mono text-[#121212]/60">
                  No promotional offers created yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {myOffers.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <span className="stamp-tag bg-[#FFD11A] text-[#121212] text-[9px] mb-1">
                          COUPON: {o.couponCode}
                        </span>
                        <h4 className="text-xs font-black text-[#121212]">{o.title}</h4>
                        <p className="text-[10px] text-[#121212]/70 font-mono">
                          Discount: ₹{o.discountValue} (Min order: ₹{o.minOrderValue})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-black text-[#121212] block">
                          Redemptions: {o.redemptionCount} / {o.redemptionLimit}
                        </span>
                        <span className="font-mono text-[9px] text-[#00B26B]">
                          Status: {o.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
