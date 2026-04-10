# Multi-plisa, 3 kroki, nowe assety — Zadania

Branch: `feature/multi-plisa-3-kroki-v2`
Ostatnia aktualizacja: 2026-04-10

---

## Faza 1: Fundament danych

### Unit 1: Migracja assetów + aktualizacja image mappings

**Nakład:** M | **Zależności:** brak | **Wymagania:** R50, R51, R52, R53

#### Implementacja

- [x] Stwórz `scripts/copy-stelge-assets.sh` — kopiowanie produkty/, montaz/, prowadnice/ (bez dachowe/)
- [x] Uruchom skrypt — skopiuj assety do `public/assets/`
- [x] Usuń stare numerowane foldery z `public/assets/` (01-Standard ... 22-Listwy-Aluminiowe)
- [x] Refaktor `src/data/images.ts` — nowe funkcje: `getPackshotPath()`, `getFabricSwatchPath()`, `getMountingImagePath()`, `getRailImagePath()`
- [x] Zaktualizuj `src/components/ui/fabric-card.tsx` — nowe ścieżki obrazów
- [x] Zaktualizuj `src/components/ui/color-swatch.tsx` — nowe ścieżki obrazów

#### Testy

- [x] Test: `getPackshotPath('standard', 'biel', false)` → `'assets/produkty/standard/biel/packshot.png'`
- [x] Test: `getPackshotPath('standard', 'biel', true)` → `'assets/produkty/standard/biel/packshot-bezinwazyjny.png'`
- [x] Test: `getFabricSwatchPath('honeycomb', 'antracyt')` → `'assets/produkty/honeycomb/antracyt/zblizenie.png'`
- [x] Test: `getMountingImagePath('bezinwazyjny-wzmocniony', 'opis')` → `'assets/montaz/bezinwazyjny-wzmocniony/opis.png'`
- [x] Test: `getRailImagePath('biel')` → `'assets/prowadnice/biel.jpg'`

#### Weryfikacja

- [x] Weryfikacja: `public/assets/produkty/standard/biel/packshot.png` istnieje
- [x] Weryfikacja: `public/assets/montaz/bezinwazyjny-wzmocniony/opis.png` istnieje
- [x] Weryfikacja: `public/assets/prowadnice/biel.jpg` istnieje
- [x] Weryfikacja: Stare numerowane foldery usunięte
- [x] Weryfikacja: `npm run typecheck` przechodzi
- [x] Weryfikacja: Testy images.ts przechodzą (26/26)

## Do poprawy po review fazy 1

- [x] 🟠 [P2-important] **src/data/images.ts:56-72** — `MountingImageType` zawiera `'zblizenie'` ale `getMountingImagePath()` generuje nieistniejące ścieżki (realne pliki to `zblizenie-dol.webp`, `zblizenie-gora.webp` lub `zblizenie-1.png`, `zblizenie-2.png`). Naprawić przed Fazą 4 (Unit 5).
- [x] 🟠 [P2-important] **src/components/steps/color-step.tsx:45** + **src/services/orders.ts:35** — non-null assertion `state.fabricId!` łamie coding rules (sekcja 10). Użyć zmiennej po early return.
- [ ] 🟡 [P3-nit] **src/data/images.test.ts** — brak testu `getBaseCollection('dolomit-termo')` → `'dolomit'` dla kompletności.

---

## Faza 2: Baza danych

### Unit 2: Schemat relacyjny orders + order_items

**Nakład:** M | **Zależności:** brak | **Wymagania:** R45, R46, R47, R48, R49

#### Implementacja

