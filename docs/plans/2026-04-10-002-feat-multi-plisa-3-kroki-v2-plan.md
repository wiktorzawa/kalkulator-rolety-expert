---
title: "feat: Multi-plisa, 3 kroki, nowe assety — refaktor konfiguratora V2"
type: feat
status: active
date: 2026-04-10
origin: docs/dev-brainstorms/2026-04-09-multi-plisa-wymiary-requirements.md
---

# feat: Multi-plisa, 3 kroki, nowe assety — refaktor konfiguratora V2

## Przegląd

Refaktor konfiguratora rolet z 5-krokowego single-item wizarda na 3-krokowy multi-plisa konfigurator. Klient może dodać wiele plis do jednego zamówienia (różne tkaniny, kolory, wymiary). Layout scalony: Krok 1 (Tkanina) → Krok 2 (Kolor) → Krok 3 (Montaż + Wymiary + Listwa z podglądem). Nowy schemat DB (orders + order_items), nowe assety z `stelge-assets/`, uproszczony panel cenowy.

## Ujęcie problemu

Konfigurator obsługuje jedną plisę na zamówienie — klient z wieloma oknami musi składać osobne zamówienia. Layout 5-krokowy jest mało czytelny. Pola wymiarów wymuszają krok 10mm. Panel cenowy pokazuje zbędne rozbicie dopłat. Assety w `public/assets/` mają starą strukturę (numerowane foldery) bez wariantów bezinwazyjnych packshot. (zob. źródło: docs/dev-brainstorms/2026-04-09-multi-plisa-wymiary-requirements.md)

## Śledzenie wymagań

Pełna lista: R1-R55 w requirements doc. Kluczowe grupy:

- R1-R4: Layout 3 kroki zamiast 5
- R5-R7: Podgląd rolety (packshot) w kroku 3
- R8-R13: Montaż karuzela + listwy siatka z realnymi zdjęciami
- R14-R18: Swobodne wymiary (bez kroku 10mm)
- R19-R20: Uproszczony panel cenowy
- R21-R37: Multi-plisa flow (lista zamówienia, edycja, duplikacja, ilość)
- R38-R44: Podsumowanie zamówienia + formuła Allegro
- R45-R49: Schemat DB relacyjny (orders + order_items)
- R50-R53: Nowe assety z stelge-assets/
- R54-R55: Beforeunload + odroczone matchowanie Allegro

## Granice scope'u

- Brak zamiany design systemu — HeroUI v3 pozostaje
- Brak koszyka persystentnego (localStorage) — odświeżenie = utrata listy
- Brak limitu pozycji na zamówienie
- Brak integracji API Allegro (kolumna allegro_tx_id przygotowana ale pusta)
- Brak panelu admina
- Brak rolet dachowych

## Kontekst i research

### Relevantny kod i wzorce

- `src/context/wizard-types.ts` — obecny WizardState (7 pól), 5 action types, INITIAL_STATE
- `src/context/wizard-context.tsx` — wizardReducer, isStepComplete(), WizardProvider z useMemo price
- `src/components/step-content.tsx` — scroll-based reveal (`state.step >= N`)
- `src/components/steps/` — 5 komponentów (fabric, color, mounting, dimensions, rail)
- `src/components/layout/price-panel.tsx` — submit + OrderSummary fullscreen overlay
- `src/services/orders.ts` — submitOrder (single config JSONB), lookupOrder (RPC)
- `src/utils/pricing.ts` — calculatePrice() — **bez zmian** (pricing engine stabilny, 8/8 testów pass)
- `src/data/images.ts` — proste path mappery (`assets/fabrics/`, `assets/colors/`)
- `supabase/migrations/` — 3 migracje (create_orders, restrict_select, restore_select)

### Assety — obecna vs nowa struktura

**Obecna** (`public/assets/`): numerowane foldery (01-Standard, 02-Standard-Termo...), flat pliki per kolor
**Nowa** (`stelge-assets/`): `produkty/{kolekcja}/{kolor}/` z `packshot.png`, `packshot-bezinwazyjny.png`, `tkanina.jpg`. Plus `montaz/{system}/`, `prowadnice/{kolor}.jpg`

### Wzorce do naśladowania

- Reducer pattern: istniejący `wizardReducer` w `wizard-context.tsx` — discriminated union actions
- Supabase insert + RPC lookup w `services/orders.ts`
- Scroll-based reveal w `step-content.tsx`
- Price calculation w `utils/pricing.ts` (lookup tables + clamp)

## Kluczowe decyzje techniczne

