---
title: "feat: Konfigurator rolet plisowanych — rolety.expert V1"
type: feat
status: active
date: 2026-04-09
origin: docs/dev-brainstorms/2026-04-09-konfigurator-rolet-requirements.md
---

# feat: Konfigurator rolet plisowanych — rolety.expert V1

## Przegląd

SPA kalkulator rolet plisowanych dla rolety.expert. Klient z aukcji Allegro konfiguruje roletę w 5 krokach, dostaje cenę i liczbę jednostek do kupienia na Allegro. Zamówienia zapisywane w Supabase.

## Ujęcie problemu

Allegro nie obsługuje produktów na wymiar. Sprzedawca potrzebuje zewnętrznego konfiguratora — klient konfiguruje, poznaje cenę, wraca na Allegro z liczbą jednostek. Bez tego: manualna obsługa lub utrata klientów. (zob. źródło: docs/dev-brainstorms/2026-04-09-konfigurator-rolet-requirements.md)

## Śledzenie wymagań

Pełna lista: R1-R46 w requirements doc. Kluczowe:

- R1. 5-krokowy wizard (Tkanina → Kolor → Montaż → Wymiary → Listwa)
- R8-R13. Kalkulacja ceny w czasie rzeczywistym (Stelge × 0.95)
- R14-R18, R36-R39. Integracja Allegro + order lookup
- R19, R21, R42-R44. Supabase persistence (orders + migracje)
- R25-R27. PostHog minimal (7 eventów)
- R28-R33, R40-R41. UI: HeroUI v3 + Tailwind v4, mobile-first
- R34. Dane produktowe w src/data/ (dedykowane dla rolet)
- R45-R46. useReducer + Context + useMemo pricing

## Granice scope'u

- Tylko rolety plisowane okienne
- Brak: panelu admina, auth, koszyka, płatności, API Allegro, Edge Functions
- Brak: Supabase Storage (obrazy w repo), Framer Motion (CSS first), generycznej architektury
- Config (URL Allegro, ceny) = stałe w kodzie

## Kontekst i research

### Relevantny kod i wzorce

- `index-prototyp.html` — prototyp Alpine.js z pełną logiką cenową, danymi produktowymi, step navigation. Wzorzec do przeniesienia do React.
- Formuła szerokości z prototypu: `Math.ceil(Math.ceil(width / 10) / 5) * 5`
- Zaokrąglanie ceny: `Math.round(price * 4) / 4`
- Tabele cenowe, kolory, tkaniny — wszystkie dane w prototypie, do przeniesienia do src/data/

### Kompatybilność stacku (zweryfikowana)

- HeroUI v3 + React 19: ✅ natywne wsparcie
- HeroUI v3 + Tailwind CSS v4: ✅ natywne wsparcie (@theme directive)
- HeroUI v3 + Vite: ✅ oficjalny template (heroui-inc/vite-template)
- HeroUI v3 Stepper: ❌ brak — custom z Progress + Button
- Dostępne komponenty: Card, Slider, Modal, Button, Select, Progress

### Asset inventory

- 118 obrazów okiennych (foldery 01-07) — do public/assets/
- 27 zdjęć montażowych (foldery 13-16) — do public/assets/
- 16 materiałów dodatkowych (foldery 17-21) — do public/assets/
- 72 obrazy dachowe (foldery 08-12) — poza scope V1, nie kopiować

### Referencje zewnętrzne

- HeroUI v3 Vite template: github.com/heroui-inc/vite-template
- Supabase DB triggers: supabase.com/docs/guides/database/postgres/triggers
- PostHog JS SDK: posthog.com/docs/libraries/js

## Kluczowe decyzje techniczne

