# Stelge Assets — Struktura i dokumentacja

## Przegląd

Katalog zawiera zasoby (obrazy i treści) wyeksportowane z konfiguratora rolet plisowanych Stelge (konfigurator.stelge.com). Zasoby są zorganizowane w strukturę umożliwiającą łatwe mapowanie do dowolnej aplikacji e-commerce / konfiguratora.

## Struktura katalogów

```
stelge-assets/
├── produkty/                    # Zdjęcia produktowe per kolekcja/kolor
│   ├── melange/                 # Kolekcja Melange
│   │   ├── grafit/
│   │   │   ├── packshot.png              # Render rolety — montaż inwazyjny
│   │   │   ├── packshot-bezinwazyjny.png # Render rolety — montaż bezinwazyjny
│   │   │   └── tkanina.jpg               # Próbka/zbliżenie tkaniny
│   │   ├── szary/
│   │   └── ...
│   ├── standard/                # Kolekcja Standard
│   ├── standard-termo/          # Kolekcja Standard + Termoizolacja
│   ├── dolomit/                 # Kolekcja Dolomit
│   ├── dolomit-termo/           # Kolekcja Dolomit + Termoizolacja
│   ├── blackout/                # Kolekcja Blackout (zaciemniające)
│   ├── honeycomb/               # Kolekcja Honeycomb (plaster miodu)
│   │   └── {kolor}/
│   │       ├── packshot.png
│   │       └── zblizenie.png    # Zbliżenie struktury plastra
│   └── dachowe/                 # Rolety dachowe
│       ├── standard-termo/
│       │   └── {kolor}/
│       │       ├── widok-1.png  # Widok z przodu
│       │       └── widok-2.png  # Widok z boku / inny kąt
│       ├── melange-termo/
│       ├── dolomit-termo/
│       ├── blackout/
│       └── honeycomb/
│
├── montaz/                      # Instrukcje montażu (wspólne dla wszystkich produktów)
│   ├── bezinwazyjny-wzmocniony/
│   │   ├── opis.png             # Schemat montażu (instrukcja)
│   │   ├── pomiar.png           # Schemat wykonania pomiaru
│   │   └── zblizenie.webp       # Zbliżenie uchwytu montażowego
│   ├── bezinwazyjny-klejony/
│   ├── inwazyjny-standard/
│   ├── inwazyjny-regulowany/
│   ├── inwazyjny-katowy/
│   └── dachowy/                 # Montaż rolet dachowych (1 typ)
│
├── prowadnice/                  # Miniaturki kolorów prowadnic
│   ├── biel.jpg
│   ├── krem.webp
│   ├── braz.jpg
│   └── ... (13 kolorów)
│
├── inne/                        # Inne zasoby
│   └── baner-aranzacyjny.jpg    # Zdjęcie aranżacyjne
│
├── content/                     # Treści tekstowe
│   └── produkty.json            # Opisy produktów, ceny, cechy, kolekcje
│
├── manifest.json                # Manifest pobranych plików (URL → ścieżka lokalna)
└── STRUKTURA.md                 # Ten plik
```

## Kolekcje produktów

| Kolekcja | Folder | Kolory | Opis |
|----------|--------|--------|------|
| Melange | `produkty/melange/` | ~7 | Tkanina melanżowa, efekt przetykanej nitki |
| Standard | `produkty/standard/` | ~24 | Podstawowa tkanina, szeroka paleta kolorów |
| Standard + Termo | `produkty/standard-termo/` | ~24 | Standard z warstwą termoizolacyjną |
| Dolomit | `produkty/dolomit/` | ~6 | Tkanina dolomit, matowa struktura |
| Dolomit + Termo | `produkty/dolomit-termo/` | ~6 | Dolomit z termoizolacją |
| Blackout | `produkty/blackout/` | ~8 | Tkanina zaciemniająca 100% |
| Honeycomb | `produkty/honeycomb/` | ~6 | Struktura plastra miodu, dodatkowa izolacja |
| Dachowe | `produkty/dachowe/` | różne | Warianty do okien dachowych |

## Typy montażu

