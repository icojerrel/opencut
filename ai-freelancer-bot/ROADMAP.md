# FreelanceBot — Roadmap

Incrementeel bouwen: elk stadium is een werkend product.

## v0.1 — MVP ✅

Profiel → jobs → proposal.

## v0.2 — Tarieven & eigen jobs ✅ (huidige versie)

| Component | Status |
|-----------|--------|
| `calculate_rate` | ✅ |
| `add_job` | ✅ |
| Skill: pricing-strategy | ✅ |

**Test:** *"Voeg een LinkedIn job toe. Wat moet ik vragen voor een medium AI project? Schrijf een proposal."*

---

## v0.3 — Projecten & facturen

- `track_project`
- `generate_invoice`
- Skill: client-communication

Code in `future/tools/` en `future/skills/`.

---

## v0.4 — Live job feeds

- `fetch_live_jobs` (Remotive, RemoteOK, Jobicy, Upwork)

Code in `future/lib/job-sources.ts`.

---

## v0.5 — Slack

Code in `future/channels/slack.ts` + `future/SLACK_SETUP.md`.

---

## v0.6 — Video editing niche

- `quote_video_project`
- Skill: video-editing-freelance

---

## Fase activeren

```bash
mv future/tools/<tool>.ts agent/tools/
mv future/skills/<skill> agent/skills/
# Update instructions.md, npm run test, ROADMAP.md
```
