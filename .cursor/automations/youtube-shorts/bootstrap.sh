#!/usr/bin/env bash
# Prepare faceless-video-engine for a Cloud Agent automation run.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PACK="$ROOT/automations/youtube-shorts"
ENGINE="${FACELESS_ENGINE_DIR:-/workspace/faceless-video-engine}"

if [[ ! -d "$ENGINE/.git" ]]; then
  git clone --depth 1 https://github.com/Mystery-CLI/faceless-video-engine.git "$ENGINE"
fi

python3 -m pip install -q -r "$ENGINE/requirements.txt"
export PATH="$HOME/.local/bin:$PATH"
if [[ -f "$ENGINE/remotion/package-lock.json" ]]; then
  (cd "$ENGINE/remotion" && npm ci --silent 2>/dev/null) || (cd "$ENGINE/remotion" && npm install --silent)
else
  (cd "$ENGINE/remotion" && npm install --silent)
fi

cp "$PACK/config.channel.json" "$ENGINE/config.json"
cp "$PACK/overlay/run_karpathy_loop.py" "$PACK/overlay/run_daily.py" "$ENGINE/"
cp "$PACK/overlay/src/"*.py "$ENGINE/src/"
cp "$PACK/overlay/remotion/src/ShortVideo.tsx" "$ENGINE/remotion/src/"

mkdir -p "$ENGINE/logs" "$ENGINE/data" "$ENGINE/output"
touch "$ENGINE/.env"
for key in GEMINI_API_KEY PEXELS_API_KEY YOUTUBE_API_KEY; do
  val="${!key:-}"
  if [[ -n "$val" ]]; then
    if grep -q "^${key}=" "$ENGINE/.env" 2>/dev/null; then
      sed -i "s|^${key}=.*|${key}=${val}|" "$ENGINE/.env"
    else
      echo "${key}=${val}" >> "$ENGINE/.env"
    fi
  fi
done

echo "Engine ready at $ENGINE"
