import { useState, useCallback, useEffect } from "react";
import { Card, Button } from "@heroui/react";
import { useCart } from "@/context/cart-context";
import { useWizard } from "@/context/wizard-context";
import { priceToUnits } from "@/utils/allegro";
import { ALLEGRO_UNIT_PRICE } from "@/config/allegro";
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
      <h2 className="font-display text-2xl font-bold text-brand-950">
        Twoje zamówienie
      </h2>

      {!hasItems ? (
        <Card className="p-8 text-center">
          <Card.Content>
            <p className="mb-4 text-brand-500">
              Brak pozycji w zamówieniu. Dodaj pierwszy produkt.
            </p>
            <Button variant="primary" onPress={handleAddNew}>
              Skonfiguruj roletę
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <>
          {/* Lista pozycji */}
          <div className="space-y-3">
            {cartState.items.map((item) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Przycisk dodaj kolejny produkt — pod listą */}
          <div>
            <Button variant="primary" size="md" onPress={handleAddNew}>
              + Dodaj kolejny produkt
            </Button>
          </div>

          {/* Podsumowanie */}
          <Card className="p-6" data-testid="order-summary-panel">
            <Card.Content className="p-0">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-brand-700">
                  Suma zamówienia
                </span>
                <span className="font-display text-2xl font-bold text-brand-950">
                  {formatPrice(totalPrice)} zł
                </span>
              </div>

              {/* Wyjaśnienie jednostek Allegro — krok po kroku */}
              <div className="mt-4 rounded-lg bg-brand-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-brand-800">
                  Jak złożyć zamówienie na Allegro?
                </h4>
                <ul className="space-y-2 text-sm text-brand-600">
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 font-bold text-brand-800">
                      1.
                    </span>
                    <span>
                      Wartość Twojego zamówienia wynosi{" "}
                      <strong className="text-brand-800">
                        {formatPrice(totalPrice)} zł
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 font-bold text-brand-800">
                      2.
                    </span>
                    <span>
                      Na aukcji Allegro 1 sztuka ={" "}
                      <strong className="text-brand-800">
                        {ALLEGRO_UNIT_PRICE},00 zł
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex-shrink-0 font-bold text-brand-800">
                      3.
                    </span>
                    <span>
                      Obliczenie: {formatPrice(totalPrice)} zł ÷{" "}
                      {ALLEGRO_UNIT_PRICE},00 zł ={" "}
                      <strong className="text-brand-800">{units} sztuk</strong>
                    </span>
                  </li>
                </ul>

                <div className="mx-auto mt-4 max-w-xs rounded-lg bg-sage-100 p-4 text-center">
                  <p className="text-sm font-medium text-sage-800">
                    W polu „ilość" na Allegro wpisz:
                  </p>
                  <p className="mt-2 font-display text-5xl font-bold text-sage-900">
                    {units}
                  </p>
                  <p className="mt-1 text-base font-medium text-sage-700">
                    sztuk
                  </p>
                </div>
              </div>

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
