import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { CartProvider } from "@/context/cart-context";
import type { CartItem } from "@/context/cart-types";
import { OrderItemCard } from "./order-item-card";

// Mock crypto.randomUUID
let uuidCounter = 0;
vi.stubGlobal("crypto", {
  randomUUID: () => {
    uuidCounter += 1;
    return `test-uuid-${uuidCounter}`;
  },
});

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => ({
    rpc: vi.fn(),
  }),
}));

vi.mock("@/lib/analytics", () => ({
  analytics: {
    init: vi.fn(),
    trackStep: vi.fn(),
    trackOrder: vi.fn(),
    trackLookup: vi.fn(),
    setUserProperties: vi.fn(),
  },
}));

const SAMPLE_ITEM: CartItem = {
  id: "item-1",
  fabricId: "standard",
  fabricName: "Standard",
  colorId: "biel",
  colorName: "Biel",
  mountingId: "wzmocniony",
  mountingName: "Wzmocniony",
  mountingType: "bezinwazyjny",
  widthMm: 600,
  heightMm: 1500,
  railId: "bialy",
  railName: "Biały",
  quantity: 1,
  unitPrice: 156.75,
};

function renderItemCard(item: CartItem = SAMPLE_ITEM) {
  return render(
    <CartProvider>
      <OrderItemCard item={item} />
    </CartProvider>,
  );
}

describe("OrderItemCard", () => {
  beforeEach(() => {
    uuidCounter = 0;
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("renders item parameters", () => {
    renderItemCard();

    expect(screen.getByText("Standard")).toBeInTheDocument();
    expect(screen.getByText("Biel")).toBeInTheDocument();
    expect(screen.getByText(/wzmocniony/i)).toBeInTheDocument();
    expect(screen.getByText(/600 x 1500 mm/)).toBeInTheDocument();
    expect(screen.getByText("Biały")).toBeInTheDocument();
  });

  it("renders total price for quantity 1", () => {
    renderItemCard();

    expect(screen.getByText("156,75 zł")).toBeInTheDocument();
  });

  it("renders total price and per-unit for quantity > 1", () => {
    const itemWithQty = { ...SAMPLE_ITEM, quantity: 3 };
    renderItemCard(itemWithQty);

    // Total: 156.75 * 3 = 470.25
    expect(screen.getByText("470,25 zł")).toBeInTheDocument();
    // Per unit
    expect(screen.getByText("(156,75 zł/szt.)")).toBeInTheDocument();
  });

  it("renders Edytuj button", () => {
    renderItemCard();

    expect(screen.getByRole("button", { name: /edytuj/i })).toBeInTheDocument();
  });

  it("does not render Duplikuj button", () => {
    renderItemCard();

    expect(
      screen.queryByRole("button", { name: /duplikuj/i }),
    ).not.toBeInTheDocument();
  });

  it("shows confirm dialog on remove", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    renderItemCard();

    fireEvent.click(screen.getByRole("button", { name: /usuń/i }));

    expect(confirmSpy).toHaveBeenCalledWith(
      expect.stringContaining("Standard — Biel"),
    );
  });

  it("renders quantity display", () => {
    renderItemCard();

    expect(screen.getByTestId("item-quantity")).toHaveTextContent("1 szt.");
  });

  it("disables minus button when quantity is 1", () => {
    renderItemCard();

    const minusBtn = screen.getByRole("button", { name: /zmniejsz ilość/i });
    expect(minusBtn).toBeDisabled();
  });
});
