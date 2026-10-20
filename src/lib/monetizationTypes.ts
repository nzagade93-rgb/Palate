// ==============================================================================
// PALATE: Monetization Types & Domain Models
// "Build Now, Activate Later" Infrastructure
// ==============================================================================

export interface MonetizationSettings {
  monetization_enabled: boolean;
  sponsored_battles_enabled: boolean;
  champion_packages_enabled: boolean;
  restaurant_offers_enabled: boolean;
  brand_sponsorships_enabled: boolean;
  self_service_purchasing_enabled: boolean;
  paid_restaurant_dashboard_enabled: boolean;
  updated_at: string;
  updated_by: string;
}

export type CampaignType = 'sponsored_battle' | 'champion_promotion' | 'brand_sponsorship';

export type CampaignStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'pilot_waived';

export interface CampaignPackage {
  id: string;
  type: CampaignType;
  name: string;
  priceInPaise: number; // e.g. 99900 = ₹999
  currency: 'INR';
  description: string;
  deliverables: string[];
  isActive: boolean;
  minDurationDays: number;
}

export interface RestaurantCampaign {
  id: string;
  restaurantId: string;
  restaurantName: string;
  campaignName: string;
  packageId: string;
  packageName: string;
  campaignType: CampaignType;
  relatedBattleId?: string;
  relatedBattleTitle?: string;
  promotionalDescription: string;
  startsAt: string;
  endsAt: string;
  placementType: 'battle_spotlight' | 'neighborhood_banner' | 'champion_banner';
  status: CampaignStatus;
  priceInPaise: number;
  currency: 'INR';
  paymentStatus: PaymentStatus;
  paymentId?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  performance: {
    impressions: number;
    clicks: number;
    shares: number;
  };
}

export interface RestaurantOffer {
  id: string;
  restaurantId: string;
  restaurantName: string;
  campaignId?: string;
  title: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number; // e.g. 30 = ₹30 off, or 20 = 20%
  minOrderValue?: number; // e.g. 150 = ₹150 min order
  startsAt: string;
  endsAt: string;
  redemptionLimit: number;
  redemptionCount: number;
  redemptionMethod: 'coupon_code' | 'qr_code' | 'admin_verified';
  couponCode?: string;
  status: 'active' | 'paused' | 'expired' | 'depleted';
  terms: string;
  billableFeePerRedemptionPaise: number; // e.g. 3000 = ₹30/redemption
  createdAt: string;
}

export interface OfferRedemption {
  id: string;
  offerId: string;
  restaurantId: string;
  restaurantName: string;
  consumerFingerprint: string;
  couponCodeUsed?: string;
  billableAmountPaise: number;
  isBillable: boolean;
  billingStatus: 'unbilled' | 'invoiced' | 'paid' | 'disputed';
  redeemedAt: string;
  verifiedBy?: string;
  verifiedMethod: 'code_match' | 'qr_scan' | 'admin_override';
}

export interface PaymentRecord {
  id: string;
  campaignId: string;
  restaurantId: string;
  amountPaise: number;
  currency: 'INR';
  status: PaymentStatus;
  provider: 'razorpay' | 'cashfree' | 'admin_pilot';
  providerOrderId?: string;
  providerPaymentId?: string;
  providerSignature?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface BrandSponsorship {
  id: string;
  sponsorName: string;
  sponsorOrg: string;
  campaignName: string;
  description: string;
  placement: string;
  startsAt: string;
  endsAt: string;
  commercialTerms: string;
  priceInPaise: number;
  currency: 'INR';
  status: 'draft' | 'pending_approval' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  performance: {
    impressions: number;
    clicks: number;
  };
  createdAt: string;
}

export interface MonetizationAuditLog {
  id: string;
  actor: string;
  action: string;
  affectedEntity: string;
  entityId: string;
  previousValue?: any;
  newValue?: any;
  timestamp: string;
  notes?: string;
}

export interface MonetizationOverviewStats {
  totalRevenuePaise: number;
  paidCampaignsCount: number;
  activeCampaignsCount: number;
  pendingApprovalsCount: number;
  pendingApplicationsCount: number;
  completedCampaignsCount: number;
  totalOfferRedemptions: number;
  verifiedBillableRedemptions: number;
  totalRefundsPaise: number;
  revenueByCampaignType: Record<CampaignType, number>;
}
