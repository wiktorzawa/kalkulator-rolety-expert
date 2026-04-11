# PROMPT: Konfigurator Rolet Plisowanych -- rolety.expert

---

## Cel aplikacji

Stwórz **interaktywny konfigurator/kalkulator rolet plisowanych** dla firmy **rolety.expert**. Aplikacja jest narzedziem sprzedazowym wykorzystywanym na platformie **Allegro.pl** -- klient trafia na konfigurator z linku w opisie aukcji Allegro, konfiguruje rolete (lub wiele rolet), otrzymuje wyliczenie ceny i informacje ile "jednostek" kupic na aukcji Allegro, a nastepnie wraca na Allegro, aby sfinalizowac zakup.

**Aplikacja NIE jest sklepem internetowym** -- nie obsluguje platnosci. Jej zadania:

1. Przeprowadzic klienta przez konfiguracje rolety krok po kroku (3 kroki)
2. Umozliwic dodanie wielu plis do jednego zamowienia
3. Wyliczyc dokladna cene na podstawie wybranych parametrow
4. Przeliczyc cene na liczbe "jednostek Allegro" do zamowienia
5. Wygenerowac podsumowanie z linkiem powrotnym do aukcji Allegro

---

## Zrodla i referencje

Konfigurator wzorowany jest na narzedziu firmy **Stelge** -- naszego dostawcy. Wszystkie materialy graficzne, dane produktowe i cenniki pochodza z ich systemu. Nasza aplikacja ma dzialac identycznie pod wzgledem logiki, ale pod marka **rolety.expert**, z wlasnymi cenami (**5% nizsze** od cen Stelge) i nowoczesnym UI.

### Linki referencyjne -- konfigurator Stelge (wzor):

- **Konfigurator Stelge:** https://konfigurator.stelge.com
- **Aukcja Allegro Stelge:** https://allegro.pl/oferta/rolety-plisowane-roleta-plisowana-plisy-na-wymiar-polski-producent-18428591712

### Linki referencyjne -- konkurencja (Stylus.pl):

- **Kalkulator Stylus:** https://kalkulatorstylus.pl
- **Aukcja Allegro Stylus:** https://allegro.pl/oferta/roleta-plisowana-rolety-plisowane-plisy-konfigurator-na-wymiar-zaluzje-term-16881477376

### Folder z materialami zrodlowymi:

Wszystkie materialy graficzne i dane pobrane ze strony Stelge znajduja sie w folderze:

```
/stelge-assets/
```

Szczegolowy opis zawartosci -- ponizej w sekcji "Materialy graficzne".

### Arkusz cenowy zrodlowy:

```
/stelge-materialy/STELGE_CENNIK_KONFIGURATOR.xlsx
```

Zawiera oryginalne ceny Stelge. **W naszej aplikacji wszystkie ceny musza byc o 5% nizsze.**

---

## Kontekst: Jak dziala sprzedaz rolet na Allegro

Allegro nie posiada natywnego konfiguratora produktow na wymiar. Sprzedawcy stosuja obejscie:

- **Aukcja Allegro** ma cene za "1 jednostke" (np. X zl za jednostke -- konfigurowalny parametr `ALLEGRO_UNIT_PRICE`)
- **Zewnetrzny konfigurator** (nasza aplikacja) oblicza cene zamowienia i przelicza ja na liczbe jednostek do kupienia
- **Klient wraca na Allegro**, wpisuje obliczona liczbe jednostek w pole "ilosc", a numer zamowienia z konfiguratora wpisuje w pole "Uwagi do zakupu" (messageToSeller)
- **Sprzedawca** odczytuje numer zamowienia z Allegro, odnajduje konfiguracje w swoim systemie i realizuje produkcje

### Przyklad przeplywu klienta:

1. Klient widzi aukcje Allegro "Rolety Plisowane Na Wymiar -- Konfigurator"
2. W opisie aukcji klika link do konfiguratora (nasza aplikacja)
3. Konfiguruje pierwsza plise: Standard, Biel, Bezinwazyjny Wzmocniony, 800x1500mm, Listwa biala
4. Klika "Dodaj do zamowienia" -- plisa laduje na liste
5. Opcjonalnie dodaje kolejne plisy (np. inna do innego okna)
6. Na liscie zamowienia widzi sume: **312,50 zl** i liczbe jednostek do kupienia
7. Klika "Zamow przez Allegro" -- widzi podsumowanie z numerem #RE-00142 i instrukcja
8. Klika "Przejdz do aukcji Allegro" -- wraca na listing
9. Na Allegro wpisuje ilosc jednostek, w uwagach: numer zamowienia #RE-00142
10. Placi przez Allegro, sprzedawca realizuje zamowienie

---

## Architektura przeplywu

### 3-krokowy wizard konfiguracji

Klient konfiguruje pojedyncza plise w 3 krokach:

1. **KROK 1: Wybierz rodzaj tkaniny** -- siatka kart tkanin
2. **KROK 2: Wybierz kolor** -- siatka probek kolorow
3. **KROK 3: Skonfiguruj swoja rolete** -- montaz + wymiary + listwa na jednej stronie

Progress bar 3-krokowy (0-100%, 3 kroki x ~33%).

### Multi-plisa flow

Po zakonczeniu konfiguracji (krok 3) klient klika **"Dodaj do zamowienia"** (z polem ilosci). Plisa trafia na **liste zamowienia**.

- **Pierwsze wejscie** na strone -- od razu widzi konfiguracje (krok 1), nie pusta liste
- Po dodaniu pierwszej plisy moze: dodac kolejna (nowy wizard), edytowac istniejaca, duplikowac, usunac
- Przycisk **"Zamow przez Allegro"** jest dostepny tylko na liscie zamowienia (nie w wizardzie)

### Lista zamowienia

Widok z pozycjami zamowienia:

- Kazda pozycja: miniatura (packshot), tkanina, kolor, montaz, wymiary, listwa, ilosc, cena jednostkowa, cena laczna
- **Akcje per pozycja:**
  - **Edytuj** -- otwiera wizard z wypelnionymi polami + przycisk "Zapisz" zamiast "Dodaj". Przy ilosci > 1: toast "Zaktualizowano N szt."
  - **Duplikuj** -- tworzy kopie i otwiera do edycji
  - **Usun** -- z potwierdzeniem
  - **Zmiana ilosci (+/-)** -- live, bez przycisku "Zaktualizuj"
- Zmiana tkaniny przy edycji: jesli wybrany kolor istnieje w nowej palecie -- zachowaj, jesli nie -- resetuj kolor
- **Podsumowanie listy:** suma za wszystkie pozycje, liczba jednostek Allegro, przycisk "Zamow przez Allegro"

### Beforeunload warning

Ostrzezenie przy odswiezeniu strony gdy lista plis jest niepusta i zamowienie niezlozone. Po zlozeniu zamowienia -- wylaczyc.

---

