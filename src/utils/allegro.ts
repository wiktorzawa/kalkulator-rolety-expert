import { ALLEGRO_UNIT_PRICE } from "@/config/allegro";

/**
 * Convert price in PLN to Allegro units.
 * Units = ceil(price / ALLEGRO_UNIT_PRICE).
 * Example: price=156.75, unit_price=4 → ceil(39.1875) = 40 units.
 */
export function priceToUnits(price: number): number {
  if (price <= 0) return 0;
  return Math.ceil(price / ALLEGRO_UNIT_PRICE);
}

/**
 * Format Allegro units as a human-readable breakdown of 10-unit packages + remainder.
 * Examples:
 *   176 → "17× pakiet 10 jednostek + 6 jednostek"
 *   10  → "1× pakiet 10 jednostek"
 *   7   → "7 jednostek"
 *   1   → "1 jednostka"
 *   0   → "0 jednostek"
 */
export function formatUnitsBreakdown(units: number): string {
  const packages = Math.floor(units / 10);
  const remainder = units % 10;

  const parts: string[] = [];

  if (packages > 0) {
    parts.push(`${packages}× pakiet 10 jednostek`);
  }

  if (remainder > 0 || parts.length === 0) {
    const label = remainder === 1 ? "jednostka" : "jednostek";
    parts.push(`${remainder} ${label}`);
  }

  return parts.join(" + ");
}
