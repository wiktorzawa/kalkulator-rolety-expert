import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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

import { App } from "./App";

describe("App", () => {
  it("renders configurator with header", () => {
    render(<App />);
    const logo = screen.getByAltText("rolety.expert");
    expect(logo).toBeInTheDocument();
  });

  it("renders fabric step on initial load", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /wybierz tkaninę/i }),
    ).toBeInTheDocument();
  });

  it("renders add-to-order button (disabled initially)", () => {
    render(<App />);
    const button = screen.getByRole("button", {
      name: /dodaj do zamówienia/i,
    });
    expect(button).toBeDisabled();
  });
});
