#!/bin/bash
# Skrypt pobierający wszystkie zdjęcia materiałów ze stelge.com
BASE="https://stelge.com/wp-content/uploads"
OUT="$HOME/Desktop/stelge-materialy"

download() {
  local dir="$1"
  shift
  mkdir -p "$OUT/$dir"
  for url in "$@"; do
    filename=$(basename "$url")
    # Pobierz pełną wersję (bez -300x500)
    full_url=$(echo "$url" | sed 's/-300x500//')
    echo "  -> $dir/$filename"
    curl -sL "$full_url" -o "$OUT/$dir/$filename" 2>/dev/null || curl -sL "$url" -o "$OUT/$dir/$filename" 2>/dev/null
  done
}

echo "=== Pobieranie zdjęć materiałów ze stelge.com ==="
echo ""

# 1. STANDARD
echo "[1/11] Plisy Standard..."
download "01-Standard" \
  "$BASE/2021/11/STANDARD-inwazyjne-BIEL-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-SREBRO-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-KREM-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-JASNY-BEZ-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-POPIEL-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-SZARY-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-GRAFIT-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-BEZ-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-CZARNY-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-CAPPUCINO-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-BRAZ-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-PIASEK-300x500.png" \
  "$BASE/2021/11/STANDARD-inwazyjne-PUDROWY-ROZ-300x500.png" \
  "$BASE/2021/12/plisa-biala-300x500.jpg" \
  "$BASE/2021/12/plisa-srebro-300x500.jpg" \
  "$BASE/2021/12/plisa-krem-300x500.jpg" \
  "$BASE/2021/12/plisa-jasny-bez-300x500.jpg" \
  "$BASE/2021/12/plisa-popiel-300x500.jpg" \
  "$BASE/2021/12/plisa-szary-300x500.jpg" \
  "$BASE/2021/12/plisa-grafit-300x500.jpg" \
  "$BASE/2021/12/plisa-bez-300x500.jpg" \
  "$BASE/2021/12/plisa-czern-300x500.jpg" \
  "$BASE/2021/12/plisa-cappucino-300x500.jpg" \
  "$BASE/2021/12/plisa-braz-300x500.jpg" \
  "$BASE/2021/12/plisa-piasek-300x500.jpg" \
  "$BASE/2021/12/plisa-pudrowy-roz-300x500.jpg"

# 2. STANDARD TERMO
echo "[2/11] Plisy Standard Termo..."
download "02-Standard-Termo" \
  "$BASE/2021/10/STANDARDTERMO-inwazyjne-BIEL-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-SREBRO-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-SZARY-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-KREM-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-POPIEL-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-JASNY-BEZ-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-GRAFIT-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-CZARNY-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-BEZ-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-CAPPUCINO-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-BRAZ-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-PUDROWY-ROZ-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-PIASEK-300x500.png" \
  "$BASE/2022/01/STANDARDTERMO-inwazyjne-JASNY-FIOLET-300x500.png" \
  "$BASE/2021/12/plisa-biala-300x500.jpg" \
  "$BASE/2021/12/plisa-srebro-termo-300x500.jpg" \
  "$BASE/2021/12/plisa-szary-300x500.jpg" \
  "$BASE/2021/12/plisa-krem-termo-300x500.jpg" \
  "$BASE/2021/12/plisa-popiel-300x500.jpg" \
  "$BASE/2021/12/plisa-jasny-bez-300x500.jpg" \
  "$BASE/2021/12/plisa-grafit-300x500.jpg" \
  "$BASE/2021/12/plisa-czern-300x500.jpg" \
  "$BASE/2021/12/plisa-bez-300x500.jpg" \
  "$BASE/2021/12/plisa-cappucino-300x500.jpg" \
  "$BASE/2021/12/plisa-braz-300x500.jpg" \
  "$BASE/2021/12/plisa-pudrowy-roz-300x500.jpg"

# 3. MELANGE TERMO
echo "[3/11] Plisy Melange Termo..."
download "03-Melange-Termo" \
  "$BASE/2022/02/MELANGETERMO-inwazyjne-NUDE-300x500.png" \
  "$BASE/2022/02/MELANGETERMO-inwazyjne-POPIEL-300x500.png" \
  "$BASE/2022/02/MELANGETERMO-inwazyjne-SZARY-300x500.png" \
  "$BASE/2022/02/MELANGETERMO-inwazyjne-CAPPUCINO-300x500.png" \
  "$BASE/2022/02/MELANGETERMO-inwazyjne-GRAFIT-300x500.png" \
  "$BASE/2022/02/MELANGETERMO-inwazyjne-BRAZ-300x500.png" \
  "$BASE/2022/02/MELANGETERMO-inwazyjne-DENIM-300x500.png" \
  "$BASE/2022/02/nude.-300x500.jpg" \
  "$BASE/2022/02/popiel.-300x500.jpg" \
  "$BASE/2022/02/szary.-300x500.jpg" \
  "$BASE/2022/02/cappucino.-300x500.jpg" \
  "$BASE/2022/02/grafit.-300x500.jpg" \
  "$BASE/2022/02/braz.-300x500.jpg" \
  "$BASE/2022/02/denim.-300x500.jpg"

