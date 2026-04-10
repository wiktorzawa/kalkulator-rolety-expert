/**
 * Analytics wrapper over PostHog.
 * Gracefully degrades when PostHog is not loaded (dev, ad-blockers).
 * Swap provider by changing this file only — components never import PostHog directly.
 */

import posthog from "posthog-js";

function getPostHogKey(): string | undefined {
  const key: unknown = import.meta.env.VITE_POSTHOG_KEY;
  if (typeof key !== "string" || !key || key.startsWith("your-")) {
    return undefined;
  }
  return key;
}
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
    const key = getPostHogKey();
    if (!key || isInitialized) return;

    try {
      posthog.init(key, {
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
   * Track wizard step view. Events: step_1_viewed, step_2_viewed, step_3_viewed
   */
  trackStep(step: number): void {
    capture(`step_${step}_viewed`);
  },

  /**
   * Track item added to cart.
   */
  trackItemAdded(params: {
    fabricId: string;
    colorId: string;
    mountingId: string;
    unitPrice: number;
  }): void {
    capture("item_added", {
      fabric_id: params.fabricId,
      color_id: params.colorId,
      mounting_id: params.mountingId,
      unit_price: params.unitPrice,
    });
  },

  /**
   * Track item edited in cart.
   */
  trackItemEdited(params: {
    fabricId: string;
    colorId: string;
    mountingId: string;
    unitPrice: number;
  }): void {
    capture("item_edited", {
      fabric_id: params.fabricId,
      color_id: params.colorId,
      mounting_id: params.mountingId,
      unit_price: params.unitPrice,
    });
  },

  /**
   * Track order submission.
   */
  trackOrder(params: {
    orderNumber: string;
    price: number;
    units: number;
    itemsCount: number;
  }): void {
    capture("order_submitted", {
      order_number: params.orderNumber,
      price: params.price,
      units: params.units,
      items_count: params.itemsCount,
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
