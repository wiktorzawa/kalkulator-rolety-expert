#!/usr/bin/env bash
# Copy product images from stelge-materialy/ to public/assets/
# Excludes folders 08-12 (dachowe — out of scope for V1)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SOURCE="$PROJECT_ROOT/stelge-materialy"
TARGET="$PROJECT_ROOT/public/assets"

if [ ! -d "$SOURCE" ]; then
  echo "ERROR: Source directory not found: $SOURCE"
  exit 1
fi

echo "Copying assets from $SOURCE to $TARGET..."
echo "Skipping folders 08-12 (dachowe — out of V1 scope)"

# Folders to copy (01-07 fabrics, 13-18 mounting/profiles, 19-21 extras)
FOLDERS=(
  "01-Standard"
  "02-Standard-Termo"
  "03-Melange-Termo"
  "04-Dolomit"
  "05-Dolomit-Termo"
  "06-Blackout"
  "07-Honeycomb"
  "13-Uchwyty-Bezinwazyjny-Wzmocniony"
  "14-Uchwyty-Bezinwazyjny-Klejony"
  "15-Uchwyty-Inwazyjny-Standard"
  "16-Uchwyty-Inwazyjny-Katowy-Dachowy"
  "17-Grafiki-Ogolne"
  "18-Profile-Aluminiowe-Przekroje"
  "19-Wzorniki-Kolorow"
  "20-Zdjecia-Aranzacyjne"
  "21-Certyfikaty"
)

mkdir -p "$TARGET"

copied=0
for folder in "${FOLDERS[@]}"; do
  src_path="$SOURCE/$folder"
  if [ -d "$src_path" ]; then
    dst_path="$TARGET/$folder"
    mkdir -p "$dst_path"
    cp -r "$src_path/"* "$dst_path/" 2>/dev/null || true
    count=$(find "$dst_path" -type f | wc -l | tr -d ' ')
    echo "  $folder: $count files"
    copied=$((copied + count))
  else
    echo "  SKIP $folder (not found)"
  fi
done

echo ""
echo "Done. Total files copied: $copied"
