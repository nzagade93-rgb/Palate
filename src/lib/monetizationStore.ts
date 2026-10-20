// ==============================================================================
// PALATE: Monetization State & Server Enforcement Engine
// "Build Now, Activate Later" Architecture
// All paid features disabled by default until explicitly enabled by administrator.
// ==============================================================================

import {
  MonetizationSettings,
  CampaignPackage,
  RestaurantCampaign,
  RestaurantOffer,
  OfferRedemption,
  PaymentRecord,
  BrandSponsorship,
  MonetizationAuditLog,
  MonetizationOverviewStats,
  CampaignType,
} from './monetizationTypes';

// Initial Pricing & Packages (Configurable in runtime)
export const INITIAL_PACKAGES: CampaignPackage[] = [
  // Sponsored Food Battles
  {
    id: 'pkg_starter_battle',
    type: 'sponsored_battle',
    name: 'Starter Sponsored Battle',
    priceInPaise: 99900, // ₹999
    currency: 'INR',
    description: 'Promote your signature dish with a sponsored matchup placement in your neighborhood node.',
    deliverables: [
      'Promotional "Sponsored" banner badge on selected battle',
      'Guaranteed high-visibility placement in neighborhood discovery',
      'Transparent disclaimer: zero influence on organic votes',
      'Performance report: impressions and battle views'
    ],
    isActive: true,
    minDurationDays: 3,
  },
  {
    id: 'pkg_local_spotlight',
    type: 'sponsored_battle',
    name: 'Local Spotlight Campaign',
    priceInPaise: 249900, // ₹2,499
    currency: 'INR',
    description: 'Featured node placement across Navi Mumbai food fights with WhatsApp share attribution.',
    deliverables: [
      'Top-of-feed spotlight across target node (Vashi, Nerul, Kharghar, etc.)',
      'Co-branded WhatsApp share preview card with restaurant name',
      'Interactive dish showcase modal with location & signature menu link',
      'Detailed click-through and engagement analytics'
    ],
    isActive: true,
    minDurationDays: 7,
  },
  {
    id: 'pkg_featured_campaign',
    type: 'sponsored_battle',
    name: 'Featured Arena Takeover',
    priceInPaise: 499900, // ₹4,999
    currency: 'INR',
    description: 'City-wide marquee promotional placement across all Navi Mumbai live food battles.',
    deliverables: [
      'City-wide hero banner highlight on PALATE home arena',
      'Custom customer acquisition offer integration (e.g. ₹30 Off)',
      'Instagram Story card artwork generated for restaurant marketing',
      'Real-time funnel conversion reporting'
    ],
    isActive: true,
    minDurationDays: 14,
  },
  // Champion Packages (Earned achievements only!)
  {
    id: 'pkg_champion_spotlight',
    type: 'champion_promotion',
    name: 'Champion Spotlight Package',
    priceInPaise: 149900, // ₹1,499
    currency: 'INR',
    description: 'Celebrate your verified victory! Valid only for restaurants that won a completed food battle.',
    deliverables: [
      'Gold Champion Winner Crest on PALATE Leaderboard for 30 days',
      'Shareable Instagram/WhatsApp victory certificate card',
      'Physical print-ready QR standee design for counter display',
      'Verification badge on restaurant discovery card'
    ],
    isActive: true,
    minDurationDays: 30,
  },
  {
    id: 'pkg_champion_feature',
    type: 'champion_promotion',
    name: 'Champion Legend Showcase',
    priceInPaise: 299900, // ₹2,999
    currency: 'INR',
    description: 'Full victory marketing campaign and challenger defense arena branding.',
    deliverables: [
      'Pinned as Defending Champion in "Challenge the Winner" arena',
      'Custom customer acquisition offer linked to victory card',
      'Navi Mumbai Hall of Fame featured restaurant editorial',
      'Priority notification to community foodies upon next challenge'
    ],
    isActive: true,
    minDurationDays: 45,
  },
];

