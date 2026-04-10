import { Card, Button } from "@heroui/react";
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
    <Card className="p-4" data-testid="order-item-card">
      <Card.Content className="p-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {/* Miniatura */}
          <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-lg bg-brand-50 sm:h-24 sm:w-20">
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
        <div className="mt-3 flex flex-col gap-3 border-t border-brand-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Ilość */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              isIconOnly
              isDisabled={item.quantity <= 1}
              onPress={() => handleQuantityChange(-1)}
              aria-label="Zmniejsz ilość"
            >
              -
            </Button>
            <span
              className="min-w-[2rem] text-center text-sm font-medium text-brand-950"
              data-testid="item-quantity"
            >
              {item.quantity} szt.
            </span>
            <Button
              variant="outline"
              size="sm"
              isIconOnly
              onPress={() => handleQuantityChange(1)}
              aria-label="Zwiększ ilość"
            >
              +
            </Button>
          </div>

          {/* Edytuj / Duplikuj / Usuń */}
          <div className="flex gap-1 sm:ml-auto">
            <Button variant="ghost" size="sm" onPress={() => onEdit(item)}>
              Edytuj
            </Button>
            <Button variant="ghost" size="sm" onPress={() => onDuplicate(item)}>
              Duplikuj
            </Button>
            <Button variant="danger-soft" size="sm" onPress={handleRemove}>
              Usuń
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
