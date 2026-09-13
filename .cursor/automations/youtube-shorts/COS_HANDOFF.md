# CoS / Grokbot — tweerichtings email

## Het probleem (opgelost)

| Fout patroon | Gevolg |
|--------------|--------|
| Mail **van** `icojerrel-cos@` **naar** Gmail | CoS ziet niets in eigen inbox |
| CoS antwoordt alleen naar Gmail | OpenCut ziet geen reply |
| `replyAll` op oude mixed threads | Verkeerde ontvangers, topics vermengd |

## Correcte topologie (tweerichtings)

```
┌─────────────────────┐         send          ┌─────────────────────┐
│  OpenCut Agent      │ ────────────────────► │  CoS / Grokbot      │
│  icojerrel-opencut@ │ ◄──────────────────── │  icojerrel-cos@     │
└─────────────────────┘         reply         └─────────────────────┘
         ▲                                              ▲
         │ leest incoming                             │ leest incoming
         └──────────────────────────────────────────────┘
```

| Rol | Inbox | Leest | Verstuurt naar |
|-----|-------|-------|----------------|
| **OpenCut Agent** | `icojerrel-opencut@agentmail.to` | CoS-replies | `icojerrel-cos@agentmail.to` |
| **CoS / Grokbot / Manager X** | `icojerrel-cos@agentmail.to` | OpenCut-vragen | `icojerrel-opencut@agentmail.to` |
| **Human (optioneel CC)** | `icojerrel@gmail.com` | — | alleen bij expliciet verzoek |

**Regel:** één inbox per agent. Handoff-mail nooit **from** de CoS-inbox.

---

## Voor OpenCut Agent (elke run)

1. Voer `skills/cos-inbox/SKILL.md` uit **vóór** pipeline-werk.
2. Verwerk unread mail van `icojerrel-cos@agentmail.to`.
3. Antwoord in-thread via `reply_to_message` from `icojerrel-opencut@`.
4. Label afgehandelde berichten `processed`.

---

## Voor CoS / Grokbot (configuratie)

Grokbot moet:

1. **Inbox polling:** `icojerrel-cos@agentmail.to` lezen op unread/received.
2. **Antwoorden naar:** `icojerrel-opencut@agentmail.to` (niet alleen Gmail).
3. **Subject:** `[CoS → OpenCut] <topic>` of reply in bestaande thread.
4. **Inhoud:** ACK + instructies + blockers. Tag `@Grokbot` / Manager X waar relevant.
5. **Geen secrets** in mail — verwijs naar vault/secret-card.

### Voorbeeld CoS-reply

```
To: icojerrel-opencut@agentmail.to
Subject: Re: [OpenCut → CoS] X-account intel + Twitter posts — ACK gevraagd

[CoS → OpenCut] ACK

1. X handle: @WhyWeDoThisPsy — 847 followers, analytics in vault entry "x-wwdt"
2. Posts A–D: draft only until user approves live posting
3. Cross-promo: Short teaser on X OK; no YouTube link in first 30 days

— Chief of Staff
```

---

## Subject-prefixen

| Richting | Prefix | Wanneer |
|----------|--------|---------|
| OpenCut → CoS | `[OpenCut → CoS]` | Vragen, status, handoff |
| CoS → OpenCut | `[CoS → OpenCut]` | Antwoorden, instructies |
| Urgent | `… URGENT` | Blocker vandaag |

---

## Verificatie

**OpenCut → CoS gelukt** als CoS-inbox toont:
- label `received` + `unread`
- sender `OpenCut Agent <icojerrel-opencut@agentmail.to>`

**CoS → OpenCut gelukt** als OpenCut-inbox toont:
- label `received` + `unread`
- sender `Chief of Staff <icojerrel-cos@agentmail.to>`

---

## MCP-voorbeelden

**OpenCut vraagt CoS:**

```
send_message
  inboxId: icojerrel-opencut@agentmail.to
  to: ["icojerrel-cos@agentmail.to"]
  subject: "[OpenCut → CoS] <topic>"
```

**OpenCut antwoordt op CoS:**

```
reply_to_message
  inboxId: icojerrel-opencut@agentmail.to
  messageId: <cos message id>
  to: ["icojerrel-cos@agentmail.to"]
```

---

## Actieve threads (referentie)

| Thread ID | Onderwerp | Status |
|-----------|-----------|--------|
| `53935ad9-427a-48f8-a71d-88b41f4a2a08` | X-account intel + Twitter posts | wacht op CoS ACK |

---

## Related

- Inbox loop skill: `skills/cos-inbox/SKILL.md`
- Agent rules: `FOR_AGENTS.md`
- Channel config: `config.channel.json`
