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

- [x] Stwórz `src/context/cart-types.ts` — CartItem, CartState, CartAction
- [x] Stwórz `src/context/cart-context.tsx` — CartProvider, useCart, cartReducer (ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM, DUPLICATE_ITEM, SET_QUANTITY, SET_VIEW)
- [x] Refaktor `src/context/wizard-types.ts` — STEP_LABELS = ['Tkanina', 'Kolor', 'Konfiguracja'], TOTAL_STEPS = 3, dodaj editingItemId, LOAD_ITEM action, RESET action
- [x] Refaktor `src/context/wizard-context.tsx` — reducer 3 kroki, LOAD_ITEM, RESET, isStepComplete(3) sprawdza mounting+dimensions+rail
- [x] Modyfikuj `src/App.tsx` — CartProvider wrapper

#### Testy

- [x] Test: ADD_ITEM dodaje pozycję z UUID i ceną
- [x] Test: REMOVE_ITEM usuwa po id
- [x] Test: SET_QUANTITY(id, 3) aktualizuje ilość, totalPrice = unitPrice × 3
- [x] Test: DUPLICATE_ITEM klonuje z nowym id
- [x] Test: UPDATE_ITEM zastępuje konfigurację, przelicza cenę
- [x] Test: totalPrice = suma (unitPrice × quantity) dla wszystkich items
- [x] Test: LOAD_ITEM w wizard ustawia wszystkie pola + editingItemId
- [x] Test: RESET czyści do INITIAL_STATE, editingItemId = null
- [x] Test: isStepComplete(3) = true gdy mounting + dimensions + rail wybrane
- [x] Test: SELECT_FABRIC resetuje colorId (zachowane zachowanie)
- [x] Test: Zmiana tkaniny w edycji — kolor zachowany jeśli istnieje w nowej palecie, resetowany jeśli nie (R33)

#### Weryfikacja

- [x] Weryfikacja: Testy cart-context przechodzą
- [x] Weryfikacja: Testy wizard-context zaktualizowane i przechodzą
- [x] Weryfikacja: `npm run typecheck` przechodzi

## Do poprawy po review fazy 3

- [ ] 🟠 [P2-important] **src/context/cart-context.tsx:94-99** — brak `addCurrentConfig` / `updateEditedConfig` w useCart hook (plan definiuje te convenience wrappery). Dodać gdy Unit 6 ich potrzebuje lub udokumentować odchylenie.
- [ ] 🟠 [P2-important] **src/components/step-content.tsx:17-23** — StepContent wciąż renderuje 5 osobnych komponentów (MountingStep, DimensionsStep, RailStep) zamiast scalonych w ConfigStep. Akceptowalne jeśli Unit 4/5 dokończy refaktor.
- [ ] 🟡 [P3-nit] **src/context/cart-context.tsx:89-91** — brak exhaustive check w `default` case cartReducera (preferowany `const _exhaustive: never = action`).
- [ ] 🟡 [P3-nit] **src/context/cart-context.tsx:53-65** — DUPLICATE_ITEM: `find()` + `findIndex()` podwójna iteracja, można jednym `findIndex()`.
- [ ] 🟡 [P3-nit] **src/context/cart-context.test.tsx:10-15** — `vi.stubGlobal("crypto")` podmienia cały obiekt, może interferować z innymi testami.
- [ ] 🟡 [P3-nit] **src/context/cart-context.test.tsx** — brak testu UPDATE_ITEM z nieistniejącym id.

---

## Faza 4: UI wizarda i layout

### Unit 4: Layout shell — 3-krokowy stepper + StepContent

**Nakład:** M | **Zależności:** Unit 3 | **Wymagania:** R1, R2, R3, R4, R22, R23, R25

#### Implementacja

- [x] Refaktor `src/components/layout/step-indicator.tsx` — 3 kroki z nowymi etykietami
- [x] Refaktor `src/components/step-content.tsx` — 3 kroki: FabricStep, ColorStep, ConfigStep
- [x] Refaktor `src/components/layout/header.tsx` — progress bar 3-krokowy
- [x] Refaktor `src/components/configurator.tsx` — conditional render: configurator vs order-list (cart.view)
- [x] Modyfikuj `src/App.tsx` — routing z CartContext view

#### Testy

