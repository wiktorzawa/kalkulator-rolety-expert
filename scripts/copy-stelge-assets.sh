#!/bin/bash
# Kopiuje assety z stelge-assets/ do public/assets/
# Pomija: dachowe/, content/, inne/, manifest.json, STRUKTURA.md

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SRC="$ROOT_DIR/stelge-assets"
DEST="$ROOT_DIR/public/assets"

if [ ! -d "$SRC" ]; then
  echo "BŁĄD: Brak folderu źródłowego $SRC"
  exit 1
fi

echo "Kopiowanie assetów z stelge-assets/ do public/assets/..."

# 1. Produkty (bez dachowe/)
echo "  produkty/ (bez dachowe/)..."
mkdir -p "$DEST/produkty"
for dir in "$SRC/produkty"/*/; do
  folder_name=$(basename "$dir")
  if [ "$folder_name" = "dachowe" ]; then
    echo "    Pomijam: dachowe/"
    continue
  fi
  cp -r "$dir" "$DEST/produkty/$folder_name"
  echo "    Skopiowano: produkty/$folder_name/"
done

# 2. Montaż (bez dachowy/)
echo "  montaz/ (bez dachowy/)..."
mkdir -p "$DEST/montaz"
for dir in "$SRC/montaz"/*/; do
  folder_name=$(basename "$dir")
  if [ "$folder_name" = "dachowy" ]; then
    echo "    Pomijam: dachowy/"
    continue
  fi
  cp -r "$dir" "$DEST/montaz/$folder_name"
  echo "    Skopiowano: montaz/$folder_name/"
done

# 3. Prowadnice
echo "  prowadnice/..."
mkdir -p "$DEST/prowadnice"
cp -r "$SRC/prowadnice/"* "$DEST/prowadnice/"
echo "    Skopiowano: prowadnice/"

echo ""
echo "Gotowe! Assety skopiowane do public/assets/"
echo "  produkty/: $(find "$DEST/produkty" -type f | wc -l | tr -d ' ') plików"
echo "  montaz/: $(find "$DEST/montaz" -type f | wc -l | tr -d ' ') plików"
echo "  prowadnice/: $(find "$DEST/prowadnice" -type f | wc -l | tr -d ' ') plików"
