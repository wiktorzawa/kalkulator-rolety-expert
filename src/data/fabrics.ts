import type { Color, Fabric } from "./types";

export const FABRICS: readonly Fabric[] = [
  {
    id: "standard",
    name: "Standard",
    desc: "Gładka struktura tkaniny. 24 kolory.",
    img: "img/fabrics/standard.png",
    darkening: 3,
    thermo: 3,
    base: { bezinwazyjny: 47.5, inwazyjny: 28.5 },
  },
  {
    id: "standard_termo",
    name: "Standard + Termo",
    desc: "Gładka tkanina z powłoką termoizolacyjną.",
    img: "img/fabrics/standard-termo.png",
    darkening: 3,
    thermo: 4,
    base: { bezinwazyjny: 52.25, inwazyjny: 33.25 },
  },
  {
    id: "melange",
    name: "Melange",
    desc: "Splot melanżowy, wysoka gramatura. 7 kolorów.",
    img: "img/fabrics/melange.png",
    darkening: 4,
    thermo: 4,
    base: { bezinwazyjny: 52.25, inwazyjny: 33.25 },
  },
  {
    id: "melange_termo",
    name: "Melange + Termo",
    desc: "Melanż z powłoką termo. Wysoka gramatura.",
    img: "img/fabrics/melange-termo.png",
    darkening: 4,
    thermo: 5,
    base: { bezinwazyjny: 57, inwazyjny: 38 },
  },
  {
    id: "dolomit",
    name: "Dolomit",
    desc: "Naturalna, pozioma struktura wzoru. 6 kolorów.",
    img: "img/fabrics/dolomit.png",
    darkening: 3,
    thermo: 3,
    base: { bezinwazyjny: 52.25, inwazyjny: 33.25 },
  },
  {
    id: "dolomit_termo",
    name: "Dolomit + Termo",
    desc: "Dolomit z powłoką termoizolacyjną.",
    img: "img/fabrics/dolomit-termo.png",
    darkening: 3,
    thermo: 4,
    base: { bezinwazyjny: 57, inwazyjny: 38 },
  },
  {
    id: "blackout",
    name: "Blackout",
    desc: "Pełne zaciemnienie. 8 kolorów.",
    img: "img/fabrics/blackout.png",
    darkening: 5,
    thermo: 5,
    base: { bezinwazyjny: 66.5, inwazyjny: 47.5 },
  },
  {
    id: "honeycomb",
    name: "Honeycomb",
    desc: "Struktura plastra miodu, podwójna izolacja.",
    img: "img/fabrics/honeycomb.png",
    darkening: 5,
    thermo: 5,
    base: { bezinwazyjny: 66.5, inwazyjny: 47.5 },
  },
] as const;

