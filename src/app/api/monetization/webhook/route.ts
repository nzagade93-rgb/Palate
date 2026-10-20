// ==============================================================================
// PALATE API: /api/monetization/webhook (POST)
// Idempotent Payment Webhook & Pilot Verification Processor
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { monetizationStore } from '@/lib/monetizationStore';
import { paymentProvider } from '@/lib/paymentProvider';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      campaignId,
      providerOrderId,
      providerPaymentId,
      providerSignature,
      idempotencyKey,
      isPilot,
    } = body;

    if (!campaignId || !providerOrderId || !idempotencyKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment verification parameters' },
        { status: 400 }
      );
    }

    const campaign = monetizationStore.campaigns.get(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // 1. Verify Payment Authenticity & Idempotency
    const verifyResult = await paymentProvider.verifyPayment(
      {
        providerOrderId,
        providerPaymentId: providerPaymentId || `pay_${Date.now()}`,
        providerSignature,
        idempotencyKey,
      },
      campaign.priceInPaise,
      Boolean(isPilot)
    );

    if (!verifyResult.success || !verifyResult.paymentRecord) {
      return NextResponse.json(
        { success: false, error: verifyResult.error || 'Payment verification failed' },
        { status: 400 }
      );
    }

    // 2. Record payment in monetization store
    const recordResult = monetizationStore.recordPayment({
      campaignId,
      amountPaise: campaign.priceInPaise,
      provider: verifyResult.paymentRecord.provider || 'admin_pilot',
      providerOrderId,
      providerPaymentId: verifyResult.paymentRecord.providerPaymentId,
      idempotencyKey,
      actor: isPilot ? 'admin_pilot' : 'payment_gateway',
    });

    if (!recordResult.success) {
      return NextResponse.json(
        { success: false, error: recordResult.error || 'Failed to record payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and campaign payment status updated.',
      payment: recordResult.payment,
      campaign: monetizationStore.campaigns.get(campaignId),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error processing payment webhook' },
      { status: 500 }
    );
  }
}
