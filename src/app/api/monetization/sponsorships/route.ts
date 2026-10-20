// ==============================================================================
// PALATE API: /api/monetization/sponsorships (GET, POST)
// Brand Sponsorships & Commercial Partnerships Manager
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { monetizationStore } from '@/lib/monetizationStore';

export async function GET() {
  try {
    const sponsorships = monetizationStore.getSponsorships();
    const isEnabled = monetizationStore.isFeatureEnabled('brand_sponsorships_enabled');

    return NextResponse.json({
      success: true,
      isEnabled,
      sponsorships,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch sponsorships' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sponsorName,
      sponsorOrg,
      campaignName,
      description,
      placement,
      startsAt,
      endsAt,
      commercialTerms,
      priceInPaise,
    } = body;

    if (!sponsorName || !campaignName || !priceInPaise) {
      return NextResponse.json(
        { success: false, error: 'Missing required sponsorship parameters' },
        { status: 400 }
      );
    }

    const now = new Date();
    const defaultEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const result = monetizationStore.createSponsorship({
      sponsorName,
      sponsorOrg: sponsorOrg || sponsorName,
      campaignName,
      description: description || '',
      placement: placement || 'City Arena Header Banner',
      startsAt: startsAt || now.toISOString(),
      endsAt: endsAt || defaultEnd.toISOString(),
      commercialTerms: commercialTerms || 'Standard sponsorship placement',
      priceInPaise: Number(priceInPaise),
      currency: 'INR',
      status: 'pending_approval',
      paymentStatus: 'pending',
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create sponsorship' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Brand sponsorship agreement registered.',
      sponsorship: result.sponsorship,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error creating sponsorship' },
      { status: 500 }
    );
  }
}
