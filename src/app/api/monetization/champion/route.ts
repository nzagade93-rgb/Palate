// ==============================================================================
// PALATE API: /api/monetization/champion (GET, POST)
// Champion Packages & Verified Achievement Promotional Services
// Strictly requires earned victory in a completed food battle.
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { monetizationStore } from '@/lib/monetizationStore';
import { getBattles } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId') || undefined;

    const allBattles = await getBattles();
    // Only completed battles with a determined winner count as eligible
    const completedBattles = allBattles.filter((b) => b.status === 'completed' || !b.isActive);

    const eligibleWins = completedBattles.map((b) => {
      const winnerId = b.winnerContestantId || (b.votesA >= b.votesB ? b.contestantA.id : b.contestantB.id);
      const winnerName = b.winnerContestantId === b.contestantA.id
        ? b.contestantA.name
        : b.winnerContestantId === b.contestantB.id
        ? b.contestantB.name
        : b.votesA >= b.votesB
        ? b.contestantA.name
        : b.contestantB.name;

      const winningVotes = b.votesA >= b.votesB ? b.votesA : b.votesB;
      const winningPercent = b.votesA >= b.votesB ? b.percentA : b.percentB;

      return {
        battleId: b.id,
        battleTitle: b.title,
        dishName: b.dishName,
        neighborhood: b.neighborhood,
        winnerId,
        winnerName,
        winningVotes,
        winningPercent,
        completedAt: b.endsAt,
      };
    });

    const filtered = restaurantId
      ? eligibleWins.filter((w) => w.winnerId === restaurantId || w.winnerName.toLowerCase().includes(restaurantId.toLowerCase()))
      : eligibleWins;

    const packages = monetizationStore.getPackages('champion_promotion');
    const isEnabled = monetizationStore.isFeatureEnabled('champion_packages_enabled');

    return NextResponse.json({
      success: true,
      isEnabled,
      eligibleWins: filtered,
      packages,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to check champion eligibility' },
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
      battleId,
      packageId,
      campaignName,
      promotionalDescription,
    } = body;

    if (!restaurantId || !battleId || !packageId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: restaurantId, battleId, packageId' },
        { status: 400 }
      );
    }

    // 1. Server-side feature flag check
    if (!monetizationStore.isFeatureEnabled('monetization_enabled') || !monetizationStore.isFeatureEnabled('champion_packages_enabled')) {
      return NextResponse.json(
        { success: false, error: 'Champion Packages are currently disabled by administrator.' },
        { status: 403 }
      );
    }

    // 2. Verified victory validation against existing battle data
    const allBattles = await getBattles();
    const battle = allBattles.find((b) => b.id === battleId || b.slug === battleId);
    if (!battle) {
      return NextResponse.json(
        { success: false, error: 'Referenced battle not found.' },
        { status: 404 }
      );
    }

    if (battle.isActive && battle.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'This battle is still live. Champion packages can only be claimed for completed battles.' },
        { status: 400 }
      );
    }

    const winnerId = battle.winnerContestantId || (battle.votesA >= battle.votesB ? battle.contestantA.id : battle.contestantB.id);
    const isWinner = winnerId === restaurantId ||
      battle.contestantA.restaurantName?.toLowerCase() === restaurantName?.toLowerCase() ||
      battle.contestantB.restaurantName?.toLowerCase() === restaurantName?.toLowerCase();

    if (!isWinner && winnerId !== restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only the verified winning restaurant of this battle is eligible to claim a Champion Package.',
        },
        { status: 403 }
      );
    }

    // 3. Create campaign
    const result = monetizationStore.createCampaign({
      restaurantId,
      restaurantName: restaurantName || battle.contestantA.name,
      packageId,
      campaignName: campaignName || `Champion Celebration: ${battle.title}`,
      promotionalDescription: promotionalDescription || `Celebrating champion victory in ${battle.title}`,
      relatedBattleId: battle.id,
      relatedBattleTitle: battle.title,
      placementType: 'champion_banner',
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create champion campaign' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Champion package campaign submitted for review.',
      campaign: result.campaign,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error creating champion package' },
      { status: 500 }
    );
  }
}
