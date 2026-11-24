# Evidence — Daily brief agent

Cutoff: `2026-11-24 11:10 CET, revision 1f860cb plus the uncommitted A6 P2 changes (the commit that holds this file)`

Every row is a claim with the command that proves it, the exit code you saw and
one quoted output line. A command nobody ran is `OPEN`, never a failure or pass.

| Claim | Command | Exit code | Output line quoted | Status |
| --- | --- | --- | --- | --- |
| The types hold | `npm run typecheck` | 0 | `tsc --noEmit` (no error lines) | PASS |
| All tests hold | `npm test` | 0 | `ℹ pass 49` | PASS |
| Three eval cases hold | `npm run eval` | 0 | `ℹ pass 4` | PASS |
| The page renders from synthetic data | `npm run brief:sample` | 0 | `source: sample/brief.sample.json (synthetic)` | PASS |
| Live preflight reports its own status, contacting nothing | `npm run live:check` | 3 | `OPEN — live source proof is not ready:` | OPEN (the documented honest status; not a failure of the synthetic route) |
| Live boundary holds in code (mocked) | `npm run test:live` | 0 | `ℹ pass 18` | PASS |
| One synthetic journey: launch, doctor, drive, evidence, cleanup | `bash .claude/skills/verify-bree/journey.sh <evidence-file>` | 0 | `journey result: PASS` | PASS |
| Private dated artifact exists | `npm run brief:live` (a person runs it) | not run | not run | OPEN |

Exit code 3 for `live:check` is this repository's choice (`EXIT_OPEN` in `src/live.ts`): 0 = `READY`, 3 = `OPEN`. The synthetic proof above does not prove authentication, the Jira connection or the model route. Those stay `OPEN`.

## Fresh local checkout

`OPEN — filled in A6 Part 3, which runs the previous and current commits in temporary worktrees.`

## Rollback proof

`OPEN — filled in A6 Part 3.`

## Visible result

`out/latest.html` (written by `npm run brief:sample`, ignored by git). Checked in a browser: title, date, greeting, the tally `5 READY · 1 OPEN · 1 CONFLICT`, six sections, per-item `Source:` lines, and the visible `OPEN` and `CONFLICT` items. The journey removed `out/` as its cleanup step; `npm run brief:sample` recreated it afterwards.

## Differences from the references

- `OPEN` states: the brief shows the item text and the state label; the reference example shows the same two.
- The sample brief's title is `The Wednesday Brief`, dated 2026-11-18. The reference example is `Maya's Daily Brief`, dated 2026-11-21. The three eval fixtures use the reference title and date.
- Live source: no Jira tool was inspected (`/mcp` unavailable), so the live route has only mocked evidence.
