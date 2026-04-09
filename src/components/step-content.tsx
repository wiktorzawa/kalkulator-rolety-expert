import { useWizard } from "@/context/wizard-context";
import { STEP_LABELS } from "@/context/wizard-types";

/**
 * Renders the current wizard step content.
 * Individual step components will be added in Phase 3 (Unit 5-6).
 */
export function StepContent() {
  const { state } = useWizard();

  const label = STEP_LABELS[state.step - 1];

  return (
    <section aria-label={`Krok ${state.step}: ${label}`}>
      <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
        {state.step}. {label}
      </h2>
      <p className="text-brand-500">
        Krok &quot;{label}&quot; zostanie zaimplementowany w kolejnej fazie.
      </p>
    </section>
  );
}
