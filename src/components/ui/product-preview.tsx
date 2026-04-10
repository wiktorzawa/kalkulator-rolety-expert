import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, Modal, useOverlayState } from "@heroui/react";
import { useWizard } from "@/context/wizard-context";
import {
  getPackshotPath,
  getFabricSwatchPath,
  getMountingImagePath,
  fabricIdToCollection,
} from "@/data/images";
import { MOUNTING_SYSTEMS } from "@/data/mounting";

interface GalleryImage {
  readonly src: string;
  readonly alt: string;
}

function buildGalleryImages(
  collection: string,
  colorId: string,
  isBezinwazyjny: boolean,
): GalleryImage[] {
  const images: GalleryImage[] = [];

  // 1. Active packshot (matching current mounting type)
  images.push({
    src: `/${getPackshotPath(collection, colorId, isBezinwazyjny)}`,
    alt: isBezinwazyjny
      ? "Packshot rolety — montaż bezinwazyjny"
      : "Packshot rolety — montaż inwazyjny",
  });

  // 2. Alternate packshot
  images.push({
    src: `/${getPackshotPath(collection, colorId, !isBezinwazyjny)}`,
    alt: !isBezinwazyjny
      ? "Packshot rolety — montaż bezinwazyjny"
      : "Packshot rolety — montaż inwazyjny",
  });

  // 3. Fabric swatch close-up
  images.push({
    src: `/${getFabricSwatchPath(collection, colorId)}`,
    alt: "Zbliżenie tkaniny",
  });

  // 4+. All mounting systems (opis + pomiar each)
  for (const system of MOUNTING_SYSTEMS) {
    const sysFullId = `${system.type}-${system.id}`;
    images.push({
      src: `/${getMountingImagePath(sysFullId, "opis")}`,
      alt: `Opis montażu — ${system.name}`,
    });
    images.push({
      src: `/${getMountingImagePath(sysFullId, "pomiar")}`,
      alt: `Pomiar — ${system.name}`,
    });
  }

  return images;
}

/**
 * Galeria produktu z Embla Carousel (główne zdjęcie) + miniaturki nawigacyjne.
 * Kliknięcie w główne zdjęcie otwiera HeroUI Modal z powiększeniem.
 */
export function ProductPreview() {
  const { state } = useWizard();
  const modalState = useOverlayState();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Main carousel
  const [mainRef, mainApi] = useEmblaCarousel({ loop: false });
  // Thumbs carousel (horizontal scroll)
  const [thumbsRef] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    axis: "x",
  });

  // Sync main carousel selection with thumbnails
  const onMainSelect = useCallback(() => {
    if (!mainApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;
    mainApi.on("select", onMainSelect);
    onMainSelect();
    return () => {
      mainApi.off("select", onMainSelect);
    };
  }, [mainApi, onMainSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi],
  );

  if (!state.fabricId || !state.colorId) {
    return null;
  }

  const collection = fabricIdToCollection(state.fabricId);
  const isBezinwazyjny = state.mountingType === "bezinwazyjny";
  const images = buildGalleryImages(collection, state.colorId, isBezinwazyjny);
  const activeImage = images[selectedIndex] ?? images[0];

  return (
    <>
      <Card className="overflow-hidden" data-testid="product-preview">
        <Card.Content className="p-0">
          {/* Main carousel with prev/next arrows */}
          <div className="group relative">
            <div className="overflow-hidden" ref={mainRef}>
              <div className="flex">
                {images.map((img, idx) => (
                  <div key={img.src} className="min-w-0 flex-[0_0_100%]">
                    <button
                      type="button"
                      className="w-full cursor-zoom-in"
                      onClick={() => {
                        setSelectedIndex(idx);
                        modalState.open();
                      }}
                      aria-label={`Powiększ: ${img.alt}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="aspect-square w-full object-contain bg-white p-2"
                        loading={idx < 3 ? "eager" : "lazy"}
                        data-testid={
                          idx === 0 ? "preview-main-image" : undefined
                        }
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Prev arrow */}
            {selectedIndex > 0 && (
              <button
                type="button"
                onClick={() => scrollTo(selectedIndex - 1)}
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-opacity hover:bg-white sm:h-10 sm:w-10"
                aria-label="Poprzednie zdjęcie"
              >
                <svg
                  className="h-5 w-5 text-brand-700"
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
            )}

            {/* Next arrow */}
            {selectedIndex < images.length - 1 && (
              <button
                type="button"
                onClick={() => scrollTo(selectedIndex + 1)}
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-opacity hover:bg-white sm:h-10 sm:w-10"
                aria-label="Następne zdjęcie"
              >
                <svg
                  className="h-5 w-5 text-brand-700"
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
            )}

            {/* Counter */}
            <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnails carousel */}
          <div className="border-t border-brand-100 bg-brand-50/50 p-2">
            <div className="overflow-hidden" ref={thumbsRef}>
              <div className="flex gap-1.5">
                {images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => scrollTo(idx)}
                    aria-label={img.alt}
                    aria-current={idx === selectedIndex ? "true" : undefined}
                    className={`h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-14 sm:w-14 ${
                      idx === selectedIndex
                        ? "border-sage-600 shadow-sm"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    data-testid={`preview-thumb-${idx}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {state.mountingType && (
            <div className="border-t border-brand-100 px-3 py-2 text-center text-xs text-brand-500">
              Montaż: {isBezinwazyjny ? "bezinwazyjny" : "inwazyjny"}
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Modal — powiększenie */}
      {activeImage && (
        <Modal state={modalState}>
          <Modal.Backdrop isDismissable>
            <Modal.Container size="lg">
              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Heading className="text-sm">
                    {activeImage.alt}
                  </Modal.Heading>
                  <Modal.CloseTrigger />
                </Modal.Header>
                <Modal.Body className="p-4">
                  <img
                    src={activeImage.src}
                    alt={activeImage.alt}
                    className="h-auto w-full rounded-lg object-contain"
                  />
                </Modal.Body>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </>
  );
}
