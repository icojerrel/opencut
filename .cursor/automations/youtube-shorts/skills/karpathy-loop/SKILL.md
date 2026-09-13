---
name: wwdt-karpathy-loop
description: Nightly Karpathy autoresearch — one config experiment per run.
---

# Karpathy loop automation

## Steps

0. CoS handoff enabled → run `skills/cos-inbox/SKILL.md`.
1. `bash /workspace/.cursor/automations/youtube-shorts/bootstrap.sh`
2. `cd /workspace/faceless-video-engine`
3. If `data/baseline_plan.json` is missing, run one `--no-upload` daily build first to seed it, then continue.
4. `python3 run_karpathy_loop.py`
5. Read the latest file in `data/karpathy_review/` and summarize: proposed change, score, kept vs reverted.
6. If `karpathy.auto_apply` is false (default), confirm config was reverted after the experiment.

## Quality bar

- One experiment only; do not manually edit config beyond what the loop proposes
- Never change niche, upload settings, or API keys in experiments
- If score beats baseline three nights in a row, recommend enabling `karpathy.auto_apply` to the user
