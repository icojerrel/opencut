# Slack integratie voor FreelanceBot

## Vereisten

1. Slack app aanmaken op https://api.slack.com/apps
2. Environment variables in `.env.local`:

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
AI_GATEWAY_API_KEY=your-ai-key
```

## Slack app configuratie

### OAuth Scopes (Bot Token)

- `app_mentions:read` — @mentions
- `chat:write` — antwoorden
- `im:history` — DM-geschiedenis
- `files:read` / `files:write` — optioneel voor bijlagen

### Event Subscriptions

Request URL: `https://jouw-domein.com/eve/v1/slack`

Events:
- `app_mention`
- `message.im` (voor DMs)

### Interactivity

Zelfde Request URL voor HITL-knoppen.

## Lokaal testen met ngrok

```bash
npm run dev:eve          # eve op :2000
ngrok http 2000          # publieke URL
# Update Slack Request URL naar https://xxx.ngrok.io/eve/v1/slack
```

## Gebruik in Slack

- `@FreelanceBot welke video editing opdrachten zijn er live?`
- `@FreelanceBot schrijf een proposal voor job-006`
- `@FreelanceBot bereken offerte voor 5 YouTube Shorts per week`
- DM: stel profiel in, zoek jobs, genereer facturen

## Vercel Connect (productie)

```bash
npx eve link
npx eve deploy
```

Vercel Connect beheert tokens automatisch — geen handmatige `SLACK_BOT_TOKEN` nodig.
