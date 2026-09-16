"""Karpathy-style nightly autoresearch loop for the video engine.

One small experiment per run:
  observe  -> recent logs, analytics, experiment history, current config
  propose  -> LLM picks ONE tunable change with a testable hypothesis
  test     -> rebuild with a fixed baseline script (--plan-file)
  score    -> heuristics (+ optional LLM judge)
  ratchet  -> keep improvement or revert; log everything

Auto-apply is OFF by default (observation mode). Set karpathy.auto_apply=true
in config.json to let kept experiments persist automatically.
"""
import argparse
import copy
import json
import re
import shutil
import subprocess
import sys
import traceback
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

from src import llm  # noqa: E402

LOG_DIR = ROOT / "logs"
DATA_DIR = ROOT / "data"
EXPERIMENT_LOG = DATA_DIR / "karpathy_experiments.jsonl"
BASELINE_PLAN = DATA_DIR / "baseline_plan.json"
CONFIG_FILE = ROOT / "config.json"
CONFIG_BACKUP_DIR = DATA_DIR / "config_backups"

# Only these dotted paths may be mutated by the loop.
TUNABLE_PATHS = {
    "tts.voice", "tts.rate", "tts.pitch", "tts.dynamic",
    "tts.prosody_intensity", "tts.bitrate",
    "video.clips_count", "video.transition_seconds", "video.music_volume",
    "video.ai_image_ratio", "video.ai_style", "video.target_seconds",
    "captions.font_size", "captions.words_per_chunk",
    "captions.highlight_color", "captions.primary_color",
}


def log(msg: str) -> None:
    line = f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}"
    print(line, flush=True)
    LOG_DIR.mkdir(exist_ok=True)
    with open(LOG_DIR / f"{datetime.now():%Y-%m}", "a", encoding="utf-8") as f:
        f.write(line + "\n")


def _get_nested(cfg: dict, path: str):
    cur = cfg
    for part in path.split("."):
        cur = cur[part]
    return cur


def _set_nested(cfg: dict, path: str, value) -> None:
    parts = path.split(".")
    cur = cfg
    for part in parts[:-1]:
        cur = cur.setdefault(part, {})
    cur[parts[-1]] = value


def _load_experiments(limit: int = 30) -> list:
    if not EXPERIMENT_LOG.exists():
        return []
    lines = EXPERIMENT_LOG.read_text(encoding="utf-8").strip().splitlines()
    out = []
    for line in lines[-limit:]:
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return out


def _strategy_stats(experiments: list) -> str:
    """Bias toward strategies that empirically keep improvements."""
    counts = {}
    for e in experiments:
        strat = e.get("strategy") or "unknown"
        counts.setdefault(strat, {"tried": 0, "kept": 0})
        counts[strat]["tried"] += 1
        if e.get("decision") == "kept":
            counts[strat]["kept"] += 1
    if not counts:
        return "(no experiment history yet)"
    lines = ["Strategy effectiveness (prefer promising > untried > avoid):"]
    for name, c in sorted(counts.items(), key=lambda t: (-t[1]["kept"] / max(t[1]["tried"], 1), -t[1]["tried"])):
        rate = 100 * c["kept"] / c["tried"]
        tag = "promising" if c["tried"] >= 3 and rate >= 40 else "avoid" if c["tried"] >= 5 and rate < 10 else "neutral"
        lines.append(f"- {name}: {c['kept']}/{c['tried']} kept ({rate:.0f}%) [{tag}]")
    return "\n".join(lines)


def _recent_logs(max_lines: int = 80) -> str:
    month = LOG_DIR / f"{datetime.now():%Y-%m}.log"
    if not month.exists():
        return "(no run logs yet)"
    lines = month.read_text(encoding="utf-8", errors="replace").splitlines()
    return "\n".join(lines[-max_lines:])


def _observe(config: dict) -> dict:
    experiments = _load_experiments()
    performance = ""
    try:
        from src import analytics
        performance = analytics.performance_block()
    except Exception as exc:
        performance = f"(analytics unavailable: {exc})"

    tunables = {p: _get_nested(config, p) for p in sorted(TUNABLE_PATHS) if _path_exists(config, p)}
    return {
        "tunables": tunables,
        "experiments": experiments[-10:],
        "strategy_stats": _strategy_stats(experiments),
        "recent_logs": _recent_logs(),
        "performance": performance,
        "baseline_plan_exists": BASELINE_PLAN.exists(),
    }


def _path_exists(cfg: dict, path: str) -> bool:
    try:
        _get_nested(cfg, path)
        return True
    except (KeyError, TypeError):
        return False