- [x] Stwórz migrację SQL: DROP TABLE orders CASCADE + CREATE TABLE orders (id, order_number, total_price, allegro_units, allegro_tx_id, utm_source, created_at)
- [x] Stwórz migrację SQL: CREATE TABLE order_items (id, order_id FK, position, fabric_id/name, color_id/name, mounting_id/name/type, width_mm, height_mm, rail_id/name, quantity, unit_price)
- [x] Odtwórz sequence orders_seq + trigger set_order_number
- [x] Stwórz RPC `submit_order(p_items JSONB, p_total_price, p_allegro_units, p_utm_source)` — transakcja INSERT orders + INSERT order_items
- [x] Zaktualizuj RPC `lookup_order(p_order_number)` — zwraca order JOIN order_items
- [x] Ustaw RLS policies (public SELECT, public INSERT via RPC)
- [x] Refaktor `src/services/orders.ts` — nowe typy OrderItemInsert/Record, submitOrder via RPC, lookupOrder z items[]

#### Testy

- [x] Test: RPC submit_order z 3 pozycjami → zwraca order_number RE-XXXXX + 3 order_items
- [ ] Test: RPC submit_order z błędną pozycją → rollback, zero wycieku order_number (wymaga połączenia z DB)
- [x] Test: RPC lookup_order('RE-00001') → order + items[]
- [x] Test: RPC lookup_order('BRAK') → null/empty
- [ ] Test: Sequence generuje kolejne numery (UNIQUE constraint) (wymaga połączenia z DB)

#### Weryfikacja

- [ ] Weryfikacja: `supabase db push` bez błędów
- [ ] Weryfikacja: INSERT via RPC generuje order + items poprawnie
- [ ] Weryfikacja: Lookup zwraca order z listą pozycji

## Do poprawy po review fazy 2

- [x] 🟠 [P2-important] **supabase/migrations/20260410022747_create_order_items.sql:155** — `submit_order` jest `SECURITY DEFINER` bez `SET search_path = public` (lookup_order ma poprawnie). Dodać `SET search_path = public`.
- [x] 🟠 [P2-important] **supabase/migrations/20260410022747_create_order_items.sql:114-154** — brak walidacji inputu w `submit_order` RPC: puste items, ujemna cena, ujemne units, brak limitu items. Dodać guards.
- [x] 🟠 [P2-important] **src/services/orders.ts:93** — double type assertion `as unknown as Record<string, unknown>` obchodzi type safety. Użyć `JSON.parse(JSON.stringify(...))` lub spread.
- [ ] 🟡 [P3-nit] **src/components/layout/price-panel.tsx:182-198** — panel wciąż pokazuje rozbicie dopłat za szer/wys (zaplanowane do refaktoru w Unit 6).
- [ ] 🟡 [P3-nit] **src/services/orders.ts:61-69** — `LegacyOrderConfig` deprecated, upewnić się że usunięty w Unit 7.
- [ ] 🟡 [P3-nit] **src/services/orders.test.ts** — brak testu edge case `submitOrder({ items: [], ... })`.

---

## Faza 3: Architektura state

### Unit 3: CartContext + refaktor WizardContext na 3 kroki

**Nakład:** L | **Zależności:** Unit 1, Unit 2 | **Wymagania:** R1, R4, R7, R21-R37

#### Implementacja

- [ ] Stwórz `src/context/cart-types.ts` — CartItem, CartState, CartAction
- [ ] Stwórz `src/context/cart-context.tsx` — CartProvider, useCart, cartReducer (ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM, DUPLICATE_ITEM, SET_QUANTITY, SET_VIEW)
- [ ] Refaktor `src/context/wizard-types.ts` — STEP_LABELS = ['Tkanina', 'Kolor', 'Konfiguracja'], TOTAL_STEPS = 3, dodaj editingItemId, LOAD_ITEM action, RESET action
- [ ] Refaktor `src/context/wizard-context.tsx` — reducer 3 kroki, LOAD_ITEM, RESET, isStepComplete(3) sprawdza mounting+dimensions+rail
- [ ] Modyfikuj `src/App.tsx` — CartProvider wrapper

#### Testy

