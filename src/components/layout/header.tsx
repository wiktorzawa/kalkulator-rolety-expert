import { useWizard } from "@/context/wizard-context";
import { StepIndicator } from "./step-indicator";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function Header() {
  const { price } = useWizard();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <a
          href="/"
          className="flex items-center gap-2"
          aria-label="rolety.expert — strona główna"
        >
          <img src="/logo.svg" alt="rolety.expert" className="h-8 md:h-10" />
        </a>
        <div className="text-right">
          <span className="text-xs text-brand-400">Cena</span>
          <p className="font-display text-lg font-bold text-brand-950 md:text-xl">
            {formatPrice(price.total)}{" "}
            <span className="text-sm font-normal text-brand-500">zł</span>
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 pb-3">
        <StepIndicator />
      </div>
    </header>
  );
}
