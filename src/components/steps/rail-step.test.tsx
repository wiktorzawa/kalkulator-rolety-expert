import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WizardProvider } from "@/context/wizard-context";
import { StepContent } from "@/components/step-content";
import { PricePanel } from "@/components/layout/price-panel";

function renderWizardWithPrice() {
  render(
    <WizardProvider>
      <StepContent />
      <PricePanel />
    </WizardProvider>,
  );

  // Step 1: Standard
  fireEvent.click(screen.getByText("Standard").closest("button")!);
  // Step 2: Biel
  fireEvent.click(screen.getByLabelText("Kolor: Biel"));
  // Step 3: Wzmocniony (bezinwazyjny)
  fireEvent.click(screen.getByText("Wzmocniony (skręcany)").closest("button")!);
  // Step 4: defaults 600x1500 (always valid)
}

describe("RailStep — price panel integration", () => {
  it("shows correct price: Standard+Bezinw+600x1500 = 156.75 zl", () => {
    renderWizardWithPrice();

    const priceEl = screen.getByTestId("price-total");
    // Standard bezinwazyjny base=47.50, width 600mm->60cm->57.00, height 1500mm->150cm->52.25
    // Total = 47.50 + 57.00 + 52.25 = 156.75
    expect(priceEl).toHaveTextContent("156,75");
  });

  it("shows 157 allegro units for 156.75 zl", () => {
    renderWizardWithPrice();

    // Math.ceil(156.75) = 157
    expect(screen.getByText(/157/)).toBeInTheDocument();
    expect(screen.getByText(/jednostek/)).toBeInTheDocument();
  });
});
