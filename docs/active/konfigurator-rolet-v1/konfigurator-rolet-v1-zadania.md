# Zadania: Konfigurator Rolet Plisowanych V1

**Branch:** `feature/konfigurator-rolet-v1`
**Ostatnia aktualizacja:** 2026-04-09
**Status:** W trakcie

---

## Faza 1: Fundament

### Unit 1: Scaffolding projektu [M]

**Cel:** Działający dev server z HeroUI v3, Tailwind v4 i Supabase client

- [x] Stwórz `package.json` z React 19, HeroUI v3, TW4, Supabase, PostHog, Vitest
- [x] Stwórz `tsconfig.json` (strict mode)
- [x] Stwórz `vite.config.ts` z HeroUI plugin
- [x] Stwórz `index.html` + `src/main.tsx` + `src/App.tsx`
- [x] Stwórz `src/lib/supabase.ts` (klient z env vars)
- [x] Stwórz `.env.example` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_POSTHOG_KEY)
- [x] Skonfiguruj Tailwind v4 z custom brand colors (z prototypu)
- [x] Test: Dev server startuje bez błędów
- [x] Test: HeroUI Button renderuje się poprawnie
- [x] Test: `npm run typecheck` przechodzi
- [ ] Weryfikacja: Strona renderuje HeroUI komponent na localhost

### Unit 2: Supabase schema + migracje [M]

**Cel:** Tabela orders z triggerem generującym #RE-XXXXX, RLS, wersjonowany schemat

**Zależności:** Unit 1

- [x] `supabase init` — stwórz `supabase/config.toml`
- [x] `supabase migration new create_orders` — stwórz migrację
- [x] Tabela `orders`: id (BIGINT IDENTITY), order_number (TEXT UNIQUE), config (JSONB), price (DECIMAL), allegro_units (INT), utm_source (TEXT), created_at (TIMESTAMPTZ)
- [x] Sequence `orders_seq` + trigger `set_order_number` → format `RE-XXXXX`
- [x] RLS: public SELECT (po order_number), public INSERT
- [x] Index B-tree na order_number
- [ ] `supabase db push` do remote (pominięto — brak linked project, migracja gotowa do push)
- [x] Test: INSERT generuje order_number w formacie RE-XXXXX
- [x] Test: SELECT po order_number zwraca zamówienie
- [x] Test: Kolejne INSERT-y → sekwencyjne numery (RE-00001, RE-00002...)
- [ ] Weryfikacja: Ręczny INSERT w Dashboard generuje RE-00001, SELECT z anon key działa

### Do poprawy po review fazy 1

- [x] 🟠 [P2-SEC-1] **supabase/migrations/20260409050254_create_orders.sql:40-44** — RLS SELECT policy `USING (true)` pozwala na odczyt WSZYSTKICH zamówień. Wymaganie R43 mówi "public SELECT (po order_number)". Zmienić na bardziej restrykcyjną policy lub dodać RPC function.
- [x] 🟠 [P2-ARCH-1] **package.json** — Brak skryptów `lint` i `format` mimo deklaracji w CLAUDE.md. Dodać ESLint + Prettier lub usunąć referencje.
- [x] 🟠 [P2-ARCH-2] **src/lib/supabase.ts:15-31** — Proxy pattern używa `as` type assertion, co narusza coding-rules.md. Rozważyć factory function `getSupabase()`.
- [ ] 🟡 [P3-SEC-2] **supabase/migrations/20260409050254_create_orders.sql:47-51** — INSERT policy bez walidacji payloadu. Dodać CHECK constraint na price (>0) i allegro_units (>0).
- [ ] 🟡 [P3-PERF-1] Brak `public/favicon.ico` — 404 w konsoli przy każdym wejściu.
- [ ] 🟡 [P3-PERF-2] **index.html:7-12** — Google Fonts ładowane synchronicznie (minor, `display=swap` już jest).
- [ ] 🟡 [P3-TEST-1] Brak unit testu dla `src/lib/supabase.ts` — Proxy lazy init i error na brak env vars.

---

## Faza 2: Domena

### Unit 3: Dane produktowe + silnik cenowy [L]

**Cel:** Kompletne dane w src/data/ i przetestowany pricing engine

**Zależności:** Unit 1

