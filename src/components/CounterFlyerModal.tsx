import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  X, 
  ExternalLink, 
  Flame, 
  Gift, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import QRCode from 'qrcode';
import { VENUES, DISHES } from '../data/mockData';
import type { Venue } from '../types';

interface CounterFlyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVenue?: Venue | null;
}

export const CounterFlyerModal: React.FC<CounterFlyerModalProps> = ({
  isOpen,
  onClose,
  initialVenue = null
}) => {
  const [selectedVenueId, setSelectedVenueId] = useState<string>(
    initialVenue?.id || 'bhagat-tarachand'
  );
  const [qrSvg, setQrSvg] = useState<string>('');

  const currentVenue = VENUES[selectedVenueId] || VENUES['bhagat-tarachand'];

  // Resolve top dish name
  const topDish = currentVenue.topDishIds.length > 0 
    ? DISHES.find(d => d.id === currentVenue.topDishIds[0])
    : null;

  const skipDish = currentVenue.skipDishes.length > 0 
    ? currentVenue.skipDishes[0] 
    : null;

  // Generate QR code targeting this venue or main app
  useEffect(() => {
    const targetUrl = window.location.origin 
      ? `${window.location.origin}/?venue=${selectedVenueId}` 
      : `https://palate-vashi.app/?venue=${selectedVenueId}`;

    QRCode.toString(targetUrl, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#0E1116',
        light: '#FAF7F2'
      }
    })
      .then((svg) => {
        setQrSvg(svg);
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
      });
  }, [selectedVenueId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      
      {/* Print View Specific Style Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-flyer-card, #printable-flyer-card * {
            visibility: visible !important;
          }
          #printable-flyer-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 148mm !important;
            min-height: 210mm !important;
            margin: 0 auto !important;
            padding: 14mm !important;
            box-shadow: none !important;
            border: 1px solid #222 !important;
            background: #FAF7F2 !important;
            color: #0E1116 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A5 portrait;
            margin: 8mm;
          }
        }
      `}</style>

      {/* Outer Modal Container */}
      <div className="w-full max-w-md bg-[#0E1116] border border-neutral-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:border-none print:shadow-none print:bg-white">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print p-3.5 border-b border-neutral-800/40 bg-[#141720] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center">
              <Printer className="w-3.5 h-3.5 text-brand-orange" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white">Merchant QR Table-Tent Flyer</h2>
              <p className="text-[10px] text-neutral-400">A5 Standee Format (148 × 210 mm)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/flyer.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-neutral-300 hover:text-white bg-[#0E1116] hover:bg-neutral-800 px-2.5 py-1.5 rounded-xl border border-neutral-800/60 flex items-center gap-1 transition-all"
            >
              <span>HTML</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handlePrint}
              className="text-xs font-bold text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-orange-600 hover:to-amber-600 px-3 py-1.5 rounded-xl shadow-glow-orange flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A5</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#0E1116] hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Venue Selector (Hidden on print) */}
        <div className="no-print px-4 py-2 bg-[#0E1116] border-b border-neutral-800/40 flex items-center justify-between gap-3 text-xs">
          <span className="text-neutral-400 font-semibold shrink-0">Select Venue:</span>
          <div className="relative flex-1 max-w-xs">
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              className="w-full bg-[#141720] text-white border border-neutral-800/70 rounded-xl px-3 py-1.5 pr-7 text-xs font-medium focus:outline-none focus:border-brand-orange cursor-pointer appearance-none"
            >
              {Object.values(VENUES).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.area})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Printable Area Wrapper */}
        <div className="overflow-y-auto p-4 sm:p-6 flex justify-center bg-[#07090C] print:p-0 print:bg-white print:overflow-visible">
          
          {/* THE PRINTABLE FLYER CARD (Exact A5 with Stark Soft Cream-White Background) */}
          <div 
            id="printable-flyer-card"
            className="w-full max-w-[420px] bg-[#FAF7F2] text-[#0E1116] rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col justify-between border border-neutral-300 relative print:max-w-none print:rounded-none print:shadow-none"
          >
            <div className="space-y-5">
              
              {/* Header: Brand & Micro-Location */}
              <div className="flex items-center justify-between border-b border-neutral-300/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FF5C1F] flex items-center justify-center text-white shadow-sm">
                    <Flame className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <span className="font-display font-black text-lg tracking-ultra-wide uppercase text-[#0E1116]">
                      Palate<span className="text-[#FF5C1F]">.</span>
                    </span>
                    <span className="ml-2 text-[9px] font-bold uppercase tracking-widest text-neutral-600 bg-neutral-200/70 px-2 py-0.5 rounded">
                      Local Food Radar
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-black tracking-wider uppercase text-[#0E1116]">Sector 17, Vashi</div>
                  <div className="text-[9px] text-neutral-500 font-medium">Navi Mumbai</div>
                </div>
              </div>

              {/* Main Centered Headline with High-End Typography */}
              <div className="text-center space-y-1 pt-1">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-[#0E1116]">
                  Never Order the Wrong Dish in Sector 17
                </h1>
                <p className="text-xs text-neutral-600 font-medium max-w-xs mx-auto">
                  Scan to discover verified must-orders & exact dishes to skip.
                </p>
              </div>

              {/* Active Venue Badge with Fine Border */}
              <div className="bg-white/80 rounded-xl p-2.5 border border-neutral-300 text-center shadow-xs">
                <span className="text-[9px] font-bold uppercase tracking-ultra-wide text-neutral-500 block">
                  Official Local Food Verdict For
                </span>
                <div className="text-base font-black text-[#0E1116] tracking-tight">{currentVenue.name}</div>
                <div className="text-[11px] text-neutral-600 font-medium">{currentVenue.fullAddress}</div>
              </div>

              {/* Centered Scaled-Down Clean QR Code */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="p-2.5 bg-white rounded-2xl border border-neutral-300 shadow-sm flex items-center justify-center relative">
                  {qrSvg ? (
                    <div 
                      className="w-32 h-32 sm:w-36 sm:h-36 [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: qrSvg }}
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center text-xs text-neutral-400">
                      Generating QR...
                    </div>
                  )}

                  {/* Centered Mini Brand Core in QR */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 rounded-md bg-[#FF5C1F] border border-white flex items-center justify-center shadow-sm">
                      <Flame className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                </div>

                <div className="text-center mt-2 space-y-0.5">
                  <span className="text-[10px] font-black text-[#0E1116] tracking-widest uppercase">
                    📷 Point Camera to Scan
                  </span>
                  <p className="text-[9px] text-neutral-500 font-medium">
                    Instant PWA • No App Store Download Required
                  </p>
                </div>
              </div>

              {/* Spacious Horizontal Comparison: Must-Order & Skip */}
              <div className="grid grid-cols-2 gap-3 text-left pt-1">
                {/* 🟢 Must-Order Horizontal Box */}
                <div className="p-3 rounded-xl bg-white/70 border border-emerald-400/80 shadow-xs space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-800 uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>🟢 Must-Order</span>
                  </div>
                  <div className="text-xs font-extrabold text-neutral-900 line-clamp-1">
                    {topDish?.name || 'Signature Special'}
                  </div>
                  <div className="text-[10px] text-neutral-600 font-medium line-clamp-2 leading-relaxed">
                    {topDish?.microVerdict || 'Tested & verified by local diners.'}
                  </div>
                </div>

                {/* 🔴 Skip Item Horizontal Box */}
                <div className="p-3 rounded-xl bg-white/70 border border-red-300 shadow-xs space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-black text-red-800 uppercase tracking-wide">
                    <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                    <span>🔴 Skip This</span>
                  </div>
                  <div className="text-xs font-extrabold text-neutral-900 line-clamp-1">
                    {skipDish?.name || 'Generic Side Dishes'}
                  </div>
                  <div className="text-[10px] text-neutral-600 font-medium line-clamp-2 leading-relaxed">
                    {skipDish?.reason || 'Avoid ordering off-menu items.'}
                  </div>
                </div>
              </div>

              {/* Refined Counter Diner Perk Banner */}
              <div className="p-3 rounded-xl bg-[#0E1116] text-white border border-neutral-800 flex items-center gap-3 shadow-md">
                <div className="w-7 h-7 rounded-lg bg-[#FF5C1F] flex items-center justify-center shrink-0">
                  <Gift className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] font-black uppercase text-[#FF5C1F] tracking-widest">
                    Diner Counter Perk
                  </div>
                  <div className="text-[11px] font-bold text-white leading-tight">
                    Show Palate screen at the counter for today's diner perk
                  </div>
                  <div className="text-[10px] text-neutral-300 truncate mt-0.5">
                    {currentVenue.counterPerk.title}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Trust Markers */}
            <div className="mt-5 pt-3 border-t border-neutral-300/80 flex items-center justify-between text-[9px] font-semibold text-neutral-500">
              <span>Verified by Sector 17 Locals</span>
              <span>No Sponsored Ranks</span>
              <span className="font-mono text-[#FF5C1F] font-bold">palate-vashi.app</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