- [x] Test: StepContent renderuje 3 kroki (nie 5)
- [x] Test: Progress bar pokazuje 33%/66%/100%
- [ ] Test (E2E): Krok 1 "Tkanina" → wybierz → scroll do kroku 2 "Kolor" → wybierz → scroll do kroku 3 "Konfiguracja"
- [ ] Test (E2E): Po dodaniu plisy → widok listy → "Dodaj kolejną" → powrót do wizarda krok 1

#### Weryfikacja

- [ ] Weryfikacja: Nawigacja 3-krokowa działa
- [ ] Weryfikacja: Przełączanie configurator ↔ order-list działa
- [ ] Weryfikacja: `npm run typecheck` przechodzi

### Unit 5: Krok 3 composite — podgląd + montaż + wymiary + listwa

**Nakład:** XL | **Zależności:** Unit 1, Unit 3, Unit 4 | **Wymagania:** R3, R5-R18

#### Implementacja

- [x] Stwórz `src/components/steps/config-step.tsx` — layout desktop (podgląd left + config right), mobile (podgląd top + config bottom)
- [x] Stwórz `src/components/ui/product-preview.tsx` — podgląd packshot (zmiana przy bezinwazyjny/inwazyjny)
- [x] Zainstaluj `embla-carousel-react`
- [x] Stwórz `src/components/ui/mounting-carousel.tsx` — karuzela systemów montażu
- [x] Refaktor `src/components/steps/mounting-step.tsx` — karuzela dwupoziomowa (2 kategorie → podsystemy)
- [x] Refaktor `src/components/ui/dimension-input.tsx` — swobodne wymiary (input akceptuje dowolną wartość, slider zsynchronizowany)
- [x] Refaktor `src/components/steps/dimensions-step.tsx` — usunięcie DimensionPreview, integracja z ConfigStep
- [x] Refaktor `src/components/steps/rail-step.tsx` — siatka z realnymi zdjęciami prowadnic + lightbox (HeroUI Modal)
- [x] Usuń `src/components/ui/dimension-preview.tsx` (R18)

#### Testy

- [x] Test: ProductPreview zmienia src przy zmianie mountingType
- [x] Test: DimensionInput akceptuje 623mm bez zaokrąglania w polu
- [x] Test: DimensionInput clampe'uje na blur (< 150 → 150, > 1950 → 1950)
- [x] Test: Montaż klejony + width 1400mm → alert, blokada
- [x] Test: RailStep renderuje 14 kart z realnymi zdjęciami
- [ ] Test (E2E): Krok 3: "Bezinwazyjny" → karuzela 2 systemów → "Wzmocniony" → packshot zmienia się → wymiary 800×1500 → listwa "Orzech" (dopłata widoczna) → kliknij zdjęcie → modal
- [ ] Test (E2E): Mobile: podgląd na górze, config pod spodem. Desktop: podgląd po lewej
- [ ] Test (E2E): Klejony → 1300mm → alert "Max 1200mm"

#### Weryfikacja

- [ ] Weryfikacja: ConfigStep renderuje podgląd + montaż + wymiary + listwę na jednej stronie
- [ ] Weryfikacja: Podgląd zmienia się dynamicznie przy zmianie montażu
- [ ] Weryfikacja: Swobodne wymiary działają
- [ ] Weryfikacja: Realne zdjęcia prowadnic widoczne
- [ ] Weryfikacja: Responsywność mobile/desktop

## Do poprawy po review fazy 4

