import { useState, useCallback, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { useWizard } from "@/context/wizard-context";
import { priceToUnits, formatUnitsBreakdown } from "@/utils/allegro";
import type { CartItem } from "@/context/cart-types";
import { OrderItemCard } from "./order-item-card";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function OrderList() {
  const { state: cartState, dispatch: cartDispatch, totalPrice } = useCart();
  const { dispatch: wizardDispatch } = useWizard();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const units = priceToUnits(totalPrice);
  const breakdown = formatUnitsBreakdown(units);
  const hasItems = cartState.items.length > 0;

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage === null) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  function handleAddNew(): void {
    wizardDispatch({ type: "RESET" });
    cartDispatch({ type: "SET_VIEW", view: "configurator" });
  }

  function handleEdit(item: CartItem): void {
    wizardDispatch({
      type: "LOAD_ITEM",
      fabricId: item.fabricId,
      colorId: item.colorId,
      mountingId: item.mountingId,
      mountingType: item.mountingType,
      widthMm: item.widthMm,
      heightMm: item.heightMm,
      railId: item.railId,
      itemId: item.id,
    });
    cartDispatch({ type: "SET_VIEW", view: "configurator" });
  }

  function handleDuplicate(item: CartItem): void {
    // First duplicate in cart (creates new item with new UUID after original)
    cartDispatch({ type: "DUPLICATE_ITEM", id: item.id });

    // Find the duplicated item — it will be inserted right after the original
    // Since state hasn't updated yet in this sync call, we need to find it after render
    // Instead, we load the original's data into wizard as a "new" configuration
    // The wizard will add it as a new item when saved, but we already added the duplicate
    // So we should edit the duplicate. We'll use a ref pattern to find it.

    // Simpler approach: we know the duplicate will be the last item with matching params
    // after the next render. Use a flag to trigger edit of the newest duplicate.
    setDuplicatePendingFor(item.id);
  }

  const [duplicatePendingFor, setDuplicatePendingFor] = useState<string | null>(
    null,
  );

  // After DUPLICATE_ITEM state update, find and edit the duplicate
  useEffect(() => {
    if (duplicatePendingFor === null) return;

    const originalIndex = cartState.items.findIndex(
      (i) => i.id === duplicatePendingFor,
    );
    if (originalIndex === -1) {
      setDuplicatePendingFor(null);
      return;
    }

    // Duplicate is inserted right after the original
    const duplicate = cartState.items[originalIndex + 1];
    if (
      !duplicate ||
      duplicate.fabricId !== cartState.items[originalIndex]?.fabricId
    ) {
      setDuplicatePendingFor(null);
      return;
    }

    setDuplicatePendingFor(null);
    handleEdit(duplicate);
  }, [cartState.items, duplicatePendingFor]);

  function handleOrderSubmit(): void {
    // Order submission will be handled by the order summary flow (Unit 7)
    // For now, dispatch SET_VIEW to show order summary placeholder
    cartDispatch({ type: "SET_VIEW", view: "order-list" });
    showToast("Funkcja zamówienia zostanie dodana w kolejnej fazie.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-brand-950">
          Twoje zamówienie
        </h2>
        <button
          type="button"
          onClick={handleAddNew}
          className="rounded-lg border border-sage-600 px-4 py-2 text-sm font-medium text-sage-700 hover:bg-sage-50"
        >
          + Dodaj kolejną plisę
        </button>
      </div>

      {!hasItems ? (
        <div className="rounded-xl border border-brand-200 bg-white p-8 text-center">
          <p className="mb-4 text-brand-500">
            Brak pozycji w zamówieniu. Dodaj pierwszą plisę.
          </p>
          <button
            type="button"
            onClick={handleAddNew}
            className="rounded-lg bg-sage-600 px-6 py-2 font-medium text-white hover:bg-sage-700"
          >
            Skonfiguruj plisę
          </button>
        </div>
      ) : (
        <>
          {/* Lista pozycji */}
          <div className="space-y-3">
            {cartState.items.map((item) => (
              <OrderItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>

          {/* Podsumowanie */}
          <div
            className="rounded-xl border border-brand-200 bg-white p-5"
            data-testid="order-summary-panel"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-brand-700">
                Suma zamówienia
              </span>
              <span className="font-display text-xl font-bold text-brand-950">
                {formatPrice(totalPrice)} zł
              </span>
            </div>

            <p className="mt-1 text-center text-xs text-brand-500">
              Allegro: <strong className="text-brand-800">{units}</strong>{" "}
              jednostek ({breakdown})
            </p>

            <button
              type="button"
              disabled={!hasItems}
              onClick={handleOrderSubmit}
              className="mt-4 w-full rounded-lg bg-sage-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="order-submit-button"
            >
              Zamów przez Allegro
            </button>
          </div>
        </>
      )}

      {/* Toast */}
      {toastMessage !== null && (
        <div
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-brand-900 px-4 py-2 text-sm text-white shadow-lg"
          role="status"
          aria-live="polite"
          data-testid="toast"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
