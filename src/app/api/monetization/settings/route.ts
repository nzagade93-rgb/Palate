// ==============================================================================
// PALATE API: /api/monetization/settings (GET, POST)
// Centralized Feature Flag & Configuration Controller
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { monetizationStore } from '@/lib/monetizationStore';

export async function GET() {
  try {
    const settings = monetizationStore.getSettings();
    const stats = monetizationStore.getOverviewStats();
    const packages = monetizationStore.getPackages();

    return NextResponse.json({
      success: true,
      settings,
      stats,
      packages,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { settings, actor, packagePriceUpdates } = body;

    if (!settings && !packagePriceUpdates) {
      return NextResponse.json(
        { success: false, error: 'No update parameters provided' },
        { status: 400 }
      );
    }

    // 1. Update settings if provided
    let updatedSettings = monetizationStore.getSettings();
    if (settings) {
      const res = monetizationStore.updateSettings(settings, actor || 'admin');
      updatedSettings = res.settings;
    }

    // 2. Update package prices if provided
    if (packagePriceUpdates && Array.isArray(packagePriceUpdates)) {
      packagePriceUpdates.forEach((up: { packageId: string; newPriceInPaise: number }) => {
        monetizationStore.updatePackagePrice(up.packageId, up.newPriceInPaise, actor || 'admin');
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Monetization configuration successfully updated.',
      settings: updatedSettings,
      packages: monetizationStore.getPackages(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
