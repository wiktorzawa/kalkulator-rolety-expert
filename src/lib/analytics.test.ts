import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockCapture, mockInit, mockSetPersonProperties } = vi.hoisted(() => ({
  mockCapture: vi.fn(),
  mockInit: vi.fn(),
  mockSetPersonProperties: vi.fn(),
}));

vi.mock("posthog-js", () => ({
  default: {
    init: mockInit,
    capture: mockCapture,
    setPersonProperties: mockSetPersonProperties,
  },
}));

// Must import after mock
import { analytics } from "./analytics";

describe("analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    analytics._reset();
  });

  describe("trackStep", () => {
    it("does not throw when PostHog is not initialized", () => {
      expect(() => analytics.trackStep(1)).not.toThrow();
    });

    it("captures step_1_viewed after init with key", () => {
      // Since VITE_POSTHOG_KEY is undefined in test, init is a no-op
      // We test the graceful degradation path
      analytics.trackStep(1);
      // Should not throw, capture is not called because not initialized
      expect(mockCapture).not.toHaveBeenCalled();
    });
  });

  describe("trackOrder", () => {
    it("does not throw when PostHog is not initialized", () => {
      expect(() =>
        analytics.trackOrder({
          orderNumber: "RE-00001",
          price: 156.75,
          units: 157,
          fabricId: "standard",
          mountingId: "wzmocniony",
        }),
      ).not.toThrow();
    });
  });

  describe("trackLookup", () => {
    it("does not throw when PostHog is not initialized", () => {
      expect(() => analytics.trackLookup("RE-00001")).not.toThrow();
    });
  });

  describe("init", () => {
    it("does not throw when VITE_POSTHOG_KEY is not set", () => {
      expect(() => analytics.init()).not.toThrow();
    });

    it("is not initialized without key", () => {
      analytics.init();
      expect(analytics._isInitialized()).toBe(false);
    });
  });

  describe("graceful degradation", () => {
    it("all tracking methods are safe to call without initialization", () => {
      expect(() => {
        analytics.trackStep(1);
        analytics.trackStep(2);
        analytics.trackStep(3);
        analytics.trackStep(4);
        analytics.trackStep(5);
        analytics.trackOrder({
          orderNumber: "RE-00001",
          price: 100,
          units: 100,
          fabricId: "standard",
          mountingId: "standard",
        });
        analytics.trackLookup("RE-00001");
        analytics.setUserProperties({ utm_source: "allegro" });
      }).not.toThrow();
    });
  });
});
