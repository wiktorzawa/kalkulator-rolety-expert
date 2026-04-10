import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to create mock fns that are available inside vi.mock factory
const { mockRpc } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => ({
    rpc: mockRpc,
  }),
}));

vi.mock("@/lib/analytics", () => ({
  analytics: {
    trackOrder: vi.fn(),
    trackLookup: vi.fn(),
    trackItemAdded: vi.fn(),
    trackItemEdited: vi.fn(),
  },
}));

import { submitOrder, lookupOrder } from "./orders";
import type { OrderItemInsert, OrderRecord } from "./orders";

const mockItems: OrderItemInsert[] = [
  {
    fabric_id: "standard",
    fabric_name: "Standard",
    color_id: "biel",
    color_name: "Biel",
    mounting_id: "wzmocniony",
    mounting_name: "Bezinwazyjny wzmocniony",
    mounting_type: "bezinwazyjny",
    width_mm: 600,
    height_mm: 1500,
    rail_id: "bialy",
    rail_name: "Biały",
    quantity: 1,
    unit_price: 156.75,
  },
  {
    fabric_id: "blackout",
    fabric_name: "Blackout",
    color_id: "grafit",
    color_name: "Grafit",
    mounting_id: "inwazyjny-standard",
    mounting_name: "Inwazyjny standard",
    mounting_type: "inwazyjny",
    width_mm: 1200,
    height_mm: 2300,
    rail_id: "orzech",
    rail_name: "Orzech",
    quantity: 2,
    unit_price: 228.0,
  },
];

describe("submitOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls submit_order RPC and returns order_number", async () => {
    mockRpc.mockResolvedValue({ data: "RE-00001", error: null });

    const result = await submitOrder({
      items: mockItems,
      totalPrice: 612.75,
      allegroUnits: 613,
      utmSource: "allegro",
    });

    expect(result.orderNumber).toBe("RE-00001");
    expect(mockRpc).toHaveBeenCalledWith("submit_order", {
      p_items: mockItems,
      p_total_price: 612.75,
      p_allegro_units: 613,
      p_utm_source: "allegro",
    });
  });

  it("passes null utm_source when not provided", async () => {
    mockRpc.mockResolvedValue({ data: "RE-00002", error: null });

    await submitOrder({
      items: [mockItems[0] as OrderItemInsert],
      totalPrice: 156.75,
      allegroUnits: 157,
      utmSource: null,
    });

    expect(mockRpc).toHaveBeenCalledWith(
      "submit_order",
      expect.objectContaining({ p_utm_source: null }),
    );
  });

  it("throws on Supabase error", async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "DB error" },
    });

    await expect(
      submitOrder({
        items: mockItems,
        totalPrice: 612.75,
        allegroUnits: 613,
        utmSource: null,
      }),
    ).rejects.toThrow("Failed to submit order: DB error");
  });
});

describe("lookupOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns order with items for valid order_number", async () => {
    const mockResponse = {
      id: 1,
      order_number: "RE-00001",
      total_price: 612.75,
      allegro_units: 613,
      allegro_tx_id: null,
      utm_source: "allegro",
      created_at: "2026-04-10T12:00:00Z",
      items: [
        {
          id: 1,
          position: 1,
          fabric_id: "standard",
          fabric_name: "Standard",
          color_id: "biel",
          color_name: "Biel",
          mounting_id: "wzmocniony",
          mounting_name: "Bezinwazyjny wzmocniony",
          mounting_type: "bezinwazyjny",
          width_mm: 600,
          height_mm: 1500,
          rail_id: "bialy",
          rail_name: "Biały",
          quantity: 1,
          unit_price: 156.75,
        },
        {
          id: 2,
          position: 2,
          fabric_id: "blackout",
          fabric_name: "Blackout",
          color_id: "grafit",
          color_name: "Grafit",
          mounting_id: "inwazyjny-standard",
          mounting_name: "Inwazyjny standard",
          mounting_type: "inwazyjny",
          width_mm: 1200,
          height_mm: 2300,
          rail_id: "orzech",
          rail_name: "Orzech",
          quantity: 2,
          unit_price: 228.0,
        },
      ],
    };

    mockRpc.mockResolvedValue({ data: mockResponse, error: null });

    const result = await lookupOrder("RE-00001");

    expect(result).not.toBeNull();
    const order = result as OrderRecord;
    expect(order.order_number).toBe("RE-00001");
    expect(order.total_price).toBe(612.75);
    expect(order.allegro_units).toBe(613);
    expect(order.items).toHaveLength(2);
    const firstItem = order.items[0];
    const secondItem = order.items[1];
    expect(firstItem).toBeDefined();
    expect(secondItem).toBeDefined();
    expect(firstItem?.fabric_name).toBe("Standard");
    expect(secondItem?.fabric_name).toBe("Blackout");
    expect(secondItem?.quantity).toBe(2);
    expect(mockRpc).toHaveBeenCalledWith("lookup_order", {
      p_order_number: "RE-00001",
    });
  });

  it("returns null for non-existent order", async () => {
    mockRpc.mockResolvedValue({ data: null, error: null });

    const result = await lookupOrder("INVALID");
    expect(result).toBeNull();
  });

  it("returns order with empty items array when no items", async () => {
    const mockResponse = {
      id: 1,
      order_number: "RE-00003",
      total_price: 0,
      allegro_units: 0,
      allegro_tx_id: null,
      utm_source: null,
      created_at: "2026-04-10T12:00:00Z",
      items: null,
    };

    mockRpc.mockResolvedValue({ data: mockResponse, error: null });

    const result = await lookupOrder("RE-00003");
    expect(result).not.toBeNull();
    expect(result?.items).toEqual([]);
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
