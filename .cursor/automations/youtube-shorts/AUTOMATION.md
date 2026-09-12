# Cursor Automations setup (replaces cron)

Local cron on a VM stops when the machine sleeps. These three **Cursor Automations** run as Cloud Agents on a schedule (UTC internally).

## Prerequisites

1. Save the Cloud Agent environment from `.cursor/environment.json` (OpenCut dashboard).
2. Add secrets to the environment:
   - `GEMINI_API_KEY` (required)
   - `PEXELS_API_KEY` (optional)
   - `YOUTUBE_API_KEY` (optional, analytics fallback)
3. For YouTube upload: place `client_secret.json` and run `authorize.py` once in a manual agent session to create `token.json` in the engine directory (or store as secrets/files the bootstrap step can write).

## Create automations

Open [cursor.com/automations/new](https://cursor.com/automations/new) and create **three** automations. Use repository **icojerrel/opencut**, branch **main**, and the saved environment.

### 1. wwdt-daily-short

| Field | Value |
|---|---|
| **Trigger** | Scheduled — `0 7 * * *` (09:00 Europe/Amsterdam, CEST) |
| **Repository** | icojerrel/opencut |
| **Prompt** | Read `.cursor/automations/youtube-shorts/FOR_AGENTS.md` and follow `.cursor/automations/youtube-shorts/skills/daily-short/SKILL.md` for this run. |
| **Tools** | Memories (optional), MCP AgentMail if connected |

### 2. wwdt-karpathy-loop

| Field | Value |
|---|---|
| **Trigger** | Scheduled — `0 21 * * *` (23:00 Europe/Amsterdam, CEST) |
| **Repository** | icojerrel/opencut |
| **Prompt** | Read `.cursor/automations/youtube-shorts/FOR_AGENTS.md` and follow `.cursor/automations/youtube-shorts/skills/karpathy-loop/SKILL.md` for this run. |
| **Tools** | Memories (recommended — tracks experiment history across nights) |

### 3. wwdt-weekly-longform

| Field | Value |
|---|---|
| **Trigger** | Scheduled — `0 12 * * 0` (Sunday 14:00 Europe/Amsterdam, CEST) |
| **Repository** | icojerrel/opencut |
| **Prompt** | Read `.cursor/automations/youtube-shorts/FOR_AGENTS.md` and follow `.cursor/automations/youtube-shorts/skills/weekly-longform/SKILL.md` for this run. |

## Disable local cron

After all three automations are **enabled** in the dashboard:

```bash
crontab -l 2>/dev/null | grep -v faceless-video-engine | crontab -
```

Or run `bash setup_schedule_linux.sh --remove` in the engine repo.

## Verify

Trigger each automation once manually from the dashboard (Run now). Check logs under `/workspace/faceless-video-engine/logs/` in the agent run artifacts.
