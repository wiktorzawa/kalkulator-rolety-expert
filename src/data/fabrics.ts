import type { Color, Fabric } from "./types";

export const FABRICS: readonly Fabric[] = [
  {
    id: "standard",
    name: "Standard",
    desc: "Gładka struktura tkaniny. 24 kolory.",
    longDesc:
      "Jednolita, gładka struktura tkaniny zapewnia optymalne zaciemnienie i poczucie prywatności. 100% poliester. Wyprodukowana w Polsce.",
    img: "assets/produkty/standard/pomarancz/packshot.png",
    darkening: 3,
    thermo: 3,
    base: { bezinwazyjny: 47.5, inwazyjny: 28.5 },
  },
  {
    id: "standard_termo",
    name: "Standard + Termo",
    desc: "Gładka tkanina z powłoką termoizolacyjną.",
    longDesc:
      "Jednolita, gładka struktura tkaniny. Powłoka Termo odbijająca promienie słoneczne gwarantuje lepszą izolację termiczną pomieszczenia. 100% poliester.",
    img: "assets/produkty/standard-termo/niebieski/packshot.png",
    darkening: 3,
    thermo: 4,
    base: { bezinwazyjny: 52.25, inwazyjny: 33.25 },
  },
  {
    id: "melange",
    name: "Melange",
    desc: "Splot melanżowy, wysoka gramatura. 7 kolorów.",
    longDesc:
      "Struktura tkaniny melanżowej zapewnia wysoki stopień zaciemnienia i poczucie prywatności. Wysoka gramatura materiału. Wyprodukowana w Polsce.",
    img: "assets/produkty/melange/nude/packshot.png",
    darkening: 4,
    thermo: 4,
    base: { bezinwazyjny: 52.25, inwazyjny: 33.25 },
  },
  {
    id: "melange_termo",
    name: "Melange + Termo",
    desc: "Melanż z powłoką termo. Wysoka gramatura.",
    longDesc:
      "Tkanina melanżowa o wysokim stopniu zaciemnienia. Powłoka Termo odbija promienie słoneczne, zapewniając lepszą izolację termiczną. Wyprodukowana w Polsce.",
    img: "assets/produkty/melange-termo/denim/packshot.png",
    darkening: 4,
    thermo: 5,
    base: { bezinwazyjny: 57, inwazyjny: 38 },
  },
  {
    id: "dolomit",
    name: "Dolomit",
    desc: "Naturalna, pozioma struktura wzoru. 6 kolorów.",
    longDesc:
      "Plisy z naturalną, poziomą strukturą wzoru. Optymalne zaciemnienie i poczucie prywatności. Wyprodukowana w Polsce.",
    img: "assets/produkty/dolomit/mocca/packshot.png",
    darkening: 3,
    thermo: 3,
    base: { bezinwazyjny: 52.25, inwazyjny: 33.25 },
  },
  {
    id: "dolomit_termo",
    name: "Dolomit + Termo",
    desc: "Dolomit z powłoką termoizolacyjną.",
    longDesc:
      "Plisy z naturalną, poziomą strukturą wzoru. Powłoka Termo odbija promienie słoneczne, zapewniając lepszą izolację termiczną. Wyprodukowana w Polsce.",
    img: "assets/produkty/dolomit-termo/srebro/packshot.png",
    darkening: 3,
    thermo: 4,
    base: { bezinwazyjny: 57, inwazyjny: 38 },
  },
  {
    id: "blackout",
    name: "Blackout",
    desc: "Pełne zaciemnienie. 8 kolorów.",
    longDesc:
      "Jednolita struktura tkaniny zapewniająca 100% zaciemnienia. Gwarancja komfortu i pełnej prywatności. Wyprodukowana w Polsce.",
    img: "assets/produkty/blackout/czarny/packshot.png",
    darkening: 5,
    thermo: 5,
    base: { bezinwazyjny: 66.5, inwazyjny: 47.5 },
  },
  {
    id: "honeycomb",
    name: "Honeycomb",
    desc: "Struktura plastra miodu, podwójna izolacja.",
    longDesc:
      "Specjalna podwójna warstwa materiału w kształcie plastra miodu skutecznie blokuje przenikanie światła. Srebrna folia aluminiowa wewnątrz zapewnia najwyższą termoizolacyjność.",
    img: "assets/produkty/honeycomb/biel/packshot.png",
    darkening: 5,
    thermo: 5,
    base: { bezinwazyjny: 66.5, inwazyjny: 47.5 },
  },
] as const;