def _propose(config: dict, context: dict, dry_run: bool) -> dict | None:
    if dry_run:
        return {
            "path": "tts.rate",
            "old_value": config.get("tts", {}).get("rate", "+0%"),
            "new_value": "-3%",
            "hypothesis": "Dry run: slightly slower delivery should sound less robotic.",
            "strategy": "tts_slower",
        }

    prompt = f"""You are running a Karpathy-style autoresearch loop for a faceless YouTube Shorts engine.

Goal: propose exactly ONE small, measurable config change that could improve viewer retention or production quality.

Rules:
- Only change paths from this allowlist: {sorted(TUNABLE_PATHS)}
- One change only. No code edits. No niche/upload changes.
- Prefer strategies marked "promising" in the stats; avoid "avoid".
- If retention data shows weak hooks, tune tts/captions; if visuals feel generic, tune video.ai_*.

Current tunables:
{json.dumps(context['tunables'], indent=2)}

{context['strategy_stats']}

YouTube performance signal:
{context['performance']}

Recent pipeline logs:
{context['recent_logs'][-4000:]}

Recent experiments (do not repeat failed ideas):
{json.dumps(context['experiments'], indent=2)}

Return JSON only:
{{
  "path": "dotted.config.path",
  "old_value": <current value>,
  "new_value": <proposed value>,
  "hypothesis": "one sentence",
  "strategy": "short_snake_case_label"
}}"""
    proposal = llm.generate_json(prompt, config, model=llm.quality_model(config))
    path = str(proposal.get("path", "")).strip()
    if path not in TUNABLE_PATHS:
        raise RuntimeError(f"Proposal path not allowed: {path!r}")
    current = _get_nested(config, path)
    proposal["old_value"] = proposal.get("old_value", current)
    proposal["new_value"] = proposal.get("new_value", current)
    if proposal["new_value"] == current:
        raise RuntimeError(f"Proposal is a no-op for {path}")
    return proposal


def _backup_config() -> Path:
    CONFIG_BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest = CONFIG_BACKUP_DIR / f"config_{stamp}.json"
    shutil.copyfile(CONFIG_FILE, dest)
    return dest


def _apply_proposal(config: dict, proposal: dict) -> dict:
    updated = copy.deepcopy(config)
    _set_nested(updated, proposal["path"], proposal["new_value"])
    return updated


def _run_test_build(plan_file: Path) -> tuple[int, str, Path | None]:
    """Run pipeline with fixed plan; return (exit_code, combined_log, output_file)."""
    proc = subprocess.run(
        [sys.executable, str(ROOT / "run_daily.py"), "--no-upload", "--plan-file", str(plan_file)],
        cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace",
        timeout=3600,
    )
    combined = (proc.stdout or "") + (proc.stderr or "")
    out_file = None
    for line in combined.splitlines():
        if "saved:" in line:
            m = re.search(r"saved:\s*(/\S+\.mp4)", line)
            if m:
                out_file = Path(m.group(1))
    if out_file is None:
        outputs = sorted((ROOT / "output").glob("short_*.mp4"), key=lambda p: p.stat().st_mtime)
        if outputs:
            out_file = outputs[-1]
    return proc.returncode, combined, out_file


def _probe_video(path: Path) -> dict:
    proc = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration,size",
         "-of", "json", str(path)],
        capture_output=True, text=True, check=True,
    )
    info = json.loads(proc.stdout)["format"]
    return {"duration": float(info.get("duration", 0)), "size": int(info.get("size", 0))}


def _score(config: dict, proposal: dict, build_log: str, video: Path | None,
           baseline_score: float | None) -> tuple[float, dict]:
    target = float(config.get("video", {}).get("target_seconds", 50))
    details = {"checks": []}
    score = 0.0

    if "Rendered with Remotion" in build_log:
        score += 25
        details["checks"].append("remotion_ok")
    elif "ffmpeg fallback" in build_log:
        score += 10
        details["checks"].append("ffmpeg_fallback")

    if "FAILED" in build_log or "Traceback" in build_log:
        details["checks"].append("build_errors")
        return score, details

    if video and video.exists():
        meta = _probe_video(video)
        details["video"] = meta
        dur = meta["duration"]
        if 35 <= dur <= target + 20:
            score += 25
            details["checks"].append("duration_in_band")
        if meta["size"] > 1_000_000:
            score += 15
            details["checks"].append("file_size_ok")
    else:
        details["checks"].append("missing_output")
        return score, details

    # Reward hypotheses aligned with known pain points from user feedback.
    path = proposal.get("path", "")
    if path.startswith("tts."):
        score += 5
    if path.startswith("video.") or path.startswith("captions."):
        score += 5

    if baseline_score is not None and score >= baseline_score:
        score += 10
        details["checks"].append("beats_baseline")

    details["score"] = score
    return score, details