| ID | Nazwa | Dostępność |
|----|-------|-----------|
| `bezinwazyjny-wzmocniony` | Bezinwazyjny wzmocniony | Rolety standardowe |
| `bezinwazyjny-klejony` | Bezinwazyjny klejony | Rolety standardowe |
| `inwazyjny-standard` | Inwazyjny standardowy | Rolety standardowe |
| `inwazyjny-regulowany` | Inwazyjny regulowany | Rolety standardowe |
| `inwazyjny-katowy` | Inwazyjny kątowy | Rolety standardowe |
| `dachowy` | Montaż dachowy | Tylko rolety dachowe |

Każdy typ montażu ma 3 pliki:
- `opis.png` — schemat montażu krok po kroku
- `pomiar.png` — instrukcja jak wykonać pomiar okna
- `zblizenie.webp/.png` — zbliżenie uchwytu/mechanizmu

## Kolory prowadnic

13 dostępnych kolorów prowadnic (wspólne dla wszystkich produktów):

| Plik | Kolor |
|------|-------|
| `biel.jpg` | Biel |
| `krem.webp` | Krem |
| `braz.jpg` | Brąz |
| `antracyt.jpg` | Antracyt |
| `czarny-lakier.webp` | Czarny lakier |
| `srebrny.jpg` | Srebrny |
| `szampanski.jpg` | Szampański |
| `zloty-dab.jpg` | Złoty dąb |
| `orzech.jpg` | Orzech |
| `dab-bagienny.jpg` | Dąb bagienny |
| `mahon.jpg` | Mahon |
| `sosna.jpg` | Sosna |
| `winchester.jpg` | Winchester |
| `turner-oak.webp` | Turner oak |

## Mapowanie na aplikację

### Model danych produktu

```
Produkt
├── kolekcja: string (melange, standard, ...)
├── kolor: string (grafit, szary, ...)
├── nazwa: string
├── cena_od: number
├── cena_do: number
├── cechy: { zaciemnienie: string, termoizolacja: string }
├── opis: string
├── obrazy:
│   ├── packshot: "produkty/{kolekcja}/{kolor}/packshot.png"
│   ├── tkanina: "produkty/{kolekcja}/{kolor}/tkanina.jpg"
│   └── zblizenie?: "produkty/{kolekcja}/{kolor}/zblizenie.png"  (honeycomb)
├── dostepne_montaze: MontazType[]
└── dostepne_prowadnice: Prowadnica[]
```

### Relacje

```
Produkt ←→ Montaż:      many-to-many (każdy produkt może mieć wiele typów montażu)
Produkt ←→ Prowadnica:   many-to-many (wszystkie produkty mają te same prowadnice)
Kolekcja → Produkt:      one-to-many
```

### Ścieżki do obrazów (wzorce)

```javascript
// Packshot produktu
`produkty/${kolekcja}/${kolor}/packshot.png`

// Próbka tkaniny
`produkty/${kolekcja}/${kolor}/tkanina.jpg`

// Montaż — instrukcja
`montaz/${typ_montazu}/opis.png`

// Montaż — pomiar
`montaz/${typ_montazu}/pomiar.png`

// Montaż — zbliżenie
`montaz/${typ_montazu}/zblizenie.webp`

// Kolor prowadnicy
`prowadnice/${kolor_prowadnicy}.jpg`
```

## Źródło danych

Dane wyeksportowane z: `https://konfigurator.stelge.com`
Stack technologiczny źródła: WordPress + WooCommerce, jQuery, Bootstrap, LiteSpeed
Data eksportu: 2026-04-09
Przeanalizowanych stron: 386
Znalezionych obrazów: 27 446 (w tym warianty rozmiaru)
Unikalne obrazy produktowe: ~300

## content/produkty.json

Plik zawiera ustrukturyzowane treści tekstowe:
- Opisy kolekcji
- Opisy produktów (per kolor)
- Ceny (od–do)
- Cechy produktów (zaciemnienie, termoizolacja)
- Typy montażu z opisami
- Lista kolorów prowadnic

Szczegóły formatu — patrz sam plik.
