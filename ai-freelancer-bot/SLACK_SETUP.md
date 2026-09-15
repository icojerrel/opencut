# Slack integratie (v0.5 — nog niet actief)

Verplaats `future/channels/slack.ts` naar `agent/channels/slack.ts` om te activeren.

## Environment variables

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
```

## Slack app

- Scopes: `app_mentions:read`, `chat:write`, `im:history`
- Event URL: `https://jouw-domein.com/eve/v1/slack`
- Events: `app_mention`, `message.im`

Zie eve docs: https://eve.dev/docs/channels/slack