# 4. DOLOMIT
echo "[4/11] Plisy Dolomit..."
download "04-Dolomit" \
  "$BASE/2022/04/DOLOMIT-inwazyjne-SZARY-300x500.png" \
  "$BASE/2022/03/DOLOMIT-inwazyjne-BEZ-300x500.png" \
  "$BASE/2022/03/DOLOMIT-inwazyjne-KREM-300x500.png" \
  "$BASE/2022/03/DOLOMIT-inwazyjne-GRAFIT-300x500.png" \
  "$BASE/2022/03/DOLOMIT-inwazyjne-MOCCA-300x500.png" \
  "$BASE/2022/03/DOLOMIT-inwazyjne-SREBRO-300x500.png" \
  "$BASE/2022/03/szary-2-300x500.jpg" \
  "$BASE/2022/03/bez-2-300x500.jpg" \
  "$BASE/2022/03/krem-2-300x500.jpg" \
  "$BASE/2022/03/grafitt-300x500.jpg" \
  "$BASE/2022/03/mocca-2-300x500.jpg" \
  "$BASE/2022/03/srebro-2-300x500.jpg"

# 5. DOLOMIT TERMO
echo "[5/11] Plisy Dolomit Termo..."
download "05-Dolomit-Termo" \
  "$BASE/2022/03/DOLOMITTERMO-inwazyjne-BEZ-300x500.png" \
  "$BASE/2022/03/DOLOMITTERMO-inwazyjne-GRAFIT-300x500.png" \
  "$BASE/2022/03/DOLOMITTERMO-inwazyjne-KREM-300x500.png" \
  "$BASE/2022/03/DOLOMITTERMO-inwazyjne-MOCCA-300x500.png" \
  "$BASE/2022/03/DOLOMITTERMO-inwazyjne-SREBRO-300x500.png" \
  "$BASE/2022/03/DOLOMITTERMO-inwazyjne-SZARY-300x500.png" \
  "$BASE/2022/03/bez.-300x500.jpg" \
  "$BASE/2022/03/grafitt.-300x500.jpg" \
  "$BASE/2022/03/krem.-300x500.jpg" \
  "$BASE/2022/03/mocca.-300x500.jpg" \
  "$BASE/2022/03/srebro.-300x500.jpg" \
  "$BASE/2022/03/szary.-1-300x500.jpg"

# 6. BLACKOUT
echo "[6/11] Plisy Blackout..."
download "06-Blackout" \
  "$BASE/2024/07/BLACKOUT-inwazyjne-BIEL-300x500.png" \
  "$BASE/2024/07/BLACKOUT-inwazyjne-SREBRO-300x500.png" \
  "$BASE/2024/07/BLACKOUT-inwazyjne-SZARY-300x500.png" \
  "$BASE/2024/07/BLACKOUT-inwazyjne-KREM-300x500.png" \
  "$BASE/2024/07/BLACKOUT-inwazyjne-GRAFIT-300x500.png" \
  "$BASE/2024/07/BLACKOUT-inwazyjne-CAPPUCINO-300x500.png" \
  "$BASE/2024/07/BLACKOUT-inwazyjne-CZERN-300x500.png" \
  "$BASE/2024/07/BLACKOUT-inwazyjne-PIASEK-300x500.png" \
  "$BASE/2024/07/BLACKOUT-zblizenie-inwazyjne-BIEL-300x500.png" \
  "$BASE/2024/07/BLACKOUT-zblizenie-inwazyjne-SREBRO-300x500.png" \
  "$BASE/2024/07/BLACKOUT-zblizenie-inwazyjne-SZARY-300x500.png" \
  "$BASE/2024/07/BLACKOUT-zblizenie-inwazyjne-KREM-300x500.png" \
  "$BASE/2024/07/BLACKOUT-zblizenie-inwazyjne-GRAFIT-300x500.png" \
  "$BASE/2024/07/BLACKOUT-zblizenie-inwazyjne-CAPPUCINO-300x500.png" \
  "$BASE/2024/07/BLACKOUT-zblizenie-inwazyjne-CZARNY-300x500.png" \
  "$BASE/2024/07/BLACKOUT-zblizenie-inwazyjne-PIASEK-300x500.png"

