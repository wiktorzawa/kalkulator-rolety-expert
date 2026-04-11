# Review fazy 6 — Integracja i polish

**Data:** 2026-04-10
**Commit:** e077aec
**Branch:** feature/multi-plisa-3-kroki-v2

## Wyniki weryfikacji

| Komenda             | Status       |
| ------------------- | ------------ |
| `npm run typecheck` | PASS         |
| `npm run lint`      | PASS         |
| `npm run test`      | 195/195 PASS |

## Skonsolidowany raport

### P1 (blocking)

Brak.

### P2 (important)

#### P2-1: BeforeunloadGuard nie wyłącza się po złożeniu zamówienia

**Plik:** `src/components/configurator.tsx:13-16`

Specyfikacja (PROMPT-KONFIGURATOR.md): "Po złożeniu zamówienia — wyłączyć." BeforeunloadGuard sprawdza `hasItems || isEditing`, ale po submit cart items pozostają w stanie (submittedOrder to local state w OrderList, a nie flaga w CartContext). Po złożeniu zamówienia, przeglądarka nadal pokaże dialog ostrzeżenia przy próbie zamknięcia karty.

**Rozwiązanie:** Dodać flagę `orderSubmitted` do CartContext i uwzględnić ją w warunku: `(hasItems || isEditing) && !orderSubmitted`.

#### P2-2: Type assertions `as string` i `as {...}` w orders.ts

**Plik:** `src/services/orders.ts:88, 122-131`

Coding rules sekcja 10: "NIGDY nie używaj type assertions (`as`) chyba że konieczne dla DOM narrowing." Supabase RPC zwraca `unknown` — poprawnym podejściem jest runtime walidacja (type guard lub Zod) zamiast `as string` / `as { ... }`.

**Rozwiązanie:** Dodać runtime check: `if (typeof data !== 'string') throw new Error(...)` dla submit, oraz type guard / Zod schema parse dla lookup.

#### P2-3: Brak pliku testowego `order-summary.test.tsx`

**Plik:** `src/components/order/order-summary.tsx`

OrderSummary to kluczowy komponent fazy 6 — wyświetla wielopozycyjne zamówienie z instrukcją Allegro. Brak dedykowanych testów. Plan definiował scenariusze testowe: "Test: Jednostki: ceil(175.75 / 1) → 176" — ten test jest w orders.test.ts, ale UI rendering OrderSummary nie jest testowany.

#### P2-4: `editItem` brakuje w dependency array useEffect

**Plik:** `src/components/order/order-list.tsx:55-70`

`editItem` jest wywoływany wewnątrz useEffect ale nie jest w tablicy zależności. Funkcja `editItem` jest definiowana inline (nie useCallback), więc przy re-renderze będzie nowa referencja. W praktyce kod działa bo `editItem` jest wywoływana synchronicznie w tym samym renderze, ale jest to naruszenie zasad React i React Compiler tego nie zaakceptuje.

**Rozwiązanie:** Zawinąć `editItem` w `useCallback` i dodać do zależności useEffect, lub przenieść logikę bezpośrednio do useEffect.

### P3 (nit)

#### P3-1: `formatPrice()` zduplikowana 5 razy

**Pliki:** header.tsx, price-panel.tsx, order-list.tsx, order-item-card.tsx, order-summary.tsx

Identyczna funkcja `formatPrice(value: number): string` zduplikowana w 5 plikach. Wyciągnąć do `src/utils/format.ts`. (Powtórzenie z review fazy 5 — wciąż nienaprawione.)

#### P3-2: Dead code — `order-list-placeholder.tsx`

**Plik:** `src/components/order/order-list-placeholder.tsx`

Plik nie jest importowany nigdzie w codebase. Został zastąpiony przez `order-list.tsx` w fazie 5/6. Do usunięcia.

#### P3-3: Niespójna konstrukcja URL w order-summary vs order-list

**Plik:** `src/components/order/order-summary.tsx:189`

`order-summary.tsx` buduje link: `{window.location.origin}?order=...` (bez pathname), podczas gdy `order-list.tsx:151` poprawnie używa `{origin}{pathname}?order=...`. Przy deploy na subpath, link w summary będzie niepoprawny.

#### P3-4: analytics side-effect w warstwie serwisowej

**Plik:** `src/services/orders.ts:90-95`

`submitOrder()` wywołuje `analytics.trackOrder()` wewnątrz — łączy warstwę danych z analytics. Lepiej wywołać tracking w komponencie po udanym submit.

#### P3-5: Brak ESLint react-hooks/exhaustive-deps

**Plik:** `eslint.config.js`

Brak pluginu `eslint-plugin-react-hooks` w konfiguracji ESLint. Przez to brakujące zależności w useEffect (jak P2-4) nie są wykrywane automatycznie.

## Odchylenia od planu

Plan techniczny (Unit 7, Unit 8) definiował:

- Scenariusze testowe E2E — brak E2E testów (konsystentne z poprzednimi fazami)
- `order-summary.test.tsx` — brak (nowy plik, brak testów UI)
- Plan zakładał beforeunload "aktywny gdy items > 0 && !submitted" — implementacja nie śledzi stanu `submitted`

## Pozytywne aspekty

- PricePanel zrefaktorowany z 317 do 197 linii (logika wyciągnięta do `usePricePanelActions` hook) — P2-1 z fazy 5 naprawione
- OrderList test coverage znacząco poprawiony (z 3 do 9 testów) — P2-3 z fazy 5 naprawione
- OrderItemCard ma dedykowane testy (8 testów) — P2-4 z fazy 5 naprawione
- Duplikacja via `knownItemIdsRef` + `pendingDuplicate` — kreatywne rozwiązanie problemu z fazy 5
- `useBeforeunload` hook — czyste, izolowane, dobrze przetestowane (4 testy)
- Analytics wrapper — graceful degradation, nowe eventy (item_added, item_edited, order_submitted z items_count)
- Lookup via OrderLookup — poprawna obsługa stanów (loading, found, not_found, error)
- URL aktualizacja po submit via `history.replaceState` — poprawne

## Severity Gate

**⚠️ KONTYNUUJ Z ZASTRZEŻENIAMI — 4 problemy P2 do naprawy**

P2-1 (beforeunload po submit) jest najbardziej istotny — wpływa na UX klienta. Pozostałe P2 dotyczą jakości kodu i testów.