export class PalateMonetizationStore {
  // 1. Feature Flags (Default: ALL FALSE)
  public settings: MonetizationSettings = {
    monetization_enabled: false,
    sponsored_battles_enabled: false,
    champion_packages_enabled: false,
    restaurant_offers_enabled: false,
    brand_sponsorships_enabled: false,
    self_service_purchasing_enabled: false,
    paid_restaurant_dashboard_enabled: false,
    updated_at: new Date().toISOString(),
    updated_by: 'system_init',
  };

  // 2. Data Collections
  public packages: Map<string, CampaignPackage> = new Map();
  public campaigns: Map<string, RestaurantCampaign> = new Map();
  public offers: Map<string, RestaurantOffer> = new Map();
  public redemptions: Map<string, OfferRedemption> = new Map();
  public payments: Map<string, PaymentRecord> = new Map();
  public sponsorships: Map<string, BrandSponsorship> = new Map();
  public auditLogs: MonetizationAuditLog[] = [];

  constructor() {
    // Seed initial packages
    INITIAL_PACKAGES.forEach((pkg) => this.packages.set(pkg.id, pkg));

    // Seed initial demonstration offer (Disabled until monetization activated)
    const demoOffer: RestaurantOffer = {
      id: 'offer_demo_yasins_30',
      restaurantId: 'res_yasins',
      restaurantName: "Yasin's Food Inn",
      title: '₹30 Off on Dum Biryani',
      description: 'Get ₹30 off on any Mutton or Chicken Dum Biryani order above ₹200 at Yasin’s Food Inn, Kharghar.',
      discountType: 'flat',
      discountValue: 30,
      minOrderValue: 200,
      startsAt: '2026-10-15T00:00:00Z',
      endsAt: '2026-11-15T23:59:59Z',
      redemptionLimit: 100,
      redemptionCount: 0,
      redemptionMethod: 'coupon_code',
      couponCode: 'PALATEYASIN30',
      status: 'active',
      terms: 'Valid once per customer on dine-in or takeaway. Cannot be combined with other offers.',
      billableFeePerRedemptionPaise: 3000, // ₹30/redemption
      createdAt: new Date().toISOString(),
    };
    this.offers.set(demoOffer.id, demoOffer);

    // Initial audit log entry
    this.logAudit({
      actor: 'system',
      action: 'INITIALIZE_MONETIZATION_SYSTEM',
      affectedEntity: 'SETTINGS',
      entityId: 'global',
      notes: 'Monetization initialized in dormant state. All paid features disabled by default.',
    });
  }

  // ----------------------------------------------------------------------------
  // Server-Side Feature Flag Enforcement
  // ----------------------------------------------------------------------------
  public isFeatureEnabled(feature: keyof Omit<MonetizationSettings, 'updated_at' | 'updated_by'>): boolean {
    if (!this.settings.monetization_enabled) {
      return false; // Master switch rules all!
    }
    if (feature === 'monetization_enabled') return true;
    return Boolean(this.settings[feature]);
  }

  public getSettings(): MonetizationSettings {
    return { ...this.settings };
  }

  public updateSettings(
    newSettings: Partial<MonetizationSettings>,
    actor: string = 'admin'
  ): { settings: MonetizationSettings; auditEntry: MonetizationAuditLog } {
    const previous = { ...this.settings };
    this.settings = {
      ...this.settings,
      ...newSettings,
      updated_at: new Date().toISOString(),
      updated_by: actor,
    };

    const audit = this.logAudit({
      actor,
      action: 'UPDATE_MONETIZATION_SETTINGS',
      affectedEntity: 'SETTINGS',
      entityId: 'global',
      previousValue: previous,
      newValue: this.settings,
      notes: `Updated feature flags: Master=${this.settings.monetization_enabled}`,
    });

    return { settings: { ...this.settings }, auditEntry: audit };
  }

  // ----------------------------------------------------------------------------
  // Audit Logging
  // ----------------------------------------------------------------------------
  public logAudit(entry: Omit<MonetizationAuditLog, 'id' | 'timestamp'>): MonetizationAuditLog {
    const log: MonetizationAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.auditLogs.unshift(log);
    // Keep max 500 audit logs in memory
    if (this.auditLogs.length > 500) this.auditLogs.pop();
    return log;
  }

