import { useWizard } from "@/context/wizard-context";
import { useCart } from "@/context/cart-context";
import { getFabricById } from "@/data/fabrics";
import { getMountingById } from "@/data/mounting";
import { getRailById } from "@/data/rails";
import { usePricePanelActions } from "@/hooks/use-price-panel-actions";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function PricePanel() {
  const { state: wizardState, price, isConfigComplete } = useWizard();
  const { state: cartState, totalPrice: cartTotalPrice } = useCart();

  const {
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
  } = usePricePanelActions();

  const fabric = wizardState.fabricId
    ? getFabricById(wizardState.fabricId)
    : null;
  const mounting = wizardState.mountingId
    ? getMountingById(wizardState.mountingId)
    : null;
  const rail = wizardState.railId ? getRailById(wizardState.railId) : null;

  // "Cena rolety" = total minus rail surcharge
  const blindPrice = price.total - price.railSurcharge;

  return (
    <>
      <aside
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-brand-200 bg-white/95 p-4 backdrop-blur-sm md:static md:rounded-xl md:border md:shadow-sm"
        aria-label="Podsumowanie cenowe"
      >
        <div className="mx-auto max-w-4xl">
          {/* Selected options tags */}
          {(fabric ?? mounting ?? rail) && (
            <div className="mb-2 flex flex-wrap gap-1 text-xs text-brand-500">
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
            </div>
          )}

          {/* Simplified price display */}
          {price.total > 0 && (
            <div className="mb-3 space-y-1 text-sm">
              <div className="flex justify-between text-brand-600">
                <span>Cena rolety</span>
                <span>{formatPrice(blindPrice)} zł</span>
              </div>
              {price.railSurcharge > 0 && (
                <div className="flex justify-between text-brand-600">
                  <span>Dopłata listwa</span>
                  <span>{formatPrice(price.railSurcharge)} zł</span>
                </div>
              )}
              <div
                className="flex items-baseline justify-between border-t border-brand-100 pt-1"
                data-testid="price-total-row"
              >
                <span className="font-medium text-brand-700">Razem</span>
                <span
                  className={`font-display text-xl font-bold text-brand-950 transition-all duration-300 ${isPricePulsing ? "scale-110 text-sage-700" : ""}`}
                  data-testid="price-total"
                >
                  {formatPrice(price.total)} zł
                </span>
              </div>
            </div>
          )}

          {/* "Dotychczas w zamówieniu" info */}
          {isEditing && cartCountExcludingEdited > 0 && (
            <p
              className="mb-2 text-center text-xs text-brand-500"
              data-testid="cart-existing-info"
            >
              Dotychczas w zamówieniu:{" "}
              <strong>{formatPrice(cartPriceExcludingEdited)} zł</strong> (
              {cartCountExcludingEdited}{" "}
              {cartCountExcludingEdited === 1 ? "pozycja" : "pozycji"})
            </p>
          )}
          {!isEditing && cartState.items.length > 0 && (
            <p
              className="mb-2 text-center text-xs text-brand-500"
              data-testid="cart-existing-info"
            >
              Dotychczas w zamówieniu:{" "}
              <strong>{formatPrice(cartTotalPrice)} zł</strong> (
              {cartState.items.length}{" "}
              {cartState.items.length === 1 ? "pozycja" : "pozycji"})
            </p>
          )}

          {/* Quantity selector */}
          {price.total > 0 && (
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="text-sm text-brand-600">Ilość:</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-brand-200 text-brand-700 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Zmniejsz ilość"
              >
                -
              </button>
              <span
                className="min-w-[2rem] text-center text-sm font-semibold text-brand-950"
                data-testid="panel-quantity"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-brand-200 text-brand-700 hover:bg-brand-50"
                aria-label="Zwiększ ilość"
              >
                +
              </button>
            </div>
          )}

          {/* Action buttons */}
          {isEditing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 rounded-lg border border-brand-300 px-4 py-3 font-medium text-brand-700 hover:bg-brand-50"
              >
                Anuluj
              </button>
              <button
                type="button"
                disabled={!isConfigComplete}
                onClick={handleSaveEdit}
                className="flex-1 rounded-lg bg-sage-600 px-4 py-3 font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
                data-testid="save-edit-button"
              >
                Zapisz
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!isConfigComplete}
              onClick={handleAddToOrder}
              className="w-full rounded-lg bg-sage-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="add-to-order-button"
            >
              Dodaj do zamówienia
            </button>
          )}
        </div>
      </aside>

      {/* Toast notification */}
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
    </>
  );
}
