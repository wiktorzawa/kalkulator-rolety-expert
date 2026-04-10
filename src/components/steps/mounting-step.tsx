import { useState, useEffect } from "react";
import { useWizard } from "@/context/wizard-context";
import { MOUNTING_SYSTEMS } from "@/data/mounting";
import { MountingCarousel } from "@/components/ui/mounting-carousel";
import type { MountingCategory } from "@/data/types";
import { analytics } from "@/lib/analytics";

/**
 * Sekcja montażu wewnątrz ConfigStep.
 * Dwupoziomowy wybór: kategoria (bezinwazyjny/inwazyjny) → karuzela systemów.
 */
export function MountingStep() {
  const { state, dispatch } = useWizard();

  useEffect(() => {
    analytics.trackStep(3);
  }, []);

  // Determine initial category from state or default to null
  const [selectedCategory, setSelectedCategory] =
    useState<MountingCategory | null>(state.mountingType);

  // Sync category when mounting changes externally (e.g. LOAD_ITEM)
  useEffect(() => {
    if (state.mountingType) {
      setSelectedCategory(state.mountingType);
    }
  }, [state.mountingType]);

  const bezinwazyjne = MOUNTING_SYSTEMS.filter(
    (m) => m.type === "bezinwazyjny",
  );
  const inwazyjne = MOUNTING_SYSTEMS.filter((m) => m.type === "inwazyjny");

  function handleCategorySelect(category: MountingCategory): void {
    setSelectedCategory(category);
  }

  function handleSystemSelect(
    mountingId: string,
    mountingType: MountingCategory,
  ): void {
    dispatch({ type: "SELECT_MOUNTING", mountingId, mountingType });
  }

  const activeSystems =
    selectedCategory === "bezinwazyjny" ? bezinwazyjne : inwazyjne;

  return (
    <div aria-label="Montaż">
      <h3 className="mb-4 font-display text-lg font-bold text-brand-900">
        Typ montażu
      </h3>

      {/* Category buttons */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleCategorySelect("bezinwazyjny")}
          className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
            selectedCategory === "bezinwazyjny"
              ? "border-sage-600 bg-sage-50 ring-1 ring-sage-300"
              : "border-brand-200 bg-white hover:border-brand-300"
          }`}
          data-testid="category-bezinwazyjny"
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="font-display text-sm font-bold text-brand-950">
              Bezinwazyjny
            </span>
            <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-medium text-sage-700">
              Rekomendowany
            </span>
          </div>
          <p className="text-xs text-brand-500">
            Bez wkręcania w okno — idealny do wynajmowanych mieszkań.
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleCategorySelect("inwazyjny")}
          className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${
            selectedCategory === "inwazyjny"
              ? "border-sage-600 bg-sage-50 ring-1 ring-sage-300"
              : "border-brand-200 bg-white hover:border-brand-300"
          }`}
          data-testid="category-inwazyjny"
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="font-display text-sm font-bold text-brand-950">
              Inwazyjny
            </span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-600">
              Najtrwalszy
            </span>
          </div>
          <p className="text-xs text-brand-500">
            Wkręcany w ramę okienną — najtrwalsze i najbardziej stabilne
            rozwiązanie.
          </p>
        </button>
      </div>

      {/* Mounting systems carousel */}
      {selectedCategory && (
        <>
          <MountingCarousel
            systems={activeSystems}
            selectedId={state.mountingId}
            onSelect={handleSystemSelect}
          />
          <p className="mt-3 text-center text-xs text-brand-400">
            Kolor systemu montażowego będzie taki sam jak wybrany kolor listwy.
          </p>
        </>
      )}
    </div>
  );
}
