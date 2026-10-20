// ==============================================================================
// Palate API: /api/leaderboard (GET)
// Top ranked Navi Mumbai food contenders by win-rate and community votes
// ==============================================================================

import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/store';

export async function GET() {
  try {
    const leaderboard = await getLeaderboard();
    return NextResponse.json({ success: true, leaderboard });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
