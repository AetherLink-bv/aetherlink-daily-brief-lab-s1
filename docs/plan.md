# Plan — Daily brief agent

Status: `ACCEPTED 2026-11-24 by Maya (A3)`

Smallest complete slice: full synthetic HTML first (steps 1 and 2), then one exact read-only Jira tool through the same DailyBrief contract to a dated private HTML artifact (steps 3 to 5), then repeatable proof and a trigger proposal (steps 6 to 8).

All paths are relative to the repository root. One step is one commit.

## Ordered steps

| # | Step | Files | Proof command | Expected | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | A4 Part 1: renderer, test first | `test/render.test.ts`, `src/render.ts`, `src/main.ts` | `npm run test:render && npm run brief:sample` | Red first, then green; exit 0; `out/latest.html` holds every section and source label | Untrusted text reaches the page unescaped |
| 2 | A4 Part 2: one house-style detail, test first | `test/render.test.ts`, `src/render.ts` | `npm run test:render && npm run brief:sample` | New test red, then green; whole brief still renders | The change breaks another section |
| 3 | A5 Part 1: live boundary tests, red | `test/live.test.ts` | `npm run test:live` | Red: `src/live.ts` does not exist yet | The exact tool name is unknown until `/mcp` is inspected |
| 4 | A5 Part 2: bounded Agent SDK route | `src/live.ts`, `.bree.local.json` (ignored, never committed) | `npm run test:live && npm run live:check` | Tests green; `live:check` prints `READY` or an exact `OPEN` reason and contacts no source | A second tool or a write path becomes reachable |
| 5 | A5 Part 3: private live run, by a person only | `~/.bree/briefs/YYYY-MM-DD.html` (outside the repository) | `npm run brief:live` | `PASS` or `OPEN` recorded; contents never copied | Live data leaves the private path |
| 6 | A6 Part 1: three evidence cases | `test/eval.test.ts` | `npm run eval` | Complete, `OPEN` and `CONFLICT` briefs parse and render | An eval fixture contradicts the spec |
| 7 | A6 Part 2: verification skill and evidence | `.claude/skills/verify-bree/`, `docs/evidence.md`, `progress.md` | `npm run typecheck && npm test && npm run eval && npm run brief:sample`, then `npm run live:check` separately | Exit codes recorded; one synthetic journey cleaned up | A synthetic pass is read as live proof |
| 8 | A6 Part 3: trigger proposal, no scheduler installed | `docs/gate.md` | `git diff --stat` | Only documents change; nothing is installed | Someone activates a scheduler before approval |

## Rollback

Undo one step without touching the others: `git revert --no-edit <commit of that step>`. Each commit touches only the files named in its row. Generated output is not tracked: undo it with `rm -rf out`. Step 4 also leaves the ignored `.bree.local.json`; delete it with `rm .bree.local.json`. Step 5 leaves one private file; delete it with `rm ~/.bree/briefs/YYYY-MM-DD.html` (replace the date).

## Human gate

- Before step 1: Maya accepts `docs/design.md`, `docs/decisions/ADR-001-host-writes-validated-html.md` and this plan. Quote: "Approved."
- Before step 2: Maya names one house-style change.
- Before step 4: Maya approves the red tests and the one exact tool from step 3.
- Before step 5: a person approves step 4 and runs the command privately. The agent never runs `npm run brief:live`.
- Before step 8 is final: Maya reads the trigger proposal. Nothing is installed or activated.

## Evidence log outline

| Claim | Command | Exit code | Output line | Status |
| --- | --- | --- | --- | --- |
| Renderer escapes and shows every section | `npm run test:render` | OPEN | OPEN | OPEN |
| `out/latest.html` is written from synthetic data | `npm run brief:sample` | OPEN | OPEN | OPEN |
| Live boundary is enforced in code | `npm run test:live` | OPEN | OPEN | OPEN |
| Live preflight reports its own status | `npm run live:check` | OPEN | OPEN | OPEN |
| Private live artifact exists | `npm run brief:live` (run by a person) | OPEN | OPEN | OPEN |
| Complete, OPEN and CONFLICT cases hold | `npm run eval` | OPEN | OPEN | OPEN |

## Optional extension after A7

The [voice extension](voice-extension.md) starts a separate, optional iteration after the core route and Maintain loop. It has its own boundary and red-then-green test. It is not required for Day 5 approval.
