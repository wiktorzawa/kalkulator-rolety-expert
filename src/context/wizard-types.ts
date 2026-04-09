import type { MountingCategory } from "@/data/types";

export const STEP_LABELS = [
  "Tkanina",
  "Kolor",
  "Montaż",
  "Wymiary",
  "Listwa",
] as const;

export const TOTAL_STEPS = STEP_LABELS.length;

export const MIN_WIDTH_MM = 150;
export const MAX_WIDTH_MM = 1950;
export const MIN_HEIGHT_MM = 150;
export const MAX_HEIGHT_MM = 2800;
export const DEFAULT_WIDTH_MM = 600;
export const DEFAULT_HEIGHT_MM = 1500;

export interface WizardState {
  readonly step: number;
  readonly fabricId: string | null;
  readonly colorId: string | null;
  readonly mountingId: string | null;
  readonly mountingType: MountingCategory | null;
  readonly widthMm: number;
  readonly heightMm: number;
  readonly railId: string | null;
}

export type WizardAction =
  | { readonly type: "SELECT_FABRIC"; readonly fabricId: string }
  | { readonly type: "SELECT_COLOR"; readonly colorId: string }
  | {
      readonly type: "SELECT_MOUNTING";
      readonly mountingId: string;
      readonly mountingType: MountingCategory;
    }
  | {
      readonly type: "SET_DIMENSIONS";
      readonly widthMm: number;
      readonly heightMm: number;
    }
  | { readonly type: "SELECT_RAIL"; readonly railId: string }
  | { readonly type: "GO_TO_STEP"; readonly step: number };

export const INITIAL_STATE: WizardState = {
  step: 1,
  fabricId: null,
  colorId: null,
  mountingId: null,
  mountingType: null,
  widthMm: DEFAULT_WIDTH_MM,
  heightMm: DEFAULT_HEIGHT_MM,
  railId: null,
};
