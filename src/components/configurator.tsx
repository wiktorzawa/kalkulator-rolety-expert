import { WizardProvider } from "@/context/wizard-context";
import { Header } from "./layout/header";
import { PricePanel } from "./layout/price-panel";
import { StepContent } from "./step-content";

export function Configurator() {
  return (
    <WizardProvider>
      <div className="flex min-h-screen flex-col bg-brand-50">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 pb-32 md:pb-6">
          <StepContent />
        </main>
        <PricePanel />
      </div>
    </WizardProvider>
  );
}
