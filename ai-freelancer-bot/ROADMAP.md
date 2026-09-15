# FreelanceBot — Roadmap

We bouwen **incrementeel**: elk stadium is een werkend product.

## v0.1 — MVP (huidige versie)

**Doel:** Profiel → jobs vinden → proposal schrijven.

| Component | Status |
|-----------|--------|
| Web chat | ✅ |
| `manage_profile` | ✅ |
| `search_jobs` | ✅ |
| `save_proposal` | ✅ |
| Skill: proposal-writing | ✅ |
| 3 seed jobs | ✅ |

**Test:** *"Ik ben Next.js developer, €85/uur. Welke jobs passen? Schrijf een proposal voor job-001."*

---

## v0.2 — Tarieven & eigen jobs

- `calculate_rate` — uurtarief berekenen
- `add_job` — opdrachten handmatig toevoegen
- Skill: pricing-strategy

Code klaar in `future/tools/` en `future/skills/`.

---

## v0.3 — Projecten & facturen

- `track_project` — uren en deadlines
- `generate_invoice` — factuur genereren
- Skill: client-communication

---

## v0.4 — Live job feeds

- `fetch_live_jobs` — Remotive, RemoteOK, Jobicy, Upwork
- Import naar lokale job board

Code klaar in `future/lib/job-sources.ts` en `future/tools/fetch_live_jobs.ts`.

---

## v0.5 — Slack

- Slack channel voor @mentions en DMs
- Setup: `future/docs/SLACK_SETUP.md`

---

## v0.6 — Video editing niche

- `quote_video_project` — video offertes
- Skill: video-editing-freelance
- Extra seed jobs

---

## Hoe een fase activeren

1. Verplaats bestanden van `future/` terug naar `agent/`
2. Update `agent/instructions.md`
3. Run `npm run test`
4. Update dit roadmap-document