- **Osobny CartContext obok WizardContext:** WizardContext zarządza konfiguracją bieżącej plisy (3 kroki). CartContext zarządza listą pozycji zamówienia (items[]). Rozdzielenie odpowiedzialności — wizard nie wie o multi-plisie, cart nie wie o krokach. (zob. źródło: R22, odroczone pytanie)
- **Tryb edycji w WizardContext:** Nowa akcja `LOAD_ITEM` ładuje istniejącą pozycję do wizarda. Flag `editingItemId` w state odróżnia tryb nowy vs edycja. Przycisk zmienia się z "Dodaj" na "Zapisz". (zob. źródło: R32, odroczone pytanie)
- **Assety: mirror struktury stelge-assets/:** `public/assets/produkty/`, `public/assets/montaz/`, `public/assets/prowadnice/` — 1:1 z stelge-assets (bez `dachowe/`, `content/`, `inne/`). Stare foldery numerowane usunięte. (zob. źródło: R50, odroczone pytanie)
- **DB: nowa migracja, nie DROP:** Dodajemy tabelę `order_items` + modyfikujemy `orders` (dodajemy kolumny, usuwamy `config` JSONB). Sequence i trigger zachowane. (zob. źródło: R45-R49)
- **Karuzela montażu: Embla Carousel:** Lekka (3KB gzipped), React-native, headless. HeroUI nie ma karuzeli. Swiper zbyt ciężki (50KB+). (zob. źródło: R9-R10, odroczone pytanie)
- **Transaction na insert:** `orders` + `order_items` w jednej transakcji Supabase (RPC function). Jeśli order_items failnie, orders też rollbackuje. Numer RE-XXXXX nie "wycieknie". (rozwiązanie edge case #7)
- **Walidacja krzyżowa w edycji/duplikacji:** Ta sama logika co w nowej konfiguracji — klejony > 1200mm = blokada zapisu + warning. Duplikacja pozycji z nielegalnymi parametrami: otwiera edycję, warning widoczny, zapis zablokowany do korekty. (rozwiązanie edge cases #1, #6, #16)
- **Panel cenowy w edycji:** Pokazuje cenę edytowanego itemu. "Dotychczas w zamówieniu" = suma MINUS edytowany item (żeby uniknąć podwójnego liczenia). (rozwiązanie edge case #3)
- **Anulowanie edycji:** Przycisk "Anuluj" obok "Zapisz" — wraca na listę bez zmian. (rozwiązanie edge case #13)
- **Po "Dodaj do zamówienia":** Przechodzi na widok listy zamówienia. Przycisk "Dodaj kolejną" wraca do wizarda (krok 1, czysty state). (zob. źródło: R22, R29)

## Otwarte pytania

### Rozwiązane podczas planowania

- **Architektura state'u:** Osobny CartContext + WizardContext. Cart trzyma items[], wizard trzyma bieżącą konfigurację.
- **Edycja — jak przywrócić stan:** Akcja LOAD_ITEM w wizardzie + flag editingItemId.
- **Organizacja assetów:** Mirror stelge-assets/ w public/assets/ (bez dachowe/, content/, inne/).
- **Karuzela:** Embla Carousel (lekka, headless, React).
- **DB transaction:** RPC function `submit_order` wrappująca INSERT orders + INSERT order_items w jedną transakcję.
- **Beforeunload w edycji:** Tak, ostrzeżenie gdy edycja w toku (niezapisane zmiany) LUB lista niepusta.
- **Cena w edycji:** Zawsze przeliczana wg aktualnej konfiguracji. Zmiana tkaniny = nowa cena.
- **Pozycja po edycji:** Zostaje na swoim miejscu w liście, scroll do niej.
- **Zmiana ilości:** Cena jednostkowa stała (zero zniżek ilościowych). Zmiana ilości = live update sumy.
- **Jednostki Allegro w wizardzie:** Tylko na liście zamówienia i w podsumowaniu, nie w wizardzie konfiguracji.

### Odroczone do implementacji

- Dokładne propsy Embla Carousel (odkrycie przy budowie UI)
- Optymalizacja obrazów stelge-assets (mogą wymagać resize przed deployem)
- Feedback UX po duplikacji — toast z dokładnym tekstem do ustalenia w trakcie

## Implementation Units

### Faza 1: Fundament danych

- [ ] **Unit 1: Migracja assetów + aktualizacja image mappings**

  **Cel:** Nowe assety z `stelge-assets/` w `public/assets/` z nową strukturą. Image mappery zaktualizowane.

  **Wymagania:** R50, R51, R52, R53

  **Zależności:** Brak

  **Pliki:**
  - Stwórz: `scripts/copy-stelge-assets.sh` — skrypt kopiujący `stelge-assets/produkty/` → `public/assets/produkty/`, `stelge-assets/montaz/` → `public/assets/montaz/`, `stelge-assets/prowadnice/` → `public/assets/prowadnice/` (bez `dachowe/`)
  - Usuń: `public/assets/01-Standard/`, `02-Standard-Termo/`, ... (stare numerowane foldery)
  - Modyfikuj: `src/data/images.ts` — nowe ścieżki: `assets/produkty/{kolekcja}/{kolor}/packshot.png`, `assets/produkty/{kolekcja}/{kolor}/tkanina.jpg`, `assets/montaz/{system}/opis.png`, `assets/prowadnice/{kolor}.jpg`
  - Modyfikuj: `src/components/ui/fabric-card.tsx` — aktualizacja src obrazu
  - Modyfikuj: `src/components/ui/color-swatch.tsx` — aktualizacja src obrazu

  **Podejście:**
  - Skrypt bash z `cp -r`, exclude `dachowe/` i `content/`
  - `images.ts` — nowe funkcje: `getPackshotPath(kolekcja, kolor, bezinwazyjny)`, `getFabricSwatchPath(kolekcja, kolor)`, `getMountingImagePath(systemId, typ)`, `getRailImagePath(railId)`
  - Stare `getFabricImagePath()` i `getColorImagePath()` zastąpione nowymi

  **Wzorce do naśladowania:**
  - Istniejące `src/data/images.ts` (proste path mappery)
  - Struktura w `stelge-assets/STRUKTURA.md`

  **Scenariusze testowe:**
  - [Unit] `getPackshotPath('standard', 'biel', false)` → `'assets/produkty/standard/biel/packshot.png'`
  - [Unit] `getPackshotPath('standard', 'biel', true)` → `'assets/produkty/standard/biel/packshot-bezinwazyjny.png'`
  - [Unit] `getFabricSwatchPath('honeycomb', 'antracyt')` → `'assets/produkty/honeycomb/antracyt/zblizenie.png'` (honeycomb używa zblizenie.png)
  - [Unit] `getMountingImagePath('bezinwazyjny-wzmocniony', 'opis')` → `'assets/montaz/bezinwazyjny-wzmocniony/opis.png'`
  - [Unit] `getRailImagePath('biel')` → `'assets/prowadnice/biel.jpg'`

  **Weryfikacja:**
  - `public/assets/produkty/standard/biel/packshot.png` istnieje
  - `public/assets/montaz/bezinwazyjny-wzmocniony/opis.png` istnieje
  - `public/assets/prowadnice/biel.jpg` istnieje
  - Stare numerowane foldery usunięte
  - `npm run typecheck` przechodzi
  - Testy images.ts przechodzą

---

### Faza 2: Baza danych

- [ ] **Unit 2: Schemat relacyjny orders + order_items**

  **Cel:** Nowa tabela `order_items` (FK → orders), zmodyfikowana tabela `orders` (bez config JSONB), RPC `submit_order` jako transakcja, zaktualizowany `lookup_order`.

  **Wymagania:** R45, R46, R47, R48, R49

  **Zależności:** Brak (schemat DB niezależny od frontendu)

  **Pliki:**
  - Stwórz: `supabase/migrations/YYYYMMDDHHMMSS_create_order_items.sql`
  - Modyfikuj: `src/services/orders.ts` — nowe typy OrderItemInsert, OrderItemRecord, zaktualizowany submitOrder (via RPC), zaktualizowany lookupOrder (join order_items)
  - Test: `src/services/orders.test.ts` (jeśli istnieje — dodać testy typów)

  **Podejście:**
  - Migracja SQL:
    - DROP istniejących policies i trigger (cleanup)
    - ALTER TABLE `orders`: dodaj `total_price DECIMAL`, `allegro_units INT`, `allegro_tx_id TEXT NULL`, `utm_source TEXT`; DROP `config`, `price` (zastąpione przez total_price)
    - CREATE TABLE `order_items` z kolumnami z R46 (position, fabric_id/name, color_id/name, mounting_id/name/type, width_mm, height_mm, rail_id/name, quantity, unit_price)
    - FK: order_items.order_id → orders.id ON DELETE CASCADE
    - RPC `submit_order(p_items JSONB, p_total_price DECIMAL, p_allegro_units INT, p_utm_source TEXT)` — SECURITY DEFINER, BEGIN/COMMIT, INSERT orders + INSERT order_items w pętli, RETURN order_number
    - RPC `lookup_order(p_order_number TEXT)` — zaktualizowany, zwraca orders JOIN order_items
    - RLS: orders (public SELECT, public INSERT via RPC), order_items (public SELECT via join)
  - Frontend `submitOrder()` — wywołuje RPC zamiast bezpośredniego INSERT
  - Frontend `lookupOrder()` — zaktualizowany typ zwracany (order + items[])

  **Notatka wykonawcza:** R49 mówi "czyścimy tabelę i tworzymy schemat od zera" — migracja może robić DROP TABLE IF EXISTS orders CASCADE + CREATE od nowa. Prostsze niż ALTER.

  **Wzorce do naśladowania:**
  - Istniejący `supabase/migrations/20260409050254_create_orders.sql` (trigger + sequence pattern)
  - Istniejący `services/orders.ts` (RPC pattern)

  **Scenariusze testowe:**
  - [Unit] RPC submit_order z 3 pozycjami → zwraca order_number RE-XXXXX + 3 order_items
  - [Unit] RPC submit_order z błędną pozycją → cała transakcja rollback, zero wycieków order_number
  - [Unit] RPC lookup_order('RE-00001') → zwraca order + items[]
  - [Unit] RPC lookup_order('BRAK') → zwraca null/empty
  - [Unit] Sequence generuje kolejne numery przy concurrent inserts (UNIQUE constraint)

  **Weryfikacja:**
  - `supabase db push` wykonuje się bez błędów
  - INSERT via RPC generuje order + items poprawnie
  - Lookup zwraca order z listą pozycji
  - Stare dane testowe wyczyszczone

---

### Faza 3: Architektura state

- [ ] **Unit 3: CartContext + refaktor WizardContext na 3 kroki**

  **Cel:** Nowy CartContext zarządzający listą pozycji zamówienia. WizardContext zrefaktorowany na 3 kroki z trybem edycji.

  **Wymagania:** R1, R4, R7, R21-R25, R27-R37

  **Zależności:** Unit 1 (image paths), Unit 2 (OrderItemInsert type)

  **Pliki:**
  - Stwórz: `src/context/cart-context.tsx` — CartProvider, useCart hook, cartReducer
  - Stwórz: `src/context/cart-types.ts` — CartItem, CartState, CartAction
  - Modyfikuj: `src/context/wizard-types.ts` — STEP_LABELS = ['Tkanina', 'Kolor', 'Konfiguracja'], TOTAL_STEPS = 3, dodaj editingItemId, LOAD_ITEM action
  - Modyfikuj: `src/context/wizard-context.tsx` — reducer obsługuje 3 kroki + LOAD_ITEM
  - Modyfikuj: `src/App.tsx` — CartProvider wrapper
  - Test: `src/context/cart-context.test.tsx`
  - Test: `src/context/wizard-context.test.tsx` (aktualizacja istniejących testów)

  **Podejście:**
  - CartItem: `{ id: string, fabricId, fabricName, colorId, colorName, mountingId, mountingName, mountingType, widthMm, heightMm, railId, railName, quantity, unitPrice }`
  - CartState: `{ items: CartItem[], view: 'configurator' | 'order-list' }`
  - CartActions: `ADD_ITEM | REMOVE_ITEM | UPDATE_ITEM | DUPLICATE_ITEM | SET_QUANTITY | SET_VIEW`
  - ADD_ITEM: generuje UUID, liczy cenę z `calculatePrice()`
  - UPDATE_ITEM: zastępuje item po id, przelicza cenę
  - DUPLICATE_ITEM: klonuje z nowym id, ustawia view='configurator', dispatch LOAD_ITEM do wizarda
  - SET_QUANTITY: aktualizuje ilość, live update
  - WizardContext zmiany:
    - STEP_LABELS = ['Tkanina', 'Kolor', 'Konfiguracja']
    - Krok 3 = montaż + wymiary + listwa (isStepComplete(3) sprawdza wszystkie trzy)
    - LOAD_ITEM: ustawia fabricId, colorId, mountingId, mountingType, widthMm, heightMm, railId, step=1, editingItemId=itemId
    - RESET: czyści state do INITIAL_STATE (po dodaniu do cart)
  - useCart hook: `{ state, dispatch, totalPrice, totalItems, addCurrentConfig, updateEditedConfig }`

  **Wzorce do naśladowania:**
  - Istniejący `wizard-context.tsx` (discriminated union reducer, useMemo price)

  **Scenariusze testowe:**
  - [Unit] ADD_ITEM dodaje pozycję z UUID i ceną
  - [Unit] REMOVE_ITEM usuwa po id
  - [Unit] SET_QUANTITY(id, 3) aktualizuje ilość, totalPrice = unitPrice × 3
  - [Unit] DUPLICATE_ITEM klonuje z nowym id
  - [Unit] UPDATE_ITEM zastępuje konfigurację, przelicza cenę
  - [Unit] totalPrice = suma (unitPrice × quantity) dla wszystkich items
  - [Unit] LOAD_ITEM w wizard: ustawia wszystkie pola + editingItemId
  - [Unit] RESET w wizard: czyści do INITIAL_STATE, editingItemId = null
  - [Unit] isStepComplete(3) = true gdy mounting + dimensions + rail wybrane
  - [Unit] SELECT_FABRIC resetuje colorId (zachowane zachowanie)
  - [Unit] Zmiana tkaniny w edycji: jeśli kolor istnieje w nowej palecie → zachowaj, jeśli nie → resetuj (R33)

  **Weryfikacja:**
  - Testy cart-context przechodzą
  - Istniejące testy wizard-context zaktualizowane i przechodzą
  - `npm run typecheck` przechodzi

---

### Faza 4: UI wizarda i layout

- [ ] **Unit 4: Layout shell — 3-krokowy stepper + StepContent refaktor**

  **Cel:** Nawigacja 3-krokowa, step indicator, StepContent renderuje 3 kroki. Przełączanie configurator ↔ order-list.

  **Wymagania:** R1, R2, R3, R4, R22, R23, R25

  **Zależności:** Unit 3 (CartContext, WizardContext 3 kroki)

  **Pliki:**
  - Modyfikuj: `src/components/layout/step-indicator.tsx` — 3 kroki z nowymi etykietami
  - Modyfikuj: `src/components/step-content.tsx` — 3 kroki: FabricStep, ColorStep, ConfigStep (nowy)
  - Modyfikuj: `src/components/layout/header.tsx` — progress bar 3-krokowy
  - Modyfikuj: `src/components/configurator.tsx` — conditional render: configurator vs order-list
  - Modyfikuj: `src/App.tsx` — routing: orderParam → lookup, brak → configurator/order-list (z CartContext view)

  **Podejście:**
  - StepContent: `<FabricStep />`, `{step >= 2 && <ColorStep />}`, `{step >= 3 && <ConfigStep />}`
  - ConfigStep = nowy komponent łączący montaż + wymiary + listwę na jednej stronie (Unit 5)
  - Configurator: `if (cart.view === 'order-list') → <OrderList />` else `<StepContent /> + <PricePanel />`
  - Step indicator: 3 przyciski z ptaszkami na ukończonych, aktywny wyróżniony

  **Wzorce do naśladowania:**
  - Istniejący `step-content.tsx` (scroll-based reveal)
  - Istniejący `step-indicator.tsx` (buttons + aria-current)

  **Scenariusze testowe:**
  - [Unit] StepContent renderuje 3 kroki (nie 5)
  - [Unit] Progress bar pokazuje 33%/66%/100%
  - [E2E] Otwórz stronę → widoczny krok 1 "Tkanina" → wybierz → scroll do kroku 2 "Kolor" → wybierz → scroll do kroku 3 "Konfiguracja"
  - [E2E] Po dodaniu plisy → widok listy zamówienia → "Dodaj kolejną" → powrót do wizarda krok 1

  **Weryfikacja:**
  - Nawigacja 3-krokowa działa
  - Przełączanie configurator ↔ order-list działa
  - `npm run typecheck` przechodzi

---

- [ ] **Unit 5: Krok 3 composite — podgląd + montaż + wymiary + listwa**

  **Cel:** Nowy komponent ConfigStep łączący podgląd rolety, montaż (karuzela), wymiary (swobodne) i listwę (siatka ze zdjęciami) na jednej stronie.

  **Wymagania:** R3, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16, R17, R18

  **Zależności:** Unit 1 (assety + image mappery), Unit 3 (wizard state), Unit 4 (layout shell)

  **Pliki:**
  - Stwórz: `src/components/steps/config-step.tsx` — layout: desktop (podgląd left + konfiguracja right), mobile (podgląd top + konfiguracja bottom)
  - Stwórz: `src/components/ui/product-preview.tsx` — podgląd packshot (zmiana przy bezinwazyjny/inwazyjny)
  - Modyfikuj: `src/components/steps/mounting-step.tsx` — refaktor na karuzela (2 poziomy: kategoria + systemy)
  - Stwórz: `src/components/ui/mounting-carousel.tsx` — karuzela systemów montażu (Embla Carousel)
  - Modyfikuj: `src/components/steps/dimensions-step.tsx` — swobodne wymiary (bez kroku 10mm w polu tekstowym)
  - Modyfikuj: `src/components/ui/dimension-input.tsx` — input number przyjmuje dowolną wartość w zakresie, slider zsynchronizowany
  - Modyfikuj: `src/components/steps/rail-step.tsx` — siatka z realnymi zdjęciami prowadnic (zamiast hex kwadratów)
  - Usuń: `src/components/ui/dimension-preview.tsx` — zastąpiony przez product-preview (R18)
  - Dodaj zależność: `embla-carousel-react`

  **Podejście:**
  - ConfigStep layout: `grid grid-cols-1 md:grid-cols-2 gap-8`. Left: ProductPreview (sticky na desktop). Right: MountingStep → DimensionsStep → RailStep (flow na jednej stronie, bez separacji)
  - ProductPreview: `<img src={getPackshotPath(kolekcja, kolor, isBezinwazyjny)} />` — zmiana dynamiczna przy przełączaniu montażu
  - MountingStep refaktor:
    - Poziom 1: dwa duże przyciski "BEZINWAZYJNY" (rekomendowany) / "INWAZYJNY" (najtrwalszy)
    - Poziom 2: Embla Carousel z systemami wybranej kategorii
    - Każdy slide: zdjęcie profilu (zbliżenie) + nazwa + opis + grafika pomiarowa
    - Info pod karuzelą: "Kolor systemu montażowego będzie taki sam jak wybrany kolor listwy"
  - DimensionsStep: slider (krok 1mm) + input number (dowolna wartość integer w zakresie). Slider i input zsynchronizowane. Clamping tylko na blur (min/max). Walidacja: klejony max 1200mm z alertem
  - RailStep: siatka 2 kol mobile / 4-5 kol desktop. Karty z realnymi zdjęciami z `assets/prowadnice/`. Kliknięcie → powiększenie (HeroUI Modal). Dopłata widoczna jeśli > 0 zł

  **Wzorce do naśladowania:**
  - Istniejące mounting-step.tsx (karty kategorii)
  - Istniejące dimension-input.tsx (slider + input sync)
  - Istniejące rail-step.tsx (siatka)

  **Scenariusze testowe:**
  - [Unit] ProductPreview zmienia src przy zmianie mountingType (bezinwazyjny ↔ inwazyjny)
  - [Unit] DimensionInput akceptuje 623mm bez zaokrąglania w polu
  - [Unit] DimensionInput clampe'uje wartość na blur (< 150 → 150, > 1950 → 1950)
  - [Unit] Walidacja: montaż klejony + width 1400mm → alert, blokada zapisu
  - [Unit] RailStep renderuje 14 kart z realnymi zdjęciami
  - [E2E] Krok 3: wybierz "Bezinwazyjny" → karuzela z 2 systemami → wybierz "Wzmocniony" → packshot zmienia się na bezinwazyjny → ustaw wymiary 800×1500 → wybierz listwę "Orzech" (dopłata 9,50 zł widoczna) → kliknij zdjęcie listwy → modal powiększenia
  - [E2E] Mobile: podgląd na górze, konfiguracja pod spodem. Desktop: podgląd po lewej, konfiguracja po prawej
  - [E2E] Zmień montaż na klejony → wpisz 1300mm → alert "Max 1200mm"

  **Weryfikacja:**
  - ConfigStep renderuje podgląd + montaż + wymiary + listwę na jednej stronie
  - Podgląd zmienia się dynamicznie
  - Swobodne wymiary działają (bez kroku 10mm)
  - Realne zdjęcia prowadnic widoczne
  - Responsywność mobile/desktop

---

### Faza 5: Multi-plisa

- [ ] **Unit 6: Lista zamówienia + panel cenowy**

  **Cel:** Widok listy zamówienia z CRUD na pozycjach. Zrefaktorowany panel cenowy (uproszczony + kontekstowy).

  **Wymagania:** R19, R20, R24, R25, R26, R27, R28, R29, R30, R31, R32, R33, R34, R35, R36, R37

  **Zależności:** Unit 3 (CartContext), Unit 4 (view switching), Unit 5 (ConfigStep for edit mode)

  **Pliki:**
  - Stwórz: `src/components/order/order-list.tsx` — lista pozycji zamówienia
  - Stwórz: `src/components/order/order-item-card.tsx` — karta pozycji (miniatura, parametry, cena, akcje)
  - Modyfikuj: `src/components/layout/price-panel.tsx` — uproszczony: "Cena rolety: X zł" + "Dopłata listwa: Y zł" = "Razem: Z zł". Kontekstowy: w configuratorze "Dodaj do zamówienia" (z polem ilości), na liście "Zamów przez Allegro"
  - Modyfikuj: `src/components/configurator.tsx` — render order-list gdy cart.view === 'order-list'

  **Podejście:**
  - OrderList:
    - Lista pozycji: OrderItemCard per item
    - Podsumowanie: suma zamówienia, liczba jednostek Allegro
    - Przyciski: "Dodaj kolejną" (nowy wizard), "Zamów przez Allegro" (aktywny gdy ≥1 pozycja)
  - OrderItemCard:
    - Miniatura (packshot), tkanina, kolor, montaż + system, wymiary, listwa, ilość, cena jednostkowa, cena łączna
    - Akcje: Edytuj, Duplikuj, Usuń (z potwierdzeniem), +/- ilość (live)
    - Edytuj → dispatch LOAD_ITEM do wizarda + SET_VIEW('configurator')
    - Duplikuj → dispatch DUPLICATE_ITEM (klonuje) + LOAD_ITEM + SET_VIEW('configurator')
    - Usuń → confirm dialog → REMOVE_ITEM
    - +/- ilość → SET_QUANTITY (live, bez "Zaktualizuj")
  - PricePanel refaktor:
    - W configuratorze: "Cena rolety: {cena bez listwy} zł", opcjonalnie "Dopłata listwa: Y zł", "Razem: Z zł". Pole ilości (default 1). Przycisk "Dodaj do zamówienia" / "Zapisz" (w edycji). Opcjonalnie "Anuluj" (w edycji)
    - Jeśli w edycji: "Dotychczas w zamówieniu: {suma - edytowany item} zł (N-1 pozycji)"
    - Na liście zamówienia: osobny UI (w OrderList, nie PricePanel)
    - Bez osobnych dopłat za szerokość/wysokość (R19)
  - Toast notification przy edycji pozycji z ilością > 1: "Zaktualizowano N szt." (R35)

  **Wzorce do naśladowania:**
  - Istniejący `price-panel.tsx` (submit flow, price pulsing)
  - PROMPT-KONFIGURATOR.md sekcja "Lista zamówienia"

  **Scenariusze testowe:**
  - [Unit] OrderList renderuje N pozycji z cenami
  - [Unit] +/- ilość aktualizuje totalPrice natychmiast
  - [Unit] Edytuj → wizard z wypełnionymi polami, przycisk "Zapisz" (nie "Dodaj")
  - [Unit] Duplikuj → kopia z nowym id, otwarta w edycji
  - [Unit] Usuń ostatnią pozycję → "Zamów" disabled
  - [Unit] PricePanel nie pokazuje "Doplata za szerokosc" ani "Doplata za wysokosc"
  - [Unit] Toast "Zaktualizowano 3 szt." przy edycji pozycji z quantity=3
  - [E2E] Skonfiguruj plisę → "Dodaj do zamówienia" (ilość 2) → widok listy → pozycja widoczna z "2 szt." → kliknij "+" → 3 szt., cena zmiana live → "Edytuj" → wizard z wypełnionymi polami → zmień kolor → "Zapisz" → wraca na listę, kolor zaktualizowany
  - [E2E] "Dodaj kolejną" → czysty wizard od kroku 1 → konfiguruj drugą plisę → "Dodaj" → lista z 2 pozycjami
  - [E2E] Edytuj pozycję → zmień montaż na klejony z width > 1200mm → alert → blokada "Zapisz"
  - [E2E] Edytuj → "Anuluj" → wraca na listę bez zmian

  **Weryfikacja:**
  - Lista zamówienia z pełnym CRUD działa
  - Panel cenowy uproszczony (bez rozbicia dopłat)
  - Edycja, duplikacja, usuwanie działają poprawnie
  - Live update ilości i sumy

---

### Faza 6: Integracja i polish

- [ ] **Unit 7: Order submission + summary + lookup (multi-item)**

  **Cel:** Zapis multi-item zamówienia do Supabase, ekran podsumowania z instrukcją Allegro, lookup po ?order= z listą pozycji.

  **Wymagania:** R38, R39, R40, R41, R42, R43, R44, R48

  **Zależności:** Unit 2 (DB schema + RPC), Unit 6 (order list UI)

  **Pliki:**
  - Modyfikuj: `src/services/orders.ts` — submitOrder (via RPC submit_order, multi-item), lookupOrder (zwraca order + items[])
  - Modyfikuj: `src/components/order/order-summary.tsx` — tabela WSZYSTKICH pozycji + suma + jednostki + instrukcja + link Allegro
  - Modyfikuj: `src/components/order/order-lookup.tsx` — wyświetlanie multi-item zamówienia
  - Modyfikuj: `src/config/allegro.ts` — ALLEGRO_UNIT_PRICE (upewnienie że Math.ceil(suma / UNIT_PRICE))

  **Podejście:**
  - submitOrder: mapuje CartItem[] → OrderItemInsert[], wywołuje RPC `submit_order`
  - OrderSummary:
    - Numer zamówienia #RE-XXXXX
    - Tabela pozycji: tkanina, kolor, montaż+system, wymiary, listwa, ilość, cena
    - Suma zamówienia + "Kwota obejmuje wszystkie N pozycji z Twojego zamówienia" (jeśli N > 1)
    - Liczba jednostek Allegro (duży tekst)
    - "Jedna sztuka na aukcji oznacza kwotę X złotych. Złóż zamówienie w ilości: N sztuk"
    - Instrukcja krok-po-kroku (wzór Stelge)
    - Przycisk "Przejdź do aukcji Allegro" (target=\_blank)
  - OrderLookup: wyświetla order + listę items (zamiast single config JSONB)

  **Wzorce do naśladowania:**
  - Istniejący `order-summary.tsx` (layout instrukcji)
  - Istniejący `orders.ts` (RPC pattern)
  - PROMPT-KONFIGURATOR.md sekcja "Podsumowanie zamówienia"

  **Scenariusze testowe:**
  - [Unit] submitOrder z 3 items → RPC zwraca order_number
  - [Unit] lookupOrder('RE-00001') → order + 3 items
  - [Unit] Jednostki: suma 175.75 / UNIT_PRICE 1 → 176 jednostek
  - [E2E] Lista z 2 pozycjami → "Zamów przez Allegro" → podsumowanie: tabela 2 pozycji + suma + jednostki + instrukcja + link Allegro + numer RE-XXXXX
  - [E2E] Otwórz ?order=RE-00001 → podsumowanie z listą pozycji
  - [E2E] Otwórz ?order=BRAK → "Zamówienie nie znalezione"

  **Weryfikacja:**
  - Multi-item zamówienie zapisuje się w Supabase
  - Podsumowanie wyświetla wszystkie pozycje
  - Lookup działa z multi-item
  - URL aktualizuje się po submit (?order=RE-XXXXX)

---

- [ ] **Unit 8: Beforeunload + walidacje + analytics + polish**

  **Cel:** Ostrzeżenie przy odświeżaniu, walidacje krzyżowe, analytics tracking, finalne poprawki UI.

  **Wymagania:** R54, R55, R5 (walidacja montaż+wymiary w edycji)

  **Zależności:** Unit 7 (kompletny flow)

  **Pliki:**
  - Stwórz: `src/hooks/use-beforeunload.ts` — hook beforeunload (aktywny gdy cart.items.length > 0 && !orderSubmitted)
  - Modyfikuj: `src/components/configurator.tsx` — użycie hooka
  - Modyfikuj: `src/lib/analytics.ts` — zaktualizowane eventy: step_1-3_viewed (nie 5), item_added, item_edited, order_submitted (z liczbą pozycji)
  - Modyfikuj: komponenty steps — analytics.trackStep() z nowymi numerami kroków
  - Modyfikuj: `src/components/layout/price-panel.tsx` — finalne style, hover, animacje

  **Podejście:**
  - useBeforeunload: `useEffect(() => { window.addEventListener('beforeunload', handler); return () => ... })`. Handler: `e.preventDefault()` (nowoczesne API, bez returnValue). Aktywny gdy items > 0 i !submitted.
  - W edycji: beforeunload też aktywny jeśli editingItemId !== null (niezapisane zmiany)
  - Analytics: 3 step eventy zamiast 5 + item_added + item_edited + order_submitted (z items_count)
  - Polish: hover na kartach, pulse ceny, responsive fixes, toast notifications (Sonner lub HeroUI)

  **Scenariusze testowe:**
  - [Unit] useBeforeunload aktywny gdy items > 0
  - [Unit] useBeforeunload nieaktywny gdy items === 0
  - [Unit] useBeforeunload nieaktywny po złożeniu zamówienia
  - [Unit] analytics.trackStep(1) → 'step_1_viewed'
  - [E2E] Dodaj plisę → spróbuj odświeżyć → dialog ostrzeżenia przeglądarki
  - [E2E] Złóż zamówienie → spróbuj odświeżyć → brak ostrzeżenia
  - [E2E] Mobile: sticky panel cenowy na dole. Desktop: w prawym dolnym rogu

  **Weryfikacja:**
  - Beforeunload działa poprawnie
  - Analytics rejestruje nowe eventy
  - UI wygląda dobrze na mobile i desktop
  - `npm run typecheck && npm run lint && npm run test` — zero failures

## Wpływ systemowy

- **Supabase:** DROP istniejącej tabeli orders + CREATE od nowa z order_items. Nowa RPC `submit_order`. Stare dane testowe utracone (R49 — świadoma decyzja)
- **Frontend state:** Nowy CartContext (addytywny). WizardContext zmodyfikowany (3 kroki + LOAD_ITEM)
- **Assety:** Pełna wymiana `public/assets/` — stara struktura usunięta, nowa z stelge-assets/
- **Analytics:** Zmiana eventów (5 step → 3 step, dodatkowe item_added/edited). Funnel PostHog do rekonfiguracji
- **Vercel:** Zero zmian w konfiguracji deploy. public/assets/ serwowany przez CDN jak dotychczas
- **Nowa zależność:** `embla-carousel-react` (~3KB gzipped) — karuzela montażu

## Ryzyka i zależności

- **Embla Carousel kompatybilność z HeroUI v3:** Headless library, nie powinno kolidować. Fallback: custom carousel z CSS scroll-snap
- **Rozmiar assetów:** stelge-assets/ to ~72MB. Po skopiowaniu do public/assets/ (bez dachowe/) będzie ~50MB w repo. Akceptowalne na V2, ale w przyszłości rozważyć CDN/optimization
- **DB migration na produkcji:** DROP TABLE orders kasuje istniejące zamówienia. R49 mówi "czyścimy" — ale potwierdź z właścicielem że żadne realne zamówienia nie istnieją
- **Sequence reset:** Nowa migracja resetuje orders_seq. Nowe numery od RE-00001
- **HeroUI Modal dla lightbox listew:** HeroUI v3 Modal powinien wystarczyć. Jeśli problemy z performance — fallback na natywny `<dialog>`

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-04-09-multi-plisa-wymiary-requirements.md](docs/dev-brainstorms/2026-04-09-multi-plisa-wymiary-requirements.md)
- **Specyfikacja produktowa:** PROMPT-KONFIGURATOR.md
- **Plan V1:** docs/plans/2026-04-09-001-feat-konfigurator-rolet-v1-plan.md
- **Assety źródłowe:** stelge-assets/STRUKTURA.md
- **Istniejący kod:** src/context/wizard-context.tsx, src/services/orders.ts, src/utils/pricing.ts
