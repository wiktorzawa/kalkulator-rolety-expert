# Review fazy 3: CartContext + refaktor WizardContext na 3 kroki

**Data:** 2026-04-10
**Commit:** 408ca55
**Reviewer:** Claude Code (multi-agent review)

---

## Severity gate

**KONTYNUUJ Z ZASTRZEZENIAMI** -- 0 P1, 2 P2, 4 P3

---

## Statystyki

- Plikow sprawdzonych: 8
- Plikow zmienionych: 6 (2 nowe, 4 zmodyfikowane)
- Linie kodu: 979 (lacznie context/)
- Testow: 35 (13 cart + 22 wizard) -- wszystkie PASS
- Typecheck: PASS
- Lint: PASS

---

## Weryfikacja kryteriow akceptacji

| Kryterium                                        | Status       |
| ------------------------------------------------ | ------------ |
| Testy cart-context przechodza                    | PASS (13/13) |
| Testy wizard-context zaktualizowane i przechodza | PASS (22/22) |
| `npm run typecheck` przechodzi                   | PASS         |
| `npm run lint` przechodzi                        | PASS         |

---

## Findings

### P2 (important)

#### P2-1: Brak `addCurrentConfig` i `updateEditedConfig` w useCart hook

**Plik:** `src/context/cart-context.tsx:94-99`

Plan techniczny definiuje: `useCart hook: { state, dispatch, totalPrice, totalItems, addCurrentConfig, updateEditedConfig }`. Implementacja zwraca tylko `{ state, dispatch, totalPrice, totalItems }`. Brakujace helper functions (`addCurrentConfig`, `updateEditedConfig`) maja byc convenience wrapperami laczacymi wizard state z cart dispatch -- bez nich kazdy konsument bedzie musial reczenie budowac CartItem z WizardState.

**Ocena:** Moze byc celowa decyzja (YAGNI -- dodac gdy Unit 6 ich potrzebuje). Ale jesli Unit 6 zaklada ich istnienie, bedzie dodatkowa praca. Nie blokuje -- ale warto udokumentowac odchylenie od planu.

#### P2-2: `step-content.tsx` nie zostal zaktualizowany do 3 krokow (MountingStep/DimensionsStep/RailStep wciaz renderowane osobno)

**Plik:** `src/components/step-content.tsx:17-23`

Plan mowi: "Krok 3 = montaz + wymiary + listwa na jednej stronie". StepContent wciaz renderuje 5 osobnych komponentow (MountingStep, DimensionsStep, RailStep) jako oddzielne sekcje w kroku 3. To nie jest blad -- wszystkie sa gatowane `state.step >= 3` -- ale odchyla sie od planu ktory zaklada stworzenie `ConfigStep` w Unit 4/5. Na ten moment jest to "stary layout ze starymi komponentami pod nowym 3-krokowym state". Akceptowalne jesli Unit 4/5 wykona ten refaktor.

---

### P3 (nit)

#### P3-1: `cartReducer` -- brak exhaustive check w default case

**Plik:** `src/context/cart-context.tsx:89-91`

`default: return state` jest poprawne ale nie wymusza exhaustive checking. Preferowany pattern:

```typescript
default: {
  const _exhaustive: never = action;
  return state;
}
```

To wychwyci brakujace case'y przy dodawaniu nowych action types.

#### P3-2: `DUPLICATE_ITEM` uzywa `findIndex` po `find` -- podwojna iteracja

**Plik:** `src/context/cart-context.tsx:53-65`

`find()` (linia 53) + `findIndex()` (linia 61) iteruja items[] dwukrotnie. Mozna zrobic jednym `findIndex()` + `items[idx]`.

#### P3-3: `crypto.randomUUID` mock w testach -- globalny side effect

**Plik:** `src/context/cart-context.test.tsx:10-15`

`vi.stubGlobal("crypto", ...)` podmienia caly obiekt crypto globalnie, co moze interferowac z innymi testami w tym samym procesie. Lepiej: `vi.spyOn(crypto, 'randomUUID')` lub `vi.mock` z factory.

#### P3-4: Brak testu UPDATE_ITEM z nieistniejacym id

**Plik:** `src/context/cart-context.test.tsx`

Testy pokrywaja UPDATE_ITEM happy path, ale brak testu co sie dzieje gdy `action.id` nie istnieje w `items[]`. Reducer zrobi `map()` bez zmian (poprawne zachowanie), ale warto to udokumentowac testem.

---

## Odchylenia od planu

| Element planu                                       | Stan      | Komentarz                                                           |
| --------------------------------------------------- | --------- | ------------------------------------------------------------------- |
| `addCurrentConfig` / `updateEditedConfig` w useCart | Brak      | P2 -- convenience wrappery nie zaimplementowane                     |
| `step-content.tsx` refaktor na 3 kroki              | Czesciowy | Gatuje `>= 3`, ale nie scala w ConfigStep (zaplanowane na Unit 4/5) |
| Scenariusze testowe z planu                         | 11/11     | Wszystkie zaimplementowane + dodatkowe edge cases                   |
| Pliki z planu                                       | 7/7       | Wszystkie stworzone/zmodyfikowane zgodnie z planem                  |

---

## Podsumowanie

Implementacja jest solidna. CartContext i WizardContext sa dobrze rozdzielone, typy sa readonly i silne, discriminated union actions sa poprawne. Logika R33 (zachowanie koloru przy zmianie tkaniny w trybie edycji) dziala poprawnie z testami. Reducer pattern jest spojny z istniejacym kodem.

Glowne uwagi:

1. Brak convenience wrapperow `addCurrentConfig`/`updateEditedConfig` -- moze byc celowe odkupienie dlugu technicznego, ale warto upewnic sie ze Unit 6 nie zaklada ich istnienia
2. `step-content.tsx` jest w stanie przejsciowym (5 komponentow renderowanych pod 3-krokowym state) -- poprawne jesli Unit 4/5 dokonczy refaktor

Zero `any`, zero non-null assertions, wszystkie testy przechodza, typecheck i lint czyste.
