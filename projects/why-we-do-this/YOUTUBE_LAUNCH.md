# YouTube launch — Why We Do This

First automated upload checklist for a **dedicated channel** (Brand Account under your Google account).

## 1. Create the channel (manual, ~5 min)

Use a **Brand Account** so the channel is separate from your personal Google identity:

1. Sign in to [YouTube Studio](https://studio.youtube.com) with the Google account that will own the channel.
2. Settings → **Channel** → **Advanced settings** → **Move channel to a Brand Account** (or create new channel).
3. Apply the profile below.

### Recommended profile

| Field | Value |
|-------|--------|
| **Channel name** | Why We Do This |
| **Handle** | `@WhyWeDoThisPsy` (or `@WhyWeDoThis` if available) |
| **Description** | One psychology fact every day — why humans do things that make no sense. Named cognitive biases, classic experiments, and mind tricks explained in under a minute. Follow for daily Shorts. 🧠 |
| **Links** | (optional later) X / AgentMail handoff — add when live |
| **Category vibe** | Education · Science & Technology |
| **Made for kids** | No |
| **Language** | English |

### Banner & avatar (optional day-one)

- **Avatar:** abstract brain / silhouette on purple (#1a0a2e) + gold accent (#ffd700)
- **Banner:** tagline *"Why humans do things that make no sense"* · cinematic purple/teal grade matching Shorts

## 2. Google Cloud OAuth (required for upload)

The engine uploads via **OAuth**, not `YOUTUBE_API_KEY` alone.

1. [Google Cloud Console](https://console.cloud.google.com/) → new or existing project.
2. Enable **YouTube Data API v3** + **YouTube Analytics API**.
3. OAuth consent screen → External → add your Google account as **test user**.
4. Credentials → **OAuth client ID** → **Desktop app** → download JSON.
5. Save as `projects/why-we-do-this/faceless-video-engine/client_secret.json` (never commit).
6. Authorize once (see below).

Store `client_secret.json` content as a Cloud Agent secret `YOUTUBE_CLIENT_SECRET_JSON` if you prefer not to copy files manually.

## 3. Authorize the pipeline (one time)

On a machine with a browser (Desktop VM or local):

```bash
cd projects/why-we-do-this/faceless-video-engine
python3 authorize.py
```

Sign in as the **Brand Account channel** you created. Confirm in Studio that uploads land on the right channel.

`token.json` is created beside `client_secret.json` — keep both gitignored.

## 4. First upload

**Recommended:** first run as **unlisted** to verify OAuth + metadata, then switch to `public`.

```bash
bash projects/why-we-do-this/bootstrap.sh
cd projects/why-we-do-this/faceless-video-engine

# Option A — upload latest rendered Short only (if plan exists in work dir)
python3 run_daily.py

# Option B — re-upload existing file (after --recover-only if needed)
# Ensure history doesn't block; use fresh run or recovery path in README
```

Pre-rendered candidate: `output/short_20260913_070641.mp4`  
Topic: **The Ironic Process Theory** · Title: *Why Your Brain Can't Forget on Command #Shorts*

### Upload settings (already in `config.channel.json`)

- Privacy: `public` (change to `unlisted` for smoke test)
- Category: 27 (Education)
- AI synthetic media disclosure: **on**
- Made for kids: **off**

## 5. After first upload

1. YouTube Studio → check video → set visibility to Public if you used unlisted.
2. Pin a comment or verify auto-comment from pipeline.
3. Add to playlist **Why We Do This** (created on first upload if missing).
4. Enable daily schedule (GitHub Actions or Cursor Automations).

## Blockers today

| Item | Status |
|------|--------|
| `client_secret.json` | Missing |
| `token.json` | Missing |
| Channel created | User action in Studio |
| Rendered Short ready | ✅ `short_20260913_070641.mp4` |
