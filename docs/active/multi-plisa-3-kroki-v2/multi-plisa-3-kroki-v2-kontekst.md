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

## Review fazy 1 (2026-04-10)

- Severity gate: KONTYNUUJ Z ZASTRZEŻENIAMI (P1=0, P2=2, P3=3)
- E2E: 7/7 passed — assety, typecheck, testy OK
- P2-1: `getMountingImagePath` z typem `zblizenie` generuje nieistniejące ścieżki (pliki mają inne nazwy niż zakładał kod). Nie blokuje Fazy 1, do naprawy przed Fazą 4.
- P2-2: Non-null assertion `!` w `color-step.tsx` i `orders.ts` — łamie coding rules.
- Blackout: assety mają `zblizenie.png` (nie `tkanina.jpg` jak w PROMPT spec) — kod poprawnie podąża za realnymi plikami.
- Raport: `docs/active/multi-plisa-3-kroki-v2/review-faza-1.md`

## Review fazy 2 (2026-04-10)

- Severity gate: KONTYNUUJ Z ZASTRZEŻENIAMI (P1=0, P2=3, P3=3)
- Typecheck: PASS, Lint: PASS, Testy: 135/135 PASS
- E2E: nie wykonano (weryfikacje DB wymagają połączenia z Supabase)
- P2-1: `submit_order` brak `SET search_path = public` (security best practice dla SECURITY DEFINER)
- P2-2: Brak walidacji inputu w `submit_order` RPC (puste items, ujemne wartości, brak limitu)
- P2-3: Double type assertion `as unknown as` w `orders.ts:93`
- Schemat SQL i testy ocenione pozytywnie — solidna baza do Fazy 3
- Raport: `docs/active/multi-plisa-3-kroki-v2/review-faza-2.md`

## Review fazy 3 (2026-04-10)

- Severity gate: KONTYNUUJ Z ZASTRZEŻENIAMI (P1=0, P2=2, P3=4)
- Typecheck: PASS, Lint: PASS, Testy: 35/35 PASS (13 cart + 22 wizard)
- P2-1: Brak convenience wrapperów `addCurrentConfig`/`updateEditedConfig` w useCart (plan je definiuje). Nie blokuje -- do dodania w Unit 6 gdy potrzebne.
- P2-2: `step-content.tsx` w stanie przejściowym (5 komponentów pod 3-krokowym state). Akceptowalne -- Unit 4/5 dokończy refaktor na ConfigStep.
- Implementacja solidna: readonly typy, discriminated unions, R33 logika poprawna, zero `any`.
- Raport: `docs/active/multi-plisa-3-kroki-v2/review-faza-3.md`

## Review fazy 4 (2026-04-10)

- Severity gate: KONTYNUUJ Z ZASTRZEŻENIAMI (P1=0, P2=3, P3=5)
- Typecheck: PASS, Lint: PASS, Testy: 165/165 PASS
- P2-1: Lightbox w RailStep używa DOM manipulation zamiast React state (dialog.querySelector zamiast useState)
- P2-2: PricePanel 240 linii łączy submit + prezentację — do rozdzielenia w Unit 6
- P2-3: PricePanel wciąż pokazuje rozbicie dopłat (sprzeczne z R19-R20) — do refaktoru w Unit 6
- ConfigStep composite layout poprawny: podgląd + montaż karuzela + swobodne wymiary + listwy ze zdjęciami
- Embla Carousel poprawnie zainstalowane i zintegrowane
- DimensionInput elegancko rozdziela local state (free typing) vs parent state (clamped)
- Zero `any`, zero `console.log`, zero type assertions
- Raport: `docs/active/multi-plisa-3-kroki-v2/review-faza-4.md`

## Review fazy 5 (2026-04-10)

- Severity gate: KONTYNUUJ Z ZASTRZEŻENIAMI (P1=0, P2=4, P3=5)
- Typecheck: PASS, Lint: PASS, Testy: 175/175 PASS
- P2-1: PricePanel 317 linii (limit 300), łączy zbyt wiele odpowiedzialności
- P2-2: useEffect w OrderList z brakującą zależnością handleEdit + krucha logika duplikatu
- P2-3: OrderList testy pokrywają tylko empty state (3/7 wymaganych scenariuszy)
- P2-4: Brak pliku testowego order-item-card.test.tsx
- Panel cenowy poprawnie uproszczony (Cena rolety + Dopłata listwa = Razem)
- formatPrice() zduplikowana 5 razy — do wyciągnięcia do utils
- Custom toast zamiast Sonner/HeroUI — akceptowalne ale zduplikowane w 2 komponentach
- Raport: `docs/active/multi-plisa-3-kroki-v2/review-faza-5.md`

## Review fazy 6 (2026-04-10)

- Severity gate: KONTYNUUJ Z ZASTRZEŻENIAMI (P1=0, P2=4, P3=5)
- Typecheck: PASS, Lint: PASS, Testy: 195/195 PASS
- P2-1: BeforeunloadGuard nie wyłącza się po submit — cart items pozostają, brak flagi orderSubmitted
- P2-2: Type assertions `as string` / `as {...}` w orders.ts — brak runtime walidacji
- P2-3: Brak order-summary.test.tsx — kluczowy komponent bez testów UI
- P2-4: editItem brakuje w dependency array useEffect w order-list.tsx
- PricePanel zrefaktorowany (317→197 linii), OrderList testy poprawione (3→9), OrderItemCard testy dodane (8)
- P2 z fazy 5 naprawione: PricePanel rozmiar, OrderList testy, OrderItemCard testy
- Dead code: order-list-placeholder.tsx do usunięcia
- formatPrice() wciąż zduplikowana 5 razy
- Raport: `docs/active/multi-plisa-3-kroki-v2/review-faza-6.md`

## Źródła

- Requirements doc: `docs/dev-brainstorms/2026-04-09-multi-plisa-wymiary-requirements.md`
- Plan techniczny: `docs/plans/2026-04-10-002-feat-multi-plisa-3-kroki-v2-plan.md`
