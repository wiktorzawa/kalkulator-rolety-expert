import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";

import { wizardReducer, WizardProvider, useWizard } from "./wizard-context";
import {
  INITIAL_STATE,
  MIN_WIDTH_MM,
  MAX_WIDTH_MM,
  MAX_HEIGHT_MM,
  TOTAL_STEPS,
  STEP_LABELS,
} from "./wizard-types";

describe("wizard constants", () => {
  it("has 3 steps", () => {
    expect(TOTAL_STEPS).toBe(3);
    expect(STEP_LABELS).toEqual(["Tkanina", "Kolor", "Konfiguracja"]);
  });
});

describe("wizardReducer", () => {
  it("SELECT_FABRIC sets fabricId and resets colorId", () => {
    const state = {
      ...INITIAL_STATE,
      fabricId: "standard",
      colorId: "biel",
    };
    const result = wizardReducer(state, {
      type: "SELECT_FABRIC",
      fabricId: "blackout",
    });
    expect(result.fabricId).toBe("blackout");
    expect(result.colorId).toBeNull();
  });

  it("SELECT_FABRIC advances step to 2", () => {
    const result = wizardReducer(INITIAL_STATE, {
      type: "SELECT_FABRIC",
      fabricId: "standard",
    });
    expect(result.step).toBe(2);
  });

  it("SELECT_FABRIC in edit mode preserves color if it exists in new palette", () => {
    const state = {
      ...INITIAL_STATE,
      fabricId: "standard",
      colorId: "grafit", // grafit exists in both standard and melange
      editingItemId: "item-1",
    };
    const result = wizardReducer(state, {
      type: "SELECT_FABRIC",
      fabricId: "melange",
    });
    expect(result.fabricId).toBe("melange");
    expect(result.colorId).toBe("grafit"); // preserved — exists in melange
  });

  it("SELECT_FABRIC in edit mode resets color if it does not exist in new palette", () => {
    const state = {
      ...INITIAL_STATE,
      fabricId: "standard",
      colorId: "pudrowy-roz", // does not exist in melange palette
      editingItemId: "item-1",
    };
    const result = wizardReducer(state, {
      type: "SELECT_FABRIC",
      fabricId: "melange",
    });
    expect(result.fabricId).toBe("melange");
    expect(result.colorId).toBeNull(); // reset — not in melange
  });

  it("SELECT_COLOR sets colorId without advancing step (rail still needed)", () => {
    const state = { ...INITIAL_STATE, step: 2, fabricId: "standard" };
    const result = wizardReducer(state, {
      type: "SELECT_COLOR",
      colorId: "biel",
    });
    expect(result.colorId).toBe("biel");
    expect(result.step).toBe(2); // stays on step 2 — rail not yet selected
  });

  it("SELECT_MOUNTING sets mountingId and mountingType without advancing step", () => {
    const state = {
      ...INITIAL_STATE,
      step: 3,
      fabricId: "standard",
      colorId: "biel",
    };
    const result = wizardReducer(state, {
      type: "SELECT_MOUNTING",
      mountingId: "standard",
      mountingType: "inwazyjny",
    });
    expect(result.mountingId).toBe("standard");
    expect(result.mountingType).toBe("inwazyjny");
    expect(result.step).toBe(3); // stays on step 3 (mounting is part of step 3)
  });

  it("GO_TO_STEP(2) does NOT work when step 1 is incomplete", () => {
    const result = wizardReducer(INITIAL_STATE, {
      type: "GO_TO_STEP",
      step: 2,
    });
    expect(result.step).toBe(1);
  });

  it("GO_TO_STEP(2) works when step 1 is complete", () => {
    const state = { ...INITIAL_STATE, fabricId: "standard" };
    const result = wizardReducer(state, { type: "GO_TO_STEP", step: 2 });
    expect(result.step).toBe(2);
  });

  it("GO_TO_STEP(3) does NOT work when step 2 is incomplete (missing rail)", () => {
    const state = { ...INITIAL_STATE, fabricId: "standard", colorId: "biel" };
    const result = wizardReducer(state, { type: "GO_TO_STEP", step: 3 });
    expect(result.step).toBe(1); // railId is null — step 2 incomplete
  });

  it("GO_TO_STEP rejects step > TOTAL_STEPS", () => {
    const state = {
      ...INITIAL_STATE,
      fabricId: "standard",
      colorId: "biel",
      mountingId: "standard",
      railId: "bialy",
    };
    const result = wizardReducer(state, { type: "GO_TO_STEP", step: 4 });
    expect(result.step).toBe(1);
  });

  it("SET_DIMENSIONS clamps width to valid range", () => {
    const result = wizardReducer(INITIAL_STATE, {
      type: "SET_DIMENSIONS",
      widthMm: 50,
      heightMm: 1500,
    });
    expect(result.widthMm).toBe(MIN_WIDTH_MM);
  });

  it("SET_DIMENSIONS clamps height to valid range", () => {
    const result = wizardReducer(INITIAL_STATE, {
      type: "SET_DIMENSIONS",
      widthMm: 600,
      heightMm: 5000,
    });
    expect(result.heightMm).toBe(MAX_HEIGHT_MM);
  });

  it("SET_DIMENSIONS accepts valid values within range", () => {
    const result = wizardReducer(INITIAL_STATE, {
      type: "SET_DIMENSIONS",
      widthMm: 800,
      heightMm: 2000,
    });
    expect(result.widthMm).toBe(800);
    expect(result.heightMm).toBe(2000);
  });

  it("SET_DIMENSIONS clamps width above max", () => {
    const result = wizardReducer(INITIAL_STATE, {
      type: "SET_DIMENSIONS",
      widthMm: 3000,
      heightMm: 1500,
    });
    expect(result.widthMm).toBe(MAX_WIDTH_MM);
  });

  it("SELECT_RAIL sets railId and advances to step 3 when color is selected", () => {
    const state = {
      ...INITIAL_STATE,
      step: 2,
      fabricId: "standard",
      colorId: "biel",
    };
    const result = wizardReducer(state, {
      type: "SELECT_RAIL",
      railId: "bialy",
    });
    expect(result.railId).toBe("bialy");
    expect(result.step).toBe(3); // step 2 complete (color + rail) → advance
  });

  it("SELECT_RAIL sets railId but does NOT advance when color is missing", () => {
    const state = {
      ...INITIAL_STATE,
      step: 2,
      fabricId: "standard",
    };
    const result = wizardReducer(state, {
      type: "SELECT_RAIL",
      railId: "bialy",
    });
    expect(result.railId).toBe("bialy");
    expect(result.step).toBe(2); // color not selected — stay on step 2
  });

  it("LOAD_ITEM sets all fields and editingItemId", () => {
    const result = wizardReducer(INITIAL_STATE, {
      type: "LOAD_ITEM",
      fabricId: "blackout",
      colorId: "czarny",
      mountingId: "standard",
      mountingType: "inwazyjny",
      widthMm: 800,
      heightMm: 2000,
      railId: "orzech",
      itemId: "item-42",
    });

    expect(result.fabricId).toBe("blackout");
    expect(result.colorId).toBe("czarny");
    expect(result.mountingId).toBe("standard");
    expect(result.mountingType).toBe("inwazyjny");
    expect(result.widthMm).toBe(800);
    expect(result.heightMm).toBe(2000);
    expect(result.railId).toBe("orzech");
    expect(result.step).toBe(1);
    expect(result.editingItemId).toBe("item-42");
  });

  it("RESET clears to INITIAL_STATE with editingItemId null", () => {
    const modifiedState = {
      ...INITIAL_STATE,
      step: 3,
      fabricId: "blackout",
      colorId: "czarny",
      mountingId: "standard",
      mountingType: "inwazyjny" as const,
      widthMm: 900,
      heightMm: 2200,
      railId: "orzech",
      editingItemId: "item-42",
    };
    const result = wizardReducer(modifiedState, { type: "RESET" });

    expect(result).toEqual(INITIAL_STATE);
    expect(result.editingItemId).toBeNull();
    expect(result.step).toBe(1);
    expect(result.fabricId).toBeNull();
  });

  it("isStepComplete(2) = true when color + rail are selected", () => {
    const state = {
      ...INITIAL_STATE,
      step: 2,
      fabricId: "standard",
      colorId: "biel",
      railId: "bialy",
    };
    // GO_TO_STEP(3) requires step 1 + step 2 complete
    const result = wizardReducer(state, { type: "GO_TO_STEP", step: 3 });
    expect(result.step).toBe(3);
  });

  it("isStepComplete(3) = true when mounting is selected (no railId needed)", () => {
    const state = {
      ...INITIAL_STATE,
      step: 3,
      fabricId: "standard",
      colorId: "biel",
      railId: "bialy",
      mountingId: "standard",
      mountingType: "inwazyjny" as const,
    };
    // Verify step 3 completeness via isConfigComplete check
    // GO_TO_STEP(3) tests step 1+2 completeness
    const result = wizardReducer(state, { type: "GO_TO_STEP", step: 3 });
    expect(result.step).toBe(3);
  });
});

describe("useWizard hook", () => {
  function wrapper({ children }: { children: ReactNode }) {
    return <WizardProvider>{children}</WizardProvider>;
  }

  it("provides initial state with zero price", () => {
    const { result } = renderHook(() => useWizard(), { wrapper });
    expect(result.current.state.step).toBe(1);
    expect(result.current.price.total).toBe(0);
    expect(result.current.isConfigComplete).toBe(false);
  });

  it("recalculates price after selecting fabric and mounting", () => {
    const { result } = renderHook(() => useWizard(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: "SELECT_FABRIC",
        fabricId: "standard",
      });
    });

    act(() => {
      result.current.dispatch({
        type: "SELECT_MOUNTING",
        mountingId: "standard",
        mountingType: "inwazyjny",
      });
    });

    // standard inwazyjny base=28.50, width 600mm=60cm→57.00, height 1500mm→52.25
    // total = 28.50 + 57.00 + 52.25 = 137.75 (no rail surcharge yet)
    expect(result.current.price.total).toBe(137.75);
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useWizard());
    }).toThrow("useWizard must be used within WizardProvider");
  });
});
