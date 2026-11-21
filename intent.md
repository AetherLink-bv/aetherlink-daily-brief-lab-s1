# Intent — Daily brief agent

Status: `ACCEPTED — 2026-11-21`

## Outcome

### User and decision

- User: Maya, a fictional release coordinator who reads the brief before stand-up.
- Decision: Choose which blocker to bring to the 09:00 stand-up.

The synthetic decision line names the meeting and decision; the complete brief traces the selected blocker to a source.

## Success checks

- [ ] `npm test` validates the complete contract, renderer, and bounded routes.
- [ ] `npm run brief:sample` writes a complete synthetic brief to `out/latest.html`.
- [ ] Every READY or CONFLICT item resolves to a listed source.
- [ ] `npm run mini prints one synthetic decision line.`
- [ ] `npm run live:check reports READY or an exact OPEN reason without contacting the source.`
- [ ] `TEMPLATE — the private dated HTML brief names its sources, or live access remains OPEN.`

## Boundary

- In scope: one approved read-only Jira tool, synthetic fixtures, and validated private HTML at `~/.bree/briefs/YYYY-MM-DD.html`.
- Out of scope: writing to a source, sending messages, changing tickets, public deployment, customer data, raw connector storage, and live output inside this repository.
- The model never invents a fact: unavailable evidence produces an OPEN item.
- Stop or escalate when a write scope appears, customer data appears, or permission is unclear.

## Owners

| Role | Name | Responsibility |
| --- | --- | --- |
| Reader | Maya | Reads the brief and makes the named decision |
| Builder | Fictional participant | Owns the contract, the code and the local proof |
| Gate | Fictional participant | Accepts or rejects each local result against this file |

## Evidence contract

Require the named synthetic commands, `out/latest.html`, `live:check`, and worktree checks. Anything unrun is OPEN.

## OPEN

- Exact approved Jira tool, Vertex access, and private live run remain OPEN.

## Optional extension after the core route

The [voice extension](docs/voice-extension.md) is not part of the accepted Bree outcome. Start it only after A7 and the Maintain loop. It uses synthetic data, a personal ElevenLabs account, and a key stored only in ignored `.env.local`. It never reads or speaks live work data.
