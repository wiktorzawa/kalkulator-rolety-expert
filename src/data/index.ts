export type {
  Color,
  Fabric,
  FabricBase,
  HeightTier,
  MountingCategory,
  MountingSystem,
  PriceBreakdown,
  PriceInput,
  RailColor,
  RailFinish,
  WidthPriceEntry,
  HeightPriceEntry,
} from "./types";

export { FABRICS, getColorsForFabric, getFabricById } from "./fabrics";
export {
  DISCOUNT_FACTOR,
  MAX_WIDTH_GLUED,
  WIDTH_PRICE_JUMP_AT,
  WIDTH_PRICE_TABLE,
  HEIGHT_PRICE_TABLE,
  getWidthPrice,
  getHeightPrice,
} from "./pricing";
export { MOUNTING_SYSTEMS, getMountingById } from "./mounting";
export { RAIL_COLORS, getRailById } from "./rails";
export {
  getPackshotPath,
  getFabricSwatchPath,
  getMountingImagePath,
  getRailImagePath,
  fabricIdToCollection,
  getBaseCollection,
} from "./images";
export type { MountingImageType } from "./images";
