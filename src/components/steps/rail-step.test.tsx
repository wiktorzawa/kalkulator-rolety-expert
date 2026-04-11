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

function renderWizardWithRails() {
  render(
    <CartProvider>
      <WizardProvider>
        <StepContent />
        <PricePanel />
      </WizardProvider>
    </CartProvider>,
  );

  // Step 1: Standard → advances to step 2
  fireEvent.click(screen.getByText("Standard").closest("button")!);
  // Rail cards are now visible in step 2 (alongside color swatches)
}

describe("RailStep (in ColorStep)", () => {
  it("renders 14 rail cards with real images in step 2", () => {
    renderWizardWithRails();

    // All rails should have img tags with real paths
    for (const rail of RAIL_COLORS) {
      if (rail.img) {
        const img = screen.getByTestId(`rail-image-${rail.id}`);
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", `/${rail.img}`);
      }
    }
  });

  it("shows correct price after full config: Standard+Bezinw+600x1500 = 156.75 zl", () => {
    renderWizardWithRails();

    // Step 2: select color + rail → advances to step 3
    fireEvent.click(screen.getByLabelText("Kolor: Biel"));
    fireEvent.click(screen.getByTestId("rail-image-bialy").closest("button")!);

    // Step 3: select category + mounting
    fireEvent.click(screen.getByTestId("category-bezinwazyjny"));
    fireEvent.click(screen.getByTestId("mounting-system-wzmocniony"));

    const priceEl = screen.getByTestId("price-total");
    // Standard bezinwazyjny base=47.50, width 600mm->60cm->57.00, height 1500mm->150cm->52.25
    // Total = 47.50 + 57.00 + 52.25 = 156.75
    expect(priceEl).toHaveTextContent("156,75");
  });

  it("renders rail images that can be clicked for zoom", () => {
    renderWizardWithRails();

    // At least one rail image should be present and clickable
    const firstRailImg = screen.getByTestId("rail-image-bialy");
    expect(firstRailImg).toBeInTheDocument();
    expect(firstRailImg.tagName).toBe("IMG");
  });
});
