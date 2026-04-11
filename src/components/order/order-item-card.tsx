import { Card, Button, useOverlayState } from "@heroui/react";
import { useCart } from "@/context/cart-context";
import type { CartItem } from "@/context/cart-types";
import { getPackshotPath, fabricIdToCollection } from "@/data/images";
import { EditItemModal } from "./edit-item-modal";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

interface OrderItemCardProps {
  readonly item: CartItem;
}

export function OrderItemCard({ item }: OrderItemCardProps) {
  const { dispatch: cartDispatch } = useCart();
  const editModalState = useOverlayState();

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
    <>
      <Card className="p-4" data-testid="order-item-card">
        <Card.Content className="p-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
            {/* Miniatura */}
            <div className="h-36 w-full flex-shrink-0 overflow-hidden rounded-lg bg-brand-50 sm:h-28 sm:w-24">
              <img
                src={`/${packshotSrc}`}
                alt={`${item.fabricName} — ${item.colorName}`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>

            {/* Parametry w tabeli */}
            <div className="min-w-0 flex-1">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-0.5 pr-4 text-brand-500">Materiał</td>
                    <td className="py-0.5 font-medium text-brand-800">
                      {item.fabricName}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-0.5 pr-4 text-brand-500">
                      Kolor materiału
                    </td>
                    <td className="py-0.5 text-brand-800">{item.colorName}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 pr-4 text-brand-500">Kolor listwy</td>
                    <td className="py-0.5 text-brand-800">{item.railName}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 pr-4 text-brand-500">Wymiar</td>
                    <td className="py-0.5 text-brand-800">
                      {item.widthMm} x {item.heightMm} mm
                    </td>
                  </tr>
                  <tr>
                    <td className="py-0.5 pr-4 text-brand-500">
                      Rodzaj montażu
                    </td>
                    <td className="py-0.5 text-brand-800">
                      {item.mountingName} ({item.mountingType})
                    </td>
                  </tr>
                  <tr>
                    <td className="py-0.5 pr-4 text-brand-500">Cena</td>
                    <td className="py-0.5 font-semibold text-brand-950">
                      {formatPrice(totalItemPrice)} zł
                      {item.quantity > 1 && (
                        <span className="ml-1 font-normal text-brand-500">
                          ({formatPrice(item.unitPrice)} zł/szt.)
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
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

            {/* Edytuj / Usuń */}
            <div className="flex gap-1 sm:ml-auto">
              <Button variant="ghost" size="sm" onPress={editModalState.open}>
                Edytuj
              </Button>
              <Button variant="danger-soft" size="sm" onPress={handleRemove}>
                Usuń
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Modal edycji */}
      <EditItemModal item={item} state={editModalState} />
    </>
  );
}
