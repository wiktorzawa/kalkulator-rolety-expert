import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";

import { wizardReducer, WizardProvider, useWizard } from "./wizard-context";
import {
  INITIAL_STATE,
  MIN_WIDTH_MM,
  MAX_WIDTH_MM,
  MAX_HEIGHT_MM,
} from "./wizard-types";

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

  it("SELECT_COLOR sets colorId and advances step", () => {
    const state = { ...INITIAL_STATE, step: 2, fabricId: "standard" };
    const result = wizardReducer(state, {
      type: "SELECT_COLOR",
      colorId: "biel",
    });
    expect(result.colorId).toBe("biel");
    expect(result.step).toBe(3);
  });

  it("SELECT_MOUNTING sets mountingId and mountingType", () => {
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
    expect(result.step).toBe(4);
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

  it("GO_TO_STEP(3) does NOT work when step 2 is incomplete", () => {
    const state = { ...INITIAL_STATE, fabricId: "standard" };
    const result = wizardReducer(state, { type: "GO_TO_STEP", step: 3 });
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

  it("SELECT_RAIL sets railId", () => {
    const state = {
      ...INITIAL_STATE,
      step: 4,
      fabricId: "standard",
      colorId: "biel",
      mountingId: "standard",
      mountingType: "inwazyjny" as const,
    };
    const result = wizardReducer(state, {
      type: "SELECT_RAIL",
      railId: "bialy",
    });
    expect(result.railId).toBe("bialy");
    expect(result.step).toBe(5);
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
