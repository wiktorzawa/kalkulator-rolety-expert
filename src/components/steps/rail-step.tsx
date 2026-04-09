import { useWizard } from "@/context/wizard-context";
import { RAIL_COLORS } from "@/data/rails";

function formatSurcharge(surcharge: number): string {
  if (surcharge === 0) return "";
  return `+${surcharge.toFixed(2).replace(".", ",")} zl`;
}

export function RailStep() {
  const { state, dispatch } = useWizard();

  function handleSelect(railId: string): void {
    dispatch({ type: "SELECT_RAIL", railId });
  }

  return (
    <section id="step-5" aria-label="Krok 5: Listwa">
      <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
        5. Kolor listwy aluminiowej
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        {RAIL_COLORS.map((rail) => {
          const isSelected = state.railId === rail.id;
          return (
            <button
              key={rail.id}
              type="button"
              onClick={() => handleSelect(rail.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 bg-white p-3 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-sage-600 ring-2 ring-sage-300"
                  : "border-brand-200 hover:border-brand-300"
              }`}
              aria-pressed={isSelected}
            >
              <div
                className="h-12 w-12 rounded-lg border border-brand-200"
                style={{ backgroundColor: rail.hex }}
              />
              <span className="text-center text-xs font-medium text-brand-900">
                {rail.name}
              </span>
              <span className="text-center text-xs text-brand-500">
                {rail.type}
              </span>
              {rail.surcharge > 0 && (
                <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700">
                  {formatSurcharge(rail.surcharge)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
