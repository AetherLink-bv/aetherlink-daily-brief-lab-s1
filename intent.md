# Intent — Daily brief agent

Status: `TEMPLATE — complete before the spec`

## Outcome

### User and decision

- User: Maya, a team member who reads the brief at 08:30.
- Decision: Which blocker is the top one to bring to the 09:00 stand-up.

Observable result: the brief names one blocker with its source ID, so Maya walks into the 09:00 stand-up knowing what to ask for. If no blocker is sourced, the brief says `OPEN` and invents none.

## Success checks

- [ ] `TEMPLATE — a check a fresh reader can verify with one command or one look, without the author in the room.`
- [ ] `TEMPLATE`
- [ ] `TEMPLATE`
- [ ] `npm run mini prints one synthetic decision line.`
- [ ] `npm run live:check reports READY or an exact OPEN reason without contacting the source.`
- [ ] `TEMPLATE — the private dated HTML brief names its sources, or live access remains OPEN.`

## Boundary

- In scope: `TEMPLATE — one approved read-only corporate source, the synthetic equivalent, and validated private HTML at ~/.bree/briefs/YYYY-MM-DD.html.`
- Out of scope: writing to a source, sending messages, changing tickets, public deployment, customer data, raw connector storage, and live output inside this repository.
- The model never invents a fact: `TEMPLATE — what happens when a source is silent.`
- Stop or escalate when: `TEMPLATE — a write scope is offered, personal data appears, the agent starts deciding instead of describing.`

## Owners

| Role | Name | Responsibility |
| --- | --- | --- |
| Reader | `TEMPLATE` | Reads the brief and makes the named decision |
| Builder | `TEMPLATE` | Owns the contract, the code and the local proof |
| Gate | `TEMPLATE` | Accepts or rejects each local result against this file |

## Evidence contract

`TEMPLATE — which synthetic commands, output file, preflight, private live check, fresh-checkout result, and rollback proof are required. Anything unrun is OPEN.`

## OPEN

- `TEMPLATE — every unknown, one per line. Unknowns are written down, not guessed.`

## Next iteration

Observed result: `npm run live:check` exited 3 and printed `OPEN — live source proof is not ready:` with five reasons (approvals false, Jira tool placeholder, `AETHERLINK_JIRA_MCP_CONFIG` not set).

- Command: `npm run live:check`
- One safe output signal: the first line, `OPEN — live source proof is not ready:`, followed by reason lines that name configuration fields only, never source content.
- Remaining risk: live access is unproven. No Jira tool was inspected with `/mcp`, so the exact read-only tool and its issue-key field are unknown. `READY` would still not prove authentication or source access.
- One improvement: with the trainer-provided `AETHERLINK_JIRA_MCP_CONFIG`, inspect `/mcp`, record the exact read-only tool name in the ignored `.bree.local.json`, and set the three approvals only after each is confirmed.
- One check: `npm run live:check` prints `READY` and exits 0 on the participant's own machine, followed by one private `npm run brief:live` whose status is recorded as `PASS` or `OPEN` only.

## Optional extension after the core route

The [voice extension](docs/voice-extension.md) is not part of the accepted Bree outcome. Start it only after A7 and the Maintain loop. It uses synthetic data, a personal ElevenLabs account, and a key stored only in ignored `.env.local`. It never reads or speaks live work data.
