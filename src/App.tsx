import { useEffect } from "react";
import { CartProvider } from "@/context/cart-context";
import { Configurator } from "@/components/configurator";
import { OrderLookup } from "@/components/order/order-lookup";
import { parseOrderParam, parseUtmSource } from "@/utils/order-number";
import { analytics } from "@/lib/analytics";

export function App() {
  const orderNumber = parseOrderParam(window.location.search);
  const utmSource = parseUtmSource(window.location.search);

  useEffect(() => {
    analytics.init();
    if (utmSource) {
      analytics.setUserProperties({ utm_source: utmSource });
    }
  }, [utmSource]);

  if (orderNumber) {
    return (
      <div className="min-h-screen bg-brand-50">
        <header className="sticky top-0 z-20 border-b border-brand-200 bg-white/95 px-4 py-3 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl">
            <span className="font-display text-lg font-bold text-brand-950">
              rolety.expert
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl px-4 py-8">
          <OrderLookup orderNumber={orderNumber} />
        </main>
      </div>
    );
  }

  return (
    <CartProvider>
      <Configurator />
    </CartProvider>
  );
}
