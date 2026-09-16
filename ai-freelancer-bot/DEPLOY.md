# Deploy FreelanceBot op Vercel

## Optie A — Via Vercel Dashboard (aanbevolen)

### 1. Repository koppelen

1. Ga naar [vercel.com/new](https://vercel.com/new)
2. Importeer `icojerrel/opencut` (of jouw fork)
3. **Root Directory:** `ai-freelancer-bot` ← belangrijk!
4. Framework: **Next.js** (auto-detect)

### 2. Environment variables

| Variable | Verplicht | Beschrijving |
|----------|-----------|--------------|
| `AI_GATEWAY_API_KEY` | Ja* | [AI Gateway key](https://vercel.com/dashboard/ai/api-keys) |
| `SLACK_BOT_TOKEN` | Nee | Slack bot token |
| `SLACK_SIGNING_SECRET` | Nee | Slack signing secret |

\* Op Vercel werkt ook **OIDC** automatisch als het project gelinkt is — dan is geen aparte key nodig.

### 3. Deploy

Klik **Deploy**. Vercel bouwt met Node 24 (`engines` in package.json).

### 4. Verifiëren

```bash
curl https://jouw-project.vercel.app/eve/v1/health
```

Open de URL in de browser → FreelanceBot chat UI.

---

## Optie B — Via CLI

```bash
cd ai-freelancer-bot
npm i -g vercel@latest

# Eerste keer: link project
vercel link

# Environment variables
vercel env add AI_GATEWAY_API_KEY production

# Preview deploy
vercel

# Production
vercel --prod
```

Of met eve:

```bash
npx eve link --project freelancebot --non-interactive
npx eve deploy --non-interactive --yes
```

---

## Optie C — Git push (CI)

Elke push naar `main` triggert automatisch deploy als Vercel Git integration aan staat.

CI tests draaien via `.github/workflows/freelancebot-ci.yml`.

---

## Monorepo notities

Dit project zit in `opencut/ai-freelancer-bot/`. Zet altijd:

- **Root Directory:** `ai-freelancer-bot`
- **Node.js Version:** 24.x

---

## Persistente data op Vercel

Op Vercel wordt data opgeslagen in `/tmp` (ephemeral per serverless instance).

Voor **echte persistentie** in productie:

1. Voeg [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) of KV toe
2. Of gebruik een externe database

Lokaal blijft data in `data/freelancer-data.json`.

---

## Slack (optioneel)

Na deploy:

1. Slack app Request URL: `https://jouw-project.vercel.app/eve/v1/slack`
2. Zet `SLACK_BOT_TOKEN` + `SLACK_SIGNING_SECRET` in Vercel env vars

Zie [SLACK_SETUP.md](./SLACK_SETUP.md).

---

## Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| Build faalt op Node versie | Zet Node 24 in Vercel project settings |
| AI auth error | `AI_GATEWAY_API_KEY` toevoegen of OIDC inschakelen |
| 404 op `/eve/v1/*` | Controleer `withEve` in `next.config.ts` |
| Wrong project root | Root Directory = `ai-freelancer-bot` |
