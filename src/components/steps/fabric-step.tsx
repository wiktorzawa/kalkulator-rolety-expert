import { useEffect } from "react";
import { useWizard } from "@/context/wizard-context";
import { FABRICS } from "@/data/fabrics";
import { FabricCard } from "@/components/ui/fabric-card";
import { analytics } from "@/lib/analytics";

export function FabricStep() {
  const { state, dispatch } = useWizard();

  useEffect(() => {
    analytics.trackStep(1);
  }, []);

  function handleSelect(fabricId: string): void {
    dispatch({ type: "SELECT_FABRIC", fabricId });

    requestAnimationFrame(() => {
      document.getElementById("step-2")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  return (
    <section id="step-1" aria-label="Krok 1: Tkanina">
      <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
        1. Wybierz tkaninę
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FABRICS.map((fabric) => (
          <FabricCard
            key={fabric.id}
            fabric={fabric}
            isSelected={state.fabricId === fabric.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </section>
  );
}
