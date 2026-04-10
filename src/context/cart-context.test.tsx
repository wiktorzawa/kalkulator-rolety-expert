import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";

import { cartReducer, CartProvider, useCart } from "./cart-context";
import { INITIAL_CART_STATE, type CartItem } from "./cart-types";

// Mock crypto.randomUUID for deterministic tests
let uuidCounter = 0;
vi.stubGlobal("crypto", {
  randomUUID: () => {
    uuidCounter += 1;
    return `test-uuid-${uuidCounter}`;
  },
});

function makeItem(
  overrides: Partial<Omit<CartItem, "id">> = {},
): Omit<CartItem, "id"> {
  return {
    fabricId: "standard",
    fabricName: "Standard",
    colorId: "biel",
    colorName: "Biel",
    mountingId: "wzmocniony",
    mountingName: "Wzmocniony (skręcany)",
    mountingType: "bezinwazyjny",
    widthMm: 600,
    heightMm: 1500,
    railId: "bialy",
    railName: "Biały",
    quantity: 1,
    unitPrice: 156.75,
    ...overrides,
  };
}

describe("cartReducer", () => {
  beforeEach(() => {
    uuidCounter = 0;
  });

  it("ADD_ITEM adds item with UUID and price", () => {
    const item = makeItem();
    const result = cartReducer(INITIAL_CART_STATE, {
      type: "ADD_ITEM",
      item,
    });

    expect(result.items).toHaveLength(1);
    const added = result.items[0];
    expect(added).toBeDefined();
    expect(added?.id).toBe("test-uuid-1");
    expect(added?.unitPrice).toBe(156.75);
    expect(added?.fabricId).toBe("standard");
  });

  it("REMOVE_ITEM removes by id", () => {
    const stateWithItem = {
      ...INITIAL_CART_STATE,
      items: [{ ...makeItem(), id: "item-1" }],
    };
    const result = cartReducer(stateWithItem, {
      type: "REMOVE_ITEM",
      id: "item-1",
    });

    expect(result.items).toHaveLength(0);
  });

  it("REMOVE_ITEM does nothing for non-existent id", () => {
    const stateWithItem = {
      ...INITIAL_CART_STATE,
      items: [{ ...makeItem(), id: "item-1" }],
    };
    const result = cartReducer(stateWithItem, {
      type: "REMOVE_ITEM",
      id: "non-existent",
    });

    expect(result.items).toHaveLength(1);
  });

  it("SET_QUANTITY updates quantity", () => {
    const stateWithItem = {
      ...INITIAL_CART_STATE,
      items: [{ ...makeItem(), id: "item-1" }],
    };
    const result = cartReducer(stateWithItem, {
      type: "SET_QUANTITY",
      id: "item-1",
      quantity: 3,
    });

    expect(result.items[0]?.quantity).toBe(3);
  });

  it("SET_QUANTITY rejects quantity < 1", () => {
    const stateWithItem = {
      ...INITIAL_CART_STATE,
      items: [{ ...makeItem(), id: "item-1" }],
    };
    const result = cartReducer(stateWithItem, {
      type: "SET_QUANTITY",
      id: "item-1",
      quantity: 0,
    });

    expect(result.items[0]?.quantity).toBe(1);
  });

  it("DUPLICATE_ITEM clones with new id", () => {
    const stateWithItem = {
      ...INITIAL_CART_STATE,
      items: [{ ...makeItem(), id: "item-1" }],
    };
    const result = cartReducer(stateWithItem, {
      type: "DUPLICATE_ITEM",
      id: "item-1",
    });

    expect(result.items).toHaveLength(2);
    expect(result.items[0]?.id).toBe("item-1");
    expect(result.items[1]?.id).toBe("test-uuid-1");
    expect(result.items[1]?.fabricId).toBe("standard");
    expect(result.items[1]?.unitPrice).toBe(156.75);
  });

  it("DUPLICATE_ITEM does nothing for non-existent id", () => {
    const result = cartReducer(INITIAL_CART_STATE, {
      type: "DUPLICATE_ITEM",
      id: "non-existent",
    });

    expect(result.items).toHaveLength(0);
  });

  it("UPDATE_ITEM replaces configuration and recalculates price", () => {
    const stateWithItem = {
      ...INITIAL_CART_STATE,
      items: [{ ...makeItem(), id: "item-1" }],
    };
    const updatedItem = makeItem({
      fabricId: "blackout",
      fabricName: "Blackout",
      unitPrice: 228.0,
    });
    const result = cartReducer(stateWithItem, {
      type: "UPDATE_ITEM",
      id: "item-1",
      item: updatedItem,
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe("item-1");
    expect(result.items[0]?.fabricId).toBe("blackout");
    expect(result.items[0]?.unitPrice).toBe(228.0);
  });

  it("SET_VIEW changes view", () => {
    const result = cartReducer(INITIAL_CART_STATE, {
      type: "SET_VIEW",
      view: "order-list",
    });

    expect(result.view).toBe("order-list");
  });
});

describe("useCart hook", () => {
  beforeEach(() => {
    uuidCounter = 0;
  });

  function wrapper({ children }: { children: ReactNode }) {
    return <CartProvider>{children}</CartProvider>;
  }

  it("provides initial state with zero totals", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.totalItems).toBe(0);
  });

  it("totalPrice = sum of unitPrice * quantity for all items", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: "ADD_ITEM",
        item: makeItem({ unitPrice: 100, quantity: 2 }),
      });
    });

    act(() => {
      result.current.dispatch({
        type: "ADD_ITEM",
        item: makeItem({ unitPrice: 50, quantity: 3 }),
      });
    });

    // 100*2 + 50*3 = 350
    expect(result.current.totalPrice).toBe(350);
    expect(result.current.totalItems).toBe(5);
  });

  it("totalPrice updates after SET_QUANTITY", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: "ADD_ITEM",
        item: makeItem({ unitPrice: 156.75, quantity: 1 }),
      });
    });

    const firstItem = result.current.state.items[0];
    expect(firstItem).toBeDefined();
    const itemId = firstItem?.id ?? "";

    act(() => {
      result.current.dispatch({
        type: "SET_QUANTITY",
        id: itemId,
        quantity: 3,
      });
    });

    expect(result.current.totalPrice).toBe(156.75 * 3);
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow("useCart must be used within CartProvider");
  });
});