- [ ] Test: ADD_ITEM dodaje pozycję z UUID i ceną
- [ ] Test: REMOVE_ITEM usuwa po id
- [ ] Test: SET_QUANTITY(id, 3) aktualizuje ilość, totalPrice = unitPrice × 3
- [ ] Test: DUPLICATE_ITEM klonuje z nowym id
- [ ] Test: UPDATE_ITEM zastępuje konfigurację, przelicza cenę
- [ ] Test: totalPrice = suma (unitPrice × quantity) dla wszystkich items
- [ ] Test: LOAD_ITEM w wizard ustawia wszystkie pola + editingItemId
- [ ] Test: RESET czyści do INITIAL_STATE, editingItemId = null
- [ ] Test: isStepComplete(3) = true gdy mounting + dimensions + rail wybrane
- [ ] Test: SELECT_FABRIC resetuje colorId (zachowane zachowanie)
- [ ] Test: Zmiana tkaniny w edycji — kolor zachowany jeśli istnieje w nowej palecie, resetowany jeśli nie (R33)

#### Weryfikacja

- [ ] Weryfikacja: Testy cart-context przechodzą
- [ ] Weryfikacja: Testy wizard-context zaktualizowane i przechodzą
- [ ] Weryfikacja: `npm run typecheck` przechodzi

---

## Faza 4: UI wizarda i layout

### Unit 4: Layout shell — 3-krokowy stepper + StepContent

**Nakład:** M | **Zależności:** Unit 3 | **Wymagania:** R1, R2, R3, R4, R22, R23, R25

#### Implementacja

- [ ] Refaktor `src/components/layout/step-indicator.tsx` — 3 kroki z nowymi etykietami
- [ ] Refaktor `src/components/step-content.tsx` — 3 kroki: FabricStep, ColorStep, ConfigStep
- [ ] Refaktor `src/components/layout/header.tsx` — progress bar 3-krokowy
- [ ] Refaktor `src/components/configurator.tsx` — conditional render: configurator vs order-list (cart.view)
- [ ] Modyfikuj `src/App.tsx` — routing z CartContext view

#### Testy

- [ ] Test: StepContent renderuje 3 kroki (nie 5)
- [ ] Test: Progress bar pokazuje 33%/66%/100%
- [ ] Test (E2E): Krok 1 "Tkanina" → wybierz → scroll do kroku 2 "Kolor" → wybierz → scroll do kroku 3 "Konfiguracja"
- [ ] Test (E2E): Po dodaniu plisy → widok listy → "Dodaj kolejną" → powrót do wizarda krok 1

#### Weryfikacja

- [ ] Weryfikacja: Nawigacja 3-krokowa działa
- [ ] Weryfikacja: Przełączanie configurator ↔ order-list działa
- [ ] Weryfikacja: `npm run typecheck` przechodzi

### Unit 5: Krok 3 composite — podgląd + montaż + wymiary + listwa

**Nakład:** XL | **Zależności:** Unit 1, Unit 3, Unit 4 | **Wymagania:** R3, R5-R18

#### Implementacja

- [ ] Stwórz `src/components/steps/config-step.tsx` — layout desktop (podgląd left + config right), mobile (podgląd top + config bottom)
- [ ] Stwórz `src/components/ui/product-preview.tsx` — podgląd packshot (zmiana przy bezinwazyjny/inwazyjny)
- [ ] Zainstaluj `embla-carousel-react`
- [ ] Stwórz `src/components/ui/mounting-carousel.tsx` — karuzela systemów montażu
- [ ] Refaktor `src/components/steps/mounting-step.tsx` — karuzela dwupoziomowa (2 kategorie → podsystemy)
- [ ] Refaktor `src/components/ui/dimension-input.tsx` — swobodne wymiary (input akceptuje dowolną wartość, slider zsynchronizowany)
- [ ] Refaktor `src/components/steps/dimensions-step.tsx` — usunięcie DimensionPreview, integracja z ConfigStep
- [ ] Refaktor `src/components/steps/rail-step.tsx` — siatka z realnymi zdjęciami prowadnic + lightbox (HeroUI Modal)
- [ ] Usuń `src/components/ui/dimension-preview.tsx` (R18)

#### Testy