## KROK 1: Wybor rodzaju tkaniny

Wyswietl siatke kart (2 kolumny mobile, 4 kolumny desktop). Kazda karta zawiera:

- **Miniature tkaniny** -- zdjecie produktowe rolety na oknie (packshot z koloru Biel danej kolekcji: `produkty/{kolekcja}/biel/packshot.png`)
- **Nazwe tkaniny**
- **Krotki opis**
- **Wskaznik zaciemnienia** (1-5 kropek wypelnionych)
- **Wskaznik termoizolacji** (1-5 kropek wypelnionych)

Po kliknieciu karty -- zaznaczenie (ramka + badge z ptaszkiem) -- automatyczny scroll do kroku 2.

### Dostepne tkaniny -- parametry i ceny

Ceny ponizej to ceny Stelge. **W aplikacji stosuj ceny Stelge x 0,95 (minus 5%).**

| ID             | Nazwa            | Opis                                           | Zaciemn. | Termo | Baza bezinw. (Stelge) | Baza bezinw. (nasza -5%) | Baza inwaz. (Stelge) | Baza inwaz. (nasza -5%) | Kategoria |
| -------------- | ---------------- | ---------------------------------------------- | -------- | ----- | --------------------- | ------------------------ | -------------------- | ----------------------- | --------- |
| standard       | Standard         | Gladka struktura tkaniny. 24 kolory.           | 3/5      | 3/5   | 50 zl                 | 47,50 zl                 | 30 zl                | 28,50 zl                | Okienne   |
| standard_termo | Standard + Termo | Gladka tkanina z powloka termoizolacyjna.      | 3/5      | 4/5   | 55 zl                 | 52,25 zl                 | 35 zl                | 33,25 zl                | Okienne   |
| melange        | Melange          | Splot melanzowy, wysoka gramatura. 7 kolorow.  | 4/5      | 4/5   | 55 zl                 | 52,25 zl                 | 35 zl                | 33,25 zl                | Okienne   |
| melange_termo  | Melange + Termo  | Melanz z powloka termo. Wysoka gramatura.      | 4/5      | 5/5   | 60 zl                 | 57,00 zl                 | 40 zl                | 38,00 zl                | Okienne   |
| dolomit        | Dolomit          | Naturalna, pozioma struktura wzoru. 6 kolorow. | 3/5      | 3/5   | 55 zl                 | 52,25 zl                 | 35 zl                | 33,25 zl                | Okienne   |
| dolomit_termo  | Dolomit + Termo  | Dolomit z powloka termoizolacyjna.             | 3/5      | 4/5   | 60 zl                 | 57,00 zl                 | 40 zl                | 38,00 zl                | Okienne   |
| blackout       | Blackout         | Pelne zaciemnienie. 8 kolorow.                 | 5/5      | 5/5   | 70 zl                 | 66,50 zl                 | 50 zl                | 47,50 zl                | Okienne   |
| honeycomb      | Honeycomb        | Struktura plastra miodu, podwojna izolacja.    | 5/5      | 5/5   | 70 zl                 | 66,50 zl                 | 50 zl                | 47,50 zl                | Okienne   |

**Uwaga:** Roznica miedzy cena bezinwazyjna a inwazyjna to zawsze 20 zl (Stelge) / 19 zl (nasza -5%). Bezinwazyjny jest drozszy, bo zawiera dodatkowe elementy montazowe (uchwyty klipsowe/klejone).

---

## KROK 2: Wybor koloru tkaniny

Wyswietl siatke probek kolorow (4 kolumny mobile, 6-8 desktop). Kazda probka:

- **Zdjecie close-up tkaniny** (plik `produkty/{kolekcja}/{kolor}/tkanina.jpg`) -- jesli dostepne
- Jesli brak zdjecia -- **kwadrat z kolorem hex**
- **Nazwa koloru** pod probka

Lista kolorow zalezy od wybranej tkaniny. **Warianty "Termo" dziedzicza kolory z wersji bazowej** (np. Standard + Termo -- kolory ze Standard, Melange + Termo -- kolory z Melange).

Po kliknieciu koloru -- zaznaczenie (ramka + powiekszenie) -- automatyczny scroll do kroku 3.

### Standard -- 24 kolory (dziedziczone przez Standard + Termo)

