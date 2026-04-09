import { useEffect } from "react";
import { useWizard } from "@/context/wizard-context";
import { MOUNTING_SYSTEMS } from "@/data/mounting";
import { MountingCard } from "@/components/ui/mounting-card";
import type { MountingCategory } from "@/data/types";
import { analytics } from "@/lib/analytics";

export function MountingStep() {
  const { state, dispatch } = useWizard();

  useEffect(() => {
    analytics.trackStep(3);
  }, []);

  const bezinwazyjne = MOUNTING_SYSTEMS.filter(
    (m) => m.type === "bezinwazyjny",
  );
  const inwazyjne = MOUNTING_SYSTEMS.filter((m) => m.type === "inwazyjny");

  function handleSelect(
    mountingId: string,
    mountingType: MountingCategory,
  ): void {
    dispatch({ type: "SELECT_MOUNTING", mountingId, mountingType });

    requestAnimationFrame(() => {
      document.getElementById("step-4")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  return (
    <section id="step-3" aria-label="Krok 3: Montaz">
      <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
        3. Wybierz montaz
      </h2>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-brand-900">
              Bezinwazyjny
            </h3>
            <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-medium text-sage-700">
              Rekomendowany
            </span>
          </div>
          <p className="mb-3 text-sm text-brand-500">
            Bez wkrecania w okno — idealny do wynajmowanych mieszkan.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {bezinwazyjne.map((m) => (
              <MountingCard
                key={m.id}
                mounting={m}
                isSelected={state.mountingId === m.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-brand-900">
              Inwazyjny
            </h3>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-600">
              Najtrwalszy
            </span>
          </div>
          <p className="mb-3 text-sm text-brand-500">
            Wkrecany w rame okienna — najtrwalsze i najbardziej stabilne
            rozwiazanie.
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {inwazyjne.map((m) => (
              <MountingCard
                key={m.id}
                mounting={m}
                isSelected={state.mountingId === m.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
