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
import { calculatePrice } from "@/utils/pricing";

import {
  type WizardState,
  type WizardAction,
  INITIAL_STATE,
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
      return state.colorId !== null;
    case 3:
      return state.mountingId !== null;
    case 4:
      return state.widthMm >= MIN_WIDTH_MM && state.heightMm >= MIN_HEIGHT_MM;
    case 5:
      return state.railId !== null;
    default:
      return false;
  }
}

export function wizardReducer(
  state: WizardState,
  action: WizardAction,
): WizardState {
  switch (action.type) {
    case "SELECT_FABRIC":
      return {
        ...state,
        fabricId: action.fabricId,
        colorId: null,
        step: Math.max(state.step, 2),
      };

    case "SELECT_COLOR":
      return {
        ...state,
        colorId: action.colorId,
        step: Math.max(state.step, 3),
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
        step: Math.max(state.step, 4),
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

    case "SELECT_RAIL":
      return {
        ...state,
        railId: action.railId,
        step: Math.max(state.step, 5),
      };

    case "GO_TO_STEP": {
      if (action.step < 1 || action.step > 5) return state;
      // Can only go to a step if all previous steps are complete
      for (let i = 1; i < action.step; i++) {
        if (!isStepComplete(state, i)) return state;
      }
      return { ...state, step: action.step };
    }

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