| Kolor        | Hex     | Probka close-up (plik)                       | Packshot inwazyjny                            | Packshot bezinwazyjny                                      |
| ------------ | ------- | -------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| Biel         | #F5F3EE | `produkty/standard/biel/tkanina.jpg`         | `produkty/standard/biel/packshot.png`         | `produkty/standard/biel/packshot-bezinwazyjny.png`         |
| Srebro       | #C8C8C8 | `produkty/standard/srebro/tkanina.jpg`       | `produkty/standard/srebro/packshot.png`       | `produkty/standard/srebro/packshot-bezinwazyjny.png`       |
| Krem         | #F0E6D0 | `produkty/standard/krem/tkanina.jpg`         | `produkty/standard/krem/packshot.png`         | `produkty/standard/krem/packshot-bezinwazyjny.png`         |
| Jasny bez    | #E6D5BA | `produkty/standard/jasny-bez/tkanina.jpg`    | `produkty/standard/jasny-bez/packshot.png`    | `produkty/standard/jasny-bez/packshot-bezinwazyjny.png`    |
| Popiel       | #A9A9A9 | `produkty/standard/popiel/tkanina.jpg`       | `produkty/standard/popiel/packshot.png`       | `produkty/standard/popiel/packshot-bezinwazyjny.png`       |
| Szary        | #8A8A8A | `produkty/standard/szary/tkanina.jpg`        | `produkty/standard/szary/packshot.png`        | `produkty/standard/szary/packshot-bezinwazyjny.png`        |
| Grafit       | #4A4A4A | `produkty/standard/grafit/tkanina.jpg`       | `produkty/standard/grafit/packshot.png`       | `produkty/standard/grafit/packshot-bezinwazyjny.png`       |
| Bez          | #C9B99A | `produkty/standard/bez/tkanina.jpg`          | `produkty/standard/bez/packshot.png`          | `produkty/standard/bez/packshot-bezinwazyjny.png`          |
| Czarny       | #1A1A1A | `produkty/standard/czarny/tkanina.jpg`       | `produkty/standard/czarny/packshot.png`       | `produkty/standard/czarny/packshot-bezinwazyjny.png`       |
| Cappucino    | #A0785A | `produkty/standard/cappucino/tkanina.jpg`    | `produkty/standard/cappucino/packshot.png`    | `produkty/standard/cappucino/packshot-bezinwazyjny.png`    |
| Braz         | #6B4226 | `produkty/standard/braz/tkanina.jpg`         | `produkty/standard/braz/packshot.png`         | `produkty/standard/braz/packshot-bezinwazyjny.png`         |
| Piasek       | #D4C4A8 | `produkty/standard/piasek/tkanina.jpg`       | `produkty/standard/piasek/packshot.png`       | `produkty/standard/piasek/packshot-bezinwazyjny.png`       |
| Pudrowy roz  | #E8C4C4 | `produkty/standard/pudrowy-roz/tkanina.jpg`  | `produkty/standard/pudrowy-roz/packshot.png`  | `produkty/standard/pudrowy-roz/packshot-bezinwazyjny.png`  |
| Niebieski    | #5B7FA5 | `produkty/standard/niebieski/tkanina.jpg`    | `produkty/standard/niebieski/packshot.png`    | `produkty/standard/niebieski/packshot-bezinwazyjny.png`    |
| Jasny fiolet | #B09CC5 | `produkty/standard/jasny-fiolet/tkanina.jpg` | `produkty/standard/jasny-fiolet/packshot.png` | `produkty/standard/jasny-fiolet/packshot-bezinwazyjny.png` |
| Jasna zielen | #8FB88F | `produkty/standard/jasna-zielen/tkanina.jpg` | `produkty/standard/jasna-zielen/packshot.png` | `produkty/standard/jasna-zielen/packshot-bezinwazyjny.png` |
| Pomarancz    | #E8873A | `produkty/standard/pomarancz/tkanina.jpg`    | `produkty/standard/pomarancz/packshot.png`    | `produkty/standard/pomarancz/packshot-bezinwazyjny.png`    |
| Zolty        | #E8D44D | `produkty/standard/zolty/tkanina.jpg`        | `produkty/standard/zolty/packshot.png`        | `produkty/standard/zolty/packshot-bezinwazyjny.png`        |
| Fiolet       | #7B5EA7 | `produkty/standard/fiolet/tkanina.jpg`       | `produkty/standard/fiolet/packshot.png`       | `produkty/standard/fiolet/packshot-bezinwazyjny.png`       |
| Zielen       | #4A7A4A | `produkty/standard/zielen/tkanina.jpg`       | `produkty/standard/zielen/packshot.png`       | `produkty/standard/zielen/packshot-bezinwazyjny.png`       |
| Turkus       | #4ABCC1 | `produkty/standard/turkus/tkanina.jpg`       | `produkty/standard/turkus/packshot.png`       | `produkty/standard/turkus/packshot-bezinwazyjny.png`       |
| Bordo        | #7A1F3D | `produkty/standard/bordo/tkanina.jpg`        | `produkty/standard/bordo/packshot.png`        | `produkty/standard/bordo/packshot-bezinwazyjny.png`        |
| Czerwien     | #C13B3B | `produkty/standard/czerwien/tkanina.jpg`     | `produkty/standard/czerwien/packshot.png`     | `produkty/standard/czerwien/packshot-bezinwazyjny.png`     |
| Roz          | #D4729E | `produkty/standard/roz/tkanina.jpg`          | `produkty/standard/roz/packshot.png`          | `produkty/standard/roz/packshot-bezinwazyjny.png`          |

**Uwaga o Standard + Termo:** Gdy klient wybierze Standard + Termo, uzyj zdjec z folderu `produkty/standard-termo/{kolor}/`. Packshoty pokazuja rolety z widoczna powloka termo (srebrzysty rewers). Probki close-up (tkanina.jpg) sa te same co dla Standard.

### Melange -- 7 kolorow (dziedziczone przez Melange + Termo)

| Kolor     | Hex     | Probka close-up (plik)                   | Packshot inwazyjny                        | Packshot bezinwazyjny                                  |
| --------- | ------- | ---------------------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| Nude      | #D5C5B0 | `produkty/melange/nude/tkanina.jpg`      | `produkty/melange/nude/packshot.png`      | `produkty/melange/nude/packshot-bezinwazyjny.png`      |
| Popiel    | #A0A0A0 | `produkty/melange/popiel/tkanina.jpg`    | `produkty/melange/popiel/packshot.png`    | `produkty/melange/popiel/packshot-bezinwazyjny.png`    |
| Szary     | #808080 | `produkty/melange/szary/tkanina.jpg`     | `produkty/melange/szary/packshot.png`     | `produkty/melange/szary/packshot-bezinwazyjny.png`     |
| Cappucino | #9B7B5A | `produkty/melange/cappucino/tkanina.jpg` | `produkty/melange/cappucino/packshot.png` | `produkty/melange/cappucino/packshot-bezinwazyjny.png` |
| Grafit    | #4A4A4A | `produkty/melange/grafit/tkanina.jpg`    | `produkty/melange/grafit/packshot.png`    | `produkty/melange/grafit/packshot-bezinwazyjny.png`    |
| Braz      | #5C3A1E | `produkty/melange/braz/tkanina.jpg`      | `produkty/melange/braz/packshot.png`      | `produkty/melange/braz/packshot-bezinwazyjny.png`      |
| Denim     | #4A6A8A | `produkty/melange/denim/tkanina.jpg`     | `produkty/melange/denim/packshot.png`     | `produkty/melange/denim/packshot-bezinwazyjny.png`     |

**Uwaga o Melange + Termo:** Gdy klient wybierze Melange + Termo, uzyj zdjec z folderu `produkty/melange-termo/{kolor}/`. Te same kolory, packshoty z widoczna powloka termo.

### Dolomit -- 6 kolorow (dziedziczone przez Dolomit + Termo)

| Kolor  | Hex     | Probka close-up (plik)                | Packshot inwazyjny                     | Packshot bezinwazyjny                               |
| ------ | ------- | ------------------------------------- | -------------------------------------- | --------------------------------------------------- |
| Szary  | #8A8A8A | `produkty/dolomit/szary/tkanina.jpg`  | `produkty/dolomit/szary/packshot.png`  | `produkty/dolomit/szary/packshot-bezinwazyjny.png`  |
| Bez    | #C9B99A | `produkty/dolomit/bez/tkanina.jpg`    | `produkty/dolomit/bez/packshot.png`    | `produkty/dolomit/bez/packshot-bezinwazyjny.png`    |
| Krem   | #EDE4D0 | `produkty/dolomit/krem/tkanina.jpg`   | `produkty/dolomit/krem/packshot.png`   | `produkty/dolomit/krem/packshot-bezinwazyjny.png`   |
| Grafit | #4A4A4A | `produkty/dolomit/grafit/tkanina.jpg` | `produkty/dolomit/grafit/packshot.png` | `produkty/dolomit/grafit/packshot-bezinwazyjny.png` |
| Mocca  | #6B4A3A | `produkty/dolomit/mocca/tkanina.jpg`  | `produkty/dolomit/mocca/packshot.png`  | `produkty/dolomit/mocca/packshot-bezinwazyjny.png`  |
| Srebro | #BDBDBD | `produkty/dolomit/srebro/tkanina.jpg` | `produkty/dolomit/srebro/packshot.png` | `produkty/dolomit/srebro/packshot-bezinwazyjny.png` |

