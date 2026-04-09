import type { MountingSystem, MountingCategory } from "@/data/types";
import { MAX_WIDTH_GLUED } from "@/data/pricing";

interface MountingCardProps {
  readonly mounting: MountingSystem;
  readonly isSelected: boolean;
  readonly onSelect: (
    mountingId: string,
    mountingType: MountingCategory,
  ) => void;
}

export function MountingCard({
  mounting,
  isSelected,
  onSelect,
}: MountingCardProps) {
  const isGlued = mounting.id === "klejony";

  return (
    <button
      type="button"
      onClick={() => onSelect(mounting.id, mounting.type)}
      className={`relative flex flex-col gap-2 rounded-xl border-2 bg-white p-4 text-left transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-sage-600 ring-2 ring-sage-300"
          : "border-brand-200 hover:border-brand-300"
      }`}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sage-600 text-white">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      <h4 className="font-display text-sm font-bold text-brand-950">
        {mounting.name}
      </h4>

      <span className="inline-block w-fit rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-600">
        {mounting.type === "bezinwazyjny" ? "Bezinwazyjny" : "Inwazyjny"}
      </span>

      {isGlued && (
        <p
          className="text-xs font-medium text-amber-600"
          role="alert"
          data-testid="glued-warning"
        >
          Max szerokość: {MAX_WIDTH_GLUED} mm
        </p>
      )}
    </button>
  );
}
