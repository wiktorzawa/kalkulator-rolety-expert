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
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg">
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

      {/* HeroUI Modal — powiększenie zdjęcia */}
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
