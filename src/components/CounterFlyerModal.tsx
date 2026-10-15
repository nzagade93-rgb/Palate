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
        dark: '#0A0A0C',
        light: '#FFFFFF'
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      
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
            padding: 12mm !important;
            box-shadow: none !important;
            border: 1.5px solid #111 !important;
            background: #FFFFFF !important;
            color: #0A0A0C !important;
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
      <div className="w-full max-w-md bg-[#141620] border border-[#272B3C] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:bg-white">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print p-4 border-b border-[#242838] bg-[#171926] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center">
              <Printer className="w-4 h-4 text-brand-orange" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Merchant QR Table-Tent Flyer</h2>
              <p className="text-[11px] text-gray-400">Standard A5 format (148 × 210 mm) • Print-ready</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/flyer.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-gray-300 hover:text-white bg-[#222638] hover:bg-[#2B3044] px-3 py-1.5 rounded-xl border border-[#33384D] flex items-center gap-1 transition-all"
            >
              <span>Standalone HTML</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handlePrint}
              className="text-xs font-black text-white bg-gradient-to-r from-brand-orange to-amber-500 hover:from-orange-600 hover:to-amber-600 px-4 py-1.5 rounded-xl shadow-glow-orange flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print A5</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#222638] hover:bg-[#2B3044] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Venue Selector (Hidden on print) */}
        <div className="no-print px-4 py-2.5 bg-[#10121A] border-b border-[#222638] flex items-center justify-between gap-3 text-xs">
          <span className="text-gray-400 font-semibold shrink-0">Target Venue:</span>
          <div className="relative flex-1 max-w-xs">
            <select
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              className="w-full bg-[#181B26] text-white border border-[#2E3347] rounded-xl px-3 py-1.5 pr-8 text-xs font-medium focus:outline-none focus:border-brand-orange cursor-pointer appearance-none"
            >
              {Object.values(VENUES).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.area})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Printable Area Wrapper (Scrollable in modal, exact A5 on paper) */}
        <div className="overflow-y-auto p-4 sm:p-6 flex justify-center bg-[#0B0C11] print:p-0 print:bg-white print:overflow-visible">
          
          {/* THE PRINTABLE FLYER CARD (Exact A5 Aspect Ratio) */}
          <div 
            id="printable-flyer-card"
            className="w-full max-w-[420px] bg-[#FAF8F5] text-[#121316] rounded-2xl shadow-xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#121316] relative print:max-w-none print:rounded-none print:shadow-none"
          >
            {/* Fold Guideline (Subtle dotted line for acrylic table-tent fold) */}
            <div className="no-print absolute top-2 right-3 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
              A5 Acrylic Table-Tent Display
            </div>

            <div className="space-y-4">
              
              {/* Header: Brand & Micro-Location */}
              <div className="flex items-center justify-between border-b-2 border-[#121316] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FF5C00] flex items-center justify-center text-white shadow-sm">
                    <Flame className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <span className="font-display font-black text-xl tracking-tight text-[#121316]">
                      Palate<span className="text-[#FF5C00]">.</span>
                    </span>
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                      Local Food Radar
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-black uppercase text-[#121316]">Sector 17, Vashi</div>
                  <div className="text-[10px] text-gray-500 font-semibold">Navi Mumbai</div>
                </div>
              </div>

              {/* Main Headline & Subhead */}
              <div className="text-center space-y-1.5 pt-1">
                <h1 className="text-2xl sm:text-[26px] font-black tracking-tight leading-tight text-[#121316]">
                  Never Order the Wrong Dish in Sector 17
                </h1>
                <p className="text-xs sm:text-[13px] font-medium text-gray-700 leading-snug max-w-sm mx-auto">
                  Scan to see what locals actually order here — and what to skip.
                </p>
              </div>

              {/* Active Venue Badge */}
              <div className="bg-white rounded-xl p-2.5 border-1.5 border-[#121316] text-center shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Official Local Verdict For</span>
                <div className="text-base font-black text-[#121316] tracking-tight">{currentVenue.name}</div>
                <div className="text-[11px] text-gray-600 font-medium">{currentVenue.fullAddress}</div>
              </div>

              {/* Centered Dynamic QR Code */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="p-3 bg-white rounded-2xl border-2 border-[#121316] shadow-md flex items-center justify-center relative">
                  {qrSvg ? (
                    <div 
                      className="w-44 h-44 sm:w-48 sm:h-48 [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: qrSvg }}
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-400">
                      Generating QR...
                    </div>
                  )}

                  {/* Centered Mini Logo in QR */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-lg bg-[#FF5C00] border-2 border-white flex items-center justify-center shadow-md">
                      <Flame className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                </div>

                <div className="text-center mt-2 space-y-0.5">
                  <span className="text-[11px] font-black text-[#121316] tracking-wide uppercase">
                    📷 Point Phone Camera to Scan
                  </span>
                  <p className="text-[10px] text-gray-500 font-medium">
                    Instant Web App • Zero App Store Download • Free
                  </p>
                </div>
              </div>

              {/* Authentic Must-Order vs Skip Micro-Preview */}
              <div className="grid grid-cols-2 gap-2 text-left pt-1">
                {/* 🟢 Must-Order */}
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-400">
                  <div className="flex items-center gap-1 text-[11px] font-black text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>🟢 Must-Order</span>
                  </div>
                  <div className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">
                    {topDish?.name || 'Signature Special'}
                  </div>
                  <div className="text-[10px] text-emerald-900 mt-0.5 font-medium line-clamp-2">
                    {topDish?.microVerdict || 'Vashi favorite. Tested & verified.'}
                  </div>
                </div>

                {/* 🔴 Skip Item */}
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-300">
                  <div className="flex items-center gap-1 text-[11px] font-black text-red-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-700 shrink-0" />
                    <span>🔴 Skip This</span>
                  </div>
                  <div className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">
                    {skipDish?.name || 'Generic Side Dishes'}
                  </div>
                  <div className="text-[10px] text-red-900 mt-0.5 font-medium line-clamp-2">
                    {skipDish?.reason || 'Avoid ordering off-menu items.'}
                  </div>
                </div>
              </div>

              {/* High-Contrast Counter Incentive Badge */}
              <div className="p-3 rounded-xl bg-[#121316] text-white border-2 border-[#121316] flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FF5C00] flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase text-[#FF5C00] tracking-wider">
                    Counter Diner Perk
                  </div>
                  <div className="text-[11px] font-bold text-white leading-tight">
                    Show your Palate Screen at the Counter for Today's Diner Perk
                  </div>
                  <div className="text-[10px] text-gray-300 font-medium truncate mt-0.5">
                    {currentVenue.counterPerk.title}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Trust Markers */}
            <div className="mt-4 pt-3 border-t-2 border-[#121316] flex items-center justify-between text-[9px] font-semibold text-gray-600">
              <span>Verified by Sector 17 Locals</span>
              <span>No Paid Ads • No Fake 5-Stars</span>
              <span className="font-mono text-[#FF5C00]">palate-vashi.app</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
