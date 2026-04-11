# Review fazy 2 — Baza danych (schemat relacyjny orders + order_items)

Data: 2026-04-10
Commit: 3c0e52f
Reviewer: multi-agent (5 perspektyw)

---

## Severity gate

**KONTYNUUJ Z ZASTRZEŻENIAMI** — P1=0, P2=3, P3=3

Brak problemów blokujących. Trzy problemy P2 do naprawy przed integracją (Faza 6).

---

## Statystyki

- Plików sprawdzonych: 6
- P1 (blocking): 0
- P2 (important): 3
- P3 (nit): 3
- Typecheck: PASS (0 errors)
- Lint: PASS (0 errors)
- Testy: 135/135 PASS (w tym 7 nowych dla orders)
- E2E: nie wykonano (testy DB wymagają połączenia z Supabase)

---

## Findings

### P2 (important)

#### P2-1: SECURITY — `submit_order` brak `SET search_path = public`

**Plik:** `supabase/migrations/20260410022747_create_order_items.sql:155`
**Typ:** KOD

Funkcja `submit_order` jest `SECURITY DEFINER` ale bez `SET search_path = public`. Funkcja `lookup_order` (linia 210) ma to poprawnie ustawione. `SECURITY DEFINER` bez pinned `search_path` to wektor ataku search_path hijacking — atakujący może stworzyć schemat z tabelą `orders` i podmienić dane. W kontekście anon-only aplikacji ryzyko jest niskie, ale to łatwy fix i best practice Supabase.

**Fix:** Zmień linię 155:

```sql
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

#### P2-2: SECURITY — brak walidacji inputu w `submit_order` RPC

**Plik:** `supabase/migrations/20260410022747_create_order_items.sql:114-154`
**Typ:** KOD

RPC `submit_order` nie waliduje danych wejściowych:

- `p_items` może być pustą tablicą → zamówienie bez pozycji
- `p_total_price` może być ujemna lub zero
- `p_allegro_units` może być ujemna lub zero
- Brak ograniczenia na liczbę items (DoS vector — 10000 pozycji)

Minimalna walidacja powinna sprawdzać: items niepuste, total_price > 0, allegro_units > 0.

**Fix:** Dodać na początku BEGIN:

```sql
IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
  RAISE EXCEPTION 'Order must have at least one item';
END IF;
IF p_total_price <= 0 THEN
  RAISE EXCEPTION 'Total price must be positive';
END IF;
IF p_allegro_units <= 0 THEN
  RAISE EXCEPTION 'Allegro units must be positive';
END IF;
IF jsonb_array_length(p_items) > 50 THEN
  RAISE EXCEPTION 'Too many items (max 50)';
END IF;
```

#### P2-3: TYPE SAFETY — `as unknown as Record<string, unknown>` w submitOrder

**Plik:** `src/services/orders.ts:93`
**Typ:** KOD

Double type assertion `params.items as unknown as Record<string, unknown>` obchodzi type safety. Supabase client oczekuje konkretnego typu dla RPC params. Lepiej jawnie skonwertować readonly array na mutable:

**Fix:**

```typescript
p_items: JSON.parse(JSON.stringify(params.items)),
```

lub:

```typescript
p_items: [...params.items] as unknown as Record<string, unknown>,
```

### P3 (nit)

#### P3-1: ARCH — `price-panel.tsx` wciąż pokazuje rozbicie "Dopłata za szerokość/wysokość"

**Plik:** `src/components/layout/price-panel.tsx:182-198`
**Typ:** KOD

Panel cenowy w ekspanderze wciąż wyświetla "Dopłata za szerokosc" i "Dopłata za wysokosc" (linie 186-189). Wg spec (PROMPT-KONFIGURATOR.md) i planu V2: "NIE wyswietlaj osobnych 'Cena bazowa', 'Doplata za szerokosc', 'Doplata za wysokosc'". Ten refaktor jest zaplanowany na Fazę 5 (Unit 6), więc nie blokuje — ale warto odnotować odchylenie.

#### P3-2: ARCH — `LegacyOrderConfig` type powinien być usunięty w Unit 7

**Plik:** `src/services/orders.ts:61-69`
**Typ:** KOD

Deprecated type `LegacyOrderConfig` jest zachowany z komentarzem "Will be removed in Unit 7". OK na teraz, ale upewnić się że faktycznie zostanie usunięty.

#### P3-3: TEST — brak testu dla pustego `items` w `submitOrder`

**Plik:** `src/services/orders.test.ts`
**Typ:** TEST

Brak testu edge case: `submitOrder({ items: [], ... })`. Warto dodać test weryfikujący zachowanie przy pustej liście items (po dodaniu walidacji w P2-2 powinien rzucić błąd).

---

## Odchylenia od planu

### Plan techniczny (Implementation Unit 2 w docs/plans/)

Plan V1 (Unit 2) definiował prostą tabelę `orders` z JSONB `config`. Plan V2 (Unit 2 w multi-plisa-3-kroki-v2-zadania.md) definiuje relacyjne `orders` + `order_items` z RPC. Implementacja jest zgodna z planem V2.

### Testy DB wymagające Supabase

Dwa testy z planu zadań są oznaczone jako wymagające połączenia z DB:

- "RPC submit_order z błędną pozycją → rollback" — nie da się przetestować z mockiem
- "Sequence generuje kolejne numery (UNIQUE constraint)" — nie da się przetestować z mockiem

To jest akceptowalne ograniczenie — testy te powinny być zweryfikowane ręcznie po `supabase db push`.

### Weryfikacje E2E

Trzy weryfikacje z planu (supabase db push, INSERT via RPC, Lookup) nie zostały wykonane w tym review — wymagają połączenia z produkcyjnym Supabase. Zanotowano w zadaniach jako niezaznaczone.

---

## Co jest dobrze zrobione

1. **Schemat SQL** — czysty, dobrze ustrukturyzowany, z komentarzami sekcji. DROP CASCADE poprawnie czyści stare obiekty.
2. **RPC transakcyjne** — `submit_order` prawidłowo używa jednej transakcji (PL/pgSQL jest transakcyjny domyślnie). Rollback przy błędzie gwarantuje spójność.
3. **lookup_order** z `COALESCE(jsonb_agg(...), '[]')` — poprawnie obsługuje zamówienie bez items.
4. **Testy** — 7 testów pokrywa happy path, error case, null handling. Mockowanie Supabase jest czyste (vi.hoisted pattern).
5. **TypeScript types** — `OrderItemInsert`, `OrderItemRecord`, `OrderRecord` z `readonly` properties. Dobra separacja insert vs record.
6. **OrderSummary** — poprawnie obsługuje multi-item z quantity > 1, pozycje numerowane, warunkowo "szt."
7. **RLS** — SELECT na obu tabelach, INSERT tylko przez SECURITY DEFINER RPC. To blokuje bezpośredni INSERT z anon key.

---

## Podsumowanie

Faza 2 dostarcza solidny schemat relacyjny z RPC transakcyjnym. Główne zastrzeżenia to: brakujący `search_path` na `submit_order` (łatwy fix), brak walidacji inputu w RPC (ważne przed produkcją), i double type assertion w TypeScript. Żaden z problemów nie blokuje kontynuacji — można naprawić przed Fazą 6 (integracja).
