# Plan — Bree Daily Brief

Status: `TRAINER EXAMPLE — accepted plan`

## Ordered steps

| # | Step | Proof | Expected |
| --- | --- | --- | --- |
| 1 | Prove one synthetic decision line | `npm run test:mini && npm run mini` | Exact sourced line |
| 2 | Implement the accepted contract | `npm run test:schema` | Valid input passes; invalid input fails |
| 3 | Render the synthetic product | `npm run test:render && npm run brief:sample` | Escaped local HTML |
| 4 | Evaluate the three outcomes | `npm run eval` | Ordinary, `OPEN`, and `CONFLICT` pass |
| 5 | Inspect the existing Jira MCP connection | `/mcp` | One approved read-only tool identified privately |
| 6 | Validate the local live boundary | `npm run test:live && npm run live:check` | Exactly one tool allowed; authentication remains separate |
| 7 | Run the live route privately | `npm run brief:live` | Terminal-only result or honest `OPEN` |
| 8 | Generate and run the verification skill | `/create-verification-skill` | One complete synthetic journey with cleanup |

## Rollback and gate

Each code step is covered by a focused test and can be reverted independently. A participant approves the intent, contract, plan, visual plan, live tool boundary, and final evidence before continuing.
