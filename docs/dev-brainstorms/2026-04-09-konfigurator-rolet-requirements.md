---
date: 2026-04-09
topic: konfigurator-rolet-plisowanych
updated: 2026-04-09 (po roaście — uproszczenia scope V1)
---

# Konfigurator Rolet Plisowanych — rolety.expert

## Problem

Sprzedawca rolet plisowanych na Allegro potrzebuje zewnętrznego konfiguratora, bo Allegro nie obsługuje produktów na wymiar. Klient musi skonfigurować roletę, poznać cenę i wrócić na Allegro z liczbą jednostek do kupienia. Bez konfiguratora sprzedawca traci klientów lub obsługuje zamówienia manualnie.

## Wymagania

### Konfiguracja produktu

- R1. 5-krokowy wizard: Tkanina → Kolor → Montaż → Wymiary → Listwa aluminiowa
- R2. 8 typów tkanin z indywidualnymi paletami kolorów (warianty Termo dziedziczą kolory z wersji bazowej)
- R3. 5 systemów montażu w 2 kategoriach (bezinwazyjny: wzmocniony, klejony; inwazyjny: standard, regulowany, kątowy)
- R4. Wymiary: szerokość 150-1950mm, wysokość 150-2800mm, krok 10mm
- R5. Walidacja: montaż klejony max 1200mm szerokości
- R6. 14 kolorów listew aluminiowych z dopłatami (0/4,75/9,50 zł)
- R7. Cofanie do wcześniejszych kroków bez utraty wybranych opcji

### Kalkulacja ceny

- R8. Cena = baza(tkanina, typ montażu) + dopłata(szerokość) + dopłata(wysokość) + dopłata(listwa)
- R9. Wszystkie ceny = Stelge x 0,95, zaokrąglenie: Math.round(price * 4) / 4
- R10. Szerokość: mm → cm (ceil) → najbliższa wielokrotność 5cm w górę → lookup w tabeli dopłat
- R11. Wysokość: mm → cm (ceil) → próg (≤150cm / ≤230cm / ≤280cm) → lookup
- R12. Skok ceny przy 125cm szerokości (120zł → 170zł Stelge) — wynika ze wzmocnionej konstrukcji
- R13. Kalkulacja w czasie rzeczywistym — cena aktualizuje się natychmiast przy każdej zmianie

### Integracja Allegro

- R14. Przeliczenie ceny na jednostki Allegro: ceil(cena) = liczba jednostek
- R15. Generowanie numeru zamówienia #RE-XXXXX (DB trigger + sequence przy INSERT)
- R16. Ekran podsumowania z instrukcją krok-po-kroku dla klienta
- R17. Przycisk "Przejdź do aukcji Allegro" otwierający link w nowej karcie
- R18. Rozbicie na pakiety dla dużych zamówień (np. "17x pakiet 10 + 6 jednostek")
- R36. V1 jedna aukcja Allegro, URL jako stała w kodzie (nie w Supabase)
- R37. Entry URL z parametrami UTM/ref (np. ?ref=allegro) — trackowanie źródła w analytics
- R38. Lookup zamówienia via ?order=RE-XXXXX — zamiast wizarda wyświetla podsumowanie (zero routera)
- R39. Brak powiadomień dla sprzedawcy w V1

### Persistence (Supabase)

- R19. Zapis zamówień do Supabase (config JSONB, price, allegro_units, order_number, created_at, utm_source)
- R21. Numer zamówienia generowany przez DB trigger + sequence (zero Edge Functions)
- R42. Pełny Supabase CLI + migracje od dnia zero (supabase/ directory, wersjonowany schemat w git)
- R43. RLS: public SELECT (lookup po order_number), public INSERT (składanie zamówienia)
- R44. Index na order_number dla szybkiego lookup

### Obrazy i assety

- R22. Obrazy w public/assets/ w repo, serwowane przez Vercel CDN (zero Supabase Storage)
- R23. Lazy loading obrazów — ładuj tylko assety aktualnego kroku
- R24. 253 obrazów z folderu stelge-materialy/ do przeniesienia do public/assets/

### Analytics

- R25. PostHog minimal — 7 eventów: step_1-5_viewed, order_submitted, order_lookup
- R26. Wrapper w src/lib/analytics.ts (podmiana providera bez dotykania komponentów)
- R27. Funnel drop-off per krok — główna metryka. Bez session replay, bez feature flags.

### UI/UX

