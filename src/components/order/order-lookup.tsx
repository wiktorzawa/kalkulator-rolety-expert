import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";
import { lookupOrder, type OrderRecord } from "@/services/orders";
import { OrderSummary } from "./order-summary";
import { analytics } from "@/lib/analytics";

interface OrderLookupProps {
  readonly orderNumber: string;
}

type LookupStatus = "loading" | "found" | "not_found" | "error";

export function OrderLookup({ orderNumber }: OrderLookupProps) {
  const [status, setStatus] = useState<LookupStatus>("loading");
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const result = await lookupOrder(orderNumber);
      if (result) {
        setOrder(result);
        setStatus("found");
        analytics.trackLookup(orderNumber);
      } else {
        setStatus("not_found");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Nieznany blad";
      setErrorMessage(message);
      setStatus("error");
    }
  }, [orderNumber]);

  useEffect(() => {
    void fetchOrder();
  }, [fetchOrder]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-sage-200 border-t-sage-600" />
          <p className="text-sm text-brand-500">
            Wyszukiwanie zamowienia {orderNumber}...
          </p>
        </div>
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-2 font-display text-xl font-bold text-brand-950">
            Zamowienie nie znalezione
          </p>
          <p className="text-sm text-brand-500">
            Nie znaleziono zamowienia o numerze{" "}
            <strong className="font-mono">{orderNumber}</strong>.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onPress={() => {
              window.location.href = "/";
            }}
          >
            Skonfiguruj nowa rolete
          </Button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-2 font-display text-xl font-bold text-red-600">
            Blad
          </p>
          <p className="text-sm text-brand-500">{errorMessage}</p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onPress={() => void fetchOrder()}
          >
            Sprobuj ponownie
          </Button>
        </div>
      </div>
    );
  }

  // status === "found"
  return order ? <OrderSummary order={order} /> : null;
}
