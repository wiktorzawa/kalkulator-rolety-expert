import { useWizard } from "@/context/wizard-context";
import { FabricStep } from "./steps/fabric-step";
import { ColorStep } from "./steps/color-step";
import { ConfigStep } from "./steps/config-step";

/**
 * Renders all wizard steps. Steps 1..current are visible (scroll-based flow).
 * Steps beyond current are hidden.
 *
 * 3-krokowy layout:
 *  1. Tkanina
 *  2. Kolor
 *  3. Konfiguracja (montaż + wymiary + listwa + podgląd)
 */
export function StepContent() {
  const { state } = useWizard();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <FabricStep />
      </div>
      {state.step >= 2 && (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <ColorStep />
        </div>
      )}
      {state.step >= 3 && (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <ConfigStep />
        </div>
      )}
    </div>
  );
}
