import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Receipt,
  Store
} from 'lucide-react';
import { merchantService, type PerkValidationResult } from '../services/merchantService';
import type { DbPerkRedemption } from '../services/supabase';

interface MerchantValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantValidatorModal: React.FC<MerchantValidatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [pinInput, setPinInput] = useState('1717');
  const [billAmount, setBillAmount] = useState('');
  const [metrics, setMetrics] = useState<{ totalRedeemed: number; todayRedeemed: number; recentList: DbPerkRedemption[] }>({
    totalRedeemed: 0,
    todayRedeemed: 0,
    recentList: []
  });
  const [validationResult, setValidationResult] = useState<PerkValidationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const loadMetrics = async () => {
    const data = await merchantService.getMetrics();
    setMetrics(data);
  };

  useEffect(() => {
    if (isOpen) {
      loadMetrics();
      setValidationResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;

    setIsVerifying(true);
    const result = await merchantService.redeemVoucher({
      voucherCode: voucherCodeInput.trim(),
      venueName: 'Merchant Counter',
      perkTitle: 'Verified Counter Token Perk',
      cashierPin: pinInput,
      billAmount: billAmount ? parseFloat(billAmount) : undefined
    });

    setIsVerifying(false);
    setValidationResult(result);
    if (result.valid) {
      await loadMetrics();
      setVoucherCodeInput('');
      setBillAmount('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-sm rounded-3xl bg-[#0E1116] border border-[#262C36] shadow-2xl overflow-hidden relative animate-slide-up my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#161B22] border-b border-[#262C36] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center">
              <Store className="w-4 h-4 text-brand-orange" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Cashier Perk Validator</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-800/60">
                  LIVE
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">Validate customer Palate passes</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-[#07090C] border border-[#262C36]">
              <div className="text-[10px] text-slate-400 font-medium">Claimed Today</div>
              <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{metrics.todayRedeemed}</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#07090C] border border-[#262C36]">
              <div className="text-[10px] text-slate-400 font-medium">All Time Verified</div>
              <div className="text-lg font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>{metrics.totalRedeemed}</span>
              </div>
            </div>
          </div>

          {/* Validation Form */}
          <form onSubmit={handleValidate} className="space-y-3 bg-[#161B22] p-3.5 rounded-2xl border border-[#262C36]">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Customer Voucher Code
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value)}
                  placeholder="e.g. PALATE-BTC-CHAAS99"
                  className="w-full text-xs font-mono uppercase pl-9 pr-3 py-2 rounded-xl bg-[#0E1116] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Cashier PIN
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="1717"
                  className="w-full text-xs font-mono px-2.5 py-1.5 rounded-xl bg-[#0E1116] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Bill Amount (₹ opt)
                </label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="₹250"
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl bg-[#0E1116] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                />
              </div>
            </div>

            {validationResult && (
              <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                validationResult.valid 
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' 
                  : 'bg-red-950/50 border-red-500/50 text-red-300'
              }`}>
                {validationResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span className="leading-tight">{validationResult.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !voucherCodeInput.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying...' : 'Verify & Unlock Perk'}</span>
            </button>
          </form>

          {/* Recent Log */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              Recent Counter Redemptions
            </div>
            {metrics.recentList.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-2 text-center">
                No redemptions recorded yet today.
              </p>
            ) : (
              <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar">
                {metrics.recentList.slice(0, 5).map((r) => (
                  <div key={r.id} className="p-2 rounded-xl bg-[#161B22] border border-[#262C36] flex items-center justify-between text-[11px]">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-white truncate">{r.voucher_code}</div>
                      <div className="text-[10px] text-slate-400 truncate">{r.venue_name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-bold">✓ Verified</div>
                      <div className="text-[9px] text-slate-500">
                        {new Date(r.redeemed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
