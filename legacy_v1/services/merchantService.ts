import { liveDataService } from './supabase';
import type { DbPerkRedemption } from './supabase';

export interface PerkValidationResult {
  valid: boolean;
  message: string;
  redemption?: DbPerkRedemption;
  alreadyRedeemed?: boolean;
}

const CASHIER_DEFAULT_PIN = '1717'; // Sector 17 default PIN for cashier validation demo

export const merchantService = {
  // Check if a voucher has been redeemed in the last 4 hours
  async checkVoucherStatus(voucherCode: string): Promise<{ redeemed: boolean; lastRedemption?: DbPerkRedemption }> {
    const list = await liveDataService.getRedemptions();
    const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000;
    
    const existing = list.find((item) => {
      const time = new Date(item.redeemed_at).getTime();
      return item.voucher_code.toLowerCase() === voucherCode.toLowerCase() && time > fourHoursAgo;
    });

    return {
      redeemed: Boolean(existing),
      lastRedemption: existing
    };
  },

  // Validate and redeem a voucher
  async redeemVoucher(params: {
    voucherCode: string;
    venueName: string;
    perkTitle: string;
    cashierPin: string;
    billAmount?: number;
  }): Promise<PerkValidationResult> {
    const { voucherCode, venueName, perkTitle, cashierPin, billAmount } = params;

    // PIN check (allows demo pin 1717 or any 4-digit pin in offline demo)
    const isPinCorrect = cashierPin.trim() === CASHIER_DEFAULT_PIN || /^\d{4}$/.test(cashierPin.trim());
    if (!isPinCorrect) {
      return {
        valid: false,
        message: 'Invalid Cashier PIN. Please enter a valid 4-digit merchant PIN.'
      };
    }

    // Check recent redemption to prevent double dipping
    const status = await this.checkVoucherStatus(voucherCode);
    if (status.redeemed) {
      return {
        valid: false,
        alreadyRedeemed: true,
        message: `This voucher was already redeemed recently (${new Date(status.lastRedemption!.redeemed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}). Only 1 perk per bill session permitted.`,
        redemption: status.lastRedemption
      };
    }

    const redemption: DbPerkRedemption = {
      id: `redemp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      voucher_code: voucherCode.toUpperCase(),
      venue_name: venueName,
      perk_title: perkTitle,
      redeemed_at: new Date().toISOString(),
      cashier_pin_verified: true,
      bill_amount: billAmount || undefined
    };

    await liveDataService.recordPerkRedemption(redemption);

    return {
      valid: true,
      message: 'Perk successfully verified and unlocked for customer bill!',
      redemption
    };
  },

  // Get redemption metrics for cashier
  async getMetrics(venueName?: string) {
    const list = await liveDataService.getRedemptions();
    const filtered = venueName 
      ? list.filter((r) => r.venue_name.toLowerCase().includes(venueName.toLowerCase()))
      : list;

    const todayStr = new Date().toDateString();
    const todayCount = filtered.filter((r) => new Date(r.redeemed_at).toDateString() === todayStr).length;

    return {
      totalRedeemed: filtered.length,
      todayRedeemed: todayCount,
      recentList: filtered.slice(0, 10)
    };
  }
};
