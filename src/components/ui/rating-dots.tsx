interface RatingDotsProps {
  readonly value: number;
  readonly max?: number;
  readonly label: string;
}

export function RatingDots({ value, max = 5, label }: RatingDotsProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-brand-500">{label}</span>
      <div className="flex gap-0.5" aria-label={`${label}: ${value} z ${max}`}>
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={`inline-block h-2 w-2 rounded-full ${
              i < value ? "bg-sage-500" : "bg-brand-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