**Uwaga o Dolomit + Termo:** Gdy klient wybierze Dolomit + Termo, uzyj zdjec z folderu `produkty/dolomit-termo/{kolor}/`. Te same kolory, packshoty z widoczna powloka termo.

### Blackout -- 8 kolorow

| Kolor     | Hex     | Probka close-up (plik)                    | Packshot inwazyjny                         | Packshot bezinwazyjny                                   |
| --------- | ------- | ----------------------------------------- | ------------------------------------------ | ------------------------------------------------------- |
| Biel      | #F0EEEA | `produkty/blackout/biel/tkanina.jpg`      | `produkty/blackout/biel/packshot.png`      | `produkty/blackout/biel/packshot-bezinwazyjny.png`      |
| Srebro    | #C0C0C0 | `produkty/blackout/srebro/tkanina.jpg`    | `produkty/blackout/srebro/packshot.png`    | `produkty/blackout/srebro/packshot-bezinwazyjny.png`    |
| Szary     | #808080 | `produkty/blackout/szary/tkanina.jpg`     | `produkty/blackout/szary/packshot.png`     | `produkty/blackout/szary/packshot-bezinwazyjny.png`     |
| Krem      | #E8DCC8 | `produkty/blackout/krem/tkanina.jpg`      | `produkty/blackout/krem/packshot.png`      | `produkty/blackout/krem/packshot-bezinwazyjny.png`      |
| Grafit    | #3E3E3E | `produkty/blackout/grafit/tkanina.jpg`    | `produkty/blackout/grafit/packshot.png`    | `produkty/blackout/grafit/packshot-bezinwazyjny.png`    |
| Cappucino | #9B7B5A | `produkty/blackout/cappucino/tkanina.jpg` | `produkty/blackout/cappucino/packshot.png` | `produkty/blackout/cappucino/packshot-bezinwazyjny.png` |
| Czarny    | #1A1A1A | `produkty/blackout/czarny/tkanina.jpg`    | `produkty/blackout/czarny/packshot.png`    | `produkty/blackout/czarny/packshot-bezinwazyjny.png`    |
| Piasek    | #D4C4A8 | `produkty/blackout/piasek/tkanina.jpg`    | `produkty/blackout/piasek/packshot.png`    | `produkty/blackout/piasek/packshot-bezinwazyjny.png`    |

**Uwaga:** Blackout ma dodatkowy plik `tkanina.jpg` (zblizenie na tkanine). Uzyj go jako probki koloru.

### Honeycomb -- 6 kolorow

| Kolor      | Hex     | Probka close-up (plik)                        | Packshot inwazyjny                           | Packshot bezinwazyjny                                     |
| ---------- | ------- | --------------------------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| Zimny bez  | #D5CCBC | `produkty/honeycomb/zimny-bez/zblizenie.png`  | `produkty/honeycomb/zimny-bez/packshot.png`  | `produkty/honeycomb/zimny-bez/packshot-bezinwazyjny.png`  |
| Ciepły bez | #CCBFA6 | `produkty/honeycomb/cieply-bez/zblizenie.png` | `produkty/honeycomb/cieply-bez/packshot.png` | `produkty/honeycomb/cieply-bez/packshot-bezinwazyjny.png` |
| Biel       | #F0EDEA | `produkty/honeycomb/biel/zblizenie.png`       | `produkty/honeycomb/biel/packshot.png`       | `produkty/honeycomb/biel/packshot-bezinwazyjny.png`       |
| Antracyt   | #3A3A3A | `produkty/honeycomb/antracyt/zblizenie.png`   | `produkty/honeycomb/antracyt/packshot.png`   | `produkty/honeycomb/antracyt/packshot-bezinwazyjny.png`   |
| Szary      | #808080 | `produkty/honeycomb/grafit/zblizenie.png`     | `produkty/honeycomb/grafit/packshot.png`     | `produkty/honeycomb/grafit/packshot-bezinwazyjny.png`     |
| Cappucino  | #9B7B5A | `produkty/honeycomb/cappucino/zblizenie.png`  | `produkty/honeycomb/cappucino/packshot.png`  | `produkty/honeycomb/cappucino/packshot-bezinwazyjny.png`  |

**Uwaga:** Honeycomb ma plik `zblizenie.png` (zamiast `tkanina.jpg`) pokazujacy strukture plastra miodu. Uzyj go jako probki koloru.

---

## KROK 3: Skonfiguruj swoja rolete

Krok 3 laczy na jednej stronie trzy elementy: montaz, wymiary i listwe aluminiowa. Layout:

- **Desktop:** podglad rolety po lewej (packshot), konfiguracja po prawej
- **Mobile:** podglad na gorze, konfiguracja ponizej

### Podglad rolety (packshot)

Wyswietl packshot wybranej tkaniny i koloru:

- Montaz bezinwazyjny: `produkty/{kolekcja}/{kolor}/packshot-bezinwazyjny.png`
- Montaz inwazyjny: `produkty/{kolekcja}/{kolor}/packshot.png`

Podglad zmienia sie dynamicznie przy przelaczaniu miedzy bezinwazyjnym a inwazyjnym montazem.

### Sekcja A: Wybor typu montazu (karuzela dwupoziomowa)

**Pierwszy poziom:** Dwa duze przyciski/karty z wyborem kategorii:

#### Bezinwazyjny (bez wkrecania w okno)

- **Opis:** "Bez wkrecania w okno -- idealny do wynajmowanych mieszkan. Montaz klejony lub skrecany na rame."
- **Etykieta:** "Rekomendowany"

#### Inwazyjny (wkrecany w rame okienna)

- **Opis:** "Wkrecany w rame okienna -- najtrwalsze i najbardziej stabilne rozwiazanie."
- **Etykieta:** "Najtrwalszy"

**Drugi poziom (karuzela):** Po wyborze kategorii wyswietl karuzele z systemami tej kategorii.

**Informacja pod karuzela:** "Kolor systemu montazowego bedzie taki sam jak wybrany kolor listwy."

#### Bezinwazyjny -- 2 systemy:

**Wzmocniony (skrecany)**

- Montaz klipsowy na rame okienna bez wiercenia w skrzydlo
- Max szerokosc: 1950 mm
- **Grafika opisowa:** `montaz/bezinwazyjny-wzmocniony/opis.png`
- **Grafika pomiarowa:** `montaz/bezinwazyjny-wzmocniony/pomiar.png`
- **Grafika pomiarowa szczegolowa:** `montaz/bezinwazyjny-wzmocniony/grafika-pomiarowa.png`
- **Zblizenie profilu:** `montaz/bezinwazyjny-wzmocniony/zblizenie-1.png`, `montaz/bezinwazyjny-wzmocniony/zblizenie-2.png`

**Klejony**

