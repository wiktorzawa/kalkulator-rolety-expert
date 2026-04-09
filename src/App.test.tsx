import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { App } from "./App";

describe("App", () => {
  it("renders HeroUI Button correctly", () => {
    render(<App />);
    const button = screen.getByRole("button", {
      name: /rozpocznij konfigurację/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("renders heading with brand text", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Konfigurator Rolet");
  });
});
