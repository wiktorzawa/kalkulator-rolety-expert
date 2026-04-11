import { useWizard } from "@/context/wizard-context";
import { ProductPreview } from "@/components/ui/product-preview";
import { MountingStep } from "./mounting-step";
import { DimensionsStep } from "./dimensions-step";
import { RailStep } from "./rail-step";

/**
 * Krok 3: Konfiguracja — composite step.
 * Desktop: podgląd po lewej + config (montaż + wymiary + listwa) po prawej.
 * Mobile: podgląd na górze + config pod spodem.
 */
export function ConfigStep() {
  const { state } = useWizard();

  const showPreview = state.fabricId !== null && state.colorId !== null;

  return (
    <section id="step-3" aria-label="Krok 3: Konfiguracja">
      <h2 className="mb-6 font-display text-2xl font-bold text-brand-950">
        3. Skonfiguruj swoją roletę
      </h2>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Podgląd (left on desktop, top on mobile) */}
        {showPreview && (
          <div className="flex-shrink-0 lg:sticky lg:top-28 lg:self-start lg:w-64 xl:w-72">
            <ProductPreview />
          </div>
        )}

        {/* Config sections (right on desktop, bottom on mobile) */}
        <div className="min-w-0 flex-1 space-y-10">
          <MountingStep />
          <DimensionsStep />
          <RailStep />
        </div>
      </div>
    </section>
  );
}
