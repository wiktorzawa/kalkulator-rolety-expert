# PROMPT: Konfigurator Rolet Plisowanych — rolety.expert

---

## Cel aplikacji

Stwórz **interaktywny konfigurator/kalkulator rolet plisowanych** dla firmy **rolety.expert**. Aplikacja jest narzędziem sprzedażowym wykorzystywanym na platformie **Allegro.pl** — klient trafia na konfigurator z linku w opisie aukcji Allegro, konfiguruje roletę, otrzymuje wyliczenie ceny i informację ile "jednostek" kupić na aukcji Allegro, a następnie wraca na Allegro, aby sfinalizować zakup.

**Aplikacja NIE jest sklepem internetowym** — nie obsługuje płatności ani koszyka e-commerce. Jej zadania:
1. Przeprowadzić klienta przez konfigurację rolety krok po kroku
2. Wyliczyć dokładną cenę na podstawie wybranych parametrów
3. Przeliczyć cenę na liczbę "jednostek Allegro" do zamówienia
4. Wygenerować podsumowanie z linkiem powrotnym do aukcji Allegro

---

## Źródła i referencje

Konfigurator wzorowany jest na narzędziu firmy **Stelge** — naszego dostawcy. Wszystkie materiały graficzne, dane produktowe i cenniki pochodzą z ich systemu. Nasza aplikacja ma działać identycznie pod względem logiki, ale pod marką **rolety.expert**, z własnymi cenami (**5% niższe** od cen Stelge) i nowoczesnym UI.

### Linki referencyjne — konfigurator Stelge (wzór):
- **Konfigurator Stelge:** https://konfigurator.stelge.com
- **Aukcja Allegro Stelge:** https://allegro.pl/oferta/rolety-plisowane-roleta-plisowana-plisy-na-wymiar-polski-producent-18428591712

### Linki referencyjne — konkurencja (Stylus.pl):
- **Kalkulator Stylus:** https://kalkulatorstylus.pl
- **Aukcja Allegro Stylus:** https://allegro.pl/oferta/roleta-plisowana-rolety-plisowane-plisy-konfigurator-na-wymiar-zaluzje-term-16881477376

### Folder z materiałami źródłowymi:
Wszystkie materiały graficzne i dane pobrane ze strony Stelge znajdują się w folderze:
```
/stelge-materialy/
```
Szczegółowy opis zawartości każdego podfolderu — poniżej w sekcji "Materiały graficzne".

### Arkusz cenowy źródłowy:
```
/stelge-materialy/STELGE_CENNIK_KONFIGURATOR.xlsx
```
Zawiera oryginalne ceny Stelge. **W naszej aplikacji wszystkie ceny muszą być o 5% niższe.**

---

## Kontekst: Jak działa sprzedaż rolet na Allegro

Allegro nie posiada natywnego konfiguratora produktów na wymiar. Sprzedawcy stosują obejście:

- **Aukcja Allegro** ma cenę za "1 jednostkę" (np. 1 zł za jednostkę)
- **Zewnętrzny konfigurator** (nasza aplikacja) oblicza cenę rolety i przelicza ją na liczbę jednostek do kupienia
- **Klient wraca na Allegro**, wpisuje obliczoną liczbę jednostek w pole "ilość", a numer zamówienia z konfiguratora wpisuje w pole "Uwagi do zakupu" (messageToSeller)
- **Sprzedawca** odczytuje numer zamówienia z Allegro, odnajduje konfigurację w swoim systemie i realizuje produkcję

### Przykład przepływu klienta:
1. Klient widzi aukcję Allegro "Rolety Plisowane Na Wymiar — Konfigurator" w cenie 1 zł/szt.
2. W opisie aukcji klika link do konfiguratora (nasza aplikacja)
3. Konfiguruje: Standard, Biel, Bezinwazyjny Wzmocniony, 800×1500mm, Listwa biała
4. Konfigurator wylicza cenę: **147,25 zł** → **148 jednostek** na Allegro
5. Klient klika "Przejdź do aukcji Allegro" → wraca na listing
6. Na Allegro wpisuje ilość: 148, w uwagach: numer zamówienia np. #RE-00142
7. Płaci 148 zł przez Allegro, sprzedawca realizuje zamówienie

---

## KROK 1: Wybór rodzaju tkaniny

Wyświetl siatkę kart (2 kolumny mobile, 4 kolumny desktop). Każda karta zawiera:
- **Miniaturę tkaniny** — zdjęcie produktowe z rolety na oknie (pliki `*-inwazyjne-BIEL-300x500.png` z odpowiedniego folderu tkaniny, patrz sekcja "Materiały graficzne")
- **Nazwę tkaniny**
- **Krótki opis**
- **Wskaźnik zaciemnienia** (1–5 kropek wypełnionych)
- **Wskaźnik termoizolacji** (1–5 kropek wypełnionych)

Po kliknięciu karty → zaznaczenie (ramka + badge z ptaszkiem) → automatyczny scroll do kroku 2.

### Dostępne tkaniny — parametry i ceny

Ceny poniżej to ceny Stelge. **W aplikacji stosuj ceny Stelge × 0,95 (minus 5%).**

