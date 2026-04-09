# Plan: Konfigurator Rolet Plisowanych — rolety.expert V1

**Branch:** `feature/konfigurator-rolet-v1`
**Ostatnia aktualizacja:** 2026-04-09

## Podsumowanie wykonawcze

SPA kalkulator rolet plisowanych integrujący się z Allegro. Klient konfiguruje roletę w 5 krokach (tkanina → kolor → montaż → wymiary → listwa), dostaje cenę i liczbę jednostek do kupienia na Allegro. Zamówienia z unikalnym numerem #RE-XXXXX zapisywane w Supabase.

**Stack:** React 19 + TypeScript (strict) + Vite + HeroUI v3 + Tailwind CSS v4 + Supabase + PostHog
**Deploy:** Vercel (SPA + static assets CDN)

## Analiza obecnego stanu

- **Prototyp:** `index-prototyp.html` — pełna logika cenowa i dane produktowe w Alpine.js
- **Specyfikacja:** `PROMPT-KONFIGURATOR.md` — 600-liniowy spec z cennikami, kolorami, montażami
- **Assety:** 253 obrazów w `stelge-materialy/` (118 okiennych + 27 montażowych + 16 pomocniczych + 72 dachowe poza scope)
- **Infrastruktura:** Zero — brak package.json, brak Supabase, brak deploymentu
- **Coding rules:** `.claude/rules/coding-rules.md` — max 300 linii/plik, strict TS, test-first

## Stan docelowy

Działający, deployowany konfigurator z:
- 5-krokowym wizardem z real-time pricing
- Zapisem zamówień w Supabase
- Order lookup po #RE-XXXXX
- PostHog funnel analytics
- Mobile-first responsive UI

## Fazy wdrożenia

### Faza 1: Fundament (Unit 1-2)
Scaffolding projektu + Supabase schema. Po tej fazie: dev server działa, baza gotowa.
**Nakład:** M | **Priorytet:** Krytyczny | **Zależności:** Brak

### Faza 2: Domena (Unit 3-4)
Dane produktowe, silnik cenowy (test-first), wizard state + layout shell.
**Nakład:** L | **Priorytet:** Krytyczny | **Zależności:** Faza 1

### Faza 3: UI — kroki wizarda (Unit 5-6)
Wszystkie 5 kroków konfiguracji z kartami, obrazami, suwakami.
**Nakład:** XL | **Priorytet:** Krytyczny | **Zależności:** Faza 2

### Faza 4: Integracja (Unit 7-8)
Order flow (submit → summary → Allegro → lookup), analytics, assety, polish.
**Nakład:** L | **Priorytet:** Krytyczny | **Zależności:** Faza 3

## Ocena ryzyka

| Ryzyko | Prawdopodobieństwo | Wpływ | Mitygacja |
|--------|-------------------|-------|-----------|
| HeroUI v3 Slider wymaga custom styling | Średnie | Niski | Fallback: natywny input[type=range] + Tailwind |
| View Transitions API — browser support | Niskie (85% w 2026) | Niski | Fallback: CSS opacity transition |
| 253 obrazów = ~25MB w repo | Niskie | Średni | Akceptowalne V1; migracja do external storage przy rozroście |
| Supabase free tier limity | Niskie | Niski | 500MB/50K rows wystarczy na lata |
| Kompatybilność HeroUI v3 + TW4 + React 19 | Niskie (zweryfikowane) | Wysoki | Oficjalny template, testy przy scaffoldingu |

## Mierniki sukcesu

- Klient konfiguruje roletę w <2 min
- 8/8 przykładów weryfikacyjnych cennika przechodzi
- Zamówienia zapisują się z unikalnym #RE-XXXXX
- Lighthouse Performance >80 na mobile
- PostHog rejestruje funnel (7 eventów)
- Zero błędów TypeScript, zero `any`

## Źródła

- Requirements doc: `docs/dev-brainstorms/2026-04-09-konfigurator-rolet-requirements.md`
- Plan techniczny: `docs/plans/2026-04-09-001-feat-konfigurator-rolet-v1-plan.md`
- Specyfikacja produktowa: `PROMPT-KONFIGURATOR.md`
- Prototyp: `index-prototyp.html`
