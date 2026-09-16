#!/usr/bin/env bash
# Upload the most recent Short from output/ (requires OAuth: client_secret.json + token.json).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENGINE="$ROOT/faceless-video-engine"

bash "$ROOT/bootstrap.sh"
cd "$ENGINE"

if [[ ! -f client_secret.json ]]; then
  echo "Missing client_secret.json — see YOUTUBE_LAUNCH.md §2"
  exit 1
fi
if [[ ! -f token.json ]]; then
  echo "Missing token.json — run: python3 authorize.py"
  exit 1
fi

LATEST="$(ls -t output/short_*.mp4 2>/dev/null | head -1 || true)"
if [[ -z "$LATEST" ]]; then
  echo "No short in output/ — run: python3 run_daily.py --no-upload"
  exit 1
fi

echo "Latest: $LATEST"
python3 run_daily.py --recover-only || true
python3 run_daily.py
