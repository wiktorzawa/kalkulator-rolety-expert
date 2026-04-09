import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WizardProvider } from "@/context/wizard-context";
import { FabricStep } from "./fabric-step";
import { FABRICS } from "@/data/fabrics";

function renderWithProvider() {
  return render(
    <WizardProvider>
      <FabricStep />
    </WizardProvider>,
  );
}

describe("FabricStep", () => {
  it("renders 8 fabric cards", () => {
    renderWithProvider();
    const buttons = screen.getAllByRole("button", { pressed: false });
    expect(buttons).toHaveLength(FABRICS.length);
    expect(FABRICS).toHaveLength(8);
  });

  it("displays fabric names", () => {
    renderWithProvider();
    for (const fabric of FABRICS) {
      expect(screen.getByText(fabric.name)).toBeInTheDocument();
    }
  });

  it("marks selected fabric with aria-pressed", () => {
    renderWithProvider();
    const standardButton = screen.getByText("Standard").closest("button");
    expect(standardButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(standardButton!);
    expect(standardButton).toHaveAttribute("aria-pressed", "true");
  });
});
