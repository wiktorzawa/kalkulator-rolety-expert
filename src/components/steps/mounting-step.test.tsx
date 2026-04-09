import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WizardProvider } from "@/context/wizard-context";
import { StepContent } from "@/components/step-content";

function renderAndNavigateToMounting() {
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
  it("displays glued mounting warning about max 1200mm", () => {
    renderAndNavigateToMounting();

    // Klejony card should show the warning
    expect(screen.getByTestId("glued-warning")).toHaveTextContent(
      "Max szerokość: 1200 mm",
    );
  });

  it("shows both bezinwazyjny and inwazyjny category headings", () => {
    renderAndNavigateToMounting();

    expect(
      screen.getByRole("heading", { name: "Bezinwazyjny" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Inwazyjny" }),
    ).toBeInTheDocument();
  });

  it("renders 5 mounting system cards", () => {
    renderAndNavigateToMounting();

    // All mounting cards have aria-pressed attribute
    const allButtons = screen.getAllByRole("button");
    const mountingCards = allButtons.filter(
      (btn) =>
        btn.getAttribute("aria-pressed") !== null &&
        btn.closest("#step-3") !== null,
    );
    expect(mountingCards).toHaveLength(5);
  });
});
