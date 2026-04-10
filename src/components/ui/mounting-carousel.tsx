import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { MountingSystem, MountingCategory } from "@/data/types";
import { MAX_WIDTH_GLUED } from "@/data/pricing";
import { getMountingCloseupPaths, getMountingImagePath } from "@/data/images";

interface MountingCarouselProps {
  readonly systems: readonly MountingSystem[];
  readonly selectedId: string | null;
  readonly onSelect: (
    mountingId: string,
    mountingType: MountingCategory,
  ) => void;
}

/**
 * Karuzela systemów montażu (Embla Carousel).
 * Pokazuje zbliżenia profilu + opis + grafikę pomiarową.
 */
export function MountingCarousel({
  systems,
  selectedId,
  onSelect,
}: MountingCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (systems.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {systems.map((system) => {
            const isSelected = selectedId === system.id;
            const isGlued = system.id === "klejony";
            const fullId = `${system.type === "bezinwazyjny" ? "bezinwazyjny" : "inwazyjny"}-${system.id}`;
            const closeups = getMountingCloseupPaths(fullId);
            const measureImg = getMountingImagePath(fullId, "pomiar");

            return (
              <div
                key={system.id}
                className="min-w-[280px] flex-shrink-0 md:min-w-[320px]"
              >
                <button
                  type="button"
                  onClick={() => onSelect(system.id, system.type)}
                  className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected
                      ? "border-sage-600 ring-2 ring-sage-300"
                      : "border-brand-200 hover:border-brand-300"
                  }`}
                  aria-pressed={isSelected}
                  data-testid={`mounting-carousel-${system.id}`}
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

                  {/* Zbliżenia profilu */}
                  {closeups.length > 0 && (
                    <div className="flex gap-1 bg-brand-50 p-2">
                      {closeups.map((path) => (
                        <img
                          key={path}
                          src={`/${path}`}
                          alt={`Zbliżenie ${system.name}`}
                          loading="lazy"
                          className="h-24 flex-1 rounded object-contain"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 p-3">
                    <h4 className="font-display text-sm font-bold text-brand-950">
                      {system.name}
                    </h4>
                    {system.desc && (
                      <p className="text-xs text-brand-500">{system.desc}</p>
                    )}
                    {isGlued && (
                      <p
                        className="text-xs font-medium text-amber-600"
                        role="alert"
                      >
                        Max szerokość: {MAX_WIDTH_GLUED} mm
                      </p>
                    )}
                  </div>

                  {/* Grafika pomiarowa */}
                  {isSelected && (
                    <div className="border-t border-brand-100 bg-brand-50 p-3">
                      <p className="mb-2 text-xs font-medium text-brand-700">
                        Jak mierzyć okno:
                      </p>
                      <img
                        src={`/${measureImg}`}
                        alt={`Pomiar dla montażu ${system.name}`}
                        loading="lazy"
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      {systems.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute -left-3 top-1/3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-brand-200 bg-white shadow-sm hover:bg-brand-50"
            aria-label="Poprzedni system montażu"
          >
            <svg
              className="h-4 w-4 text-brand-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute -right-3 top-1/3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-brand-200 bg-white shadow-sm hover:bg-brand-50"
            aria-label="Następny system montażu"
          >
            <svg
              className="h-4 w-4 text-brand-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
