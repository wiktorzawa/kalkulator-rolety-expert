import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to create mock fns that are available inside vi.mock factory
const { mockSingle, mockRpc } = vi.hoisted(() => ({
  mockSingle: vi.fn(),
  mockRpc: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: mockSingle,
        })),
      })),
    })),
    rpc: mockRpc,
  }),
}));

vi.mock("@/lib/analytics", () => ({
  analytics: {
    trackOrder: vi.fn(),
    trackLookup: vi.fn(),
  },
}));

import { submitOrder, lookupOrder } from "./orders";
import type { WizardState } from "@/context/wizard-types";
import type { PriceBreakdown } from "@/data/types";

const mockState: WizardState = {
  step: 5,
  fabricId: "standard",
  colorId: "biel",
  mountingId: "wzmocniony",
  mountingType: "bezinwazyjny",
  widthMm: 600,
  heightMm: 1500,
  railId: "bialy",
};

const mockPrice: PriceBreakdown = {
  basePrice: 47.5,
  widthPrice: 57,
  heightPrice: 52.25,
  railSurcharge: 0,
  total: 156.75,
};

describe("submitOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves order and returns order_number from DB", async () => {
    const mockOrder = {
      id: 1,
      order_number: "RE-00001",
      config: {
        fabricId: "standard",
        colorId: "biel",
        mountingId: "wzmocniony",
        mountingType: "bezinwazyjny",
        widthMm: 600,
        heightMm: 1500,
        railId: "bialy",
      },
      price: 156.75,
      allegro_units: 157,
      utm_source: null,
      created_at: "2026-04-09T12:00:00Z",
    };

    mockSingle.mockResolvedValue({ data: mockOrder, error: null });

    const result = await submitOrder({
      state: mockState,
      price: mockPrice,
      allegro_units: 157,
      utm_source: null,
    });

    expect(result.orderNumber).toBe("RE-00001");
    expect(result.order.price).toBe(156.75);
    expect(result.order.allegro_units).toBe(157);
  });

  it("throws on Supabase error", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    await expect(
      submitOrder({
        state: mockState,
        price: mockPrice,
        allegro_units: 157,
        utm_source: null,
      }),
    ).rejects.toThrow("Failed to submit order: DB error");
  });
});

describe("lookupOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns order for valid order_number", async () => {
    const mockOrder = {
      id: 1,
      order_number: "RE-00001",
      config: {
        fabricId: "standard",
        colorId: "biel",
        mountingId: "wzmocniony",
        mountingType: "bezinwazyjny",
        widthMm: 600,
        heightMm: 1500,
        railId: "bialy",
      },
      price: 156.75,
      allegro_units: 157,
      utm_source: null,
      created_at: "2026-04-09T12:00:00Z",
    };

    mockRpc.mockResolvedValue({ data: [mockOrder], error: null });

    const result = await lookupOrder("RE-00001");
    expect(result).not.toBeNull();
    expect(result!.order_number).toBe("RE-00001");
    expect(result!.price).toBe(156.75);
    expect(mockRpc).toHaveBeenCalledWith("lookup_order", {
      p_order_number: "RE-00001",
    });
  });

  it("returns null for non-existent order", async () => {
    mockRpc.mockResolvedValue({ data: [], error: null });

    const result = await lookupOrder("INVALID");
    expect(result).toBeNull();
  });

  it("returns null when RPC returns null data", async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });

    const result = await lookupOrder("INVALID");
    expect(result).toBeNull();
  });

  it("throws on Supabase error", async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "Connection failed" },
    });

    await expect(lookupOrder("RE-00001")).rejects.toThrow(
      "Failed to lookup order: Connection failed",
    );
  });
});