- Montaz klejony na rame -- **OGRANICZENIE: max szerokosc 1200 mm** (wyswietl ostrzezenie!)
- **Grafika opisowa:** `montaz/bezinwazyjny-klejony/opis.png`
- **Grafika pomiarowa:** `montaz/bezinwazyjny-klejony/pomiar.png`
- **Zblizenie profilu:** `montaz/bezinwazyjny-klejony/zblizenie.webp`

#### Inwazyjny -- 3 systemy:

**Standard**

- Podstawowy montaz wkrecany, wymaga min. 13 mm glebokosci ramy
- Max szerokosc: 1950 mm
- **Grafika opisowa:** `montaz/inwazyjny-standard/opis.png`
- **Grafika pomiarowa:** `montaz/inwazyjny-standard/pomiar.png`
- **Zblizenie profilu:** `montaz/inwazyjny-standard/zblizenie.webp`

**Regulowany**

- Z mozliwoscia regulacji pozycji, dla zaokraglonych profili ram
- Max szerokosc: 1950 mm
- **Grafika opisowa:** `montaz/inwazyjny-regulowany/opis.png`
- **Grafika pomiarowa:** `montaz/inwazyjny-regulowany/pomiar.png`
- **Zblizenie profilu:** `montaz/inwazyjny-regulowany/zblizenie.webp`

**Katowy**

- Montaz dla katowych profili ram okiennych
- Max szerokosc: 1950 mm
- **Grafika opisowa:** `montaz/inwazyjny-katowy/opis.png`
- **Grafika pomiarowa:** `montaz/inwazyjny-katowy/pomiar.png`
- **Zblizenie profilu:** `montaz/inwazyjny-katowy/zblizenie.webp`

Kazdy slide karuzeli: duze zdjecie profilu (zblizenie) + nazwa systemu + opis + grafika pomiarowa.

**Systemy montazu nie maja doplat** -- wszystkie kosztuja 0 zl. Wplywaja wylacznie na cene bazowa (bezinwazyjny/inwazyjny).

### Sekcja B: Podanie wymiarow

Dwa panele obok siebie (desktop) lub pod soba (mobile):

#### Szerokosc

- Suwak (range input) + pole numeryczne (input number)
- **Zakres:** 150-1950 mm
- **Pola przyjmuja dowolna wartosc** w zakresie (bez wymuszania kroku 10mm)
- Suwak zsynchronizowany z polem (zmiana jednego aktualizuje drugie)
- **Walidacja:** Przy montazu klejonym -- max 1200 mm (wyswietl ostrzezenie, zablokuj wyzsze wartosci)

#### Wysokosc

- Suwak (range input) + pole numeryczne (input number)
- **Zakres:** 150-2800 mm
- **Pola przyjmuja dowolna wartosc** w zakresie

Domyslne wartosci: 600x1500 mm.

**Uwaga:** Kalkulacja ceny nadal zaokragla wymiary do cenikowych progow (patrz sekcja "Kalkulacja ceny"). Swobodne wpisywanie dotyczy tylko UI -- logika cenowa pozostaje bez zmian.

### Sekcja C: Kolor listwy aluminiowej

Siatka kart (2 kolumny mobile, 4-5 desktop). Kazda karta:

- **Zdjecie profilu** -- realne zdjecie z folderu `prowadnice/{kolor}.jpg` (lub `.webp`)
- Po kliknieciu -- powiekszenie zdjecia (lightbox/modal)
- **Nazwa koloru**
- **Typ wykonczenia** (lakier / anodowany / okleina)
- **Doplata** (jesli > 0 zl) -- wyraznie widoczna

### Kolory listew -- dane (ceny Stelge -- nasze -5%)

| Kolor           | Typ wykonczenia | Doplata Stelge | Doplata nasza (-5%) | Plik zdjecia                    |
| --------------- | --------------- | -------------- | ------------------- | ------------------------------- |
| Bialy           | lakier          | 0 zl           | 0 zl                | `prowadnice/biel.jpg`           |
| Krem            | lakier          | 0 zl           | 0 zl                | `prowadnice/krem.webp`          |
| Braz            | lakier          | 0 zl           | 0 zl                | `prowadnice/braz.jpg`           |
| Antracyt polmat | lakier          | 0 zl           | 0 zl                | `prowadnice/antracyt.jpg`       |
| Czarny          | lakier          | 0 zl           | 0 zl                | `prowadnice/czarny-lakier.webp` |
| Srebrny         | anodowany       | 5 zl           | 4,75 zl             | `prowadnice/srebrny.jpg`        |
| Szampanski      | anodowany       | 5 zl           | 4,75 zl             | `prowadnice/szampanski.jpg`     |
| Zloty dab       | okleina         | 10 zl          | 9,50 zl             | `prowadnice/zloty-dab.jpg`      |
| Orzech          | okleina         | 10 zl          | 9,50 zl             | `prowadnice/orzech.jpg`         |
| Dab bagienny    | okleina         | 10 zl          | 9,50 zl             | `prowadnice/dab-bagienny.jpg`   |
| Mahon           | okleina         | 10 zl          | 9,50 zl             | `prowadnice/mahon.jpg`          |
| Turner Oak      | okleina         | 10 zl          | 9,50 zl             | `prowadnice/turner-oak.webp`    |
| Sosna           | okleina         | 10 zl          | 9,50 zl             | `prowadnice/sosna.jpg`          |
| Winchester      | okleina         | 10 zl          | 9,50 zl             | `prowadnice/winchester.jpg`     |

---

## Kalkulacja ceny

### Wzor

```
CENA_PLISY = cena_bazowa(tkanina, typ_montazu) + doplata_szerokosc(szer_cm) + doplata_wysokosc(wys_cm) + doplata_listwa
```

Wszystkie ceny = **ceny Stelge x 0,95** (zaokraglone do 0,25 zl): `Math.round(price * 4) / 4`.

### Przeliczenie wymiarow na cenniki

1. **Szerokosc:** zamien mm na cm (zaokraglij w gore), potem zaokraglij do najblizszej wielokrotnosci 5 cm w gore.
   - Przyklad: 623 mm -- 63 cm -- **65 cm**
   - Przyklad: 800 mm -- 80 cm -- **80 cm**
2. **Wysokosc:** zamien mm na cm (zaokraglij w gore), potem przypisz do progu: <=150 cm / <=230 cm / <=280 cm.
   - Przyklad: 1500 mm -- 150 cm -- prog **do 150 cm**
   - Przyklad: 1510 mm -- 151 cm -- prog **do 230 cm**

### Cennik doplat za szerokosc

Ceny oryginalne Stelge (zrodlo: arkusz `STELGE_CENNIK_KONFIGURATOR.xlsx`) i nasze (-5%):

