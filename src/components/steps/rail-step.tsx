import { useRef, useCallback } from "react";
import { useWizard } from "@/context/wizard-context";
import { RAIL_COLORS } from "@/data/rails";

function formatSurcharge(surcharge: number): string {
  if (surcharge === 0) return "";
  return `+${surcharge.toFixed(2).replace(".", ",")} zł`;
}

/**
 * Sekcja listwy aluminiowej wewnątrz ConfigStep.
 * Siatka kart z realnymi zdjęciami prowadnic.
 * Kliknięcie zdjęcia otwiera powiększenie w natywnym <dialog>.
 */
export function RailStep() {
  const { state, dispatch } = useWizard();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const enlargedImgRef = useRef<{ src: string; alt: string }>({
    src: "",
    alt: "",
  });

  function handleSelect(railId: string): void {
    dispatch({ type: "SELECT_RAIL", railId });
  }

  const handleImageClick = useCallback(
    (e: React.MouseEvent, imgSrc: string, imgAlt: string) => {
      e.stopPropagation();
      enlargedImgRef.current = { src: imgSrc, alt: imgAlt };
      const dialog = dialogRef.current;
      if (dialog) {
        // Force re-render of dialog content
        const img = dialog.querySelector("img");
        if (img) {
          img.src = imgSrc;
          img.alt = imgAlt;
        }
        dialog.showModal();
      }
    },
    [],
  );

  const handleDialogClose = useCallback(() => {
    dialogRef.current?.close();
  }, []);

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
            <button
              key={rail.id}
              type="button"
              onClick={() => handleSelect(rail.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 bg-white p-3 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-sage-600 ring-2 ring-sage-300"
                  : "border-brand-200 hover:border-brand-300"
              }`}
              aria-pressed={isSelected}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={rail.name}
                  loading="lazy"
                  className="h-16 w-16 cursor-zoom-in rounded-lg border border-brand-200 object-cover transition-transform hover:scale-110"
                  onClick={(e) => handleImageClick(e, imgSrc, rail.name)}
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
          );
        })}
      </div>

      {/* Native dialog for image enlargement */}
      <dialog
        ref={dialogRef}
        className="max-h-[80vh] max-w-lg rounded-xl border-none bg-white p-0 shadow-2xl backdrop:bg-black/50"
        onClick={handleDialogClose}
        data-testid="rail-lightbox"
      >
        <div className="relative p-4">
          <button
            type="button"
            onClick={handleDialogClose}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 hover:bg-brand-200"
            aria-label="Zamknij powiększenie"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={enlargedImgRef.current.src}
            alt={enlargedImgRef.current.alt}
            className="h-auto w-full rounded-lg object-contain"
          />
        </div>
      </dialog>
    </div>
  );
}
