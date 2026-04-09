export type MountingCategory = "bezinwazyjny" | "inwazyjny";

export type RailFinish = "lakier" | "anodowany" | "okleina";

export type HeightTier = 150 | 230 | 280;

export interface FabricBase {
  readonly bezinwazyjny: number;
  readonly inwazyjny: number;
}

export interface Fabric {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly img: string;
  readonly darkening: number;
  readonly thermo: number;
  readonly base: FabricBase;
}

export interface Color {
  readonly id: string;
  readonly name: string;
  readonly hex: string;
  readonly img?: string;
}

export interface MountingSystem {
  readonly id: string;
  readonly name: string;
  readonly type: MountingCategory;
}

export interface RailColor {
  readonly id: string;
  readonly name: string;
  readonly type: RailFinish;
  readonly hex: string;
  readonly surcharge: number;
}

export type WidthPriceEntry = readonly [cm: number, price: number];
export type HeightPriceEntry = readonly [maxCm: number, price: number];

export interface PriceBreakdown {
  readonly basePrice: number;
  readonly widthPrice: number;
  readonly heightPrice: number;
  readonly railSurcharge: number;
  readonly total: number;
}

export interface PriceInput {
  readonly fabricId: string | null;
  readonly mountingType: MountingCategory | null;
  readonly widthMm: number;
  readonly heightMm: number;
  readonly railId: string | null;
}
