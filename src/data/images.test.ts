import { describe, expect, it } from "vitest";
import {
  getPackshotPath,
  getFabricSwatchPath,
  getMountingImagePath,
  getMountingCloseupPaths,
  getRailImagePath,
  fabricIdToCollection,
  getBaseCollection,
} from "./images";

describe("getPackshotPath", () => {
  it("zwraca ścieżkę do packshot inwazyjnego", () => {
    expect(getPackshotPath("standard", "biel", false)).toBe(
      "assets/produkty/standard/biel/packshot.png",
    );
  });

  it("zwraca ścieżkę do packshot bezinwazyjnego", () => {
    expect(getPackshotPath("standard", "biel", true)).toBe(
      "assets/produkty/standard/biel/packshot-bezinwazyjny.png",
    );
  });

  it("działa dla kolekcji termo", () => {
    expect(getPackshotPath("standard-termo", "krem", false)).toBe(
      "assets/produkty/standard-termo/krem/packshot.png",
    );
  });

  it("działa dla honeycomb", () => {
    expect(getPackshotPath("honeycomb", "biel", true)).toBe(
      "assets/produkty/honeycomb/biel/packshot-bezinwazyjny.png",
    );
  });
});

describe("getFabricSwatchPath", () => {
  it("zwraca tkanina.jpg dla standard", () => {
    expect(getFabricSwatchPath("standard", "biel")).toBe(
      "assets/produkty/standard/biel/tkanina.jpg",
    );
  });

  it("zwraca tkanina.jpg dla standard-termo", () => {
    expect(getFabricSwatchPath("standard-termo", "krem")).toBe(
      "assets/produkty/standard-termo/krem/tkanina.jpg",
    );
  });

  it("zwraca tkanina.jpg dla melange", () => {
    expect(getFabricSwatchPath("melange", "denim")).toBe(
      "assets/produkty/melange/denim/tkanina.jpg",
    );
  });

  it("zwraca tkanina.jpg dla dolomit", () => {
    expect(getFabricSwatchPath("dolomit", "szary")).toBe(
      "assets/produkty/dolomit/szary/tkanina.jpg",
    );
  });

  it("zwraca zblizenie.png dla honeycomb (standardowy)", () => {
    expect(getFabricSwatchPath("honeycomb", "biel")).toBe(
      "assets/produkty/honeycomb/biel/zblizenie.png",
    );
  });

  it("zwraca zblizenie.webp dla honeycomb/antracyt (override)", () => {
    expect(getFabricSwatchPath("honeycomb", "antracyt")).toBe(
      "assets/produkty/honeycomb/antracyt/zblizenie.webp",
    );
  });

  it("zwraca zblizenie-2.webp dla honeycomb/zimny-bez (override)", () => {
    expect(getFabricSwatchPath("honeycomb", "zimny-bez")).toBe(
      "assets/produkty/honeycomb/zimny-bez/zblizenie-2.webp",
    );
  });

  it("zwraca zblizenie.png dla blackout", () => {
    expect(getFabricSwatchPath("blackout", "biel")).toBe(
      "assets/produkty/blackout/biel/zblizenie.png",
    );
  });
});

describe("getMountingImagePath", () => {
  it("zwraca ścieżkę do opis.png", () => {
    expect(getMountingImagePath("bezinwazyjny-wzmocniony", "opis")).toBe(
      "assets/montaz/bezinwazyjny-wzmocniony/opis.png",
    );
  });

  it("zwraca ścieżkę do pomiar.png", () => {
    expect(getMountingImagePath("inwazyjny-standard", "pomiar")).toBe(
      "assets/montaz/inwazyjny-standard/pomiar.png",
    );
  });

  it("zwraca ścieżkę do grafika-pomiarowa.png", () => {
    expect(
      getMountingImagePath("bezinwazyjny-wzmocniony", "grafika-pomiarowa"),
    ).toBe("assets/montaz/bezinwazyjny-wzmocniony/grafika-pomiarowa.png");
  });
});

describe("getMountingCloseupPaths", () => {
  it("zwraca zblizenie-1.png i zblizenie-2.png dla bezinwazyjny-wzmocniony", () => {
    expect(getMountingCloseupPaths("bezinwazyjny-wzmocniony")).toEqual([
      "assets/montaz/bezinwazyjny-wzmocniony/zblizenie-1.png",
      "assets/montaz/bezinwazyjny-wzmocniony/zblizenie-2.png",
    ]);
  });

  it("zwraca zblizenie-dol.webp i zblizenie-gora.webp dla bezinwazyjny-klejony", () => {
    expect(getMountingCloseupPaths("bezinwazyjny-klejony")).toEqual([
      "assets/montaz/bezinwazyjny-klejony/zblizenie-dol.webp",
      "assets/montaz/bezinwazyjny-klejony/zblizenie-gora.webp",
    ]);
  });

  it("zwraca zblizenie-dol.webp i zblizenie-gora.webp dla inwazyjny-standard", () => {
    expect(getMountingCloseupPaths("inwazyjny-standard")).toEqual([
      "assets/montaz/inwazyjny-standard/zblizenie-dol.webp",
      "assets/montaz/inwazyjny-standard/zblizenie-gora.webp",
    ]);
  });

  it("zwraca pustą tablicę dla nieznanego systemId", () => {
    expect(getMountingCloseupPaths("nieznany-system")).toEqual([]);
  });
});

describe("getRailImagePath", () => {
  it("zwraca .jpg dla biel", () => {
    expect(getRailImagePath("biel")).toBe("assets/prowadnice/biel.jpg");
  });

  it("zwraca .webp dla krem", () => {
    expect(getRailImagePath("krem")).toBe("assets/prowadnice/krem.webp");
  });

  it("zwraca .webp dla czarny-lakier", () => {
    expect(getRailImagePath("czarny-lakier")).toBe(
      "assets/prowadnice/czarny-lakier.webp",
    );
  });

  it("zwraca .webp dla turner-oak", () => {
    expect(getRailImagePath("turner-oak")).toBe(
      "assets/prowadnice/turner-oak.webp",
    );
  });

  it("zwraca .jpg jako domyślne rozszerzenie", () => {
    expect(getRailImagePath("srebrny")).toBe("assets/prowadnice/srebrny.jpg");
  });
});

describe("fabricIdToCollection", () => {
  it("zamienia podkreślenie na myślnik", () => {
    expect(fabricIdToCollection("standard_termo")).toBe("standard-termo");
  });

  it("nie zmienia nazw bez podkreśleń", () => {
    expect(fabricIdToCollection("standard")).toBe("standard");
  });

  it("zamienia melange_termo", () => {
    expect(fabricIdToCollection("melange_termo")).toBe("melange-termo");
  });

  it("zamienia dolomit_termo", () => {
    expect(fabricIdToCollection("dolomit_termo")).toBe("dolomit-termo");
  });
});

describe("getBaseCollection", () => {
  it("zwraca bazową kolekcję dla standard-termo", () => {
    expect(getBaseCollection("standard-termo")).toBe("standard");
  });

  it("zwraca bazową kolekcję dla melange-termo", () => {
    expect(getBaseCollection("melange-termo")).toBe("melange");
  });

  it("nie zmienia kolekcji bez -termo", () => {
    expect(getBaseCollection("standard")).toBe("standard");
  });

  it("nie zmienia blackout", () => {
    expect(getBaseCollection("blackout")).toBe("blackout");
  });
});
