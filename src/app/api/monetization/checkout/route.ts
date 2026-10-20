// ==============================================================================
// PALATE API: /api/monetization/checkout (POST)
// Secure Payment Order Generation with Server Feature Flag Enforcement
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { monetizationStore } from '@/lib/monetizationStore';
import { paymentProvider } from '@/lib/paymentProvider';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, forcePilot } = body;

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: 'Missing campaignId' },
        { status: 400 }
      );
    }

    // 1. Strict Feature Flag Check
    if (!monetizationStore.isFeatureEnabled('monetization_enabled')) {
      return NextResponse.json(
        { success: false, error: 'Monetization is currently disabled. Checkout is unavailable.' },
        { status: 403 }
      );
    }

    const campaign = monetizationStore.campaigns.get(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.paymentStatus === 'paid') {
      return NextResponse.json(
        { success: false, error: 'This campaign is already paid' },
        { status: 400 }
      );
    }

    // 2. Generate Payment Order via PaymentProviderService
    const order = await paymentProvider.createOrder(
      {
        amountPaise: campaign.priceInPaise,
        currency: 'INR',
        receipt: `rcpt_${campaign.id}`,
        notes: {
          campaignId: campaign.id,
          restaurantId: campaign.restaurantId,
          campaignName: campaign.campaignName,
        },
      },
      Boolean(forcePilot)
    );

    return NextResponse.json({
      success: true,
      order,
      campaign: {
        id: campaign.id,
        name: campaign.campaignName,
        priceInPaise: campaign.priceInPaise,
        priceFormatted: `₹${(campaign.priceInPaise / 100).toLocaleString('en-IN')}`,
        restaurantName: campaign.restaurantName,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error generating checkout order' },
      { status: 500 }
    );
  }
}
