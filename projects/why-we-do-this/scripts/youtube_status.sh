#!/usr/bin/env bash
# Readiness check for first YouTube upload (no secrets printed).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENGINE="$ROOT/faceless-video-engine"
VIDEO="$ENGINE/output/short_20260913_070641.mp4"
PLAN="$ROOT/plans/short_20260913_070641.plan.json"

ok=0; fail=0
check() { if "$@"; then echo "  OK   $1"; ok=$((ok+1)); else echo "  FAIL $1"; fail=$((fail+1)); fi; }

echo "Why We Do This — YouTube upload readiness"
echo

check test -f "$VIDEO"
check test -f "$PLAN"
check test -f "$ENGINE/client_secret.json" || test -n "${YOUTUBE_CLIENT_SECRET_JSON:-}"
check test -f "$ENGINE/token.json" || test -n "${YOUTUBE_TOKEN_JSON:-}"

echo
if [[ $fail -eq 0 ]]; then
  echo "Ready. Run: bash projects/why-we-do-this/scripts/upload_first_short.sh"
  exit 0
fi
echo "Blocked. OAuth: see projects/why-we-do-this/YOUTUBE_OAUTH_DESKTOP.md"
exit 1
