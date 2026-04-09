import { ALLEGRO_LISTING_URL } from "@/config/allegro";
import { formatOrderNumber } from "@/utils/order-number";
import { priceToUnits, formatUnitsBreakdown } from "@/utils/allegro";
import { getFabricById, getColorsForFabric } from "@/data/fabrics";
import { getMountingById } from "@/data/mounting";
import { getRailById } from "@/data/rails";
import type { OrderRecord } from "@/services/orders";

function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

interface OrderSummaryProps {
  readonly order: OrderRecord;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const units = priceToUnits(order.price);
  const breakdown = formatUnitsBreakdown(units);
  const displayNumber = formatOrderNumber(order.order_number);

  const fabric = getFabricById(order.config.fabricId);
  const colors = order.config.fabricId
    ? getColorsForFabric(order.config.fabricId)
    : [];
  const color = colors.find((c) => c.id === order.config.colorId);
  const mounting = getMountingById(order.config.mountingId);
  const rail = getRailById(order.config.railId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Order number */}
      <div className="text-center">
        <p className="text-sm text-brand-500">Numer zamowienia</p>
        <p
          className="font-display text-3xl font-bold text-brand-950"
          data-testid="order-number"
        >
          {displayNumber}
        </p>
      </div>

      {/* Configuration table */}
      <div className="rounded-xl border border-brand-200 bg-white">
        <h3 className="border-b border-brand-200 px-4 py-3 font-display text-lg font-semibold text-brand-900">
          Konfiguracja
        </h3>
        <dl className="divide-y divide-brand-100">
          <div className="flex justify-between px-4 py-2.5">
            <dt className="text-sm text-brand-500">Tkanina</dt>
            <dd className="text-sm font-medium text-brand-900">
              {fabric?.name ?? order.config.fabricId}
            </dd>
          </div>
          <div className="flex justify-between px-4 py-2.5">
            <dt className="text-sm text-brand-500">Kolor</dt>
            <dd className="text-sm font-medium text-brand-900">
              {color?.name ?? order.config.colorId}
            </dd>
          </div>
          <div className="flex justify-between px-4 py-2.5">
            <dt className="text-sm text-brand-500">Montaz</dt>
            <dd className="text-sm font-medium text-brand-900">
              {mounting?.name ?? order.config.mountingId} (
              {order.config.mountingType})
            </dd>
          </div>
          <div className="flex justify-between px-4 py-2.5">
            <dt className="text-sm text-brand-500">Wymiary</dt>
            <dd className="text-sm font-medium text-brand-900">
              {order.config.widthMm} x {order.config.heightMm} mm
            </dd>
          </div>
          <div className="flex justify-between px-4 py-2.5">
            <dt className="text-sm text-brand-500">Listwa</dt>
            <dd className="text-sm font-medium text-brand-900">
              {rail?.name ?? order.config.railId}
            </dd>
          </div>
        </dl>
      </div>

      {/* Price and units */}
      <div className="rounded-xl border border-sage-200 bg-sage-50 p-6 text-center">
        <p className="text-sm text-sage-600">Kwota zamowienia</p>
        <p className="font-display text-2xl font-bold text-sage-900">
          {formatPrice(order.price)} zl
        </p>

        <div className="my-4 border-t border-sage-200" />

        <p className="text-sm text-sage-600">
          Ilosc jednostek do kupienia na Allegro
        </p>
        <p
          className="font-display text-4xl font-bold text-sage-900"
          data-testid="allegro-units"
        >
          {units} jednostek
        </p>
        <p className="mt-1 text-xs text-sage-500">({breakdown})</p>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-brand-200 bg-white p-6">
        <h3 className="mb-4 font-display text-lg font-semibold text-brand-900">
          Aby dokonczyc zamowienie:
        </h3>
        <ol className="space-y-3 text-sm text-brand-700">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700">
              1
            </span>
            <span>
              Kliknij przycisk ponizej — przeniesie Cie na aukcje Allegro
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700">
              2
            </span>
            <span>
              Wpisz ilosc:{" "}
              <strong className="text-brand-950">{units} sztuk</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700">
              3
            </span>
            <span>
              W polu &quot;Uwagi do zakupu&quot; wpisz numer zamowienia:{" "}
              <strong className="text-brand-950">{displayNumber}</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700">
              4
            </span>
            <span>Oplac zamowienie przez Allegro</span>
          </li>
        </ol>
      </div>

      {/* Allegro button */}
      <a
        href={ALLEGRO_LISTING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-lg bg-sage-600 px-6 py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-sage-700"
      >
        Przejdz do aukcji Allegro &rarr;
      </a>

      {/* Disclaimer */}
      <p className="text-center text-xs text-brand-400">
        Cena jednostki na aukcji Allegro nie odpowiada cenie rolety — liczy sie
        koncowa kwota do zaplaty.
      </p>

      {/* Order lookup link */}
      <p className="text-center text-xs text-brand-400">
        Link do tego zamowienia:{" "}
        <span className="font-mono text-brand-600">
          {window.location.origin}?order={order.order_number}
        </span>
      </p>
    </div>
  );
}