const STANDARD_COLORS: readonly Color[] = [
  { id: "biel", name: "Biel", hex: "#F5F3EE" },
  { id: "srebro", name: "Srebro", hex: "#C8C8C8" },
  { id: "krem", name: "Krem", hex: "#F0E6D0" },
  { id: "jasny-bez", name: "Jasny beż", hex: "#E6D5BA" },
  { id: "popiel", name: "Popiel", hex: "#A9A9A9" },
  { id: "szary", name: "Szary", hex: "#8A8A8A" },
  { id: "grafit", name: "Grafit", hex: "#4A4A4A" },
  { id: "bez", name: "Beż", hex: "#C9B99A" },
  { id: "czarny", name: "Czarny", hex: "#1A1A1A" },
  { id: "cappucino", name: "Cappucino", hex: "#A0785A" },
  { id: "braz", name: "Brąz", hex: "#6B4226" },
  { id: "piasek", name: "Piasek", hex: "#D4C4A8" },
  { id: "pudrowy-roz", name: "Pudrowy róż", hex: "#E8C4C4" },
  { id: "niebieski", name: "Niebieski", hex: "#5B7FA5" },
  { id: "jasny-fiolet", name: "Jasny fiolet", hex: "#B09CC5" },
  { id: "jasna-zielen", name: "Jasna zieleń", hex: "#8FB88F" },
  { id: "pomarancz", name: "Pomarańcz", hex: "#E8873A" },
  { id: "zolty", name: "Żółty", hex: "#E8D44D" },
  { id: "fiolet", name: "Fiolet", hex: "#7B5EA7" },
  { id: "zielen", name: "Zieleń", hex: "#4A7A4A" },
  { id: "turkus", name: "Turkus", hex: "#4ABCC1" },
  { id: "bordo", name: "Bordo", hex: "#7A1F3D" },
  { id: "czerwien", name: "Czerwień", hex: "#C13B3B" },
  { id: "roz", name: "Róż", hex: "#D4729E" },
];

const MELANGE_COLORS: readonly Color[] = [
  { id: "nude", name: "Nude", hex: "#D5C5B0" },
  { id: "popiel", name: "Popiel", hex: "#A0A0A0" },
  { id: "szary", name: "Szary", hex: "#808080" },
  { id: "cappucino", name: "Cappucino", hex: "#9B7B5A" },
  { id: "grafit", name: "Grafit", hex: "#4A4A4A" },
  { id: "braz", name: "Brąz", hex: "#5C3A1E" },
  { id: "denim", name: "Denim", hex: "#4A6A8A" },
];

const MELANGE_TERMO_COLORS: readonly Color[] = MELANGE_COLORS;

const DOLOMIT_COLORS: readonly Color[] = [
  { id: "szary", name: "Szary", hex: "#8A8A8A" },
  { id: "bez", name: "Beż", hex: "#C9B99A" },
  { id: "krem", name: "Krem", hex: "#EDE4D0" },
  { id: "grafit", name: "Grafit", hex: "#4A4A4A" },
  { id: "mocca", name: "Mocca", hex: "#6B4A3A" },
  { id: "srebro", name: "Srebro", hex: "#BDBDBD" },
];

const DOLOMIT_TERMO_COLORS: readonly Color[] = DOLOMIT_COLORS;

const BLACKOUT_COLORS: readonly Color[] = [
  { id: "biel", name: "Biel", hex: "#F0EEEA" },
  { id: "srebro", name: "Srebro", hex: "#C0C0C0" },
  { id: "szary", name: "Szary", hex: "#808080" },
  { id: "krem", name: "Krem", hex: "#E8DCC8" },
  { id: "grafit", name: "Grafit", hex: "#3E3E3E" },
  { id: "cappucino", name: "Cappucino", hex: "#9B7B5A" },
  { id: "czarny", name: "Czarny", hex: "#1A1A1A" },
  { id: "piasek", name: "Piasek", hex: "#D4C4A8" },
];

const HONEYCOMB_COLORS: readonly Color[] = [
  { id: "zimny-bez", name: "Zimny beż", hex: "#D5CCBC" },
  { id: "cieply-bez", name: "Ciepły beż", hex: "#CCBFA6" },
  { id: "biel", name: "Biel", hex: "#F0EDEA" },
  { id: "antracyt", name: "Antracyt", hex: "#3A3A3A" },
  { id: "grafit", name: "Szary", hex: "#808080" },
  { id: "cappucino", name: "Cappucino", hex: "#9B7B5A" },
];

/** Map fabric ID → color palette. Termo variants inherit from base fabric. */
const COLOR_MAP: Record<string, readonly Color[]> = {
  standard: STANDARD_COLORS,
  standard_termo: STANDARD_COLORS,
  melange: MELANGE_COLORS,
  melange_termo: MELANGE_TERMO_COLORS,
  dolomit: DOLOMIT_COLORS,
  dolomit_termo: DOLOMIT_TERMO_COLORS,
  blackout: BLACKOUT_COLORS,
  honeycomb: HONEYCOMB_COLORS,
};

export function getColorsForFabric(fabricId: string): readonly Color[] {
  return COLOR_MAP[fabricId] ?? [];
}

export function getFabricById(fabricId: string): Fabric | undefined {
  return FABRICS.find((f) => f.id === fabricId);
}