def _last_kept_score() -> float | None:
    for e in reversed(_load_experiments(50)):
        if e.get("decision") == "kept" and "score" in e:
            return float(e["score"])
    return None


def _write_experiment(entry: dict) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(EXPERIMENT_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def _write_review_packet(proposal: dict, score: float, details: dict, decision: str) -> Path:
    review_dir = DATA_DIR / "karpathy_review"
    review_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = review_dir / f"review_{stamp}.md"
    path.write_text(
        f"# Karpathy loop review — {stamp}\n\n"
        f"**Decision:** {decision}\n\n"
        f"**Change:** `{proposal['path']}`\n"
        f"- old: `{json.dumps(proposal.get('old_value'))}`\n"
        f"- new: `{json.dumps(proposal.get('new_value'))}`\n\n"
        f"**Hypothesis:** {proposal.get('hypothesis', '')}\n\n"
        f"**Strategy:** {proposal.get('strategy', '')}\n\n"
        f"**Score:** {score}\n\n"
        f"**Details:**\n```json\n{json.dumps(details, indent=2)}\n```\n",
        encoding="utf-8",
    )
    return path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Propose only; no build")
    parser.add_argument("--force-apply", action="store_true", help="Apply kept change even if auto_apply is false")
    args = parser.parse_args()

    if not CONFIG_FILE.exists():
        log("config.json missing — copy config.example.json first.")
        return 1

    config = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    karpathy = config.get("karpathy", {})
    if not karpathy.get("enabled", True):
        log("Karpathy loop disabled in config (karpathy.enabled=false).")
        return 0

    if not BASELINE_PLAN.exists():
        log("No baseline_plan.json yet — run a successful daily build first.")
        return 0

    log("Karpathy loop: observe...")
    context = _observe(config)

    log("Karpathy loop: propose...")
    try:
        proposal = _propose(config, context, dry_run=args.dry_run)
    except Exception as exc:
        log(f"Proposal failed: {exc}")
        return 1

    log(f"  change: {proposal['path']} -> {proposal['new_value']}")
    log(f"  hypothesis: {proposal.get('hypothesis', '')}")

    if args.dry_run:
        log("Dry run complete (no build).")
        return 0

    backup = _backup_config()
    trial_config = _apply_proposal(config, proposal)
    CONFIG_FILE.write_text(json.dumps(trial_config, indent=2) + "\n", encoding="utf-8")

    log("Karpathy loop: test build (--plan-file baseline)...")
    try:
        code, build_log, video = _run_test_build(BASELINE_PLAN)
    except subprocess.TimeoutExpired:
        shutil.copyfile(backup, CONFIG_FILE)
        log("Test build timed out — config reverted.")
        return 1

    baseline_score = _last_kept_score()
    score, details = _score(trial_config, proposal, build_log, video, baseline_score)
    log(f"  score: {score} (baseline: {baseline_score})")

    auto_apply = karpathy.get("auto_apply", False) or args.force_apply
    min_score = float(karpathy.get("min_score", 55))
    keep = code == 0 and score >= min_score and (baseline_score is None or score >= baseline_score)

    if keep and auto_apply:
        decision = "kept"
        log(f"  KEPT — config change applied ({proposal['path']})")
    else:
        shutil.copyfile(backup, CONFIG_FILE)
        decision = "reverted"
        reason = "observation mode" if not auto_apply else "score below threshold"
        log(f"  REVERTED — {reason}; review packet written")

    review = _write_review_packet(proposal, score, details, decision)
    log(f"  review: {review}")

    _write_experiment({
        "ts": datetime.now().isoformat(timespec="seconds"),
        "path": proposal["path"],
        "old_value": proposal.get("old_value"),
        "new_value": proposal.get("new_value"),
        "hypothesis": proposal.get("hypothesis"),
        "strategy": proposal.get("strategy"),
        "score": score,
        "baseline_score": baseline_score,
        "decision": decision,
        "auto_apply": auto_apply,
        "build_exit_code": code,
        "output": str(video) if video else None,
        "review": str(review),
    })
    log("Karpathy loop done.")
    return 0 if code == 0 else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        log("Karpathy loop FAILED:\n" + traceback.format_exc())
        sys.exit(1)
