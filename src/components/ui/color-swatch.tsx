import type { Color } from "@/data/types";
import { fabricIdToCollection, getFabricSwatchPath } from "@/data/images";

interface ColorSwatchProps {
  readonly color: Color;
  readonly fabricId: string;
  readonly isSelected: boolean;
  readonly onSelect: (colorId: string) => void;
}

export function ColorSwatch({
  color,
  fabricId,
  isSelected,
  onSelect,
}: ColorSwatchProps) {
  const collection = fabricIdToCollection(fabricId);
  const swatchPath = getFabricSwatchPath(collection, color.id);

  return (
    <button
      type="button"
      onClick={() => onSelect(color.id)}
      className={`group flex flex-col items-center gap-2 rounded-xl p-2.5 transition-all duration-200 ${
        isSelected
          ? "bg-sage-50 ring-2 ring-sage-600 shadow-sm"
          : "hover:bg-brand-50 hover:shadow-sm"
      }`}
      aria-pressed={isSelected}
      aria-label={`Kolor: ${color.name}`}
    >
      <div
        className={`aspect-square w-full overflow-hidden rounded-xl border-2 transition-all duration-200 group-hover:scale-105 group-hover:shadow-md ${
          isSelected
            ? "border-sage-600 shadow-md"
            : "border-brand-200 group-hover:border-brand-300"
        }`}
      >
        <img
          src={`/${swatchPath}`}
          alt={color.name}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback to hex color square if image fails to load
            const target = e.currentTarget;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.style.backgroundColor = color.hex;
            }
          }}
        />
      </div>
      <span
        className={`text-center text-xs font-medium transition-colors ${
          isSelected ? "text-sage-700" : "text-brand-700"
        }`}
      >
        {color.name}
      </span>
    </button>
  );
}
