# Code Review fazy 5 — Multi-plisa (Unit 6)

Data: 2026-04-10
Commit: 967fadd
Reviewer: Claude Opus 4.6 (multi-perspective)

---

## Weryfikacja techniczna

- **Typecheck:** PASS (zero errors)
- **Lint:** PASS (zero errors)
- **Testy:** 175/175 PASS
- **Pliki sprawdzone:** 6 (order-list, order-item-card, price-panel, configurator, cart-context, cart-types) + 2 testy

---

## Severity Gate

**KONTYNUUJ Z ZASTRZEŻENIAMI** (P1=0, P2=4, P3=5)

---

## Problemy

### P2 (important)

1. **src/components/layout/price-panel.tsx** — 317 linii, przekracza limit 300 linii (coding rules sekcja 1). Plik nadal łączy: logikę budowania CartItem, submit/edit/cancel handlery, pulse animation, toast, quantity selector, cenową prezentację. Wyciągnąć `buildCartItem()` + handlery do `useOrderActions()` hooka lub rozdzielić prezentację od logiki.

2. **src/components/order/order-list.tsx:72-95** — useEffect z brakującą zależnością `handleEdit` w dep array `[cartState.items, duplicatePendingFor]`. Mimo że ESLint nie zgłasza (bo `handleEdit` nie jest wrapped w useCallback), to stale closure na `handleEdit` może powodować race conditions przy szybkich interakcjach. Ponadto logika znajdowania duplikatu na podstawie `originalIndex + 1` jest krucha — zakłada, że duplikat jest zawsze tuż po oryginale i ma taki sam `fabricId`, co może nie być prawdą jeśli state zmieni się z innego powodu.

3. **src/components/order/order-list.test.tsx** — testy pokrywają tylko empty state (3 testy). Brak testów dla:
   - Renderowanie N pozycji z cenami (wymaganie w zadaniu)
   - +/- ilość aktualizuje totalPrice
   - Edytuj otwiera wizard z wypełnionymi polami
   - Duplikuj tworzy kopię
   - Usuń ostatnią pozycję disabluje "Zamów"
   - Toast "Zaktualizowano N szt."

4. **src/components/order/order-item-card.tsx** — brak pliku testowego `order-item-card.test.tsx`. OrderItemCard zawiera logikę (confirm dialog, quantity change, image path resolution) która powinna być pokryta testami.

### P3 (nit)

1. **formatPrice()** zduplikowana 5 razy (header, price-panel, order-list, order-item-card, order-summary). Wyciągnąć do `src/utils/format.ts`.

2. **src/components/configurator.tsx:13-36** — `WizardProvider` jest tworzona osobno dla widoku `order-list` i `configurator`. Przy przełączaniu widoku (SET_VIEW) React unmountuje jedną instancję i mountuje drugą, resetując wizard state. W bieżącym flow to nie powoduje bugu (edit dispatch'uje LOAD_ITEM przed SET_VIEW), ale jest nieintuicyjne i kruche.

3. **src/components/order/order-list.tsx:86-91** — sprawdzenie duplikatu porównuje tylko `fabricId`. Jeśli dwa kolejne itemy mają taki sam fabricId (np. dwa "Standard" w różnych kolorach), logika może błędnie zaklasyfikować normalny item jako duplikat.

4. **src/components/order/order-list.tsx:97-102** — `handleOrderSubmit` dispatcha `SET_VIEW` do `order-list` (tego samego widoku w którym już jesteśmy) i pokazuje tymczasowy toast. Placeholder OK dla V1, ale komentarz powinien wskazywać na Unit 7 wyraźniej (np. `// TODO(Unit 7): submit to Supabase`).

5. **src/context/cart-context.tsx:89-91** — `default` case w cartReducer zwraca `state` zamiast exhaustive check (`const _exhaustive: never = action`). Powtórzenie z review fazy 3.

---

## Odchylenia od planu

Plan techniczny (Unit 6) definiował:

- "Dodaj toast notification (Sonner lub HeroUI)" — zamiast tego użyto custom toast z `useState` + `setTimeout`. Akceptowalne (mniej zależności), ale zduplikowane w dwóch komponentach (PricePanel i OrderList).
- Plan wspominał o convenience wrapperach `addCurrentConfig`/`updateEditedConfig` w useCart — nie zaimplementowane (przeniesione z P2 fazy 3). Logika budowania CartItem leży w PricePanel.

---

## Pozytywne aspekty

- Panel cenowy poprawnie uproszczony: "Cena rolety + Dopłata listwa = Razem" (zgodne z R19-R20)
- Kontekstowe przyciski: "Dodaj do zamówienia" vs "Zapisz"/"Anuluj" w trybie edycji
- OrderItemCard czytelny, z aria-labels na przyciskach ilości
- Quantity live update działa bez przycisku "Zaktualizuj" (zgodne ze specyfikacją)
- Readonly types w CartItem/CartState
- "Dotychczas w zamówieniu" poprawnie wyklucza edytowany item
- Zero `any`, zero `console.log`, zero type assertions

---

## Weryfikacja scenariuszy z zadania

| Scenariusz                     | Status                 |
| ------------------------------ | ---------------------- |
| Lista zamówienia z pełnym CRUD | Kod OK, brak testów    |
| Panel cenowy uproszczony       | PASS (test potwierdza) |
| Edycja, duplikacja, usuwanie   | Kod OK, brak testów    |
| Live update ilości i sumy      | Kod OK, brak testów    |
