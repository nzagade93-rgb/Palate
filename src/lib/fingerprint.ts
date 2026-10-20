// ==============================================================================
// Palate Client Device Fingerprinting Engine
// Generates a robust, lightweight, and privacy-respecting client fingerprint
// for anti-cheat battle voting and food passport tracking.
// ==============================================================================

const STORAGE_KEY = 'palate_voter_fingerprint_v1';

export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return 'server_render_preview';
  }

  // 1. Check local storage cache for maximum persistence
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached && cached.startsWith('fp_')) {
      return cached;
    }
  } catch {
    // Ignore storage errors (private mode fallback)
  }

  // 2. Generate fingerprint from browser signals
  let hash = 0;
  try {
    const nav = window.navigator;
    const screen = window.screen;
    const signals = [
      nav.userAgent || '',
      nav.language || '',
      nav.hardwareConcurrency || 4,
      screen.width || 0,
      screen.height || 0,
      screen.colorDepth || 24,
      new Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      nav.platform || ''
    ].join('###');

    for (let i = 0; i < signals.length; i++) {
      const char = signals.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
  } catch {
    hash = Math.floor(Math.random() * 1000000);
  }

  // Add random entropy seed
  const entropy = Math.random().toString(36).substring(2, 9);
  const fingerprint = `fp_${Math.abs(hash).toString(16)}_${entropy}`;

  try {
    localStorage.setItem(STORAGE_KEY, fingerprint);
  } catch {
    // Storage restricted
  }

  return fingerprint;
}
