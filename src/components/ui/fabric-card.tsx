import { Card } from "@heroui/react";
import type { Fabric } from "@/data/types";
import { getColorsForFabric } from "@/data/fabrics";
import { RatingDots } from "./rating-dots";

interface FabricCardProps {
  readonly fabric: Fabric;
  readonly isSelected: boolean;
  readonly onSelect: (fabricId: string) => void;
}

/**
 * Duża horyzontalna karta tkaniny (wzór Stelge).
 * Desktop: opis po lewej, packshot po prawej.
 * Mobile: packshot na górze, opis pod spodem.
 */
export function FabricCard({ fabric, isSelected, onSelect }: FabricCardProps) {
  const colorCount = getColorsForFabric(fabric.id).length;

  return (
    <button
      type="button"
      onClick={() => onSelect(fabric.id)}
      className="w-full text-left"
      aria-pressed={isSelected}
    >
      <Card
        className={`relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
          isSelected
            ? "border-2 border-sage-600 ring-2 ring-sage-300"
            : "border-2 border-brand-200 hover:border-brand-300"
        }`}
      >
        {isSelected && (
          <div className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-sage-600 text-white shadow-md">
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

        {/* Layout: mobile kolumna, desktop rząd */}
        <div className="flex flex-col sm:flex-row">
          {/* Lewa strona — opis */}
          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
            <div>
              <h3 className="font-display text-lg font-bold text-brand-950 sm:text-xl">
                {fabric.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-600">
                {fabric.longDesc}
              </p>
              <p className="mt-1 text-sm font-bold text-brand-700">
                {colorCount}{" "}
                {colorCount === 1
                  ? "kolor"
                  : colorCount < 5
                    ? "kolory"
                    : "kolorów"}{" "}
                do wyboru.
              </p>
            </div>

            {/* Wskaźniki na dole */}
            <div className="mt-4 flex flex-col gap-1.5 border-t border-brand-100 pt-3">
              <RatingDots value={fabric.darkening} label="Zaciemnienie" />
              <RatingDots value={fabric.thermo} label="Termoizolacja" />
            </div>
          </div>

          {/* Prawa strona — packshot (bez tła, większy) */}
          <div className="flex w-full items-center justify-center p-2 sm:w-2/5 sm:p-4">
            <img
              src={`/${fabric.img}`}
              alt={fabric.name}
              loading="lazy"
              className="h-auto max-h-72 w-auto object-contain sm:max-h-80"
            />
          </div>
        </div>
      </Card>
    </button>
  );
}
