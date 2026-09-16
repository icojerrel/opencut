# YouTube OAuth — desktop workaround (Cloud VM login failed)

Google sign-in in the Cloud Agent browser often fails (`Something went wrong`, recovery loops). Use **your own machine** for OAuth once; the agent uploads from the VM after that.

## A. One-time on your laptop/desktop

1. [Google Cloud Console](https://console.cloud.google.com/) → enable **YouTube Data API v3** + **YouTube Analytics API**.
2. OAuth consent → External → add your Google account as **test user**.
3. Credentials → **OAuth client ID** → **Desktop app** → download JSON.
4. Clone or copy the engine folder locally, or use this repo:

```bash
cd projects/why-we-do-this/faceless-video-engine
cp ~/Downloads/client_secret_*.json client_secret.json
pip install -r requirements.txt
python3 authorize.py
```

5. Sign in as the **Why We Do This** Brand Account channel → Allow.
6. Confirm `token.json` was created (same folder as `client_secret.json`).

## B. Add to Cursor Cloud secrets (never chat)

In [Cloud Agent environment secrets](https://cursor.com/dashboard/cloud-agents/environments):

| Secret | Value |
|--------|--------|
| `YOUTUBE_CLIENT_SECRET_JSON` | entire contents of `client_secret.json` |
| `YOUTUBE_TOKEN_JSON` | entire contents of `token.json` |

Save. Start a new agent run or reply **ga verder** — bootstrap writes both files and upload can run.

## C. Agent upload command

```bash
bash projects/why-we-do-this/bootstrap.sh
python3 projects/why-we-do-this/scripts/upload_short.py \
  projects/why-we-do-this/faceless-video-engine/output/short_20260913_070641.mp4 \
  --plan projects/why-we-do-this/plans/short_20260913_070641.plan.json
```

First upload is **unlisted** in config — set Public in Studio after review.

## D. Channel profile (Studio, any browser)

| Field | Value |
|-------|--------|
| Name | Why We Do This |
| Handle | @WhyWeDoThisPsy |
| Description | One psychology fact every day — why humans do things that make no sense. Named cognitive biases, classic experiments, and mind tricks explained in under a minute. New Short daily. |
