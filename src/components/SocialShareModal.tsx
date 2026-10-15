import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  MapPin, 
  Quote, 
  Smartphone,
  CheckCircle2,
  Zap,
  Newspaper,
  SlidersHorizontal
} from 'lucide-react';
import { toPng } from 'html-to-image';
import type { Dish, CheckIn } from '../types';

export type StoryFilterStyle = 'classic' | 'spotlight' | 'cyber' | 'halftone';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  checkIn?: CheckIn | null;
}

interface FilterOption {
  id: StoryFilterStyle;
  label: string;
  badge: string;
  accentColor: string;
}

const FILTERS: FilterOption[] = [
  { id: 'classic', label: 'Classic APPROVED', badge: 'Signature Stamp', accentColor: '#10B981' },
  { id: 'spotlight', label: 'God-Tier Spotlight', badge: 'Gold Vignette', accentColor: '#F59E0B' },
  { id: 'cyber', label: 'Cyber-Bite', badge: 'Neon Radar', accentColor: '#00F0FF' },
  { id: 'halftone', label: 'Halftone Grid', badge: 'Vintage Press', accentColor: '#E5E7EB' },
];

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  dish,
  checkIn
}) => {
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<StoryFilterStyle>('spotlight');
  const [customQuote, setCustomQuote] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !dish) return null;

  const defaultQuote = checkIn?.note || (
    dish.verdict === 'SKIP'
      ? 'Save yourself the regret. Stick to the signature items.' 
      : 'The hype is 100% real. Non-negotiable must-order in Sector 17.'
  );

  const displayQuote = customQuote.trim() || defaultQuote;

  // Generate Image Blob / DataURL
  const generateStoryImage = async (): Promise<string | null> => {
    if (!storyCardRef.current) return null;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(storyCardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#07090C'
      });
      return dataUrl;
    } catch (err) {
      console.warn('html-to-image failed, falling back to canvas renderer:', err);
      return generateCanvasFallback();
    } finally {
      setIsExporting(false);
    }
  };

  // Canvas-based fallback generator customized for the 4 filter styles
  const generateCanvasFallback = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No canvas context');

    // Base Background
    ctx.fillStyle = activeFilter === 'halftone' ? '#FAF7F2' : '#07090C';
    ctx.fillRect(0, 0, 1080, 1920);

    // Style Specific Backdrop
    if (activeFilter === 'spotlight') {
      const gradient = ctx.createRadialGradient(540, 350, 50, 540, 500, 850);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.38)');
      gradient.addColorStop(1, 'rgba(7, 9, 12, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1200);
    } else if (activeFilter === 'cyber') {
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, 1000, 1840);
      // Neon magenta inner border
      ctx.strokeStyle = '#FF007F';
      ctx.lineWidth = 4;
      ctx.strokeRect(55, 55, 970, 1810);
    } else if (activeFilter === 'classic') {
      const gradient = ctx.createRadialGradient(540, 300, 50, 540, 450, 750);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      gradient.addColorStop(1, 'rgba(7, 9, 12, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1000);
    } else if (activeFilter === 'halftone') {
      ctx.strokeStyle = '#262C36';
      ctx.lineWidth = 8;
      ctx.strokeRect(50, 50, 980, 1820);
    }

    // Header & Brand
    ctx.fillStyle = activeFilter === 'halftone' ? '#0E1116' : '#FF5C1F';
    ctx.font = 'bold 56px system-ui';
    ctx.fillText('PALATE.', 100, 180);

    ctx.fillStyle = activeFilter === 'halftone' ? '#555555' : '#9CA3AF';
    ctx.font = '600 36px system-ui';
    ctx.fillText('Sector 17, Vashi • Anti-Regret Radar', 100, 240);

    if (activeFilter === 'cyber') {
      ctx.fillStyle = '#FF007F';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('● REC • 23:14:08 IST • GPS 19.0760° N, 72.9986° E', 100, 300);
    }

    // Dish Title
    ctx.fillStyle = activeFilter === 'halftone' ? '#0E1116' : '#FFFFFF';
    ctx.font = '900 70px system-ui';
    ctx.fillText(dish.name, 100, 480);

    // Venue
    ctx.fillStyle = activeFilter === 'halftone' ? '#FF5C1F' : '#FF5C1F';
    ctx.font = 'bold 44px system-ui';
    ctx.fillText(`@ ${dish.venueName}`, 100, 550);

    // Stamp
    let stampColor = '#10B981';
    let stampText = '★ TASTED & APPROVED BY LOCALS ★';
    if (activeFilter === 'spotlight') {
      stampColor = '#F59E0B';
      stampText = '✦ 98% GOD-TIER SPOTLIGHT ✦';
    } else if (activeFilter === 'cyber') {
      stampColor = '#00F0FF';
      stampText = '⚡ CYBER-VERIFIED // MUST-BITE';
    } else if (activeFilter === 'halftone') {
      stampColor = '#0E1116';
      stampText = '📰 THE VASHI CHRONICLE • TOP PICK';
    }

    ctx.strokeStyle = stampColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(100, 640, 880, 120);
    ctx.fillStyle = stampColor;
    ctx.font = 'bold 46px system-ui';
    ctx.fillText(stampText, 140, 720);

    // Quote
    ctx.fillStyle = activeFilter === 'halftone' ? '#2A2D34' : '#D1D5DB';
    ctx.font = 'italic 42px system-ui';
    ctx.fillText(`“${displayQuote}”`, 100, 950);

    // Footer
    ctx.fillStyle = '#FF5C1F';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('palate-vashi.app', 100, 1820);

    return canvas.toDataURL('image/png');
  };

  const handleDownload = async () => {
    try {
      const dataUrl = await generateStoryImage();
      if (!dataUrl) return;

      const link = document.createElement('a');
      link.download = `palate-${dish.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-story.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const handleNativeShare = async () => {
    const shareText = `🥘 Check out ${dish.name} at ${dish.venueName} in Sector 17, Vashi! Verified on Palate Anti-Regret Radar.`;
    const shareUrl = window.location.origin ? `${window.location.origin}/?dish=${dish.id}` : 'https://palate-vashi.app';

    if (navigator.share) {
      try {
        const dataUrl = await generateStoryImage();
        if (dataUrl) {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], 'palate-story.png', { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `${dish.name} • Palate Sector 17`,
              text: shareText,
              files: [file]
            });
            return;
          }
        }

        // Fallback to text & url
        await navigator.share({
          title: `${dish.name} • Palate`,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share dismissed or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const shareUrl = window.location.origin ? `${window.location.origin}/?dish=${dish.id}` : 'https://palate-vashi.app';
    const textToCopy = `🔥 ${dish.name} @ ${dish.venueName}: "${displayQuote}"\nVerified on Palate Sector 17: ${shareUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const isHalftone = activeFilter === 'halftone';
  const isCyber = activeFilter === 'cyber';
  const isSpotlight = activeFilter === 'spotlight';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-md bg-[#0E1116] border border-[#262C36] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Header */}
        <div className="px-4 py-3 border-b border-[#262C36] bg-[#0E1116] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
              Social Flex • Story Export
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#161B22] hover:bg-neutral-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close story editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Story Editor Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex flex-col items-center">
          
          {/* THE 9:16 STORY CARD (CENTERED CINEMATIC PREVIEW CONTAINER) */}
          <div 
            ref={storyCardRef}
            className={`w-[275px] sm:w-[305px] aspect-[9/16] rounded-3xl p-4 flex flex-col justify-between relative shadow-2xl overflow-hidden shrink-0 select-none transition-all duration-300 ${
              isSpotlight
                ? 'bg-[#07090C] border-2 border-amber-500/50 story-vignette'
                : isCyber
                ? 'bg-[#06080E] border-2 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                : isHalftone
                ? 'bg-[#FAF7F2] border-2 border-dashed border-neutral-700 text-[#0E1116]'
                : 'bg-[#0E1116] border border-[#262C36]'
            }`}
            style={{
              backgroundImage: 
                isSpotlight
                  ? 'radial-gradient(circle at 50% 12%, rgba(245, 158, 11, 0.32) 0%, rgba(7, 9, 12, 1) 75%)'
                  : activeFilter === 'classic'
                  ? 'radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.2) 0%, rgba(14, 17, 22, 1) 70%)'
                  : isCyber
                  ? 'radial-gradient(circle at 50% 10%, rgba(0, 240, 255, 0.2) 0%, rgba(6, 8, 14, 1) 70%)'
                  : undefined
            }}
          >
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#FF5C1F] flex items-center justify-center text-white shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className={`font-display font-black text-xs tracking-widest uppercase ${
                  isHalftone ? 'text-[#0E1116]' : 'text-white'
                }`}>
                  Palate<span className="text-[#FF5C1F]">.</span>
                </span>
              </div>

              <div className={`text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                isHalftone 
                  ? 'bg-black/5 text-neutral-700 border-neutral-300' 
                  : 'text-neutral-300 bg-black/60 backdrop-blur-md border-white/10'
              }`}>
                <MapPin className="w-2.5 h-2.5 text-[#FF5C1F]" />
                <span>Sector 17, Vashi</span>
              </div>
            </div>

            {/* Cyber specific HUD timestamp ticker with neon magenta accent */}
            {isCyber && (
              <div className="z-10 text-left font-mono text-[8px] text-[#FF007F] tracking-widest uppercase -mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] animate-pulse" />
                <span>REC • 23:14:08 IST • GPS 19.0760° N</span>
              </div>
            )}

            {/* Center Dish Content */}
            <div className="space-y-3 z-10 py-1">
              {/* Dish Image */}
              <div className={`relative aspect-[4/3] w-full rounded-2xl overflow-hidden border shadow-xl ${
                isHalftone ? 'border-neutral-300 bg-neutral-200' : 'border-white/15 bg-[#161B22]'
              }`}>
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-white bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                    ₹{dish.price}
                  </span>
                  <span className={`text-[10px] font-bold backdrop-blur-md px-2.5 py-0.5 rounded-full border ${
                    isCyber 
                      ? 'bg-[#FF007F]/20 text-[#FF007F] border-[#FF007F]/40'
                      : 'text-amber-300 bg-black/70 border-amber-500/30'
                  }`}>
                    {dish.category}
                  </span>
                </div>
              </div>

              {/* Dish Name & Venue */}
              <div className="text-left space-y-0.5">
                <h2 className={`text-base font-black tracking-tight leading-tight line-clamp-2 ${
                  isHalftone ? 'text-[#0E1116]' : 'text-white'
                }`}>
                  {dish.name}
                </h2>
                <div className={`text-[11px] font-semibold flex items-center gap-1 ${
                  isHalftone ? 'text-neutral-600' : 'text-slate-400'
                }`}>
                  <span>@</span>
                  <span className={`underline decoration-[#FF5C1F] underline-offset-2 font-bold ${
                    isHalftone ? 'text-[#0E1116]' : 'text-white'
                  }`}>
                    {dish.venueName}
                  </span>
                </div>
              </div>

              {/* Dynamic Filter Stamp */}
              <div className="pt-0.5 flex justify-start">
                {activeFilter === 'classic' && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 border-2 border-emerald-400 text-emerald-300 text-[10px] font-black tracking-wider uppercase -rotate-2 shadow-lg">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>APPROVED BY LOCALS</span>
                  </div>
                )}
                {isSpotlight && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-[10px] font-black tracking-wider uppercase rotate-1 shadow-lg shadow-amber-950/40">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>98% GOD-TIER SPOTLIGHT</span>
                  </div>
                )}
                {isCyber && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#00F0FF]/15 border-2 border-[#00F0FF] text-[#00F0FF] text-[10px] font-mono font-black tracking-widest uppercase shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                    <Zap className="w-3 h-3 text-[#FF007F]" />
                    <span>CYBER-VERIFIED // BITE</span>
                  </div>
                )}
                {isHalftone && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0E1116] border border-[#262C36] text-[#FAF7F2] text-[10px] font-serif font-black tracking-widest uppercase -rotate-1 shadow-md">
                    <Newspaper className="w-3 h-3 text-neutral-300" />
                    <span>VASHI CHRONICLE • TOP PICK</span>
                  </div>
                )}
              </div>

              {/* User Note Quote Box */}
              <div className={`p-3 rounded-xl border backdrop-blur-md relative text-left ${
                isHalftone 
                  ? 'bg-white/90 border-neutral-300 text-neutral-800' 
                  : 'bg-black/50 border-white/10 text-neutral-200'
              }`}>
                <Quote className="w-3 h-3 text-[#FF5C1F]/70 absolute top-2 right-2" />
                <p className="text-[11px] italic font-medium leading-relaxed line-clamp-3 pr-4">
                  “{displayQuote}”
                </p>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className={`pt-2 border-t flex items-center justify-between text-[9px] font-bold z-10 ${
              isHalftone ? 'border-neutral-300 text-neutral-500' : 'border-white/10 text-slate-400'
            }`}>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Anti-Regret Radar</span>
              </div>
              <span className="text-[#FF5C1F] font-mono">palate-vashi.app</span>
            </div>
          </div>

          {/* Interactive UI Carousel: Filter & Style Overlays */}
          <div className="w-full space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 px-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-orange" />
              <span>Select Story Filter Overlay</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-left border transition-all active:scale-95 flex flex-col gap-0.5 ${
                      isActive
                        ? 'bg-[#161B22] border-brand-orange text-white shadow-glow-orange'
                        : 'bg-[#161B22]/60 border-[#262C36] text-slate-400 hover:text-white hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: f.accentColor }} 
                      />
                      <span>{f.label}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-semibold tracking-wider">
                      {f.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Caption Editing Input: "What was the highlight?" */}
          <div className="w-full space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block text-left">
              What was the highlight?
            </label>
            <input
              type="text"
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              placeholder="What was the highlight? (e.g. Extra kadak butter, crispy crust...)"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-[#161B22] border border-[#262C36] text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/40"
            />
          </div>

        </div>

        {/* Spacious Bottom Sheet Action Buttons (High contrast min 44px) */}
        <div className="p-4 bg-[#0E1116] border-t border-[#262C36] space-y-2.5 shrink-0">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleNativeShare}
              disabled={isExporting}
              className="min-h-[44px] px-3 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-glow-orange flex items-center justify-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer tracking-wide"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>{isExporting ? 'Generating...' : 'Share Story'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="min-h-[44px] px-3 rounded-xl bg-[#161B22] hover:bg-[#1E2430] text-white border border-[#262C36] hover:border-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer tracking-wide"
            >
              <Download className="w-4 h-4 text-brand-orange" />
              <span>Save Image (PNG)</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full min-h-[44px] rounded-xl bg-[#161B22]/40 hover:bg-[#161B22] border border-[#262C36] text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Verdict & Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Link with Verdict</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
