import { useState, useEffect } from "react";
import { Slider, Button, Input } from "@heroui/react";

interface DimensionInputProps {
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly quickValues: readonly number[];
  readonly unit: string;
  readonly onChange: (value: number) => void;
}

/**
 * Dimension input: synchronized HeroUI Slider + Input.
 * Input accepts any value freely. Clamping happens on blur.
 * Slider uses step=1 for smooth movement.
 */
export function DimensionInput({
  label,
  value,
  min,
  max,
  quickValues,
  unit,
  onChange,
}: DimensionInputProps) {
  // Local state for the input field to allow free typing
  const [inputValue, setInputValue] = useState(String(value));

  // Sync local state when value changes externally (e.g. from slider or quick button)
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  function handleSliderChange(newValue: number | number[]): void {
    const raw = typeof newValue === "number" ? newValue : newValue[0];
    if (raw !== undefined) {
      onChange(raw);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    // Allow free typing — no clamping on change
    setInputValue(e.target.value);
  }

  function handleInputBlur(): void {
    const raw = Number(inputValue);
    if (Number.isNaN(raw) || inputValue.trim() === "") {
      // Reset to current value
      setInputValue(String(value));
      return;
    }
    const clamped = Math.max(min, Math.min(max, raw));
    onChange(clamped);
    setInputValue(String(clamped));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-display text-sm font-semibold text-brand-900">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-20"
            aria-label={`${label} w ${unit}`}
          />
          <span className="text-sm text-brand-500">{unit}</span>
        </div>
      </div>

      <Slider
        value={value}
        minValue={min}
        maxValue={max}
        step={1}
        onChange={handleSliderChange}
        aria-label={`${label} suwak`}
      >
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      <div className="flex flex-wrap gap-1.5">
        {quickValues.map((qv) => (
          <Button
            key={qv}
            variant={value === qv ? "primary" : "outline"}
            size="sm"
            onPress={() => onChange(qv)}
            aria-label={`Ustaw ${label.toLowerCase()} na ${qv} ${unit}`}
          >
            {qv}
          </Button>
        ))}
      </div>
    </div>
  );
}
