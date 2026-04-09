# Kontekst: Konfigurator Rolet Plisowanych V1

**Branch:** `feature/konfigurator-rolet-v1`
**Ostatnia aktualizacja:** 2026-04-09 (Faza 1 ukonczona)

## Kluczowe pliki

### Istniejące (źródła danych)

- `index-prototyp.html` — prototyp Alpine.js z pełną logiką cenową, tabelami, kolorami
- `PROMPT-KONFIGURATOR.md` — specyfikacja produktowa (cenniki, kolory, montaże, UI/UX, flow Allegro)
- `stelge-materialy/` — 253 obrazów produktowych (tkaniny, montaże, wzorniki)
- `stelge-materialy/STELGE_CENNIK_KONFIGURATOR.xlsx` — oryginalny cennik Stelge
- `.claude/rules/coding-rules.md` — standardy kodowania (max 300 linii, strict TS, test-first)

### Do stworzenia (kluczowe moduły)

- `src/data/` — dane produktowe (fabrics, pricing, mounting, rails, images, types)
- `src/utils/pricing.ts` — silnik cenowy (calculatePrice, widthToCm, heightToTier, roundToQuarter)
- `src/context/wizard-context.tsx` — useReducer + Context zarządzający wizard state
- `src/services/orders.ts` — submitOrder(), lookupOrder() (Supabase)
- `src/lib/analytics.ts` — PostHog wrapper (7 eventów)
- `src/lib/supabase.ts` — klient Supabase
- `src/config/allegro.ts` — ALLEGRO_LISTING_URL, stałe
- `supabase/migrations/` — schema orders + trigger + RLS

## Decyzje techniczne (post-roast)

| Decyzja          | Wybór                                  | Uzasadnienie                                                    |
| ---------------- | -------------------------------------- | --------------------------------------------------------------- |
| UI framework     | HeroUI v3                              | Natywne wsparcie React 19 + TW4, oficjalny Vite template        |
| State management | useReducer + Context                   | 7 pól, zero powodu na zewnętrzną zależność                      |
| Animacje         | CSS transitions + View Transitions API | 90% potrzeb, -32KB vs Framer Motion                             |
| Order number     | DB trigger + sequence                  | Atomowy z INSERT, zero cold start                               |
| Backend          | Supabase (tylko orders)                | Jedna tabela, trigger, RLS. Config w kodzie.                    |
| Obrazy           | public/assets/ + Vercel CDN            | Statyczne, nie wymagają Supabase Storage                        |
| Analytics        | PostHog minimal (7 eventów)            | Funnel drop-off, wrapper w analytics.ts                         |
| Architektura     | Dedykowane dla rolet plisowanych       | Zero generycznej abstrakcji, refaktor pod moskitiery gdy realne |
| Routing          | Zero routera, ?order= parametr         | Jeden warunek: ?order= → lookup, brak → wizard                  |
| Migracje         | Supabase CLI + migracje w git          | Wersjonowany schemat od dnia zero                               |
| Package manager  | npm                                    | Standard, brak powodu na alternatywy                            |
| Deploy           | Vercel                                 | SPA, zero serverless functions, CDN na assety                   |

## Kluczowe formuły cenowe

```
CENA = baza(tkanina, montaż) + dopłata(szerokość) + dopłata(wysokość) + dopłata(listwa)
Wszystkie ceny = Stelge × 0.95
Zaokrąglanie: Math.round(price * 4) / 4
Szerokość mm → cm: Math.ceil(Math.ceil(widthMm / 10) / 5) * 5
Wysokość mm → próg: ≤150cm | ≤230cm | ≤280cm
Jednostki Allegro: Math.ceil(cena)
```

## Named constants

- `DISCOUNT_FACTOR = 0.95`
- `MAX_WIDTH_GLUED = 1200` (mm)
- `WIDTH_PRICE_JUMP_AT = 125` (cm, skok ze 114 zł na 161.50 zł)

## Ograniczenia biznesowe

- Montaż klejony: max 1200mm szerokości
- Montaż wzmocniony: max 1950mm
- 8 typów tkanin, warianty Termo dziedziczą kolory z bazowej
- 14 kolorów listew (5 bezpłatnych, 2 anodowane 4.75zł, 7 oklein 9.50zł)
- V1 = tylko rolety plisowane okienne, brak dachowych/moskitier/zewnętrznych

## Zależności zewnętrzne

- `react` 19.x, `react-dom` 19.x
- `@heroui/react` v3
- `tailwindcss` v4
- `@supabase/supabase-js`
- `posthog-js`
- `vitest` (testy)

## Zmiany z Fazy 1

### Unit 1: Scaffolding (2026-04-09)

- Stworzono kompletny projekt: package.json, tsconfig (strict), vite.config, index.html
- React 19 + HeroUI v3 (alpha) + Tailwind CSS v4 + Supabase JS + PostHog + Vitest
- Brand colors (brand/accent/sage) z prototypu skonfigurowane w @theme (app.css)
- Fonty: Fraunces (display) + DM Sans (body) z Google Fonts
- HeroUI v3 API: brak HeroUIProvider (niepotrzebny w v3), Button z variant prop (nie color)
- Supabase client w src/lib/supabase.ts z walidacja env vars
- Testy: App renderuje HeroUI Button + heading (2 testy PASS)
- Build, typecheck, testy -- wszystko przechodzi

### Unit 2: Supabase schema (2026-04-09)

- supabase init + migration create_orders
- Tabela orders: BIGINT IDENTITY, order_number UNIQUE, config JSONB, price DECIMAL, allegro_units INT, utm_source TEXT, created_at TIMESTAMPTZ
- Sequence orders_seq + trigger set_order_number = RE-XXXXX (5-digit zero-padded)
- RLS: anon SELECT (true), anon INSERT (true)
- Index B-tree na order_number
- supabase db push POMINIETY -- brak linked remote project
- Testy: 6 testow walidujacych strukture migracji SQL (PASS)
- Seed z przykladowym zamowieniem

### Decyzje podjete w Fazie 1

- HeroUI v3 nie ma HeroUIProvider -- komponenty dzialaja standalone
- HeroUI v3 Button: variant="primary" zamiast color="primary"
- @heroui/styles importowany w app.css po tailwindcss
- @source directive wskazuje na node_modules/@heroui/react/dist
- Testy Unit 2 sa SQL-structure tests (brak Docker = brak local Supabase)

## Źródła

- Requirements doc: `docs/dev-brainstorms/2026-04-09-konfigurator-rolet-requirements.md`
- Plan techniczny: `docs/plans/2026-04-09-001-feat-konfigurator-rolet-v1-plan.md`
