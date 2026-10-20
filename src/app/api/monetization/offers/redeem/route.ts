// ==============================================================================
// PALATE API: /api/monetization/offers/redeem (POST)
// Anti-Fraud Offer Redemption & Billable Event Processor
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { monetizationStore } from '@/lib/monetizationStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerId, consumerFingerprint, couponCode } = body;

    if (!offerId || !consumerFingerprint) {
      return NextResponse.json(
        { success: false, error: 'Missing offerId or consumerFingerprint' },
        { status: 400 }
      );
    }

    const result = monetizationStore.redeemOffer(
      offerId,
      consumerFingerprint,
      couponCode
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to redeem offer' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Offer successfully redeemed! Present this verification to the restaurant.',
      redemption: result.redemption,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error redeeming offer' },
      { status: 500 }
    );
  }
}
