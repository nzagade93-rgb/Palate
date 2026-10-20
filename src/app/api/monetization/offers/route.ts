// ==============================================================================
// PALATE API: /api/monetization/offers (GET, POST)
// Restaurant Customer Acquisition Offers & Promotions
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { monetizationStore } from '@/lib/monetizationStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId') || undefined;

    const offers = monetizationStore.getOffers(restaurantId);
    const isEnabled = monetizationStore.isFeatureEnabled('restaurant_offers_enabled');

    return NextResponse.json({
      success: true,
      isEnabled,
      offers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      restaurantId,
      restaurantName,
      title,
      description,
      discountType,
      discountValue,
      minOrderValue,
      startsAt,
      endsAt,
      redemptionLimit,
      couponCode,
      terms,
      billableFeePerRedemptionPaise,
    } = body;

    if (!restaurantId || !restaurantName || !title || !discountValue) {
      return NextResponse.json(
        { success: false, error: 'Missing required offer parameters' },
        { status: 400 }
      );
    }

    const now = new Date();
    const defaultEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const result = monetizationStore.createOffer({
      restaurantId,
      restaurantName,
      title,
      description: description || '',
      discountType: discountType || 'flat',
      discountValue: Number(discountValue),
      minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
      startsAt: startsAt || now.toISOString(),
      endsAt: endsAt || defaultEnd.toISOString(),
      redemptionLimit: redemptionLimit ? Number(redemptionLimit) : 100,
      redemptionMethod: 'coupon_code',
      couponCode,
      status: 'active',
      terms: terms || 'Terms and conditions apply. One redemption per customer.',
      billableFeePerRedemptionPaise: billableFeePerRedemptionPaise
        ? Number(billableFeePerRedemptionPaise)
        : 3000, // default ₹30
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create offer' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Offer created and ready for redemption.',
      offer: result.offer,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error creating offer' },
      { status: 500 }
    );
  }
}