| ID | Nazwa | Opis | Zaciemn. | Termo | Baza bezinw. (Stelge) | Baza bezinw. (nasza -5%) | Baza inwaz. (Stelge) | Baza inwaz. (nasza -5%) | Kategoria |
|---|---|---|---|---|---|---|---|---|---|
| standard | Standard | Gładka struktura tkaniny. 24 kolory. | 3/5 | 3/5 | 50 zł | 47,50 zł | 30 zł | 28,50 zł | Okienne |
| standard_termo | Standard + Termo | Gładka tkanina z powłoką termoizolacyjną. | 3/5 | 4/5 | 55 zł | 52,25 zł | 35 zł | 33,25 zł | Okienne |
| melange | Melange | Splot melanżowy, wysoka gramatura. 7 kolorów. | 4/5 | 4/5 | 55 zł | 52,25 zł | 35 zł | 33,25 zł | Okienne |
| melange_termo | Melange + Termo | Melanż z powłoką termo. Wysoka gramatura. | 4/5 | 5/5 | 60 zł | 57,00 zł | 40 zł | 38,00 zł | Okienne |
| dolomit | Dolomit | Naturalna, pozioma struktura wzoru. 6 kolorów. | 3/5 | 3/5 | 55 zł | 52,25 zł | 35 zł | 33,25 zł | Okienne |
| dolomit_termo | Dolomit + Termo | Dolomit z powłoką termoizolacyjną. | 3/5 | 4/5 | 60 zł | 57,00 zł | 40 zł | 38,00 zł | Okienne |
| blackout | Blackout | Pełne zaciemnienie. 8 kolorów. | 5/5 | 5/5 | 70 zł | 66,50 zł | 50 zł | 47,50 zł | Okienne |
| honeycomb | Honeycomb | Struktura plastra miodu, podwójna izolacja. | 5/5 | 5/5 | 70 zł | 66,50 zł | 50 zł | 47,50 zł | Okienne |

**Uwaga:** Różnica między ceną bezinwazyjną a inwazyjną to zawsze 20 zł (Stelge) / 19 zł (nasza -5%). Bezinwazyjny jest droższy, bo zawiera dodatkowe elementy montażowe (uchwyty klipsowe/klejone).

---

## KROK 2: Wybór koloru tkaniny

Wyświetl siatkę próbek kolorów (4 kolumny mobile, 6–8 desktop). Każda próbka:
- **Zdjęcie close-up tkaniny** (pliki `plisa-*.jpg` z folderu danej tkaniny) — jeśli dostępne
- Jeśli brak zdjęcia → **kwadrat z kolorem hex**
- **Nazwa koloru** pod próbką

Lista kolorów zależy od wybranej tkaniny. **Warianty "Termo" dziedziczą kolory z wersji bazowej** (np. Standard + Termo → kolory ze Standard, Melange + Termo → kolory z Melange).

Po kliknięciu koloru → zaznaczenie (ramka + powiększenie) → automatyczny scroll do kroku 3.

### Standard — 24 kolory (dziedziczone przez Standard + Termo)

| Kolor | Hex | Próbka close-up (plik) | Zdjęcie na oknie (plik) |
|---|---|---|---|
| Biel | #F5F3EE | `01-Standard/plisa-biala-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-BIEL-300x500.png` |
| Srebro | #C8C8C8 | `01-Standard/plisa-srebro-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-SREBRO-300x500.png` |
| Krem | #F0E6D0 | `01-Standard/plisa-krem-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-KREM-300x500.png` |
| Jasny beż | #E6D5BA | `01-Standard/plisa-jasny-bez-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-JASNY-BEZ-300x500.png` |
| Popiel | #A9A9A9 | `01-Standard/plisa-popiel-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-POPIEL-300x500.png` |
| Szary | #8A8A8A | `01-Standard/plisa-szary-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-SZARY-300x500.png` |
| Grafit | #4A4A4A | `01-Standard/plisa-grafit-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-GRAFIT-300x500.png` |
| Beż | #C9B99A | `01-Standard/plisa-bez-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-BEZ-300x500.png` |
| Czarny | #1A1A1A | `01-Standard/plisa-czern-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-CZARNY-300x500.png` |
| Cappucino | #A0785A | `01-Standard/plisa-cappucino-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-CAPPUCINO-300x500.png` |
| Brąz | #6B4226 | `01-Standard/plisa-braz-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-BRAZ-300x500.png` |
| Piasek | #D4C4A8 | `01-Standard/plisa-piasek-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-PIASEK-300x500.png` |
| Pudrowy róż | #E8C4C4 | `01-Standard/plisa-pudrowy-roz-300x500.jpg` | `01-Standard/STANDARD-inwazyjne-PUDROWY-ROZ-300x500.png` |
| Niebieski | #5B7FA5 | brak | brak |
| Jasny fiolet | #B09CC5 | brak | `02-Standard-Termo/STANDARDTERMO-inwazyjne-JASNY-FIOLET-300x500.png` |
| Jasna zieleń | #8FB88F | brak | brak |
| Pomarańcz | #E8873A | brak | brak |
| Żółty | #E8D44D | brak | brak |
| Fiolet | #7B5EA7 | brak | brak |
| Zieleń | #4A7A4A | brak | brak |
| Turkus | #4ABCC1 | brak | brak |
| Bordo | #7A1F3D | brak | brak |
| Czerwień | #C13B3B | brak | brak |
| Róż | #D4729E | brak | brak |

**Uwaga o Standard + Termo:** Folder `02-Standard-Termo/` zawiera dodatkowe zdjęcia produktowe (na oknie) z widoczną powłoką termo (srebrzysty rewers). Gdy klient wybierze Standard + Termo i kolor np. "Biel", użyj zdjęcia `STANDARDTERMO-inwazyjne-BIEL-300x500.png` z folderu `02-Standard-Termo/`. Próbki close-up (`plisa-*.jpg`) są te same co dla Standard, z wyjątkiem: `plisa-krem-termo-300x500.jpg` i `plisa-srebro-termo-300x500.jpg` — warianty z widoczną powłoką.

### Melange — 7 kolorów (dziedziczone przez Melange + Termo)

