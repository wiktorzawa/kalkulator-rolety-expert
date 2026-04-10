import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { CartProvider } from "@/context/cart-context";
import { WizardProvider } from "@/context/wizard-context";
import { StepContent } from "@/components/step-content";
import { PricePanel } from "./price-panel";

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

function renderWizardWithPrice() {
  render(
    <CartProvider>
      <WizardProvider>
        <StepContent />
        <PricePanel />
      </WizardProvider>
    </CartProvider>,
  );

  // Navigate to step 3
  fireEvent.click(screen.getByText("Standard").closest("button")!);
  fireEvent.click(screen.getByLabelText("Kolor: Biel"));
  fireEvent.click(screen.getByTestId("category-bezinwazyjny"));
  fireEvent.click(screen.getByTestId("mounting-system-wzmocniony"));
}

/** Click a rail button by its image alt text */
function selectRail(name: string): void {
  const img = screen.getByAltText(name);
  const button = img.closest("button");
  if (button) fireEvent.click(button);
}

describe("PricePanel -- simplified display", () => {
  beforeEach(() => {
    uuidCounter = 0;
  });

  it("does NOT show width/height surcharge breakdown", () => {
    renderWizardWithPrice();

    expect(
      screen.queryByText(/dop[łl]ata za szeroko/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/dop[łl]ata za wysoko/i)).not.toBeInTheDocument();
  });

  it("shows 'Cena rolety' and 'Razem'", () => {
    renderWizardWithPrice();

    expect(screen.getByText("Cena rolety")).toBeInTheDocument();
    expect(screen.getByText("Razem")).toBeInTheDocument();
  });

  it("shows correct total price for Standard+Bezinw+600x1500+Bialy", () => {
    renderWizardWithPrice();

    selectRail("Biały");

    const priceEl = screen.getByTestId("price-total");
    // Standard bezinwazyjny=47.50, width 600mm->60cm->57.00, height 1500mm->150cm->52.25
    // Total = 47.50 + 57.00 + 52.25 + 0 = 156.75
    expect(priceEl).toHaveTextContent("156,75");
  });

  it("shows rail surcharge when rail has surcharge > 0", () => {
    renderWizardWithPrice();

    selectRail("Srebrny");

    expect(screen.getByText("Dopłata listwa")).toBeInTheDocument();
    expect(screen.getByText("4,75 zł")).toBeInTheDocument();
  });

  it("shows 'Dodaj do zamówienia' button in new-item mode", () => {
    renderWizardWithPrice();

    const addButton = screen.getByTestId("add-to-order-button");
    expect(addButton).toHaveTextContent("Dodaj do zamówienia");
  });

  it("shows quantity selector when price > 0", () => {
    renderWizardWithPrice();

    expect(screen.getByText("Ilość:")).toBeInTheDocument();
    expect(screen.getByTestId("panel-quantity")).toHaveTextContent("1");
  });

  it("quantity +/- buttons work", () => {
    renderWizardWithPrice();

    // There are two sets of +/- buttons (panel + potentially elsewhere)
    // Target the ones in the price panel by their aria-label
    const increaseBtns = screen.getAllByRole("button", {
      name: /zwiększ ilość/i,
    });
    fireEvent.click(increaseBtns[0]!);

    expect(screen.getByTestId("panel-quantity")).toHaveTextContent("2");

    const decreaseBtns = screen.getAllByRole("button", {
      name: /zmniejsz ilość/i,
    });
    fireEvent.click(decreaseBtns[0]!);

    expect(screen.getByTestId("panel-quantity")).toHaveTextContent("1");
  });
});
