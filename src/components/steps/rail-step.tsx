import { useState } from "react";
import { Card, Modal, useOverlayState } from "@heroui/react";
import { useWizard } from "@/context/wizard-context";
import { RAIL_COLORS } from "@/data/rails";

function formatSurcharge(surcharge: number): string {
  if (surcharge === 0) return "";
  return `+${surcharge.toFixed(2).replace(".", ",")} zł`;
}

/**
 * Sekcja listwy aluminiowej wewnątrz ConfigStep.
 * Siatka HeroUI Card z realnymi zdjęciami prowadnic.
 * Kliknięcie zdjęcia → HeroUI Modal z powiększeniem.
 */
export function RailStep() {
  const { state, dispatch } = useWizard();
  const modalState = useOverlayState();
  const [enlargedImg, setEnlargedImg] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  function handleSelect(railId: string): void {
    dispatch({ type: "SELECT_RAIL", railId });
  }

  function openPreview(src: string, alt: string): void {
    setEnlargedImg({ src, alt });
    modalState.open();
  }

  return (
    <div aria-label="Listwa aluminiowa">
      <h3 className="mb-4 font-display text-lg font-bold text-brand-900">
        Kolor listwy aluminiowej
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {RAIL_COLORS.map((rail) => {
          const isSelected = state.railId === rail.id;
          const imgSrc = rail.img ? `/${rail.img}` : null;

          return (
            <Card
              key={rail.id}
              className={`overflow-hidden border-2 transition-all ${
                isSelected
                  ? "border-sage-600 shadow-md shadow-sage-100"
                  : "border-transparent hover:border-brand-200 hover:shadow-sm"
              }`}
            >
              <button
                type="button"
                onClick={() => handleSelect(rail.id)}
                className="flex w-full flex-col items-center gap-2 p-3"
                aria-pressed={isSelected}
              >
                {imgSrc ? (
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-brand-200">
                    <img
                      src={imgSrc}
                      alt={rail.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                      data-testid={`rail-image-${rail.id}`}
                    />
                    {/* Ikona lupy — powiększenie zdjęcia listwy */}
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Powiększ zdjęcie: ${rail.name}`}
                      title="Powiększ zdjęcie"
                      className="absolute bottom-1.5 right-1.5 flex h-7 w-7 cursor-zoom-in items-center justify-center rounded-full bg-white/85 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreview(imgSrc, rail.name);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          e.preventDefault();
                          openPreview(imgSrc, rail.name);
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3.5 w-3.5 text-brand-700"
                      >
                        <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div
                    className="aspect-square w-full rounded-lg border border-brand-200"
                    style={{ backgroundColor: rail.hex }}
                  />
                )}
                <span className="text-center text-xs font-medium text-brand-900">
                  {rail.name}
                </span>
                <span className="text-center text-xs text-brand-500">
                  {rail.type}
                </span>
                {rail.surcharge > 0 && (
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700">
                    {formatSurcharge(rail.surcharge)}
                  </span>
                )}
              </button>
            </Card>
          );
        })}
      </div>

      {/* HeroUI Modal — powiększenie zdjęcia listwy */}
      <Modal state={modalState}>
        <Modal.Backdrop isDismissable>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body className="p-4">
                {enlargedImg && (
                  <img
                    src={enlargedImg.src}
                    alt={enlargedImg.alt}
                    className="h-auto w-full rounded-lg object-contain"
                  />
                )}
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
