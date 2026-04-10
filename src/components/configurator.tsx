import { WizardProvider } from "@/context/wizard-context";
import { useCart } from "@/context/cart-context";
import { Header } from "./layout/header";
import { PricePanel } from "./layout/price-panel";
import { StepContent } from "./step-content";
import { OrderListPlaceholder } from "./order/order-list-placeholder";

function ConfiguratorContent() {
  const { state: cartState } = useCart();

  if (cartState.view === "order-list") {
    return (
      <div className="flex min-h-screen flex-col bg-brand-50">
        <header className="sticky top-0 z-40 border-b border-brand-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <a
              href="/"
              className="flex items-center gap-2"
              aria-label="rolety.expert — strona główna"
            >
              <img
                src="/logo.svg"
                alt="rolety.expert"
                className="h-8 md:h-10"
              />
            </a>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
          <OrderListPlaceholder />
        </main>
      </div>
    );
  }

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

export function Configurator() {
  return <ConfiguratorContent />;
}
