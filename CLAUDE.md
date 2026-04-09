# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Interaktywny konfigurator rolet plisowanych dla **rolety.expert**. Klient z aukcji Allegro konfiguruje roletę w 5 krokach, dostaje cenę i liczbę jednostek do kupienia na Allegro. Zamówienia zapisywane w Supabase.

Specyfikacja produktowa: @PROMPT-KONFIGURATOR.md
Requirements doc: @docs/dev-brainstorms/2026-04-09-konfigurator-rolet-requirements.md
Plan implementacji: @docs/plans/2026-04-09-001-feat-konfigurator-rolet-v1-plan.md

## Stack

- React 19 + TypeScript (strict) + Vite
- HeroUI v3 + Tailwind CSS v4
- Supabase (tylko tabela orders + trigger + RLS)
- PostHog (minimal — 7 eventów funnel)
- Deploy: Vercel
- Package manager: **npm**

## Komendy

```bash
npm run dev          # Dev server
npm run build        # Build produkcyjny
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run test         # Vitest
npm run format       # Prettier
```

## Konwencje

- Odpowiadaj po polsku. Terminy techniczne w oryginale.
- Commity po polsku, bez formalnych prefixów (feat:/fix:/chore:)
- Dane produktowe w `src/data/` (pliki per domenę: fabrics, pricing, mounting, rails, images)
- State management: `useReducer` + Context (zero zewnętrznych zależności)
- Animacje: CSS transitions + Tailwind. Framer Motion tylko gdy View Transitions API nie wystarczą.
- Zero `any` — użyj `unknown` + type guards albo konkretny interfejs
- Plik > 300 linii = refaktoruj. Funkcja > 50 linii = wyciągnij pod-funkcje.

## Kluczowe ograniczenia biznesowe

- Ceny = Stelge × 0.95, zaokrąglone: `Math.round(price * 4) / 4`
- Montaż klejony: max szerokość 1200mm
- Warianty Termo dziedziczą kolory z wersji bazowej
- Jednostki Allegro: `Math.ceil(cena)`
- Numer zamówienia #RE-XXXXX generowany przez DB trigger + sequence
- Zero routera: `?order=RE-XXXXX` → lookup, brak parametru → wizard

## Architektura

- V1 dedykowane dla rolet plisowanych — zero generycznej abstrakcji
- Supabase: tylko tabela `orders` + trigger + RLS. Config (URL Allegro, ceny) = stałe w kodzie
- Obrazy w `public/assets/` (Vercel CDN), nie w Supabase Storage
- Zero Edge Functions — frontend insert, DB trigger nadaje numer
- Analytics wrapper w `src/lib/analytics.ts` — podmiana providera bez dotykania komponentów
