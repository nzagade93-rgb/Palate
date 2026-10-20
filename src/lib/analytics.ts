import { AnalyticsEventName } from './types';
import { getDeviceFingerprint } from './fingerprint';

/**
 * PALATE Client Analytics & Growth Funnel Tracker
 * Non-blocking event dispatcher to instrument the viral discovery loop.
 */
export async function trackEvent(
  event: AnalyticsEventName,
  properties: Record<string, any> = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const fingerprint = getDeviceFingerprint();
    const payload = {
      event,
      properties: {
        ...properties,
        url: window.location.pathname + window.location.search,
        referrer: document.referrer || undefined,
        timestamp: new Date().toISOString(),
      },
      fingerprint,
    };

    // Use sendBeacon if supported for high reliability during unloads/shares
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
      return;
    }

    // Fallback to fetch
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    // Non-blocking catch
    console.debug('[Palate Analytics] Event dropped:', err);
  }
}

/**
 * Checks for shared URL attribution flags (e.g., ?shared_by=... or ?ref=share)
 * and records share_link_opened event.
 */
export function recordSharedLinkAttribution(): void {
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const hasShareRef =
      urlParams.get('ref') === 'share' ||
      urlParams.get('utm_source') === 'whatsapp' ||
      urlParams.get('utm_source') === 'instagram' ||
      urlParams.has('shared_by');

    if (hasShareRef) {
      const sessionKey = `palate_attributed_${window.location.pathname}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');
        trackEvent('share_link_opened', {
          source: urlParams.get('utm_source') || 'shared_link',
          sharedBy: urlParams.get('shared_by') || 'unknown',
          format: urlParams.get('format') || 'card',
        });
      }
    }
  } catch (err) {
    console.debug('[Palate Analytics] Attribution error:', err);
  }
}
