# FreelanceBot (v0.1 MVP)

Een **simpele** AI-assistent voor freelancers. Drie stappen:

1. **Profiel** instellen (skills, tarief)
2. **Opdrachten** vinden die passen
3. **Proposal** schrijven die je direct kunt versturen

Gebouwd met [eve](https://eve.dev) + Next.js web chat.

## Wat zit erin (MVP)

| Tool | Wat het doet |
|------|--------------|
| `manage_profile` | Profiel bekijken/bijwerken |
| `search_jobs` | Opdrachten zoeken en matchen |
| `save_proposal` | Proposal opslaan |

Meer features komen later — zie [ROADMAP.md](./ROADMAP.md).

## Starten

```bash
fnm use 24          # Node.js 24+
cd ai-freelancer-bot
npm install
npm run dev:eve     # eve server → :2000
npm run dev         # web UI  → :3000
```

Zet `AI_GATEWAY_API_KEY` in `.env.local` voor live AI-antwoorden.

## Testen

```bash
npm run typecheck
npm run test
```

## Voorbeeldgesprek

```
Jij:    Ik ben senior Next.js developer, 5 jaar ervaring, €85/uur
Bot:    [stelt profiel in]

Jij:    Welke opdrachten passen bij mij?
Bot:    [toont gematchte jobs met scores]

Jij:    Schrijf een proposal voor job-001
Bot:    [genereert proposal, slaat op, klaar om te copy-pasten]
```

## Structuur

```
agent/
├── instructions.md
├── tools/           # 3 tools (MVP)
├── skills/          # proposal-writing
└── lib/             # state + 3 seed jobs
app/                 # web chat
future/              # code voor v0.2+ (nog niet actief)
ROADMAP.md
```

## Volgende stap

v0.2 voegt tariefberekening en handmatig jobs toevoegen toe. Zie [ROADMAP.md](./ROADMAP.md).
