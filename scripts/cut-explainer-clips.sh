#!/usr/bin/env bash
# Four explainer clips from the ~84s Kimi/Pippa cut.
# Output is /tmp by default — do not commit the mp4s.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${SRC:-$ROOT/public/media/video/satohash-explainer-with-vo2.mp4}"
OUT="${OUT:-/tmp/satohash-clips}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "skip: ffmpeg not found"
  exit 0
fi

REMOTE="https://videos.giveabit.io/media/video/satohash-explainer-with-vo2.mp4?v=kimi-noir-20260819"
if [ ! -f "$SRC" ]; then
  echo "local source missing; fetching $REMOTE"
  mkdir -p "$OUT"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$OUT/vo2.mp4" "$REMOTE"
    SRC="$OUT/vo2.mp4"
  else
    echo "skip: curl not found and $SRC missing"
    exit 0
  fi
fi

mkdir -p "$OUT"

# Board (public/media/video/SCRIPT.md, vo2 ~83.7s):
#   0:00–0:13 hook · 0:13–0:28 hashing · 0:28–0:46 calendars→Bitcoin · 1:12–1:24 CTA
# Cuts are approx; accurate seek ( -ss after -i ) so VO lands on the scene.
cut_clip() {
  local name="$1" start="$2" dur="$3"
  local dest="$OUT/$name.mp4"
  echo "cut $name  start=${start}s  dur=${dur}s"
  ffmpeg -hide_banner -loglevel error -y \
    -i "$SRC" -ss "$start" -t "$dur" \
    -c:v libx264 -preset veryfast -crf 23 \
    -c:a aac -b:a 128k \
    -movflags +faststart \
    "$dest"
  ls -lh "$dest"
}

cut_clip "01-hook" 0 12
cut_clip "02-hashing" 13 15
cut_clip "03-bitcoin-block" 28 18
cut_clip "04-cta" 72 12

echo "clips in $OUT"
ls -lh "$OUT"/*.mp4