- [ ] 🟠 [P2-important] **src/components/steps/rail-step.tsx:27-43** — lightbox używa DOM manipulation (`dialog.querySelector('img')`) zamiast React state. Zamienić `enlargedImgRef` na `useState` i renderować `<img>` warunkowo.
- [ ] 🟠 [P2-important] **src/components/layout/price-panel.tsx** — 240 linii, łączy logikę submit z prezentacją ceny. Wyciągnąć `useOrderSubmit()` hook lub rozdzielić w Unit 6.
- [ ] 🟠 [P2-important] **src/components/layout/price-panel.tsx:181-199** — panel wciąż pokazuje rozbicie dopłat za szer/wys (sprzeczne z R19-R20). Do refaktoru w Unit 6.
- [ ] 🟡 [P3-nit] **brak config-step.test.tsx / step-content.test.tsx** — brak dedykowanych testów ConfigStep i StepContent 3-krokowego.
- [ ] 🟡 [P3-nit] **src/components/steps/rail-step.tsx** — puste `src=""` w dialog img powoduje warnings w testach (powiązane z P2-1).
- [ ] 🟡 [P3-nit] **src/components/ui/dimension-input.tsx:66-68** — `<label>` bez `htmlFor`/`id` powiązania z inputem.
- [ ] 🟡 [P3-nit] **src/components/ui/mounting-carousel.tsx:47** — zbędny ternary `system.type === "bezinwazyjny" ? "bezinwazyjny" : "inwazyjny"`, wystarczy `system.type`.
- [ ] 🟡 [P3-nit] **src/components/ui/mounting-carousel.tsx** — brak obsługi nawigacji klawiaturowej (Arrow Left/Right).

---

## Faza 5: Multi-plisa

### Unit 6: Lista zamówienia + panel cenowy

**Nakład:** L | **Zależności:** Unit 3, Unit 4, Unit 5 | **Wymagania:** R19-R20, R24-R37

#### Implementacja

- [x] Stwórz `src/components/order/order-list.tsx` — lista pozycji z podsumowaniem
- [x] Stwórz `src/components/order/order-item-card.tsx` — karta pozycji (miniatura, parametry, cena, akcje)
- [x] Refaktor `src/components/layout/price-panel.tsx` — uproszczony (Cena rolety + Dopłata listwa = Razem), kontekstowy (configurator vs edit), pole ilości, "Dodaj"/"Zapisz"/"Anuluj"
- [x] Modyfikuj `src/components/configurator.tsx` — render OrderList gdy cart.view === 'order-list'
- [x] Dodaj toast notification (Sonner lub HeroUI) przy edycji z ilością > 1

#### Testy

- [x] Test: OrderList renderuje N pozycji z cenami
- [x] Test: +/- ilość aktualizuje totalPrice natychmiast
- [x] Test: Edytuj → wizard z wypełnionymi polami, przycisk "Zapisz"
- [x] Test: Duplikuj → kopia z nowym id, otwarta w edycji
- [x] Test: Usuń ostatnią pozycję → "Zamów" disabled
- [x] Test: PricePanel nie pokazuje "Doplata za szerokosc" ani "Doplata za wysokosc"
- [x] Test: Toast "Zaktualizowano 3 szt." przy edycji z quantity=3
- [ ] Test (E2E): Skonfiguruj plisę → "Dodaj" (ilość 2) → lista → "2 szt." → "+" → 3 szt. live → "Edytuj" → zmień kolor → "Zapisz" → lista zaktualizowana
- [ ] Test (E2E): "Dodaj kolejną" → czysty wizard → druga plisa → "Dodaj" → lista 2 pozycje
- [ ] Test (E2E): Edytuj → klejony + width > 1200mm → alert → blokada "Zapisz"
- [ ] Test (E2E): Edytuj → "Anuluj" → lista bez zmian

#### Weryfikacja

- [ ] Weryfikacja: Lista zamówienia z pełnym CRUD działa
- [ ] Weryfikacja: Panel cenowy uproszczony
- [ ] Weryfikacja: Edycja, duplikacja, usuwanie działają
- [ ] Weryfikacja: Live update ilości i sumy

## Do poprawy po review fazy 5

