import { useState, useCallback, useEffect, useRef } from "react";
import { Card, Button } from "@heroui/react";
import { useCart } from "@/context/cart-context";
import { useWizard } from "@/context/wizard-context";
import { priceToUnits, formatUnitsBreakdown } from "@/utils/allegro";
import { parseUtmSource } from "@/utils/order-number";
import {
  submitOrder,
  type OrderRecord,
  type OrderItemInsert,
} from "@/services/orders";
import type { CartItem } from "@/context/cart-types";
import { OrderItemCard } from "./order-item-card";
import { OrderSummary } from "./order-summary";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

function mapCartItemToInsert(item: CartItem): OrderItemInsert {
  return {
    fabric_id: item.fabricId,
    fabric_name: item.fabricName,
    color_id: item.colorId,
    color_name: item.colorName,
    mounting_id: item.mountingId,
    mounting_name: item.mountingName,
    mounting_type: item.mountingType,
    width_mm: item.widthMm,
    height_mm: item.heightMm,
    rail_id: item.railId,
    rail_name: item.railName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  };
}

export function OrderList() {
  const { state: cartState, dispatch: cartDispatch, totalPrice } = useCart();
  const { dispatch: wizardDispatch } = useWizard();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(
    null,
  );

  const units = priceToUnits(totalPrice);
  const breakdown = formatUnitsBreakdown(units);
  const hasItems = cartState.items.length > 0;

  // Track known item IDs to detect the duplicate after DUPLICATE_ITEM dispatch
  const knownItemIdsRef = useRef<ReadonlySet<string>>(new Set());
  const [pendingDuplicate, setPendingDuplicate] = useState(false);

  const editItem = useCallback(
    (item: CartItem): void => {
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
    },
    [wizardDispatch, cartDispatch],
  );

  // Keep knownItemIdsRef in sync, but only when not waiting for a duplicate
  useEffect(() => {
    if (pendingDuplicate) {
      // Find the new item (its ID is not in knownItemIdsRef)
      const newItem = cartState.items.find(
        (i) => !knownItemIdsRef.current.has(i.id),
      );
      setPendingDuplicate(false);
      // Update ref before triggering edit
      knownItemIdsRef.current = new Set(cartState.items.map((i) => i.id));
      if (newItem) {
        editItem(newItem);
      }
    } else {
      knownItemIdsRef.current = new Set(cartState.items.map((i) => i.id));
    }
  }, [cartState.items, pendingDuplicate, editItem]);

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
    editItem(item);
  }

  function handleDuplicate(item: CartItem): void {
    // Snapshot current IDs, dispatch duplicate, then let the effect find the new item
    knownItemIdsRef.current = new Set(cartState.items.map((i) => i.id));
    cartDispatch({ type: "DUPLICATE_ITEM", id: item.id });
    setPendingDuplicate(true);
  }

  async function handleOrderSubmit(): Promise<void> {
    if (isSubmitting || !hasItems) return;

    setIsSubmitting(true);
    try {
      const orderItems: OrderItemInsert[] = cartState.items.map((item) =>
        mapCartItemToInsert(item),
      );

      const utmSource = parseUtmSource(window.location.search);

      const { orderNumber } = await submitOrder({
        items: orderItems,
        totalPrice,
        allegroUnits: units,
        utmSource,
      });

      // Build an OrderRecord for the summary display
      const order: OrderRecord = {
        id: 0,
        order_number: orderNumber,
        total_price: totalPrice,
        allegro_units: units,
        allegro_tx_id: null,
        utm_source: utmSource,
        created_at: new Date().toISOString(),
        items: orderItems.map((item, idx) => ({
          ...item,
          id: idx + 1,
          position: idx + 1,
        })),
      };

      setSubmittedOrder(order);
      cartDispatch({ type: "SET_ORDER_SUBMITTED" });

      // Update URL without reload
      const newUrl = `${window.location.origin}${window.location.pathname}?order=${orderNumber}`;
      window.history.replaceState(null, "", newUrl);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Nie udalo sie zlozyc zamowienia";
      showToast(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // If order was submitted, show summary
  if (submittedOrder) {
    return (
      <div className="py-6">
        <OrderSummary order={submittedOrder} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-brand-950">
          Twoje zamówienie
        </h2>
        <Button variant="outline" size="sm" onPress={handleAddNew}>
          + Dodaj kolejną plisę
        </Button>
      </div>

      {!hasItems ? (
        <Card className="p-8 text-center">
          <Card.Content>
            <p className="mb-4 text-brand-500">
              Brak pozycji w zamówieniu. Dodaj pierwszą plisę.
            </p>
            <Button variant="primary" onPress={handleAddNew}>
              Skonfiguruj plisę
            </Button>
          </Card.Content>
        </Card>
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
          <Card className="p-5" data-testid="order-summary-panel">
            <Card.Content className="p-0">
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

              <Button
                variant="primary"
                size="lg"
                fullWidth
                isDisabled={!hasItems || isSubmitting}
                onPress={() => void handleOrderSubmit()}
                className="mt-4"
                data-testid="order-submit-button"
              >
                {isSubmitting
                  ? "Składanie zamówienia..."
                  : "Zamów przez Allegro"}
              </Button>
            </Card.Content>
          </Card>
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
