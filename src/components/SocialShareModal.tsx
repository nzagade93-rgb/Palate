import React, { useState, useRef } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  MapPin, 
  Quote, 
  Smartphone,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { toPng } from 'html-to-image';
import type { Dish, CheckIn } from '../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  checkIn?: CheckIn | null;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  dish,
  checkIn
}) => {
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [customQuote, setCustomQuote] = useState('');
  const [stampStyle, setStampStyle] = useState<'APPROVED' | 'GOD_TIER' | 'SKIP'>(
    checkIn?.reaction === 'SKIP' ? 'SKIP' : 'APPROVED'
  );
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !dish) return null;

  const defaultQuote = checkIn?.note || (
    stampStyle === 'SKIP' 
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
        backgroundColor: '#07090E'
      });
      return dataUrl;
    } catch (err) {
      console.warn('html-to-image failed, falling back to canvas renderer:', err);
      return generateCanvasFallback();
    } finally {
      setIsExporting(false);
    }
  };

  // Canvas-based fallback generator if CORS restricts html-to-image
  const generateCanvasFallback = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No canvas context');

    // Background
    ctx.fillStyle = '#080A10';
    ctx.fillRect(0, 0, 1080, 1920);

    // Header Glow
    const gradient = ctx.createRadialGradient(540, 200, 50, 540, 300, 700);
    gradient.addColorStop(0, 'rgba(255, 87, 34, 0.25)');
    gradient.addColorStop(1, 'rgba(8, 10, 16, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 800);

    // Title & Branding
    ctx.fillStyle = '#FF5722';
    ctx.font = 'bold 52px system-ui';
    ctx.fillText('Palate.', 100, 180);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '36px system-ui';
    ctx.fillText('Sector 17, Vashi • Anti-Regret Radar', 100, 240);

    // Dish Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 68px system-ui';
    ctx.fillText(dish.name, 100, 420);

    // Venue
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 44px system-ui';
    ctx.fillText(`@ ${dish.venueName}`, 100, 490);

    // Stamp
    ctx.strokeStyle = stampStyle === 'SKIP' ? '#EF4444' : '#10B981';
    ctx.lineWidth = 8;
    ctx.strokeRect(100, 560, 880, 120);
    ctx.fillStyle = stampStyle === 'SKIP' ? '#EF4444' : '#10B981';
    ctx.font = 'bold 48px system-ui';
    ctx.fillText(
      stampStyle === 'SKIP' ? '⚠ TASTE POLICE: OVERHYPED SKIP' : '★ TASTED & APPROVED BY LOCALS ★',
      140,
      640
    );

    // Quote
    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'italic 42px system-ui';
    ctx.fillText(`“${displayQuote}”`, 100, 850);

    // Footer
    ctx.fillStyle = '#FF5722';
    ctx.font = 'bold 40px system-ui';
    ctx.fillText('palate-vashi.app', 100, 1800);

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
        // User cancelled or share failed
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-md bg-[#11131C] border border-[#262A3C] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="p-3.5 border-b border-[#222638] bg-[#151722] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white">Social Flex • Story Export</h3>
              <p className="text-[10px] text-gray-400">9:16 Instagram & WhatsApp Story format</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#202330] hover:bg-[#2A2E40] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Card & Customization Controls */}
        <div className="overflow-y-auto p-4 space-y-4 flex flex-col items-center">
          
          {/* Stamp Style Toggle */}
          <div className="w-full flex items-center justify-between gap-1.5 bg-[#171924] p-1 rounded-xl border border-[#272B3C] text-[11px]">
            <span className="text-gray-400 font-semibold px-2">Stamp:</span>
            <div className="flex items-center gap-1 flex-1 justify-end">
              <button
                onClick={() => setStampStyle('APPROVED')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  stampStyle === 'APPROVED' 
                    ? 'bg-emerald-500 text-white shadow-glow-green' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setStampStyle('GOD_TIER')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  stampStyle === 'GOD_TIER' 
                    ? 'bg-amber-500 text-black shadow-glow-orange' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                God-Tier
              </button>
              <button
                onClick={() => setStampStyle('SKIP')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  stampStyle === 'SKIP' 
                    ? 'bg-red-500 text-white shadow-glow-red' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Skip
              </button>
            </div>
          </div>

          {/* THE 9:16 STORY CARD (PREVIEW CONTAINER) */}
          <div 
            ref={storyCardRef}
            className="w-[280px] sm:w-[310px] aspect-[9/16] rounded-3xl bg-[#090A11] border-2 border-[#24283A] p-4 flex flex-col justify-between relative shadow-2xl overflow-hidden shrink-0 select-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 87, 34, 0.22) 0%, rgba(9, 10, 17, 1) 65%)'
            }}
          >
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-[#FF5722] flex items-center justify-center text-white shadow-sm">
                  <Flame className="w-4 h-4 fill-white" />
                </div>
                <span className="font-display font-black text-sm text-white tracking-tight">
                  Palate<span className="text-[#FF5722]">.</span>
                </span>
              </div>

              <div className="text-[10px] font-bold text-gray-300 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-[#FF5722]" />
                <span>Sector 17, Vashi</span>
              </div>
            </div>

            {/* Dish Visual Centerpiece */}
            <div className="space-y-3 z-10 py-1">
              
              {/* Dish Image */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-[#141620]">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15">
                    ₹{dish.price}
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30">
                    {dish.category}
                  </span>
                </div>
              </div>

              {/* Bold Dish Title & Venue */}
              <div className="text-left space-y-0.5">
                <h2 className="text-base font-black text-white tracking-tight leading-tight line-clamp-2">
                  {dish.name}
                </h2>
                <div className="text-[11px] font-semibold text-gray-300 flex items-center gap-1">
                  <span>@</span>
                  <span className="text-white underline decoration-brand-orange underline-offset-2">
                    {dish.venueName}
                  </span>
                </div>
              </div>

              {/* Visual Stamp Effect */}
              <div className="pt-1 flex justify-start">
                {stampStyle === 'APPROVED' ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-[11px] font-black tracking-wider uppercase -rotate-2 shadow-lg shadow-emerald-950/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TASTED & APPROVED</span>
                  </div>
                ) : stampStyle === 'GOD_TIER' ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-[11px] font-black tracking-wider uppercase rotate-1 shadow-lg shadow-amber-950/40">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>VERIFIED MUST-ORDER [{dish.scorePercent}%]</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/20 border-2 border-red-400 text-red-300 text-[11px] font-black tracking-wider uppercase -rotate-2 shadow-lg shadow-red-950/40">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>OFFICIAL LOCAL SKIP</span>
                  </div>
                )}
              </div>

              {/* User Note Quote Box */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md relative text-left">
                <Quote className="w-3.5 h-3.5 text-brand-orange/60 absolute top-2 right-2" />
                <p className="text-[11px] text-gray-200 italic font-medium leading-snug line-clamp-3 pr-4">
                  “{displayQuote}”
                </p>
              </div>

            </div>

            {/* Bottom Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-bold text-gray-400 z-10">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Anti-Regret Food Radar</span>
              </div>
              <span className="text-[#FF5722] font-mono">palate-vashi.app</span>
            </div>

            {/* Background subtle watermark */}
            <div className="absolute -bottom-8 -right-8 opacity-5 text-white pointer-events-none">
              <Flame className="w-48 h-48" />
            </div>

          </div>

          {/* Quick Note Input */}
          <div className="w-full max-w-[310px] space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block text-left">
              Edit Story Caption:
            </label>
            <input
              type="text"
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              placeholder={defaultQuote}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-[#171924] border border-[#272B3C] text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
            />
          </div>

        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-3.5 bg-[#151722] border-t border-[#222638] space-y-2 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleNativeShare}
              disabled={isExporting}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-glow-orange flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-white" />
              <span>{isExporting ? 'Generating...' : 'Share Story'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="py-2.5 px-3 rounded-xl bg-[#222638] hover:bg-[#2B3044] text-white border border-[#343A4F] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4 text-brand-orange" />
              <span>Save PNG</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-1.5 text-[11px] font-semibold text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Verdict & Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link with Verdict</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
