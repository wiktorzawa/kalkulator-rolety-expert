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
 * Centralny rejestr niestandardowych nazw plików assetów.
 * Klucz: "{kolekcja}/{kolor}/{typ}" (typ: packshot, packshot-bezinwazyjny, swatch)
 * Wartość: rzeczywista nazwa pliku na dysku.
 *
 * Zapobiega błędom "zdjęcie nie ładuje się" przez mapowanie WSZYSTKICH
 * plików z niestandardowymi nazwami/rozszerzeniami w jednym miejscu.
 */
const FILE_OVERRIDES: Record<string, string> = {
  // Honeycomb antracyt: .webp zamiast .png
  "honeycomb/antracyt/packshot": "packshot.webp",
  "honeycomb/antracyt/swatch": "zblizenie.webp",
  // Honeycomb zimny-bez: inne nazwy + .webp
  "honeycomb/zimny-bez/packshot": "packshot-2.webp",
  "honeycomb/zimny-bez/swatch": "zblizenie-2.webp",
};

/**
 * Zwraca ścieżkę do packshot produktu.
 * Sprawdza FILE_OVERRIDES dla niestandardowych plików.
 */
export function getPackshotPath(
  kolekcja: string,
  kolor: string,
  isBezinwazyjny: boolean,
): string {
  if (isBezinwazyjny) {
    const override =
      FILE_OVERRIDES[`${kolekcja}/${kolor}/packshot-bezinwazyjny`];
    const filename = override ?? "packshot-bezinwazyjny.png";
    return `assets/produkty/${kolekcja}/${kolor}/${filename}`;
  }
  const override = FILE_OVERRIDES[`${kolekcja}/${kolor}/packshot`];
  const filename = override ?? "packshot.png";
  return `assets/produkty/${kolekcja}/${kolor}/${filename}`;
}

/**
 * Zwraca ścieżkę do próbki tkaniny (close-up).
 * Sprawdza FILE_OVERRIDES, potem kolekcję (zblizenie vs tkanina).
 */
export function getFabricSwatchPath(kolekcja: string, kolor: string): string {
  const override = FILE_OVERRIDES[`${kolekcja}/${kolor}/swatch`];
  if (override) {
    return `assets/produkty/${kolekcja}/${kolor}/${override}`;
  }
  if (ZBLIZENIE_COLLECTIONS.has(kolekcja)) {
    return `assets/produkty/${kolekcja}/${kolor}/zblizenie.png`;
  }
  return `assets/produkty/${kolekcja}/${kolor}/tkanina.jpg`;
}

/** Typy grafik montażowych (bez zbliżeń — te mają osobną funkcję) */
export type MountingImageType = "opis" | "pomiar" | "grafika-pomiarowa";

/**
 * Mapowanie systemId → lista plików zbliżeń profilu montażowego.
 * Bezinwazyjny wzmocniony: zblizenie-1.png, zblizenie-2.png
 * Pozostałe systemy: zblizenie-dol.webp, zblizenie-gora.webp
 */
const MOUNTING_CLOSEUPS: Record<string, readonly string[]> = {
  "bezinwazyjny-wzmocniony": ["zblizenie-1.png", "zblizenie-2.png"],
  "bezinwazyjny-klejony": ["zblizenie-dol.webp", "zblizenie-gora.webp"],
  "inwazyjny-standard": ["zblizenie-dol.webp", "zblizenie-gora.webp"],
  "inwazyjny-regulowany": ["zblizenie-dol.webp", "zblizenie-gora.webp"],
  "inwazyjny-katowy": ["zblizenie-dol.webp", "zblizenie-gora.webp"],
};

/**
 * Zwraca ścieżkę do grafiki montażu (opis, pomiar, grafika-pomiarowa).
 * @param systemId - ID systemu (np. 'bezinwazyjny-wzmocniony', 'inwazyjny-standard')
 * @param imageType - typ grafiki ('opis', 'pomiar', 'grafika-pomiarowa')
 */
export function getMountingImagePath(
  systemId: string,
  imageType: MountingImageType,
): string {
  return `assets/montaz/${systemId}/${imageType}.png`;
}

/**
 * Zwraca tablicę ścieżek do zbliżeń profilu montażowego.
 * Każdy system ma 2 zdjęcia zbliżeń (różne nazwy plików per system).
 * @param systemId - ID systemu (np. 'bezinwazyjny-wzmocniony')
 */
export function getMountingCloseupPaths(systemId: string): readonly string[] {
  const files = MOUNTING_CLOSEUPS[systemId];
  if (!files) {
    return [];
  }
  return files.map((file) => `assets/montaz/${systemId}/${file}`);
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
