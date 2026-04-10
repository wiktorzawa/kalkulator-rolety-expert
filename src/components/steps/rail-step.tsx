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

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
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
                  <img
                    src={imgSrc}
                    alt={rail.name}
                    loading="lazy"
                    className="h-16 w-16 cursor-zoom-in rounded-lg border border-brand-200 object-cover transition-transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreview(imgSrc, rail.name);
                    }}
                    data-testid={`rail-image-${rail.id}`}
                  />
                ) : (
                  <div
                    className="h-16 w-16 rounded-lg border border-brand-200"
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
