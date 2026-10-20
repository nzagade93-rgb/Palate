// ==============================================================================
// PALATE API: /api/analytics (POST, GET)
// Growth Funnel & Viral Loop Measurement
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { trackAnalyticsEvent, getAnalyticsSummary } from '@/lib/store';

export async function GET() {
  try {
    const summary = getAnalyticsSummary();
    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, properties, fingerprint } = body;

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event name required' }, { status: 400 });
    }

    trackAnalyticsEvent(event, properties || {}, fingerprint);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to log event' },
      { status: 500 }
    );
  }
}
