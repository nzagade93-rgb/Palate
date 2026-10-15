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
    ctx.fillStyle = activeFilter === 'halftone' ? '#111317' : '#07090C';
    ctx.fillRect(0, 0, 1080, 1920);

    // Style Specific Backdrop
    if (activeFilter === 'spotlight') {
      const gradient = ctx.createRadialGradient(540, 350, 50, 540, 500, 850);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
      gradient.addColorStop(1, 'rgba(7, 9, 12, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1200);
    } else if (activeFilter === 'cyber') {
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, 1000, 1840);
    } else if (activeFilter === 'classic') {
      const gradient = ctx.createRadialGradient(540, 300, 50, 540, 450, 750);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      gradient.addColorStop(1, 'rgba(7, 9, 12, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1000);
    }

    // Header & Brand
    ctx.fillStyle = '#FF5C1F';
    ctx.font = 'bold 56px system-ui';
    ctx.fillText('PALATE.', 100, 180);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '600 36px system-ui';
    ctx.fillText('Sector 17, Vashi • Anti-Regret Radar', 100, 240);

    if (activeFilter === 'cyber') {
      ctx.fillStyle = '#00F0FF';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('[ 23:14 IST • GPS 19.0760° N, 72.9986° E ]', 100, 300);
    }

    // Dish Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 70px system-ui';
    ctx.fillText(dish.name, 100, 480);

    // Venue
    ctx.fillStyle = '#FF5C1F';
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
      stampColor = '#E5E7EB';
      stampText = '📰 THE VASHI CHRONICLE • TOP PICK';
    }

    ctx.strokeStyle = stampColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(100, 640, 880, 120);
    ctx.fillStyle = stampColor;
    ctx.font = 'bold 46px system-ui';
    ctx.fillText(stampText, 140, 720);

    // Quote
    ctx.fillStyle = '#D1D5DB';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-md bg-[#07090C] border border-neutral-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Header */}
        <div className="px-4 py-3 border-b border-neutral-800/40 bg-[#0E1116] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 tracking-ultra-wide uppercase">
              Social Flex • Story Export
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#141720] hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
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
              activeFilter === 'spotlight'
                ? 'bg-[#07090C] border-2 border-amber-500/50 story-vignette'
                : activeFilter === 'cyber'
                ? 'bg-[#06080E] border-2 border-[#00F0FF]/60 story-cyber-glow'
                : activeFilter === 'halftone'
                ? 'bg-[#111317] border-2 border-neutral-500/40 halftone-pattern'
                : 'bg-[#07090C] border-2 border-emerald-500/40'
            }`}
            style={{
              backgroundImage: 
                activeFilter === 'spotlight'
                  ? 'radial-gradient(circle at 50% 10%, rgba(245, 158, 11, 0.28) 0%, rgba(7, 9, 12, 1) 70%)'
                  : activeFilter === 'classic'
                  ? 'radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.2) 0%, rgba(7, 9, 12, 1) 65%)'
                  : activeFilter === 'cyber'
                  ? 'radial-gradient(circle at 50% 10%, rgba(0, 240, 255, 0.18) 0%, rgba(6, 8, 14, 1) 70%)'
                  : undefined
            }}
          >
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#FF5C1F] flex items-center justify-center text-white shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="font-display font-black text-xs text-white tracking-ultra-wide uppercase">
                  Palate<span className="text-[#FF5C1F]">.</span>
                </span>
              </div>

              <div className="text-[9px] font-semibold tracking-wider text-neutral-300 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-[#FF5C1F]" />
                <span>Sector 17, Vashi</span>
              </div>
            </div>

            {/* Cyber specific HUD stamp */}
            {activeFilter === 'cyber' && (
              <div className="z-10 text-left font-mono text-[8px] text-[#00F0FF]/90 tracking-widest uppercase -mt-2">
                REC • 23:14 IST • SECTOR 17 VASHI
              </div>
            )}

            {/* Center Dish Content */}
            <div className="space-y-3 z-10 py-1">
              {/* Dish Image */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-[#141720]">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                    ₹{dish.price}
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30">
                    {dish.category}
                  </span>
                </div>
              </div>

              {/* Dish Name & Venue */}
              <div className="text-left space-y-0.5">
                <h2 className="text-base font-black text-white tracking-tight leading-tight line-clamp-2">
                  {dish.name}
                </h2>
                <div className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                  <span>@</span>
                  <span className="text-white underline decoration-[#FF5C1F] underline-offset-2">
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
                {activeFilter === 'spotlight' && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-[10px] font-black tracking-wider uppercase rotate-1 shadow-lg shadow-amber-950/40">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>98% GOD-TIER SPOTLIGHT</span>
                  </div>
                )}
                {activeFilter === 'cyber' && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none bg-[#00F0FF]/15 border-2 border-[#00F0FF] text-[#00F0FF] text-[10px] font-mono font-black tracking-widest uppercase">
                    <Zap className="w-3 h-3 text-[#00F0FF]" />
                    <span>CYBER-VERIFIED // BITE</span>
                  </div>
                )}
                {activeFilter === 'halftone' && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-white/10 border-2 border-neutral-300 text-neutral-200 text-[10px] font-serif font-black tracking-widest uppercase -rotate-1">
                    <Newspaper className="w-3 h-3 text-neutral-300" />
                    <span>VASHI CHRONICLE • TOP PICK</span>
                  </div>
                )}
              </div>

              {/* User Note Quote Box */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md relative text-left">
                <Quote className="w-3 h-3 text-[#FF5C1F]/60 absolute top-2 right-2" />
                <p className="text-[11px] text-neutral-200 italic font-medium leading-snug line-clamp-3 pr-4">
                  “{displayQuote}”
                </p>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-bold text-neutral-400 z-10">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Anti-Regret Radar</span>
              </div>
              <span className="text-[#FF5C1F] font-mono">palate-vashi.app</span>
            </div>
          </div>

          {/* Interactive UI Carousel: Filter & Style Overlays */}
          <div className="w-full space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-1">
              <SlidersHorizontal className="w-3 h-3 text-brand-orange" />
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
                        ? 'bg-[#141720] border-brand-orange text-white shadow-glow-orange'
                        : 'bg-[#0E1116] border-neutral-800/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: f.accentColor }} 
                      />
                      <span>{f.label}</span>
                    </div>
                    <span className="text-[9px] text-neutral-500 font-semibold tracking-wider">
                      {f.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Caption Editing Input: "What was the highlight?" */}
          <div className="w-full space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block text-left">
              What was the highlight?
            </label>
            <input
              type="text"
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              placeholder="What was the highlight? (e.g. Extra kadak butter, crispy crust...)"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-[#0E1116] border border-neutral-800/60 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-orange"
            />
          </div>

        </div>

        {/* Spacious Bottom Sheet Action Buttons */}
        <div className="p-4 bg-[#0E1116] border-t border-neutral-800/40 space-y-2.5 shrink-0">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleNativeShare}
              disabled={isExporting}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-white font-extrabold text-xs shadow-glow-orange flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer tracking-wide"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>{isExporting ? 'Generating...' : 'Share Story'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="py-2.5 px-3 rounded-xl bg-[#141720] hover:bg-neutral-800 text-neutral-200 border border-neutral-800/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer tracking-wide"
            >
              <Download className="w-4 h-4 text-brand-orange" />
              <span>Save Image (PNG)</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2 text-xs font-semibold text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Verdict & Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