# 7. HONEYCOMB
echo "[7/11] Rolety Honeycomb..."
download "07-Honeycomb" \
  "$BASE/2024/01/HONEYCOMB-inwazyjne-ZIMNY-BEZ-1-300x500.png" \
  "$BASE/2024/01/HONEYCOMB-inwazyjne-ZIMNY-BEZ-300x500.png" \
  "$BASE/2024/01/HONEYCOMB-inwazyjne-BIEL-300x500.png" \
  "$BASE/2024/01/HONEYCOMB-inwazyjne-ANTRACYT-300x500.png" \
  "$BASE/2024/02/HONEYCOMB-inwazyjne-GRAFIT-300x500.png" \
  "$BASE/2024/02/HONEYCOMB-inwazyjne-CAPPUCINO-300x500.png" \
  "$BASE/2024/01/HONEYCOMB-zblizenie-bezinwazyjne-ZIMNY-BEZ-1-300x500.png" \
  "$BASE/2024/01/HONEYCOMB-zblizenie-bezinwazyjne-ZIMNY-BEZ-300x500.png" \
  "$BASE/2024/01/HONEYCOMB-zblizenie-bezinwazyjne-BIEL-300x500.png" \
  "$BASE/2024/01/HONEYCOMB-zblizenie-bezinwazyjne-ANTRACYT-300x500.png" \
  "$BASE/2024/02/HONEYCOMB-zblizenie-bezinwazyjne-GRAFIT-300x500.png" \
  "$BASE/2024/02/HONEYCOMB-zblizenie-bezinwazyjne-CAPPUCINO-300x500.png"

# 8. DACHOWE - STANDARD TERMO
echo "[8/11] Dachowe Standard Termo..."
download "08-Dachowe-Standard-Termo" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-GRAFIT-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-GRAFIT-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-CZARNY-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-CZARNY-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-SZARY-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-SZARY-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-POPIEL-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-POPIEL-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-BIEL-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-BIEL-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-KREM-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-KREM-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-JASNY-BEZ-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-JASNY-BEZ-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-SREBRO-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-SREBRO-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-BEZ-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-BEZ-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-CAPPUCINO-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-CAPPUCINO-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-BRAZ-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-BRAZ-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-NIEBIESKI-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-NIEBIESKI-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-JASNY-FIOLET-1-300x500.png" \
  "$BASE/2022/03/Dachowe-STANDARDTERMO-JASNY-FIOLET-300x500.png"

# 9. DACHOWE - MELANGE TERMO
echo "[9/11] Dachowe Melange Termo..."
download "09-Dachowe-Melange-Termo" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-NUDE-1-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-NUDE-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-SZARY-1-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-SZARY-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-CAPPUCINO-1-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-CAPPUCINO-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-POPIEL-1-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-POPIEL-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-GRAFIT-1-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-GRAFIT-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-DENIM-1-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-DENIM-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-BRAZ-1-300x500.png" \
  "$BASE/2022/03/Dachowe-MELANGETERMO-BRAZ-300x500.png"

# 10. DACHOWE - DOLOMIT TERMO
echo "[10/11] Dachowe Dolomit Termo..."
download "10-Dachowe-Dolomit-Termo" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-SZARY-1-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-SZARY-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-GRAFIT-1-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-GRAFIT-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-SREBRO-1-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-SREBRO-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-BEZ-1-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-BEZ-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-MOCCA-1-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-MOCCA-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-KREM-1-300x500.png" \
  "$BASE/2022/03/Dachowe-DOLOMITTERMO-KREM-300x500.png"

# 11. DACHOWE - HONEYCOMB + BLACKOUT
echo "[11/11] Dachowe Honeycomb + Blackout..."
download "11-Dachowe-Honeycomb" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-CIEPLY-BEZ-3-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-CIEPLY-BEZ-2-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-ANTRACYT-2-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-ANTRACYT-3-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-ZIMNY-BEZ-2-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-ZIMNY-BEZ-1-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-BIEL-2-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-BIEL-1-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-SZARY-2-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-SZARY-1-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-CAPPUCINO-3-300x500.png" \
  "$BASE/2024/04/Dachowe-HONEYCOMB-CAPPUCINO-2-300x500.png"

download "12-Dachowe-Blackout" \
  "$BASE/2024/07/Dachowe-BLACKOUT-BIEL-300x500.png" \
  "$BASE/2024/07/Dachowe-BLACKOUT-CZARNY-300x500.png" \
  "$BASE/2024/07/Dachowe-BLACKOUT-KREM-1-300x500.png" \
  "$BASE/2024/07/Dachowe-BLACKOUT-CAPPUCINO-300x500.png" \
  "$BASE/2024/07/Dachowe-BLACKOUT-SZARY-1-300x500.png" \
  "$BASE/2024/07/Dachowe-BLACKOUT-SREBRO-300x500.png" \
  "$BASE/2024/07/Dachowe-BLACKOUT-GRAFIT-300x500.png" \
  "$BASE/2024/07/Dachowe-BLACKOUT-PIASEK-1-300x500.png"

echo ""
echo "=== GOTOWE ==="
echo ""
# Podsumowanie
total=0
for dir in "$OUT"/*/; do
  count=$(ls -1 "$dir" 2>/dev/null | wc -l | tr -d ' ')
  dirname=$(basename "$dir")
  echo "  $dirname: $count plików"
  total=$((total + count))
done
echo ""
echo "  RAZEM: $total plików"
