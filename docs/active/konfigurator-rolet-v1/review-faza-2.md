# Code Review — Faza 2: Domena (Unit 3 + Unit 4)

**Data:** 2026-04-09
**Branch:** `feature/konfigurator-rolet-v1`
**Reviewer:** Multi-agent review (Security, Performance, Architecture, Test Coverage, E2E)

---

## Severity Gate: KONTYNUUJ Z ZASTRZEŻENIAMI

- P1 (blocking): 0
- P2 (important): 2
- P3 (nit): 4

---

## Statystyki

- Plików sprawdzonych: 15 (src/data/_, src/utils/_, src/context/_, src/components/layout/_, configurator.tsx)
- Testy: 104/104 PASS
- Typecheck: PASS (zero errors)
- `any` types: 0
- Plik >300 linii: 0 (max: fabrics.ts 292 linii)
- Funkcja >50 linii: 0

---

## Findings

### P2 (Important)

#### P2-ARCH-1: `roundToQuarter()` nie jest wywoływany w `calculatePrice()`

**Plik:** `src/utils/pricing.ts:68`
**Agent:** Architecture

Requirement R9 wymaga: "Wszystkie ceny = Stelge x 0,95, zaokrąglenie: Math.round(price \* 4) / 4". Funkcja `roundToQuarter()` jest zdefiniowana (linia 30) i przetestowana, ale NIGDY nie jest wywoływana w `calculatePrice()`. Obecnie ceny działają poprawnie, bo wszystkie składniki w tabelach są już wielokrotnościami 0.25 (pre-rounded). Jednak brak zaokrąglania totala narusza specyfikację i może powodować błędy przy przyszłych zmianach cennika.

**Fix:** Dodać `roundToQuarter(total)` przed returnem w `calculatePrice()`.

#### P2-TEST-1: Brak testu na wymuszenie max 1200mm szerokości przy montażu klejoym w reducerze

**Plik:** `src/context/wizard-context.test.tsx`
**Agent:** Test Coverage

Reducer w `SELECT_MOUNTING` (linia 62-80 wizard-context.tsx) automatycznie obcina `widthMm` do `MAX_WIDTH_GLUED` (1200mm) gdy wybrano montaż klejony. Ten ważny biznesowo edge case nie ma dedykowanego testu. Plan techniczny (Unit 4, scenariusze testowe) nie wymienił tego wprost, ale jest to krytyczna reguła biznesowa R5.

**Fix:** Dodać test: `SELECT_MOUNTING klejony with width>1200 clamps to 1200`.

### P3 (Nit)

#### P3-ARCH-2: Dead code — `images.ts` functions nigdzie nie importowane

**Plik:** `src/data/images.ts`
**Agent:** Architecture

Funkcje `getFabricImagePath()` i `getColorImagePath()` są eksportowane ale nigdzie nie importowane w komponentach. Komponenty (`fabric-card.tsx`, `color-swatch.tsx`) korzystają bezpośrednio z pól `fabric.img` i `color.img` z danych. Ponadto `getColorImagePath()` deklaruje return type `string | null` ale zawsze zwraca string.

**Fix:** Usunąć `images.ts` lub zrefaktorować aby komponenty korzystały z tych funkcji zamiast bezpośrednio z pól `img`.

#### P3-DATA-1: Brakujący `img` dla Blackout Czarny w danych kolorów

**Plik:** `src/data/fabrics.ts:226`
**Agent:** Test Coverage

Blackout Czarny (`{ id: "czarny", name: "Czarny", hex: "#1A1A1A" }`) nie ma pola `img`, choć wg PROMPT-KONFIGURATOR.md ma zdjęcie close-up (`BLACKOUT-zblizenie-inwazyjne-CZARNY-300x500.png`). Klient zobaczy kwadrat z kolorem hex zamiast zdjęcia tkaniny.

**Fix:** Dodać `img: "img/colors/blackout-czarny.png"` do wpisu Blackout Czarny.

#### P3-ARCH-3: `formatPrice()` zduplikowana w header.tsx i price-panel.tsx

**Plik:** `src/components/layout/header.tsx:4`, `src/components/layout/price-panel.tsx:13`
**Agent:** Architecture

Identyczna funkcja `formatPrice(value: number): string` zdefiniowana w dwóch plikach. Narusza DRY.

**Fix:** Wyciągnąć do `src/utils/format.ts`.

#### P3-PERF-1: `isConfigComplete` przeliczany przy każdym renderze

**Plik:** `src/context/wizard-context.tsx:150-156`
**Agent:** Performance

`isConfigComplete` jest zwykłym wyrażeniem, nie owinięte w `useMemo`. Kalkulacja jest tania (5 porównań), więc to nie jest performance problem, ale dla spójności z `price` (który jest w useMemo) warto owinąć.

**Fix:** Opcjonalne — owinąć w `useMemo` dla spójności.

---

## Odchylenia od planu

### Pliki zdefiniowane w planie vs implementacja

Plan techniczny (Unit 3) definiował plik testowy `src/utils/pricing.test.ts` i `src/utils/allegro.test.ts` — oba istnieją i zawierają kompletne asercje.

Plan (Unit 4) definiował `src/context/wizard-context.test.tsx` — istnieje z 15 testami.

Brak odchyleń w strukturze plików. Wszystkie pliki z planu zostały stworzone.

### Logika cenowa

8/8 weryfikacyjnych przykładów z PROMPT-KONFIGURATOR.md przechodzi (potwierdzone w testach). Formuła szerokości `widthToCm` i progi wysokości `heightToTier` zgodne ze specyfikacją.

---

## E2E Verification

### Scenariusze zweryfikowane

| Scenariusz                                                       | Status                |
| ---------------------------------------------------------------- | --------------------- |
| Strona renderuje 8 kart tkanin na starcie                        | PASS                  |
| Kliknięcie Standard → step 2 widoczny z 24 kolorami              | PASS                  |
| Step indicator pokazuje ptaszek na kroku 1, highlight na kroku 2 | PASS                  |
| Cena 0,00 zł na starcie                                          | PASS                  |
| Krok 3 NIE widoczny dopóki kolor nie wybrany                     | PASS                  |
| Przyciski kroków 3-5 nie działają bez ukończenia poprzednich     | PASS (via unit tests) |
| Header sticky z ceną i progress bar                              | PASS                  |
| Przycisk "Zamów przez Allegro" disabled na starcie               | PASS                  |

### Console errors

- `favicon.ico` 404 (istniejący P3 z fazy 1)

---

## Podsumowanie

Faza 2 jest solidnie zaimplementowana. Dane produktowe kompletne i zgodne ze specyfikacją. Silnik cenowy przechodzi wszystkie 8 weryfikacyjnych przykładów. Wizard state management poprawnie zarządza krokami z walidacją. Layout responsywny z sticky header i price panel.

Główne zastrzeżenie: `roundToQuarter()` powinno być wywoływane w `calculatePrice()` dla pełnej zgodności z R9, nawet jeśli obecnie nie wpływa na wyniki (P2).
