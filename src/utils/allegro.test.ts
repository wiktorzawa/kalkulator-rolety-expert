import { describe, it, expect } from "vitest";

import { priceToUnits, formatUnitsBreakdown } from "./allegro";

// ALLEGRO_UNIT_PRICE = 4 zł (from config/allegro.ts)

describe("priceToUnits", () => {
  it("175.75 / 4 = 43.9375 → ceil = 44 units", () => {
    expect(priceToUnits(175.75)).toBe(44);
  });

  it("156.75 / 4 = 39.1875 → ceil = 40 units", () => {
    expect(priceToUnits(156.75)).toBe(40);
  });

  it("200 / 4 = 50 → exact = 50 units", () => {
    expect(priceToUnits(200)).toBe(50);
  });

  it("0.01 / 4 = 0.0025 → ceil = 1 unit", () => {
    expect(priceToUnits(0.01)).toBe(1);
  });

  it("returns 0 for 0", () => {
    expect(priceToUnits(0)).toBe(0);
  });

  it("612.75 / 4 = 153.1875 → ceil = 154 units", () => {
    expect(priceToUnits(612.75)).toBe(154);
  });
});

describe("formatUnitsBreakdown", () => {
  it('formats 44 as "4× pakiet 10 jednostek + 4 jednostek"', () => {
    expect(formatUnitsBreakdown(44)).toBe(
      "4× pakiet 10 jednostek + 4 jednostek",
    );
  });

  it('formats 10 as "1× pakiet 10 jednostek"', () => {
    expect(formatUnitsBreakdown(10)).toBe("1× pakiet 10 jednostek");
  });

  it('formats 7 as "7 jednostek"', () => {
    expect(formatUnitsBreakdown(7)).toBe("7 jednostek");
  });

  it('formats 20 as "2× pakiet 10 jednostek"', () => {
    expect(formatUnitsBreakdown(20)).toBe("2× pakiet 10 jednostek");
  });

  it('formats 1 as "1 jednostka"', () => {
    expect(formatUnitsBreakdown(1)).toBe("1 jednostka");
  });

  it('formats 0 as "0 jednostek"', () => {
    expect(formatUnitsBreakdown(0)).toBe("0 jednostek");
  });
});
