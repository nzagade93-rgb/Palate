// ==============================================================================
// PALATE API: /api/monetization/campaigns (GET, POST, PATCH)
// Sponsored Battles & Campaign Lifecycle Management
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { monetizationStore } from '@/lib/monetizationStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId') || undefined;
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;

    const campaigns = monetizationStore.getCampaigns({ restaurantId, status, type });
    return NextResponse.json({ success: true, campaigns });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch campaigns' },
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
      packageId,
      campaignName,
      promotionalDescription,
      relatedBattleId,
      relatedBattleTitle,
      placementType,
      startsAt,
      endsAt,
    } = body;

    if (!restaurantId || !restaurantName || !packageId || !campaignName) {
      return NextResponse.json(
        { success: false, error: 'Missing required campaign parameters' },
        { status: 400 }
      );
    }

    // Attempt creation with server-side feature flag enforcement
    const result = monetizationStore.createCampaign({
      restaurantId,
      restaurantName,
      packageId,
      campaignName,
      promotionalDescription: promotionalDescription || '',
      relatedBattleId,
      relatedBattleTitle,
      placementType,
      startsAt,
      endsAt,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Campaign creation failed' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign submitted for administrative review and payment processing.',
      campaign: result.campaign,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error creating campaign' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, status, actor, notes } = body;

    if (!campaignId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing campaignId or status' },
        { status: 400 }
      );
    }

    const result = monetizationStore.updateCampaignStatus(
      campaignId,
      status,
      actor || 'admin',
      notes
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update campaign status' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Campaign status updated to ${status}`,
      campaign: result.campaign,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error updating campaign' },
      { status: 500 }
    );
  }
}