| Kolor | Hex | Próbka close-up (plik) | Zdjęcie na oknie (plik) |
|---|---|---|---|
| Nude | #D5C5B0 | `03-Melange-Termo/nude.-300x500.jpg` | `03-Melange-Termo/MELANGETERMO-inwazyjne-NUDE-300x500.png` |
| Popiel | #A0A0A0 | `03-Melange-Termo/popiel.-300x500.jpg` | `03-Melange-Termo/MELANGETERMO-inwazyjne-POPIEL-300x500.png` |
| Szary | #808080 | `03-Melange-Termo/szary.-300x500.jpg` | `03-Melange-Termo/MELANGETERMO-inwazyjne-SZARY-300x500.png` |
| Cappucino | #9B7B5A | `03-Melange-Termo/cappucino.-300x500.jpg` | `03-Melange-Termo/MELANGETERMO-inwazyjne-CAPPUCINO-300x500.png` |
| Grafit | #4A4A4A | `03-Melange-Termo/grafit.-300x500.jpg` | `03-Melange-Termo/MELANGETERMO-inwazyjne-GRAFIT-300x500.png` |
| Brąz | #5C3A1E | `03-Melange-Termo/braz.-300x500.jpg` | `03-Melange-Termo/MELANGETERMO-inwazyjne-BRAZ-300x500.png` |
| Denim | #4A6A8A | `03-Melange-Termo/denim.-300x500.jpg` | `03-Melange-Termo/MELANGETERMO-inwazyjne-DENIM-300x500.png` |

**Uwaga:** W folderze `stelge-materialy` istnieje tylko `03-Melange-Termo` (brak osobnego folderu Melange bez termo). Te same zdjęcia służą obu wariantom — Melange i Melange + Termo.

### Dolomit — 6 kolorów (dziedziczone przez Dolomit + Termo)

| Kolor | Hex | Próbka close-up (plik) | Zdjęcie na oknie (plik) |
|---|---|---|---|
| Szary | #8A8A8A | `04-Dolomit/szary-2-300x500.jpg` | `04-Dolomit/DOLOMIT-inwazyjne-SZARY-300x500.png` |
| Beż | #C9B99A | `04-Dolomit/bez-2-300x500.jpg` | `04-Dolomit/DOLOMIT-inwazyjne-BEZ-300x500.png` |
| Krem | #EDE4D0 | `04-Dolomit/krem-2-300x500.jpg` | `04-Dolomit/DOLOMIT-inwazyjne-KREM-300x500.png` |
| Grafit | #4A4A4A | `04-Dolomit/grafitt-300x500.jpg` | `04-Dolomit/DOLOMIT-inwazyjne-GRAFIT-300x500.png` |
| Mocca | #6B4A3A | `04-Dolomit/mocca-2-300x500.jpg` | `04-Dolomit/DOLOMIT-inwazyjne-MOCCA-300x500.png` |
| Srebro | #BDBDBD | `04-Dolomit/srebro-2-300x500.jpg` | `04-Dolomit/DOLOMIT-inwazyjne-SREBRO-300x500.png` |

**Uwaga o Dolomit + Termo:** Folder `05-Dolomit-Termo/` zawiera analogiczne zdjęcia z powłoką termo. Próbki close-up mają inne nazwy: `bez.-300x500.jpg`, `grafitt.-300x500.jpg`, `krem.-300x500.jpg`, `mocca.-300x500.jpg`, `srebro.-300x500.jpg`, `szary.-1-300x500.jpg`. Zdjęcia na oknie: `DOLOMITTERMO-inwazyjne-*.png`.

### Blackout — 8 kolorów

| Kolor | Hex | Próbka close-up (zbliżenie) | Zdjęcie na oknie |
|---|---|---|---|
| Biel | #F0EEEA | `06-Blackout/BLACKOUT-zblizenie-inwazyjne-BIEL-300x500.png` | `06-Blackout/BLACKOUT-inwazyjne-BIEL-300x500.png` |
| Srebro | #C0C0C0 | `06-Blackout/BLACKOUT-zblizenie-inwazyjne-SREBRO-300x500.png` | `06-Blackout/BLACKOUT-inwazyjne-SREBRO-300x500.png` |
| Szary | #808080 | `06-Blackout/BLACKOUT-zblizenie-inwazyjne-SZARY-300x500.png` | `06-Blackout/BLACKOUT-inwazyjne-SZARY-300x500.png` |
| Krem | #E8DCC8 | `06-Blackout/BLACKOUT-zblizenie-inwazyjne-KREM-300x500.png` | `06-Blackout/BLACKOUT-inwazyjne-KREM-300x500.png` |
| Grafit | #3E3E3E | `06-Blackout/BLACKOUT-zblizenie-inwazyjne-GRAFIT-300x500.png` | `06-Blackout/BLACKOUT-inwazyjne-GRAFIT-300x500.png` |
| Cappucino | #9B7B5A | `06-Blackout/BLACKOUT-zblizenie-inwazyjne-CAPPUCINO-300x500.png` | `06-Blackout/BLACKOUT-inwazyjne-CAPPUCINO-300x500.png` |
| Czarny | #1A1A1A | `06-Blackout/BLACKOUT-zblizenie-inwazyjne-CZARNY-300x500.png` | `06-Blackout/BLACKOUT-inwazyjne-CZERN-300x500.png` |
| Piasek | #D4C4A8 | `06-Blackout/BLACKOUT-zblizenie-inwazyjne-PIASEK-300x500.png` | `06-Blackout/BLACKOUT-inwazyjne-PIASEK-300x500.png` |

**Uwaga:** Blackout ma podwójny zestaw zdjęć — `BLACKOUT-inwazyjne-*` (widok całej rolety na oknie) i `BLACKOUT-zblizenie-inwazyjne-*` (zbliżenie na tkaninę). Zbliżenia użyj jako próbek kolorów.

### Honeycomb — 6 kolorów

| Kolor | Hex | Próbka close-up (zbliżenie) | Zdjęcie na oknie |
|---|---|---|---|
| Zimny beż | #D5CCBC | `07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-ZIMNY-BEZ-1-300x500.png` | `07-Honeycomb/HONEYCOMB-inwazyjne-ZIMNY-BEZ-1-300x500.png` |
| Ciepły beż | #CCBFA6 | `07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-ZIMNY-BEZ-300x500.png` | `07-Honeycomb/HONEYCOMB-inwazyjne-ZIMNY-BEZ-300x500.png` |
| Biel | #F0EDEA | `07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-BIEL-300x500.png` | `07-Honeycomb/HONEYCOMB-inwazyjne-BIEL-300x500.png` |
| Antracyt | #3A3A3A | `07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-ANTRACYT-300x500.png` | `07-Honeycomb/HONEYCOMB-inwazyjne-ANTRACYT-300x500.png` |
| Szary | #808080 | `07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-GRAFIT-300x500.png` | `07-Honeycomb/HONEYCOMB-inwazyjne-GRAFIT-300x500.png` |
| Cappucino | #9B7B5A | `07-Honeycomb/HONEYCOMB-zblizenie-bezinwazyjne-CAPPUCINO-300x500.png` | `07-Honeycomb/HONEYCOMB-inwazyjne-CAPPUCINO-300x500.png` |

