import { useState } from "react";
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
 * Duża karta koloru z packshot + kółko zbliżenia tkaniny.
 * Kliknięcie kółka przełącza widok między packshot a zbliżeniem.
 */
export function ColorSwatch({
  color,
  fabricId,
  isSelected,
  onSelect,
}: ColorSwatchProps) {
  const [showSwatch, setShowSwatch] = useState(false);

  const collection = fabricIdToCollection(fabricId);
  const packshotSrc = `/${getPackshotPath(collection, color.id, false)}`;
  const swatchSrc = `/${getFabricSwatchPath(collection, color.id)}`;

  const mainSrc = showSwatch ? swatchSrc : packshotSrc;
  const overlaySrc = showSwatch ? packshotSrc : swatchSrc;

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
        {/* Główne zdjęcie z kółkiem overlay */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg">
          <img
            src={mainSrc}
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

          {/* Kółko z alternatywnym widokiem */}
          <div
            role="button"
            tabIndex={0}
            aria-label={
              showSwatch ? "Pokaż packshot rolety" : "Pokaż zbliżenie tkaniny"
            }
            className="absolute bottom-2 right-2 h-11 w-11 cursor-pointer overflow-hidden rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 sm:h-10 sm:w-10"
            onClick={(e) => {
              e.stopPropagation();
              setShowSwatch((prev) => !prev);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                e.preventDefault();
                setShowSwatch((prev) => !prev);
              }
            }}
          >
            <img
              src={overlaySrc}
              alt={showSwatch ? "Packshot" : "Zbliżenie tkaniny"}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
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
