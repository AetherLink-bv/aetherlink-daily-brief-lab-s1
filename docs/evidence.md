# Evidence — Daily brief agent

Cutoff: `TEMPLATE — YYYY-MM-DD HH:MM TZ, revision`

Every row is a claim with the command that proves it, the exit code you saw and
one quoted output line. A command nobody ran is `OPEN`, never a failure or pass.

| Claim | Command | Exit code | Output line quoted | Status |
| --- | --- | --- | --- | --- |
| `TEMPLATE — the types hold` | `npm run typecheck` | `OPEN` | `OPEN` | `OPEN` |
| `TEMPLATE — all tests hold` | `npm test` | `OPEN` | `OPEN` | `OPEN` |
| `TEMPLATE — three eval cases hold` | `npm run eval` | `OPEN` | `OPEN` | `OPEN` |
| `TEMPLATE — the page renders` | `npm run brief:sample` | `OPEN` | `OPEN` | `OPEN` |

## Fresh local checkout

`TEMPLATE — path, commit, commands, exit codes, output path.`

## Rollback proof

`TEMPLATE — the temporary checkout ended clean after restoring docs/evidence.md from HEAD.`

## Visible result

`TEMPLATE — path to out/latest.html and what the participant checked.`

## Differences from the references

- `OPEN — one difference per line; a difference is an observation, not a failure.`