const STANDARD_COLORS: readonly Color[] = [
  {
    id: "biel",
    name: "Biel",
    hex: "#F5F3EE",
    img: "img/colors/standard-biel.png",
  },
  {
    id: "srebro",
    name: "Srebro",
    hex: "#C8C8C8",
    img: "img/colors/standard-srebro.png",
  },
  {
    id: "krem",
    name: "Krem",
    hex: "#F0E6D0",
    img: "img/colors/standard-krem.png",
  },
  {
    id: "jasny-bez",
    name: "Jasny beż",
    hex: "#E6D5BA",
    img: "img/colors/standard-jasny-bez.png",
  },
  {
    id: "popiel",
    name: "Popiel",
    hex: "#A9A9A9",
    img: "img/colors/standard-popiel.png",
  },
  {
    id: "szary",
    name: "Szary",
    hex: "#8A8A8A",
    img: "img/colors/standard-szary.png",
  },
  {
    id: "grafit",
    name: "Grafit",
    hex: "#4A4A4A",
    img: "img/colors/standard-grafit.png",
  },
  {
    id: "bez",
    name: "Beż",
    hex: "#C9B99A",
    img: "img/colors/standard-bez.png",
  },
  {
    id: "czarny",
    name: "Czarny",
    hex: "#1A1A1A",
    img: "img/colors/standard-czarny.png",
  },
  {
    id: "cappucino",
    name: "Cappucino",
    hex: "#A0785A",
    img: "img/colors/standard-cappucino.png",
  },
  {
    id: "braz",
    name: "Brąz",
    hex: "#6B4226",
    img: "img/colors/standard-braz.png",
  },
  {
    id: "piasek",
    name: "Piasek",
    hex: "#D4C4A8",
    img: "img/colors/standard-piasek.png",
  },
  {
    id: "pudrowy-roz",
    name: "Pudrowy róż",
    hex: "#E8C4C4",
    img: "img/colors/standard-pudrowy-roz.png",
  },
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

const DOLOMIT_COLORS: readonly Color[] = [
  { id: "szary", name: "Szary", hex: "#8A8A8A" },
  { id: "bez", name: "Beż", hex: "#C9B99A" },
  { id: "krem", name: "Krem", hex: "#EDE4D0" },
  { id: "grafit", name: "Grafit", hex: "#4A4A4A" },
  { id: "mocca", name: "Mocca", hex: "#6B4A3A" },
  { id: "srebro", name: "Srebro", hex: "#BDBDBD" },
];

const BLACKOUT_COLORS: readonly Color[] = [
  {
    id: "biel",
    name: "Biel",
    hex: "#F0EEEA",
    img: "img/colors/blackout-biel.png",
  },
  {
    id: "srebro",
    name: "Srebro",
    hex: "#C0C0C0",
    img: "img/colors/blackout-srebro.png",
  },
  {
    id: "szary",
    name: "Szary",
    hex: "#808080",
    img: "img/colors/blackout-szary.png",
  },
  {
    id: "krem",
    name: "Krem",
    hex: "#E8DCC8",
    img: "img/colors/blackout-krem.png",
  },
  {
    id: "grafit",
    name: "Grafit",
    hex: "#3E3E3E",
    img: "img/colors/blackout-grafit.png",
  },
  {
    id: "cappucino",
    name: "Cappucino",
    hex: "#9B7B5A",
    img: "img/colors/blackout-cappucino.png",
  },
  { id: "czarny", name: "Czarny", hex: "#1A1A1A" },
  {
    id: "piasek",
    name: "Piasek",
    hex: "#D4C4A8",
    img: "img/colors/blackout-piasek.png",
  },
];

const HONEYCOMB_COLORS: readonly Color[] = [
  {
    id: "zimny-bez",
    name: "Zimny beż",
    hex: "#D5CCBC",
    img: "img/colors/honeycomb-zimny-bez-1.png",
  },
  {
    id: "cieply-bez",
    name: "Ciepły beż",
    hex: "#CCBFA6",
    img: "img/colors/honeycomb-zimny-bez.png",
  },
  {
    id: "biel",
    name: "Biel",
    hex: "#F0EDEA",
    img: "img/colors/honeycomb-biel.png",
  },
  {
    id: "antracyt",
    name: "Antracyt",
    hex: "#3A3A3A",
    img: "img/colors/honeycomb-antracyt.png",
  },
  {
    id: "szary",
    name: "Szary",
    hex: "#808080",
    img: "img/colors/honeycomb-grafit.png",
  },
  {
    id: "cappucino",
    name: "Cappucino",
    hex: "#9B7B5A",
    img: "img/colors/honeycomb-cappucino.png",
  },
];

/** Map fabric ID → color palette. Termo variants inherit from base fabric. */
const COLOR_MAP: Record<string, readonly Color[]> = {
  standard: STANDARD_COLORS,
  standard_termo: STANDARD_COLORS,
  melange: MELANGE_COLORS,
  melange_termo: MELANGE_COLORS,
  dolomit: DOLOMIT_COLORS,
  dolomit_termo: DOLOMIT_COLORS,
  blackout: BLACKOUT_COLORS,
  honeycomb: HONEYCOMB_COLORS,
};

export function getColorsForFabric(fabricId: string): readonly Color[] {
  return COLOR_MAP[fabricId] ?? [];
}

export function getFabricById(fabricId: string): Fabric | undefined {
  return FABRICS.find((f) => f.id === fabricId);
}
