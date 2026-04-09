import { useState } from "react";
import { useWizard } from "@/context/wizard-context";
import { priceToUnits, formatUnitsBreakdown } from "@/utils/allegro";
import { getFabricById } from "@/data/fabrics";
import { getMountingById } from "@/data/mounting";
import { getRailById } from "@/data/rails";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function PricePanel() {
  const { state, price, isConfigComplete } = useWizard();
  const [isExpanded, setIsExpanded] = useState(false);

  const units = priceToUnits(price.total);
  const breakdown = formatUnitsBreakdown(units);

  const fabric = state.fabricId ? getFabricById(state.fabricId) : null;
  const mounting = state.mountingId ? getMountingById(state.mountingId) : null;
  const rail = state.railId ? getRailById(state.railId) : null;

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
              className="font-display text-xl font-bold text-brand-950 transition-all duration-300"
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

        <button
          type="button"
          disabled={!isConfigComplete}
          className="w-full rounded-lg bg-sage-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Zamow przez Allegro
        </button>
      </div>
    </aside>
  );
}
