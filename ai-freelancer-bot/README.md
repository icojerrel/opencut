# AI Freelancer Bot

Een AI-assistent voor freelancers, gebouwd met [eve](https://eve.dev). Helpt met opdrachten zoeken, proposals schrijven, tarieven berekenen, projecten bijhouden en facturen genereren.

## Features

| Feature | Tool / Skill |
|---------|--------------|
| Opdrachten zoeken & matchen | `search_jobs` |
| Opdracht toevoegen | `add_job` |
| Proposals schrijven | `proposal-writing` + `save_proposal` |
| Tarief berekenen | `pricing-strategy` + `calculate_rate` |
| Profiel beheren | `manage_profile` |
| Projecten tracken | `track_project` |
| Facturen genereren | `generate_invoice` |
| Klantcommunicatie | `client-communication` |

## Vereisten

- Node.js **24+**
- AI Gateway model (standaard: `openai/gpt-5.6-luna-fast`)

## Starten

```bash
# Node 24 (via fnm)
fnm use 24

cd ai-freelancer-bot
npm install
npm run dev          # Terminal REPL + eve server
```

Web chat UI (Next.js):

```bash
npm run dev          # eve dev start ook de Next.js app
# Open http://localhost:3000
```

## API (HTTP)

```bash
# Session aanmaken
curl -X POST http://localhost:3000/eve/v1/session

# Bericht sturen
curl -X POST http://localhost:3000/eve/v1/session/<sessionId> \
  -H "Content-Type: application/json" \
  -d '{"message": "Zoek Next.js opdrachten voor mij"}'
```

## Voorbeeldgesprekken

- *"Stel mijn profiel in: ik ben een senior Next.js developer, 8 jaar ervaring, €95/uur"*
- *"Welke opdrachten passen bij mijn profiel?"*
- *"Schrijf een proposal voor job-001"*
- *"Wat moet ik vragen voor een 40-uur AI integratie project?"*
- *"Maak een factuur voor TechFlow: 32 uur × €95"*

## Architectuur

```
agent/
├── instructions.md      # Systeemprompt (NL)
├── agent.ts             # Model config
├── tools/               # 7 typed tools
├── skills/              # 3 load-on-demand skills
└── lib/                 # State store + types
app/                     # Next.js web chat (eve channel/web)
```

Data wordt per sessie bewaard via eve `defineState` — profiel, opdrachten, proposals, projecten en facturen blijven beschikbaar tijdens het gesprek.

## Deploy

```bash
npm run deploy
```

Vereist een gekoppeld Vercel-project (`eve link`).