**Uwaga:** Honeycomb ma zbliżenia z widokiem bezinwazyjnym (`zblizenie-bezinwazyjne-*`) pokazujące strukturę plastra miodu. Użyj ich jako próbek kolorów.

---

## KROK 3: Wybór typu montażu

Dwie główne kategorie wyświetlone jako duże karty z ikoną, opisem i zdjęciem poglądowym.

### Bezinwazyjny (bez wkręcania w okno)
- **Opis:** "Bez wkręcania w okno — idealny do wynajmowanych mieszkań. Montaż klejony lub skręcany na ramę."
- **Etykieta:** "Rekomendowany"
- **Grafika opisowa:** `18-Profile-Aluminiowe-Przekroje/Plisy-montaz-bezinwazyjny-wzmocniony-opis-NOWE.png` — pokazuje roletę na oknie + zbliżenia na uchwyty górny i dolny
- Po wyborze rozwijają się podsystemy:

#### Wzmocniony (skręcany)
- Montaż klipsowy na ramę okienną bez wiercenia w skrzydło
- Max szerokość: 1950 mm
- **Grafika opisowa montażu:** `18-Profile-Aluminiowe-Przekroje/Plisy-montaz-bezinwazyjny-wzmocniony-opis-NOWE.png`
- **Grafika pomiarowa (jak mierzyć okno):** `18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-bezinwazyjny-wzmocniony-nowa.png`
- **Zdjęcia profili (zbliżenia):**
  - Góra: `13-Uchwyty-Bezinwazyjny-Wzmocniony/bezinw-klejony-GORA-zblizenie-KOLO-300x300.webp`
  - Dół: `13-Uchwyty-Bezinwazyjny-Wzmocniony/bezinw-klejony-DOL-zblizenie-KOLO-300x300.webp`
  - Profil góra: `13-Uchwyty-Bezinwazyjny-Wzmocniony/MONTAZ-BEZINWAZYJNY-SKRECANY-gora-300x500.webp`
  - Profil dół: `13-Uchwyty-Bezinwazyjny-Wzmocniony/MONTAZ-BEZINWAZYJNY-SKRECANY-dol-300x500.webp`
- **Grafika pomiarowa szczegółowa:** `13-Uchwyty-Bezinwazyjny-Wzmocniony/Grafika-pomiarowa-BezInw_WZMOCNIONY.png` — zdjęcie okna z naniesionymi wymiarami (1=szerokość, 2=wysokość) i zbliżeniami na punkty pomiarowe
- **Instrukcje pomiarowe Stelge (miniaturki):**
  - `13-Uchwyty-Bezinwazyjny-Wzmocniony/Plisy-PomiarMontaz-bezinwazyjny-wzmocniony-1-1-300x300.png`
  - `13-Uchwyty-Bezinwazyjny-Wzmocniony/Plisy-PomiarMontaz-bezinwazyjny-wzmocniony-2-1-300x300.png`

#### Klejony
- Montaż klejony na ramę — **OGRANICZENIE: max szerokość 1200 mm** (wyświetl ostrzeżenie!)
- **Grafika opisowa:** `18-Profile-Aluminiowe-Przekroje/Plisy-montaz-bezinwazyjny-klejony-opis-NOWE.png`
- **Grafika pomiarowa:** `18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-bezinwazyjny-klejony-nowa.png`
- **Grafika pomiarowa szczegółowa:** `14-Uchwyty-Bezinwazyjny-Klejony/Grafika-pomiarowa-BezInw_KLEJONY.png`
- **Zdjęcia profili:**
  - Góra: `14-Uchwyty-Bezinwazyjny-Klejony/bezinwazyjny-klejony-gora-300x500.webp`
  - Dół: `14-Uchwyty-Bezinwazyjny-Klejony/bezinwazyjny-klejony-DOL-300x500.webp`

### Inwazyjny (wkręcany w ramę okienną)
- **Opis:** "Wkręcany w ramę okienną — najtrwalsze i najbardziej stabilne rozwiązanie."
- **Etykieta:** "Najtrwalszy"
- Po wyborze rozwijają się podsystemy:

#### Standard
- Podstawowy montaż wkręcany, wymaga min. 13 mm głębokości ramy
- Max szerokość: 1950 mm
- **Grafika opisowa:** `18-Profile-Aluminiowe-Przekroje/Plisy-montaz-inwazyjny-standard-opis-NOWE.png`
- **Grafika pomiarowa:** `18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-inwazyjny-standard-nowa-1.png`
- **Grafika pomiarowa szczegółowa:** `15-Uchwyty-Inwazyjny-Standard/Grafika-pomiarowa-Inw_STANDARD.png`
- **Zdjęcia profili (zbliżenia):**
  - Góra: `15-Uchwyty-Inwazyjny-Standard/inw-standard-GORA-zblizenie-KOLO-300x300.webp`
  - Dół: `15-Uchwyty-Inwazyjny-Standard/inw-standard-DOL-zblizenie-KOLO-300x300.webp`
  - Profil dół: `15-Uchwyty-Inwazyjny-Standard/inwazyjny-standard-DOL-300x500.webp`

