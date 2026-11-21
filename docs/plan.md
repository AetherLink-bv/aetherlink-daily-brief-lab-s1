# Plan — Daily brief agent

Status: `ACCEPTED — fictional participant, 2026-11-21`

Smallest complete slice: full synthetic HTML first, then one exact read-only Jira tool through the same contract to dated private HTML.

## Ordered steps

| # | Step | Files | Proof command | Expected | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Validate the schema | `src/brief.ts`, `test/schema.test.ts` | `npm run test:schema` | Valid sample passes; invalid sample fails | Contract mismatch |
| 2 | Render the synthetic brief | `src/render.ts`, `src/main.ts`, `test/render.test.ts` | `npm run test:render && npm run brief:sample` | Complete escaped HTML | Missing section |
| 3 | Hold the live boundary | `src/live.ts`, `test/live.test.ts` | `npm run test:live && npm run live:check` | Tests pass; preflight READY or exact OPEN | Wrong tool scope |
| 4 | Evaluate uncertainty | `test/eval.test.ts`, `sample/eval/*` | `npm run eval` | Ordinary, OPEN, CONFLICT pass | Silent invention |
| 5 | Verify the journey | `.claude/skills/verify-bree/*`, `docs/evidence.md` | `npm run typecheck && npm test` | Repeatable synthetic proof | Stale commands |

## Rollback

Revert the single commit for the failed step. Run the preceding step's proof command. Temporary worktrees compare `HEAD^` and `HEAD` without switching the participant checkout.

## Human gate

The fictional participant accepted this plan with: “Approved. Keep live proof OPEN until the exact Jira tool and Vertex route are confirmed.”

## Evidence log outline

| Claim | Command | Exit code | Output line | Status |
| --- | --- | --- | --- | --- |
| `TEMPLATE` | `TEMPLATE` | `OPEN` | `OPEN` | `OPEN` |

## Optional extension after A7

The [voice extension](voice-extension.md) starts a separate, optional iteration after the core route and Maintain loop. It has its own boundary and red-then-green test. It is not required for Day 5 approval.
