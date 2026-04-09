import type { MountingSystem } from "./types";

export const MOUNTING_SYSTEMS: readonly MountingSystem[] = [
  { id: "wzmocniony", name: "Wzmocniony (skręcany)", type: "bezinwazyjny" },
  { id: "klejony", name: "Klejony", type: "bezinwazyjny" },
  { id: "standard", name: "Standard", type: "inwazyjny" },
  { id: "regulowany", name: "Regulowany", type: "inwazyjny" },
  { id: "katowy", name: "Kątowy", type: "inwazyjny" },
];

export function getMountingById(
  mountingId: string,
): MountingSystem | undefined {
  return MOUNTING_SYSTEMS.find((m) => m.id === mountingId);
}
