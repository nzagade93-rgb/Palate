import React, { useState, useEffect } from 'react';
import { X, Smartphone, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also show educational prompt on mobile if not standalone and first time
    const dismissed = localStorage.getItem('palate_install_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Guide for iOS Safari / standard browsers
      alert("To install Palate on your iPhone/Android:\n\n1. Tap the Share button (Safari) or 3 dots (Chrome)\n2. Select 'Add to Home Screen'\n\nEnjoy instant offline dish radar access!");
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('palate_install_dismissed', 'true');
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-sm z-40 animate-slide-up">
      <div className="p-3 rounded-2xl bg-[#0E1116]/95 backdrop-blur-xl border border-brand-orange/40 shadow-glow-orange flex items-center justify-between gap-2.5 text-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-500 p-0.5 shrink-0 flex items-center justify-center shadow-md">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>Install Palate PWA</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h4>
            <p className="text-[11px] text-gray-400 truncate">
              Instant offline radar & cached food notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-gray-400 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