- [ ] Test: ProductPreview zmienia src przy zmianie mountingType
- [ ] Test: DimensionInput akceptuje 623mm bez zaokrąglania w polu
- [ ] Test: DimensionInput clampe'uje na blur (< 150 → 150, > 1950 → 1950)
- [ ] Test: Montaż klejony + width 1400mm → alert, blokada
- [ ] Test: RailStep renderuje 14 kart z realnymi zdjęciami
- [ ] Test (E2E): Krok 3: "Bezinwazyjny" → karuzela 2 systemów → "Wzmocniony" → packshot zmienia się → wymiary 800×1500 → listwa "Orzech" (dopłata widoczna) → kliknij zdjęcie → modal
- [ ] Test (E2E): Mobile: podgląd na górze, config pod spodem. Desktop: podgląd po lewej
- [ ] Test (E2E): Klejony → 1300mm → alert "Max 1200mm"

#### Weryfikacja

- [ ] Weryfikacja: ConfigStep renderuje podgląd + montaż + wymiary + listwę na jednej stronie
- [ ] Weryfikacja: Podgląd zmienia się dynamicznie przy zmianie montażu
- [ ] Weryfikacja: Swobodne wymiary działają
- [ ] Weryfikacja: Realne zdjęcia prowadnic widoczne
- [ ] Weryfikacja: Responsywność mobile/desktop

---

## Faza 5: Multi-plisa

### Unit 6: Lista zamówienia + panel cenowy

**Nakład:** L | **Zależności:** Unit 3, Unit 4, Unit 5 | **Wymagania:** R19-R20, R24-R37

#### Implementacja

- [ ] Stwórz `src/components/order/order-list.tsx` — lista pozycji z podsumowaniem
- [ ] Stwórz `src/components/order/order-item-card.tsx` — karta pozycji (miniatura, parametry, cena, akcje)
- [ ] Refaktor `src/components/layout/price-panel.tsx` — uproszczony (Cena rolety + Dopłata listwa = Razem), kontekstowy (configurator vs edit), pole ilości, "Dodaj"/"Zapisz"/"Anuluj"
- [ ] Modyfikuj `src/components/configurator.tsx` — render OrderList gdy cart.view === 'order-list'
- [ ] Dodaj toast notification (Sonner lub HeroUI) przy edycji z ilością > 1

#### Testy

- [ ] Test: OrderList renderuje N pozycji z cenami
- [ ] Test: +/- ilość aktualizuje totalPrice natychmiast
- [ ] Test: Edytuj → wizard z wypełnionymi polami, przycisk "Zapisz"
- [ ] Test: Duplikuj → kopia z nowym id, otwarta w edycji
- [ ] Test: Usuń ostatnią pozycję → "Zamów" disabled
- [ ] Test: PricePanel nie pokazuje "Doplata za szerokosc" ani "Doplata za wysokosc"
- [ ] Test: Toast "Zaktualizowano 3 szt." przy edycji z quantity=3
- [ ] Test (E2E): Skonfiguruj plisę → "Dodaj" (ilość 2) → lista → "2 szt." → "+" → 3 szt. live → "Edytuj" → zmień kolor → "Zapisz" → lista zaktualizowana
- [ ] Test (E2E): "Dodaj kolejną" → czysty wizard → druga plisa → "Dodaj" → lista 2 pozycje
- [ ] Test (E2E): Edytuj → klejony + width > 1200mm → alert → blokada "Zapisz"
- [ ] Test (E2E): Edytuj → "Anuluj" → lista bez zmian

#### Weryfikacja

- [ ] Weryfikacja: Lista zamówienia z pełnym CRUD działa
- [ ] Weryfikacja: Panel cenowy uproszczony
- [ ] Weryfikacja: Edycja, duplikacja, usuwanie działają
- [ ] Weryfikacja: Live update ilości i sumy

---

## Faza 6: Integracja i polish

### Unit 7: Order submission + summary + lookup (multi-item)

**Nakład:** M | **Zależności:** Unit 2, Unit 6 | **Wymagania:** R38-R44, R48

