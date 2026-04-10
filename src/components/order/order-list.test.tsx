import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { CartProvider } from "@/context/cart-context";
import { WizardProvider } from "@/context/wizard-context";
import { OrderList } from "./order-list";

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

function renderOrderList() {
  return render(
    <CartProvider>
      <WizardProvider>
        <OrderList />
      </WizardProvider>
    </CartProvider>,
  );
}

describe("OrderList", () => {
  beforeEach(() => {
    uuidCounter = 0;
  });

  it("renders empty state when no items", () => {
    renderOrderList();

    expect(
      screen.getByText("Brak pozycji w zamówieniu. Dodaj pierwszą plisę."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /skonfiguruj plisę/i }),
    ).toBeInTheDocument();
  });

  it("does not render submit button when no items", () => {
    renderOrderList();

    expect(screen.queryByTestId("order-submit-button")).not.toBeInTheDocument();
  });

  it("renders 'Dodaj kolejną plisę' button in header", () => {
    renderOrderList();

    expect(
      screen.getByRole("button", { name: /dodaj kolejną plisę/i }),
    ).toBeInTheDocument();
  });
});
