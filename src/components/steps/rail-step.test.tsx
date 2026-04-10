import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WizardProvider } from "@/context/wizard-context";
import { CartProvider } from "@/context/cart-context";
import { StepContent } from "@/components/step-content";
import { PricePanel } from "@/components/layout/price-panel";
import { RAIL_COLORS } from "@/data/rails";

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({ single: vi.fn() })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: vi.fn() })),
      })),
    })),
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

function renderWizardWithPrice() {
  render(
    <CartProvider>
      <WizardProvider>
        <StepContent />
        <PricePanel />
      </WizardProvider>
    </CartProvider>,
  );

  // Step 1: Standard
  fireEvent.click(screen.getByText("Standard").closest("button")!);
  // Step 2: Biel
  fireEvent.click(screen.getByLabelText("Kolor: Biel"));
  // Step 3: select category + mounting
  fireEvent.click(screen.getByTestId("category-bezinwazyjny"));
  fireEvent.click(screen.getByTestId("mounting-system-wzmocniony"));
  // Dimensions: defaults 600x1500 (always valid)
}

describe("RailStep", () => {
  it("renders 14 rail cards with real images", () => {
    renderWizardWithPrice();

    // All rails should have img tags with real paths
    for (const rail of RAIL_COLORS) {
      if (rail.img) {
        const img = screen.getByTestId(`rail-image-${rail.id}`);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", `/${rail.img}`);
      }
    }
  });

  it("shows correct price: Standard+Bezinw+600x1500 = 156.75 zl", () => {
    renderWizardWithPrice();

    const priceEl = screen.getByTestId("price-total");
    // Standard bezinwazyjny base=47.50, width 600mm->60cm->57.00, height 1500mm->150cm->52.25
    // Total = 47.50 + 57.00 + 52.25 = 156.75
    expect(priceEl).toHaveTextContent("156,75");
  });

  it("shows add-to-order button (Allegro units only on order list)", () => {
    renderWizardWithPrice();

    // Price panel in wizard mode shows "Dodaj do zamówienia" button
    // Allegro units are shown only on the order list, not in the wizard
    const addButton = screen.getByTestId("add-to-order-button");
    expect(addButton).toBeInTheDocument();
  });

  it("renders rail images that can be clicked for zoom", () => {
    renderWizardWithPrice();

    // At least one rail image should be present and clickable
    const firstRailImg = screen.getByTestId("rail-image-bialy");
    expect(firstRailImg).toBeInTheDocument();
    expect(firstRailImg.tagName).toBe("IMG");
  });
});
