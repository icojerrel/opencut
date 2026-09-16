# Aan de slag met FreelanceBot

## 1. Installatie

```bash
fnm use 24   # of nvm use 24
cd ai-freelancer-bot
npm install
```

## 2. Credentials

Maak `.env.local`:

```bash
AI_GATEWAY_API_KEY=jouw-key   # https://vercel.com/dashboard/ai/api-keys
```

Optioneel (Slack):

```bash
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
```

## 3. Starten

Twee terminals:

```bash
npm run dev:eve   # terminal 1 → http://127.0.0.1:2000
npm run dev       # terminal 2 → http://localhost:3000
```

## 4. Eerste gesprek

Open http://localhost:3000 en klik een **snelkoppeling**:

- **Profiel instellen** — skills + tarief
- **Jobs zoeken** — match op profiel
- **Live jobs** — ophalen van Jobicy/Remotive
- **Proposal schrijven** — klaar om te versturen

Of typ zelf:

> *"Ik ben video editor, €75/uur. Haal live jobs op, quote 5 Shorts/week, schrijf proposal voor job-004."*

## 5. Persistente data

Alles wat je opslaat (profiel, jobs, proposals) blijft bewaard in:

```
data/freelancer-data.json
```

Deze map staat in `.gitignore` — jouw data gaat niet mee in git.

## 6. Deploy op Vercel

Zie **[DEPLOY.md](./DEPLOY.md)** voor de volledige gids.

Kort:

1. [vercel.com/new](https://vercel.com/new) → import repo
2. **Root Directory:** `ai-freelancer-bot`
3. Env var: `AI_GATEWAY_API_KEY`
4. Deploy

Of via CLI: `vercel --prod` vanuit `ai-freelancer-bot/`.

Slack: zie [SLACK_SETUP.md](./SLACK_SETUP.md).

## Problemen?

| Fout | Oplossing |
|------|-----------|
| `AI Gateway received no credentials` | Zet `AI_GATEWAY_API_KEY` in `.env.local`, herstart dev servers |
| Node `<24` | `fnm install 24 && fnm use 24` |
| Upwork live jobs leeg | Normaal (Cloudflare). Gebruik Jobicy/Remotive of `add_job` |
