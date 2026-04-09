/**
 * Image path mappings for fabric and color thumbnails.
 * Paths are relative to public/ directory.
 * Actual images will be copied in Phase 4 (Unit 8).
 */

export function getFabricImagePath(fabricId: string): string {
  return `assets/fabrics/${fabricId}.png`;
}

export function getColorImagePath(
  fabricId: string,
  colorId: string,
): string | null {
  return `assets/colors/${fabricId}-${colorId}.png`;
}
