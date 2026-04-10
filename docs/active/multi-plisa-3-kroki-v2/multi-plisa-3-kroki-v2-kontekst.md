# Multi-plisa, 3 kroki, nowe assety — Kontekst

Branch: `feature/multi-plisa-3-kroki-v2`
Ostatnia aktualizacja: 2026-04-10

## Powiązane pliki

### State management

- `src/context/wizard-types.ts` — WizardState, WizardAction, STEP_LABELS (refaktor 5→3)
- `src/context/wizard-context.tsx` — wizardReducer, isStepComplete, WizardProvider (refaktor + LOAD_ITEM)
- `src/context/cart-context.tsx` — **NOWY** CartProvider, useCart, cartReducer
- `src/context/cart-types.ts` — **NOWY** CartItem, CartState, CartAction

### Komponenty UI

- `src/components/step-content.tsx` — renderowanie kroków (refaktor 5→3)
- `src/components/configurator.tsx` — główny komponent (dodać cart view switching)
- `src/components/layout/price-panel.tsx` — panel cenowy (refaktor: uproszczony + kontekstowy)
- `src/components/layout/step-indicator.tsx` — step indicator (refaktor 5→3)
- `src/components/layout/header.tsx` — progress bar (refaktor 5→3)

### Kroki wizarda

- `src/components/steps/fabric-step.tsx` — krok 1 (drobne zmiany)
- `src/components/steps/color-step.tsx` — krok 2 (drobne zmiany)
- `src/components/steps/config-step.tsx` — **NOWY** krok 3 composite
- `src/components/steps/mounting-step.tsx` — refaktor na karuzela dwupoziomowa
- `src/components/steps/dimensions-step.tsx` — refaktor: swobodne wymiary
- `src/components/steps/rail-step.tsx` — refaktor: realne zdjęcia prowadnic

### Nowe komponenty UI

- `src/components/ui/product-preview.tsx` — **NOWY** podgląd packshot
- `src/components/ui/mounting-carousel.tsx` — **NOWY** karuzela Embla
- `src/components/order/order-list.tsx` — **NOWY** lista zamówienia
- `src/components/order/order-item-card.tsx` — **NOWY** karta pozycji

### Dane produktowe

- `src/data/images.ts` — refaktor: nowe ścieżki (produkty/{kolekcja}/{kolor}/)
- `src/data/fabrics.ts` — bez zmian
- `src/data/pricing.ts` — bez zmian
- `src/data/mounting.ts` — bez zmian
- `src/data/rails.ts` — bez zmian
- `src/utils/pricing.ts` — bez zmian (stabilny, 8/8 testów)

### Serwisy i integracje

- `src/services/orders.ts` — refaktor: multi-item submit via RPC, lookup z items[]
- `src/lib/analytics.ts` — aktualizacja eventów (3 kroki + item_added/edited)
- `src/config/allegro.ts` — bez zmian (ALLEGRO_UNIT_PRICE, ALLEGRO_LISTING_URL)

### Assety

- `stelge-assets/produkty/` → `public/assets/produkty/` (źródło → cel)
- `stelge-assets/montaz/` → `public/assets/montaz/`
- `stelge-assets/prowadnice/` → `public/assets/prowadnice/`
- `public/assets/01-Standard/` ... `22-Listwy-Aluminiowe/` — do usunięcia (stare)

### Baza danych

- `supabase/migrations/` — nowa migracja (DROP + CREATE orders, CREATE order_items)
- RPC: `submit_order` (transakcja), `lookup_order` (join order_items)

### Nowa zależność

- `embla-carousel-react` (~3KB gzipped) — karuzela montażu w kroku 3

## Decyzje techniczne

1. **CartContext osobny od WizardContext** — wizard zarządza bieżącą konfiguracją, cart zarządza listą pozycji. Rozdzielenie odpowiedzialności.
2. **RPC submit_order** — transakcja DB (orders + order_items atomowo). Eliminuje ryzyko wycieku numeru.
3. **Embla Carousel** — lekka (3KB), headless, React-native. HeroUI nie ma karuzeli.
4. **Mirror struktury stelge-assets/** — `public/assets/produkty/{kolekcja}/{kolor}/`. Bez dachowe/.
5. **DROP TABLE + CREATE od nowa** — R49 mówi "czyścimy". Prostsze niż ALTER chain.
6. **Tryb edycji w wizard** — LOAD_ITEM action + editingItemId flag. Przycisk "Zapisz" zamiast "Dodaj".
7. **Panel cenowy kontekstowy** — w configuratorze: "Cena rolety + Dopłata listwa = Razem" + "Dodaj do zamówienia". Na liście: osobny UI w OrderList.
8. **Beforeunload** — aktywny gdy items > 0 && !orderSubmitted. Też w edycji (niezapisane zmiany).
9. **Walidacja w edycji/duplikacji** — ta sama co w nowej konfiguracji (klejony > 1200mm = blokada).

## Pliki do usunięcia

- `src/components/ui/dimension-preview.tsx` — zastąpiony przez product-preview (R18)
- `public/assets/01-Standard/` ... `public/assets/22-Listwy-Aluminiowe/` — stare numerowane foldery

## Źródła

- Requirements doc: `docs/dev-brainstorms/2026-04-09-multi-plisa-wymiary-requirements.md`
- Plan techniczny: `docs/plans/2026-04-10-002-feat-multi-plisa-3-kroki-v2-plan.md`
