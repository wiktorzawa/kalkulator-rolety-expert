import { describe, it, expect } from "vitest";

import {
  calculatePrice,
  widthToCm,
  heightToTier,
  roundToQuarter,
} from "./pricing";

describe("widthToCm", () => {
  it("converts 623mm to 65cm (rounds up to nearest 5cm)", () => {
    expect(widthToCm(623)).toBe(65);
  });

  it("converts exact 800mm to 80cm", () => {
    expect(widthToCm(800)).toBe(80);
  });

  it("converts 150mm to 15cm (minimum)", () => {
    expect(widthToCm(150)).toBe(15);
  });

  it("converts 1950mm to 195cm (maximum)", () => {
    expect(widthToCm(1950)).toBe(195);
  });

  it("converts 601mm to 65cm", () => {
    expect(widthToCm(601)).toBe(65);
  });
});

describe("heightToTier", () => {
  it("returns 150 for height 1500mm (exactly 150cm)", () => {
    expect(heightToTier(1500)).toBe(150);
  });

  it("returns 230 for height 1510mm (just above 150cm)", () => {
    expect(heightToTier(1510)).toBe(230);
  });

  it("returns 230 for height 2300mm (exactly 230cm)", () => {
    expect(heightToTier(2300)).toBe(230);
  });

  it("returns 280 for height 2310mm (just above 230cm)", () => {
    expect(heightToTier(2310)).toBe(280);
  });

  it("returns 280 for height 2800mm (max)", () => {
    expect(heightToTier(2800)).toBe(280);
  });
});

describe("roundToQuarter", () => {
  it("rounds 33.33 to 33.25", () => {
    expect(roundToQuarter(33.33)).toBe(33.25);
  });

  it("rounds 33.50 to 33.50 (already on quarter)", () => {
    expect(roundToQuarter(33.5)).toBe(33.5);
  });

  it("rounds 33.13 to 33.25", () => {
    expect(roundToQuarter(33.13)).toBe(33.25);
  });

  it("rounds 0 to 0", () => {
    expect(roundToQuarter(0)).toBe(0);
  });
});

describe("calculatePrice", () => {
  it("Standard + Inwazyjny + 60cm + 150cm + Biały = 137.75 zł", () => {
    const result = calculatePrice({
      fabricId: "standard",
      mountingType: "inwazyjny",
      widthMm: 600,
      heightMm: 1500,
      railId: "bialy",
    });
    expect(result.total).toBe(137.75);
  });

  it("Standard + Bezinwazyjny + 60cm + 150cm + Biały = 156.75 zł", () => {
    const result = calculatePrice({
      fabricId: "standard",
      mountingType: "bezinwazyjny",
      widthMm: 600,
      heightMm: 1500,
      railId: "bialy",
    });
    expect(result.total).toBe(156.75);
  });

  it("Standard + Inwazyjny + 100cm + 150cm + Biały = 175.75 zł", () => {
    const result = calculatePrice({
      fabricId: "standard",
      mountingType: "inwazyjny",
      widthMm: 1000,
      heightMm: 1500,
      railId: "bialy",
    });
    expect(result.total).toBe(175.75);
  });

  it("Standard + Inwazyjny + 100cm + 230cm + Biały = 190.00 zł", () => {
    const result = calculatePrice({
      fabricId: "standard",
      mountingType: "inwazyjny",
      widthMm: 1000,
      heightMm: 2300,
      railId: "bialy",
    });
    expect(result.total).toBe(190.0);
  });

  it("Standard+Termo + Inwazyjny + 80cm + 150cm + Srebrny = 166.25 zł", () => {
    const result = calculatePrice({
      fabricId: "standard_termo",
      mountingType: "inwazyjny",
      widthMm: 800,
      heightMm: 1500,
      railId: "srebrny",
    });
    expect(result.total).toBe(166.25);
  });

  it("Blackout + Inwazyjny + 120cm + 230cm + Biały = 228.00 zł", () => {
    const result = calculatePrice({
      fabricId: "blackout",
      mountingType: "inwazyjny",
      widthMm: 1200,
      heightMm: 2300,
      railId: "bialy",
    });
    expect(result.total).toBe(228.0);
  });

  it("Blackout + Inwazyjny + 130cm + 230cm + Biały = 280.25 zł", () => {
    const result = calculatePrice({
      fabricId: "blackout",
      mountingType: "inwazyjny",
      widthMm: 1300,
      heightMm: 2300,
      railId: "bialy",
    });
    expect(result.total).toBe(280.25);
  });

  it("Honeycomb + Bezinwazyjny + 90cm + 280cm + Orzech = 256.50 zł", () => {
    const result = calculatePrice({
      fabricId: "honeycomb",
      mountingType: "bezinwazyjny",
      widthMm: 900,
      heightMm: 2800,
      railId: "orzech",
    });
    expect(result.total).toBe(256.5);
  });

  it("price jumps at 120cm→125cm boundary", () => {
    const at120 = calculatePrice({
      fabricId: "standard",
      mountingType: "inwazyjny",
      widthMm: 1200,
      heightMm: 1500,
      railId: "bialy",
    });
    const at125 = calculatePrice({
      fabricId: "standard",
      mountingType: "inwazyjny",
      widthMm: 1250,
      heightMm: 1500,
      railId: "bialy",
    });
    // width price at 120cm = 114.00, at 125cm = 161.50
    expect(at120.widthPrice).toBe(114.0);
    expect(at125.widthPrice).toBe(161.5);
  });

  it("returns price breakdown with all components", () => {
    const result = calculatePrice({
      fabricId: "standard",
      mountingType: "bezinwazyjny",
      widthMm: 600,
      heightMm: 1500,
      railId: "bialy",
    });
    expect(result.basePrice).toBe(47.5);
    expect(result.widthPrice).toBe(57.0);
    expect(result.heightPrice).toBe(52.25);
    expect(result.railSurcharge).toBe(0);
    expect(result.total).toBe(156.75);
  });

  it("returns 0 total when fabricId is null", () => {
    const result = calculatePrice({
      fabricId: null,
      mountingType: "inwazyjny",
      widthMm: 600,
      heightMm: 1500,
      railId: "bialy",
    });
    expect(result.total).toBe(0);
  });

  it("returns 0 total when mountingType is null", () => {
    const result = calculatePrice({
      fabricId: "standard",
      mountingType: null,
      widthMm: 600,
      heightMm: 1500,
      railId: "bialy",
    });
    expect(result.total).toBe(0);
  });
});