| Szer. (cm) | Stelge | Nasza (-5%) |     | Szer. (cm) | Stelge  | Nasza (-5%) |
| ---------- | ------ | ----------- | --- | ---------- | ------- | ----------- |
| 15         | 30     | 28,50       |     | 105        | 105     | 99,75       |
| 20         | 30     | 28,50       |     | 110        | 110     | 104,50      |
| 25         | 30     | 28,50       |     | 115        | 115     | 109,25      |
| 30         | 30     | 28,50       |     | 120        | 120     | 114,00      |
| 35         | 35     | 33,25       |     | **125**    | **170** | **161,50**  |
| 40         | 40     | 38,00       |     | 130        | 175     | 166,25      |
| 45         | 45     | 42,75       |     | 135        | 180     | 171,00      |
| 50         | 50     | 47,50       |     | 140        | 185     | 175,75      |
| 55         | 55     | 52,25       |     | 145        | 190     | 180,50      |
| 60         | 60     | 57,00       |     | 150        | 195     | 185,25      |
| 65         | 65     | 61,75       |     | 155        | 200     | 190,00      |
| 70         | 70     | 66,50       |     | 160        | 205     | 194,75      |
| 75         | 75     | 71,25       |     | 165        | 210     | 199,50      |
| 80         | 80     | 76,00       |     | 170        | 215     | 204,25      |
| 85         | 85     | 80,75       |     | 175        | 220     | 209,00      |
| 90         | 90     | 85,50       |     | 180        | 225     | 213,75      |
| 95         | 95     | 90,25       |     | 185        | 230     | 218,50      |
| 100        | 100    | 95,00       |     | 190        | 235     | 223,25      |
|            |        |             |     | 195        | 240     | 228,00      |

**UWAGA -- SKOK CENY przy 125 cm:** Doplata Stelge skacze ze 120 zl (przy 120 cm) do 170 zl (przy 125 cm) -- wzrost o 50 zl. To wynika z tego, ze szersze rolety wymagaja wzmocnionej konstrukcji. Nasza cena: skok ze 114 zl do 161,50 zl.

### Cennik doplat za wysokosc

| Prog wysokosci           | Stelge | Nasza (-5%) |
| ------------------------ | ------ | ----------- |
| do 150 cm (150-1500 mm)  | 55 zl  | 52,25 zl    |
| do 230 cm (1501-2300 mm) | 70 zl  | 66,50 zl    |
| do 280 cm (2301-2800 mm) | 100 zl | 95,00 zl    |

### Przyklady kalkulacji (weryfikacja poprawnosci)

Z arkusza Stelge (ceny Stelge):

| Tkanina        | Montaz       | Szer.  | Wys.   | Listwa        | Skladniki (Stelge) | Stelge | Nasza (-5%) |
| -------------- | ------------ | ------ | ------ | ------------- | ------------------ | ------ | ----------- |
| Standard       | Inwazyjny    | 60 cm  | 150 cm | Bialy-lakier  | 30+60+55+0         | 145 zl | 137,75 zl   |
| Standard       | Bezinwazyjny | 60 cm  | 150 cm | Bialy-lakier  | 50+60+55+0         | 165 zl | 156,75 zl   |
| Standard       | Inwazyjny    | 100 cm | 150 cm | Bialy-lakier  | 30+100+55+0        | 185 zl | 175,75 zl   |
| Standard       | Inwazyjny    | 100 cm | 230 cm | Bialy-lakier  | 30+100+70+0        | 200 zl | 190,00 zl   |
| Standard+Termo | Inwazyjny    | 80 cm  | 150 cm | Srebrny-anod. | 35+80+55+5         | 175 zl | 166,25 zl   |
| Blackout       | Inwazyjny    | 120 cm | 230 cm | Bialy-lakier  | 50+120+70+0        | 240 zl | 228,00 zl   |
| Blackout       | Inwazyjny    | 130 cm | 230 cm | Bialy-lakier  | 50+175+70+0        | 295 zl | 280,25 zl   |
| Honeycomb      | Bezinwazyjny | 90 cm  | 280 cm | Orzech-okl.   | 70+90+100+10       | 270 zl | 256,50 zl   |

---

## Przeliczenie na jednostki Allegro

### Zasada

Cena jednej jednostki na aukcji Allegro to konfigurowalny parametr:

```javascript
const ALLEGRO_UNIT_PRICE = 1; // cena jednej jednostki na aukcji (w zl)
```

Konfigurator przelicza sume zamowienia na liczbe jednostek:

```
liczba_jednostek = Math.ceil(suma_zamowienia / ALLEGRO_UNIT_PRICE)
```

### Wyswietlanie dla klienta

Na ekranie podsumowania wyswietl:

> Jedna sztuka na aukcji oznacza kwote **X zlotych**. Zloz zamowienie w ilosci: **N sztuk**

Przyklad z ALLEGRO_UNIT_PRICE = 1:

- Suma 175,75 zl -- `Math.ceil(175.75 / 1)` = **176 jednostek**

Przyklad z ALLEGRO_UNIT_PRICE = 5:

- Suma 175,75 zl -- `Math.ceil(175.75 / 5)` = **36 jednostek**

---

## Panel cenowy (sticky)

### Widocznosc

- **Mobile:** przypiety na dole ekranu
- **Desktop:** panel w prawym dolnym rogu
- Widoczny od kroku 2 (po wyborze tkaniny)

### Zawartosc w wizardzie (konfiguracja pojedynczej plisy)

- **"Cena rolety: X zl"** -- pelna wyliczona cena plisy (baza + doplaty za wymiary)
- Opcjonalnie (jesli doplata > 0): **"Doplata listwa: Y zl"**
- **"Razem: Z zl"** -- suma (cena rolety + doplata listwa)
- Jesli sa juz pozycje na liscie: **"Dotychczas w zamowieniu: Y zl (N pozycji)"**
- **Pole ilosci** (domyslnie 1)
- **Przycisk "Dodaj do zamowienia"** -- aktywny dopiero gdy konfiguracja kompletna (tkanina + kolor + montaz + wymiary + listwa)

**Uwaga:** NIE wyswietlaj osobnych "Cena bazowa", "Doplata za szerokosc", "Doplata za wysokosc" -- to sa wewnetrzne skladniki. Klient widzi tylko koncowa "Cene rolety".

### Zawartosc na liscie zamowienia

- Lista pozycji z cenami
- **Suma zamowienia: X zl**
- **Liczba jednostek Allegro: N**
- **Przycisk "Zamow przez Allegro"**

---

## Podsumowanie zamowienia i flow Allegro

### Ekran podsumowania (po kliknieciu "Zamow przez Allegro" na liscie)

Wyswietl modal lub osobna sekcje z:

