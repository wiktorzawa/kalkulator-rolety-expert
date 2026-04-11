---
date: 2026-04-09
topic: multi-plisa-wymiary-ui-v2
---

# Multi-plisa, swobodne wymiary, nowy layout 3-krokowy

## Problem

Konfigurator obsługuje jedną plisę na zamówienie — klient z wieloma oknami musi składać osobne zamówienia. Pola wymiarów wymuszają krok 10mm (nieintuicyjne). Rozbicie dopłat (baza + szer + wys + listwa) jest zbędne z perspektywy klienta. Layout 5-krokowy jest mało czytelny — trudno się zorientować w którym kroku się znajdujemy. Formuła jednostek Allegro zakłada 1 zł = 1 jednostka, a powinna dzielić przez cenę jednostki aukcji.

## Wymagania

### Layout i nawigacja — 3 kroki zamiast 5

- R1. Wizard zmienia się z 5 kroków na 3: Krok 1 (Tkanina) → Krok 2 (Kolor) → Krok 3 (Montaż + Wymiary + Listwa)
- R2. Kroki wyraźnie rozdzielone wizualnie — duże nagłówki "KROK 1", "KROK 2", "KROK 3" z podtytułami (wzór: Stelge)
- R3. Wewnątrz kroku 3 sekcje (montaż, wymiary, listwa) płyną na jednej stronie bez specjalnego rozdzielania — jak Stelge
- R4. Progress bar aktualizowany do 3 kroków

### Krok 3 — podgląd rolety

- R5. W kroku 3 wyświetlany podgląd rolety na oknie (zdjęcie packshot z wybraną tkaniną i kolorem)
- R6. Przy zmianie montażu bezinwazyjny ↔ inwazyjny podgląd zmienia się na odpowiedni packshot (`packshot.png` vs `packshot-bezinwazyjny.png`)
- R7. Desktop: podgląd po lewej, konfiguracja po prawej (jak Stelge). Mobile: podgląd na górze, konfiguracja pod spodem

### Krok 3 — montaż (karuzela dwupoziomowa)

- R8. Pierwszy poziom: dwa duże przyciski "BEZINWAZYJNY" / "INWAZYJNY" z krótkim opisem różnicy
- R9. Po wyborze kategorii: karuzela z systemami tej kategorii (bezinwazyjny: 2 systemy, inwazyjny: 3 systemy)
- R10. Każdy slide karuzeli: duże zdjęcie profilu + nazwa + opis + grafika pomiarowa
- R11. Info pod listwami: "Kolor systemu montażowego będzie taki sam jak wybrany kolor listwy"

### Krok 3 — listwy (siatka z realnymi zdjęciami)

- R12. Listwy wyświetlane jako siatka z większymi miniaturami — realne zdjęcia profili aluminiowych z folderu `stelge-assets/prowadnice/` zamiast kwadratów hex
- R13. Po kliknięciu — powiększenie zdjęcia listwy (modal lub tooltip)

### Swobodne wpisywanie wymiarów

- R14. Pola szerokości i wysokości akceptują dowolną wartość w zakresie min-max (szerokość: 150-1950mm, wysokość: 150-2800mm) bez wymuszania kroku 10mm
- R15. Pola działają jak normalne pola edycyjne — kliknięcie, zaznaczenie, wpisanie. Bez automatycznego zaokrąglania wartości w polu
- R16. Suwak (slider) pozostaje zsynchronizowany z polem — slider może zachować krok (np. 1mm lub 5mm), ale pole tekstowe przyjmuje dowolną liczbę całkowitą
- R17. Kalkulacja ceny nadal używa zaokrąglania do cennikowych progów (mm → cm ceil → wielokrotność 5cm). Zmiana dotyczy tylko UI inputu, nie logiki cenowej
- R18. Usunięcie DimensionPreview (prostokąt z wymiarami) — zastąpiony przez podgląd rolety w R5

### Uproszczenie panelu cenowego

- R19. Panel cenowy pokazuje: "Cena rolety: X zł" + opcjonalnie "Dopłata listwa: Y zł" = "Razem: Z zł". Bez słowa "bazowa", bez osobnych dopłat za szerokość/wysokość
- R20. Podsumowanie zamówienia (order summary) również używa uproszczonego rozbicia

### Multi-plisa w zamówieniu

#### Flow

