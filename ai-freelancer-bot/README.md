# FreelanceBot (v0.2)

AI-assistent voor freelancers. Vier stappen:

1. **Profiel** instellen
2. **Opdrachten** vinden of toevoegen
3. **Tarief** berekenen
4. **Proposal** schrijven

Gebouwd met [eve](https://eve.dev) + Next.js web chat.

## Tools (v0.2)

| Tool | Functie |
|------|---------|
| `manage_profile` | Profiel bekijken/bijwerken |
| `search_jobs` | Opdrachten zoeken en matchen |
| `add_job` | Opdracht handmatig toevoegen |
| `calculate_rate` | Uurtarief berekenen |
| `save_proposal` | Proposal opslaan |

Skills: `proposal-writing`, `pricing-strategy`

Volgende fases: [ROADMAP.md](./ROADMAP.md)

## Starten

```bash
fnm use 24
cd ai-freelancer-bot
npm install
npm run dev:eve     # :2000
npm run dev         # :3000
```

`AI_GATEWAY_API_KEY` in `.env.local` voor live AI-antwoorden.

## Testen

```bash
npm run typecheck && npm run test
```

## Voorbeeldgesprek

```
Jij:    Ik ben Next.js developer, 5 jaar, €85/uur
Bot:    [profiel opgeslagen]

Jij:    Welke jobs passen? En wat moet ik vragen voor job-002?
Bot:    [matches + tariefadvies via calculate_rate]

Jij:    Ik vond een job op LinkedIn: "React dashboard, €70/uur, klant Acme"
Bot:    [add_job → search_jobs]

Jij:    Schrijf proposal voor die job
Bot:    [proposal klaar om te versturen]
```
