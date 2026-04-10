# Multi-plisa, 3 kroki, nowe assety — Plan V2

Branch: `feature/multi-plisa-3-kroki-v2`
Ostatnia aktualizacja: 2026-04-10

## Podsumowanie wykonawcze

Refaktor konfiguratora rolet z 5-krokowego single-item wizarda na 3-krokowy multi-plisa konfigurator. Klient może dodać wiele plis do jednego zamówienia. Layout scalony: Tkanina → Kolor → Konfiguracja (Montaż + Wymiary + Listwa z podglądem). Nowy schemat DB (orders + order_items), nowe assety z `stelge-assets/`, uproszczony panel cenowy.

## Cele

1. Klient może skonfigurować i zamówić wiele plis w jednym zamówieniu
2. Layout 3-krokowy jest czytelniejszy niż 5-krokowy
3. Swobodne wymiary (bez kroku 10mm)
4. Realne zdjęcia prowadnic i packshoty bezinwazyjne
5. Uproszczony panel cenowy (bez rozbicia dopłat za szer/wys)
6. Schemat DB relacyjny (gotowy na raportowanie)

## Analiza obecnego stanu

- **Wizard:** 5 kroków (Tkanina → Kolor → Montaż → Wymiary → Listwa), single-item
- **DB:** Tabela `orders` z `config` JSONB (single item), trigger RE-XXXXX
- **Assety:** Stare numerowane foldery w `public/assets/` (01-Standard, 02-Standard-Termo...)
- **State:** WizardContext (useReducer), brak cart/multi-item
- **Panel cenowy:** Pełne rozbicie (baza + dopłata szer + dopłata wys + dopłata listwa)
- **Pricing engine:** Stabilny, 8/8 testów pass — bez zmian

## Stan docelowy

- **Wizard:** 3 kroki, krok 3 = montaż (karuzela) + wymiary (swobodne) + listwa (siatka ze zdjęciami) + podgląd packshot
- **DB:** `orders` + `order_items` (relacyjna), RPC `submit_order` (transakcja)
- **Assety:** Nowa struktura `produkty/{kolekcja}/{kolor}/`, `montaz/{system}/`, `prowadnice/{kolor}.jpg`
- **State:** WizardContext (3 kroki + tryb edycji) + CartContext (multi-plisa items[])
- **Panel cenowy:** "Cena rolety: X zł" + opcjonalnie "Dopłata listwa: Y zł" = "Razem: Z zł"
- **Multi-plisa:** Lista zamówienia z CRUD (edycja, duplikacja, usuwanie, ilość live)

## Fazy wdrożenia

### Faza 1: Fundament danych (Unit 1)

Migracja assetów z stelge-assets/ + aktualizacja image mappings.

- Nakład: **M**
- Zależności: brak

### Faza 2: Baza danych (Unit 2)

Nowy schemat relacyjny orders + order_items, RPC submit_order/lookup_order.

- Nakład: **M**
- Zależności: brak (niezależna od frontendu)

### Faza 3: Architektura state (Unit 3)

CartContext + refaktor WizardContext na 3 kroki z trybem edycji.

- Nakład: **L**
- Zależności: Unit 1 (image paths), Unit 2 (typy OrderItem)

### Faza 4: UI wizarda (Unit 4 + Unit 5)

Layout shell 3-krokowy + krok 3 composite (podgląd + montaż karuzela + wymiary + listwa).

- Nakład: **XL**
- Zależności: Unit 3 (state)

### Faza 5: Multi-plisa (Unit 6)

Lista zamówienia z CRUD + zrefaktorowany panel cenowy.

- Nakład: **L**
- Zależności: Unit 4, Unit 5

### Faza 6: Integracja i polish (Unit 7 + Unit 8)

Order submission multi-item, podsumowanie, lookup, beforeunload, analytics.

- Nakład: **L**
- Zależności: Unit 6

## Ocena ryzyka

| Ryzyko                            | Prawdopodobieństwo | Wpływ  | Mitygacja                               |
| --------------------------------- | ------------------ | ------ | --------------------------------------- |
| Embla Carousel niezgodne z HeroUI | Niskie             | Średni | Headless lib, fallback: CSS scroll-snap |
| Rozmiar assetów (~50MB w repo)    | Pewne              | Niski  | Akceptowalne na V2, CDN w przyszłości   |
| DROP TABLE orders na produkcji    | Średnie            | Wysoki | Potwierdzić że brak realnych zamówień   |
| Sequence reset (RE-00001 od nowa) | Pewne              | Niski  | Świadoma decyzja (R49)                  |

## Mierniki sukcesu

- Klient konfiguruje 3 różne plisy i składa zamówienie w <5 minut
- Pola wymiarów akceptują 623mm bez zaokrąglania
- Kalkulacja cen identyczna jak V1 (pricing engine bez zmian)
- Zamówienie z wieloma pozycjami zapisuje się w Supabase relacyjnie
- Jednostki Allegro: `ceil(suma / ALLEGRO_UNIT_PRICE)`
- `npm run typecheck && npm run lint && npm run test` — zero failures

## Źródła

- Requirements doc: `docs/dev-brainstorms/2026-04-09-multi-plisa-wymiary-requirements.md`
- Plan techniczny: `docs/plans/2026-04-10-002-feat-multi-plisa-3-kroki-v2-plan.md`
