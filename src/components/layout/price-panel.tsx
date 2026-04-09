import { useWizard } from "@/context/wizard-context";
import { priceToUnits, formatUnitsBreakdown } from "@/utils/allegro";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function PricePanel() {
  const { price, isConfigComplete } = useWizard();

  const units = priceToUnits(price.total);
  const breakdown = formatUnitsBreakdown(units);

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-brand-200 bg-white/95 p-4 backdrop-blur-sm md:static md:rounded-xl md:border md:shadow-sm"
      aria-label="Podsumowanie cenowe"
    >
      <div className="mx-auto max-w-4xl">
        {price.total > 0 && (
          <div className="mb-3 space-y-1 text-sm text-brand-600">
            <div className="flex justify-between">
              <span>Baza (tkanina + montaż)</span>
              <span>{formatPrice(price.basePrice)} zł</span>
            </div>
            <div className="flex justify-between">
              <span>Dopłata za szerokość</span>
              <span>{formatPrice(price.widthPrice)} zł</span>
            </div>
            <div className="flex justify-between">
              <span>Dopłata za wysokość</span>
              <span>{formatPrice(price.heightPrice)} zł</span>
            </div>
            {price.railSurcharge > 0 && (
              <div className="flex justify-between">
                <span>Dopłata za listwę</span>
                <span>{formatPrice(price.railSurcharge)} zł</span>
              </div>
            )}
            <div className="flex justify-between border-t border-brand-200 pt-1 font-bold text-brand-950">
              <span>Razem</span>
              <span>{formatPrice(price.total)} zł</span>
            </div>
          </div>
        )}

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
          Zamów przez Allegro
        </button>
      </div>
    </aside>
  );
}