- [x] 🟠 [P2-important] **src/components/layout/price-panel.tsx** — 317 linii (limit 300). Łączy logikę budowania CartItem, submit/edit/cancel, pulse, toast, quantity, prezentację ceny. Wyciągnąć handlery do hooka lub rozdzielić.
- [x] 🟠 [P2-important] **src/components/order/order-list.tsx:72-95** — useEffect z brakującą zależnością `handleEdit`. Logika znajdowania duplikatu krucha (zakłada pozycję `originalIndex + 1` i porównanie tylko `fabricId`).
- [x] 🟠 [P2-important] **src/components/order/order-list.test.tsx** — testy pokrywają tylko empty state (3 testy). Brak testów: renderowanie N pozycji, +/- ilość, edycja, duplikacja, usuwanie, toast.
- [x] 🟠 [P2-important] **src/components/order/order-item-card.tsx** — brak pliku testowego `order-item-card.test.tsx`.
- [ ] 🟡 [P3-nit] **formatPrice()** zduplikowana 5 razy (header, price-panel, order-list, order-item-card, order-summary). Wyciągnąć do `src/utils/format.ts`.
- [ ] 🟡 [P3-nit] **src/components/configurator.tsx:13-36** — WizardProvider tworzona osobno dla obu widoków, resetuje state przy przełączaniu. Nieintuicyjne.
- [ ] 🟡 [P3-nit] **src/components/order/order-list.tsx:86-91** — sprawdzenie duplikatu porównuje tylko `fabricId` — false positive gdy dwa itemy mają taki sam fabric.
- [ ] 🟡 [P3-nit] **src/components/order/order-list.tsx:97-102** — placeholder `handleOrderSubmit` powinien mieć wyraźny TODO(Unit 7).
- [ ] 🟡 [P3-nit] **src/context/cart-context.tsx:89-91** — brak exhaustive check w default case (powtórzenie z fazy 3).

---

## Faza 6: Integracja i polish

### Unit 7: Order submission + summary + lookup (multi-item)

**Nakład:** M | **Zależności:** Unit 2, Unit 6 | **Wymagania:** R38-R44, R48

#### Implementacja

- [x] Refaktor `src/services/orders.ts` — submitOrder via RPC (multi-item), lookupOrder z items[]
- [x] Refaktor `src/components/order/order-summary.tsx` — tabela WSZYSTKICH pozycji + suma + jednostki + instrukcja + link Allegro
- [x] Refaktor `src/components/order/order-lookup.tsx` — wyświetlanie multi-item zamówienia

#### Testy

- [x] Test: submitOrder z 3 items → RPC zwraca order_number
- [x] Test: lookupOrder → order + 3 items
- [x] Test: Jednostki: ceil(175.75 / 1) → 176
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

- [x] Stwórz `src/hooks/use-beforeunload.ts` — hook (aktywny gdy items > 0 && !submitted)
- [x] Modyfikuj `src/components/configurator.tsx` — użycie hooka
- [x] Zaktualizuj `src/lib/analytics.ts` — eventy: step_1-3_viewed, item_added, item_edited, order_submitted (z items_count)
- [x] Zaktualizuj komponenty steps — analytics.trackStep() z nowymi numerami
- [x] Finalne style, hover, animacje, responsive fixes

#### Testy

- [x] Test: useBeforeunload aktywny gdy items > 0
- [x] Test: useBeforeunload nieaktywny gdy items === 0
- [x] Test: useBeforeunload nieaktywny po złożeniu zamówienia
- [x] Test: analytics.trackStep(1) → 'step_1_viewed'
- [ ] Test (E2E): Dodaj plisę → odśwież → dialog ostrzeżenia
- [ ] Test (E2E): Złóż zamówienie → odśwież → brak ostrzeżenia
- [ ] Test (E2E): Mobile: sticky panel na dole. Desktop: w prawym dolnym rogu

#### Weryfikacja

- [ ] Weryfikacja: Beforeunload działa poprawnie
- [ ] Weryfikacja: Analytics rejestruje nowe eventy
- [ ] Weryfikacja: `npm run typecheck && npm run lint && npm run test` — zero failures

---

## Podsumowanie postępu

| Faza                | Unit                             | Status      | Nakład |
| ------------------- | -------------------------------- | ----------- | ------ |
| 1. Fundament danych | Unit 1: Assety + images          | ✅ Zrobione | M      |
| 2. Baza danych      | Unit 2: Schema + RPC             | ✅ Zrobione | M      |
| 3. State            | Unit 3: Cart + Wizard 3 kroki    | ✅ Zrobione | L      |
| 4. UI wizarda       | Unit 4: Layout shell 3-krokowy   | ✅ Zrobione | M      |
| 4. UI wizarda       | Unit 5: Krok 3 composite         | ✅ Zrobione | XL     |
| 5. Multi-plisa      | Unit 6: Lista zamówienia + panel | ✅ Zrobione | L      |
| 6. Integracja       | Unit 7: Submission + summary     | ✅ Zrobione | M      |
| 6. Integracja       | Unit 8: Beforeunload + polish    | ✅ Zrobione | M      |