- R28. Mobile-first, responsywny design
- R29. Sticky header z ceną aktualizowaną na żywo i paskiem postępu (5 kroków)
- R30. Sticky panel cenowy: mobile na dole, desktop w prawym dolnym rogu
- R31. Smooth scroll do następnego kroku po wyborze opcji (CSS scroll-behavior)
- R32. Grafiki montażowe i schematy pomiarowe wyświetlane przy wyborze systemu montażu
- R33. Branding "rolety.expert" — bez elementów Stelge
- R40. UI stack: HeroUI v3 + Tailwind CSS v4. Jasny, nowoczesny design
- R41. Animacje: CSS transitions + Tailwind (hover, pulsowanie ceny). View Transitions API na step transitions. Framer Motion tylko jeśli View Transitions nie wystarczą.

### Architektura

- R34. Dane produktowe w osobnym module src/data/ (pliki per domenę: fabrics.ts, pricing.ts, mounting.ts, rails.ts, images.ts). Dedykowane dla rolet plisowanych — bez generycznej abstrakcji.
- R45. State management: useReducer + Context (zero zewnętrznych zależności)
- R46. Cena jako useMemo derived z wizard state

## Kryteria sukcesu

- Klient może skonfigurować roletę i wrócić na Allegro z poprawną liczbą jednostek w <2 minuty
- Kalkulacja cen zgodna z tabelami Stelge -5% (weryfikacja na 8 przykładach z PROMPT-KONFIGURATOR.md)
- Zamówienia zapisują się w Supabase z unikalnym numerem #RE-XXXXX
- Lighthouse Performance score >80 na mobile
- PostHog rejestruje funnel drop-off per krok

## Granice scope'u (V1)

- Tylko rolety plisowane okienne — brak rolet dachowych
- Brak panelu admina
- Brak rejestracji użytkowników
- Brak koszyka — jedna roleta na raz
- Brak płatności — kupno wyłącznie przez Allegro
- Brak API Allegro — integracja tylko przez link URL
- Brak moskitier i rolet zewnętrznych (refaktor gdy będą realne)
- Brak Supabase Storage — obrazy w repo
- Brak Edge Functions — frontend insert + DB trigger
- Brak Framer Motion na start — CSS/Tailwind + View Transitions API
- Brak session replay / feature flags w analytics
- Brak config w Supabase — URL Allegro i ceny jako stałe w kodzie

## Kluczowe decyzje

- **Dedykowane dla rolet plisowanych:** Zero generycznej architektury. Hardcoded 5 kroków, konkretne typy. Refaktor pod moskitiery gdy będą realne. (zmiana po roaście — YAGNI)
- **Obrazy w repo + Vercel CDN:** Statyczne assety nie wymagają Supabase Storage. Vercel CDN wystarczy. (zmiana po roaście)
- **Supabase tylko na orders:** Jedna tabela, trigger, RLS. Config w kodzie. (zmiana po roaście)
- **Pełne migracje od dnia zero:** supabase CLI + migracje w git. Wersjonowany schemat. (decyzja z roastu)
- **HeroUI v3:** Najnowsza wersja, greenfield = zero powodu na v2. Kompatybilność do zweryfikowania w fazie research planu.
- **CSS first, Framer Motion later:** 32KB za 5% wykorzystania to za dużo. View Transitions API jako pierwszy wybór.
- **useReducer + Context:** Wizard state to 7 pól. Zero zewnętrznych zależności na flat state.
- **PostHog minimal:** 7 eventów + wrapper. Funnel drop-off = jedyna metryka na V1.
- **Zero Edge Functions:** Frontend oblicza cenę, insert do Supabase, DB trigger nadaje numer.
- **Zero routera:** ?order=RE-XXXXX → lookup, brak parametru → wizard.

## Zależności / Założenia

- Ceny Stelge są stabilne na czas V1 (cennik z STELGE_CENNIK_KONFIGURATOR.xlsx)
- Sprzedawca ma jedną aukcję Allegro (jeden URL)
- Obrazy z stelge-materialy/ są finalne i nie wymagają obróbki
- Klient ma dostęp do przeglądarki z JS (brak wymogu SSR/SEO)
- HeroUI v3 jest kompatybilne z Tailwind v4 + React 19 (do weryfikacji)

## Otwarte pytania

### Odroczone do planowania

- [Dotyczy R34][Techniczne] Dokładna struktura TypeScript types dla danych produktowych
- [Dotyczy R22][Techniczne] Organizacja public/assets/ — flat vs mirror stelge-materialy/?
- [Dotyczy R40][Wymaga researchu] Weryfikacja kompatybilności HeroUI v3 + Tailwind v4 + React 19

## Następne kroki

→ `/dev-plan` do planowania technicznego implementacji
