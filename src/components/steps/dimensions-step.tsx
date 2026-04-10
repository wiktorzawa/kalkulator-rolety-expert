import { useWizard } from "@/context/wizard-context";
import {
  MIN_WIDTH_MM,
  MAX_WIDTH_MM,
  MIN_HEIGHT_MM,
  MAX_HEIGHT_MM,
} from "@/context/wizard-types";
import { MAX_WIDTH_GLUED } from "@/data/pricing";
import { DimensionInput } from "@/components/ui/dimension-input";

const WIDTH_QUICK = [500, 600, 700, 800, 900, 1000, 1200] as const;
const HEIGHT_QUICK = [800, 1000, 1200, 1400, 1500, 1800, 2000] as const;

/**
 * Sekcja wymiarów wewnątrz ConfigStep.
 * Dwa suwaki + pola numeryczne (szerokość/wysokość).
 * Alert gdy montaż klejony i wymiar > 1200mm.
 */
export function DimensionsStep() {
  const { state, dispatch } = useWizard();

  const isGlued = state.mountingId === "klejony";
  const maxWidth = isGlued ? MAX_WIDTH_GLUED : MAX_WIDTH_MM;
  const isOverGluedLimit = isGlued && state.widthMm > MAX_WIDTH_GLUED;

  function handleWidthChange(width: number): void {
    dispatch({
      type: "SET_DIMENSIONS",
      widthMm: width,
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
    <div aria-label="Wymiary">
      <h3 className="mb-4 font-display text-lg font-bold text-brand-900">
        Wymiary
      </h3>

      {isGlued && (
        <div
          className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
          role="alert"
          data-testid="glued-max-width-alert"
        >
          Montaż klejony — maksymalna szerokość: {MAX_WIDTH_GLUED} mm
        </div>
      )}

      {isOverGluedLimit && (
        <div
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800"
          role="alert"
          data-testid="glued-over-limit-alert"
        >
          Szerokość {state.widthMm} mm przekracza maksimum {MAX_WIDTH_GLUED} mm
          dla montażu klejonego!
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <DimensionInput
          label="Szerokość"
          value={state.widthMm}
          min={MIN_WIDTH_MM}
          max={maxWidth}
          quickValues={WIDTH_QUICK.filter((v) => v <= maxWidth)}
          unit="mm"
          onChange={handleWidthChange}
        />

        <DimensionInput
          label="Wysokość"
          value={state.heightMm}
          min={MIN_HEIGHT_MM}
          max={MAX_HEIGHT_MM}
          quickValues={[...HEIGHT_QUICK]}
          unit="mm"
          onChange={handleHeightChange}
        />
      </div>
    </div>
  );
}
