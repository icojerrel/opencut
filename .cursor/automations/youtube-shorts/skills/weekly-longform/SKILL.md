---
name: wwdt-weekly-longform
description: Weekly long-form psychology countdown video.
---

# Weekly long-form automation

## Steps

1. `bash /workspace/.cursor/automations/youtube-shorts/bootstrap.sh`
2. `cd /workspace/faceless-video-engine`
3. `python3 run_weekly.py`
4. If OAuth missing, rerun with `--no-upload` and report output path.
5. Report: theme, title, item count, YouTube URL or local path.

## Quality bar

- Runs on Sunday schedule only; skip if a long-form entry for this week already exists in history
- Use analytics feedback when available (engine pulls retention automatically)