#### Regulowany
- Z możliwością regulacji pozycji, dla zaokrąglonych profili ram
- Max szerokość: 1950 mm
- **Grafika opisowa:** `18-Profile-Aluminiowe-Przekroje/Plisy-montaz-inwazyjny-regulowany-opis-NOWE.png`
- **Grafika pomiarowa:** `18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-inwazyjny-regulowany-nowa-1.png`
- **Grafika pomiarowa szczegółowa:** `15-Uchwyty-Inwazyjny-Standard/Grafika-pomiarowa-Inw_REGULOWANY.png`
- **Zdjęcia profili (zbliżenia):**
  - Góra: `15-Uchwyty-Inwazyjny-Standard/inw-regulowany-GORA-zblizenie-KOLO-300x300.webp`
  - Dół: `15-Uchwyty-Inwazyjny-Standard/inw-regulowany-DOL-zblizenie-KOLO-300x300.webp`
  - Profil góra: `15-Uchwyty-Inwazyjny-Standard/inwazyjny-regulowany-GORA-300x500.webp`
  - Profil dół: `15-Uchwyty-Inwazyjny-Standard/inwazyjny-regulowany-DOL-300x500.webp`

#### Kątowy
- Montaż dla kątowych profili ram okiennych
- Max szerokość: 1950 mm
- **Grafika opisowa:** `18-Profile-Aluminiowe-Przekroje/Plisy-montaz-inwazyjny-katowy-opis-NOWE.png`
- **Grafika pomiarowa:** `18-Profile-Aluminiowe-Przekroje/Pomiar-Montaz-inwazyjny-katowy-nowa-1.png`
- **Grafika pomiarowa szczegółowa:** `16-Uchwyty-Inwazyjny-Katowy-Dachowy/Grafika-pomiarowa-Inw_KATOWY.png`
- **Zdjęcia profili (zbliżenia):**
  - Góra: `16-Uchwyty-Inwazyjny-Katowy-Dachowy/inwazyjny-katowy-GORA-zblizenie-KOLO-300x300.webp`
  - Dół: `16-Uchwyty-Inwazyjny-Katowy-Dachowy/inwazyjny-katowy-DOL-zblizenie-KOLO-300x300.webp`
  - Profil góra: `16-Uchwyty-Inwazyjny-Katowy-Dachowy/inwazyjny-katowy-GORA-300x500.webp`
  - Profil dół: `16-Uchwyty-Inwazyjny-Katowy-Dachowy/inwazyjny-katowy-DOL-300x500.webp`

**Systemy montażu nie mają dopłat** — wszystkie kosztują 0 zł. Wpływają wyłącznie na cenę bazową (bezinwazyjny/inwazyjny).

Po wyborze montażu → automatyczny scroll do kroku 4.

---

## KROK 4: Podanie wymiarów

Dwa panele obok siebie (desktop) lub pod sobą (mobile):

### Szerokość
- Suwak (range input) + pole numeryczne (input number)
- **Zakres:** 150–1950 mm, krok: 10 mm
- **Przyciski szybkiego wyboru:** 500, 600, 700, 800, 900, 1000, 1200 mm
- **Walidacja:** Przy montażu klejoym → max 1200 mm (wyświetl ostrzeżenie, zablokuj wyższe wartości)

### Wysokość
- Suwak (range input) + pole numeryczne (input number)
- **Zakres:** 150–2800 mm, krok: 10 mm
- **Przyciski szybkiego wyboru:** 800, 1000, 1200, 1400, 1500, 1800, 2000 mm

### Podgląd wymiarów
- Prostokąt wizualny skalowany proporcjonalnie do podanych wymiarów
- Wyświetla etykietę "szerokość × wysokość mm"
- Linie poziome symulujące fałdy plisowania

Domyślne wartości: 600×1500 mm. Po interakcji z suwakami → automatyczny scroll do kroku 5.

---

## KROK 5: Kolor listwy aluminiowej

Siatka kart (2 kolumny mobile, 4–5 desktop). Każda karta:
- **Próbka koloru** (kwadrat z kolorem hex)
- **Nazwa koloru**
- **Typ wykończenia** (lakier / anodowany / okleina)
- **Dopłata** (jeśli > 0 zł) — wyraźnie widoczna

### Kolory listew — dane (ceny Stelge → nasze -5%)

| Kolor | Typ wykończenia | Dopłata Stelge | Dopłata nasza (-5%) | Hex |
|---|---|---|---|---|
| Biały | lakier | 0 zł | 0 zł | #FFFFFF |
| Krem | lakier | 0 zł | 0 zł | #F0E6D0 |
| Brąz | lakier | 0 zł | 0 zł | #5C3A1E |
| Antracyt półmat | lakier | 0 zł | 0 zł | #3A3A3A |
| Czarny | lakier | 0 zł | 0 zł | #1A1A1A |
| Srebrny | anodowany | 5 zł | 4,75 zł | #C0C0C0 |
| Szampański | anodowany | 5 zł | 4,75 zł | #D4C5A9 |
| Złoty dąb | okleina | 10 zł | 9,50 zł | #B8863B |
| Orzech | okleina | 10 zł | 9,50 zł | #6B4226 |
| Dąb bagienny | okleina | 10 zł | 9,50 zł | #4A3828 |
| Mahoń | okleina | 10 zł | 9,50 zł | #7A2E1A |
| Turner Oak | okleina | 10 zł | 9,50 zł | #A08060 |
| Sosna | okleina | 10 zł | 9,50 zł | #C4A87A |
| Winchester | okleina | 10 zł | 9,50 zł | #8B5A2B |

---

## Kalkulacja ceny

### Wzór

```
CENA = cena_bazowa(tkanina, typ_montażu) + dopłata_szerokość(szer_cm) + dopłata_wysokość(wys_cm) + dopłata_listwa
```

Wszystkie ceny = **ceny Stelge × 0,95** (zaokrąglone do 0,25 zł).

### Przeliczenie wymiarów na cenniki

1. **Szerokość:** zamień mm na cm (zaokrąglij w górę), potem zaokrąglij do najbliższej wielokrotności 5 cm w górę.
   - Przykład: 623 mm → 63 cm → **65 cm**
   - Przykład: 800 mm → 80 cm → **80 cm**
