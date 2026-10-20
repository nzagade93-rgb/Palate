// ==============================================================================
// PALATE API: /api/monetization/audit (GET)
// Administrative Audit Trail for Feature Toggles, Price Updates & Approvals
// ==============================================================================

import { NextResponse } from 'next/server';
import { monetizationStore } from '@/lib/monetizationStore';

export async function GET() {
  try {
    const logs = monetizationStore.auditLogs;
    return NextResponse.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
