import { Card } from "@heroui/react";
import { useWizard } from "@/context/wizard-context";
import { getPackshotPath, fabricIdToCollection } from "@/data/images";

/**
 * Podgląd rolety (packshot) w kroku 3.
 * Zmienia się dynamicznie przy zmianie montażu (bezinwazyjny/inwazyjny).
 */
export function ProductPreview() {
  const { state } = useWizard();

  if (!state.fabricId || !state.colorId) {
    return null;
  }

  const collection = fabricIdToCollection(state.fabricId);
  const isBezinwazyjny = state.mountingType === "bezinwazyjny";
  const packshotPath = getPackshotPath(
    collection,
    state.colorId,
    isBezinwazyjny,
  );

  return (
    <Card className="overflow-hidden" data-testid="product-preview">
      <Card.Content className="p-0">
        <img
          src={`/${packshotPath}`}
          alt={`Podgląd rolety — ${state.colorId}`}
          className="h-auto w-full object-contain transition-all duration-300"
          loading="lazy"
        />
        {state.mountingType && (
          <div className="border-t border-brand-100 px-3 py-2 text-center text-xs text-brand-500">
            Montaż: {isBezinwazyjny ? "bezinwazyjny" : "inwazyjny"}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
