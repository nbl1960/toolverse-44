import { sendGAEvent } from "@next/third-parties/google";

/**
 * Fires a GA4 custom event, safely. `sendGAEvent` (from
 * `@next/third-parties/google`, the same package that renders
 * `<GoogleAnalytics>` in the root layout) is a no-op if gtag hasn't
 * loaded yet — e.g. an ad blocker, or the very first paint before the
 * script tag executes — so this never throws and never blocks the
 * action it's attached to.
 */
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  try {
    sendGAEvent("event", eventName, params ?? {});
  } catch {
    // Analytics is best-effort — never let a tracking failure break the UI.
  }
}
