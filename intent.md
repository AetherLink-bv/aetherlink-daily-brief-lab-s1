# Intent — Daily brief agent

Status: you choose the user and the decision in Assignment 1. The other sections are written for this lab. The Maintain step adds `## Next iteration`.

## Outcome

### User and decision

- User: `TEMPLATE — who reads the morning brief.`
- Decision: `TEMPLATE — the first decision this person must make.`

`TEMPLATE — one observable result: how a sourced morning signal helps this user make that decision.`

## Success checks

Each check is one command or one look. A fresh reader can verify it without the author in the room.

- `npm run mini` prints one synthetic decision line.
- `npm run test:schema` passes for the valid sample and rejects one invalid sample.
- `npm run brief:sample` writes `out/latest.html` with every section of the brief.
- `npm run live:check` reports READY or an exact OPEN reason without contacting the source.
- `npm run eval` passes for a complete brief, a brief with missing evidence, and a brief with conflicting evidence.
- The private dated HTML brief names its sources, or live access remains OPEN.

## Boundary

- In scope: one approved read-only corporate source, the synthetic equivalent, and validated private HTML at `~/.bree/briefs/YYYY-MM-DD.html`.
- Out of scope: writing to a source, sending messages, changing tickets, public deployment, customer data, raw connector storage, and live output inside this repository.
- The model never invents a fact: a silent source gives `OPEN`, and sources that disagree give `CONFLICT`.
- Stop or escalate when: a write scope is offered, customer data appears, or the agent starts deciding instead of describing.

## Owners

| Role | Name | Responsibility |
| --- | --- | --- |
| Reader | The user named above | Reads the brief and makes the named decision |
| Builder | The participant (a person, not Claude) | Owns the contract, the code and the local proof |
| Gate | The participant (a person, not Claude) | Accepts or rejects each local result against this file |

## Evidence contract

The proof is in `docs/evidence.md`: every synthetic command with its real exit code, the page `out/latest.html`, and the `npm run live:check` preflight. In Assignment 6 you also run the previous and the current commit in separate worktrees. A private live run is recorded only as PASS or OPEN. Anything unrun is OPEN.

## OPEN

- Live source access: OPEN until the approved connection, the exact read-only tool and the model route are confirmed in Assignment 5.
- Add every other unknown here, one per line. Unknowns are written down, not guessed.

## Optional extension after the core route

The [voice extension](docs/voice-extension.md) is not part of the accepted Bree outcome. Start it only after A7 and the Maintain loop. It uses synthetic data, a personal ElevenLabs account, and a key stored only in ignored `.env.local`. It never reads or speaks live work data.
