import type { Color, Fabric } from "./types";

export const FABRICS: readonly Fabric[] = [
  {
    id: "standard",
    name: "Standard",
    desc: "Gładka struktura tkaniny. 24 kolory.",
    img: "assets/01-Standard/STANDARD-inwazyjne-BIEL-300x500.png",
    darkening: 3,
    thermo: 3,
    base: { bezinwazyjny: 47.5, inwazyjny: 28.5 },
  },
  {
    id: "standard_termo",
    name: "Standard + Termo",
    desc: "Gładka tkanina z powłoką termoizolacyjną.",
    img: "assets/02-Standard-Termo/STANDARDTERMO-inwazyjne-BIEL-300x500.png",
    darkening: 3,
    thermo: 4,
    base: { bezinwazyjny: 52.25, inwazyjny: 33.25 },
  },
  {
    id: "melange",
    name: "Melange",
    desc: "Splot melanżowy, wysoka gramatura. 7 kolorów.",
    img: "assets/03a-Melange/MELANGE-inwazyjne-DENIM-300x500.png",
    darkening: 4,
    thermo: 4,
    base: { bezinwazyjny: 52.25, inwazyjny: 33.25 },
  },
  {
    id: "melange_termo",
    name: "Melange + Termo",
    desc: "Melanż z powłoką termo. Wysoka gramatura.",
    img: "assets/03-Melange-Termo/MELANGETERMO-inwazyjne-NUDE-300x500.png",
    darkening: 4,
    thermo: 5,
    base: { bezinwazyjny: 57, inwazyjny: 38 },
  },
  {
    id: "dolomit",
    name: "Dolomit",
    desc: "Naturalna, pozioma struktura wzoru. 6 kolorów.",
    img: "assets/04-Dolomit/DOLOMIT-inwazyjne-KREM-300x500.png",
    darkening: 3,
    thermo: 3,
    base: { bezinwazyjny: 52.25, inwazyjny: 33.25 },
  },
  {
    id: "dolomit_termo",
    name: "Dolomit + Termo",
    desc: "Dolomit z powłoką termoizolacyjną.",
    img: "assets/05-Dolomit-Termo/DOLOMITTERMO-inwazyjne-KREM-300x500.png",
    darkening: 3,
    thermo: 4,
    base: { bezinwazyjny: 57, inwazyjny: 38 },
  },
  {
    id: "blackout",
    name: "Blackout",
    desc: "Pełne zaciemnienie. 8 kolorów.",
    img: "assets/06-Blackout/BLACKOUT-inwazyjne-BIEL-300x500.png",
    darkening: 5,
    thermo: 5,
    base: { bezinwazyjny: 66.5, inwazyjny: 47.5 },
  },
  {
    id: "honeycomb",
    name: "Honeycomb",
    desc: "Struktura plastra miodu, podwójna izolacja.",
    img: "assets/07-Honeycomb/HONEYCOMB-inwazyjne-BIEL-300x500.png",
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
    img: "assets/01-Standard/plisa-biala-300x500.jpg",
  },
  {
    id: "srebro",
    name: "Srebro",
    hex: "#C8C8C8",
    img: "assets/01-Standard/plisa-srebro-300x500.jpg",
  },
  {
    id: "krem",
    name: "Krem",
    hex: "#F0E6D0",
    img: "assets/01-Standard/plisa-krem-300x500.jpg",
  },
  {
    id: "jasny-bez",
    name: "Jasny beż",
    hex: "#E6D5BA",
    img: "assets/01-Standard/plisa-jasny-bez-300x500.jpg",
  },
  {
    id: "popiel",
    name: "Popiel",
    hex: "#A9A9A9",
    img: "assets/01-Standard/plisa-popiel-300x500.jpg",
  },
  {
    id: "szary",
    name: "Szary",
    hex: "#8A8A8A",
    img: "assets/01-Standard/plisa-szary-300x500.jpg",
  },
  {
    id: "grafit",
    name: "Grafit",
    hex: "#4A4A4A",
    img: "assets/01-Standard/plisa-grafit-300x500.jpg",
  },
  {
    id: "bez",
    name: "Beż",
    hex: "#C9B99A",
    img: "assets/01-Standard/plisa-bez-300x500.jpg",
  },
  {
    id: "czarny",
    name: "Czarny",
    hex: "#1A1A1A",
    img: "assets/01-Standard/plisa-czern-300x500.jpg",
  },
  {
    id: "cappucino",
    name: "Cappucino",
    hex: "#A0785A",
    img: "assets/01-Standard/plisa-cappucino-300x500.jpg",
  },
  {
    id: "braz",
    name: "Brąz",
    hex: "#6B4226",
    img: "assets/01-Standard/plisa-braz-300x500.jpg",
  },
  {
    id: "piasek",
    name: "Piasek",
    hex: "#D4C4A8",
    img: "assets/01-Standard/plisa-piasek-300x500.jpg",
  },
  {
    id: "pudrowy-roz",
    name: "Pudrowy róż",
    hex: "#E8C4C4",
    img: "assets/01-Standard/plisa-pudrowy-roz-300x500.jpg",
  },
  {
    id: "niebieski",
    name: "Niebieski",
    hex: "#5B7FA5",
    img: "assets/01-Standard/plisa-niebieskie-300x500.jpg",
  },
  {
    id: "jasny-fiolet",
    name: "Jasny fiolet",
    hex: "#B09CC5",
    img: "assets/01-Standard/plisa-jasny-fiolet-300x500.jpg",
  },
  {
    id: "jasna-zielen",
    name: "Jasna zieleń",
    hex: "#8FB88F",
    img: "assets/01-Standard/plisa-jasna-zielen-300x500.jpg",
  },
  {
    id: "pomarancz",
    name: "Pomarańcz",
    hex: "#E8873A",
    img: "assets/01-Standard/plisa-pomarancz-300x500.jpg",
  },
  {
    id: "zolty",
    name: "Żółty",
    hex: "#E8D44D",
    img: "assets/01-Standard/plisa-zolty-300x500.jpg",
  },
  {
    id: "fiolet",
    name: "Fiolet",
    hex: "#7B5EA7",
    img: "assets/01-Standard/plisa-fiolet-300x500.jpg",
  },
  {
    id: "zielen",
    name: "Zieleń",
    hex: "#4A7A4A",
    img: "assets/01-Standard/plisa-zielony-300x500.jpg",
  },
  {
    id: "turkus",
    name: "Turkus",
    hex: "#4ABCC1",
    img: "assets/01-Standard/plisa-turkus-300x500.jpg",
  },
  {
    id: "bordo",
    name: "Bordo",
    hex: "#7A1F3D",
    img: "assets/01-Standard/plisa-bordo-300x500.jpg",
  },
  {
    id: "czerwien",
    name: "Czerwień",
    hex: "#C13B3B",
    img: "assets/01-Standard/plisa-czerwony-300x500.jpg",
  },
  {
    id: "roz",
    name: "Róż",
    hex: "#D4729E",
    img: "assets/01-Standard/plisa-roz-300x500.jpg",
  },
];

