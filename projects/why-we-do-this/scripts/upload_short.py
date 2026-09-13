#!/usr/bin/env python3
"""Upload an existing Short MP4 without re-rendering. Requires OAuth (see YOUTUBE_LAUNCH.md)."""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "faceless-video-engine"
sys.path.insert(0, str(ROOT))


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload existing short_*.mp4 to YouTube")
    parser.add_argument("video", type=Path, help="Path to short_*.mp4")
    parser.add_argument("--plan", type=Path, help="plan.json (title, description, tags, ...)")
    parser.add_argument("--privacy", choices=("public", "unlisted", "private"), default=None)
    args = parser.parse_args()

    video = args.video.resolve()
    if not video.is_file():
        print(f"Video not found: {video}", file=sys.stderr)
        return 1

    config = json.loads((ROOT / "config.json").read_text(encoding="utf-8"))
    if args.privacy:
        config.setdefault("upload", {})["privacy"] = args.privacy

    if args.plan:
        plan = json.loads(args.plan.read_text(encoding="utf-8"))
    else:
        stamp = video.stem.replace("short_", "", 1)
        plan_path = ROOT / "work" / stamp / "plan.json"
        if plan_path.exists():
            plan = json.loads(plan_path.read_text(encoding="utf-8"))
        else:
            print(
                f"No plan.json for {video.name}. Pass --plan or restore work/{stamp}/plan.json",
                file=sys.stderr,
            )
            return 1

    from src import upload
    from run_daily import engage, log

    log(f"Uploading {video.name} as {config['upload'].get('privacy', 'public')}...")
    url = upload.upload_video(video, plan, config)
    log(f"LIVE: {url}")
    engage(url, plan)

    from src import script_gen

    script_gen.save_history_entry({
        "date": f"{datetime.now():%Y-%m-%d}",
        "topic": plan.get("topic", ""),
        "title": plan["title"],
        "file": video.name,
        "url": url,
    })
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
