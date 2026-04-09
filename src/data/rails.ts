import type { RailColor } from "./types";

export const RAIL_COLORS: readonly RailColor[] = [
  { id: "bialy", name: "Biały", type: "lakier", hex: "#FFFFFF", surcharge: 0 },
  { id: "krem", name: "Krem", type: "lakier", hex: "#F0E6D0", surcharge: 0 },
  { id: "braz", name: "Brąz", type: "lakier", hex: "#5C3A1E", surcharge: 0 },
  {
    id: "antracyt",
    name: "Antracyt",
    type: "lakier",
    hex: "#3A3A3A",
    surcharge: 0,
  },
  {
    id: "czarny",
    name: "Czarny",
    type: "lakier",
    hex: "#1A1A1A",
    surcharge: 0,
  },
  {
    id: "srebrny",
    name: "Srebrny",
    type: "anodowany",
    hex: "#C0C0C0",
    surcharge: 4.75,
  },
  {
    id: "szampanski",
    name: "Szampański",
    type: "anodowany",
    hex: "#D4C5A9",
    surcharge: 4.75,
  },
  {
    id: "zloty-dab",
    name: "Złoty dąb",
    type: "okleina",
    hex: "#B8863B",
    surcharge: 9.5,
  },
  {
    id: "orzech",
    name: "Orzech",
    type: "okleina",
    hex: "#6B4226",
    surcharge: 9.5,
  },
  {
    id: "dab-bagienny",
    name: "Dąb bagienny",
    type: "okleina",
    hex: "#4A3828",
    surcharge: 9.5,
  },
  {
    id: "mahon",
    name: "Mahoń",
    type: "okleina",
    hex: "#7A2E1A",
    surcharge: 9.5,
  },
  {
    id: "turner-oak",
    name: "Turner Oak",
    type: "okleina",
    hex: "#A08060",
    surcharge: 9.5,
  },
  {
    id: "sosna",
    name: "Sosna",
    type: "okleina",
    hex: "#C4A87A",
    surcharge: 9.5,
  },
  {
    id: "winchester",
    name: "Winchester",
    type: "okleina",
    hex: "#8B5A2B",
    surcharge: 9.5,
  },
];

export function getRailById(railId: string): RailColor | undefined {
  return RAIL_COLORS.find((r) => r.id === railId);
}
