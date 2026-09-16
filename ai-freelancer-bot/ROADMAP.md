# FreelanceBot — Roadmap

Alle fases zijn **afgerond**. Het product is feature-complete v1.0.

## v0.1 — MVP ✅

Profiel → jobs zoeken → proposal schrijven.

- `manage_profile`, `search_jobs`, `save_proposal`
- Skill: `proposal-writing`

## v0.2 — Tarieven & eigen jobs ✅

- `calculate_rate`, `add_job`
- Skill: `pricing-strategy`

## v0.3 — Projecten & facturen ✅

- `track_project`, `generate_invoice`
- Skill: `client-communication`

## v0.4 — Live job feeds ✅

- `fetch_live_jobs` — Remotive, RemoteOK, Jobicy, Arbeitnow, Upwork RSS

## v0.5 — Slack ✅

- `agent/channels/slack.ts`
- Setup: [SLACK_SETUP.md](./SLACK_SETUP.md)

## v0.6 — Video editing niche ✅

- `quote_video_project`
- Skill: `video-editing-freelance`
- 3 video seed jobs (job-004 t/m job-006)

---

## v1.0 — Compleet

**10 tools · 5 skills · 2 kanalen · 6 seed jobs**

```bash
npm run test   # alle tests
npm run dev:eve && npm run dev
```

### End-to-end voorbeeld

> *"Profiel: video editor, Remotion + Premiere, €75/uur. Haal live video jobs op. Quote 5 Shorts/week. Schrijf proposal. Start project. Maak factuur 32u × €75."*

---

## v2.0 — Persistente data ✅

Profiel, jobs, proposals, projecten en facturen worden opgeslagen in `data/freelancer-data.json` en overleven server-restarts en nieuwe chats.

## v2.1 — Toekomst (optioneel)

| Feature | Beschrijving |
|---------|--------------|
| Job alerts | Dagelijkse Slack/e-mail digest via eve schedules |
| Evals | Automatische kwaliteitscheck op proposals |
| Multi-user auth | Per gebruiker profiel en data |
| Platform OAuth | Directe Upwork/Fiverr koppeling (indien API beschikbaar) |
| Vercel deploy | Productie hosting via `eve deploy` |
