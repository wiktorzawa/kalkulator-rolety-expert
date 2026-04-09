import type { HeightTier, PriceBreakdown, PriceInput } from "@/data/types";
import { getFabricById } from "@/data/fabrics";
import { getWidthPrice, getHeightPrice } from "@/data/pricing";
import { getRailById } from "@/data/rails";

/**
 * Convert width in mm to the pricing table cm value.
 * Formula: Math.ceil(Math.ceil(widthMm / 10) / 5) * 5
 * Example: 623mm → ceil(62.3)=63 → ceil(63/5)=ceil(12.6)=13 → 13*5=65cm
 */
export function widthToCm(widthMm: number): number {
  return Math.ceil(Math.ceil(widthMm / 10) / 5) * 5;
}

/**
 * Determine height pricing tier from height in mm.
 * ≤1500mm (150cm) → 150, ≤2300mm (230cm) → 230, else → 280
 */
export function heightToTier(heightMm: number): HeightTier {
  const cm = Math.ceil(heightMm / 10);
  if (cm <= 150) return 150;
  if (cm <= 230) return 230;
  return 280;
}

/**
 * Round price to nearest 0.25 (quarter).
 * Formula: Math.round(price * 4) / 4
 */
export function roundToQuarter(price: number): number {
  return Math.round(price * 4) / 4;
}

/**
 * Calculate full price breakdown for a roller blind configuration.
 * Returns 0 total if fabric or mounting is not selected.
 */
export function calculatePrice(input: PriceInput): PriceBreakdown {
  const EMPTY: PriceBreakdown = {
    basePrice: 0,
    widthPrice: 0,
    heightPrice: 0,
    railSurcharge: 0,
    total: 0,
  };

  if (!input.fabricId || !input.mountingType) {
    return EMPTY;
  }

  const fabric = getFabricById(input.fabricId);
  if (!fabric) {
    return EMPTY;
  }

  const basePrice = fabric.base[input.mountingType];
  const widthCm = widthToCm(input.widthMm);
  const widthPrice = getWidthPrice(widthCm);
  const tier = heightToTier(input.heightMm);
  const heightPrice = getHeightPrice(tier);

  let railSurcharge = 0;
  if (input.railId) {
    const rail = getRailById(input.railId);
    railSurcharge = rail?.surcharge ?? 0;
  }

  const total = basePrice + widthPrice + heightPrice + railSurcharge;

  return {
    basePrice,
    widthPrice,
    heightPrice,
    railSurcharge,
    total,
  };
}
