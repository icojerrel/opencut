# Why We Do This — YouTube Shorts project

Self-contained automation project for the **Psychology & Human Behavior** Shorts channel. Lives separately from the OpenCut editor apps under `apps/`.

## Layout

```
projects/why-we-do-this/
├── bootstrap.sh           # clone engine + apply channel overlay
├── config.channel.json    # niche, voice, visuals, schedule
├── faceless-video-engine/ # cloned at runtime (gitignored)
├── overlay/               # quality patches applied to engine on bootstrap
├── skills/                # Cursor automation skill files
├── COS_HANDOFF.md         # two-way email with CoS / Grokbot
└── FOR_AGENTS.md          # shared agent rules
```

## Quick start

```bash
bash projects/why-we-do-this/bootstrap.sh
cd projects/why-we-do-this/faceless-video-engine
python3 run_daily.py --no-upload
```

## Email (CoS handoff)

| Role | Inbox |
|------|-------|
| This project (OpenCut Agent) | `icojerrel-opencut@agentmail.to` |
| Chief of Staff / Grokbot | `icojerrel-cos@agentmail.to` |

See `COS_HANDOFF.md` and `skills/cos-inbox/SKILL.md`.

## Related repos

- **OpenCut editor rewrite:** `apps/` in this monorepo
- **Video engine upstream:** [Mystery-CLI/faceless-video-engine](https://github.com/Mystery-CLI/faceless-video-engine)
