# CoS / Grokbot email handoff

## Problem this fixes

Mail **from** `icojerrel-cos@agentmail.to` **to** Gmail never lands in the CoS inbox. Grokbot reads **incoming** mail at `icojerrel-cos@agentmail.to`; outbound mail from that address is invisible to CoS.

## Correct topology

| Role | Inbox | Direction |
|------|-------|-----------|
| **OpenCut Agent** (this automation) | `icojerrel-opencut@agentmail.to` | Sends **to** CoS |
| **Chief of Staff / Grokbot** | `icojerrel-cos@agentmail.to` | Receives, replies |
| **Human (optional CC)** | `icojerrel@gmail.com` | CC on important handoffs only |

One inbox per agent — never send handoff mail **from** the CoS inbox.

## Sending rules

1. **From:** always `icojerrel-opencut@agentmail.to`
2. **To:** `icojerrel-cos@agentmail.to`
3. **Subject:** use a fresh, scannable prefix — e.g. `[OpenCut → CoS] <topic>`
4. **Do not** `replyAll` on old CoS threads unless continuing the exact same topic
5. **CC** `icojerrel@gmail.com` only when the user asked for human visibility
6. Tag CoS/Grokbot in the body: `@Grokbot` or `Manager X` when X/social is involved
7. Never put API keys or secrets in email

## Subject conventions

| Prefix | Use when |
|--------|----------|
| `[OpenCut → CoS]` | General handoff, questions, status |
| `[OpenCut → CoS] URGENT` | Blocker needs human/CoS action today |
| `[OpenCut → CoS] ACK` | Confirming receipt of CoS instruction |

## What CoS should see

After a correct send, the message appears in the CoS inbox with label `received` and sender `OpenCut Agent <icojerrel-opencut@agentmail.to>`.

## Example (MCP)

```
send_message
  inboxId: icojerrel-opencut@agentmail.to
  to: ["icojerrel-cos@agentmail.to"]
  subject: "[OpenCut → CoS] X-account intel — ACK gevraagd"
  text: ...
```

## Related

- Channel config: `config.channel.json`
- Agent rules: `FOR_AGENTS.md`
