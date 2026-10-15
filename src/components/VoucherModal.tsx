import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sparkles, Clock, ShieldCheck, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

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

  useEffect(() => {
    if (isOpen) {
      // Trigger festive celebration burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF5722', '#10B981', '#F59E0B']
      });

      const interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setSecondsLeft(900);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-sm rounded-3xl bg-[#0E1116] border border-[#262C36] shadow-glow-orange overflow-hidden text-center relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Glow */}
        <div className="bg-gradient-to-r from-orange-600 via-brand-orange to-amber-500 py-3.5 px-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-xs uppercase bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>Counter Voucher</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Close voucher"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-orange-100 font-medium mt-1">Show this screen to the counter captain / cashier</p>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Venue</span>
            <h3 className="text-xl font-bold text-white mt-0.5">{venueName}</h3>
          </div>

          {/* Perk Highlight Box */}
          <div className="bg-[#161B22] border border-[#262C36] rounded-2xl p-4 text-left space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{perkTitle}</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {perkDescription}
            </p>
          </div>

          {/* High Contrast Cashier Verification Box */}
          <div className="bg-[#07090C] border-2 border-dashed border-brand-orange/60 rounded-2xl p-4 space-y-3">
            <div className="text-[11px] font-bold text-brand-orange uppercase tracking-widest flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Cashier Verification Code</span>
            </div>
            
            <div className="font-mono text-2xl font-black tracking-widest text-white bg-[#161B22] py-2.5 px-4 rounded-xl border border-[#262C36] select-all">
              {voucherCode}
            </div>

            {/* Simulated Live Barcode / Scanning Visual */}
            <div className="flex items-center justify-center gap-2 pt-1 opacity-80">
              <QrCode className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-mono tracking-widest">
                VERIFIED BY PALATE RADAR • NAVI MUMBAI
              </span>
            </div>
          </div>

          {/* Live Timer Countdown */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-amber-400/90 bg-amber-950/30 border border-amber-800/40 py-2 px-3 rounded-full">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Pass expires in: <strong className="font-mono font-bold text-amber-300">{formattedTime}</strong></span>
          </div>

          {/* Done Button */}
          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-3.5 rounded-2xl bg-gradient-to-r from-brand-orange to-orange-600 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-sm shadow-glow-orange active:scale-95 transition-transform"
          >
            I've Shown This at the Counter
          </button>
        </div>
      </div>
    </div>
  );
};
