import { useEffect } from "react";
import { useWizard } from "@/context/wizard-context";
import { getColorsForFabric } from "@/data/fabrics";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { analytics } from "@/lib/analytics";

export function ColorStep() {
  const { state, dispatch } = useWizard();

  useEffect(() => {
    analytics.trackStep(2);
  }, []);

  const colors = state.fabricId ? getColorsForFabric(state.fabricId) : [];

  function handleSelect(colorId: string): void {
    dispatch({ type: "SELECT_COLOR", colorId });

    requestAnimationFrame(() => {
      document.getElementById("step-3")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (!state.fabricId) {
    return (
      <section id="step-2" aria-label="Krok 2: Kolor">
        <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
          2. Wybierz kolor
        </h2>
        <p className="text-brand-500">Najpierw wybierz tkaninę.</p>
      </section>
    );
  }

  return (
    <section id="step-2" aria-label="Krok 2: Kolor">
      <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
        2. Wybierz kolor
      </h2>
      <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
        {colors.map((color) => (
          <ColorSwatch
            key={color.id}
            color={color}
            isSelected={state.colorId === color.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </section>
  );
}
