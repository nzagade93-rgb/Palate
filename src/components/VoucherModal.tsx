import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  Lock, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { merchantService, type PerkValidationResult } from '../services/merchantService';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName: string;
  perkTitle: string;
  perkDescription: string;
  voucherCode: string;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  onClose,
  venueName,
  perkTitle,
  perkDescription,
  voucherCode,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 minute counter
  const [isCashierMode, setIsCashierMode] = useState(false);
  const [cashierPin, setCashierPin] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [validationResult, setValidationResult] = useState<PerkValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(900);
      setIsCashierMode(false);
      setCashierPin('');
      setBillAmount('');

      // Check if already redeemed
      merchantService.checkVoucherStatus(voucherCode).then((status) => {
        if (status.redeemed && status.lastRedemption) {
          setValidationResult({
            valid: true,
            alreadyRedeemed: true,
            message: 'Already verified and logged for this session.',
            redemption: status.lastRedemption
          });
        } else {
          setValidationResult(null);
        }
      });

      const interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, voucherCode]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCashierRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashierPin) return;

    setIsSubmitting(true);
    const result = await merchantService.redeemVoucher({
      voucherCode,
      venueName,
      perkTitle,
      cashierPin,
      billAmount: billAmount ? parseFloat(billAmount) : undefined
    });

    setIsSubmitting(false);
    setValidationResult(result);

    if (result.valid) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#F59E0B']
      });
    }
  };

  const isRedeemed = validationResult?.valid || validationResult?.alreadyRedeemed;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-sm rounded-3xl bg-[#0E1116] border border-[#262C36] shadow-glow-orange overflow-hidden text-center relative animate-slide-up my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className={`py-3.5 px-6 text-white relative transition-colors ${
          isRedeemed 
            ? 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600'
            : 'bg-gradient-to-r from-orange-600 via-brand-orange to-amber-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-xs uppercase bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {isRedeemed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Cashier Verified</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                  <span>Counter Voucher</span>
                </>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Close voucher"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-orange-100 font-medium mt-1">
            {isRedeemed 
              ? '✓ Perk unlocked on customer bill'
              : 'Show this screen to the counter captain / cashier'}
          </p>
        </div>

        {/* Card Content */}
        <div className="p-5 sm:p-6 space-y-4 text-left">
          <div className="text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Venue</span>
            <h3 className="text-lg font-bold text-white mt-0.5">{venueName}</h3>
          </div>

          {/* Perk Highlight Box */}
          <div className="bg-[#161B22] border border-[#262C36] rounded-2xl p-3.5 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{perkTitle}</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {perkDescription}
            </p>
          </div>

          {/* Verification Code or Stamp */}
          {isRedeemed ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2 animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black tracking-wide border border-emerald-500/30">
                <Check className="w-3.5 h-3.5" />
                <span>PERK REDEEMED & VALIDATED</span>
              </div>
              <p className="text-xs text-emerald-200/80">
                {validationResult?.message || 'Discount/token item applied to table bill.'}
              </p>
              {validationResult?.redemption && (
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Receipt ID: {validationResult.redemption.id.substring(0, 16)} • {new Date(validationResult.redemption.redeemed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#07090C] border-2 border-dashed border-brand-orange/60 rounded-2xl p-4 text-center space-y-2.5">
              <div className="text-[10px] font-bold text-brand-orange uppercase tracking-widest flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cashier Code</span>
              </div>
              
              <div className="font-mono text-xl sm:text-2xl font-black tracking-widest text-white bg-[#161B22] py-2 px-3 rounded-xl border border-[#262C36] select-all">
                {voucherCode}
              </div>

              <div className="flex items-center justify-center gap-1.5 opacity-80">
                <QrCode className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
                  Palate Ground Radar • Live Verification
                </span>
              </div>
            </div>
          )}

          {/* Timer Countdown */}
          {!isRedeemed && (
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-400/90 bg-amber-950/30 border border-amber-800/40 py-2 px-3 rounded-full">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>Pass expires in: <strong className="font-mono font-bold text-amber-300">{formattedTime}</strong></span>
            </div>
          )}

          {/* Cashier PIN Validation Accordion */}
          {!isRedeemed && (
            <div className="border-t border-[#262C36] pt-3">
              {!isCashierMode ? (
                <button
                  type="button"
                  onClick={() => setIsCashierMode(true)}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 py-1.5 transition-colors"
                >
                  <Lock className="w-3 h-3 text-brand-orange" />
                  <span>Cashier / Waiter? Tap to Validate PIN</span>
                </button>
              ) : (
                <form onSubmit={handleCashierRedeem} className="space-y-2.5 bg-[#161B22] p-3 rounded-2xl border border-[#262C36]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1">
                      <Lock className="w-3 h-3 text-brand-orange" />
                      Cashier Verification
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCashierMode(false)}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">
                        4-Digit PIN (Demo: 1717)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cashierPin}
                        onChange={(e) => setCashierPin(e.target.value)}
                        placeholder="1717"
                        className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg bg-[#0E1116] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">
                        Bill Amount (₹ opt)
                      </label>
                      <input
                        type="number"
                        value={billAmount}
                        onChange={(e) => setBillAmount(e.target.value)}
                        placeholder="₹250"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#0E1116] border border-[#262C36] text-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  {validationResult && !validationResult.valid && (
                    <div className="flex items-center gap-1.5 text-[11px] text-red-400">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{validationResult.message}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCashierPin('1717')}
                      className="text-[10px] px-2 py-1.5 rounded-lg bg-[#262C36] text-slate-300 hover:text-white"
                    >
                      Quick Fill 1717
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || cashierPin.length !== 4}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-colors"
                    >
                      {isSubmitting ? 'Checking...' : 'Stamp Perk'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Close Action */}
          <button
            onClick={onClose}
            className="w-full min-h-[42px] py-2.5 rounded-2xl bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-xs shadow-glow-orange active:scale-95 transition-transform"
          >
            {isRedeemed ? 'Done' : "I've Shown This at the Counter"}
          </button>
        </div>
      </div>
    </div>
  );
};