#### Implementacja

- [ ] Refaktor `src/services/orders.ts` — submitOrder via RPC (multi-item), lookupOrder z items[]
- [ ] Refaktor `src/components/order/order-summary.tsx` — tabela WSZYSTKICH pozycji + suma + jednostki + instrukcja + link Allegro
- [ ] Refaktor `src/components/order/order-lookup.tsx` — wyświetlanie multi-item zamówienia

#### Testy

- [ ] Test: submitOrder z 3 items → RPC zwraca order_number
- [ ] Test: lookupOrder → order + 3 items
- [ ] Test: Jednostki: ceil(175.75 / 1) → 176
- [ ] Test (E2E): Lista 2 pozycje → "Zamów" → podsumowanie: tabela + suma + jednostki + instrukcja + link + numer RE-XXXXX
- [ ] Test (E2E): ?order=RE-00001 → podsumowanie z listą pozycji
- [ ] Test (E2E): ?order=BRAK → "Zamówienie nie znalezione"

#### Weryfikacja

- [ ] Weryfikacja: Multi-item zamówienie zapisuje się w Supabase
- [ ] Weryfikacja: Podsumowanie wyświetla wszystkie pozycje
- [ ] Weryfikacja: Lookup działa z multi-item
- [ ] Weryfikacja: URL aktualizuje się po submit

### Unit 8: Beforeunload + walidacje + analytics + polish

**Nakład:** M | **Zależności:** Unit 7 | **Wymagania:** R54, R55

#### Implementacja

- [ ] Stwórz `src/hooks/use-beforeunload.ts` — hook (aktywny gdy items > 0 && !submitted)
- [ ] Modyfikuj `src/components/configurator.tsx` — użycie hooka
- [ ] Zaktualizuj `src/lib/analytics.ts` — eventy: step_1-3_viewed, item_added, item_edited, order_submitted (z items_count)
- [ ] Zaktualizuj komponenty steps — analytics.trackStep() z nowymi numerami
- [ ] Finalne style, hover, animacje, responsive fixes

#### Testy

- [ ] Test: useBeforeunload aktywny gdy items > 0
- [ ] Test: useBeforeunload nieaktywny gdy items === 0
- [ ] Test: useBeforeunload nieaktywny po złożeniu zamówienia
- [ ] Test: analytics.trackStep(1) → 'step_1_viewed'
- [ ] Test (E2E): Dodaj plisę → odśwież → dialog ostrzeżenia
- [ ] Test (E2E): Złóż zamówienie → odśwież → brak ostrzeżenia
- [ ] Test (E2E): Mobile: sticky panel na dole. Desktop: w prawym dolnym rogu

#### Weryfikacja

- [ ] Weryfikacja: Beforeunload działa poprawnie
- [ ] Weryfikacja: Analytics rejestruje nowe eventy
- [ ] Weryfikacja: `npm run typecheck && npm run lint && npm run test` — zero failures

---

## Podsumowanie postępu

| Faza                | Unit                             | Status          | Nakład |
| ------------------- | -------------------------------- | --------------- | ------ |
| 1. Fundament danych | Unit 1: Assety + images          | ✅ Zrobione     | M      |
| 2. Baza danych      | Unit 2: Schema + RPC             | ✅ Zrobione     | M      |
| 3. State            | Unit 3: Cart + Wizard 3 kroki    | ⬜ Do zrobienia | L      |
| 4. UI wizarda       | Unit 4: Layout shell 3-krokowy   | ⬜ Do zrobienia | M      |
| 4. UI wizarda       | Unit 5: Krok 3 composite         | ⬜ Do zrobienia | XL     |
| 5. Multi-plisa      | Unit 6: Lista zamówienia + panel | ⬜ Do zrobienia | L      |
| 6. Integracja       | Unit 7: Submission + summary     | ⬜ Do zrobienia | M      |
| 6. Integracja       | Unit 8: Beforeunload + polish    | ⬜ Do zrobienia | M      |
