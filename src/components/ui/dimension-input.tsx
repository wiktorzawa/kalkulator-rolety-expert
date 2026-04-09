interface DimensionInputProps {
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly quickValues: readonly number[];
  readonly unit: string;
  readonly onChange: (value: number) => void;
}

export function DimensionInput({
  label,
  value,
  min,
  max,
  step,
  quickValues,
  unit,
  onChange,
}: DimensionInputProps) {
  function handleSlider(e: React.ChangeEvent<HTMLInputElement>): void {
    onChange(Number(e.target.value));
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>): void {
    const raw = Number(e.target.value);
    if (Number.isNaN(raw)) return;
    const clamped = Math.max(min, Math.min(max, raw));
    onChange(clamped);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-display text-sm font-semibold text-brand-900">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleInput}
            className="w-20 rounded-lg border border-brand-200 px-2 py-1 text-right text-sm font-medium text-brand-950 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
            aria-label={`${label} w ${unit}`}
          />
          <span className="text-sm text-brand-500">{unit}</span>
        </div>
      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleSlider}
        className="w-full accent-sage-600"
        aria-label={`${label} suwak`}
      />

      <div className="flex flex-wrap gap-1.5">
        {quickValues.map((qv) => (
          <button
            key={qv}
            type="button"
            onClick={() => onChange(qv)}
            className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
              value === qv
                ? "border-sage-600 bg-sage-50 text-sage-700"
                : "border-brand-200 text-brand-600 hover:border-brand-300 hover:bg-brand-50"
            }`}
            aria-label={`Ustaw ${label.toLowerCase()} na ${qv} ${unit}`}
          >
            {qv}
          </button>
        ))}
      </div>
    </div>
  );
}
