#!/usr/bin/env python3
"""Create AgentMail webhook: message.received → Grokbot (CoS wake).

Reads credentials from environment only — never print secret values.
Required env:
  AGENTMAIL_API_KEY
  COS_GROKBOT_WEBHOOK_URL
  COS_GROKBOT_WEBHOOK_KEY
  COS_GROKBOT_WEBHOOK_BEARER
Optional:
  COS_WEBHOOK_INBOX_ID (default: icojerrel-cos@agentmail.to)
  COS_GROKBOT_WEBHOOK_KEY_HEADER (default: X-Webhook-Key)
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

API = "https://api.agentmail.to/v0/webhooks"


def require(name: str) -> str:
    val = os.environ.get(name, "").strip()
    if not val:
        print(f"MISSING_ENV:{name}", file=sys.stderr)
        sys.exit(2)
    return val


def main() -> None:
    api_key = require("AGENTMAIL_API_KEY")
    url = require("COS_GROKBOT_WEBHOOK_URL")
    key = require("COS_GROKBOT_WEBHOOK_KEY")
    bearer = require("COS_GROKBOT_WEBHOOK_BEARER")
    inbox_id = os.environ.get("COS_WEBHOOK_INBOX_ID", "icojerrel-cos@agentmail.to").strip()
    key_header = os.environ.get("COS_GROKBOT_WEBHOOK_KEY_HEADER", "X-Webhook-Key").strip()

    body = {
        "event_types": ["message.received"],
        "url": url,
        "inbox_ids": [inbox_id],
        "client_id": "cos-grokbot-wake-v1",
        "headers": {
            "Authorization": f"Bearer {bearer}",
            key_header: key,
        },
    }

    req = urllib.request.Request(
        API,
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"WEBHOOK_CREATE_FAILED:{e.code}", file=sys.stderr)
        print(err, file=sys.stderr)
        sys.exit(1)

    webhook_id = data.get("webhook_id", "?")
    print(f"WEBHOOK_CREATED:{webhook_id}")
    print(f"INBOX:{inbox_id}")
    print(f"EVENTS:message.received")


if __name__ == "__main__":
    main()