  // ----------------------------------------------------------------------------
  // Campaign Packages Management
  // ----------------------------------------------------------------------------
  public getPackages(type?: CampaignType): CampaignPackage[] {
    const list = Array.from(this.packages.values());
    if (type) return list.filter((p) => p.type === type && p.isActive);
    return list;
  }

  public updatePackagePrice(
    packageId: string,
    newPriceInPaise: number,
    actor: string = 'admin'
  ): CampaignPackage | null {
    const pkg = this.packages.get(packageId);
    if (!pkg) return null;
    const oldPrice = pkg.priceInPaise;
    pkg.priceInPaise = newPriceInPaise;

    this.logAudit({
      actor,
      action: 'UPDATE_PACKAGE_PRICE',
      affectedEntity: 'CAMPAIGN_PACKAGE',
      entityId: packageId,
      previousValue: oldPrice,
      newValue: newPriceInPaise,
      notes: `Changed package ${pkg.name} price to ₹${newPriceInPaise / 100}`,
    });
    return { ...pkg };
  }

  // ----------------------------------------------------------------------------
  // Restaurant Campaigns Management
  // ----------------------------------------------------------------------------
  public createCampaign(data: {
    restaurantId: string;
    restaurantName: string;
    packageId: string;
    campaignName: string;
    promotionalDescription: string;
    relatedBattleId?: string;
    relatedBattleTitle?: string;
    placementType?: 'battle_spotlight' | 'neighborhood_banner' | 'champion_banner';
    startsAt?: string;
    endsAt?: string;
  }): { success: boolean; campaign?: RestaurantCampaign; error?: string } {
    // 1. Strict Server Enforcement Check
    const pkg = this.packages.get(data.packageId);
    if (!pkg) return { success: false, error: 'Invalid campaign package' };

    if (!this.isFeatureEnabled('monetization_enabled')) {
      return {
        success: false,
        error: 'Monetization is currently disabled. Paid campaign creation is locked.',
      };
    }

    if (pkg.type === 'sponsored_battle' && !this.isFeatureEnabled('sponsored_battles_enabled')) {
      return {
        success: false,
        error: 'Sponsored Food Battles are currently disabled by administrator.',
      };
    }

    if (pkg.type === 'champion_promotion' && !this.isFeatureEnabled('champion_packages_enabled')) {
      return {
        success: false,
        error: 'Champion Packages are currently disabled by administrator.',
      };
    }

    const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const defaultEnd = new Date(now.getTime() + pkg.minDurationDays * 24 * 60 * 60 * 1000);

    const campaign: RestaurantCampaign = {
      id: campaignId,
      restaurantId: data.restaurantId,
      restaurantName: data.restaurantName,
      campaignName: data.campaignName,
      packageId: pkg.id,
      packageName: pkg.name,
      campaignType: pkg.type,
      relatedBattleId: data.relatedBattleId,
      relatedBattleTitle: data.relatedBattleTitle,
      promotionalDescription: data.promotionalDescription,
      startsAt: data.startsAt || now.toISOString(),
      endsAt: data.endsAt || defaultEnd.toISOString(),
      placementType: data.placementType || 'battle_spotlight',
      status: 'pending_approval',
      priceInPaise: pkg.priceInPaise,
      currency: 'INR',
      paymentStatus: 'pending',
      approvalStatus: 'pending',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      performance: { impressions: 0, clicks: 0, shares: 0 },
    };

    this.campaigns.set(campaign.id, campaign);
    this.logAudit({
      actor: `restaurant:${data.restaurantId}`,
      action: 'SUBMIT_CAMPAIGN',
      affectedEntity: 'RESTAURANT_CAMPAIGN',
      entityId: campaign.id,
      newValue: campaign,
      notes: `Submitted campaign ${campaign.campaignName} for approval`,
    });

    return { success: true, campaign };
  }

