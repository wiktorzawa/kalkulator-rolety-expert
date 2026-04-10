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

function renderAndNavigateToStep3() {
  render(
    <WizardProvider>
      <StepContent />
    </WizardProvider>,
  );

  // Step 1: Standard
  fireEvent.click(screen.getByText("Standard").closest("button")!);
  // Step 2: Biel
  fireEvent.click(screen.getByLabelText("Kolor: Biel"));

  return screen;
}

describe("ProductPreview", () => {
  it("shows packshot after selecting fabric and color", () => {
    renderAndNavigateToStep3();

    const preview = screen.getByTestId("product-preview");
    expect(preview).toBeInTheDocument();

    const img = preview.querySelector("img");
    expect(img).toBeInTheDocument();
    // Default: no mounting selected yet, defaults to inwazyjny packshot
    expect(img?.getAttribute("src")).toContain("standard/biel/packshot.png");
  });

  it("changes src when mounting type changes to bezinwazyjny", () => {
    renderAndNavigateToStep3();

    // Select bezinwazyjny category + system
    fireEvent.click(screen.getByTestId("category-bezinwazyjny"));
    fireEvent.click(screen.getByTestId("mounting-system-wzmocniony"));

    const preview = screen.getByTestId("product-preview");
    const img = preview.querySelector("img");
    expect(img?.getAttribute("src")).toContain(
      "standard/biel/packshot-bezinwazyjny.png",
    );
  });

  it("changes src when mounting type changes to inwazyjny", () => {
    renderAndNavigateToStep3();

    // First select bezinwazyjny
    fireEvent.click(screen.getByTestId("category-bezinwazyjny"));
    fireEvent.click(screen.getByTestId("mounting-system-wzmocniony"));

    // Then switch to inwazyjny
    fireEvent.click(screen.getByTestId("category-inwazyjny"));
    fireEvent.click(screen.getByTestId("mounting-system-standard"));

    const preview = screen.getByTestId("product-preview");
    const img = preview.querySelector("img");
    expect(img?.getAttribute("src")).toContain("standard/biel/packshot.png");
    expect(img?.getAttribute("src")).not.toContain("bezinwazyjny");
  });
});