- [x] Stwórz `src/data/types.ts` — Fabric, Color, MountingSystem, RailColor, PriceTier
- [x] Stwórz `src/data/fabrics.ts` — 8 tkanin + palety kolorów + dziedziczenie Termo
- [x] Stwórz `src/data/pricing.ts` — tabele dopłat szerokość (39 progów) + wysokość (3 progi) + bazy
- [x] Stwórz `src/data/mounting.ts` — 5 systemów montażu + ograniczenia
- [x] Stwórz `src/data/rails.ts` — 14 kolorów listew + dopłaty
- [x] Stwórz `src/data/images.ts` — mapowanie tkanina → kolor → ścieżka obrazu
- [x] Stwórz `src/data/index.ts` — reeksport
- [x] Stwórz `src/utils/pricing.ts` — calculatePrice(), widthToCm(), heightToTier(), roundToQuarter()
- [x] Stwórz `src/utils/pricing.test.ts` — testy weryfikacyjne (test-first!)
- [x] Stwórz `src/utils/allegro.ts` — priceToUnits(), formatUnitsBreakdown()
- [x] Stwórz `src/utils/allegro.test.ts`
- [x] Test: Standard + Inwazyjny + 60cm + 150cm + Biały = 137.75 zł
- [x] Test: Standard + Bezinwazyjny + 60cm + 150cm + Biały = 156.75 zł
- [x] Test: Standard + Inwazyjny + 100cm + 150cm + Biały = 175.75 zł
- [x] Test: Standard + Inwazyjny + 100cm + 230cm + Biały = 190.00 zł
- [x] Test: Standard+Termo + Inwazyjny + 80cm + 150cm + Srebrny = 166.25 zł
- [x] Test: Blackout + Inwazyjny + 120cm + 230cm + Biały = 228.00 zł
- [x] Test: Blackout + Inwazyjny + 130cm + 230cm + Biały = 280.25 zł
- [x] Test: Honeycomb + Bezinwazyjny + 90cm + 280cm + Orzech = 256.50 zł
- [x] Test: Skok ceny 120cm → 114.00 zł, 125cm → 161.50 zł
- [x] Test: roundToQuarter(33.33) = 33.25
- [x] Test: widthToCm(623) = 65, widthToCm(800) = 80
- [x] Test: heightToTier(1500) = ≤150cm, heightToTier(1510) = ≤230cm
- [x] Test: priceToUnits(175.75) = 176
- [x] Test: formatUnitsBreakdown(176) = "17× pakiet 10 jednostek + 6 jednostek"
- [ ] Weryfikacja: 8/8 weryfikacyjnych examples przechodzi, `npm run test` zero failures, zero `any`

### Unit 4: Wizard state + layout shell [M]

**Cel:** useReducer + Context + layout z header, stepper, price panel

**Zależności:** Unit 1, Unit 3 (types)

- [x] Stwórz `src/context/wizard-types.ts` — WizardState, WizardAction (discriminated union)
- [x] Stwórz `src/context/wizard-context.tsx` — WizardProvider, useWizard hook, reducer
- [x] Stwórz `src/components/layout/header.tsx` — sticky header z logo + ceną + progress
- [x] Stwórz `src/components/layout/step-indicator.tsx` — custom 5-krokowy stepper
- [x] Stwórz `src/components/layout/price-panel.tsx` — sticky panel cenowy (mobile/desktop)
- [x] Stwórz `src/components/configurator.tsx` — główny komponent renderujący aktualny krok
- [x] Stwórz `src/context/wizard-context.test.tsx`
- [x] Test: SELECT_FABRIC ustawia fabric i resetuje color
- [x] Test: GO_TO_STEP(2) nie działa gdy step 1 nieukończony
- [x] Test: SET_DIMENSIONS waliduje zakresy (150-1950mm szer, 150-2800mm wys)
- [x] Test: Cena przelicza się po każdej akcji
- [ ] Weryfikacja: Reducer zarządza stanem, layout mobile/desktop, cena real-time

---

## Faza 3: UI — kroki wizarda

### Unit 5: Kroki 1-3 (Tkanina, Kolor, Montaż) [L]

**Cel:** Trzy pierwsze kroki z kartami produktowymi i obrazami

**Zależności:** Unit 3, Unit 4

- [x] Stwórz `src/components/steps/fabric-step.tsx` — siatka kart tkanin
- [x] Stwórz `src/components/steps/color-step.tsx` — siatka próbek kolorów
- [x] Stwórz `src/components/steps/mounting-step.tsx` — karty montażu + podsystemy
- [x] Stwórz `src/components/ui/fabric-card.tsx` — karta z miniaturą, nazwą, opisem, dots
- [x] Stwórz `src/components/ui/color-swatch.tsx` — próbka (zdjęcie lub hex kwadrat)
- [x] Stwórz `src/components/ui/mounting-card.tsx` — karta montażu z grafikami
- [x] Stwórz `src/components/ui/rating-dots.tsx` — wskaźnik 1-5 kropek
- [x] Test: Fabric step renderuje 8 kart tkanin
- [x] Test: Color step zmienia paletę po zmianie tkaniny
- [x] Test: Standard+Termo pokazuje 24 kolory (dziedziczone)
- [x] Test: Montaż klejony wyświetla ostrzeżenie max 1200mm
- [ ] Weryfikacja: 3 kroki end-to-end z nawigacją, obrazy z public/assets/, responsive

