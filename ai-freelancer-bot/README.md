# FreelanceBot v1.0

Complete AI-assistent voor freelancers — gebouwd met [eve](https://eve.dev).

## Features

| Categorie | Tools / Skills |
|-----------|----------------|
| Profiel | `manage_profile` |
| Opdrachten | `search_jobs`, `add_job`, `fetch_live_jobs` |
| Tarieven | `calculate_rate`, `pricing-strategy` |
| Proposals | `save_proposal`, `proposal-writing` |
| Projecten | `track_project` |
| Facturen | `generate_invoice`, `client-communication` |
| Video | `quote_video_project`, `video-editing-freelance` |

## Kanalen

| Kanaal | Start |
|--------|-------|
| Web chat | `npm run dev` → localhost:3000 |
| Slack | [SLACK_SETUP.md](./SLACK_SETUP.md) |

## Starten

Zie [GETTING_STARTED.md](./GETTING_STARTED.md) voor de volledige gids.

```bash
fnm use 24 && cd ai-freelancer-bot && npm install
npm run dev:eve    # :2000
npm run dev        # :3000 → snelkoppelingen op homepage
```

## Deploy (Vercel)

Zie **[DEPLOY.md](./DEPLOY.md)** — Root Directory: `ai-freelancer-bot`

```bash
vercel login && vercel --prod
```

## Testen

```bash
npm run typecheck
npm run test       # core + persist + video + live
```

## Roadmap

Alle fases afgerond — zie [ROADMAP.md](./ROADMAP.md).

| Versie | Focus |
|--------|-------|
| v0.1 | MVP |
| v0.2 | Tarieven & jobs |
| v0.3 | Projecten & facturen |
| v0.4 | Live feeds |
| v0.5 | Slack |
| v0.6 | Video niche |
| **v1.0** | **Compleet** |
