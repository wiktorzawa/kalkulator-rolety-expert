import { useEffect, useRef, useState } from "react";
import { Card, Modal, useOverlayState } from "@heroui/react";
import { useWizard } from "@/context/wizard-context";
import { getColorsForFabric } from "@/data/fabrics";
import { RAIL_COLORS } from "@/data/rails";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { analytics } from "@/lib/analytics";

function formatSurcharge(surcharge: number): string {
  if (surcharge === 0) return "";
  return `+${surcharge.toFixed(2).replace(".", ",")} zł`;
}

export function ColorStep() {
  const { state, dispatch } = useWizard();
  const railSectionRef = useRef<HTMLDivElement>(null);
  const modalState = useOverlayState();
  const [enlargedImg, setEnlargedImg] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    analytics.trackStep(2);
  }, []);

  const colors = state.fabricId ? getColorsForFabric(state.fabricId) : [];

  function handleColorSelect(colorId: string): void {
    dispatch({ type: "SELECT_COLOR", colorId });

    // Smooth scroll to rail section after color selection
    requestAnimationFrame(() => {
      railSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function handleRailSelect(railId: string): void {
    dispatch({ type: "SELECT_RAIL", railId });

    // Scroll to step 3 after rail selection (step 2 will be complete)
    if (state.colorId !== null) {
      requestAnimationFrame(() => {
        document
          .getElementById("step-3")
          ?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  function openPreview(src: string, alt: string): void {
    setEnlargedImg({ src, alt });
    modalState.open();
  }

  const fabricId = state.fabricId;

  if (!fabricId) {
    return (
      <section id="step-2" aria-label="Krok 2: Kolor">
        <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
          2. Wybierz kolor
        </h2>
        <p className="text-brand-500">Najpierw wybierz tkaninę.</p>
      </section>
    );
  }

  return (
    <section id="step-2" aria-label="Krok 2: Kolor">
      {/* 2a. Kolor materiału */}
      <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
        2a. Wybierz kolor materiału
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {colors.map((color) => (
          <ColorSwatch
            key={color.id}
            color={color}
            fabricId={fabricId}
            isSelected={state.colorId === color.id}
            onSelect={handleColorSelect}
          />
        ))}
      </div>

      {/* 2b. Kolor listwy aluminiowej */}
      <div ref={railSectionRef} className="mt-10">
        <h2 className="mb-4 font-display text-2xl font-bold text-brand-950">
          2b. Kolor listwy aluminiowej
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
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
                  onClick={() => handleRailSelect(rail.id)}
                  className="flex w-full flex-col items-center gap-2 p-2"
                  aria-pressed={isSelected}
                >
                  {imgSrc ? (
                    <div className="aspect-square w-full overflow-hidden rounded-lg">
                      <img
                        src={imgSrc}
                        alt={rail.name}
                        loading="lazy"
                        className="h-full w-full cursor-zoom-in object-cover transition-transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(imgSrc, rail.name);
                        }}
                        data-testid={`rail-image-${rail.id}`}
                      />
                    </div>
                  ) : (
                    <div
                      className="aspect-square w-full rounded-lg border border-brand-200"
                      style={{ backgroundColor: rail.hex }}
                    />
                  )}
                  <span className="text-xs font-medium text-brand-900">
                    {rail.name}
                  </span>
                  <span className="text-xs text-brand-500">{rail.type}</span>
                  {rail.surcharge > 0 && (
                    <span className="text-xs font-medium text-accent-600">
                      {formatSurcharge(rail.surcharge)}
                    </span>
                  )}
                </button>
              </Card>
            );
          })}
        </div>
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
    </section>
  );
}
