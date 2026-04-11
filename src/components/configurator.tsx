import { WizardProvider, useWizard } from "@/context/wizard-context";
import { useCart } from "@/context/cart-context";
import { useBeforeunload } from "@/hooks/use-beforeunload";
import { Header } from "./layout/header";
import { PricePanel } from "./layout/price-panel";
import { StepContent } from "./step-content";
import { OrderList } from "./order/order-list";

function BeforeunloadGuard() {
  const { state: cartState } = useCart();
  const { state: wizardState } = useWizard();

  const hasItems = cartState.items.length > 0;
  const isEditing = wizardState.editingItemId !== null;
  const orderSubmitted = cartState.orderSubmitted;

  useBeforeunload((hasItems || isEditing) && !orderSubmitted);

  return null;
}

function ConfiguratorContent() {
  const { state: cartState } = useCart();

  if (cartState.view === "order-list") {
    return (
      <WizardProvider>
        <BeforeunloadGuard />
        <div className="flex min-h-screen flex-col bg-brand-50">
          <header className="sticky top-0 z-40 border-b border-brand-200 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <a
                href="/"
                className="flex items-center gap-2"
                aria-label="rolety.expert — strona główna"
              >
                <img
                  src="/logo.png"
                  alt="rolety.expert"
                  className="h-8 w-auto md:h-10"
                />
              </a>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
            <OrderList />
          </main>
        </div>
      </WizardProvider>
    );
  }

  return (
    <WizardProvider>
      <BeforeunloadGuard />
      <div className="flex min-h-screen flex-col bg-brand-50">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-32 md:pb-6">
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