const MELANGE_COLORS: readonly Color[] = [
  {
    id: "nude",
    name: "Nude",
    hex: "#D5C5B0",
    img: "assets/03a-Melange/nude-300x500.jpg",
  },
  {
    id: "popiel",
    name: "Popiel",
    hex: "#A0A0A0",
    img: "assets/03a-Melange/popiel-300x500.jpg",
  },
  {
    id: "szary",
    name: "Szary",
    hex: "#808080",
    img: "assets/03a-Melange/szary-300x500.jpg",
  },
  {
    id: "cappucino",
    name: "Cappucino",
    hex: "#9B7B5A",
    img: "assets/03a-Melange/cappucino-300x500.jpg",
  },
  {
    id: "grafit",
    name: "Grafit",
    hex: "#4A4A4A",
    img: "assets/03a-Melange/grafit-300x500.jpg",
  },
  {
    id: "braz",
    name: "Brąz",
    hex: "#5C3A1E",
    img: "assets/03a-Melange/braz-300x500.jpg",
  },
  {
    id: "denim",
    name: "Denim",
    hex: "#4A6A8A",
    img: "assets/03a-Melange/denim-300x500.jpg",
  },
];

const MELANGE_TERMO_COLORS: readonly Color[] = [
  {
    id: "nude",
    name: "Nude",
    hex: "#D5C5B0",
    img: "assets/03-Melange-Termo/nude.-300x500.jpg",
  },
  {
    id: "popiel",
    name: "Popiel",
    hex: "#A0A0A0",
    img: "assets/03-Melange-Termo/popiel.-300x500.jpg",
  },
  {
    id: "szary",
    name: "Szary",
    hex: "#808080",
    img: "assets/03-Melange-Termo/szary.-300x500.jpg",
  },
  {
    id: "cappucino",
    name: "Cappucino",
    hex: "#9B7B5A",
    img: "assets/03-Melange-Termo/cappucino.-300x500.jpg",
  },
  {
    id: "grafit",
    name: "Grafit",
    hex: "#4A4A4A",
    img: "assets/03-Melange-Termo/grafit.-300x500.jpg",
  },
  {
    id: "braz",
    name: "Brąz",
    hex: "#5C3A1E",
    img: "assets/03-Melange-Termo/braz.-300x500.jpg",
  },
  {
    id: "denim",
    name: "Denim",
    hex: "#4A6A8A",
    img: "assets/03-Melange-Termo/denim.-300x500.jpg",
  },
];

