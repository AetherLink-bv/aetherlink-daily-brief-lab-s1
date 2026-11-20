# Evidence — Daily brief agent

Cutoff: `2026-11-20, local solution walkthrough`

Every row is a claim with the command that proves it, the exit code you saw and
one quoted output line. A command nobody ran is `OPEN`, never a failure or pass.

| Claim | Command | Exit code | Output line quoted | Status |
| --- | --- | --- | --- | --- |
| The types hold | `npm run typecheck` | `0` | `tsc --noEmit` | `VERIFIED` |
| All tests hold | `npm test` | `0` | `pass 9` | `VERIFIED` |
| Three eval cases hold | `npm run eval` | `0` | `pass 3` | `VERIFIED` |
| The page renders | `npm run brief:sample` | `0` | `WROTE out/latest.html` | `VERIFIED` |

## Fresh local checkout

`OPEN — recorded after the A6 commit is exercised in detached worktrees.`

## Rollback proof

`OPEN — recorded after the previous A5 commit and current A6 commit both run.`

## Visible result

`out/latest.html — contains Maya and the 09:00 decision line.`

## Differences from the references

- `OPEN — one difference per line; a difference is an observation, not a failure.`
