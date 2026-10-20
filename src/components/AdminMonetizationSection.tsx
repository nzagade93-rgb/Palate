'use client';

// ==============================================================================
// PALATE: Admin Monetization Dashboard Section
// Centralized Feature Flag Management, Campaign Approval, Pricing & Audit Trail
// "Build Now, Activate Later" System
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  MonetizationSettings,
  MonetizationOverviewStats,
  CampaignPackage,
  RestaurantCampaign,
  RestaurantOffer,
  OfferRedemption,
  MonetizationAuditLog,
} from '@/lib/monetizationTypes';
import {
  ShieldAlert,
  DollarSign,
  TrendingUp,
  Award,
  Tag,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Eye,
  Check,
  X,
  CreditCard,
  Edit2,
  FileText,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react';

export default function AdminMonetizationSection() {
  const [settings, setSettings] = useState<MonetizationSettings | null>(null);
  const [stats, setStats] = useState<MonetizationOverviewStats | null>(null);
  const [packages, setPackages] = useState<CampaignPackage[]>([]);
  const [campaigns, setCampaigns] = useState<RestaurantCampaign[]>([]);
  const [offers, setOffers] = useState<RestaurantOffer[]>([]);
  const [auditLogs, setAuditLogs] = useState<MonetizationAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active view tab inside monetization
  const [monetizationTab, setMonetizationTab] = useState<'overview' | 'campaigns' | 'pricing' | 'offers' | 'audit'>('overview');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');

  // Confirmation Modal for Feature Toggle
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    featureKey?: keyof MonetizationSettings;
    featureTitle?: string;
    targetState?: boolean;
    checklistPassed?: boolean;
    check1?: boolean;
    check2?: boolean;
    check3?: boolean;
  }>({ isOpen: false });

  // Price Edit Modal
  const [priceModal, setPriceModal] = useState<{
    isOpen: boolean;
    pkg?: CampaignPackage;
    newPrice?: number;
  }>({ isOpen: false });

  // Notification Banner
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load all monetization data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [sRes, cRes, oRes, aRes] = await Promise.all([
        fetch('/api/monetization/settings'),
        fetch('/api/monetization/campaigns'),
        fetch('/api/monetization/offers'),
        fetch('/api/monetization/audit'),
      ]);

      const sData = await sRes.json();
      const cData = await cRes.json();
      const oData = await oRes.json();
      const aData = await aRes.json();

      if (sData.success) {
        setSettings(sData.settings);
        setStats(sData.stats);
        setPackages(sData.packages || []);
      }
      if (cData.success) setCampaigns(cData.campaigns || []);
      if (oData.success) setOffers(oData.offers || []);
      if (aData.success) setAuditLogs(aData.logs || []);
    } catch (err) {
      console.error('Error loading monetization data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Show transient banner
  const notify = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Toggle Feature Flag (with mandatory confirmation when turning ON)
  const handleToggleClick = (featureKey: keyof MonetizationSettings, featureTitle: string, currentState: boolean) => {
    const targetState = !currentState;
    if (targetState === true) {
      // Require activation confirmation & checklist
      setConfirmModal({
        isOpen: true,
        featureKey,
        featureTitle,
        targetState: true,
        check1: false,
        check2: false,
        check3: false,
      });
    } else {
      // Direct deactivation is safe
      executeToggle(featureKey, false);
    }
  };

  const executeToggle = async (featureKey: keyof MonetizationSettings, targetState: boolean) => {
    try {
      const res = await fetch('/api/monetization/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: { [featureKey]: targetState },
          actor: 'admin_console',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        notify('success', `Feature flag updated: ${featureKey} is now ${targetState ? 'ENABLED' : 'DISABLED'}`);
        loadData();
      } else {
        notify('error', data.error || 'Failed to update feature flag');
      }
    } catch {
      notify('error', 'Network error updating settings');
    } finally {
      setConfirmModal({ isOpen: false });
    }
  };

  // Update Package Price
  const handleSavePrice = async () => {
    if (!priceModal.pkg || priceModal.newPrice === undefined) return;
    try {
      const res = await fetch('/api/monetization/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packagePriceUpdates: [
            {
              packageId: priceModal.pkg.id,
              newPriceInPaise: Math.round(priceModal.newPrice * 100),
            },
          ],
          actor: 'admin_console',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPackages(data.packages || []);
        notify('success', `Package price updated to ₹${priceModal.newPrice.toLocaleString('en-IN')}`);
        setPriceModal({ isOpen: false });
        loadData();
      } else {
        notify('error', data.error || 'Price update failed');
      }
    } catch {
      notify('error', 'Network error saving price');
    }
  };

  // Campaign Status Transition (Approve, Reject, Activate, etc.)
  const handleCampaignStatus = async (campaignId: string, newStatus: string, notes?: string) => {
    try {
      const res = await fetch('/api/monetization/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, status: newStatus, actor: 'admin_console', notes }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', `Campaign status changed to ${newStatus.toUpperCase()}`);
        loadData();
      } else {
        notify('error', data.error || 'Status change rejected by server');
      }
    } catch {
      notify('error', 'Network error updating campaign status');
    }
  };

  // Simulate or Record Pilot Payment for internal testing
  const handlePilotPayment = async (campaignId: string) => {
    try {
      const res = await fetch('/api/monetization/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          providerOrderId: `order_pilot_${Date.now()}`,
          providerPaymentId: `pay_pilot_${Date.now()}`,
          idempotencyKey: `idemp_${Date.now()}_${campaignId}`,
          isPilot: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify('success', 'Admin Pilot Payment recorded. Campaign is now marked PAID.');
        loadData();
      } else {
        notify('error', data.error || 'Pilot payment failed');
      }
    } catch {
      notify('error', 'Network error executing pilot payment');
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (campaignFilter === 'all') return true;
    return c.status === campaignFilter;
  });

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`rounded-xl border-2 border-[#121212] p-3 text-xs font-bold font-mono shadow-[2px_2px_0px_#121212] ${
            feedbackMsg.type === 'success' ? 'bg-[#00B26B] text-white' : 'bg-red-600 text-white'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* Master Warning / Dormant Notice */}
      {settings && !settings.monetization_enabled && (
        <div className="rounded-2xl border-[2.5px] border-[#121212] bg-[#FFD11A] p-4 text-[#121212] shadow-[4px_4px_0px_#121212]">
          <div className="flex items-start space-x-3">
            <Lock className="h-6 w-6 shrink-0 mt-0.5 text-[#121212]" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px]">
                  DORMANT STATE
                </span>
                <h3 className="text-sm font-black uppercase tracking-tight">
                  Monetization Infrastructure is INACTIVE (Disabled by Default)
                </h3>
              </div>
              <p className="mt-1 text-xs font-bold leading-relaxed text-[#121212]/80">
                All paid features, restaurant checkout endpoints, and sponsored placements are strictly locked server-side.
                PALATE users vote and discover 100% free. Activate individual monetization features below only when ready for the pilot group.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-[#121212] pb-3">
        <button
          onClick={() => setMonetizationTab('overview')}
          className={`rounded-xl border-2 border-[#121212] px-3.5 py-1.5 text-xs font-black uppercase transition-all ${
            monetizationTab === 'overview'
              ? 'bg-[#121212] text-[#FFD11A] shadow-[2px_2px_0px_#121212]'
              : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
          }`}
        >
          Overview & Controls
        </button>

        <button
          onClick={() => setMonetizationTab('campaigns')}
          className={`rounded-xl border-2 border-[#121212] px-3.5 py-1.5 text-xs font-black uppercase transition-all ${
            monetizationTab === 'campaigns'
              ? 'bg-[#121212] text-[#FFD11A] shadow-[2px_2px_0px_#121212]'
              : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
          }`}
        >
          Campaigns ({campaigns.length})
        </button>

        <button
          onClick={() => setMonetizationTab('pricing')}
          className={`rounded-xl border-2 border-[#121212] px-3.5 py-1.5 text-xs font-black uppercase transition-all ${
            monetizationTab === 'pricing'
              ? 'bg-[#121212] text-[#FFD11A] shadow-[2px_2px_0px_#121212]'
              : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
          }`}
        >
          Package Pricing ({packages.length})
        </button>

        <button
          onClick={() => setMonetizationTab('offers')}
          className={`rounded-xl border-2 border-[#121212] px-3.5 py-1.5 text-xs font-black uppercase transition-all ${
            monetizationTab === 'offers'
              ? 'bg-[#121212] text-[#FFD11A] shadow-[2px_2px_0px_#121212]'
              : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
          }`}
        >
          Offers & Redemptions ({offers.length})
        </button>

        <button
          onClick={() => setMonetizationTab('audit')}
          className={`rounded-xl border-2 border-[#121212] px-3.5 py-1.5 text-xs font-black uppercase transition-all ${
            monetizationTab === 'audit'
              ? 'bg-[#121212] text-[#FFD11A] shadow-[2px_2px_0px_#121212]'
              : 'bg-[#FFFFFF] text-[#121212] hover:bg-[#F6EFE2]'
          }`}
        >
          Audit Log ({auditLogs.length})
        </button>

        <button
          onClick={loadData}
          className="ml-auto rounded-xl border-2 border-[#121212] bg-[#FFFFFF] p-1.5 text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A]"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & FEATURE CONTROLS */}
      {/* ---------------------------------------------------------------------- */}
      {monetizationTab === 'overview' && (
        <div className="space-y-6">
          {/* Revenue & Volume Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border-2 border-[#121212] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#121212]">
              <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block mb-1">
                Total Monetization Revenue
              </span>
              <span className="font-mono text-2xl font-black text-[#00B26B] block">
                ₹{((stats?.totalRevenuePaise || 0) / 100).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-mono text-[#121212]/50">
                {stats?.totalRevenuePaise === 0 ? 'Empty (No paid transactions yet)' : 'Actual Gateway & Pilot Volume'}
              </span>
            </div>

            <div className="rounded-2xl border-2 border-[#121212] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#121212]">
              <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block mb-1">
                Paid / Active Campaigns
              </span>
              <span className="font-mono text-2xl font-black text-[#2748FF] block">
                {stats?.paidCampaignsCount || 0} / {stats?.activeCampaignsCount || 0}
              </span>
              <span className="text-[10px] font-mono text-[#121212]/50">
                {stats?.pendingApprovalsCount || 0} Pending Approvals
              </span>
            </div>

            <div className="rounded-2xl border-2 border-[#121212] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#121212]">
              <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block mb-1">
                Verified Redemptions
              </span>
              <span className="font-mono text-2xl font-black text-[#FF5C9A] block">
                {stats?.verifiedBillableRedemptions || 0}
              </span>
              <span className="text-[10px] font-mono text-[#121212]/50">
                Anti-fraud single-use enforced
              </span>
            </div>

            <div className="rounded-2xl border-2 border-[#121212] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#121212]">
              <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block mb-1">
                Monetization Status
              </span>
              <span
                className={`font-mono text-lg font-black block uppercase ${
                  settings?.monetization_enabled ? 'text-[#00B26B]' : 'text-red-600'
                }`}
              >
                {settings?.monetization_enabled ? 'MASTER SWITCH ON' : 'DISABLED (LOCKED)'}
              </span>
              <span className="text-[10px] font-mono text-[#121212]/50">
                Updated: {settings?.updated_at ? new Date(settings.updated_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {/* Centralized Feature Controls Table */}
          <div className="poster-card p-5 bg-[#FFFFFF]">
            <div className="flex items-center justify-between mb-4 border-b-2 border-[#121212] pb-3">
              <div>
                <h3 className="text-base font-black uppercase text-[#121212]">
                  Monetization Feature Flags (Server-Enforced)
                </h3>
                <p className="text-xs text-[#121212]/70 font-medium">
                  Independent switches. Turning off a feature blocks new purchases without deleting existing financial data.
                </p>
              </div>

              {settings && (
                <button
                  onClick={() =>
                    handleToggleClick(
                      'monetization_enabled',
                      'Monetization Master Switch',
                      settings.monetization_enabled
                    )
                  }
                  className={`rounded-xl border-2 border-[#121212] px-4 py-2 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_#121212] transition-all ${
                    settings.monetization_enabled
                      ? 'bg-[#00B26B] text-white hover:bg-[#009e5f]'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {settings.monetization_enabled ? 'MASTER SWITCH: ACTIVE' : 'TURN MASTER SWITCH ON'}
                </button>
              )}
            </div>

            {settings && (
              <div className="divide-y divide-[#121212]/15">
                {/* 1. Sponsored Food Battles */}
                <FeatureToggleRow
                  title="Sponsored Food Battles"
                  description="Promotional placement for restaurants around food fight matchups. Does NOT buy votes or alter organic rankings."
                  isEnabled={settings.sponsored_battles_enabled}
                  isMasterEnabled={settings.monetization_enabled}
                  onToggle={() =>
                    handleToggleClick(
                      'sponsored_battles_enabled',
                      'Sponsored Food Battles',
                      settings.sponsored_battles_enabled
                    )
                  }
                />

                {/* 2. Champion Packages */}
                <FeatureToggleRow
                  title="Restaurant Champion Packages"
                  description="Optional marketing artwork and standees for restaurants that won a verified food battle. Earned achievements only."
                  isEnabled={settings.champion_packages_enabled}
                  isMasterEnabled={settings.monetization_enabled}
                  onToggle={() =>
                    handleToggleClick(
                      'champion_packages_enabled',
                      'Restaurant Champion Packages',
                      settings.champion_packages_enabled
                    )
                  }
                />

                {/* 3. Restaurant Offers & Redemptions */}
                <FeatureToggleRow
                  title="Restaurant Offers & Customer Acquisition"
                  description="Diner discounts (e.g. ₹30 Off) with single-use anti-fraud coupon codes and billable redemption pricing."
                  isEnabled={settings.restaurant_offers_enabled}
                  isMasterEnabled={settings.monetization_enabled}
                  onToggle={() =>
                    handleToggleClick(
                      'restaurant_offers_enabled',
                      'Restaurant Offers & Customer Acquisition',
                      settings.restaurant_offers_enabled
                    )
                  }
                />

                {/* 4. Brand Sponsorships */}
                <FeatureToggleRow
                  title="Brand Sponsorships"
                  description="City-wide commercial partnerships and arena sponsor banners. Manually reviewed and administered."
                  isEnabled={settings.brand_sponsorships_enabled}
                  isMasterEnabled={settings.monetization_enabled}
                  onToggle={() =>
                    handleToggleClick(
                      'brand_sponsorships_enabled',
                      'Brand Sponsorships',
                      settings.brand_sponsorships_enabled
                    )
                  }
                />

                {/* 5. Self-Service Purchasing */}
                <FeatureToggleRow
                  title="Restaurant Self-Service Purchasing"
                  description="Allows verified restaurants to self-checkout campaigns via gateway. When OFF, orders require manual approval."
                  isEnabled={settings.self_service_purchasing_enabled}
                  isMasterEnabled={settings.monetization_enabled}
                  onToggle={() =>
                    handleToggleClick(
                      'self_service_purchasing_enabled',
                      'Restaurant Self-Service Purchasing',
                      settings.self_service_purchasing_enabled
                    )
                  }
                />

                {/* 6. Paid Restaurant Dashboard */}
                <FeatureToggleRow
                  title="Restaurant Dashboard Paid Tools"
                  description="Unlocks campaign creation wizards in restaurant dashboard. When OFF, features display as 'Coming Soon'."
                  isEnabled={settings.paid_restaurant_dashboard_enabled}
                  isMasterEnabled={settings.monetization_enabled}
                  onToggle={() =>
                    handleToggleClick(
                      'paid_restaurant_dashboard_enabled',
                      'Restaurant Dashboard Paid Tools',
                      settings.paid_restaurant_dashboard_enabled
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 2: CAMPAIGN MANAGEMENT */}
      {/* ---------------------------------------------------------------------- */}
      {monetizationTab === 'campaigns' && (
        <div className="poster-card p-5 bg-[#FFFFFF]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b-2 border-[#121212] pb-3">
            <div>
              <h3 className="text-base font-black uppercase text-[#121212]">
                Campaign Moderation & Status Control
              </h3>
              <p className="text-xs text-[#121212]/70">
                Filter campaigns, review submitted copy, and manage publication states.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {['all', 'pending_approval', 'approved', 'scheduled', 'active', 'completed', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setCampaignFilter(f)}
                  className={`rounded-lg border border-[#121212] px-2.5 py-1 uppercase font-bold ${
                    campaignFilter === f ? 'bg-[#FFD11A] text-[#121212]' : 'bg-[#F6EFE2] text-[#121212]/70'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#121212]/60">
              No campaigns found under filter "{campaignFilter}". Real submissions will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#121212] font-mono text-[11px] font-black uppercase text-[#121212]/70">
                    <th className="py-2 pr-3">Campaign & Restaurant</th>
                    <th className="py-2 pr-3">Package / Price</th>
                    <th className="py-2 pr-3">Type</th>
                    <th className="py-2 pr-3">Payment</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-b border-[#121212]/20 font-bold">
                  {filteredCampaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-[#F6EFE2]/50">
                      <td className="py-3 pr-3">
                        <span className="font-black text-[#121212] block">{camp.campaignName}</span>
                        <span className="text-[10px] text-[#121212]/60 font-mono">
                          {camp.restaurantName} • {camp.relatedBattleTitle || 'City Wide'}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span className="font-mono text-[#121212] block">{camp.packageName}</span>
                        <span className="font-mono text-[11px] text-[#00B26B]">
                          ₹{(camp.priceInPaise / 100).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px]">
                          {camp.campaignType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-black uppercase border border-[#121212] ${
                            camp.paymentStatus === 'paid' ? 'bg-[#00B26B] text-white' : 'bg-[#FFD11A] text-[#121212]'
                          }`}
                        >
                          {camp.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-black uppercase border border-[#121212] ${
                            camp.status === 'active'
                              ? 'bg-[#00B26B] text-white'
                              : camp.status === 'pending_approval'
                              ? 'bg-[#FF5C9A] text-white'
                              : 'bg-[#DDD4C2] text-[#121212]'
                          }`}
                        >
                          {camp.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-1 whitespace-nowrap">
                        {camp.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => handleCampaignStatus(camp.id, 'approved')}
                              className="rounded-lg bg-[#00B26B] px-2 py-1 text-[10px] font-bold text-white border border-[#121212]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleCampaignStatus(camp.id, 'rejected', 'Violates guidelines')}
                              className="rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white border border-[#121212]"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {camp.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => handlePilotPayment(camp.id)}
                            className="rounded-lg bg-[#FFD11A] px-2 py-1 text-[10px] font-bold text-[#121212] border border-[#121212]"
                            title="Simulate Pilot Payment"
                          >
                            Mark Paid (Pilot)
                          </button>
                        )}

                        {camp.status === 'approved' && camp.paymentStatus === 'paid' && (
                          <button
                            onClick={() => handleCampaignStatus(camp.id, 'active')}
                            className="rounded-lg bg-[#2748FF] px-2 py-1 text-[10px] font-bold text-white border border-[#121212]"
                          >
                            Activate Now
                          </button>
                        )}

                        {camp.status === 'active' && (
                          <button
                            onClick={() => handleCampaignStatus(camp.id, 'completed')}
                            className="rounded-lg bg-[#121212] px-2 py-1 text-[10px] font-bold text-white border border-[#121212]"
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 3: PACKAGE PRICING CONFIGURATION */}
      {/* ---------------------------------------------------------------------- */}
      {monetizationTab === 'pricing' && (
        <div className="poster-card p-5 bg-[#FFFFFF]">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#121212] pb-3">
            <div>
              <h3 className="text-base font-black uppercase text-[#121212]">
                Monetization Packages & Deliverables
              </h3>
              <p className="text-xs text-[#121212]/70">
                Configurable package prices in Indian Rupees (INR). Update without code redeployment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col justify-between rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-4 shadow-[3px_3px_0px_#121212]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="stamp-tag bg-[#121212] text-[#FFD11A] text-[9px]">
                      {pkg.type.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#121212]/60">
                      Min {pkg.minDurationDays} Days
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-[#121212] mb-1">{pkg.name}</h4>
                  <p className="text-xs text-[#121212]/75 mb-3">{pkg.description}</p>

                  <div className="mb-3 space-y-1">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block">
                      Included Deliverables:
                    </span>
                    {pkg.deliverables.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-[11px] font-medium text-[#121212]/80">
                        <Check className="h-3 w-3 shrink-0 mt-0.5 text-[#00B26B]" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#121212]/20 pt-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block">
                      Package Price
                    </span>
                    <span className="font-mono text-lg font-black text-[#00B26B]">
                      ₹{(pkg.priceInPaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setPriceModal({
                        isOpen: true,
                        pkg,
                        newPrice: pkg.priceInPaise / 100,
                      })
                    }
                    className="flex items-center space-x-1 rounded-lg border-2 border-[#121212] bg-[#FFFFFF] px-2.5 py-1 text-xs font-bold text-[#121212] shadow-[2px_2px_0px_#121212] hover:bg-[#FFD11A]"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit Price</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 4: OFFERS & REDEMPTIONS */}
      {/* ---------------------------------------------------------------------- */}
      {monetizationTab === 'offers' && (
        <div className="poster-card p-5 bg-[#FFFFFF]">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#121212] pb-3">
            <div>
              <h3 className="text-base font-black uppercase text-[#121212]">
                Customer Acquisition Offers & Redemption Reports
              </h3>
              <p className="text-xs text-[#121212]/70">
                Anti-fraud verified redemptions billed at agreed fees (e.g. ₹30/verified redemption).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border-2 border-[#121212] bg-[#F6EFE2] p-4 gap-3 shadow-[2px_2px_0px_#121212]"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="stamp-tag bg-[#FFD11A] text-[#121212] text-[9px]">
                      COUPON: {offer.couponCode}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#121212]/70">
                      {offer.restaurantName}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-[#121212]">{offer.title}</h4>
                  <p className="text-[11px] text-[#121212]/75 mt-0.5">{offer.description}</p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className="font-mono text-sm font-black text-[#121212] block">
                      {offer.redemptionCount} / {offer.redemptionLimit}
                    </span>
                    <span className="font-mono text-[10px] text-[#00B26B]">
                      Fee: ₹{offer.billableFeePerRedemptionPaise / 100}/diner
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-black uppercase border border-[#121212] ${
                      offer.status === 'active' ? 'bg-[#00B26B] text-white' : 'bg-[#DDD4C2] text-[#121212]'
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 5: AUDIT LOG */}
      {/* ---------------------------------------------------------------------- */}
      {monetizationTab === 'audit' && (
        <div className="poster-card p-5 bg-[#FFFFFF]">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#121212] pb-3">
            <div>
              <h3 className="text-base font-black uppercase text-[#121212]">
                Administrative Audit Trail
              </h3>
              <p className="text-xs text-[#121212]/70">
                Immutable record of all feature switch adjustments, price changes, and approvals.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b-2 border-[#121212] text-[11px] font-black uppercase text-[#121212]/70">
                  <th className="py-2 pr-3">Timestamp</th>
                  <th className="py-2 pr-3">Actor</th>
                  <th className="py-2 pr-3">Action</th>
                  <th className="py-2 pr-3">Entity</th>
                  <th className="py-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b border-[#121212]/20">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F6EFE2]/50 text-[11px]">
                    <td className="py-2 pr-3 text-[#121212]/60 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 font-bold text-[#2748FF]">{log.actor}</td>
                    <td className="py-2 pr-3 font-black text-[#121212]">{log.action}</td>
                    <td className="py-2 pr-3 text-[#121212]/80">{log.affectedEntity}</td>
                    <td className="py-2 text-[#121212]/70">{log.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* CONFIRMATION & ACTIVATION CHECKLIST MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {confirmModal.isOpen && confirmModal.featureKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border-[3px] border-[#121212] bg-[#F6EFE2] p-6 shadow-[8px_8px_0px_#121212]">
            <div className="flex items-center space-x-2 text-[#121212] mb-3">
              <AlertTriangle className="h-6 w-6 text-[#FFD11A]" />
              <h3 className="text-base font-black uppercase tracking-tight">
                Confirm Activation: {confirmModal.featureTitle}
              </h3>
            </div>

            <p className="text-xs text-[#121212]/80 font-medium mb-4">
              Activating a paid feature makes it live for restaurants and campaign submission. Verify the activation checklist:
            </p>

            {/* Mandatory Activation Checklist */}
            <div className="space-y-2.5 rounded-xl border-2 border-[#121212] bg-[#FFFFFF] p-4 mb-5 text-xs font-bold">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmModal.check1}
                  onChange={(e) => setConfirmModal((prev) => ({ ...prev, check1: e.target.checked }))}
                  className="mt-0.5 rounded border-2 border-[#121212]"
                />
                <span>Campaign commercial terms and deliverables are accurate and published.</span>
              </label>

              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmModal.check2}
                  onChange={(e) => setConfirmModal((prev) => ({ ...prev, check2: e.target.checked }))}
                  className="mt-0.5 rounded border-2 border-[#121212]"
                />
                <span>Customer-facing package pricing (in Indian Rupees) has been validated.</span>
              </label>

              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmModal.check3}
                  onChange={(e) => setConfirmModal((prev) => ({ ...prev, check3: e.target.checked }))}
                  className="mt-0.5 rounded border-2 border-[#121212]"
                />
                <span>I understand this action will be permanently recorded in the administrative audit log.</span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setConfirmModal({ isOpen: false })}
                className="btn-white px-3 py-1.5 text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                disabled={!confirmModal.check1 || !confirmModal.check2 || !confirmModal.check3}
                onClick={() => executeToggle(confirmModal.featureKey!, true)}
                className={`rounded-xl border-2 border-[#121212] px-4 py-1.5 font-mono text-xs font-black uppercase shadow-[2px_2px_0px_#121212] ${
                  confirmModal.check1 && confirmModal.check2 && confirmModal.check3
                    ? 'bg-[#00B26B] text-white hover:bg-[#009e5f]'
                    : 'bg-[#DDD4C2] text-[#121212]/40 cursor-not-allowed'
                }`}
              >
                Confirm & Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* PRICE EDIT MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {priceModal.isOpen && priceModal.pkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border-[3px] border-[#121212] bg-[#F6EFE2] p-5 shadow-[6px_6px_0px_#121212]">
            <h3 className="text-sm font-black uppercase text-[#121212] mb-1">
              Edit Package Price: {priceModal.pkg.name}
            </h3>
            <p className="text-xs text-[#121212]/70 mb-3">
              Enter price in Indian Rupees (₹). Will update runtime pricing immediately.
            </p>

            <div className="mb-4">
              <label className="font-mono text-[10px] font-bold uppercase text-[#121212]/60 block mb-1">
                New Price (₹ INR)
              </label>
              <input
                type="number"
                value={priceModal.newPrice || 0}
                onChange={(e) =>
                  setPriceModal((prev) => ({
                    ...prev,
                    newPrice: Number(e.target.value),
                  }))
                }
                className="w-full rounded-xl border-2 border-[#121212] bg-white p-2.5 font-mono text-base font-black text-[#121212] shadow-[2px_2px_0px_#121212]"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setPriceModal({ isOpen: false })}
                className="btn-white px-3 py-1.5 text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrice}
                className="btn-yellow px-4 py-1.5 text-xs font-mono font-bold"
              >
                Save Price
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FeatureToggleRowProps {
  title: string;
  description: string;
  isEnabled: boolean;
  isMasterEnabled: boolean;
  onToggle: () => void;
}

function FeatureToggleRow({
  title,
  description,
  isEnabled,
  isMasterEnabled,
  onToggle,
}: FeatureToggleRowProps) {
  const isEffectiveActive = isMasterEnabled && isEnabled;

  return (
    <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="pr-4">
        <div className="flex items-center space-x-2">
          <span
            className={`h-2.5 w-2.5 rounded-full border border-[#121212] ${
              isEffectiveActive ? 'bg-[#00B26B]' : 'bg-red-500'
            }`}
          />
          <h4 className="text-xs font-black text-[#121212] uppercase">{title}</h4>
        </div>
        <p className="text-[11px] text-[#121212]/75 mt-0.5 leading-snug">{description}</p>
      </div>

      <div className="flex items-center space-x-3 shrink-0">
        <span
          className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-[#121212] ${
            isEffectiveActive
              ? 'bg-[#00B26B] text-white'
              : 'bg-[#DDD4C2] text-[#121212]/70'
          }`}
        >
          {isEffectiveActive ? 'ENABLED' : 'DISABLED'}
        </span>

        <button
          onClick={onToggle}
          className={`rounded-xl border-2 border-[#121212] px-3 py-1 font-mono text-[11px] font-black uppercase shadow-[2px_2px_0px_#121212] transition-all ${
            isEnabled
              ? 'bg-[#121212] text-white hover:bg-red-600'
              : 'bg-[#FFD11A] text-[#121212] hover:bg-[#e0b815]'
          }`}
        >
          {isEnabled ? 'Turn Off' : 'Activate'}
        </button>
      </div>
    </div>
  );
}
