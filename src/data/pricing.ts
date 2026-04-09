import type { HeightTier, WidthPriceEntry, HeightPriceEntry } from "./types";

export const DISCOUNT_FACTOR = 0.95;
export const MAX_WIDTH_GLUED = 1200;
export const WIDTH_PRICE_JUMP_AT = 125;

/** Width surcharge table (Stelge × 0.95). Sorted ascending by cm. */
export const WIDTH_PRICE_TABLE: readonly WidthPriceEntry[] = [
  [15, 28.5],
  [20, 28.5],
  [25, 28.5],
  [30, 28.5],
  [35, 33.25],
  [40, 38],
  [45, 42.75],
  [50, 47.5],
  [55, 52.25],
  [60, 57],
  [65, 61.75],
  [70, 66.5],
  [75, 71.25],
  [80, 76],
  [85, 80.75],
  [90, 85.5],
  [95, 90.25],
  [100, 95],
  [105, 99.75],
  [110, 104.5],
  [115, 109.25],
  [120, 114],
  [125, 161.5],
  [130, 166.25],
  [135, 171],
  [140, 175.75],
  [145, 180.5],
  [150, 185.25],
  [155, 190],
  [160, 194.75],
  [165, 199.5],
  [170, 204.25],
  [175, 209],
  [180, 213.75],
  [185, 218.5],
  [190, 223.25],
  [195, 228],
];

/** Height surcharge table (Stelge × 0.95). [maxCm, price]. */
export const HEIGHT_PRICE_TABLE: readonly HeightPriceEntry[] = [
  [150, 52.25],
  [230, 66.5],
  [280, 95],
];

export function getWidthPrice(widthCm: number): number {
  const clamped = Math.max(15, Math.min(195, widthCm));
  let price = 28.5;
  for (const [w, p] of WIDTH_PRICE_TABLE) {
    if (w <= clamped) {
      price = p;
    } else {
      break;
    }
  }
  return price;
}

export function getHeightPrice(heightTier: HeightTier): number {
  const entry = HEIGHT_PRICE_TABLE.find(([maxCm]) => maxCm === heightTier);
  return entry?.[1] ?? 0;
}
