import { Button } from "@heroui/react";

export function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-brand-950">
        Konfigurator <span className="text-sage-600">Rolet</span>
      </h1>
      <p className="text-brand-500 text-lg text-center max-w-md">
        Wybierz tkaninę, kolor, wymiary i montaż — cena aktualizuje się na
        bieżąco.
      </p>
      <Button variant="primary" size="lg" className="bg-sage-600 text-white">
        Rozpocznij konfigurację
      </Button>
    </div>
  );
}