- **useReducer + Context** zamiast Zustand/Jotai: wizard state to 7 pól, zero powodu na zewnętrzną zależność
- **DB trigger + sequence** zamiast Edge Function: prostsze, zero cold start, trigger jest atomowy z INSERT
- **Obrazy w public/assets/** zamiast Supabase Storage: statyczne assety, Vercel CDN wystarczy
- **CSS transitions + View Transitions API** zamiast Framer Motion: 90% potrzeb pokryte, 32KB mniej
- **Custom Stepper** zamiast HeroUI Pro: HeroUI v3 nie ma Steppera w free tier, custom z Progress + Button
- **PostHog minimal**: 7 eventów + wrapper, zero session replay / feature flags
- **Dedykowane typy** zamiast generycznej architektury: konkretne interfejsy dla rolet plisowanych

## Otwarte pytania

### Rozwiązane podczas planowania

- **Analytics:** PostHog free tier, 7 eventów, wrapper w src/lib/analytics.ts
- **Order number:** DB trigger + sequence (format #RE-XXXXX, zero-padded)
- **Product data:** TypeScript modules w src/data/ (pliki per domenę)
- **HeroUI version:** v3 — pełna kompatybilność z React 19 + Tailwind v4 + Vite
- **Image organization:** public/assets/ mirrorujące strukturę stelge-materialy/ (bez folderów dachowych 08-12)

### Odroczone do implementacji

- Dokładne propsy i warianty komponentów HeroUI v3 (odkrycie w trakcie budowy UI)
- Optymalizacja obrazów (format, rozmiar) — mogą wymagać batch resize przed deployem
- View Transitions API fallback — jeśli browser support niewystarczający, evaluate Framer Motion

## Implementation Units

### Faza 1: Fundament

- [x] **Unit 1: Scaffolding projektu**

  **Cel:** Działający dev server z HeroUI v3, Tailwind v4 i Supabase client

  **Wymagania:** R40, R42

  **Zależności:** Brak

  **Pliki:**
  - Stwórz: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`
  - Stwórz: `src/main.tsx`, `src/App.tsx`
  - Stwórz: `src/lib/supabase.ts` (klient Supabase z env vars)
  - Stwórz: `.env.example` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_POSTHOG_KEY)
  - Stwórz: `index.html`

  **Podejście:**
  - Użyj oficjalnego HeroUI v3 Vite template jako punkt startowy (`heroui-inc/vite-template`)
  - Dodaj `@supabase/supabase-js` i `posthog-js`
  - Tailwind v4 z HeroUI plugin + custom brand colors (z prototypu)
  - TypeScript strict mode

  **Wzorce do naśladowania:**
  - HeroUI Vite template (github.com/heroui-inc/vite-template)
  - Tailwind brand colors z `index-prototyp.html` (palette brand/accent/sage)

  **Scenariusze testowe:**
  - [Unit] Dev server startuje bez błędów
  - [Unit] HeroUI Button renderuje się poprawnie
  - [Unit] Supabase client łączy się (console log na mount)
  - [E2E] Otwórz localhost, sprawdź że strona ładuje się z HeroUI komponentem

  **Weryfikacja:**
  - `npm run dev` startuje bez błędów
  - `npm run typecheck` przechodzi
  - Strona renderuje HeroUI komponent

---

- [x] **Unit 2: Supabase schema + migracje**

  **Cel:** Tabela orders z triggerem generującym #RE-XXXXX, RLS policies, wersjonowany schemat

  **Wymagania:** R19, R21, R42, R43, R44

  **Zależności:** Unit 1 (Supabase client)

  **Pliki:**
  - Stwórz: `supabase/config.toml`
  - Stwórz: `supabase/migrations/YYYYMMDDHHMMSS_create_orders.sql`
  - Stwórz: `supabase/seed.sql` (opcjonalnie — testowe zamówienie)

  **Podejście:**
  - `supabase init` + `supabase migration new create_orders`
  - Tabela `orders`: id (BIGINT IDENTITY), order_number (TEXT UNIQUE), config (JSONB), price (DECIMAL), allegro_units (INT), utm_source (TEXT), created_at (TIMESTAMPTZ DEFAULT now())
  - Sequence `orders_seq` + trigger `set_order_number` formatujący `'RE-' || LPAD(nextval('orders_seq')::text, 5, '0')`
  - RLS: public SELECT (po order_number), public INSERT
  - Index na order_number (B-tree)
  - `supabase db push` do remote

  **Wzorce do naśladowania:**
  - Supabase triggers docs (supabase.com/docs/guides/database/postgres/triggers)

  **Scenariusze testowe:**
  - [Unit] INSERT do orders generuje order_number w formacie #RE-XXXXX
  - [Unit] SELECT po order_number zwraca zamówienie
  - [Unit] INSERT bez order_number — trigger uzupełnia automatycznie
  - [Unit] Kolejne INSERT-y generują sekwencyjne numery (RE-00001, RE-00002...)

  **Weryfikacja:**
  - `supabase db push` wykonuje się bez błędów
  - Ręczny INSERT w Supabase Dashboard generuje RE-00001
  - SELECT z RLS działa dla public (anon key)

---

### Faza 2: Domena

- [ ] **Unit 3: Dane produktowe + silnik cenowy**

  **Cel:** Kompletne dane produktowe w src/data/ i przetestowany pricing engine

  **Wymagania:** R2, R3, R6, R8-R12, R34

  **Zależności:** Unit 1 (TypeScript setup)

  **Pliki:**
  - Stwórz: `src/data/fabrics.ts` — 8 typów tkanin + palety kolorów + dziedziczenie Termo
  - Stwórz: `src/data/pricing.ts` — tabele dopłat (szerokość 39 progów, wysokość 3 progi, bazy per tkanina × montaż)
  - Stwórz: `src/data/mounting.ts` — 5 systemów montażu, ograniczenia (klejony max 1200mm)
  - Stwórz: `src/data/rails.ts` — 14 kolorów listew + dopłaty
  - Stwórz: `src/data/images.ts` — mapowanie: tkanina → kolor → ścieżka obrazu
  - Stwórz: `src/data/index.ts` — reeksport
  - Stwórz: `src/data/types.ts` — interfejsy: Fabric, Color, MountingSystem, RailColor, PriceTier
  - Stwórz: `src/utils/pricing.ts` — calculatePrice(), widthToCm(), heightToTier(), roundToQuarter()
  - Stwórz: `src/utils/pricing.test.ts` — 8 przykładów weryfikacyjnych + edge cases
  - Stwórz: `src/utils/allegro.ts` — priceToUnits(), formatUnitsBreakdown()
  - Stwórz: `src/utils/allegro.test.ts`

  **Podejście:**
  - Przenieś dane z `index-prototyp.html` (linie 422-548) do TypeScript z silnymi typami
  - Discriminated unions na MountingCategory: `'non_invasive' | 'invasive'`
  - Dziedziczenie kolorów Termo: `standard_termo` referencja do `standard.colors`
  - Cennik: stałe tablice lookup, zero dynamiki
  - widthToCm: `Math.ceil(Math.ceil(widthMm / 10) / 5) * 5`
  - roundToQuarter: `Math.round(price * 4) / 4`
  - DISCOUNT_FACTOR = 0.95 jako named constant
  - MAX_WIDTH_GLUED = 1200 jako named constant

  **Notatka wykonawcza:** Test-first dla pricing engine — 8 weryfikacyjnych test cases z PROMPT-KONFIGURATOR.md przed implementacją.

  **Wzorce do naśladowania:**
  - Dane cenowe z `index-prototyp.html` (linie 535-548)
  - Formuła szerokości z `index-prototyp.html` (linia 596)
  - Przykłady kalkulacji z PROMPT-KONFIGURATOR.md (linie 381-394)

  **Scenariusze testowe:**
  - [Unit] Standard + Inwazyjny + 60cm + 150cm + Biały = 137.75 zł
  - [Unit] Standard + Bezinwazyjny + 60cm + 150cm + Biały = 156.75 zł
  - [Unit] Standard + Inwazyjny + 100cm + 150cm + Biały = 175.75 zł
  - [Unit] Standard + Inwazyjny + 100cm + 230cm + Biały = 190.00 zł
  - [Unit] Standard+Termo + Inwazyjny + 80cm + 150cm + Srebrny = 166.25 zł
  - [Unit] Blackout + Inwazyjny + 120cm + 230cm + Biały = 228.00 zł
  - [Unit] Blackout + Inwazyjny + 130cm + 230cm + Biały = 280.25 zł
  - [Unit] Honeycomb + Bezinwazyjny + 90cm + 280cm + Orzech = 256.50 zł
  - [Unit] Skok ceny: 120cm → 114.00 zł dopłata, 125cm → 161.50 zł dopłata
  - [Unit] Zaokrąglanie: roundToQuarter(33.33) = 33.25
  - [Unit] Width conversion: 623mm → 65cm, 800mm → 80cm
  - [Unit] Height binning: 1500mm → ≤150cm, 1510mm → ≤230cm
  - [Unit] priceToUnits(175.75) = 176
  - [Unit] formatUnitsBreakdown(176) = "17× pakiet 10 jednostek + 6 jednostek"

  **Weryfikacja:**
  - Wszystkie 8 weryfikacyjnych examples z PROMPT-KONFIGURATOR.md przechodzą
  - `npm run test` — zero failures
  - `npm run typecheck` — zero errors, zero `any`

---

- [ ] **Unit 4: Wizard state + layout shell**

  **Cel:** useReducer + Context zarządzający 5-krokowym wizard, layout z header i progress bar

  **Wymagania:** R1, R7, R29, R45, R46

  **Zależności:** Unit 1 (HeroUI), Unit 3 (types z src/data/types.ts)

  **Pliki:**
  - Stwórz: `src/context/wizard-context.tsx` — WizardProvider, useWizard hook, reducer, typy akcji
  - Stwórz: `src/context/wizard-types.ts` — WizardState, WizardAction (discriminated union)
  - Stwórz: `src/components/layout/header.tsx` — sticky header z logo, ceną, progress bar
  - Stwórz: `src/components/layout/step-indicator.tsx` — custom 5-krokowy stepper (HeroUI Progress + Buttons)
  - Stwórz: `src/components/layout/price-panel.tsx` — sticky panel cenowy (mobile bottom, desktop corner)
  - Stwórz: `src/components/configurator.tsx` — główny komponent renderujący aktualny krok
  - Test: `src/context/wizard-context.test.tsx`

  **Podejście:**
  - WizardState: `{ step, fabric, color, mounting, width, height, rail }`
  - WizardAction: discriminated union (`SELECT_FABRIC | SELECT_COLOR | SELECT_MOUNTING | SET_DIMENSIONS | SELECT_RAIL | GO_TO_STEP`)
  - Cena jako `useMemo` wywołujące `calculatePrice()` z Unit 3
  - Step indicator: 5 kroków z ikonami (ptaszek na ukończonych, highlight na aktywnym)
  - Price panel: rozbicie cenowe (baza + dopłaty), cena łączna, przycisk "Zamów przez Allegro" (disabled gdy konfiguracja niekompletna)
  - Layout: sticky header top, content center, price panel fixed bottom (mobile) / fixed right (desktop)

  **Wzorce do naśladowania:**
  - Step navigation z `index-prototyp.html` (x-show/step logic)
  - HeroUI Progress component

  **Scenariusze testowe:**
  - [Unit] Reducer: SELECT_FABRIC ustawia fabric i resetuje color (zależy od tkaniny)
  - [Unit] Reducer: GO_TO_STEP(2) nie działa gdy step 1 nieukończony
  - [Unit] Reducer: SET_DIMENSIONS waliduje zakresy (150-1950mm szer, 150-2800mm wys)
  - [Unit] Cena przelicza się po każdej akcji
  - [E2E] Header wyświetla cenę 0 zł na starcie, aktualizuje po wyborze tkaniny

  **Weryfikacja:**
  - Reducer poprawnie zarządza stanem wizarda
  - Layout renderuje się poprawnie na mobile i desktop
  - Cena aktualizuje się w czasie rzeczywistym

---

### Faza 3: UI — kroki wizarda

- [ ] **Unit 5: Kroki 1-3 (Tkanina, Kolor, Montaż)**

  **Cel:** Trzy pierwsze kroki konfiguracji z kartami produktowymi i obrazami

  **Wymagania:** R1, R2, R3, R5, R22, R23, R28, R31, R32, R33, R41

  **Zależności:** Unit 3 (dane), Unit 4 (wizard state)

  **Pliki:**
  - Stwórz: `src/components/steps/fabric-step.tsx` — siatka kart tkanin (2 kol mobile, 4 desktop)
  - Stwórz: `src/components/steps/color-step.tsx` — siatka próbek kolorów (4 kol mobile, 6-8 desktop)
  - Stwórz: `src/components/steps/mounting-step.tsx` — karty montażu (2 kategorie + podsystemy)
  - Stwórz: `src/components/ui/fabric-card.tsx` — karta tkaniny (miniatura, nazwa, opis, wskaźniki)
  - Stwórz: `src/components/ui/color-swatch.tsx` — próbka koloru (zdjęcie close-up lub hex kwadrat)
  - Stwórz: `src/components/ui/mounting-card.tsx` — karta montażu (ikona, opis, etykieta, grafiki)
  - Stwórz: `src/components/ui/rating-dots.tsx` — wskaźnik kropkowy (zaciemnienie/termoizolacja 1-5)

  **Podejście:**
  - Fabric step: HeroUI Card z miniaturą PNG, nazwą, opisem, rating dots. Po kliknięciu → dispatch SELECT_FABRIC → smooth scroll do kroku 2
  - Color step: dynamiczna paleta na podstawie wybranej tkaniny. Termo dziedziczą z bazowej. Kolory bez zdjęcia → kwadrat z hex. Po kliknięciu → SELECT_COLOR → scroll do kroku 3
  - Mounting step: 2 duże karty (bezinwazyjny/inwazyjny), po wyborze kategorii rozwijają się podsystemy. Grafika opisowa + pomiarowa z public/assets/. Ostrzeżenie max 1200mm przy klejoym.
  - Smooth scroll: `element.scrollIntoView({ behavior: 'smooth' })`
  - Lazy loading: `loading="lazy"` na img tags
  - Responsive grid: Tailwind `grid grid-cols-2 md:grid-cols-4`

  **Wzorce do naśladowania:**
  - Karty tkanin z `index-prototyp.html`
  - HeroUI Card component

  **Scenariusze testowe:**
  - [Unit] Fabric step renderuje 8 kart tkanin
  - [Unit] Color step zmienia paletę po zmianie tkaniny
  - [Unit] Standard+Termo pokazuje 24 kolory (dziedziczone ze Standard)
  - [Unit] Montaż klejony wyświetla ostrzeżenie o max 1200mm
  - [E2E] Kliknij "Standard" → scroll do kolorów → kliknij "Biel" → scroll do montażu → wybierz "Bezinwazyjny Wzmocniony"
  - [E2E] Mobile: siatka 2 kolumny, Desktop: 4 kolumny

  **Weryfikacja:**
  - 3 kroki działają end-to-end z nawigacją
  - Obrazy ładują się z public/assets/
  - Responsywność mobile/desktop

---

- [ ] **Unit 6: Kroki 4-5 (Wymiary, Listwa) + pełny price panel**

  **Cel:** Input wymiarów (suwaki + pola numeryczne), wybór listwy, kompletny panel cenowy

  **Wymagania:** R4, R5, R6, R13, R14, R18, R28, R30

  **Zależności:** Unit 3 (pricing), Unit 4 (wizard state), Unit 5 (flow)

  **Pliki:**
  - Stwórz: `src/components/steps/dimensions-step.tsx` — suwaki + inputy + podgląd wymiarów
  - Stwórz: `src/components/steps/rail-step.tsx` — siatka kart kolorów listew
  - Stwórz: `src/components/ui/dimension-input.tsx` — suwak + input + quick buttons
  - Stwórz: `src/components/ui/dimension-preview.tsx` — prostokąt skalowany z liniami plisowania
  - Modyfikuj: `src/components/layout/price-panel.tsx` — pełne rozbicie cenowe + przycisk Allegro

  **Podejście:**
  - HeroUI Slider dla wymiarów (min/max/step) + input number synchronizowany
  - Quick buttons: predefiniowane wartości (500, 600, 700... dla szerokości)
  - Walidacja: klejony → max 1200mm (disable slider beyond, warning)
  - Podgląd wymiarów: div skalowany proporcjonalnie, linie CSS symulujące fałdy
  - Rail step: karty z hex kwadratem, nazwą, typem wykończenia, dopłatą (jeśli >0)
  - Price panel kompletny: rozbicie (baza + szer + wys + listwa), suma, jednostki Allegro, pakiety
  - Animacja ceny: CSS `transition` + krótki `animate-pulse` przy zmianie wartości

  **Wzorce do naśladowania:**
  - HeroUI Slider component
  - Range + input sync z `index-prototyp.html`

  **Scenariusze testowe:**
  - [Unit] Suwak szerokości: zakres 150-1950, krok 10
  - [Unit] Klejony montaż: suwak max 1200, warning powyżej
  - [Unit] Quick button 800mm ustawia suwak i input
  - [Unit] Cena aktualizuje się na żywo przy ruchu suwaka
  - [Unit] Price panel: rozbicie dla Standard + Bezinw + 600×1500 + Biały = 156.75 zł → 157 jedn.
  - [E2E] Ustaw wymiary suwakiem → cena się aktualizuje → wybierz listwę → przycisk "Zamów" aktywny

  **Weryfikacja:**
  - Wymiary i listwy działają z real-time pricing
  - Walidacja klejony/1200mm działa
  - Price panel pokazuje poprawne rozbicie i jednostki Allegro

---

### Faza 4: Integracja

- [ ] **Unit 7: Zamówienie — submit, podsumowanie, lookup**

  **Cel:** Zapis zamówienia do Supabase, ekran podsumowania z instrukcją Allegro, lookup po ?order=

  **Wymagania:** R14-R18, R36-R39, R19, R21

  **Zależności:** Unit 2 (Supabase schema), Unit 4 (wizard state), Unit 6 (kompletna konfiguracja)

  **Pliki:**
  - Stwórz: `src/components/order/order-summary.tsx` — podsumowanie z instrukcją krok-po-kroku
  - Stwórz: `src/components/order/order-lookup.tsx` — formularz wyszukiwania + wyświetlanie zamówienia
  - Stwórz: `src/services/orders.ts` — submitOrder(), lookupOrder()
  - Stwórz: `src/utils/order-number.ts` — formatOrderNumber(), parseOrderParam()
  - Modyfikuj: `src/App.tsx` — routing ?order= → lookup, brak → wizard
  - Stwórz: `src/config/allegro.ts` — ALLEGRO_LISTING_URL, UNIT_PRICE

  **Podejście:**
  - submitOrder: `supabase.from('orders').insert({config, price, allegro_units, utm_source}).select('order_number').single()`
  - DB trigger generuje order_number (RE-00001...)
  - Ekran podsumowania: numer zamówienia, tabela konfiguracji, kwota, jednostki Allegro, instrukcja, przycisk "Przejdź do aukcji Allegro" (target=\_blank)
  - Link do lookup: `konfigurator.rolety.expert?order=RE-00142` — wyświetlany do skopiowania
  - Formatowanie pakietów: `Math.floor(units/10)` pakietów × 10 + reszta
  - App.tsx: `const orderParam = new URLSearchParams(window.location.search).get('order')` → conditional render
  - UTM source: `new URLSearchParams(window.location.search).get('ref')`

  **Wzorce do naśladowania:**
  - Flow Allegro z PROMPT-KONFIGURATOR.md (linie 398-450)

  **Scenariusze testowe:**
  - [Unit] submitOrder zapisuje zamówienie i zwraca order_number
  - [Unit] lookupOrder('RE-00001') zwraca konfigurację i cenę
  - [Unit] lookupOrder('INVALID') zwraca null
  - [Unit] formatUnitsBreakdown(176) = "17× pakiet 10 jednostek + 6 jednostek"
  - [Unit] parseOrderParam('?order=RE-00142') = 'RE-00142'
  - [E2E] Kompletna konfiguracja → kliknij "Zamów" → widoczny numer #RE-XXXXX + instrukcja + link Allegro
  - [E2E] Otwórz ?order=RE-00001 → widoczne podsumowanie zamówienia
  - [E2E] Otwórz ?order=BRAK → komunikat "Zamówienie nie znalezione"

  **Weryfikacja:**
  - Zamówienie zapisuje się w Supabase z poprawnym order_number
  - Podsumowanie wyświetla kompletną konfigurację + instrukcję Allegro
  - Lookup działa po numerze zamówienia

---

- [ ] **Unit 8: Analytics + assety + polish**

  **Cel:** PostHog tracking, przeniesienie obrazów, finalny polish UI

  **Wymagania:** R22-R24, R25-R27, R37, R41

  **Zależności:** Unit 7 (kompletny flow)

  **Pliki:**
  - Stwórz: `src/lib/analytics.ts` — wrapper: init(), trackStep(), trackOrder(), trackLookup()
  - Modyfikuj: `src/components/steps/*.tsx` — dodanie analytics.trackStep() w każdym kroku
  - Modyfikuj: `src/services/orders.ts` — analytics.trackOrder() po submit
  - Modyfikuj: `src/components/order/order-lookup.tsx` — analytics.trackLookup()
  - Stwórz: skrypt `scripts/copy-assets.sh` — kopiowanie obrazów z stelge-materialy/ do public/assets/
  - Modyfikuj: wszystkie komponenty — finalne style, hover efekty, responsive tweaks

  **Podejście:**
  - Analytics wrapper: abstrakcja nad PostHog, zamiana providera = 1 plik
  - 7 eventów: `step_1_viewed` ... `step_5_viewed`, `order_submitted` (z ceną, jednostkami), `order_lookup` (z order_number)
  - UTM params przekazywane do PostHog jako user properties
  - Copy assets: `cp -r stelge-materialy/01-Standard public/assets/standard/` etc. (bez folderów 08-12)
  - Polish: hover na kartach (Tailwind hover:shadow-lg hover:-translate-y-1 transition-all), pulse ceny (CSS @keyframes), responsive fixes

  **Wzorce do naśladowania:**
  - PostHog JS SDK docs

  **Scenariusze testowe:**
  - [Unit] analytics.trackStep(1) wywołuje posthog.capture('step_1_viewed')
  - [Unit] analytics.trackOrder({price, units}) wysyła properties
  - [Unit] Wrapper nie rzuca błędu gdy PostHog nie załadowany (graceful degradation)
  - [E2E] Przejdź przez cały wizard → sprawdź PostHog debug panel → 5 step events + order event
  - [E2E] Mobile: siatki 2-kol, sticky price bottom. Desktop: 4-kol, price panel right.

  **Weryfikacja:**
  - PostHog rejestruje eventy (debug mode w konsoli)
  - Obrazy ładują się z public/assets/
  - UI wygląda dobrze na mobile i desktop

## Wpływ systemowy

- **Nowy projekt:** Zero istniejącego kodu do zmiany. Greenfield.
- **Supabase:** Jedna tabela orders, publiczny dostęp (anon key), zero auth
- **Vercel:** SPA deploy, zero serverless functions, static assets CDN
- **PostHog:** Zewnętrzny SDK, zero wpływu na backend
- **Branding:** rolety.expert, zero elementów Stelge

## Ryzyka i zależności

- **HeroUI v3 Slider:** Może wymagać custom styling żeby wyglądał jak range input z prototypu. Fallback: natywny input[type=range] z Tailwind.
- **View Transitions API:** Browser support ~85% (2026). Fallback: proste CSS opacity transition.
- **Supabase free tier:** 500MB / 50K rows — wystarczające na lata przy jednym produkcie.
- **Obrazy w repo:** 253 plików × ~100KB = ~25MB. Akceptowalne, ale przy rozroście (moskitiery) rozważyć migrację do external storage.

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-04-09-konfigurator-rolet-requirements.md](docs/dev-brainstorms/2026-04-09-konfigurator-rolet-requirements.md)
- **Specyfikacja produktowa:** PROMPT-KONFIGURATOR.md
- **Prototyp:** index-prototyp.html (dane cenowe, formuły, UI patterns)
- **HeroUI v3 Vite template:** github.com/heroui-inc/vite-template
- **Supabase triggers:** supabase.com/docs/guides/database/postgres/triggers
