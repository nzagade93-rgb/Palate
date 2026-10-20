// ==============================================================================
// Palate API: /api/vote (POST)
// Anti-Cheat Voting Handler: Validates device fingerprint, enforces
// uniqueness, updates battle tallies atomically, and syncs Food Passport.
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { castVote } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { battle_id, chosen_restaurant_id, voter_fingerprint } = body;

    if (!battle_id || !chosen_restaurant_id || !voter_fingerprint) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: battle_id, chosen_restaurant_id, voter_fingerprint'
        },
        { status: 400 }
      );
    }

    const result = await castVote(battle_id, chosen_restaurant_id, voter_fingerprint);

    if (result.alreadyVoted) {
      return NextResponse.json(
        {
          success: false,
          alreadyVoted: true,
          error: result.message,
          battle: result.battle
        },
        { status: 409 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || 'Failed to register vote'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      battle: result.battle,
      passport: result.passport
    });
  } catch (err: any) {
    console.error('Error in /api/vote:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
