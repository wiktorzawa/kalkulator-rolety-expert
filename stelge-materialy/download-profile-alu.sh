#!/bin/bash
BASE="https://stelge.com/wp-content/uploads"
OUT="$HOME/Desktop/stelge-materialy"

download() {
  local dir="$1"
  shift
  mkdir -p "$OUT/$dir"
  for url in "$@"; do
    filename=$(basename "$url")
    # Pobierz pełną wersję (bez rozmiarów w nazwie)
    full_url=$(echo "$url" | sed 's/-300x300//' | sed 's/-300x500//' | sed 's/-768x768//' | sed 's/-150x150//')
    echo "  -> $dir/$filename"
    curl -sL "$full_url" -o "$OUT/$dir/$filename" 2>/dev/null || curl -sL "$url" -o "$OUT/$dir/$filename" 2>/dev/null
  done
}

echo "=== Pobieranie profili aluminiowych + dodatkowych grafik ==="
echo ""

# GRAFIKI OPISOWE MONTAŻU — tu widać profile aluminiowe w przekroju
echo "[1/4] Profile aluminiowe — opisy montażu (przekroje)..."
download "18-Profile-Aluminiowe-Przekroje" \
  "$BASE/2025/09/Plisy-montaz-bezinwazyjny-wzmocniony-opis-NOWE.png" \
  "$BASE/2025/09/Pomiar-Montaz-bezinwazyjny-wzmocniony-nowa.png" \
  "$BASE/2025/09/Plisy-montaz-bezinwazyjny-klejony-opis-NOWE.png" \
  "$BASE/2025/09/Pomiar-Montaz-bezinwazyjny-klejony-nowa.png" \
  "$BASE/2025/09/Plisy-montaz-inwazyjny-standard-opis-NOWE.png" \
  "$BASE/2025/09/Pomiar-Montaz-inwazyjny-standard-nowa-1.png" \
  "$BASE/2025/09/Plisy-montaz-inwazyjny-regulowany-opis-NOWE.png" \
  "$BASE/2025/09/Pomiar-Montaz-inwazyjny-regulowany-nowa-1.png" \
  "$BASE/2025/09/Plisy-montaz-inwazyjny-katowy-opis-NOWE.png" \
  "$BASE/2025/09/Pomiar-Montaz-inwazyjny-katowy-nowa-1.png"

# WZORNIKI KOLORÓW (palety)
echo "[2/4] Wzorniki kolorów..."
download "19-Wzorniki-Kolorow" \
  "$BASE/2021/11/KOLORY-STANDARDTERMO.png" \
  "$BASE/2024/05/Wzornik-StandardTermo.png" \
  "$BASE/2021/11/KOLORY-DOLOMIT.png" \
  "$BASE/2024/05/Wzornik-Dolomit.png" \
  "$BASE/2021/11/KOLORY-MELANGETERMO.png" \
  "$BASE/2024/05/Wzornik-MelangeTermo.png"

# ZDJĘCIA ARANŻACYJNE / LIFESTYLE
echo "[3/4] Zdjęcia aranżacyjne (lifestyle)..."
download "20-Zdjecia-Aranzacyjne" \
  "$BASE/2024/05/Standardtermo-1-1.png" \
  "$BASE/2024/05/Standard-2-1.png" \
  "$BASE/2024/05/Standard-3.png" \
  "$BASE/2024/05/Standardtermo-4.png" \
  "$BASE/2024/05/Dolomit-1.png" \
  "$BASE/2024/05/Dolomit-2.png" \
  "$BASE/2024/05/Dolomit-3.png" \
  "$BASE/2024/05/Dolomit-4.png" \
  "$BASE/2024/05/Melangetermo-1.png" \
  "$BASE/2024/05/Melange-2.png" \
  "$BASE/2024/05/Melange-3.png" \
  "$BASE/2024/05/Melangetermo-4.png"

# CERTYFIKATY
echo "[4/4] Certyfikaty..."
download "21-Certyfikaty" \
  "$BASE/2024/01/3f0adc3e47a28ab582e8e7d48fdf.jpg"

echo ""
echo "=== GOTOWE ==="
echo ""
total=0
for dir in "$OUT"/1[8-9]-*/ "$OUT"/2[0-1]-*/; do
  if [ -d "$dir" ]; then
    count=$(ls -1 "$dir" 2>/dev/null | wc -l | tr -d ' ')
    dirname=$(basename "$dir")
    echo "  $dirname: $count plików"
    total=$((total + count))
  fi
done
echo ""
echo "  RAZEM nowych: $total plików"
