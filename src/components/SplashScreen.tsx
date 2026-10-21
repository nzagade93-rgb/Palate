'use client';

// ==============================================================================
// PALATE: Splash Video Intro Screen
// Plays official 9:16 mobile splash video on first app launch per session,
// with instant "Skip" trigger, auto-fade, and brand styling.
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Sparkles } from 'lucide-react';
import PalateLogo from '@/components/PalateLogo';

interface SplashScreenProps {
  onFinish?: () => void;
  videoSrc?: string;
  forceShow?: boolean;
}

export default function SplashScreen({
  onFinish,
  videoSrc = '/videos/splash.mp4',
  forceShow = false,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user already saw the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem('palate_splash_seen');
    if (forceShow || !hasSeenSplash) {
      setIsVisible(true);
    }
  }, [forceShow]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('palate_splash_seen', 'true');
    if (onFinish) {
      onFinish();
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F5132] overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F5132] via-[#0B3D26] to-[#0A1C14] opacity-95" />

          {/* Main Video Container (Mobile 9:16 Frame) */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-md mx-auto px-4 py-6">
            {/* Top Bar: Brand + Controls */}
            <div className="w-full flex items-center justify-between mb-3 px-2 z-20">
              <div className="flex items-center space-x-2 bg-[#FFF8EE]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#3A2E28]/15 shadow-sm">
                <PalateLogo size="sm" showTagline={false} />
              </div>

              <div className="flex items-center space-x-2">
                {/* Audio Toggle */}
                <button
                  onClick={toggleSound}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8EE]/90 backdrop-blur-md text-[#3A2E28] border border-[#3A2E28]/15 shadow-sm hover:bg-[#FFF8EE] transition-all"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[#0F5132]" />}
                </button>

                {/* Skip / Enter Button */}
                <button
                  onClick={handleDismiss}
                  id="splash-skip-btn"
                  className="flex items-center space-x-1.5 bg-[#F6B21A] text-[#3A2E28] font-black text-xs px-3.5 py-2 rounded-full border border-[#3A2E28] shadow-[2px_2px_0px_#3A2E28] hover:bg-[#e5a315] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-wider"
                >
                  <span>Skip</span>
                  <X className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Video Player Card */}
            <div className="relative w-full flex-1 max-h-[82vh] overflow-hidden rounded-3xl border-[3px] border-[#3A2E28] bg-black shadow-[6px_6px_0px_#3A2E28]">
              <video
                ref={videoRef}
                src={videoSrc}
                playsInline
                autoPlay
                muted={isMuted}
                onLoadedData={() => setVideoLoaded(true)}
                onEnded={handleDismiss}
                className="w-full h-full object-cover"
              />

              {/* Loading Indicator */}
              {!videoLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F5132] text-[#FFF8EE] space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6B21A] border-2 border-[#3A2E28] animate-bounce shadow-[2px_2px_0px_#3A2E28]">
                    <Sparkles className="h-6 w-6 text-[#3A2E28]" />
                  </div>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFF8EE]">
                    Loading Palate...
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Tagline Banner */}
            <div className="mt-3 text-center">
              <span className="font-mono text-[10px] font-black uppercase text-[#FFF8EE]/80 tracking-widest">
                FOOD WORTH TALKING ABOUT • NAVI MUMBAI
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
