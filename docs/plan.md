# Plan — Bree Daily Brief

Status: `TRAINER EXAMPLE — accepted plan`

## Ordered steps

| # | Step | Proof | Expected |
| --- | --- | --- | --- |
| 1 | Prove one synthetic decision line | `npm run test:mini && npm run mini` | Exact learning-slice line |
| 2 | Implement the full DailyBrief contract | `npm run test:schema` | Valid full sample passes; invalid sample fails |
| 3 | Review the complete route | `/visual-plan` | Accepted offline plan with gates and rollback |
| 4 | Render the complete synthetic product | `npm run test:render && npm run brief:sample` | Every section in escaped `out/latest.html` |
| 5 | Evaluate complete, missing, and conflict cases | `npm run eval` | `READY`, `OPEN`, and `CONFLICT` stay visible |
| 6 | Inspect the existing Jira MCP connection | `/mcp` | One approved read-only tool identified privately |
| 7 | Validate the local live boundary | `npm run test:live && npm run live:check` | Exactly one tool allowed; authentication remains separate |
| 8 | Run the live route privately | `npm run brief:live` | Dated private HTML or honest `OPEN` |
| 9 | Generate and run the verification skill | `/create-verification-skill` | One complete synthetic journey with cleanup |
| 10 | Propose the daily trigger | Human review | Command, working directory, logs, rollback, and owner; no scheduler installed |

## Rollback and gate

Each code step is covered by a focused test and can be reverted independently. A participant approves each human gate before continuing. The workshop never installs or activates a scheduler.

## Optional extension after A7

The [voice extension](voice-extension.md) starts a separate, optional iteration after the core route and Maintain loop. It has its own boundary and red-then-green test. It is not required for Day 5 approval.
