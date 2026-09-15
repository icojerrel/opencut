# AI Freelancer Bot (FreelanceBot)

Een AI-assistent voor freelancers, gebouwd met [eve](https://eve.dev). Helpt met **live opdrachten zoeken**, proposals schrijven, tarieven berekenen, video-project offertes, projectbeheer en facturatie.

Bereikbaar via **Web Chat** en **Slack**.

## Features

| Feature | Tool / Skill |
|---------|--------------|
| **Live opdrachten** (Remotive, RemoteOK, Jobicy, Upwork) | `fetch_live_jobs` |
| Lokale opdrachten zoeken & matchen | `search_jobs` |
| Opdracht toevoegen | `add_job` |
| Proposals schrijven | `proposal-writing` + `save_proposal` |
| Tarief berekenen | `pricing-strategy` + `calculate_rate` |
| **Video project offertes** | `video-editing-freelance` + `quote_video_project` |
| Profiel beheren | `manage_profile` |
| Projecten tracken | `track_project` |
| Facturen genereren | `generate_invoice` |
| Klantcommunicatie | `client-communication` |

## Kanalen

| Kanaal | Setup |
|--------|-------|
| Web Chat | `npm run dev` → localhost:3000 |
| Slack | Zie [SLACK_SETUP.md](./SLACK_SETUP.md) |

## Vereisten

- Node.js **24+**
- `AI_GATEWAY_API_KEY` voor live AI-antwoorden
- `SLACK_BOT_TOKEN` + `SLACK_SIGNING_SECRET` voor Slack (optioneel)

## Starten

```bash
fnm use 24
cd ai-freelancer-bot
npm install
npm run dev:eve     # eve server → :2000
npm run dev         # web UI → :3000
```

## Testen

```bash
npm run typecheck
npm run test        # core + video + live job fetch
```

## Live job bronnen

`fetch_live_jobs` haalt opdrachten op van:

- **Remotive** — remote jobs API
- **RemoteOK** — remote dev/creative jobs
- **Jobicy** — remote jobs met tags
- **Arbeitnow** — EU/remote job board
- **Upwork** — RSS feed (kan geblokkeerd zijn door Cloudflare; graceful fallback)

## Video editing niche

4 extra seed jobs + dedicated skill voor:
- YouTube Shorts / Reels editing
- Faceless automation (Remotion, FFmpeg)
- Corporate / color grading
- Podcast clip packs

## Voorbeeld prompts

**Algemeen:**
- *"Stel mijn profiel in: video editor, Remotion + Premiere, €75/uur"*
- *"Haal live video editing opdrachten op en importeer ze"*
- *"Schrijf een proposal voor job-006"*

**Video:**
- *"Bereken offerte voor 5 YouTube Shorts per week, premium, met captions"*
- *"Wat moet ik vragen voor een faceless Remotion pipeline setup?"*

**Slack:**
- `@FreelanceBot live jobs voor remotion developer`
- `@FreelanceBot quote 3 corporate videos met motion graphics`

## Architectuur

```
agent/
├── instructions.md
├── channels/
│   ├── eve.ts          # HTTP API
│   └── slack.ts        # Slack integratie
├── tools/              # 9 tools
├── skills/             # 4 skills
└── lib/
    ├── job-sources.ts  # Live job fetchers
    └── store.ts        # Session state
app/                    # Next.js web chat
SLACK_SETUP.md
```

## Deploy

```bash
npx eve link
npm run deploy
```
