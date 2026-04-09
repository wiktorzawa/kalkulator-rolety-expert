#!/bin/bash
BASE="https://stelge.com/wp-content/uploads"
OUT="$HOME/Desktop/stelge-materialy"

download() {
  local dir="$1"
  shift
  mkdir -p "$OUT/$dir"
  for url in "$@"; do
    filename=$(basename "$url")
    # Pobierz pełną wersję (bez -300x500 i -300x300)
    full_url=$(echo "$url" | sed 's/-300x500//' | sed 's/-300x300//')
    echo "  -> $dir/$filename"
    curl -sL "$full_url" -o "$OUT/$dir/$filename" 2>/dev/null || curl -sL "$url" -o "$OUT/$dir/$filename" 2>/dev/null
  done
}

echo "=== Pobieranie zdjęć PROFILI ze stelge.com ==="
echo ""

# PROFILE MONTAŻOWE - AKCESORIA
echo "[1/5] Montaż bezinwazyjny wzmocniony (skręcany)..."
download "13-Profile-Bezinwazyjny-Wzmocniony" \
  "$BASE/2025/07/MONTAZ-BEZINWAZYJNY-SKRECANY-gora-300x500.webp" \
  "$BASE/2025/07/MONTAZ-BEZINWAZYJNY-SKRECANY-dol-300x500.webp" \
  "$BASE/2025/07/Plisy-PomiarMontaz-bezinwazyjny-wzmocniony-1-1-300x300.png" \
  "$BASE/2025/07/Plisy-PomiarMontaz-bezinwazyjny-wzmocniony-2-1-300x300.png" \
  "$BASE/2025/09/Grafika-pomiarowa-BezInw_WZMOCNIONY.png" \
  "$BASE/2025/08/bezinw-klejony-GORA-zblizenie-KOLO-300x300.webp" \
  "$BASE/2025/08/bezinw-klejony-DOL-zblizenie-KOLO-300x300.webp"

echo "[2/5] Montaż bezinwazyjny klejony..."
download "14-Profile-Bezinwazyjny-Klejony" \
  "$BASE/2025/07/bezinwazyjny-klejony-gora-300x500.webp" \
  "$BASE/2025/07/bezinwazyjny-klejony-DOL-300x500.webp" \
  "$BASE/2025/09/Grafika-pomiarowa-BezInw_KLEJONY.png"

echo "[3/5] Montaż inwazyjny standard + regulowany..."
download "15-Profile-Inwazyjny-Standard" \
  "$BASE/2025/03/inwazyjny-standard-DOL-300x500.webp" \
  "$BASE/2025/08/inw-standard-GORA-zblizenie-KOLO-300x300.webp" \
  "$BASE/2025/08/inw-standard-DOL-zblizenie-KOLO-300x300.webp" \
  "$BASE/2025/09/Grafika-pomiarowa-Inw_STANDARD.png" \
  "$BASE/2025/03/inwazyjny-regulowany-GORA-300x500.webp" \
  "$BASE/2025/03/inwazyjny-regulowany-DOL-300x500.webp" \
  "$BASE/2025/08/inw-regulowany-GORA-zblizenie-KOLO-300x300.webp" \
  "$BASE/2025/08/inw-regulowany-DOL-zblizenie-KOLO-300x300.webp" \
  "$BASE/2025/09/Grafika-pomiarowa-Inw_REGULOWANY.png"

echo "[4/5] Montaż inwazyjny kątowy + dachowy..."
download "16-Profile-Inwazyjny-Katowy-Dachowy" \
  "$BASE/2025/03/inwazyjny-katowy-GORA-300x500.webp" \
  "$BASE/2025/03/inwazyjny-katowy-DOL-300x500.webp" \
  "$BASE/2025/08/inwazyjny-katowy-GORA-zblizenie-KOLO-300x300.webp" \
  "$BASE/2025/08/inwazyjny-katowy-DOL-zblizenie-KOLO-300x300.webp" \
  "$BASE/2025/09/Grafika-pomiarowa-Inw_KATOWY.png" \
  "$BASE/2024/07/DACHOWE-inwazyjny-standard-GORA-zblizenie-KOLO-300x300.webp" \
  "$BASE/2024/07/DACHOWE-inwazyjny-standard-DOL-zblizenie-KOLO-300x300.webp" \
  "$BASE/2025/09/Grafika-pomiarowa-Inw_DACHOWA.png"

echo "[5/5] Grafiki ogólne (wzorniki, tło, logo)..."
download "17-Grafiki-Ogolne" \
  "$BASE/2023/04/1-Miniaturka_1.webp" \
  "$BASE/2022/03/Group-34.png" \
  "$BASE/2024/06/zdjecie-w-tle-dociete-v5-miarka-budowlana.png" \
  "$BASE/2021/11/logo_stelge.svg"

echo ""
echo "=== GOTOWE ==="
echo ""
# Podsumowanie nowych folderów
total=0
for dir in "$OUT"/1[3-7]-*/; do
  count=$(ls -1 "$dir" 2>/dev/null | wc -l | tr -d ' ')
  dirname=$(basename "$dir")
  echo "  $dirname: $count plików"
  total=$((total + count))
done
echo ""
echo "  RAZEM nowych: $total plików"