- R21. Klient może dodać wiele plis do jednego zamówienia — identyczne (z ilością), różne wymiary, różne konfiguracje
- R22. Flow: Konfiguracja (3 kroki) → "Dodaj do zamówienia" z polem ilości → Lista zamówienia. Konfiguracja i lista to osobne ekrany
- R23. Pierwsze wejście na stronę → od razu konfiguracja (krok 1), nie pusta lista
- R24. Sticky panel cenowy w konfiguracji: "Ta plisa: X zł" + "Dotychczas w zamówieniu: Y zł (N pozycji)". Przycisk "Dodaj do zamówienia"
- R25. Przycisk "Zamów przez Allegro" tylko na liście zamówienia, nie w konfiguracji

#### Lista zamówienia

- R26. Lista wyświetla: numer pozycji, parametry (tkanina, kolor, montaż, wymiary, listwa), ilość, cenę jednostkową i łączną za pozycję
- R27. Akcje na liście: Edytuj, Duplikuj, Usuń, zmiana ilości (+/-)
- R28. Zmiana ilości działa natychmiast (live update sumy) — bez przycisku "Zaktualizuj koszyk"
- R29. "Dodaj kolejną" uruchamia czystą konfigurację od kroku 1
- R30. Suma zamówienia = suma (cena_jednostkowa × ilość) dla wszystkich pozycji
- R31. Przycisk "Zamów przez Allegro" aktywny gdy lista ma min. 1 pozycję

#### Edycja

- R32. "Edytuj" otwiera konfigurację z wypełnionymi polami wybranej plisy (od kroku 1 z zaznaczonymi opcjami). Klient może zmienić dowolny parametr
- R33. Przy zmianie tkaniny: jeśli wybrany kolor istnieje w nowej palecie — zachowaj. Jeśli nie — resetuj kolor
- R34. Po zmianach klient klika "Zapisz" → wraca na listę, pozycja zaktualizowana, cena przeliczona
- R35. Przy edycji pozycji z ilością > 1 — toast notification: "Zaktualizowano N szt. — [parametry]"

#### Duplikacja

- R36. "Duplikuj" tworzy kopię konfiguracji i od razu otwiera ją w konfiguracji do edycji
- R37. Po edycji → "Zapisz" → nowa pozycja na liście

### Formuła jednostek Allegro

- R38. Jednostki = `Math.ceil(suma / ALLEGRO_UNIT_PRICE)`, gdzie `ALLEGRO_UNIT_PRICE` to konfigurowalny parametr (stała w kodzie, np. 5 zł)
- R39. Podsumowanie wyświetla: "Jedna sztuka na aukcji oznacza kwotę X złotych. Złóż zamówienie w ilości (iloraz SUMA ÷ X): N sztuk"

### Podsumowanie zamówienia

- R40. Po kliknięciu "Zamów przez Allegro" → zapis do Supabase → ekran podsumowania
- R41. Podsumowanie wyświetla: tabelę wszystkich pozycji z cenami + sumę łączną + liczbę jednostek Allegro + numer zamówienia RE-XXXXX
- R42. Instrukcja krok-po-kroku ze screenshotami (jak Stelge): gdzie wpisać ilość, gdzie wpisać numer zamówienia w "Uwagi do zakupu"
- R43. Przycisk "Przejdź do aukcji Allegro" (target=\_blank)
- R44. Przy wielu pozycjach dodatkowe zdanie: "Kwota obejmuje wszystkie N pozycji z Twojego zamówienia"

### Zapis do Supabase — schemat relacyjny

- R45. Tabela `orders`: id, order_number (RE-XXXXX), total_price, allegro_units, utm_source, allegro_tx_id (null na przyszłość), created_at
- R46. Tabela `order_items`: id, order_id (FK → orders), position, fabric_id, fabric_name, color_id, color_name, mounting_id, mounting_name, mounting_type, width_mm, height_mm, rail_id, rail_name, quantity, unit_price
- R47. Kolumny `*_name` = snapshot czytelnych nazw w momencie zamówienia (sprzedawca widzi bez dekodowania ID)
- R48. Lookup zamówienia (?order=RE-XXXXX) wyświetla pełną listę pozycji
- R49. Stare dane testowe — czyścimy tabelę i tworzymy schemat od zera (zero migracji danych)

### Nowe assety

- R50. Przejście na assety z folderu `stelge-assets/` (lepsza struktura, oba warianty packshot bezinwazyjny/inwazyjny, realne zdjęcia prowadnic)
- R51. Struktura: `produkty/{kolekcja}/{kolor}/packshot.png`, `packshot-bezinwazyjny.png`, `tkanina.jpg`
- R52. Prowadnice: `prowadnice/{kolor}.jpg` (14 kolorów, realne zdjęcia profili)
- R53. Montaż: `montaz/{system}/opis.png`, `pomiar.png`, `zblizenie.webp`

