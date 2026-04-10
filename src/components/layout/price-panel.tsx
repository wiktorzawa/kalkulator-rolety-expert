import { useState, useEffect, useRef } from "react";
import { useWizard } from "@/context/wizard-context";
import { priceToUnits, formatUnitsBreakdown } from "@/utils/allegro";
import { getFabricById, getColorsForFabric } from "@/data/fabrics";
import { getMountingById } from "@/data/mounting";
import { getRailById } from "@/data/rails";
import {
  submitOrder,
  type OrderRecord,
  type OrderItemInsert,
} from "@/services/orders";
import { parseUtmSource } from "@/utils/order-number";
import { OrderSummary } from "@/components/order/order-summary";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function PricePanel() {
  const { state, price, isConfigComplete } = useWizard();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isPricePulsing, setIsPricePulsing] = useState(false);
  const prevPriceRef = useRef(price.total);

  useEffect(() => {
    if (price.total !== prevPriceRef.current && price.total > 0) {
      setIsPricePulsing(true);
      const timer = setTimeout(() => setIsPricePulsing(false), 600);
      prevPriceRef.current = price.total;
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = price.total;
  }, [price.total]);

  const units = priceToUnits(price.total);
  const breakdown = formatUnitsBreakdown(units);

  const fabric = state.fabricId ? getFabricById(state.fabricId) : null;
  const mounting = state.mountingId ? getMountingById(state.mountingId) : null;
  const rail = state.railId ? getRailById(state.railId) : null;

  async function handleSubmit(): Promise<void> {
    if (!isConfigComplete || isSubmitting) return;

    const { fabricId, colorId, mountingId, mountingType, railId } = state;
    if (!fabricId || !colorId || !mountingId || !mountingType || !railId)
      return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const utmSource = parseUtmSource(window.location.search);

      const colors = getColorsForFabric(fabricId);
      const color = colors.find((c) => c.id === colorId);
      const fabricObj = getFabricById(fabricId);
      const mountingObj = getMountingById(mountingId);
      const railObj = getRailById(railId);

      const item: OrderItemInsert = {
        fabric_id: fabricId,
        fabric_name: fabricObj?.name ?? fabricId,
        color_id: colorId,
        color_name: color?.name ?? colorId,
        mounting_id: mountingId,
        mounting_name: mountingObj?.name ?? mountingId,
        mounting_type: mountingType,
        width_mm: state.widthMm,
        height_mm: state.heightMm,
        rail_id: railId,
        rail_name: railObj?.name ?? railId,
        quantity: 1,
        unit_price: price.total,
      };

      const result = await submitOrder({
        items: [item],
        totalPrice: price.total,
        allegroUnits: units,
        utmSource: utmSource,
      });

      // Build a local OrderRecord for the summary display
      setSubmittedOrder({
        id: 0,
        order_number: result.orderNumber,
        total_price: price.total,
        allegro_units: units,
        allegro_tx_id: null,
        utm_source: utmSource,
        created_at: new Date().toISOString(),
        items: [
          {
            id: 0,
            position: 1,
            ...item,
          },
        ],
      });

      // Update URL without reload so the user can share/bookmark
      const newUrl = `${window.location.origin}${window.location.pathname}?order=${result.orderNumber}`;
      window.history.pushState({}, "", newUrl);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Wystapil blad przy skladaniu zamowienia";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show order summary after successful submission
  if (submittedOrder) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-50 p-4">
        <div className="mx-auto max-w-2xl py-8">
          <OrderSummary order={submittedOrder} />
        </div>
      </div>
    );
  }

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-brand-200 bg-white/95 p-4 backdrop-blur-sm md:static md:rounded-xl md:border md:shadow-sm"
      aria-label="Podsumowanie cenowe"
    >
      <div className="mx-auto max-w-4xl">
        {/* Selected options summary */}
        {(fabric ?? mounting ?? rail) && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-2 flex w-full items-center justify-between text-xs text-brand-500 hover:text-brand-700"
          >
            <span className="flex flex-wrap gap-1">
              {fabric && (
                <span className="rounded bg-brand-100 px-1.5 py-0.5">
                  {fabric.name}
                </span>
              )}
              {mounting && (
                <span className="rounded bg-brand-100 px-1.5 py-0.5">
                  {mounting.name}
                </span>
              )}
              {rail && (
                <span className="rounded bg-brand-100 px-1.5 py-0.5">
                  Listwa: {rail.name}
                </span>
              )}
            </span>
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}

        {/* Price breakdown (expandable) */}
        {price.total > 0 && isExpanded && (
          <div className="mb-3 space-y-1 text-sm text-brand-600">
            <div className="flex justify-between">
              <span>Baza (tkanina + montaz)</span>
              <span>{formatPrice(price.basePrice)} zl</span>
            </div>
            <div className="flex justify-between">
              <span>Doplata za szerokosc</span>
              <span>{formatPrice(price.widthPrice)} zl</span>
            </div>
            <div className="flex justify-between">
              <span>Doplata za wysokosc</span>
              <span>{formatPrice(price.heightPrice)} zl</span>
            </div>
            {price.railSurcharge > 0 && (
              <div className="flex justify-between">
                <span>Doplata za listwe</span>
                <span>{formatPrice(price.railSurcharge)} zl</span>
              </div>
            )}
          </div>
        )}

        {/* Total price */}
        {price.total > 0 && (
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-medium text-brand-700">Razem</span>
            <span
              className={`font-display text-xl font-bold text-brand-950 transition-all duration-300 ${isPricePulsing ? "scale-110 text-sage-700" : ""}`}
              data-testid="price-total"
            >
              {formatPrice(price.total)} zl
            </span>
          </div>
        )}

        {/* Allegro units */}
        {price.total > 0 && (
          <p className="mb-3 text-center text-xs text-brand-500">
            Allegro: <strong className="text-brand-800">{units}</strong>{" "}
            jednostek ({breakdown})
          </p>
        )}

        {/* Error message */}
        {submitError && (
          <p className="mb-2 text-center text-xs text-red-600">{submitError}</p>
        )}

        <button
          type="button"
          disabled={!isConfigComplete || isSubmitting}
          onClick={() => void handleSubmit()}
          className="w-full rounded-lg bg-sage-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Skladanie zamowienia..." : "Zamow przez Allegro"}
        </button>
      </div>
    </aside>
  );
}
