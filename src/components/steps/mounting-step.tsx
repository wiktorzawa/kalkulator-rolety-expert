import { useState, useEffect } from "react";
import { Card, Modal, useOverlayState } from "@heroui/react";
import { useWizard } from "@/context/wizard-context";
import { MOUNTING_SYSTEMS } from "@/data/mounting";
import { MAX_WIDTH_GLUED } from "@/data/pricing";
import { getMountingCloseupPaths, getMountingImagePath } from "@/data/images";
import type { MountingCategory, MountingSystem } from "@/data/types";
import { analytics } from "@/lib/analytics";

/**
 * Sekcja montażu wewnątrz ConfigStep.
 * Dwupoziomowy wybór: kategoria (bezinwazyjny/inwazyjny) → siatka systemów z galerią zdjęć.
 * Używa HeroUI Card + Modal.
 */
export function MountingStep() {
  const { state, dispatch } = useWizard();
  const modalState = useOverlayState();

  useEffect(() => {
    analytics.trackStep(3);
  }, []);

  const [selectedCategory, setSelectedCategory] =
    useState<MountingCategory | null>(state.mountingType);

  const [previewImg, setPreviewImg] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    if (state.mountingType) {
      setSelectedCategory(state.mountingType);
    }
  }, [state.mountingType]);

  const bezinwazyjne = MOUNTING_SYSTEMS.filter(
    (m) => m.type === "bezinwazyjny",
  );
  const inwazyjne = MOUNTING_SYSTEMS.filter((m) => m.type === "inwazyjny");

  function handleCategorySelect(category: MountingCategory): void {
    setSelectedCategory(category);
  }

  function handleSystemSelect(system: MountingSystem): void {
    dispatch({
      type: "SELECT_MOUNTING",
      mountingId: system.id,
      mountingType: system.type,
    });
  }

  function openPreview(src: string, alt: string): void {
    setPreviewImg({ src, alt });
    modalState.open();
  }

  const activeSystems =
    selectedCategory === "bezinwazyjny" ? bezinwazyjne : inwazyjne;

  return (
    <div aria-label="Montaż">
      <h3 className="mb-4 font-display text-lg font-bold text-brand-900">
        Typ montażu
      </h3>

      {/* Kategorie montażu — HeroUI Card */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Card
          className={`cursor-pointer border-2 transition-all ${
            selectedCategory === "bezinwazyjny"
              ? "border-sage-600 bg-sage-50/50"
              : "border-transparent hover:border-brand-200"
          }`}
        >
          <button
            type="button"
            className="w-full p-4 text-left"
            onClick={() => handleCategorySelect("bezinwazyjny")}
            data-testid="category-bezinwazyjny"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="font-display text-sm font-bold text-brand-950">
                Bezinwazyjny
              </span>
              <span className="rounded-full bg-sage-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                Rekomendowany
              </span>
            </div>
            <p className="text-xs leading-relaxed text-brand-500">
              Bez wkręcania w okno — idealny do wynajmowanych mieszkań.
            </p>
          </button>
        </Card>

        <Card
          className={`cursor-pointer border-2 transition-all ${
            selectedCategory === "inwazyjny"
              ? "border-sage-600 bg-sage-50/50"
              : "border-transparent hover:border-brand-200"
          }`}
        >
          <button
            type="button"
            className="w-full p-4 text-left"
            onClick={() => handleCategorySelect("inwazyjny")}
            data-testid="category-inwazyjny"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="font-display text-sm font-bold text-brand-950">
                Inwazyjny
              </span>
              <span className="rounded-full bg-brand-200 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                Najtrwalszy
              </span>
            </div>
            <p className="text-xs leading-relaxed text-brand-500">
              Wkręcany w ramę okienną — najtrwalsze i najbardziej stabilne
              rozwiązanie.
            </p>
          </button>
        </Card>
      </div>

      {/* Systemy montażu — siatka HeroUI Card */}
      {selectedCategory && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeSystems.map((system) => {
              const isSelected = state.mountingId === system.id;
              const isGlued = system.id === "klejony";
              const fullId = `${system.type === "bezinwazyjny" ? "bezinwazyjny" : "inwazyjny"}-${system.id}`;
              const closeups = getMountingCloseupPaths(fullId);
              const measureImg = getMountingImagePath(fullId, "pomiar");
              const descImg = getMountingImagePath(fullId, "opis");

              return (
                <Card
                  key={system.id}
                  className={`overflow-hidden border-2 transition-all ${
                    isSelected
                      ? "border-sage-600 shadow-lg shadow-sage-100"
                      : "border-transparent hover:border-brand-200 hover:shadow-md"
                  }`}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => handleSystemSelect(system)}
                    aria-pressed={isSelected}
                    data-testid={`mounting-system-${system.id}`}
                  >
                    {/* Galeria zdjęć zbliżeń profilu */}
                    {closeups.length > 0 && (
                      <div className="grid grid-cols-2 gap-0.5 bg-brand-50 p-1">
                        {closeups.map((path) => (
                          <img
                            key={path}
                            src={`/${path}`}
                            alt={`Zbliżenie ${system.name}`}
                            loading="lazy"
                            className="aspect-square w-full cursor-zoom-in rounded object-cover transition-transform hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPreview(
                                `/${path}`,
                                `Zbliżenie profilu ${system.name}`,
                              );
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <Card.Content className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="font-display text-base font-bold text-brand-950">
                          {system.name}
                        </h4>
                        {isSelected && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-600 text-white">
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
                          </span>
                        )}
                      </div>

                      {system.desc && (
                        <p className="mb-2 text-sm leading-relaxed text-brand-600">
                          {system.desc}
                        </p>
                      )}

                      {isGlued && (
                        <p
                          className="text-xs font-semibold text-amber-600"
                          role="alert"
                        >
                          ⚠ Max szerokość: {MAX_WIDTH_GLUED} mm
                        </p>
                      )}
                    </Card.Content>
                  </button>

                  {/* Grafiki pomiarowe — widoczne po wybraniu */}
                  {isSelected && (
                    <Card.Footer className="flex gap-2 border-t border-brand-100 bg-brand-50/50 p-3">
                      <button
                        type="button"
                        className="flex-1 overflow-hidden rounded-lg border border-brand-200 transition-shadow hover:shadow-md"
                        onClick={() =>
                          openPreview(
                            `/${descImg}`,
                            `Opis montażu ${system.name}`,
                          )
                        }
                      >
                        <img
                          src={`/${descImg}`}
                          alt={`Opis montażu ${system.name}`}
                          loading="lazy"
                          className="h-24 w-full object-contain"
                        />
                        <span className="block bg-white px-2 py-1 text-center text-[10px] font-medium text-brand-500">
                          Opis montażu
                        </span>
                      </button>
                      <button
                        type="button"
                        className="flex-1 overflow-hidden rounded-lg border border-brand-200 transition-shadow hover:shadow-md"
                        onClick={() =>
                          openPreview(
                            `/${measureImg}`,
                            `Jak mierzyć okno — ${system.name}`,
                          )
                        }
                      >
                        <img
                          src={`/${measureImg}`}
                          alt={`Pomiar ${system.name}`}
                          loading="lazy"
                          className="h-24 w-full object-contain"
                        />
                        <span className="block bg-white px-2 py-1 text-center text-[10px] font-medium text-brand-500">
                          Jak mierzyć
                        </span>
                      </button>
                    </Card.Footer>
                  )}
                </Card>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-brand-400">
            Kolor systemu montażowego będzie taki sam jak wybrany kolor listwy.
          </p>
        </>
      )}

      {/* HeroUI Modal — powiększenie zdjęcia */}
      <Modal state={modalState}>
        <Modal.Backdrop isDismissable>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body className="p-2">
                {previewImg && (
                  <img
                    src={previewImg.src}
                    alt={previewImg.alt}
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
