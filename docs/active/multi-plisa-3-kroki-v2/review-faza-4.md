# Code Review — Faza 4: UI wizarda i layout

**Data:** 2026-04-10
**Branch:** `feature/multi-plisa-3-kroki-v2`
**Commit:** b78bab3
**Reviewer:** Claude Opus 4.6 (multi-agent analysis)

---

## Statystyki

- Plików sprawdzonych: 14 (10 komponentów + 4 testy)
- Typecheck: PASS
- Lint: PASS
- Testy: 165/165 PASS

---

## Severity Gate

**KONTYNUUJ Z ZASTRZEŻENIAMI** — 0 problemow P1, 3 problemy P2, 5 problemow P3.

---

## Findings

### P2 — Important

#### P2-1: Lightbox w RailStep uzywa DOM manipulation zamiast React state

**Plik:** `src/components/steps/rail-step.tsx:27-43`
**Typ:** Architecture / Code Quality

`handleImageClick` uzywa bezposrednio `dialog.querySelector('img')` zeby zaktualizowac `src`/`alt` — obchodzac React rendering. `enlargedImgRef` przechowuje dane ale dialog renderuje poczatkowe puste wartosci (`src=""`, `alt=""`). To jest zrodlo ostrzezen w testach:

> An empty string ("") was passed to the src attribute.

**Fix:** Zamienic `enlargedImgRef` na `useState<{src: string, alt: string} | null>` i renderowac `<img>` warunkowo z aktualnym state. Usunac bezposrednia manipulacje DOM.

---

#### P2-2: PricePanel (240 linii) laczy logike submit z prezentacja ceny

**Plik:** `src/components/layout/price-panel.tsx`
**Typ:** Architecture / Single Responsibility

PricePanel obsluguje: rozbicie ceny, pulsowanie animacji, submit zamowienia, error handling, order summary overlay, i URL manipulation — 240 linii, na granicy limitu 300. Logika submit (linie 48-120) powinna byc wyciagnieta do osobnego hooka lub przeniesiona do Unit 6 (OrderList), ktory i tak zrefaktoruje ten komponent.

**Uwaga:** Zaplanowany refaktor w Unit 6 powinien to zaadresowac. Jesli nie — nalezy wyciagnac `useOrderSubmit()` hooka.

---

#### P2-3: PricePanel wciaz pokazuje rozbicie doplat za szerokosc/wysokosc

**Plik:** `src/components/layout/price-panel.tsx:181-199`
**Typ:** Odchylenie od planu

Plan V2 mowi: "Cena rolety: X zl" + opcjonalnie "Doplata listwa: Y zl" = "Razem: Z zl". Panel wciaz pokazuje "Baza (tkanina + montaz)", "Doplata za szerokosc", "Doplata za wysokosc" w expanded view. To powtorzony finding z review fazy 2 (P3-nit).

**Uwaga:** Zaplanowany do refaktoru w Unit 6. Podniesiony do P2 poniewaz jest to wyraznie sprzeczne z wymaganiem R19-R20.

---

### P3 — Nit

#### P3-1: Brak testu ConfigStep i StepContent dla 3-krokowego layout

**Plik:** brak `src/components/steps/config-step.test.tsx`, brak `src/components/step-content.test.tsx`
**Typ:** Test Coverage

Plan definuje testy:

- "Test: StepContent renderuje 3 kroki (nie 5)" — pokryte posrednio w mounting-step.test.tsx
- "Test: Progress bar pokazuje 33%/66%/100%" — brak

ConfigStep nie ma dedykowanego testu sprawdzajacego ze renderuje wszystkie 3 sekcje (mounting + dimensions + rail) i podglad.

---

#### P3-2: Test warnings — puste `src=""` na img w testach

**Plik:** `src/components/steps/mounting-step.test.tsx`, `dimensions-step.test.tsx`, `rail-step.test.tsx`
**Typ:** Test Quality

Ostrzezenie w stderr: "An empty string ("") was passed to the src attribute." Pochodzi z lightbox dialog w rail-step.tsx (powiazane z P2-1). Nie powoduje faili, ale smieci w output.

---

#### P3-3: DimensionInput — label nie jest powiazany z inputem przez `htmlFor`/`id`

**Plik:** `src/components/ui/dimension-input.tsx:66-68`
**Typ:** Accessibility

Element `<label>` nie ma atrybutu `htmlFor`, a `<input>` nie ma `id`. Powiazanie jest tylko przez `aria-label`. Poprawne, ale `<label htmlFor>` to lepsza praktyka dla natywnych interakcji (klikniecie w label focusuje input).

---

#### P3-4: Embla Carousel — brak obslugi klawiatury (nawigacja strzalkami)

**Plik:** `src/components/ui/mounting-carousel.tsx`
**Typ:** Accessibility

Karuzela nie obsluguje nawigacji klawiaturowej (Arrow Left/Right). Embla nie dodaje tego automatycznie. Przy 2-3 systemach to mniejszy problem (buttony wewnatrz sa focusable), ale warto dodac.

---

#### P3-5: MountingCarousel — hardcoded budowanie `fullId`

**Plik:** `src/components/ui/mounting-carousel.tsx:47`
**Typ:** Code Quality

```typescript
const fullId = `${system.type === "bezinwazyjny" ? "bezinwazyjny" : "inwazyjny"}-${system.id}`;
```

To samo co `${system.type}-${system.id}`. Ternary jest zbedny — `system.type` juz zawiera "bezinwazyjny" lub "inwazyjny".

---

## Odchylenia od planu

| Element planu                       | Status    | Komentarz                                                               |
| ----------------------------------- | --------- | ----------------------------------------------------------------------- |
| ConfigStep layout desktop/mobile    | OK        | Flex col -> row na lg breakpoint                                        |
| ProductPreview dynamiczny packshot  | OK        | Zmienia src przy zmianie mountingType                                   |
| MountingCarousel Embla              | OK        | Embla zainstalowane, karuzela dziala                                    |
| Dwupoziomowy montaz                 | OK        | Kategoria -> podsystemy                                                 |
| Swobodne wymiary (bez kroku 10mm)   | OK        | step=1, clamping on blur                                                |
| Realne zdjecia prowadnic + lightbox | OK        | Dialog z DOM manipulation (P2-1)                                        |
| Usuniecie DimensionPreview          | OK        | Plik usuniety, zero referencji                                          |
| StepContent 3 kroki                 | OK        | FabricStep, ColorStep, ConfigStep                                       |
| Configurator cart.view switching    | OK        | Placeholder OrderList                                                   |
| PricePanel refaktor (uproszczony)   | ODROCZONE | Zaplanowane w Unit 6                                                    |
| Testy unit (plan)                   | CZESCIOWE | 4/6 plikow testowych istnieje, brak config-step.test, step-content.test |

---

## Pozytywne obserwacje

1. **Czysta architektura composite** — ConfigStep elegancko sklada MountingStep + DimensionsStep + RailStep + ProductPreview w jedno view.
2. **Rozmiary plikow** — wszystkie pod 200 linii (poza price-panel 240 — do refaktoru).
3. **Zero `any`, zero `console.log`**, zero type assertions.
4. **Typecheck, lint, 165 testow** — pelny PASS.
5. **Embla Carousel** — poprawnie zainstalowane, headless, lekkie.
6. **Dostepnosc** — `aria-pressed`, `aria-label`, `role="alert"` poprawnie uzyte.
7. **DimensionInput** — eleganckie rozdzielenie local state (free typing) vs parent state (clamped value).