1. **Numer zamowienia** -- format `#RE-XXXXX` (np. #RE-00142), generowany przez DB trigger
2. **Tabela WSZYSTKICH pozycji** -- kazda pozycja z parametrami (tkanina, kolor, montaz + system, wymiary, listwa, ilosc, cena)
3. **Suma zamowienia** -- np. "312,50 zl"
4. **Ilosc jednostek do kupienia na Allegro** -- duzy, wyrazny tekst
5. Jesli wiele pozycji: **"Kwota obejmuje wszystkie N pozycji z Twojego zamowienia"**
6. **Instrukcja krok po kroku** (ze screenshotami, wzor: konfigurator Stelge):
   > Aby dokonczyc zamowienie:
   >
   > 1. Kliknij przycisk ponizej -- przeniesie Cie na aukcje Allegro
   > 2. Wpisz ilosc: **N sztuk**
   > 3. W polu "Uwagi do zakupu" wpisz numer zamowienia: **#RE-00142**
   > 4. Oplac zamowienie przez Allegro
7. **Przycisk: "Przejdz do aukcji Allegro"** -- otwiera link w nowej karcie
8. **Informacja:** "Jedna sztuka na aukcji oznacza kwote X zlotych. Liczy sie koncowa kwota do zaplaty, nie cena za sztuke."

### Konfiguracja linku Allegro

Link do aukcji i cena jednostki musza byc **latwo konfigurowalne** (zmienne w kodzie):

```javascript
const ALLEGRO_LISTING_URL = "https://allegro.pl/oferta/...";
const ALLEGRO_UNIT_PRICE = 1; // cena jednej jednostki na aukcji (w zl)
```

---

## Materialy graficzne -- mapa zasobow

Wszystkie pliki w folderze `/stelge-assets/`. Sciezki relatywne do tego folderu.

### Struktura katalogow

```
stelge-assets/
  produkty/                    # Zdjecia produktowe per kolekcja/kolor
    {kolekcja}/                # standard, standard-termo, melange, melange-termo,
                               # dolomit, dolomit-termo, blackout, honeycomb
      {kolor}/
        packshot.png           # Render rolety -- montaz inwazyjny
        packshot-bezinwazyjny.png  # Render rolety -- montaz bezinwazyjny
        tkanina.jpg            # Probka/zblizenie tkaniny
        zblizenie.png          # Tylko honeycomb -- zblizenie struktury plastra
    dachowe/                   # Rolety dachowe -- poza scope V1
      ...
  montaz/                      # Instrukcje montazu
    {system}/                  # bezinwazyjny-wzmocniony, bezinwazyjny-klejony,
                               # inwazyjny-standard, inwazyjny-regulowany, inwazyjny-katowy
      opis.png                 # Schemat montazu
      pomiar.png               # Schemat pomiaru okna
      grafika-pomiarowa.png    # Szczegolowa grafika pomiarowa (jesli dostepna)
      zblizenie.webp           # Zblizenie uchwytu/mechanizmu (lub .png)
  prowadnice/                  # Zdjecia kolorow prowadnic/listew
    {kolor}.jpg                # Realne zdjecia profili (lub .webp)
  inne/                        # Inne zasoby
    baner-aranzacyjny.jpg
  content/
    produkty.json              # Opisy produktow, ceny, cechy
  manifest.json
  STRUKTURA.md
```

### Wzorce sciezek do obrazow

```javascript
// Packshot produktu (montaz inwazyjny)
`produkty/${kolekcja}/${kolor}/packshot.png`
// Packshot produktu (montaz bezinwazyjny)
`produkty/${kolekcja}/${kolor}/packshot-bezinwazyjny.png`
// Probka tkaniny (close-up)
`produkty/${kolekcja}/${kolor}/tkanina.jpg`
// Zblizenie struktury (honeycomb)
`produkty/${kolekcja}/${kolor}/zblizenie.png`
// Montaz -- instrukcja
`montaz/${typ_montazu}/opis.png`
// Montaz -- pomiar
`montaz/${typ_montazu}/pomiar.png`
// Montaz -- zblizenie
`montaz/${typ_montazu}/zblizenie.webp`
// Kolor prowadnicy/listwy
`prowadnice/${kolor_prowadnicy}.jpg`; // lub .webp
```

### Kolekcje produktowe -- pliki

| Kolekcja         | Folder                     | Kolory | Pliki per kolor                                              |
| ---------------- | -------------------------- | ------ | ------------------------------------------------------------ |
| Standard         | `produkty/standard/`       | 24     | `packshot.png`, `packshot-bezinwazyjny.png`, `tkanina.jpg`   |
| Standard + Termo | `produkty/standard-termo/` | 24     | `packshot.png`, `packshot-bezinwazyjny.png`, `tkanina.jpg`   |
| Melange          | `produkty/melange/`        | 7      | `packshot.png`, `packshot-bezinwazyjny.png`, `tkanina.jpg`   |
| Melange + Termo  | `produkty/melange-termo/`  | 7      | `packshot.png`, `packshot-bezinwazyjny.png`, `tkanina.jpg`   |
| Dolomit          | `produkty/dolomit/`        | 6      | `packshot.png`, `packshot-bezinwazyjny.png`, `tkanina.jpg`   |
| Dolomit + Termo  | `produkty/dolomit-termo/`  | 6      | `packshot.png`, `packshot-bezinwazyjny.png`, `tkanina.jpg`   |
| Blackout         | `produkty/blackout/`       | 8      | `packshot.png`, `packshot-bezinwazyjny.png`, `tkanina.jpg`   |
| Honeycomb        | `produkty/honeycomb/`      | 6      | `packshot.png`, `packshot-bezinwazyjny.png`, `zblizenie.png` |

### Systemy montazu -- pliki

| System             | Folder                            | Pliki                                                                                   |
| ------------------ | --------------------------------- | --------------------------------------------------------------------------------------- |
| Bezinw. wzmocniony | `montaz/bezinwazyjny-wzmocniony/` | `opis.png`, `pomiar.png`, `grafika-pomiarowa.png`, `zblizenie-1.png`, `zblizenie-2.png` |
| Bezinw. klejony    | `montaz/bezinwazyjny-klejony/`    | `opis.png`, `pomiar.png`, `zblizenie.webp`                                              |
| Inw. standard      | `montaz/inwazyjny-standard/`      | `opis.png`, `pomiar.png`, `zblizenie.webp`                                              |
| Inw. regulowany    | `montaz/inwazyjny-regulowany/`    | `opis.png`, `pomiar.png`, `zblizenie.webp`                                              |
| Inw. katowy        | `montaz/inwazyjny-katowy/`        | `opis.png`, `pomiar.png`, `zblizenie.webp`                                              |

### Prowadnice -- 14 kolorow

| Plik                            | Kolor           |
| ------------------------------- | --------------- |
| `prowadnice/biel.jpg`           | Bialy           |
| `prowadnice/krem.webp`          | Krem            |
| `prowadnice/braz.jpg`           | Braz            |
| `prowadnice/antracyt.jpg`       | Antracyt polmat |
| `prowadnice/czarny-lakier.webp` | Czarny          |
| `prowadnice/srebrny.jpg`        | Srebrny         |
| `prowadnice/szampanski.jpg`     | Szampanski      |
| `prowadnice/zloty-dab.jpg`      | Zloty dab       |
| `prowadnice/orzech.jpg`         | Orzech          |
| `prowadnice/dab-bagienny.jpg`   | Dab bagienny    |
| `prowadnice/mahon.jpg`          | Mahon           |
| `prowadnice/turner-oak.webp`    | Turner Oak      |
| `prowadnice/sosna.jpg`          | Sosna           |
| `prowadnice/winchester.jpg`     | Winchester      |

---

## Supabase -- schemat bazy danych

### Tabela `orders`

| Kolumna       | Typ             | Opis                                                    |
| ------------- | --------------- | ------------------------------------------------------- |
| id            | BIGINT IDENTITY | PK                                                      |
| order_number  | TEXT UNIQUE     | Format RE-XXXXX, generowany przez DB trigger + sequence |
| total_price   | DECIMAL         | Suma zamowienia (wszystkie pozycje)                     |
| allegro_units | INT             | Liczba jednostek Allegro                                |
| allegro_tx_id | TEXT NULL       | ID transakcji Allegro (na przyszlosc -- matchowanie)    |
| utm_source    | TEXT            | Zrodlo ruchu (ref param z URL)                          |
| created_at    | TIMESTAMPTZ     | DEFAULT now()                                           |

### Tabela `order_items`

| Kolumna       | Typ             | Opis                                               |
| ------------- | --------------- | -------------------------------------------------- |
| id            | BIGINT IDENTITY | PK                                                 |
| order_id      | BIGINT          | FK do orders.id                                    |
| position      | INT             | Numer pozycji w zamowieniu (1, 2, 3...)            |
| fabric_id     | TEXT            | ID tkaniny (np. "standard", "blackout")            |
| fabric_name   | TEXT            | Nazwa tkaniny (np. "Standard", "Blackout")         |
| color_id      | TEXT            | ID koloru (np. "biel", "grafit")                   |
| color_name    | TEXT            | Nazwa koloru (np. "Biel", "Grafit")                |
| mounting_id   | TEXT            | ID systemu montazu (np. "bezinwazyjny-wzmocniony") |
| mounting_name | TEXT            | Nazwa systemu (np. "Bezinwazyjny wzmocniony")      |
| mounting_type | TEXT            | Kategoria: "bezinwazyjny" lub "inwazyjny"          |
| width_mm      | INT             | Szerokosc w mm                                     |
| height_mm     | INT             | Wysokosc w mm                                      |
| rail_id       | TEXT            | ID koloru listwy (np. "bialy", "orzech")           |
| rail_name     | TEXT            | Nazwa koloru listwy (np. "Bialy", "Orzech")        |
| quantity      | INT             | Ilosc sztuk tej konfiguracji                       |
| unit_price    | DECIMAL         | Cena jednej plisy w tej konfiguracji               |

### Trigger i sequence

- Sequence `orders_seq` generuje kolejne numery
- Trigger `set_order_number` na INSERT do `orders` formatuje: `'RE-' || LPAD(nextval('orders_seq')::text, 5, '0')`
- Numer zamowienia zwracany do frontendu po INSERT

### RLS policies

- Public SELECT: lookup po order_number (aby klient mogl wyswietlic swoje zamowienie)
- Public INSERT: skladanie zamowienia (anon key)
- Index na order_number (B-tree) dla szybkiego lookup

---

## Elementy UI/UX

### Header (sticky)

- **Logo/nazwa:** "rolety.expert" (tekstowe, NIE logo Stelge)
- **Biezaca cena** po prawej stronie (aktualizuje sie na zywo)
- **Pasek postepu** (0-100%, 3 kroki)

### Nawigacja krokow

- Poziomy pasek z 3 przyciskami: Tkanina, Kolor, Konfiguracja
- Aktywny krok wyrozniony kolorem
- Ukonczone kroki z ikona ptaszka
- Cofanie do wczesniejszych krokow (klikajac w nawigacje)

### Interakcje

- Wybor opcji -- automatyczny smooth-scroll do nastepnego kroku (CSS scroll-behavior)
- Animacja pulsowania ceny przy kazdej zmianie
- Karty tkanin z efektem hover (uniesienie/cien)
- Probki kolorow z efektem hover (powiekszenie)
- Range slidery z customowym stylem
- Lightbox/modal po kliknieciu zdjecia listwy

### Responsywnosc

- **Mobile-first** -- pelna obsluga dotykowa
- Panel ceny sticky na dole (mobile) / prawy dolny rog (desktop)
- Siatki kart: 2 kolumny mobile -- 4 kolumny desktop
- Krok 3: podglad na gorze (mobile) / po lewej (desktop)

---

## Czego NIE zawiera aplikacja (ograniczenia zakresu)

- Brak rejestracji uzytkownikow
- Brak platnosci -- kupno odbywa sie wylacznie na Allegro
- Brak integracji API Allegro (matchowanie zamowien odroczone)
- Brak persystencji koszyka (localStorage) -- odswiezenie strony = utrata listy
- Brak rolet dachowych (folder `produkty/dachowe/` to materialy na przyszlosc)
- Brak panelu admina
- Brak Supabase Storage -- obrazy w repo
- Brak Edge Functions -- frontend insert + DB trigger

---

## Podsumowanie wymagan funkcjonalnych

1. **3-krokowa konfiguracja:** tkanina -- kolor -- konfiguracja (montaz + wymiary + listwa)
2. **Multi-plisa:** mozliwosc dodania wielu plis do jednego zamowienia z edycja, duplikacja, usuwaniem
3. **Kalkulacja ceny w czasie rzeczywistym** na podstawie tabel cenowych (Stelge -5%)
4. **Przeliczenie ceny na jednostki Allegro** (konfigurowalny ALLEGRO_UNIT_PRICE, zaokraglenie w gore)
5. **Generowanie numeru zamowienia** (#RE-XXXXX) przez DB trigger i podsumowania z instrukcja
6. **Przycisk-link do aukcji Allegro** (konfigurowalny URL)
7. **Podglad rolety** (packshot) w kroku 3, zmieniajacy sie dynamicznie przy zmianie montazu
8. **Grafiki montazowe** -- karuzela z opisami i schematami pomiaru przy wyborze systemu montazu
9. **Realne zdjecia listew** zamiast kwadratow hex, z powiększeniem po kliknieciu
10. **Walidacja:** max szerokosc 1200 mm dla montazu klejonego, zakresy wymiarow
11. **Pasek postepu** 3-krokowy i nawigacja miedzy krokami
12. **Sticky panel cenowy** z uproszczonym rozbiciem (cena rolety + doplata listwa = razem)
13. **Beforeunload warning** gdy lista plis niepusta i zamowienie niezlozone
14. **Responsywny design** mobile-first
15. **Branding rolety.expert** -- wlasne logo, bez elementow Stelge
16. **Supabase:** tabela orders + order_items (relacyjna), trigger + sequence, RLS
