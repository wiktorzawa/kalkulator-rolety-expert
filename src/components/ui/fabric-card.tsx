import type { Fabric } from "@/data/types";
import { RatingDots } from "./rating-dots";

interface FabricCardProps {
  readonly fabric: Fabric;
  readonly isSelected: boolean;
  readonly onSelect: (fabricId: string) => void;
}

export function FabricCard({ fabric, isSelected, onSelect }: FabricCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(fabric.id)}
      className={`relative flex flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
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

      <div className="aspect-[3/4] w-full overflow-hidden bg-brand-100">
        <img
          src={`/${fabric.img}`}
          alt={fabric.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-display text-sm font-bold text-brand-950">
          {fabric.name}
        </h3>
        <p className="text-xs text-brand-500">{fabric.desc}</p>
        <div className="mt-auto flex flex-col gap-0.5 pt-2">
          <RatingDots value={fabric.darkening} label="Zaciemnienie" />
          <RatingDots value={fabric.thermo} label="Termoizolacja" />
        </div>
      </div>
    </button>
  );
}
