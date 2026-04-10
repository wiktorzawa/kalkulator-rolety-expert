import { Card } from "@heroui/react";
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
    <Card
      className={`overflow-hidden border-2 transition-all duration-200 ${
        isSelected
          ? "border-sage-600 shadow-md shadow-sage-100"
          : "border-transparent hover:border-brand-200 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(color.id)}
        className="flex w-full flex-col items-center gap-2 p-2"
        aria-pressed={isSelected}
        aria-label={`Kolor: ${color.name}`}
      >
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={`/${swatchPath}`}
            alt={color.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
            onError={(e) => {
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
          className={`text-center text-xs font-medium ${
            isSelected ? "text-sage-700" : "text-brand-700"
          }`}
        >
          {color.name}
        </span>
      </button>
    </Card>
  );
}
