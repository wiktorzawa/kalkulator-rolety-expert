import { useEffect, useRef } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { CartProvider, useCart } from "@/context/cart-context";
import { WizardProvider } from "@/context/wizard-context";
import { OrderList } from "./order-list";
import type { CartItem } from "@/context/cart-types";

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

const SAMPLE_ITEM: Omit<CartItem, "id"> = {
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

const SAMPLE_ITEM_2: Omit<CartItem, "id"> = {
  fabricId: "blackout",
  fabricName: "Blackout",
  colorId: "czarny",
  colorName: "Czarny",
  mountingId: "standard",
  mountingName: "Standard",
  mountingType: "inwazyjny",
  widthMm: 800,
  heightMm: 2000,
  railId: "orzech",
  railName: "Orzech",
  quantity: 2,
  unitPrice: 228.0,
};

/** Helper component to pre-populate cart with items */
function CartSeeder({
  items,
  children,
}: {
  items: ReadonlyArray<Omit<CartItem, "id">>;
  children: React.ReactNode;
}) {
  const { dispatch } = useCart();
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    for (const item of items) {
      dispatch({ type: "ADD_ITEM", item });
    }
    dispatch({ type: "SET_VIEW", view: "order-list" });
  }, [dispatch, items]);

  return <>{children}</>;
}

function renderOrderList() {
  return render(
    <CartProvider>
      <WizardProvider>
        <OrderList />
      </WizardProvider>
    </CartProvider>,
  );
}

function renderOrderListWithItems(items: ReadonlyArray<Omit<CartItem, "id">>) {
  return render(
    <CartProvider>
      <WizardProvider>
        <CartSeeder items={items}>
          <OrderList />
        </CartSeeder>
      </WizardProvider>
    </CartProvider>,
  );
}

describe("OrderList", () => {
  beforeEach(() => {
    uuidCounter = 0;
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("renders empty state when no items", () => {
    renderOrderList();

    expect(
      screen.getByText("Brak pozycji w zamówieniu. Dodaj pierwszy produkt."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /skonfiguruj roletę/i }),
    ).toBeInTheDocument();
  });

  it("does not render submit button when no items", () => {
    renderOrderList();

    expect(screen.queryByTestId("order-submit-button")).not.toBeInTheDocument();
  });

  it("renders 'Dodaj kolejny produkt' button when items exist", () => {
    renderOrderListWithItems([SAMPLE_ITEM]);

    expect(
      screen.getByRole("button", { name: /dodaj kolejny produkt/i }),
    ).toBeInTheDocument();
  });

  it("renders N item cards with prices", () => {
    renderOrderListWithItems([SAMPLE_ITEM, SAMPLE_ITEM_2]);

    const cards = screen.getAllByTestId("order-item-card");
    expect(cards).toHaveLength(2);

    // First item: 156.75 zł (quantity 1)
    expect(screen.getByText("Standard")).toBeInTheDocument();
    expect(screen.getByText("156,75 zł")).toBeInTheDocument();

    // Second item: 228.00 * 2 = 456.00 zł
    expect(screen.getByText("Blackout")).toBeInTheDocument();
    expect(screen.getByText("456,00 zł")).toBeInTheDocument();
  });

  it("shows correct total price for all items", () => {
    renderOrderListWithItems([SAMPLE_ITEM, SAMPLE_ITEM_2]);

    // Total: 156.75 + 228.00 * 2 = 612.75
    const summaryPanel = screen.getByTestId("order-summary-panel");
    expect(summaryPanel).toHaveTextContent("612,75 zł");
  });

  it("+/- quantity updates totalPrice immediately", () => {
    renderOrderListWithItems([SAMPLE_ITEM]);

    const summaryPanel = screen.getByTestId("order-summary-panel");
    // Initially 156.75 zł
    expect(summaryPanel).toHaveTextContent("156,75 zł");

    // Click + to increase quantity
    const increaseBtn = screen.getByRole("button", {
      name: /zwiększ ilość/i,
    });
    fireEvent.click(increaseBtn);

    // Now 156.75 * 2 = 313.50 zł
    expect(summaryPanel).toHaveTextContent("313,50 zł");

    // Item quantity display should show 2
    expect(screen.getByTestId("item-quantity")).toHaveTextContent("2 szt.");
  });

  it("shows submit button when items exist", () => {
    renderOrderListWithItems([SAMPLE_ITEM]);

    const submitBtn = screen.getByTestId("order-submit-button");
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveTextContent("Zamów przez Allegro");
  });

  it("removing the last item shows empty state", () => {
    renderOrderListWithItems([SAMPLE_ITEM]);

    // Click remove
    const removeBtn = screen.getByRole("button", { name: /usuń/i });
    fireEvent.click(removeBtn);

    // Should show empty state
    expect(
      screen.getByText("Brak pozycji w zamówieniu. Dodaj pierwszy produkt."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("order-submit-button")).not.toBeInTheDocument();
  });

  it("shows Allegro units in summary", () => {
    renderOrderListWithItems([SAMPLE_ITEM]);

    // 156.75 / 4 = 39.1875 → ceil = 40 units
    const summaryPanel = screen.getByTestId("order-summary-panel");
    expect(summaryPanel).toHaveTextContent("40");
    expect(summaryPanel).toHaveTextContent("sztuk");
  });
});
