import { useWizard } from "@/context/wizard-context";
import { FabricStep } from "./steps/fabric-step";
import { ColorStep } from "./steps/color-step";
import { MountingStep } from "./steps/mounting-step";
import { DimensionsStep } from "./steps/dimensions-step";
import { RailStep } from "./steps/rail-step";

/**
 * Renders all wizard steps. Steps 1..current are visible (scroll-based flow).
 * Steps beyond current are hidden.
 */
export function StepContent() {
  const { state } = useWizard();

  return (
    <div className="space-y-12">
      <FabricStep />
      {state.step >= 2 && <ColorStep />}
      {state.step >= 3 && <MountingStep />}
      {state.step >= 4 && <DimensionsStep />}
      {state.step >= 4 && <RailStep />}
    </div>
  );
}
