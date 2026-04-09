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
      className={`relative flex flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isSelected
          ? "border-sage-600 ring-2 ring-sage-300"
          : "border-brand-200 hover:border-brand-300"
      }`}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-sage-600 text-white">
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

      {mounting.img && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-brand-50">
          <img
            src={`/${mounting.img}`}
            alt={`Montaż ${mounting.name}`}
            loading="lazy"
            className="h-full w-full object-contain p-2"
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5 p-3">
        <h4 className="font-display text-sm font-bold text-brand-950">
          {mounting.name}
        </h4>

        {mounting.desc && (
          <p className="text-xs text-brand-500">{mounting.desc}</p>
        )}

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
      </div>

      {isSelected && mounting.measureImg && (
        <div className="border-t border-brand-100 bg-brand-50 p-3">
          <p className="mb-2 text-xs font-medium text-brand-700">
            Jak mierzyć okno:
          </p>
          <img
            src={`/${mounting.measureImg}`}
            alt={`Pomiar dla montażu ${mounting.name}`}
            loading="lazy"
            className="w-full rounded-lg"
          />
        </div>
      )}
    </button>
  );
}
