---
name: wwdt-daily-short
description: Daily YouTube Short for Why We Do This — generate, render, upload.
---

# Daily Short automation

## Steps

1. `bash /workspace/.cursor/automations/youtube-shorts/bootstrap.sh`
2. `cd /workspace/faceless-video-engine`
3. Run recovery first: `python3 run_daily.py --recover-only || true`
4. Full pipeline: `python3 run_daily.py`
5. If upload fails due to missing OAuth, rerun with `--no-upload`, report the output path, and note that `authorize.py` is needed.
6. Report: topic, title, duration, renderer (Remotion vs ffmpeg), YouTube URL or local output path.

## Quality bar

- Target ~50s (config `video.target_seconds`)
- Remotion renderer preferred; investigate if ffmpeg fallback occurs twice in a row
- Do not upload twice on the same calendar day if history already shows a live URL for today