const DOLOMIT_COLORS: readonly Color[] = [
  {
    id: "szary",
    name: "Szary",
    hex: "#8A8A8A",
    img: "assets/04-Dolomit/szary-2-300x500.jpg",
  },
  {
    id: "bez",
    name: "Beż",
    hex: "#C9B99A",
    img: "assets/04-Dolomit/bez-2-300x500.jpg",
  },
  {
    id: "krem",
    name: "Krem",
    hex: "#EDE4D0",
    img: "assets/04-Dolomit/krem-2-300x500.jpg",
  },
  {
    id: "grafit",
    name: "Grafit",
    hex: "#4A4A4A",
    img: "assets/04-Dolomit/grafitt-300x500.jpg",
  },
  {
    id: "mocca",
    name: "Mocca",
    hex: "#6B4A3A",
    img: "assets/04-Dolomit/mocca-2-300x500.jpg",
  },
  {
    id: "srebro",
    name: "Srebro",
    hex: "#BDBDBD",
    img: "assets/04-Dolomit/srebro-2-300x500.jpg",
  },
];

const BLACKOUT_COLORS: readonly Color[] = [
  {
    id: "biel",
    name: "Biel",
    hex: "#F0EEEA",
    img: "assets/06-Blackout/BLACKOUT-zblizenie-inwazyjne-BIEL-300x500.png",
  },
  {
    id: "srebro",
    name: "Srebro",
    hex: "#C0C0C0",
    img: "assets/06-Blackout/BLACKOUT-zblizenie-inwazyjne-SREBRO-300x500.png",
  },
  {
    id: "szary",
    name: "Szary",
    hex: "#808080",
    img: "assets/06-Blackout/BLACKOUT-zblizenie-inwazyjne-SZARY-300x500.png",
  },
  {
    id: "krem",
    name: "Krem",
    hex: "#E8DCC8",
    img: "assets/06-Blackout/BLACKOUT-zblizenie-inwazyjne-KREM-300x500.png",
  },
  {
    id: "grafit",
    name: "Grafit",
    hex: "#3E3E3E",
    img: "assets/06-Blackout/BLACKOUT-zblizenie-inwazyjne-GRAFIT-300x500.png",
  },
  {
    id: "cappucino",
    name: "Cappucino",
    hex: "#9B7B5A",
    img: "assets/06-Blackout/BLACKOUT-zblizenie-inwazyjne-CAPPUCINO-300x500.png",
  },
  {
    id: "czarny",
    name: "Czarny",
    hex: "#1A1A1A",
    img: "assets/06-Blackout/BLACKOUT-zblizenie-inwazyjne-CZARNY-300x500.png",
  },
  {
    id: "piasek",
    name: "Piasek",
    hex: "#D4C4A8",
    img: "assets/06-Blackout/BLACKOUT-zblizenie-inwazyjne-PIASEK-300x500.png",
  },
];

const HONEYCOMB_COLORS: readonly Color[] = [
  {
    id: "zimny-bez",
    name: "Zimny beż",
    hex: "#D5CCBC",
    img: "assets/07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-ZIMNY-BEZ-1-300x500.png",
  },
  {
    id: "cieply-bez",
    name: "Ciepły beż",
    hex: "#CCBFA6",
    img: "assets/07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-ZIMNY-BEZ-300x500.png",
  },
  {
    id: "biel",
    name: "Biel",
    hex: "#F0EDEA",
    img: "assets/07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-BIEL-300x500.png",
  },
  {
    id: "antracyt",
    name: "Antracyt",
    hex: "#3A3A3A",
    img: "assets/07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-ANTRACYT-300x500.png",
  },
  {
    id: "szary",
    name: "Szary",
    hex: "#808080",
    img: "assets/07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-GRAFIT-300x500.png",
  },
  {
    id: "cappucino",
    name: "Cappucino",
    hex: "#9B7B5A",
    img: "assets/07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-CAPPUCINO-300x500.png",
  },
];

/** Map fabric ID → color palette. Termo variants inherit from base fabric. */
const COLOR_MAP: Record<string, readonly Color[]> = {
  standard: STANDARD_COLORS,
  standard_termo: STANDARD_COLORS,
  melange: MELANGE_COLORS,
  melange_termo: MELANGE_TERMO_COLORS,
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
