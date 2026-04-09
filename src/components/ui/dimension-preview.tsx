interface DimensionPreviewProps {
  readonly widthMm: number;
  readonly heightMm: number;
}

const MAX_PREVIEW_HEIGHT = 200;
const MAX_PREVIEW_WIDTH = 160;
const FOLD_HEIGHT_PX = 8;

export function DimensionPreview({ widthMm, heightMm }: DimensionPreviewProps) {
  const ratio = widthMm / heightMm;
  let previewHeight = MAX_PREVIEW_HEIGHT;
  let previewWidth = previewHeight * ratio;

  if (previewWidth > MAX_PREVIEW_WIDTH) {
    previewWidth = MAX_PREVIEW_WIDTH;
    previewHeight = previewWidth / ratio;
  }

  const foldCount = Math.max(2, Math.floor(previewHeight / FOLD_HEIGHT_PX));

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative overflow-hidden rounded border border-brand-300 bg-brand-50"
        style={{ width: previewWidth, height: previewHeight }}
        aria-label={`Podglad wymiarow: ${widthMm} x ${heightMm} mm`}
      >
        {Array.from({ length: foldCount }, (_, i) => (
          <div
            key={i}
            className="border-b border-brand-200"
            style={{ height: previewHeight / foldCount }}
          />
        ))}
      </div>
      <p className="text-center text-xs font-medium text-brand-700">
        {widthMm} x {heightMm} mm
      </p>
    </div>
  );
}
