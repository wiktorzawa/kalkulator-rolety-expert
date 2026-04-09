import type { MountingSystem } from "./types";

export const MOUNTING_SYSTEMS: readonly MountingSystem[] = [
  {
    id: "wzmocniony",
    name: "Wzmocniony (skręcany)",
    type: "bezinwazyjny",
    desc: "Montaż klipsowy na ramę okienną bez wiercenia w skrzydło. Max szerokość: 1950 mm.",
    img: "assets/18-Profile-Aluminiowe-Przekroje/Plisy-montaz-bezinwazyjny-wzmocniony-opis-NOWE.png",
    measureImg:
      "assets/18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-bezinwazyjny-wzmocniony-nowa.png",
  },
  {
    id: "klejony",
    name: "Klejony",
    type: "bezinwazyjny",
    desc: "Montaż klejony na ramę. Ograniczenie: max szerokość 1200 mm.",
    img: "assets/18-Profile-Aluminiowe-Przekroje/Plisy-montaz-bezinwazyjny-klejony-opis-NOWE.png",
    measureImg:
      "assets/18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-bezinwazyjny-klejony-nowa.png",
  },
  {
    id: "standard",
    name: "Standard",
    type: "inwazyjny",
    desc: "Podstawowy montaż wkręcany, wymaga min. 13 mm głębokości ramy.",
    img: "assets/18-Profile-Aluminiowe-Przekroje/Plisy-montaz-inwazyjny-standard-opis-NOWE.png",
    measureImg:
      "assets/18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-inwazyjny-standard-nowa-1.png",
  },
  {
    id: "regulowany",
    name: "Regulowany",
    type: "inwazyjny",
    desc: "Z możliwością regulacji pozycji, dla zaokrąglonych profili ram.",
    img: "assets/18-Profile-Aluminiowe-Przekroje/Plisy-montaz-inwazyjny-regulowany-opis-NOWE.png",
    measureImg:
      "assets/18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-inwazyjny-regulowany-nowa-1.png",
  },
  {
    id: "katowy",
    name: "Kątowy",
    type: "inwazyjny",
    desc: "Montaż dla kątowych profili ram okiennych.",
    img: "assets/18-Profile-Aluminiowe-Przekroje/Plisy-montaz-inwazyjny-katowy-opis-NOWE.png",
    measureImg:
      "assets/18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-inwazyjny-katowy-nowa-1.png",
  },
];

export function getMountingById(
  mountingId: string,
): MountingSystem | undefined {
  return MOUNTING_SYSTEMS.find((m) => m.id === mountingId);
}
