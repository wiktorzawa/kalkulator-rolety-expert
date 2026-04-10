import { useCart } from "@/context/cart-context";
import type { CartItem } from "@/context/cart-types";
import { getPackshotPath, fabricIdToCollection } from "@/data/images";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

interface OrderItemCardProps {
  readonly item: CartItem;
  readonly onEdit: (item: CartItem) => void;
  readonly onDuplicate: (item: CartItem) => void;
}

export function OrderItemCard({
  item,
  onEdit,
  onDuplicate,
}: OrderItemCardProps) {
  const { dispatch: cartDispatch } = useCart();

  const isBezinwazyjny = item.mountingType === "bezinwazyjny";
  const collection = fabricIdToCollection(item.fabricId);
  const packshotSrc = getPackshotPath(collection, item.colorId, isBezinwazyjny);

  const totalItemPrice = item.unitPrice * item.quantity;

  function handleRemove(): void {
    const confirmed = window.confirm(
      `Usunąć "${item.fabricName} — ${item.colorName}" z zamówienia?`,
    );
    if (confirmed) {
      cartDispatch({ type: "REMOVE_ITEM", id: item.id });
    }
  }

  function handleQuantityChange(delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    cartDispatch({
      type: "SET_QUANTITY",
      id: item.id,
      quantity: newQty,
    });
  }

  return (
    <div
      className="rounded-xl border border-brand-200 bg-white p-4"
      data-testid="order-item-card"
    >
      <div className="flex gap-4">
        {/* Miniatura */}
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-brand-50">
          <img
            src={`/${packshotSrc}`}
            alt={`${item.fabricName} — ${item.colorName}`}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Parametry */}
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-brand-950">
            {item.fabricName} — {item.colorName}
          </h3>
          <p className="mt-0.5 text-xs text-brand-500">
            {item.mountingName} ({item.mountingType})
          </p>
          <p className="text-xs text-brand-500">
            {item.widthMm} x {item.heightMm} mm | Listwa: {item.railName}
          </p>

          {/* Cena */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-brand-950">
              {formatPrice(totalItemPrice)} zł
            </span>
            {item.quantity > 1 && (
              <span className="text-xs text-brand-500">
                ({formatPrice(item.unitPrice)} zł/szt.)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Akcje */}
      <div className="mt-3 flex items-center justify-between border-t border-brand-100 pt-3">
        {/* Ilość */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-200 text-brand-700 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Zmniejsz ilość"
          >
            -
          </button>
          <span
            className="min-w-[2rem] text-center text-sm font-medium text-brand-950"
            data-testid="item-quantity"
          >
            {item.quantity} szt.
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-200 text-brand-700 hover:bg-brand-50"
            aria-label="Zwiększ ilość"
          >
            +
          </button>
        </div>

        {/* Edytuj / Duplikuj / Usuń */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-sage-700 hover:bg-sage-50"
          >
            Edytuj
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(item)}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50"
          >
            Duplikuj
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
}
