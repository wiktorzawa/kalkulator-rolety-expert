import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WizardProvider } from "@/context/wizard-context";
import { StepContent } from "@/components/step-content";

vi.mock("@/lib/analytics", () => ({
  analytics: {
    init: vi.fn(),
    trackStep: vi.fn(),
    trackOrder: vi.fn(),
    trackLookup: vi.fn(),
    setUserProperties: vi.fn(),
  },
}));

function renderAndNavigateToConfig() {
  render(
    <WizardProvider>
      <StepContent />
    </WizardProvider>,
  );

  // Step 1: select fabric
  const fabricBtn = screen.getByText("Standard").closest("button")!;
  fireEvent.click(fabricBtn);

  // Step 2: select color
  const colorBtn = screen.getByLabelText("Kolor: Biel");
  fireEvent.click(colorBtn);
}

describe("MountingStep", () => {
  it("shows both category buttons (bezinwazyjny/inwazyjny)", () => {
    renderAndNavigateToConfig();

    expect(screen.getByTestId("category-bezinwazyjny")).toBeInTheDocument();
    expect(screen.getByTestId("category-inwazyjny")).toBeInTheDocument();
  });

  it("shows bezinwazyjny systems carousel after selecting category", () => {
    renderAndNavigateToConfig();

    fireEvent.click(screen.getByTestId("category-bezinwazyjny"));

    // Should show 2 bezinwazyjny systems
    expect(
      screen.getByTestId("mounting-carousel-wzmocniony"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mounting-carousel-klejony")).toBeInTheDocument();
  });

  it("shows inwazyjny systems carousel after selecting category", () => {
    renderAndNavigateToConfig();

    fireEvent.click(screen.getByTestId("category-inwazyjny"));

    // Should show 3 inwazyjny systems
    expect(
      screen.getByTestId("mounting-carousel-standard"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mounting-carousel-regulowany"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mounting-carousel-katowy")).toBeInTheDocument();
  });

  it("shows info about rail color matching mounting color", () => {
    renderAndNavigateToConfig();

    fireEvent.click(screen.getByTestId("category-bezinwazyjny"));

    expect(
      screen.getByText(/kolor systemu montażowego będzie taki sam/i),
    ).toBeInTheDocument();
  });

  it("displays glued mounting warning about max 1200mm", () => {
    renderAndNavigateToConfig();

    fireEvent.click(screen.getByTestId("category-bezinwazyjny"));

    // Klejony card inside carousel should show the warning
    const klejonyCar = screen.getByTestId("mounting-carousel-klejony");
    expect(klejonyCar).toHaveTextContent(/Max szerokość: 1200 mm/);
  });
});
