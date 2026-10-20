// ==============================================================================
// PALATE API: /api/challenges (GET, POST)
// Challenge the Winner Engine
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getChallenges, submitChallenge } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const battleId = searchParams.get('battleId') || undefined;
    const challenges = await getChallenges(battleId);
    return NextResponse.json({ success: true, challenges });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      previous_battle_id,
      challenger_name,
      challenger_restaurant,
      neighborhood,
      dish_category,
      reason,
      submitter_fingerprint
    } = body;

    if (!previous_battle_id || !challenger_name || !submitter_fingerprint || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required challenge parameters' },
        { status: 400 }
      );
    }

    const challenge = await submitChallenge({
      previousBattleId: previous_battle_id,
      challengerName: challenger_name,
      challengerRestaurant: challenger_restaurant || challenger_name,
      neighborhood: neighborhood || 'Navi Mumbai',
      dishCategory: dish_category || 'Street Food',
      reason,
      submitterFingerprint: submitter_fingerprint
    });

    return NextResponse.json({
      success: true,
      message: 'Challenge submitted! Awaiting community upvotes to trigger the next battle.',
      challenge
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit challenge' },
      { status: 500 }
    );
  }
}