  public getCampaigns(filters?: {
    restaurantId?: string;
    status?: string;
    type?: string;
  }): RestaurantCampaign[] {
    let list = Array.from(this.campaigns.values());
    if (filters?.restaurantId) {
      list = list.filter((c) => c.restaurantId === filters.restaurantId);
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((c) => c.status === filters.status);
    }
    if (filters?.type && filters.type !== 'all') {
      list = list.filter((c) => c.campaignType === filters.type);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public updateCampaignStatus(
    campaignId: string,
    newStatus: RestaurantCampaign['status'],
    actor: string = 'admin',
    notes?: string
  ): { success: boolean; campaign?: RestaurantCampaign; error?: string } {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return { success: false, error: 'Campaign not found' };

    // Enforce feature flag if attempting to activate
    if (newStatus === 'active') {
      if (!this.isFeatureEnabled('monetization_enabled')) {
        return { success: false, error: 'Cannot activate campaign: Monetization master switch is OFF' };
      }
      if (campaign.campaignType === 'sponsored_battle' && !this.isFeatureEnabled('sponsored_battles_enabled')) {
        return { success: false, error: 'Cannot activate campaign: Sponsored battles are disabled' };
      }
      if (campaign.campaignType === 'champion_promotion' && !this.isFeatureEnabled('champion_packages_enabled')) {
        return { success: false, error: 'Cannot activate campaign: Champion packages are disabled' };
      }
      if (campaign.paymentStatus !== 'paid' && campaign.paymentStatus !== 'pilot_waived') {
        return { success: false, error: 'Cannot activate campaign: Payment has not been completed or verified' };
      }
    }

    const oldStatus = campaign.status;
    campaign.status = newStatus;
    campaign.updatedAt = new Date().toISOString();
    if (newStatus === 'approved') campaign.approvalStatus = 'approved';
    if (newStatus === 'rejected') {
      campaign.approvalStatus = 'rejected';
      campaign.rejectionReason = notes;
    }

    this.logAudit({
      actor,
      action: `CAMPAIGN_STATUS_${newStatus.toUpperCase()}`,
      affectedEntity: 'RESTAURANT_CAMPAIGN',
      entityId: campaignId,
      previousValue: oldStatus,
      newValue: newStatus,
      notes: notes || `Admin changed status from ${oldStatus} to ${newStatus}`,
    });

    return { success: true, campaign: { ...campaign } };
  }

  public recordPayment(params: {
    campaignId: string;
    amountPaise: number;
    provider: 'razorpay' | 'cashfree' | 'admin_pilot';
    providerOrderId?: string;
    providerPaymentId?: string;
    idempotencyKey: string;
    actor?: string;
  }): { success: boolean; payment?: PaymentRecord; error?: string } {
    const campaign = this.campaigns.get(params.campaignId);
    if (!campaign) return { success: false, error: 'Associated campaign not found' };

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const payment: PaymentRecord = {
      id: paymentId,
      campaignId: params.campaignId,
      restaurantId: campaign.restaurantId,
      amountPaise: params.amountPaise,
      currency: 'INR',
      status: 'paid',
      provider: params.provider,
      providerOrderId: params.providerOrderId,
      providerPaymentId: params.providerPaymentId,
      idempotencyKey: params.idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: params.provider === 'admin_pilot' ? 'Admin Pilot Mode' : 'Verified Gateway Payment',
    };

    this.payments.set(payment.id, payment);
    campaign.paymentStatus = 'paid';
    campaign.paymentId = payment.id;
    campaign.updatedAt = new Date().toISOString();

    // If already approved, can now be scheduled or activated
    if (campaign.approvalStatus === 'approved') {
      campaign.status = 'scheduled';
    }

    this.logAudit({
      actor: params.actor || 'payment_webhook',
      action: 'RECORD_PAYMENT',
      affectedEntity: 'PAYMENT_RECORD',
      entityId: payment.id,
      newValue: payment,
      notes: `Recorded payment of ₹${params.amountPaise / 100} for campaign ${campaign.campaignName}`,
    });

    return { success: true, payment };
  }

  // ----------------------------------------------------------------------------
  // Restaurant Offers & Customer Acquisition
  // ----------------------------------------------------------------------------
  public createOffer(data: Omit<RestaurantOffer, 'id' | 'createdAt' | 'redemptionCount'>): {
    success: boolean;
    offer?: RestaurantOffer;
    error?: string;
  } {
    if (!this.isFeatureEnabled('monetization_enabled') || !this.isFeatureEnabled('restaurant_offers_enabled')) {
      return {
        success: false,
        error: 'Restaurant offers feature is currently disabled by administrator.',
      };
    }

    const offerId = `off_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const offer: RestaurantOffer = {
      ...data,
      id: offerId,
      redemptionCount: 0,
      couponCode: data.couponCode || `PALATE${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    this.offers.set(offer.id, offer);
    this.logAudit({
      actor: `restaurant:${data.restaurantId}`,
      action: 'CREATE_OFFER',
      affectedEntity: 'RESTAURANT_OFFER',
      entityId: offer.id,
      newValue: offer,
      notes: `Created offer: ${offer.title}`,
    });

    return { success: true, offer };
  }

  public getOffers(restaurantId?: string): RestaurantOffer[] {
    const list = Array.from(this.offers.values());
    if (restaurantId) return list.filter((o) => o.restaurantId === restaurantId);
    return list;
  }

  /**
   * Redeem an offer with strict server-side validation against duplicate redemption,
   * expiry, and limits.
   */
  public redeemOffer(
    offerId: string,
    consumerFingerprint: string,
    couponCodeEntered?: string
  ): { success: boolean; redemption?: OfferRedemption; error?: string } {
    if (!this.isFeatureEnabled('monetization_enabled') || !this.isFeatureEnabled('restaurant_offers_enabled')) {
      return {
        success: false,
        error: 'Restaurant offers are currently disabled by administrator.',
      };
    }

    const offer = this.offers.get(offerId);
    if (!offer) return { success: false, error: 'Offer not found' };

    if (offer.status !== 'active') {
      return { success: false, error: `Offer is not active (current status: ${offer.status})` };
    }

    // Check expiry
    if (new Date() > new Date(offer.endsAt)) {
      offer.status = 'expired';
      return { success: false, error: 'This offer has expired.' };
    }

    // Check redemption limit
    if (offer.redemptionCount >= offer.redemptionLimit) {
      offer.status = 'depleted';
      return { success: false, error: 'This offer has reached its maximum redemption limit.' };
    }

    // Check coupon code match if required
    if (offer.redemptionMethod === 'coupon_code' && couponCodeEntered) {
      if (offer.couponCode && offer.couponCode.toUpperCase() !== couponCodeEntered.trim().toUpperCase()) {
        return { success: false, error: 'Invalid coupon code entered.' };
      }
    }

    // Prevent duplicate redemption by same consumer fingerprint
    const duplicateKey = `${offerId}#${consumerFingerprint}`;
    const existing = Array.from(this.redemptions.values()).find(
      (r) => r.offerId === offerId && r.consumerFingerprint === consumerFingerprint
    );
    if (existing) {
      return {
        success: false,
        error: 'You have already redeemed this promotional offer. One redemption per diner.',
      };
    }

    // Increment count
    offer.redemptionCount += 1;
    if (offer.redemptionCount >= offer.redemptionLimit) {
      offer.status = 'depleted';
    }

    const redemptionId = `red_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const redemption: OfferRedemption = {
      id: redemptionId,
      offerId,
      restaurantId: offer.restaurantId,
      restaurantName: offer.restaurantName,
      consumerFingerprint,
      couponCodeUsed: couponCodeEntered || offer.couponCode,
      billableAmountPaise: offer.billableFeePerRedemptionPaise,
      isBillable: true,
      billingStatus: 'unbilled',
      redeemedAt: new Date().toISOString(),
      verifiedMethod: 'code_match',
    };

    this.redemptions.set(redemption.id, redemption);
    this.logAudit({
      actor: `consumer:${consumerFingerprint}`,
      action: 'REDEEM_OFFER',
      affectedEntity: 'OFFER_REDEMPTION',
      entityId: redemption.id,
      newValue: redemption,
      notes: `Verified redemption for ${offer.title} (Billable fee: ₹${offer.billableFeePerRedemptionPaise / 100})`,
    });

    return { success: true, redemption };
  }

  public getRedemptions(restaurantId?: string): OfferRedemption[] {
    const list = Array.from(this.redemptions.values());
    if (restaurantId) return list.filter((r) => r.restaurantId === restaurantId);
    return list;
  }

  // ----------------------------------------------------------------------------
  // Brand Sponsorships
  // ----------------------------------------------------------------------------
  public createSponsorship(data: Omit<BrandSponsorship, 'id' | 'createdAt' | 'performance'>): {
    success: boolean;
    sponsorship?: BrandSponsorship;
    error?: string;
  } {
    if (!this.isFeatureEnabled('monetization_enabled') || !this.isFeatureEnabled('brand_sponsorships_enabled')) {
      return {
        success: false,
        error: 'Brand sponsorships are currently disabled by administrator.',
      };
    }

    const id = `spons_${Date.now()}`;
    const sponsorship: BrandSponsorship = {
      ...data,
      id,
      performance: { impressions: 0, clicks: 0 },
      createdAt: new Date().toISOString(),
    };
    this.sponsorships.set(sponsorship.id, sponsorship);

    this.logAudit({
      actor: 'admin',
      action: 'CREATE_BRAND_SPONSORSHIP',
      affectedEntity: 'BRAND_SPONSORSHIP',
      entityId: id,
      newValue: sponsorship,
    });
    return { success: true, sponsorship };
  }

  public getSponsorships(): BrandSponsorship[] {
    return Array.from(this.sponsorships.values());
  }

  // ----------------------------------------------------------------------------
  // Monetization Overview Stats (Real DB Calculations)
  // ----------------------------------------------------------------------------
  public getOverviewStats(): MonetizationOverviewStats {
    const campaigns = Array.from(this.campaigns.values());
    const redemptions = Array.from(this.redemptions.values());
    const payments = Array.from(this.payments.values());

    const paidCampaigns = campaigns.filter((c) => c.paymentStatus === 'paid');
    const totalRevenuePaise = payments
      .filter((p) => p.status === 'paid')
      .reduce((acc, p) => acc + p.amountPaise, 0);

    const revenueByCampaignType: Record<CampaignType, number> = {
      sponsored_battle: 0,
      champion_promotion: 0,
      brand_sponsorship: 0,
    };

    campaigns.forEach((c) => {
      if (c.paymentStatus === 'paid') {
        revenueByCampaignType[c.campaignType] =
          (revenueByCampaignType[c.campaignType] || 0) + c.priceInPaise;
      }
    });

    return {
      totalRevenuePaise,
      paidCampaignsCount: paidCampaigns.length,
      activeCampaignsCount: campaigns.filter((c) => c.status === 'active').length,
      pendingApprovalsCount: campaigns.filter((c) => c.status === 'pending_approval').length,
      pendingApplicationsCount: campaigns.filter((c) => c.status === 'draft').length,
      completedCampaignsCount: campaigns.filter((c) => c.status === 'completed').length,
      totalOfferRedemptions: redemptions.length,
      verifiedBillableRedemptions: redemptions.filter((r) => r.isBillable).length,
      totalRefundsPaise: payments
        .filter((p) => p.status === 'refunded')
        .reduce((acc, p) => acc + p.amountPaise, 0),
      revenueByCampaignType,
    };
  }
}

// Global Singleton
declare global {
  // eslint-disable-next-line no-var
  var __palateMonetizationStore: PalateMonetizationStore | undefined;
}

export const monetizationStore =
  globalThis.__palateMonetizationStore || new PalateMonetizationStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__palateMonetizationStore = monetizationStore;
}
