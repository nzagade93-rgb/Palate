// ==============================================================================
// Palate API: /api/passport (GET)
// Retrieve or initialize a user's Food Passport based on local device fingerprint
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getPassport } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fingerprint = searchParams.get('fingerprint');

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Missing fingerprint query parameter' },
        { status: 400 }
      );
    }

    const passport = await getPassport(fingerprint);
    return NextResponse.json({ success: true, passport });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch passport' },
      { status: 500 }
    );
  }
}
