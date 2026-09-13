#!/usr/bin/env bash
# Wait for OAuth files then upload first Short (unlisted). No secrets printed.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENGINE="$ROOT/faceless-video-engine"
VIDEO="$ENGINE/output/short_20260913_070641.mp4"
PLAN="$ROOT/plans/short_20260913_070641.plan.json"
MAX_WAIT="${MAX_WAIT_SEC:-600}"
INTERVAL=10
elapsed=0

bash "$ROOT/bootstrap.sh"

while [[ ! -f "$ENGINE/client_secret.json" || ! -f "$ENGINE/token.json" ]]; do
  if [[ $elapsed -ge $MAX_WAIT ]]; then
    echo "TIMEOUT: missing client_secret.json or token.json after ${MAX_WAIT}s"
    exit 2
  fi
  sleep "$INTERVAL"
  elapsed=$((elapsed + INTERVAL))
  bash "$ROOT/bootstrap.sh" >/dev/null 2>&1 || true
done

echo "OAuth files present — uploading..."
python3 "$ROOT/scripts/upload_short.py" "$VIDEO" --plan "$PLAN"