2. **Wysokość:** zamień mm na cm (zaokrąglij w górę), potem przypisz do progu: ≤150 cm / ≤230 cm / ≤280 cm.
   - Przykład: 1500 mm → 150 cm → próg **do 150 cm**
   - Przykład: 1510 mm → 151 cm → próg **do 230 cm**

### Cennik dopłat za szerokość

Ceny oryginalne Stelge (źródło: arkusz `STELGE_CENNIK_KONFIGURATOR.xlsx`) i nasze (-5%):

| Szer. (cm) | Stelge | Nasza (-5%) | | Szer. (cm) | Stelge | Nasza (-5%) |
|---|---|---|---|---|---|---|
| 15 | 30 | 28,50 | | 105 | 105 | 99,75 |
| 20 | 30 | 28,50 | | 110 | 110 | 104,50 |
| 25 | 30 | 28,50 | | 115 | 115 | 109,25 |
| 30 | 30 | 28,50 | | 120 | 120 | 114,00 |
| 35 | 35 | 33,25 | | **125** | **170** | **161,50** |
| 40 | 40 | 38,00 | | 130 | 175 | 166,25 |
| 45 | 45 | 42,75 | | 135 | 180 | 171,00 |
| 50 | 50 | 47,50 | | 140 | 185 | 175,75 |
| 55 | 55 | 52,25 | | 145 | 190 | 180,50 |
| 60 | 60 | 57,00 | | 150 | 195 | 185,25 |
| 65 | 65 | 61,75 | | 155 | 200 | 190,00 |
| 70 | 70 | 66,50 | | 160 | 205 | 194,75 |
| 75 | 75 | 71,25 | | 165 | 210 | 199,50 |
| 80 | 80 | 76,00 | | 170 | 215 | 204,25 |
| 85 | 85 | 80,75 | | 175 | 220 | 209,00 |
| 90 | 90 | 85,50 | | 180 | 225 | 213,75 |
| 95 | 95 | 90,25 | | 185 | 230 | 218,50 |
| 100 | 100 | 95,00 | | 190 | 235 | 223,25 |
| | | | | 195 | 240 | 228,00 |

**UWAGA — SKOK CENY przy 125 cm:** Dopłata Stelge skacze ze 120 zł (przy 120 cm) do 170 zł (przy 125 cm) — wzrost o 50 zł. To wynika z tego, że szersze rolety wymagają wzmocnionej konstrukcji. Nasza cena: skok ze 114 zł do 161,50 zł.

### Cennik dopłat za wysokość

| Próg wysokości | Stelge | Nasza (-5%) |
|---|---|---|
| do 150 cm (150–1500 mm) | 55 zł | 52,25 zł |
| do 230 cm (1501–2300 mm) | 70 zł | 66,50 zł |
| do 280 cm (2301–2800 mm) | 100 zł | 95,00 zł |

### Przykłady kalkulacji (weryfikacja poprawności)

Z arkusza Stelge (ceny Stelge):

| Tkanina | Montaż | Szer. | Wys. | Listwa | Składniki (Stelge) | Stelge | Nasza (-5%) |
|---|---|---|---|---|---|---|---|
| Standard | Inwazyjny | 60 cm | 150 cm | Biały-lakier | 30+60+55+0 | 145 zł | 137,75 zł |
| Standard | Bezinwazyjny | 60 cm | 150 cm | Biały-lakier | 50+60+55+0 | 165 zł | 156,75 zł |
| Standard | Inwazyjny | 100 cm | 150 cm | Biały-lakier | 30+100+55+0 | 185 zł | 175,75 zł |
| Standard | Inwazyjny | 100 cm | 230 cm | Biały-lakier | 30+100+70+0 | 200 zł | 190,00 zł |
| Standard+Termo | Inwazyjny | 80 cm | 150 cm | Srebrny-anod. | 35+80+55+5 | 175 zł | 166,25 zł |
| Blackout | Inwazyjny | 120 cm | 230 cm | Biały-lakier | 50+120+70+0 | 240 zł | 228,00 zł |
| Blackout | Inwazyjny | 130 cm | 230 cm | Biały-lakier | 50+175+70+0 | 295 zł | 280,25 zł |
| Honeycomb | Bezinwazyjny | 90 cm | 280 cm | Orzech-okl. | 70+90+100+10 | 270 zł | 256,50 zł |

---

## Przeliczenie na jednostki Allegro

### Zasada
Na aukcji Allegro 1 jednostka = 1 zł. Konfigurator przelicza cenę na liczbę jednostek:

```
liczba_jednostek = Math.ceil(cena_łączna)
```

Przykład: cena 175,75 zł → **176 jednostek** do kupienia na Allegro.

### Wyświetlanie dla klienta
Dla dużych zamówień wyświetlaj rozbicie na pakiety (wzór z kalkulatora Stylus):
```
23 jednostki   → "23 jednostki"
176 jednostek  → "17× pakiet 10 jednostek + 6 jednostek"
```

---

## Podsumowanie zamówienia i flow Allegro

### Sticky panel cenowy (widoczny od kroku 2)
- **Mobile:** przypięty na dole ekranu
- **Desktop:** panel w prawym dolnym rogu
- Zawiera:
  - Etykiety wybranych opcji (tkanina, kolor, montaż, wymiary)
  - Rozbicie cenowe (rozwijane) — baza, dopłata szer., dopłata wys., listwa
  - **Cena łączna** (duży, wyraźny tekst)
  - Przycisk **"Zamów przez Allegro"** — aktywny dopiero gdy konfiguracja kompletna

### Ekran podsumowania (po kliknięciu "Zamów przez Allegro")

Wyświetl modal lub osobną sekcję z:

