import { useWizard } from "@/context/wizard-context";
import {
  MIN_WIDTH_MM,
  MAX_WIDTH_MM,
  MIN_HEIGHT_MM,
  MAX_HEIGHT_MM,
} from "@/context/wizard-types";
import { MAX_WIDTH_GLUED } from "@/data/pricing";
import { DimensionInput } from "@/components/ui/dimension-input";
import { DimensionPreview } from "@/components/ui/dimension-preview";

const WIDTH_QUICK = [500, 600, 700, 800, 900, 1000, 1200] as const;
const HEIGHT_QUICK = [800, 1000, 1200, 1400, 1500, 1800, 2000] as const;
const STEP_MM = 10;

export function DimensionsStep() {
  const { state, dispatch } = useWizard();

  const isGlued = state.mountingId === "klejony";
  const maxWidth = isGlued ? MAX_WIDTH_GLUED : MAX_WIDTH_MM;

  function handleWidthChange(width: number): void {
    const clamped = Math.min(width, maxWidth);
    dispatch({
      type: "SET_DIMENSIONS",
      widthMm: clamped,
      heightMm: state.heightMm,
    });
  }

  function handleHeightChange(height: number): void {
    dispatch({
      type: "SET_DIMENSIONS",
      widthMm: state.widthMm,
      heightMm: height,
    });
  }

  return (
    <section id="step-4" aria-label="Krok 4: Wymiary">
      <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
        4. Podaj wymiary
      </h2>

      {isGlued && (
        <div
          className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
          role="alert"
        >
          Montaz klejony — maksymalna szerokosc: {MAX_WIDTH_GLUED} mm
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <DimensionInput
            label="Szerokosc"
            value={state.widthMm}
            min={MIN_WIDTH_MM}
            max={maxWidth}
            step={STEP_MM}
            quickValues={WIDTH_QUICK.filter((v) => v <= maxWidth)}
            unit="mm"
            onChange={handleWidthChange}
          />

          <DimensionInput
            label="Wysokosc"
            value={state.heightMm}
            min={MIN_HEIGHT_MM}
            max={MAX_HEIGHT_MM}
            step={STEP_MM}
            quickValues={[...HEIGHT_QUICK]}
            unit="mm"
            onChange={handleHeightChange}
          />
        </div>

        <div className="flex items-center justify-center">
          <DimensionPreview widthMm={state.widthMm} heightMm={state.heightMm} />
        </div>
      </div>
    </section>
  );
}