### Unit 6: Kroki 4-5 (Wymiary, Listwa) + price panel [L]

**Cel:** Suwaki wymiarów, wybór listwy, kompletny panel cenowy

**Zależności:** Unit 3, Unit 4, Unit 5

- [x] Stwórz `src/components/steps/dimensions-step.tsx` — suwaki + inputy + podgląd
- [x] Stwórz `src/components/steps/rail-step.tsx` — siatka kart listew
- [x] Stwórz `src/components/ui/dimension-input.tsx` — suwak + input + quick buttons
- [x] Stwórz `src/components/ui/dimension-preview.tsx` — prostokąt z liniami plisowania
- [x] Modyfikuj `src/components/layout/price-panel.tsx` — pełne rozbicie + przycisk Allegro
- [x] Test: Suwak szerokości zakres 150-1950, krok 10
- [x] Test: Klejony montaż → suwak max 1200, warning
- [x] Test: Quick button 800mm ustawia suwak i input
- [x] Test: Cena aktualizuje się na żywo przy ruchu suwaka
- [x] Test: Price panel rozbicie Standard+Bezinw+600×1500+Biały = 156.75 zł → 157 jedn.
- [ ] Weryfikacja: Wymiary + listwy z real-time pricing, walidacja klejony/1200mm

---

## Faza 4: Integracja

### Unit 7: Zamówienie — submit, podsumowanie, lookup [L]

**Cel:** Zapis do Supabase, summary z instrukcją Allegro, lookup po ?order=

**Zależności:** Unit 2, Unit 4, Unit 6

- [x] Stwórz `src/config/allegro.ts` — ALLEGRO_LISTING_URL, UNIT_PRICE
- [x] Stwórz `src/services/orders.ts` — submitOrder(), lookupOrder()
- [x] Stwórz `src/utils/order-number.ts` — formatOrderNumber(), parseOrderParam()
- [x] Stwórz `src/components/order/order-summary.tsx` — podsumowanie + instrukcja
- [x] Stwórz `src/components/order/order-lookup.tsx` — formularz + wyświetlanie
- [x] Modyfikuj `src/App.tsx` — ?order= → lookup, brak → wizard
- [x] Test: submitOrder zapisuje i zwraca order_number
- [x] Test: lookupOrder('RE-00001') zwraca konfigurację
- [x] Test: lookupOrder('INVALID') zwraca null
- [x] Test: formatUnitsBreakdown(176) = "17× pakiet 10 jednostek + 6 jednostek"
- [x] Test: parseOrderParam('?order=RE-00142') = 'RE-00142'
- [ ] Weryfikacja: Zamówienie w Supabase z #RE-XXXXX, podsumowanie + instrukcja Allegro, lookup działa

### Unit 8: Analytics + assety + polish [M]

**Cel:** PostHog tracking, obrazy w public/assets/, finalny polish

**Zależności:** Unit 7

- [x] Stwórz `src/lib/analytics.ts` — init(), trackStep(), trackOrder(), trackLookup()
- [x] Stwórz `scripts/copy-assets.sh` — kopiowanie obrazów (bez folderów 08-12)
- [x] Uruchom copy-assets.sh → obrazy w public/assets/
- [x] Modyfikuj `src/components/steps/*.tsx` — dodanie analytics.trackStep()
- [x] Modyfikuj `src/services/orders.ts` — analytics.trackOrder()
- [x] Modyfikuj `src/components/order/order-lookup.tsx` — analytics.trackLookup()
- [x] Polish: hover na kartach, pulse ceny, responsive tweaks
- [x] Test: analytics.trackStep(1) → posthog.capture('step_1_viewed')
- [x] Test: Wrapper nie rzuca błędu gdy PostHog nie załadowany
- [ ] Weryfikacja: PostHog eventy w debug, obrazy ładują się, UI mobile/desktop OK

---

## Podsumowanie postępu

| Faza               | Status       | Ukończone                       |
| ------------------ | ------------ | ------------------------------- |
| Faza 1: Fundament  | ✅ Ukończona | 20/22 (2 Weryfikacja do review) |
| Faza 2: Domena     | ✅ Ukończona | 35/37 (2 Weryfikacja do review) |
| Faza 3: UI         | ✅ Ukończona | 21/23 (2 Weryfikacja do review) |
| Faza 4: Integracja | ✅ Ukończona | 20/22 (2 Weryfikacja do review) |
