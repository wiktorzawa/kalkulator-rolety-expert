import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";

import {
  type CartState,
  type CartAction,
  type CartItem,
  INITIAL_CART_STATE,
} from "./cart-types";

function generateId(): string {
  return crypto.randomUUID();
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem: CartItem = {
        ...action.item,
        id: generateId(),
      };
      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };

    case "UPDATE_ITEM": {
      const updatedItem: CartItem = {
        ...action.item,
        id: action.id,
      };
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? updatedItem : item,
        ),
      };
    }

    case "DUPLICATE_ITEM": {
      const original = state.items.find((item) => item.id === action.id);
      if (!original) return state;

      const duplicate: CartItem = {
        ...original,
        id: generateId(),
      };

      const originalIndex = state.items.findIndex(
        (item) => item.id === action.id,
      );
      const newItems = [...state.items];
      newItems.splice(originalIndex + 1, 0, duplicate);

      return {
        ...state,
        items: newItems,
      };
    }

    case "SET_QUANTITY": {
      if (action.quantity < 1) return state;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item,
        ),
      };
    }

    case "SET_VIEW":
      return {
        ...state,
        view: action.view,
      };

    default:
      return state;
  }
}

interface CartContextValue {
  readonly state: CartState;
  readonly dispatch: React.Dispatch<CartAction>;
  readonly totalPrice: number;
  readonly totalItems: number;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  readonly children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_CART_STATE);

  const totalPrice = useMemo(
    () =>
      state.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      ),
    [state.items],
  );

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  );

  const value = useMemo(
    () => ({ state, dispatch, totalPrice, totalItems }),
    [state, totalPrice, totalItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
