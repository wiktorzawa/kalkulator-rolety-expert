import { useCart } from "@/context/cart-context";

/**
 * Placeholder for the order list view (Unit 6 will implement full version).
 * Shows cart items count and a button to go back to configurator.
 */
export function OrderListPlaceholder() {
  const { state, dispatch, totalPrice, totalItems } = useCart();

  function handleAddNew(): void {
    dispatch({ type: "SET_VIEW", view: "configurator" });
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-brand-950">
        Twoje zamówienie
      </h2>

      {state.items.length === 0 ? (
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
        <div className="space-y-4">
          <div className="rounded-xl border border-brand-200 bg-white p-4">
            <p className="text-sm text-brand-600">
              Pozycji w zamówieniu:{" "}
              <strong className="text-brand-950">{totalItems}</strong>
            </p>
            <p className="text-sm text-brand-600">
              Suma:{" "}
              <strong className="text-brand-950">
                {totalPrice.toFixed(2).replace(".", ",")} zł
              </strong>
            </p>
          </div>

          {state.items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-brand-200 bg-white p-4"
            >
              <p className="text-sm font-medium text-brand-950">
                {item.fabricName} — {item.colorName}
              </p>
              <p className="text-xs text-brand-500">
                {item.mountingName} | {item.widthMm}x{item.heightMm}mm |{" "}
                {item.railName} | {item.quantity} szt.
              </p>
              <p className="text-sm font-semibold text-brand-900">
                {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")}{" "}
                zł
              </p>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddNew}
            className="w-full rounded-lg border border-sage-600 px-6 py-2 font-medium text-sage-700 hover:bg-sage-50"
          >
            Dodaj kolejną plisę
          </button>
        </div>
      )}
    </div>
  );
}
