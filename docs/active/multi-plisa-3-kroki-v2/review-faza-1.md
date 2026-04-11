# Code Review — Faza 1: Fundament danych

**Data:** 2026-04-10
**Branch:** `feature/multi-plisa-3-kroki-v2`
**Commit:** 5e431da
**Reviewer:** multi-agent (security, performance, architecture, test coverage, E2E)

---

## Severity Gate: KONTYNUUJ Z ZASTRZEZENIAMI

P1=0, P2=2, P3=3

---

## Findings

### P2 — Important

#### P2-1: `getMountingImagePath` — typ `zblizenie` generuje nieistniejace sciezki

**Plik:** `src/data/images.ts:67-72`
**Typ:** KOD
**Agent:** Architecture

`MountingImageType` zawiera `'zblizenie'`, a `getMountingImagePath()` zawsze zwraca `.png` z dokładną nazwą typu. Ale rzeczywiste pliki montażowe to:

- `zblizenie-dol.webp` / `zblizenie-gora.webp` (bezinwazyjny-klejony, inwazyjny-\*)
- `zblizenie-1.png` / `zblizenie-2.png` (bezinwazyjny-wzmocniony)

Funkcja zwróci np. `assets/montaz/bezinwazyjny-klejony/zblizenie.png` — plik nie istnieje.

**Status:** Nie blokuje Fazy 1 (typ `zblizenie` nie jest nigdzie wywoływany), ale blokuje Unit 5 (Faza 4) gdzie karuzela montażu będzie potrzebować zbliżeń. Rozwiązanie: zmienić typ na `'zblizenie-1' | 'zblizenie-2' | 'zblizenie-dol' | 'zblizenie-gora'` lub osobną funkcję `getMountingCloseupPaths()` zwracającą tablicę.

#### P2-2: Non-null assertion `state.fabricId!` w `color-step.tsx`

**Plik:** `src/components/steps/color-step.tsx:45`
**Typ:** KOD
**Agent:** Architecture

Użycie `!` (non-null assertion) jest zabronione przez coding rules (sekcja 10: "NIGDY nie używaj non-null assertions (`!`) — obsłuż nullability explicite"). Guard `if (!state.fabricId)` jest wyżej w komponencie, więc runtime jest bezpieczny, ale `!` łamie konwencję. To samo w `src/services/orders.ts:35`.

**Fix:** Użyj zmiennej po early return: `const fabricId = state.fabricId; if (!fabricId) return ...; // fabricId jest teraz string`

---

### P3 — Nit

#### P3-1: `fabric.img` w `fabric-card.tsx` — hardcoded path, nie używa `getPackshotPath()`

**Plik:** `src/components/ui/fabric-card.tsx:42`
**Typ:** KOD
**Agent:** Architecture

`FabricCard` używa `fabric.img` (pole z `fabrics.ts`), a nie dynamicznej funkcji `getPackshotPath()`. To jest OK na ten moment (miniatura tkaniny na kroku 1 nie zależy od montażu), ale warto pamiętać o spójności — nowe funkcje z `images.ts` powinny być single source of truth dla ścieżek.

#### P3-2: 114 MB assetów w repo

**Plik:** `public/assets/`
**Typ:** PERFORMANCE
**Agent:** Performance

Folder `public/assets/` waży 114 MB. To dużo jak na repo git. Plan wspomina o optymalizacji obrazów jako "odroczone do implementacji" — warto zaplanować batch resize/compress przed deployem.

#### P3-3: Brak testu dla `getBaseCollection` z `dolomit-termo`

**Plik:** `src/data/images.test.ts`
**Typ:** TEST
**Agent:** Test Coverage

Testy `getBaseCollection` sprawdzają `standard-termo` i `melange-termo`, ale brakuje `dolomit-termo`. Nie jest to krytyczne (logika `.replace(/-termo$/, '')` jest generyczna), ale warto dla kompletności.

---

## Odchylenia od planu

Plan (Unit 1) definiował 5 scenariuszy testowych. Wszystkie 5 zaimplementowane + 21 dodatkowych. Plik testowy istnieje i przechodzi (26/26). Brak odchyleń strukturalnych.

Drobna zmiana vs plan: blackout używa `zblizenie.png` zamiast `tkanina.jpg` (PROMPT spec mówi `tkanina.jpg`, ale realne assety to `zblizenie.png`). Kod podąża za realnymi plikami — poprawna decyzja.

---

## Wyniki E2E

| Weryfikacja                                                      | Wynik  |
| ---------------------------------------------------------------- | ------ |
| `public/assets/produkty/standard/biel/packshot.png` istnieje     | PASSED |
| `public/assets/montaz/bezinwazyjny-wzmocniony/opis.png` istnieje | PASSED |
| `public/assets/prowadnice/biel.jpg` istnieje                     | PASSED |
| Stare numerowane foldery usunięte                                | PASSED |
| `npm run typecheck` przechodzi                                   | PASSED |
| Testy images.ts przechodzą (26/26)                               | PASSED |
| Wszystkie testy projektu przechodzą (130/130)                    | PASSED |

**E2E: 7 passed / 0 failed**

---

## Podsumowanie

Faza 1 wykonana poprawnie. Assety skopiowane z prawidłową strukturą, image mappery działają, testy przechodzą, typecheck czysty. Dwa problemy P2: nieistniejące ścieżki dla `zblizenie` (nie blokuje teraz, ale trzeba naprawić przed Fazą 4) i non-null assertion łamiący coding rules. Trzy drobne sugestie P3.
