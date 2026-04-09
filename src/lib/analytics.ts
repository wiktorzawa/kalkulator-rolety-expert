/**
 * Analytics wrapper over PostHog.
 * Gracefully degrades when PostHog is not loaded (dev, ad-blockers).
 * Swap provider by changing this file only — components never import PostHog directly.
 */

import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const IS_DEV = import.meta.env.DEV;

let isInitialized = false;

function getPostHog(): typeof posthog | null {
  if (!isInitialized) return null;
  try {
    return posthog;
  } catch {
    return null;
  }
}

function capture(event: string, properties?: Record<string, unknown>): void {
  const ph = getPostHog();
  if (!ph) return;
  try {
    ph.capture(event, properties);
  } catch {
    // Graceful degradation — analytics should never break the app
  }
}

export const analytics = {
  /**
   * Initialize PostHog. Call once on app mount.
   * No-op if VITE_POSTHOG_KEY is not set.
   */
  init(): void {
    if (!POSTHOG_KEY || isInitialized) return;

    try {
      posthog.init(POSTHOG_KEY, {
        api_host: "https://eu.i.posthog.com",
        loaded: () => {
          isInitialized = true;
        },
        autocapture: false,
        capture_pageview: false,
        persistence: "localStorage",
        ...(IS_DEV ? { debug: true } : {}),
      });
      isInitialized = true;
    } catch {
      // PostHog init failed — continue without analytics
    }
  },

  /**
   * Track wizard step view. Events: step_1_viewed ... step_5_viewed
   */
  trackStep(step: number): void {
    capture(`step_${step}_viewed`);
  },

  /**
   * Track order submission.
   */
  trackOrder(params: {
    orderNumber: string;
    price: number;
    units: number;
    fabricId: string;
    mountingId: string;
  }): void {
    capture("order_submitted", {
      order_number: params.orderNumber,
      price: params.price,
      units: params.units,
      fabric_id: params.fabricId,
      mounting_id: params.mountingId,
    });
  },

  /**
   * Track order lookup.
   */
  trackLookup(orderNumber: string): void {
    capture("order_lookup", { order_number: orderNumber });
  },

  /**
   * Set user properties (e.g., UTM source).
   */
  setUserProperties(properties: Record<string, unknown>): void {
    const ph = getPostHog();
    if (!ph) return;
    try {
      ph.setPersonProperties(properties);
    } catch {
      // Graceful degradation
    }
  },

  /** Exposed for testing */
  _isInitialized(): boolean {
    return isInitialized;
  },

  /** Reset state — for testing only */
  _reset(): void {
    isInitialized = false;
  },
};
