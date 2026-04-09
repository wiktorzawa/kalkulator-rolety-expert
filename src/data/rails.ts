import type { RailColor } from "./types";

const R = "assets/22-Listwy-Aluminiowe";

export const RAIL_COLORS: readonly RailColor[] = [
  {
    id: "bialy",
    name: "Biały",
    type: "lakier",
    hex: "#FFFFFF",
    surcharge: 0,
    img: `${R}/biel.jpg`,
  },
  {
    id: "krem",
    name: "Krem",
    type: "lakier",
    hex: "#F0E6D0",
    surcharge: 0,
    img: `${R}/krem.webp`,
  },
  {
    id: "braz",
    name: "Brąz",
    type: "lakier",
    hex: "#5C3A1E",
    surcharge: 0,
    img: `${R}/braz.jpg`,
  },
  {
    id: "antracyt",
    name: "Antracyt",
    type: "lakier",
    hex: "#3A3A3A",
    surcharge: 0,
    img: `${R}/antracyt.jpg`,
  },
  {
    id: "czarny",
    name: "Czarny",
    type: "lakier",
    hex: "#1A1A1A",
    surcharge: 0,
    img: `${R}/czarny-lakier.webp`,
  },
  {
    id: "srebrny",
    name: "Srebrny",
    type: "anodowany",
    hex: "#C0C0C0",
    surcharge: 4.75,
    img: `${R}/srebrny.jpg`,
  },
  {
    id: "szampanski",
    name: "Szampański",
    type: "anodowany",
    hex: "#D4C5A9",
    surcharge: 4.75,
    img: `${R}/szampanski-1.jpg`,
  },
  {
    id: "zloty-dab",
    name: "Złoty dąb",
    type: "okleina",
    hex: "#B8863B",
    surcharge: 9.5,
    img: `${R}/zloty-dab.jpg`,
  },
  {
    id: "orzech",
    name: "Orzech",
    type: "okleina",
    hex: "#6B4226",
    surcharge: 9.5,
    img: `${R}/orzech.jpg`,
  },
  {
    id: "dab-bagienny",
    name: "Dąb bagienny",
    type: "okleina",
    hex: "#4A3828",
    surcharge: 9.5,
    img: `${R}/dab-bagienny-1.jpg`,
  },
  {
    id: "mahon",
    name: "Mahoń",
    type: "okleina",
    hex: "#7A2E1A",
    surcharge: 9.5,
    img: `${R}/mahon-1.jpg`,
  },
  {
    id: "turner-oak",
    name: "Turner Oak",
    type: "okleina",
    hex: "#A08060",
    surcharge: 9.5,
    img: `${R}/turner-oak.webp`,
  },
  {
    id: "sosna",
    name: "Sosna",
    type: "okleina",
    hex: "#C4A87A",
    surcharge: 9.5,
    img: `${R}/sosna-1.jpg`,
  },
  {
    id: "winchester",
    name: "Winchester",
    type: "okleina",
    hex: "#8B5A2B",
    surcharge: 9.5,
    img: `${R}/winchester-1.jpg`,
  },
];

export function getRailById(railId: string): RailColor | undefined {
  return RAIL_COLORS.find((r) => r.id === railId);
}
