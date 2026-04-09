import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WizardProvider } from "@/context/wizard-context";
import { StepContent } from "@/components/step-content";
import { getColorsForFabric } from "@/data/fabrics";

function renderWizard() {
  return render(
    <WizardProvider>
      <StepContent />
    </WizardProvider>,
  );
}

describe("ColorStep", () => {
  it("changes color palette when fabric changes", () => {
    renderWizard();

    // Select Standard fabric
    const standardBtn = screen.getByText("Standard").closest("button")!;
    fireEvent.click(standardBtn);

    // Standard has 24 colors
    const standardColors = getColorsForFabric("standard");
    expect(standardColors).toHaveLength(24);

    // All Standard color names should appear
    for (const color of standardColors) {
      expect(screen.getByLabelText(`Kolor: ${color.name}`)).toBeInTheDocument();
    }
  });

  it("shows 24 colors for Standard+Termo (inherited from Standard)", () => {
    renderWizard();

    // Select Standard+Termo
    const termoBtn = screen.getByText("Standard + Termo").closest("button")!;
    fireEvent.click(termoBtn);

    const termoColors = getColorsForFabric("standard_termo");
    expect(termoColors).toHaveLength(24);

    // Verify color swatches rendered
    const swatches = screen.getAllByRole("button", {
      name: /^Kolor:/,
    });
    expect(swatches).toHaveLength(24);
  });

  it("shows 7 colors for Melange", () => {
    renderWizard();

    const melangeBtn = screen.getByText("Melange").closest("button")!;
    fireEvent.click(melangeBtn);

    const melangeColors = getColorsForFabric("melange");
    expect(melangeColors).toHaveLength(7);

    const swatches = screen.getAllByRole("button", {
      name: /^Kolor:/,
    });
    expect(swatches).toHaveLength(7);
  });
});
