# Evidence — Daily brief agent

## A6 part 2 replay, 25 November 2026

The check used revision `e8682b5` and the example configuration. Its Jira tool name is still a placeholder.

| Command | Exit code | Observed result |
| --- | --- | --- |
| `npm test` | 0 | 47 tests passed on the render host. |
| `npm run test:live` | 0 | 16 synthetic tests passed. |
| `npm run eval` | 0 | Four synthetic cases passed. |
| `npm run brief:sample` | 0 | `source: sample/brief.sample.json (synthetic)` |
| `npm run live:check` | 3 | `mcp.tool: replace the placeholder with the exact Jira read tool from /mcp` |

Live access stays OPEN. The replay made no Jira or model call.

## Original run, 24 November 2026

Cutoff: `2026-11-24 11:10 CET, revision 1f860cb plus the uncommitted A6 P2 changes`

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

Two temporary worktrees next to the project folder, 2026-11-24: `../daily-brief-previous` at `edfac27` (A6 P2, `HEAD^`) and `../daily-brief-current` at `3fddd63` (the A6 P3 commit before this evidence was added, `HEAD`).

| Folder | Commands | Exit code | Output line quoted |
| --- | --- | --- | --- |
| previous | `npm ci && npm run typecheck && npm test && npm run brief:sample` | 0 | `source: sample/brief.sample.json (synthetic)`; `ℹ pass 49` |
| current | `npm ci && npm run typecheck && npm test && npm run eval && npm run brief:sample` | 0 | `source: sample/brief.sample.json (synthetic)`; `ℹ pass 4` (eval) |

Both folders listed `out/latest.html` before removal. `cmp` reported the two pages identical (the commits differ only in documents), tally `5 READY · 1 OPEN · 1 CONFLICT` in both. Both worktrees were removed; `git worktree list` then shows only the project folder.

## Rollback proof

The temporary checkouts ended clean: after `git worktree remove` twice, `git status --short` printed nothing. A scratch line appended to `docs/evidence.md` showed ` M docs/evidence.md`; `git restore docs/evidence.md` returned `git status --short` to empty (0 lines).

## Visible result

`out/latest.html` (written by `npm run brief:sample`, ignored by git). Checked in a browser: title, date, greeting, the tally `5 READY · 1 OPEN · 1 CONFLICT`, six sections, per-item `Source:` lines, and the visible `OPEN` and `CONFLICT` items. The journey removed `out/` as its cleanup step; `npm run brief:sample` recreated it afterwards.

## Differences from the references

- `OPEN` states: the brief shows the item text and the state label; the reference example shows the same two.
- The sample brief's title is `The Wednesday Brief`, dated 2026-11-18. The reference example is `Maya's Daily Brief`, dated 2026-11-21. The three eval fixtures use the reference title and date.
- Live source: no Jira tool was inspected (`/mcp` unavailable), so the live route has only mocked evidence.

## Optional voice extension (synthetic, mocked)

| Claim | Command | Exit code | Output line quoted | Status |
| --- | --- | --- | --- | --- |
| The voice route works against a mocked response and spends no credits | `npm run test:voice` | 0 | `ℹ pass 9` | PASS |
| One spoken synthetic brief exists | `npm run brief:voice` | not run | not run (no personal key, no account) | OPEN |
| `npm run docs:check` after adding `src/voice.ts` | `npm run docs:check` | 1 | `AssertionError [ERR_ASSERTION]: only the trainer solution contains src/voice.ts` | FAIL (the repository's own check forbids the file the extension tells the participant to create) |

Input label for any future run: `sample/brief.sample.json` (synthetic). The key, request text and audio are not recorded.
