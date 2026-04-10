import type { MountingCategory } from "@/data/types";

export interface CartItem {
  readonly id: string;
  readonly fabricId: string;
  readonly fabricName: string;
  readonly colorId: string;
  readonly colorName: string;
  readonly mountingId: string;
  readonly mountingName: string;
  readonly mountingType: MountingCategory;
  readonly widthMm: number;
  readonly heightMm: number;
  readonly railId: string;
  readonly railName: string;
  readonly quantity: number;
  readonly unitPrice: number;
}

export type CartView = "configurator" | "order-list";

export interface CartState {
  readonly items: readonly CartItem[];
  readonly view: CartView;
  readonly orderSubmitted: boolean;
}

export type CartAction =
  | { readonly type: "ADD_ITEM"; readonly item: Omit<CartItem, "id"> }
  | { readonly type: "REMOVE_ITEM"; readonly id: string }
  | {
      readonly type: "UPDATE_ITEM";
      readonly id: string;
      readonly item: Omit<CartItem, "id">;
    }
  | { readonly type: "DUPLICATE_ITEM"; readonly id: string }
  | {
      readonly type: "SET_QUANTITY";
      readonly id: string;
      readonly quantity: number;
    }
  | { readonly type: "SET_VIEW"; readonly view: CartView }
  | { readonly type: "SET_ORDER_SUBMITTED" };

export const INITIAL_CART_STATE: CartState = {
  items: [],
  view: "configurator",
  orderSubmitted: false,
};
