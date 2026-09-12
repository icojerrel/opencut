# YouTube Shorts automations — Why We Do This

Three scheduled Cursor Automations replace local cron for the psychology Shorts channel powered by [faceless-video-engine](https://github.com/Mystery-CLI/faceless-video-engine).

| Automation | Schedule (Europe/Amsterdam) | Cron UTC | Skill |
|---|---|---|---|
| **wwdt-daily-short** | Daily 09:00 | `0 7 * * *` | `skills/daily-short/SKILL.md` |
| **wwdt-karpathy-loop** | Daily 23:00 | `0 21 * * *` | `skills/karpathy-loop/SKILL.md` |
| **wwdt-weekly-longform** | Sunday 14:00 | `0 12 * * 0` | `skills/weekly-longform/SKILL.md` |

## Shared rules

1. Read and follow the skill file for this automation on every run.
2. Run `bash .cursor/automations/youtube-shorts/bootstrap.sh` first.
3. Work in `/workspace/faceless-video-engine` after bootstrap.
4. Never commit secrets. API keys come from Cloud Agent environment secrets.
5. YouTube OAuth (`client_secret.json`, `token.json`) must exist in the engine root for uploads; skip upload gracefully if missing.
6. Log outcomes to AgentMail `icojerrel-cos@agentmail.to` only when the user explicitly enabled CoS handoff — otherwise summarize in the run output.
7. Do not disable `karpathy.auto_apply` or change upload privacy without explicit user instruction.

## Repository

- **Primary:** `github.com/icojerrel/opencut` (this pack lives here)
- **Engine:** cloned to `/workspace/faceless-video-engine` by bootstrap
- **Channel config:** `.cursor/automations/youtube-shorts/config.channel.json`
