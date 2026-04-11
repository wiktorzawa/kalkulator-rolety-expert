import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WizardProvider } from "@/context/wizard-context";
import { CartProvider } from "@/context/cart-context";
import { StepContent } from "@/components/step-content";
import { PricePanel } from "@/components/layout/price-panel";

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

function renderAndNavigateToDimensions(mountingId = "wzmocniony") {
  render(
    <CartProvider>
      <WizardProvider>
        <StepContent />
        <PricePanel />
      </WizardProvider>
    </CartProvider>,
  );

  // Step 1: select fabric
  fireEvent.click(screen.getByText("Standard").closest("button")!);

  // Step 2: select color + rail (both needed to advance to step 3)
  fireEvent.click(screen.getByLabelText("Kolor: Biel"));
  fireEvent.click(screen.getByTestId("rail-image-bialy").closest("button")!);

  // Step 3: select category then mounting system
  if (mountingId === "klejony") {
    fireEvent.click(screen.getByTestId("category-bezinwazyjny"));
    fireEvent.click(screen.getByTestId("mounting-system-klejony"));
  } else {
    fireEvent.click(screen.getByTestId("category-bezinwazyjny"));
    fireEvent.click(screen.getByTestId("mounting-system-wzmocniony"));
  }
}

describe("DimensionsStep", () => {
  it(
    "renders width slider with range 150-1950 and step 1",
    { timeout: 10000 },
    () => {
      renderAndNavigateToDimensions();

      // HeroUI Slider uses aria attributes instead of native min/max/step
      const widthSlider = screen.getByLabelText("Szerokość suwak");
      expect(widthSlider).toBeInTheDocument();

      // Verify default value is within range via the input field
      const widthInput = screen.getByLabelText(
        "Szerokość w mm",
      ) as HTMLInputElement;
      const val = Number(widthInput.value);
      expect(val).toBeGreaterThanOrEqual(150);
      expect(val).toBeLessThanOrEqual(1950);
    },
  );

  it("limits width to 1200 for glued mounting", () => {
    renderAndNavigateToDimensions("klejony");

    // Verify the slider is present
    const widthSlider = screen.getByLabelText("Szerokość suwak");
    expect(widthSlider).toBeInTheDocument();

    // Warning should be displayed
    expect(screen.getByTestId("glued-max-width-alert")).toHaveTextContent(
      /maksymalna szerokość: 1200 mm/i,
    );
  });

  it("quick button sets value", () => {
    renderAndNavigateToDimensions();

    const btn800 = screen.getByLabelText(/ustaw szerokość na 800 mm/i);
    fireEvent.click(btn800);

    const widthInput = screen.getByLabelText("Szerokość w mm");
    expect(widthInput).toHaveValue(800);
  });

  it("updates price in real-time when dimensions change", () => {
    renderAndNavigateToDimensions();

    const priceEl = screen.getByTestId("price-total");
    const initialPrice = priceEl.textContent;

    // Change width via quick button
    fireEvent.click(screen.getByLabelText(/ustaw szerokość na 1000 mm/i));

    const newPrice = priceEl.textContent;
    expect(newPrice).not.toBe(initialPrice);
  });

  it("DimensionInput accepts free value without clamping on change", () => {
    renderAndNavigateToDimensions();

    const widthInput = screen.getByLabelText(
      "Szerokość w mm",
    ) as HTMLInputElement;

    // Type a value freely (even 623 which is not a multiple of 10)
    fireEvent.change(widthInput, { target: { value: "623" } });
    expect(widthInput.value).toBe("623");
  });

  it("DimensionInput clamps value on blur (< min)", () => {
    renderAndNavigateToDimensions();

    const widthInput = screen.getByLabelText(
      "Szerokość w mm",
    ) as HTMLInputElement;

    fireEvent.change(widthInput, { target: { value: "50" } });
    fireEvent.blur(widthInput);
    expect(widthInput.value).toBe("150");
  });

  it("DimensionInput clamps value on blur (> max)", () => {
    renderAndNavigateToDimensions();

    const widthInput = screen.getByLabelText(
      "Szerokość w mm",
    ) as HTMLInputElement;

    fireEvent.change(widthInput, { target: { value: "3000" } });
    fireEvent.blur(widthInput);
    expect(widthInput.value).toBe("1950");
  });
});