1. **Numer zamówienia** — format `#RE-XXXXX` (np. #RE-00142), generowany losowo
2. **Tabela konfiguracji** — wszystkie wybrane parametry (tkanina, kolor, montaż + system, wymiary, listwa)
3. **Kwota zamówienia** — np. "175,75 zł"
4. **Ilość jednostek do kupienia na Allegro** — duży, wyraźny tekst, np. **"176 jednostek"**
5. **Instrukcja krok po kroku:**
   > Aby dokończyć zamówienie:
   > 1. Kliknij przycisk poniżej — przeniesie Cię na aukcję Allegro
   > 2. Wpisz ilość: **176 sztuk**
   > 3. W polu "Uwagi do zakupu" wpisz numer zamówienia: **#RE-00142**
   > 4. Opłać zamówienie przez Allegro
6. **Przycisk: "Przejdź do aukcji Allegro →"** — otwiera link w nowej karcie
7. **Informacja:** "Cena jednostki na aukcji Allegro nie odpowiada cenie rolety — liczy się końcowa kwota do zapłaty."

### Konfiguracja linku Allegro
Link do aukcji musi być **łatwo konfigurowalny** (zmienna w kodzie):
```javascript
const ALLEGRO_LISTING_URL = 'https://allegro.pl/oferta/...';
```

---

## Materiały graficzne — pełna mapa zasobów

Wszystkie pliki w folderze `/stelge-materialy/`. Ścieżki relatywne do tego folderu.

### Foldery 01–07: Zdjęcia produktowe tkanin (okienne)

Każdy folder zawiera dwa typy zdjęć w rozdzielczości 300×500px:
- **Zdjęcia na oknie** (`NAZWA-inwazyjne-KOLOR-300x500.png`) — roleta zainstalowana na białym oknie PCV, widok perspektywiczny. **Użycie:** miniatura w kroku 1 (wybór tkaniny) i podgląd w kroku 2 po wybraniu koloru.
- **Próbki close-up** (`plisa-kolor-300x500.jpg` lub `NAZWA-zblizenie-*`) — zbliżenie na tkaninę pokazujące strukturę materiału. **Użycie:** próbki kolorów w kroku 2.

| Folder | Tkanina | Pliki na oknie | Pliki próbek | Ilość kolorów |
|---|---|---|---|---|
| `01-Standard/` | Standard | `STANDARD-inwazyjne-*.png` (13) | `plisa-*.jpg` (13) | 13 z foto + 11 tylko hex |
| `02-Standard-Termo/` | Standard + Termo | `STANDARDTERMO-inwazyjne-*.png` (14) | `plisa-*.jpg` (12) | 14 z foto |
| `03-Melange-Termo/` | Melange / Melange+Termo | `MELANGETERMO-inwazyjne-*.png` (7) | `*.jpg` (7) | 7 |
| `04-Dolomit/` | Dolomit | `DOLOMIT-inwazyjne-*.png` (6) | `*-300x500.jpg` (6) | 6 |
| `05-Dolomit-Termo/` | Dolomit + Termo | `DOLOMITTERMO-inwazyjne-*.png` (6) | `*.jpg` (6) | 6 |
| `06-Blackout/` | Blackout | `BLACKOUT-inwazyjne-*.png` (8) | `BLACKOUT-zblizenie-*.png` (8) | 8 |
| `07-Honeycomb/` | Honeycomb | `HONEYCOMB-inwazyjne-*.png` (6) | `HONEYCOMB-zblizenie-*.png` (6) | 6 |

### Foldery 08–12: Zdjęcia produktowe tkanin (dachowe)

Rolety dachowe — **nie są częścią obecnego konfiguratora okiennego**, ale materiały są dostępne na przyszłość.

| Folder | Tkanina dachowa | Ilość plików |
|---|---|---|
| `08-Dachowe-Standard-Termo/` | Dachowe Standard + Termo | 26 (13 kolorów × 2 ujęcia) |
| `09-Dachowe-Melange-Termo/` | Dachowe Melange + Termo | 14 (7 × 2) |
| `10-Dachowe-Dolomit-Termo/` | Dachowe Dolomit + Termo | 12 (6 × 2) |
| `11-Dachowe-Honeycomb/` | Dachowe Honeycomb | 12 (6 × 2) |
| `12-Dachowe-Blackout/` | Dachowe Blackout | 8 |

### Foldery 13–16: Uchwyty i profile montażowe

Zdjęcia uchwytów montażowych — zbliżenia na elementy góra/dół + grafiki pomiarowe ze schematem pomiaru okna.

| Folder | System montażu | Zawartość |
|---|---|---|
| `13-Uchwyty-Bezinwazyjny-Wzmocniony/` | Bezinw. wzmocniony | 7 plików: uchwyty góra/dół (.webp), grafika pomiarowa, instrukcje pomiaru |
| `14-Uchwyty-Bezinwazyjny-Klejony/` | Bezinw. klejony | 3 pliki: uchwyty góra/dół (.webp), grafika pomiarowa |
| `15-Uchwyty-Inwazyjny-Standard/` | Inw. standard + regulowany | 9 plików: uchwyty dla obu systemów, grafiki pomiarowe |
| `16-Uchwyty-Inwazyjny-Katowy-Dachowy/` | Inw. kątowy + dachowy | 8 plików: uchwyty + grafiki pomiarowe (kątowy i dachowy) |

### Folder 17: Grafiki ogólne

| Plik | Opis | Użycie |
|---|---|---|
| `logo_stelge.svg` | Logo Stelge | NIE UŻYWAĆ — zastąpić logiem rolety.expert |
| `Group-34.png` | Banner z miarką budowlaną (panoramiczny) | Opcjonalnie jako tło sekcji hero |
| `zdjecie-w-tle-dociete-v5-miarka-budowlana.png` | Zdjęcie miarki budowlanej | Opcjonalnie jako tło kroku wymiarów |
| `1-Miniaturka_1.webp` | Miniatura (roletka okienna) | Miniatura produktu |

### Folder 18: Profile aluminiowe — przekroje i opisy montażu

Kluczowe grafiki do wyświetlenia w kroku 3 (montaż). Każdy system montażu ma:
- **`Plisy-montaz-*-opis-NOWE.png`** — infografika: roleta na oknie + zbliżenia na mocowania (góra + dół)
- **`Pomiar-Montaz-*-nowa*.png`** — infografika: okno z naniesionymi liniami pomiarowymi (1=szer., 2=wys.) i zbliżeniami na punkty pomiarowe

| System | Grafika opisowa | Grafika pomiarowa |
|---|---|---|
| Bezinw. wzmocniony | `Plisy-montaz-bezinwazyjny-wzmocniony-opis-NOWE.png` | `Pomiar-Montaz-bezinwazyjny-wzmocniony-nowa.png` |
| Bezinw. klejony | `Plisy-montaz-bezinwazyjny-klejony-opis-NOWE.png` | `Pomiar-Montaz-bezinwazyjny-klejony-nowa.png` |
| Inw. standard | `Plisy-montaz-inwazyjny-standard-opis-NOWE.png` | `Pomiar-Montaz-inwazyjny-standard-nowa-1.png` |
| Inw. regulowany | `Plisy-montaz-inwazyjny-regulowany-opis-NOWE.png` | `Pomiar-Montaz-inwazyjny-regulowany-nowa-1.png` |
| Inw. kątowy | `Plisy-montaz-inwazyjny-katowy-opis-NOWE.png` | `Pomiar-Montaz-inwazyjny-katowy-nowa-1.png` |

### Folder 19: Wzorniki kolorów

Grafiki pokazujące pełną paletę kolorów danej kolekcji w formie siatki próbek:

| Plik | Opis |
|---|---|
| `KOLORY-STANDARDTERMO.png` | Pełna paleta 24 kolorów Standard/Termo — siatka miniatur ze zbliżeniami tkaniny i podpisami |
| `KOLORY-DOLOMIT.png` | Paleta 6 kolorów Dolomit |
| `KOLORY-MELANGETERMO.png` | Paleta 7 kolorów Melange |
| `Wzornik-StandardTermo.png` | Kompaktowy wzornik (mniejsze miniatury) |
| `Wzornik-Dolomit.png` | Kompaktowy wzornik Dolomit |
| `Wzornik-MelangeTermo.png` | Kompaktowy wzornik Melange |

### Folder 20: Zdjęcia aranżacyjne (lifestyle)

Zdjęcia rolet w aranżacjach wnętrz — mogą być użyte jako galeria, tło lub element marketingowy:

| Plik | Tkanina | Opis |
|---|---|---|
| `Standard-2-1.png` | Standard | Zbliżenie na mechanizm rolety plisowanej |
| `Standard-3.png` | Standard | Roleta na oknie w aranżacji |
| `Standardtermo-1-1.png` | Standard Termo | Roleta w aranżacji wnętrza |
| `Standardtermo-4.png` | Standard Termo | Roleta na oknie |
| `Dolomit-1.png` do `Dolomit-4.png` | Dolomit | 4 zdjęcia aranżacyjne |
| `Melangetermo-1.png`, `Melangetermo-4.png` | Melange Termo | 2 zdjęcia aranżacyjne |
| `Melange-2.png`, `Melange-3.png` | Melange | 2 zdjęcia aranżacyjne |

### Folder 21: Certyfikaty

| Plik | Opis |
|---|---|
| `3f0adc3e47a28ab582e8e7d48fdf.jpg` | Logo certyfikatów OEKO-TEX + PZH (Narodowy Instytut Zdrowia Publicznego) — sygnał zaufania |

---

## Elementy UI/UX

### Header (sticky)
- **Logo/nazwa:** "rolety.expert" (tekstowe, NIE logo Stelge)
- **Bieżąca cena** po prawej stronie (aktualizuje się na żywo)
- **Pasek postępu** (0–100%, 5 kroków × 20%)

### Nawigacja kroków
- Poziomy pasek z 5 przyciskami: Tkanina, Kolor, Montaż, Wymiary, Listwa
- Aktywny krok wyróżniony kolorem
- Ukończone kroki z ikoną ptaszka
- Cofanie do wcześniejszych kroków (klikając w nawigację)

### Interakcje
- Wybór opcji → automatyczny smooth-scroll do następnego kroku
- Animacja pulsowania ceny przy każdej zmianie
- Karty tkanin z efektem hover (uniesienie/cień)
- Próbki kolorów z efektem hover (powiększenie)
- Range slidery z customowym stylem

### Responsywność
- **Mobile-first** — pełna obsługa dotykowa
- Panel ceny sticky na dole (mobile) / prawy dolny róg (desktop)
- Siatki kart: 2 kolumny mobile → 4 kolumny desktop

---

## Czego NIE zawiera aplikacja (ograniczenia zakresu)

- Brak backendu / bazy danych — wszystko client-side
- Brak rejestracji użytkowników
- Brak płatności — kupno odbywa się wyłącznie na Allegro
- Brak koszyka e-commerce — konfiguracja jednej rolety na raz
- Brak API Allegro — integracja wyłącznie przez linki URL
- Brak rolet dachowych (foldery 08–12 to materiały na przyszłość)
- Numer zamówienia generowany lokalnie (localStorage) — w przyszłości backend

---

## Podsumowanie wymagań funkcjonalnych

1. **5-krokowa konfiguracja:** tkanina → kolor → montaż → wymiary → listwa
2. **Kalkulacja ceny w czasie rzeczywistym** na podstawie tabel cenowych (Stelge -5%)
3. **Przeliczenie ceny na jednostki Allegro** (1 jednostka = 1 zł, zaokrąglenie w górę)
4. **Generowanie numeru zamówienia** (#RE-XXXXX) i podsumowania z instrukcją
5. **Przycisk-link do aukcji Allegro** (konfigurowalny URL)
6. **Grafiki montażowe** — wyświetlanie opisów i schematów pomiaru przy wyborze systemu montażu
7. **Walidacja:** max szerokość 1200 mm dla montażu klejonego, zakresy wymiarów
8. **Pasek postępu** i nawigacja między krokami
9. **Sticky podsumowanie** z bieżącą ceną i rozbiciem
10. **Responsywny design** mobile-first
11. **Branding rolety.expert** — własne logo, bez elementów Stelge
