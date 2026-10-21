'use client';

// ==============================================================================
// PALATE: Shareable Battle Cards
// Specifically engineered for WhatsApp & Instagram Stories.
// Supports FORMAT A (LIVE BATTLE) and FORMAT B (FINAL RESULT).
// ==============================================================================

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battle } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';
import { X, Share2, Copy, Download, Check, MessageCircle, Swords, Trophy, ExternalLink } from 'lucide-react';

interface ShareableBattleCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  battle: Battle;
  format?: 'live' | 'result';
}

export default function ShareableBattleCardModal({
  isOpen,
  onClose,
  battle,
  format = 'live',
}: ShareableBattleCardModalProps) {
  const [activeFormat, setActiveFormat] = useState<'live' | 'result'>(
    battle.status === 'completed' || !battle.isActive ? 'result' : format
  );
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const nodeA = battle.contestantA.neighborhood.split(',')[0]?.trim() || battle.contestantA.neighborhood;
  const nodeB = battle.contestantB.neighborhood.split(',')[0]?.trim() || battle.contestantB.neighborhood;

  const getShareUrl = (channel: string = 'share') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://palate.app';
    return `${origin}/battle/${battle.slug || battle.id}?ref=share&utm_source=${channel}&format=${activeFormat}`;
  };

  const isBlueWinner = battle.votesA >= battle.votesB;
  const winningContestant = isBlueWinner ? battle.contestantA : battle.contestantB;
  const runnerUp = isBlueWinner ? battle.contestantB : battle.contestantA;

  const liveShareText = `🔥 PALATE FOOD FIGHT: ${nodeA} says ${battle.contestantA.name} vs ${nodeB} says ${battle.contestantB.name}! Who makes the undisputed best ${battle.dishName}? Cast your vote and settle the debate: ${getShareUrl('whatsapp')}`;

  const resultShareText = `🏆 FINAL RESULT: ${winningContestant.name} takes the crown with ${isBlueWinner ? battle.percentA : battle.percentB}% votes over ${runnerUp.name} in the ${battle.title}! Think someone serves better? Challenge the winner on PALATE: ${getShareUrl('whatsapp')}`;

  const currentShareText = activeFormat === 'result' ? resultShareText : liveShareText;

  const handleWhatsAppShare = () => {
    trackEvent('battle_shared', {
      battleId: battle.id,
      battleSlug: battle.slug,
      channel: 'whatsapp',
      format: activeFormat,
    });
    const encoded = encodeURIComponent(currentShareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `PALATE: ${battle.title}`,
          text: currentShareText,
          url: getShareUrl('native_share'),
        });
        trackEvent('battle_shared', {
          battleId: battle.id,
          battleSlug: battle.slug,
          channel: 'native_share',
          format: activeFormat,
        });
        return;
      } catch {
        // Fallback
      }
    }
    handleCopyLink();
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(getShareUrl('copy_link'));
      setCopied(true);
      trackEvent('battle_shared', {
        battleId: battle.id,
        battleSlug: battle.slug,
        channel: 'copy_link',
        format: activeFormat,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownloadCard = async () => {
    setDownloading(true);
    // Draw simple crisp canvas representation for download
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350; // Instagram Portrait 4:5
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Background
        ctx.fillStyle = '#F6EFE2';
        ctx.fillRect(0, 0, 1080, 1350);

        // Header Border Box
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#121212';
        ctx.strokeRect(40, 40, 1000, 1270);

        // Header
        ctx.fillStyle = '#FFD11A';
        ctx.fillRect(40, 40, 1000, 140);
        ctx.strokeRect(40, 40, 1000, 140);

        ctx.fillStyle = '#121212';
        ctx.font = 'bold 52px system-ui, sans-serif';
        ctx.fillText('PALATE • INDIA\'S FOOD FIGHTS', 80, 130);

        // Title
        ctx.fillStyle = '#121212';
        ctx.font = '900 64px system-ui, sans-serif';
        const displayHeadline = activeFormat === 'result'
          ? (isBlueWinner ? 'TEAM BLUE WINS!' : 'TEAM PINK WINS!')
          : `${nodeA} says A. ${nodeB} says B.`;
        ctx.fillText(displayHeadline, 80, 260);

        // Subtitle
        ctx.font = 'bold 36px system-ui, sans-serif';
        ctx.fillStyle = '#555555';
        ctx.fillText(battle.title, 80, 320);

        // Contestant A (Blue)
        ctx.fillStyle = '#2748FF';
        ctx.fillRect(80, 400, 920, 260);
        ctx.strokeStyle = '#121212';
        ctx.strokeRect(80, 400, 920, 260);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 44px system-ui, sans-serif';
        ctx.fillText(`TEAM BLUE: ${battle.contestantA.name}`, 120, 490);
        ctx.font = '900 72px monospace';
        ctx.fillText(`${battle.percentA}% (${battle.votesA} Votes)`, 120, 580);

        // Contestant B (Pink)
        ctx.fillStyle = '#FF5C9A';
        ctx.fillRect(80, 700, 920, 260);
        ctx.strokeStyle = '#121212';
        ctx.strokeRect(80, 700, 920, 260);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 44px system-ui, sans-serif';
        ctx.fillText(`TEAM PINK: ${battle.contestantB.name}`, 120, 790);
        ctx.font = '900 72px monospace';
        ctx.fillText(`${battle.percentB}% (${battle.votesB} Votes)`, 120, 880);

        // Footer Callout
        ctx.fillStyle = '#121212';
        ctx.fillRect(80, 1020, 920, 180);
        ctx.fillStyle = '#FFD11A';
        ctx.font = 'bold 40px system-ui, sans-serif';
        ctx.fillText('VOTE & SETTLE THE SCORE AT PALATE.APP', 120, 1120);

        // Download trigger
        const link = document.createElement('a');
        link.download = `palate-battle-${battle.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        trackEvent('battle_shared', {
          battleId: battle.id,
          battleSlug: battle.slug,
          channel: 'image_download',
          format: activeFormat,
        });
      }
    } catch (e) {
      console.warn('Canvas render error:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#121212]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl border-[3px] border-[#3A2E28] bg-[#FFF8EE] p-5 sm:p-6 shadow-[6px_6px_0px_#3A2E28]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border-2 border-[#3A2E28] bg-[#FFFFFF] p-1.5 text-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] hover:bg-[#F6B21A] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Header */}
          <div className="mb-4">
            <span className="stamp-tag mb-1.5">
              <span>SOCIAL GROWTH ENGINE</span>
            </span>
            <h3 className="text-xl font-black text-[#3A2E28] uppercase tracking-tight">
              Shareable Battle Card
            </h3>
            <p className="text-xs text-[#3A2E28]/70 font-medium">
              Optimized for WhatsApp status, chats, and Instagram Stories.
            </p>
          </div>

          {/* Format Switcher */}
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border-2 border-[#3A2E28] bg-[#FFFFFF] p-1">
            <button
              onClick={() => setActiveFormat('live')}
              className={`rounded-lg py-1.5 text-xs font-black uppercase transition-all ${
                activeFormat === 'live'
                  ? 'bg-[#0F5132] text-white border-2 border-[#3A2E28] shadow-[2px_2px_0px_#3A2E28]'
                  : 'text-[#3A2E28]/70 hover:text-[#3A2E28]'
              }`}
            >
              Format A: Live Battle
            </button>
            <button
              onClick={() => setActiveFormat('result')}
              className={`rounded-lg py-1.5 text-xs font-black uppercase transition-all ${
                activeFormat === 'result'
                  ? 'bg-[#0F5132] text-white border-2 border-[#3A2E28] shadow-[2px_2px_0px_#3A2E28]'
                  : 'text-[#3A2E28]/70 hover:text-[#3A2E28]'
              }`}
            >
              Format B: Final Result
            </button>
          </div>

          {/* PREVIEW CARD: THE ACTUAL SHARE CARD */}
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-xl border-[2.5px] border-[#3A2E28] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#3A2E28]"
          >
            {/* Top Brand Banner */}
            <div className="flex items-center justify-between border-b-2 border-[#3A2E28] pb-2 mb-3 bg-[#0F5132] -mx-4 -mt-4 px-4 pt-3 text-white">
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs tracking-wider">
                  PALATE • NAVI MUMBAI
                </span>
              </div>
              <span className="rounded bg-[#F6B21A] px-2 py-0.5 font-mono text-[9px] font-black text-[#3A2E28]">
                {activeFormat === 'result' ? 'FINAL TALLY' : 'LIVE VOTE'}
              </span>
            </div>

            {/* Oversized Headline */}
            <div className="mb-3">
              <h4 className="text-xl sm:text-2xl font-black text-[#3A2E28] uppercase leading-tight tracking-tight">
                {activeFormat === 'result' ? (
                  isBlueWinner ? (
                    <span className="text-[#0F5132]">CONTENDER A WINS!</span>
                  ) : (
                    <span className="text-[#EF4E3A]">CONTENDER B WINS!</span>
                  )
                ) : (
                  <span>
                    {nodeA} says <span className="text-[#0F5132]">A</span>. {nodeB} says{' '}
                    <span className="text-[#EF4E3A]">B</span>.
                  </span>
                )}
              </h4>
              <p className="text-xs font-bold text-[#3A2E28]/75 mt-0.5 line-clamp-1">
                {battle.title}
              </p>
            </div>

            {/* Match Cards */}
            <div className="space-y-2 mb-3">
              {/* Contestant A (Forest Green) */}
              <div
                className={`relative flex items-center justify-between rounded-lg border-2 border-[#3A2E28] p-2.5 ${
                  activeFormat === 'result' && isBlueWinner ? 'bg-[#DCE7D9]/40' : 'bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0F5132] font-black text-xs text-white border border-[#3A2E28]">
                    A
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-[#3A2E28] leading-tight">
                      {battle.contestantA.name}
                    </h5>
                    <span className="text-[10px] text-[#3A2E28]/60 font-medium">
                      {battle.contestantA.neighborhood}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-black text-[#0F5132]">
                    {battle.percentA}%
                  </span>
                  <span className="block text-[9px] font-mono text-[#3A2E28]/60 font-bold">
                    {battle.votesA.toLocaleString()} votes
                  </span>
                </div>
              </div>

              {/* Contestant B (Tomato Red) */}
              <div
                className={`relative flex items-center justify-between rounded-lg border-2 border-[#3A2E28] p-2.5 ${
                  activeFormat === 'result' && !isBlueWinner ? 'bg-[#FFF1F0]' : 'bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EF4E3A] font-black text-xs text-white border border-[#3A2E28]">
                    B
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-[#3A2E28] leading-tight">
                      {battle.contestantB.name}
                    </h5>
                    <span className="text-[10px] text-[#3A2E28]/60 font-medium">
                      {battle.contestantB.neighborhood}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-black text-[#EF4E3A]">
                    {battle.percentB}%
                  </span>
                  <span className="block text-[9px] font-mono text-[#3A2E28]/60 font-bold">
                    {battle.votesB.toLocaleString()} votes
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer & Callout */}
            <div className="rounded-lg border border-[#3A2E28] bg-[#FFF8EE] p-2 text-center">
              <p className="text-[11px] font-black uppercase text-[#3A2E28]">
                {activeFormat === 'result'
                  ? '🔥 Think someone serves better? Challenge the winner!'
                  : '⚔️ Your neighbourhood is calling. Vote now!'}
              </p>
              <p className="text-[9px] text-[#121212]/60 font-mono mt-0.5">
                palate.app • Community Popularity Poll
              </p>
            </div>
          </div>

          {/* Share Actions */}
          <div className="mt-4 space-y-2">
            {/* WhatsApp Direct Share */}
            <button
              onClick={handleWhatsAppShare}
              id="modal-share-whatsapp"
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#25D366] py-3 text-xs font-black uppercase tracking-wider text-black border-2 border-[#3A2E28] shadow-[3px_3px_0px_#3A2E28] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Share to WhatsApp Chat / Status</span>
            </button>

            <div className="grid grid-cols-3 gap-2">
              {/* Native Share */}
              <button
                onClick={handleNativeShare}
                className="btn-white py-2.5 text-xs font-black flex items-center justify-center space-x-1"
                title="System Share"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="btn-white py-2.5 text-xs font-black flex items-center justify-center space-x-1"
                title="Copy Link"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Download Image */}
              <button
                onClick={handleDownloadCard}
                disabled={downloading}
                className="btn-white py-2.5 text-xs font-black flex items-center justify-center space-x-1"
                title="Save Image"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{downloading ? '...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
