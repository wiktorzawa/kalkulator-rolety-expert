/**
 * Image path utilities for product, mounting, and rail images.
 * Paths are relative to public/ directory (served by Vite as root).
 *
 * Asset structure:
 *   assets/produkty/{kolekcja}/{kolor}/packshot.png
 *   assets/produkty/{kolekcja}/{kolor}/packshot-bezinwazyjny.png
 *   assets/produkty/{kolekcja}/{kolor}/tkanina.jpg   (standard, melange, dolomit + termo variants)
 *   assets/produkty/{kolekcja}/{kolor}/zblizenie.png  (blackout, honeycomb)
 *   assets/montaz/{systemId}/opis.png
 *   assets/prowadnice/{railId}.jpg (or .webp)
 */

/** Kolekcje używające zblizenie.png/webp zamiast tkanina.jpg jako próbki tkaniny */
const ZBLIZENIE_COLLECTIONS = new Set(["blackout", "honeycomb"]);

/**
 * Mapowanie railId → rozszerzenie pliku (domyślnie .jpg).
 * Niektóre prowadnice mają pliki .webp.
 */
const RAIL_EXTENSIONS: Record<string, string> = {
  krem: ".webp",
  "czarny-lakier": ".webp",
  "turner-oak": ".webp",
};

/**
 * Zwraca ścieżkę do packshot produktu.
 * @param kolekcja - ID kolekcji (np. 'standard', 'standard-termo', 'honeycomb')
 * @param kolor - ID koloru (np. 'biel', 'grafit')
 * @param isBezinwazyjny - true dla montażu bezinwazyjnego
 */
export function getPackshotPath(
  kolekcja: string,
  kolor: string,
  isBezinwazyjny: boolean,
): string {
  const suffix = isBezinwazyjny ? "packshot-bezinwazyjny" : "packshot";
  return `assets/produkty/${kolekcja}/${kolor}/${suffix}.png`;
}

/**
 * Zwraca ścieżkę do próbki tkaniny (close-up).
 * - Standard, Melange, Dolomit (+ Termo): tkanina.jpg
 * - Blackout: zblizenie.png
 * - Honeycomb: zblizenie.png
 */
export function getFabricSwatchPath(kolekcja: string, kolor: string): string {
  if (ZBLIZENIE_COLLECTIONS.has(kolekcja)) {
    return `assets/produkty/${kolekcja}/${kolor}/zblizenie.png`;
  }
  return `assets/produkty/${kolekcja}/${kolor}/tkanina.jpg`;
}

/** Typy grafik montażowych */
export type MountingImageType =
  | "opis"
  | "pomiar"
  | "grafika-pomiarowa"
  | "zblizenie";

/**
 * Zwraca ścieżkę do grafiki montażu.
 * @param systemId - ID systemu (np. 'bezinwazyjny-wzmocniony', 'inwazyjny-standard')
 * @param imageType - typ grafiki ('opis', 'pomiar', 'grafika-pomiarowa', 'zblizenie')
 */
export function getMountingImagePath(
  systemId: string,
  imageType: MountingImageType,
): string {
  return `assets/montaz/${systemId}/${imageType}.png`;
}

/**
 * Zwraca ścieżkę do zdjęcia prowadnicy/listwy aluminiowej.
 * Uwzględnia różne rozszerzenia (.jpg / .webp).
 * @param railId - ID prowadnicy (np. 'biel', 'krem', 'czarny-lakier')
 */
export function getRailImagePath(railId: string): string {
  const ext = RAIL_EXTENSIONS[railId] ?? ".jpg";
  return `assets/prowadnice/${railId}${ext}`;
}

/**
 * Konwertuje fabricId (z podkreśleniem) na nazwę folderu kolekcji (z myślnikiem).
 * Np. 'standard_termo' → 'standard-termo'
 */
export function fabricIdToCollection(fabricId: string): string {
  return fabricId.replace(/_/g, "-");
}

/**
 * Zwraca bazową kolekcję dla wariantów Termo (do dziedziczenia próbek tkaniny).
 * 'standard-termo' → 'standard', 'melange-termo' → 'melange', 'dolomit-termo' → 'dolomit'
 * Nie-termo kolekcje zwracają samych siebie.
 */
export function getBaseCollection(kolekcja: string): string {
  return kolekcja.replace(/-termo$/, "");
}
