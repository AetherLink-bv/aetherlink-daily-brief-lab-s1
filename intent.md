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

## Optional extension after the core route

The [voice extension](docs/voice-extension.md) is not part of the accepted Bree outcome. Start it only after A7 and the Maintain loop. It uses synthetic data, a personal ElevenLabs account, and a key stored only in ignored `.env.local`. It never reads or speaks live work data.
