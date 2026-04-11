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
 *  2. Kolor materiału + Kolor listwy aluminiowej
 *  3. Konfiguracja (montaż + wymiary + podgląd)
 */
export function StepContent() {
  const { state } = useWizard();

  return (
    <div className="space-y-12">
      <FabricStep />
      {state.step >= 2 && <ColorStep />}
      {state.step >= 3 && <ConfigStep />}
    </div>
  );
}
