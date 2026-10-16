import React, { useState, useEffect } from 'react';
import { X, Smartphone, Sparkles, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('pwa_dismissed') === 'true' ||
        localStorage.getItem('palate_install_dismissed') === 'true'
      );
    } catch {
      return false;
    }
  });
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
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsDismissed(true);
        try {
          localStorage.setItem('pwa_dismissed', 'true');
          localStorage.setItem('palate_install_dismissed', 'true');
        } catch {}
      }
      setDeferredPrompt(null);
    } else {
      // Guide for iOS Safari / standard browsers
      alert(
        "To install Palate on your iPhone/Android:\n\n1. Tap the Share icon (Safari) or 3 dots (Chrome)\n2. Select 'Add to Home Screen'\n\nEnjoy instant offline dish radar access!"
      );
      setIsDismissed(true);
      try {
        localStorage.setItem('pwa_dismissed', 'true');
        localStorage.setItem('palate_install_dismissed', 'true');
      } catch {}
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    try {
      localStorage.setItem('pwa_dismissed', 'true');
      localStorage.setItem('palate_install_dismissed', 'true');
    } catch {}
  };

  if (isDismissed || isInstalled) return null;

  return (
    <div className="w-full my-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#161B22] via-[#12161E] to-[#0E1116] border border-[#262C36] hover:border-brand-orange/40 shadow-md flex items-center justify-between gap-3 text-white transition-all animate-fade-in">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-orange to-amber-500 p-0.5 shrink-0 flex items-center justify-center shadow-md">
          <Smartphone className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold leading-tight flex items-center gap-1.5 text-white">
            <span>Install Palate PWA</span>
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          </h4>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            Instant offline radar & 1-tap food vault
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="min-h-[32px] px-3 py-1 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-extrabold text-xs shadow-glow-orange active:scale-95 transition-all flex items-center gap-1"
        >
          <Download className="w-3 h-3" />
          <span>Install</span>
        </button>
        <button
          onClick={handleDismiss}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
