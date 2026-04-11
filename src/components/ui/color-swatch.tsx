import { Card } from "@heroui/react";
import type { Color } from "@/data/types";
import {
  fabricIdToCollection,
  getFabricSwatchPath,
  getPackshotPath,
} from "@/data/images";

interface ColorSwatchProps {
  readonly color: Color;
  readonly fabricId: string;
  readonly isSelected: boolean;
  readonly onSelect: (colorId: string) => void;
}

/**
 * Karta koloru z dwoma warstwami zdjęć:
 * - Domyślnie: packshot (roleta na oknie)
 * - Hover (desktop) / tap (mobile): zbliżenie tkaniny
 * Kliknięcie = wybór koloru.
 */
export function ColorSwatch({
  color,
  fabricId,
  isSelected,
  onSelect,
}: ColorSwatchProps) {
  const collection = fabricIdToCollection(fabricId);
  const packshotSrc = `/${getPackshotPath(collection, color.id, false)}`;
  const swatchSrc = `/${getFabricSwatchPath(collection, color.id)}`;

  return (
    <Card
      className={`group overflow-hidden border-2 transition-all duration-200 ${
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
        {/* Kontener zdjęć — hover przełącza packshot ↔ zbliżenie */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
          {/* Warstwa 1: Packshot (domyślnie widoczny) */}
          <img
            src={packshotSrc}
            alt={`${color.name} — roleta na oknie`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.style.backgroundColor = color.hex;
              }
            }}
          />

          {/* Warstwa 2: Zbliżenie tkaniny (widoczne na hover) */}
          <img
            src={swatchSrc}
            alt={`${color.name} — zbliżenie tkaniny`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          {/* Etykieta podpowiadająca */}
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            zbliżenie tkaniny
          </span>
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
