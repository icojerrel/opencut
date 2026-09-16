#!/usr/bin/env bash
# Prepare faceless-video-engine for Why We Do This automation runs.
set -euo pipefail

PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENGINE="${FACELESS_ENGINE_DIR:-$PROJECT/faceless-video-engine}"
LEGACY="/workspace/faceless-video-engine"

if [[ ! -d "$ENGINE/.git" && -d "$LEGACY/.git" ]]; then
  echo "Migrating legacy engine from $LEGACY"
  mv "$LEGACY" "$ENGINE"
fi

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

cp "$PROJECT/config.channel.json" "$ENGINE/config.json"
cp "$PROJECT/overlay/run_karpathy_loop.py" "$PROJECT/overlay/run_daily.py" "$ENGINE/"
cp "$PROJECT/overlay/src/"*.py "$ENGINE/src/"
cp "$PROJECT/overlay/remotion/src/ShortVideo.tsx" "$ENGINE/remotion/src/"

mkdir -p "$ENGINE/logs" "$ENGINE/data" "$ENGINE/output"
touch "$ENGINE/.env"

if [[ -n "${YOUTUBE_CLIENT_SECRET_JSON:-}" && ! -f "$ENGINE/client_secret.json" ]]; then
  printf '%s' "$YOUTUBE_CLIENT_SECRET_JSON" > "$ENGINE/client_secret.json"
fi
if [[ -n "${YOUTUBE_TOKEN_JSON:-}" && ! -f "$ENGINE/token.json" ]]; then
  printf '%s' "$YOUTUBE_TOKEN_JSON" > "$ENGINE/token.json"
fi
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
