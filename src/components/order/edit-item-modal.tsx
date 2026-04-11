import { useState, useMemo } from "react";
import { Modal, useOverlayState, Button, Slider, Input } from "@heroui/react";
import { FABRICS, getColorsForFabric, getFabricById } from "@/data/fabrics";
import { MOUNTING_SYSTEMS, getMountingById } from "@/data/mounting";
import { RAIL_COLORS } from "@/data/rails";
import { calculatePrice } from "@/utils/pricing";
import { MAX_WIDTH_GLUED } from "@/data/pricing";
import {
  MIN_WIDTH_MM,
  MAX_WIDTH_MM,
  MIN_HEIGHT_MM,
  MAX_HEIGHT_MM,
} from "@/context/wizard-types";
import { useCart } from "@/context/cart-context";
import type { CartItem } from "@/context/cart-types";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

interface EditItemModalProps {
  readonly item: CartItem;
  readonly state: ReturnType<typeof useOverlayState>;
}

/**
 * Modal edycji pozycji zamówienia.
 * Kompaktowy formularz z selectami i suwakami wymiarów.
 */
export function EditItemModal({ item, state: modalState }: EditItemModalProps) {
  const { dispatch } = useCart();

  const [fabricId, setFabricId] = useState(item.fabricId);
  const [colorId, setColorId] = useState(item.colorId);
  const [mountingId, setMountingId] = useState(item.mountingId);
  const [railId, setRailId] = useState(item.railId);
  const [widthMm, setWidthMm] = useState(item.widthMm);
  const [heightMm, setHeightMm] = useState(item.heightMm);
  const [quantity, setQuantity] = useState(item.quantity);

  const colors = useMemo(() => getColorsForFabric(fabricId), [fabricId]);
  const mounting = getMountingById(mountingId);
  const mountingType = mounting?.type ?? "bezinwazyjny";
  const isGlued = mountingId === "klejony";
  const maxWidth = isGlued ? MAX_WIDTH_GLUED : MAX_WIDTH_MM;

  // Recalculate price
  const price = useMemo(
    () =>
      calculatePrice({
        fabricId,
        mountingType,
        widthMm,
        heightMm,
        railId,
      }),
    [fabricId, mountingType, widthMm, heightMm, railId],
  );

  function handleFabricChange(newFabricId: string): void {
    setFabricId(newFabricId);
    // Reset color if not available in new fabric
    const newColors = getColorsForFabric(newFabricId);
    if (!newColors.some((c) => c.id === colorId)) {
      setColorId(newColors[0]?.id ?? "");
    }
  }

  function handleMountingChange(newMountingId: string): void {
    setMountingId(newMountingId);
    // Clamp width if switching to glued
    const newMounting = getMountingById(newMountingId);
    if (newMounting?.id === "klejony" && widthMm > MAX_WIDTH_GLUED) {
      setWidthMm(MAX_WIDTH_GLUED);
    }
  }

  function handleWidthChange(val: number | number[]): void {
    const raw = typeof val === "number" ? val : val[0];
    if (raw !== undefined) {
      setWidthMm(Math.min(raw, maxWidth));
    }
  }

  function handleHeightChange(val: number | number[]): void {
    const raw = typeof val === "number" ? val : val[0];
    if (raw !== undefined) {
      setHeightMm(raw);
    }
  }

  function handleSave(): void {
    const fabric = getFabricById(fabricId);
    const color = colors.find((c) => c.id === colorId);
    const rail = RAIL_COLORS.find((r) => r.id === railId);

    if (!fabric || !color || !mounting || !rail) return;

    dispatch({
      type: "UPDATE_ITEM",
      id: item.id,
      item: {
        fabricId,
        fabricName: fabric.name,
        colorId,
        colorName: color.name,
        mountingId,
        mountingName: mounting.name,
        mountingType,
        widthMm,
        heightMm,
        railId,
        railName: rail.name,
        quantity,
        unitPrice: price.total,
      },
    });

    modalState.close();
  }

  return (
    <Modal state={modalState}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.Header>
              <h3 className="font-display text-lg font-bold text-brand-950">
                Edytuj produkt
              </h3>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body className="space-y-5 p-5">
              {/* Materiał */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-brand-800">
                  Materiał
                </label>
                <select
                  value={fabricId}
                  onChange={(e) => handleFabricChange(e.target.value)}
                  className="w-full rounded-lg border border-brand-300 bg-white px-3 py-2.5 text-sm text-brand-900 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200"
                >
                  {FABRICS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kolor materiału */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-brand-800">
                  Kolor materiału
                </label>
                <select
                  value={colorId}
                  onChange={(e) => setColorId(e.target.value)}
                  className="w-full rounded-lg border border-brand-300 bg-white px-3 py-2.5 text-sm text-brand-900 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200"
                >
                  {colors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rodzaj montażu */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-brand-800">
                  Rodzaj montażu
                </label>
                <select
                  value={mountingId}
                  onChange={(e) => handleMountingChange(e.target.value)}
                  className="w-full rounded-lg border border-brand-300 bg-white px-3 py-2.5 text-sm text-brand-900 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200"
                >
                  <optgroup label="Bezinwazyjny">
                    {MOUNTING_SYSTEMS.filter(
                      (m) => m.type === "bezinwazyjny",
                    ).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Inwazyjny">
                    {MOUNTING_SYSTEMS.filter((m) => m.type === "inwazyjny").map(
                      (m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ),
                    )}
                  </optgroup>
                </select>
                {isGlued && (
                  <p className="mt-1 text-xs text-amber-600">
                    Montaż klejony: max szerokość {MAX_WIDTH_GLUED} mm
                  </p>
                )}
              </div>

              {/* Wymiary */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-brand-800">
                    Szerokość (mm)
                  </label>
                  <Input
                    type="number"
                    value={String(widthMm)}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v))
                        setWidthMm(
                          Math.max(MIN_WIDTH_MM, Math.min(maxWidth, v)),
                        );
                    }}
                    className="mb-2"
                  />
                  <Slider
                    value={widthMm}
                    minValue={MIN_WIDTH_MM}
                    maxValue={maxWidth}
                    step={1}
                    onChange={handleWidthChange}
                    aria-label="Szerokość"
                  >
                    <Slider.Track>
                      <Slider.Fill />
                      <Slider.Thumb />
                    </Slider.Track>
                  </Slider>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-brand-800">
                    Wysokość (mm)
                  </label>
                  <Input
                    type="number"
                    value={String(heightMm)}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v))
                        setHeightMm(
                          Math.max(MIN_HEIGHT_MM, Math.min(MAX_HEIGHT_MM, v)),
                        );
                    }}
                    className="mb-2"
                  />
                  <Slider
                    value={heightMm}
                    minValue={MIN_HEIGHT_MM}
                    maxValue={MAX_HEIGHT_MM}
                    step={1}
                    onChange={handleHeightChange}
                    aria-label="Wysokość"
                  >
                    <Slider.Track>
                      <Slider.Fill />
                      <Slider.Thumb />
                    </Slider.Track>
                  </Slider>
                </div>
              </div>

              {/* Kolor listwy */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-brand-800">
                  Kolor listwy aluminiowej
                </label>
                <select
                  value={railId}
                  onChange={(e) => setRailId(e.target.value)}
                  className="w-full rounded-lg border border-brand-300 bg-white px-3 py-2.5 text-sm text-brand-900 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200"
                >
                  {RAIL_COLORS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.type})
                      {r.surcharge > 0
                        ? ` +${formatPrice(r.surcharge)} zł`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ilość */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-brand-800">
                  Ilość
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    isIconOnly
                    isDisabled={quantity <= 1}
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </Button>
                  <span className="min-w-[2rem] text-center text-base font-semibold text-brand-950">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    isIconOnly
                    onPress={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Cena */}
              <div className="rounded-lg bg-brand-50 p-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-brand-600">Cena za sztukę</span>
                  <span className="font-display text-lg font-bold text-brand-950">
                    {formatPrice(price.total)} zł
                  </span>
                </div>
                {quantity > 1 && (
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm text-brand-600">
                      Razem ({quantity} szt.)
                    </span>
                    <span className="font-display text-lg font-bold text-brand-950">
                      {formatPrice(price.total * quantity)} zł
                    </span>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer className="flex gap-3 p-5 pt-0">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onPress={modalState.close}
              >
                Anuluj
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onPress={handleSave}
              >
                Zapisz zmiany
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
