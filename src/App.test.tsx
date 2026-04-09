import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({ single: vi.fn() })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle: vi.fn() })),
      })),
    })),
  },
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
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Konfigurator Rolet");
  });

  it("renders fabric step on initial load", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /wybierz tkaninę/i }),
    ).toBeInTheDocument();
  });

  it("renders order button (disabled initially)", () => {
    render(<App />);
    const button = screen.getByRole("button", {
      name: /zamow przez allegro/i,
    });
    expect(button).toBeDisabled();
  });
});
