import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";

import type { PriceBreakdown } from "@/data/types";
import { MAX_WIDTH_GLUED } from "@/data/pricing";
import { getMountingById } from "@/data/mounting";
import { getColorsForFabric } from "@/data/fabrics";
import { calculatePrice } from "@/utils/pricing";

import {
  type WizardState,
  type WizardAction,
  INITIAL_STATE,
  TOTAL_STEPS,
  MIN_WIDTH_MM,
  MAX_WIDTH_MM,
  MIN_HEIGHT_MM,
  MAX_HEIGHT_MM,
} from "./wizard-types";

function isStepComplete(state: WizardState, step: number): boolean {
  switch (step) {
    case 1:
      return state.fabricId !== null;
    case 2:
      return state.colorId !== null && state.railId !== null;
    case 3:
      return (
        state.mountingId !== null &&
        state.widthMm >= MIN_WIDTH_MM &&
        state.heightMm >= MIN_HEIGHT_MM
      );
    default:
      return false;
  }
}

export function wizardReducer(
  state: WizardState,
  action: WizardAction,
): WizardState {
  switch (action.type) {
    case "SELECT_FABRIC": {
      // R33: in edit mode, preserve color if it exists in the new fabric's palette
      let newColorId: string | null = null;
      if (state.editingItemId !== null && state.colorId !== null) {
        const newColors = getColorsForFabric(action.fabricId);
        const colorExists = newColors.some((c) => c.id === state.colorId);
        if (colorExists) {
          newColorId = state.colorId;
        }
      }

      return {
        ...state,
        fabricId: action.fabricId,
        colorId: newColorId,
        step: Math.max(state.step, 2),
      };
    }

    case "SELECT_COLOR":
      return {
        ...state,
        colorId: action.colorId,
      };

    case "SELECT_MOUNTING": {
      const mounting = getMountingById(action.mountingId);
      if (!mounting) return state;

      let { widthMm } = state;
      if (
        mounting.type === "bezinwazyjny" &&
        mounting.id === "klejony" &&
        widthMm > MAX_WIDTH_GLUED
      ) {
        widthMm = MAX_WIDTH_GLUED;
      }

      return {
        ...state,
        mountingId: action.mountingId,
        mountingType: action.mountingType,
        widthMm,
      };
    }

    case "SET_DIMENSIONS": {
      const widthMm = Math.max(
        MIN_WIDTH_MM,
        Math.min(MAX_WIDTH_MM, action.widthMm),
      );
      const heightMm = Math.max(
        MIN_HEIGHT_MM,
        Math.min(MAX_HEIGHT_MM, action.heightMm),
      );
      return { ...state, widthMm, heightMm };
    }

    case "SELECT_RAIL": {
      const newState = { ...state, railId: action.railId };
      // Advance to step 3 when step 2 is complete (color + rail selected)
      if (newState.colorId !== null) {
        newState.step = Math.max(newState.step, 3);
      }
      return newState;
    }

    case "GO_TO_STEP": {
      if (action.step < 1 || action.step > TOTAL_STEPS) return state;
      for (let i = 1; i < action.step; i++) {
        if (!isStepComplete(state, i)) return state;
      }
      return { ...state, step: action.step };
    }

    case "LOAD_ITEM":
      return {
        ...state,
        fabricId: action.fabricId,
        colorId: action.colorId,
        mountingId: action.mountingId,
        mountingType: action.mountingType,
        widthMm: action.widthMm,
        heightMm: action.heightMm,
        railId: action.railId,
        step: 1,
        editingItemId: action.itemId,
      };

    case "RESET":
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

interface WizardContextValue {
  readonly state: WizardState;
  readonly dispatch: React.Dispatch<WizardAction>;
  readonly price: PriceBreakdown;
  readonly isConfigComplete: boolean;
}

const WizardContext = createContext<WizardContextValue | null>(null);

interface WizardProviderProps {
  readonly children: ReactNode;
}

export function WizardProvider({ children }: WizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, INITIAL_STATE);

  const price = useMemo(
    () =>
      calculatePrice({
        fabricId: state.fabricId,
        mountingType: state.mountingType,
        widthMm: state.widthMm,
        heightMm: state.heightMm,
        railId: state.railId,
      }),
    [
      state.fabricId,
      state.mountingType,
      state.widthMm,
      state.heightMm,
      state.railId,
    ],
  );

  const isConfigComplete =
    state.fabricId !== null &&
    state.colorId !== null &&
    state.mountingId !== null &&
    state.railId !== null &&
    state.widthMm >= MIN_WIDTH_MM &&
    state.heightMm >= MIN_HEIGHT_MM;

  const value = useMemo(
    () => ({ state, dispatch, price, isConfigComplete }),
    [state, price, isConfigComplete],
  );

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within WizardProvider");
  }
  return context;
}
