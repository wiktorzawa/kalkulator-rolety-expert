import { useState, useEffect, useRef } from "react";
import { useWizard } from "@/context/wizard-context";
import { useCart } from "@/context/cart-context";
import { getFabricById, getColorsForFabric } from "@/data/fabrics";
import { getMountingById } from "@/data/mounting";
import { getRailById } from "@/data/rails";
import type { CartItem } from "@/context/cart-types";

export function buildCartItemFromWizard(
  wizardState: {
    fabricId: string | null;
    colorId: string | null;
    mountingId: string | null;
    mountingType: "bezinwazyjny" | "inwazyjny" | null;
    railId: string | null;
    widthMm: number;
    heightMm: number;
  },
  quantity: number,
  unitPrice: number,
): Omit<CartItem, "id"> | null {
  const {
    fabricId,
    colorId,
    mountingId,
    mountingType,
    railId,
    widthMm,
    heightMm,
  } = wizardState;
  if (!fabricId || !colorId || !mountingId || !mountingType || !railId) {
    return null;
  }

  const colors = getColorsForFabric(fabricId);
  const color = colors.find((c) => c.id === colorId);
  const fabricObj = getFabricById(fabricId);
  const mountingObj = getMountingById(mountingId);
  const railObj = getRailById(railId);

  return {
    fabricId,
    fabricName: fabricObj?.name ?? fabricId,
    colorId,
    colorName: color?.name ?? colorId,
    mountingId,
    mountingName: mountingObj?.name ?? mountingId,
    mountingType,
    widthMm,
    heightMm,
    railId,
    railName: railObj?.name ?? railId,
    quantity,
    unitPrice,
  };
}

interface PricePanelActions {
  quantity: number;
  toastMessage: string | null;
  isPricePulsing: boolean;
  isEditing: boolean;
  cartPriceExcludingEdited: number;
  cartCountExcludingEdited: number;
  handleAddToOrder: () => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleQuantityChange: (delta: number) => void;
}

export function usePricePanelActions(): PricePanelActions {
  const { state: wizardState, price, dispatch: wizardDispatch } = useWizard();
  const { state: cartState, dispatch: cartDispatch } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPricePulsing, setIsPricePulsing] = useState(false);
  const prevPriceRef = useRef(price.total);

  const isEditing = wizardState.editingItemId !== null;

  // Reset quantity when switching between edit modes
  useEffect(() => {
    if (isEditing) {
      const editingItem = cartState.items.find(
        (i) => i.id === wizardState.editingItemId,
      );
      if (editingItem) {
        setQuantity(editingItem.quantity);
      }
    } else {
      setQuantity(1);
    }
  }, [isEditing, wizardState.editingItemId, cartState.items]);

  // Price pulse animation
  useEffect(() => {
    if (price.total !== prevPriceRef.current && price.total > 0) {
      setIsPricePulsing(true);
      const timer = setTimeout(() => setIsPricePulsing(false), 600);
      prevPriceRef.current = price.total;
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = price.total;
  }, [price.total]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage === null) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Cart totals excluding the item being edited
  const cartItemsExcludingEdited = cartState.items.filter(
    (i) => i.id !== wizardState.editingItemId,
  );
  const cartPriceExcludingEdited = cartItemsExcludingEdited.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const cartCountExcludingEdited = cartItemsExcludingEdited.length;

  function handleAddToOrder(): void {
    const item = buildCartItemFromWizard(wizardState, quantity, price.total);
    if (!item) return;

    cartDispatch({ type: "ADD_ITEM", item });
    wizardDispatch({ type: "RESET" });
    cartDispatch({ type: "SET_VIEW", view: "order-list" });
  }

  function handleSaveEdit(): void {
    const item = buildCartItemFromWizard(wizardState, quantity, price.total);
    if (!item || !wizardState.editingItemId) return;

    cartDispatch({
      type: "UPDATE_ITEM",
      id: wizardState.editingItemId,
      item,
    });

    if (quantity > 1) {
      setToastMessage(`Zaktualizowano ${quantity} szt.`);
    }

    wizardDispatch({ type: "RESET" });
    cartDispatch({ type: "SET_VIEW", view: "order-list" });
  }

  function handleCancelEdit(): void {
    wizardDispatch({ type: "RESET" });
    cartDispatch({ type: "SET_VIEW", view: "order-list" });
  }

  function handleQuantityChange(delta: number): void {
    setQuantity((prev) => Math.max(1, prev + delta));
  }

  return {
    quantity,
    toastMessage,
    isPricePulsing,
    isEditing,
    cartPriceExcludingEdited,
    cartCountExcludingEdited,
    handleAddToOrder,
    handleSaveEdit,
    handleCancelEdit,
    handleQuantityChange,
  };
}
