'use client';

// ==============================================================================
// PALATE: PWA Installation Prompt
// Non-intrusive street-poster banner inviting users to install the web app
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import { PalateAppIcon } from '@/components/PalateLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    try {
      if (sessionStorage.getItem('palate_install_dismissed')) {
        return;
      }
    } catch {}

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (isIosDevice && !isRunningStandalone) {
      const timer = setTimeout(() => setIsVisible(true), 3500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('Installation error:', err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('palate_install_dismissed', 'true');
    } catch {}
  };

  if (isStandalone || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md sm:bottom-6"
      >
        <div className="relative overflow-hidden rounded-2xl border-[2.5px] border-[#3A2E28] bg-[#FFFFFF] p-4 shadow-[5px_5px_0px_#3A2E28]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <PalateAppIcon size={44} />

              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#3A2E28] uppercase leading-tight">
                  Install Palate App
                </h4>
                <p className="text-[11px] text-[#3A2E28]/70 leading-snug font-medium">
                  Add to home screen for instant 1-tap food voting.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                id="install-pwa-btn"
                className="btn-forest px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5"
              >
                <Download className="h-3.5 w-3.5 text-[#F6B21A]" />
                <span>Install</span>
              </button>

              <button
                onClick={handleDismiss}
                className="rounded-lg p-1.5 text-[#121212]/60 hover:bg-[#DDD4C2] hover:text-[#121212] transition-colors"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* iOS Safari Guidance Drawer */}
          {showIOSInstructions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 border-t-2 border-[#121212] pt-2.5 text-xs text-[#121212]"
            >
              <p className="font-black text-[#121212] mb-1 uppercase font-mono text-[11px]">
                Install on iPhone / iPad:
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-[#121212]/80 font-bold">
                <span>1. Tap Share</span>
                <Share className="h-3.5 w-3.5 text-[#2748FF]" />
                <span>2. Select</span>
                <span className="flex items-center space-x-1 font-black text-[#121212] underline">
                  <PlusSquare className="h-3.5 w-3.5" />
                  <span>Add to Home Screen</span>
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
