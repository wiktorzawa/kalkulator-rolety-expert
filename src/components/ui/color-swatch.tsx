import type { Color } from "@/data/types";

interface ColorSwatchProps {
  readonly color: Color;
  readonly isSelected: boolean;
  readonly onSelect: (colorId: string) => void;
}

export function ColorSwatch({ color, isSelected, onSelect }: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(color.id)}
      className={`group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all duration-200 ${
        isSelected ? "bg-sage-50 ring-2 ring-sage-600" : "hover:bg-brand-50"
      }`}
      aria-pressed={isSelected}
      aria-label={`Kolor: ${color.name}`}
    >
      <div
        className={`aspect-square w-full overflow-hidden rounded-lg border transition-transform duration-200 group-hover:scale-105 ${
          isSelected ? "border-sage-600" : "border-brand-200"
        }`}
      >
        {color.img ? (
          <img
            src={`/${color.img}`}
            alt={color.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ backgroundColor: color.hex }}
          />
        )}
      </div>
      <span className="text-center text-xs text-brand-700">{color.name}</span>
    </button>
  );
}
