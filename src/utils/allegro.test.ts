import { describe, it, expect } from "vitest";

import { priceToUnits, formatUnitsBreakdown } from "./allegro";

describe("priceToUnits", () => {
  it("rounds 175.75 up to 176 units", () => {
    expect(priceToUnits(175.75)).toBe(176);
  });

  it("rounds 156.75 up to 157 units", () => {
    expect(priceToUnits(156.75)).toBe(157);
  });

  it("keeps exact integer as-is", () => {
    expect(priceToUnits(200)).toBe(200);
  });

  it("rounds 0.01 up to 1", () => {
    expect(priceToUnits(0.01)).toBe(1);
  });

  it("returns 0 for 0", () => {
    expect(priceToUnits(0)).toBe(0);
  });
});

describe("formatUnitsBreakdown", () => {
  it('formats 176 as "17× pakiet 10 jednostek + 6 jednostek"', () => {
    expect(formatUnitsBreakdown(176)).toBe(
      "17× pakiet 10 jednostek + 6 jednostek",
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
