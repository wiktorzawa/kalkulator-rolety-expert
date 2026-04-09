import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WizardProvider } from "@/context/wizard-context";
import { StepContent } from "@/components/step-content";
import { PricePanel } from "@/components/layout/price-panel";

function renderAndNavigateToDimensions(mountingId = "wzmocniony") {
  render(
    <WizardProvider>
      <StepContent />
      <PricePanel />
    </WizardProvider>,
  );

  // Step 1: select fabric
  fireEvent.click(screen.getByText("Standard").closest("button")!);

  // Step 2: select color
  fireEvent.click(screen.getByLabelText("Kolor: Biel"));

  // Step 3: select mounting
  const mountingName =
    mountingId === "klejony" ? "Klejony" : "Wzmocniony (skręcany)";
  fireEvent.click(screen.getByText(mountingName).closest("button")!);
}

describe("DimensionsStep", () => {
  it("renders width slider with range 150-1950 and step 10", () => {
    renderAndNavigateToDimensions();

    const widthSlider = screen.getByLabelText("Szerokosc suwak");
    expect(widthSlider).toHaveAttribute("min", "150");
    expect(widthSlider).toHaveAttribute("max", "1950");
    expect(widthSlider).toHaveAttribute("step", "10");
  });

  it("limits width to 1200 for glued mounting", () => {
    renderAndNavigateToDimensions("klejony");

    const widthSlider = screen.getByLabelText("Szerokosc suwak");
    expect(widthSlider).toHaveAttribute("max", "1200");

    // Warning should be displayed in dimensions step
    const alerts = screen.getAllByRole("alert");
    const dimensionAlert = alerts.find((el) => el.closest("#step-4") !== null);
    expect(dimensionAlert).toHaveTextContent(/maksymalna szerokosc: 1200 mm/i);
  });

  it("quick button sets value", () => {
    renderAndNavigateToDimensions();

    const btn800 = screen.getByLabelText(/ustaw szerokosc na 800 mm/i);
    fireEvent.click(btn800);

    const widthInput = screen.getByLabelText("Szerokosc w mm");
    expect(widthInput).toHaveValue(800);
  });

  it("updates price in real-time when dimensions change", () => {
    renderAndNavigateToDimensions();

    const priceEl = screen.getByTestId("price-total");
    const initialPrice = priceEl.textContent;

    // Change width via quick button
    fireEvent.click(screen.getByLabelText(/ustaw szerokosc na 1000 mm/i));

    const newPrice = priceEl.textContent;
    expect(newPrice).not.toBe(initialPrice);
  });
});
