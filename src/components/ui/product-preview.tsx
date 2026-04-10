import { useState } from "react";
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

/**
 * Builds the gallery image list based on current wizard state.
 */
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

  // 4+. Mounting images — all 5 systems (opis + pomiar each), like Stelge
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
 * Podgląd rolety (packshot) w kroku 3 z galerią miniaturek.
 * Kliknięcie w główne zdjęcie otwiera Modal z powiększeniem.
 */
export function ProductPreview() {
  const { state } = useWizard();
  const [activeIndex, setActiveIndex] = useState(0);
  const modalState = useOverlayState();

  if (!state.fabricId || !state.colorId) {
    return null;
  }

  const collection = fabricIdToCollection(state.fabricId);
  const isBezinwazyjny = state.mountingType === "bezinwazyjny";

  const images = buildGalleryImages(collection, state.colorId, isBezinwazyjny);

  // Clamp activeIndex if images list shrinks
  const safeIndex = activeIndex < images.length ? activeIndex : 0;
  const activeImage = images[safeIndex] ?? images[0];

  if (!activeImage) {
    return null;
  }

  return (
    <>
      <Card className="overflow-hidden" data-testid="product-preview">
        <Card.Content className="p-0">
          {/* Main image — click to enlarge */}
          <button
            type="button"
            className="w-full cursor-zoom-in"
            onClick={() => modalState.open()}
            aria-label="Powiększ zdjęcie"
          >
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="h-auto w-full object-contain transition-all duration-300"
              loading="lazy"
              data-testid="preview-main-image"
            />
          </button>

          {/* Thumbnail row */}
          <div className="flex gap-2 border-t border-brand-100 p-3">
            {images.map((img, idx) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={img.alt}
                className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 transition-all ${
                  idx === safeIndex
                    ? "border-sage-600 shadow-sm"
                    : "border-brand-200 hover:border-brand-400"
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

          {state.mountingType && (
            <div className="border-t border-brand-100 px-3 py-2 text-center text-xs text-brand-500">
              Montaż: {isBezinwazyjny ? "bezinwazyjny" : "inwazyjny"}
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Modal — enlarged image */}
      <Modal state={modalState}>
        <Modal.Backdrop isDismissable>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.Header>
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
    </>
  );
}
