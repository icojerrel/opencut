#!/usr/bin/env bash
# Bootstrap OAuth from env secrets, then upload the first Short (unlisted).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bash "$ROOT/scripts/youtube_status.sh" || exit 1
bash "$ROOT/bootstrap.sh"
python3 "$ROOT/scripts/upload_short.py" \
  "$ROOT/faceless-video-engine/output/short_20260913_070641.mp4" \
  --plan "$ROOT/plans/short_20260913_070641.plan.json"
