// ==============================================================================
// Palate API: /api/gems (POST, GET)
// Pitch and discover underrated local food gems across Navi Mumbai
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { submitHiddenGem, getHiddenGems } from '@/lib/store';

export async function GET() {
  try {
    const gems = await getHiddenGems();
    return NextResponse.json({ success: true, gems });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch gems' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submitter_fingerprint, restaurant_name, neighborhood, dish_recommendation, secret_tip } = body;

    if (!submitter_fingerprint || !restaurant_name || !neighborhood || !dish_recommendation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing fields: submitter_fingerprint, restaurant_name, neighborhood, dish_recommendation'
        },
        { status: 400 }
      );
    }

    const gem = await submitHiddenGem({
      submitterFingerprint: submitter_fingerprint,
      restaurantName: restaurant_name,
      neighborhood: neighborhood,
      dishRecommendation: dish_recommendation,
      secretTip: secret_tip
    });

    return NextResponse.json({
      success: true,
      message: 'Hidden Gem pitched successfully! Thank you for backing local food.',
      gem
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit gem' },
      { status: 500 }
    );
  }
}
