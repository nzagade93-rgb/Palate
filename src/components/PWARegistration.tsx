'use client';

// ==============================================================================
// Palate PWA Service Worker Registration
// Registers /sw.js on the client for offline caching and fast mobile load
// ==============================================================================

import { useEffect } from 'react';

export default function PWARegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[Palate PWA] Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('[Palate PWA] Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