### Zabezpieczenia

- R54. Beforeunload warning gdy lista plis jest niepusta i zamówienie nie zostało złożone. Po zapisaniu do Supabase — wyłącz ostrzeżenie
- R55. Matchowanie zamówień Allegro (allegro_tx_id) — odroczone, kolumna przygotowana ale pusta

### Poza scope

- Brak zamiany design systemu — zostajemy przy HeroUI
- Brak koszyka persystentnego (localStorage)
- Brak limitu pozycji na zamówienie
- Brak integracji API Allegro (matchowanie zamówień)
- Brak panelu admina
- Brak rolet dachowych

## Kryteria sukcesu

- Klient może skonfigurować 3 różne plisy i złożyć jedno zamówienie w <5 minut
- Pola wymiarów przyjmują dowolną wartość (np. 623mm) bez skakania
- Layout 3-krokowy jest czytelny — klient wie w którym kroku jest
- Podgląd rolety zmienia się przy zmianie montażu (bezinwazyjny ↔ inwazyjny)
- Panel cenowy nie pokazuje osobnych dopłat za szerokość/wysokość
- Zamówienie z wieloma pozycjami zapisuje się w Supabase (relacyjnie) i jest dostępne przez lookup
- Jednostki Allegro obliczane poprawnie: ceil(suma / ALLEGRO_UNIT_PRICE)
- Kalkulacja cen identyczna jak dotychczas (zaokrąglenia cennikowe bez zmian)
- Prowadnice wyświetlane jako realne zdjęcia profili

## Kluczowe decyzje

- **3 kroki zamiast 5**: Krok 1 Tkanina, Krok 2 Kolor, Krok 3 Montaż+Wymiary+Listwa (wzór: Stelge). Czytelniejsze, mniej tarcia
- **Konfiguracja i lista zamówienia jako osobne ekrany**: prostsze na mobile
- **Edycja = konfiguracja z wypełnionymi polami + przycisk "Zapisz"**: reuse istniejącego UI
- **Duplikacja = kopia + otwarcie do edycji**: ułatwienie dla podobnych rolet
- **Relacyjna DB (orders + order_items)**: gotowe na raportowanie, statusy, przyszłe integracje
- **Nowe assety z stelge-assets/**: lepsza struktura, oba warianty packshot, realne zdjęcia prowadnic
- **Karuzela dla montażu, siatka dla listew**: montaż wymaga kontekstu (duże zdjęcia), listwy wymagają przeglądu (14 opcji na raz)
- **Pozostajemy przy HeroUI**: zamiana na daisyUI odroczona
- **Slider zachowuje krok, pole tekstowe swobodne**: slider do szybkiej regulacji, pole do precyzji
- **Live update ilości**: bez przycisku "Zaktualizuj koszyk" (Stelge pattern przestarzały)
- **Toast notification przy edycji z ilością > 1**: feedback bez blokującego modala
- **Beforeunload warning**: tylko gdy lista niepusta i zamówienie niezłożone
- **Matchowanie Allegro odroczone**: kolumna allegro_tx_id przygotowana, integracja API = osobny projekt

## Zależnosci / Założenia

- Istniejąca konfiguracja (obecne kroki 1-5) jest bazą — refaktorujemy na 3 kroki i dodajemy multi-plisę
- Assety z `stelge-assets/` (folder zewnętrzny) muszą być skopiowane do `public/assets/` w nowej strukturze
- State management wymaga rozszerzenia: osobny cart state obok wizard state
- Stare dane testowe w Supabase — czyścimy
- ALLEGRO_UNIT_PRICE to stała w kodzie — sprzedawca ustawia ją raz przy tworzeniu aukcji

## Otwarte pytania

### Odroczone do planowania

- [Dotyczy R1-R3] Architektura refaktoru 5→3 kroki: czy przebudowa komponentów steps/ czy nowe komponenty?
- [Dotyczy R22] Architektura state'u: osobny CartContext obok WizardContext, czy rozszerzenie WizardContext?
- [Dotyczy R32] Jak "Edytuj" przywraca stan wizarda — dispatch nowy action type LOAD_ITEM?
- [Dotyczy R46] Dokładna migracja SQL: DROP TABLE orders + CREATE TABLE orders + CREATE TABLE order_items + trigger
- [Dotyczy R50] Organizacja nowych assetów w public/assets/ — mirror struktury stelge-assets/ czy flat?
- [Dotyczy R9-R10] Biblioteka karuzeli: HeroUI nie ma karuzeli — Embla Carousel, Swiper, czy custom?

## Następne kroki

→ `/dev-plan` do planowania technicznego implementacji
