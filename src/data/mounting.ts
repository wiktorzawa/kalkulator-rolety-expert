import type { MountingSystem } from "./types";
import { getMountingImagePath } from "./images";

export const MOUNTING_SYSTEMS: readonly MountingSystem[] = [
  {
    id: "wzmocniony",
    name: "Wzmocniony (skręcany)",
    type: "bezinwazyjny",
    desc: "Montaż klipsowy na ramę okienną bez wiercenia w skrzydło. Max szerokość: 1950 mm.",
    img: getMountingImagePath("bezinwazyjny-wzmocniony", "opis"),
    measureImg: getMountingImagePath("bezinwazyjny-wzmocniony", "pomiar"),
  },
  {
    id: "klejony",
    name: "Klejony",
    type: "bezinwazyjny",
    desc: "Montaż klejony na ramę. Ograniczenie: max szerokość 1200 mm.",
    img: getMountingImagePath("bezinwazyjny-klejony", "opis"),
    measureImg: getMountingImagePath("bezinwazyjny-klejony", "pomiar"),
  },
  {
    id: "standard",
    name: "Standard",
    type: "inwazyjny",
    desc: "Podstawowy montaż wkręcany, wymaga min. 13 mm głębokości ramy.",
    img: getMountingImagePath("inwazyjny-standard", "opis"),
    measureImg: getMountingImagePath("inwazyjny-standard", "pomiar"),
  },
  {
    id: "regulowany",
    name: "Regulowany",
    type: "inwazyjny",
    desc: "Z możliwością regulacji pozycji, dla zaokrąglonych profili ram.",
    img: getMountingImagePath("inwazyjny-regulowany", "opis"),
    measureImg: getMountingImagePath("inwazyjny-regulowany", "pomiar"),
  },
  {
    id: "katowy",
    name: "Kątowy",
    type: "inwazyjny",
    desc: "Montaż dla kątowych profili ram okiennych.",
    img: getMountingImagePath("inwazyjny-katowy", "opis"),
    measureImg: getMountingImagePath("inwazyjny-katowy", "pomiar"),
  },
];

export function getMountingById(
  mountingId: string,
): MountingSystem | undefined {
  return MOUNTING_SYSTEMS.find((m) => m.id === mountingId);
}
