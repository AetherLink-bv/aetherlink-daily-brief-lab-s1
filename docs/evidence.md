# Evidence — Daily brief agent

Cutoff: 2026-11-21, local participant branch.

| Claim | Command | Exit code | Output line quoted | Status |
| --- | --- | ---: | --- | --- |
| Types hold | `npm run typecheck` | 0 | `tsc --noEmit` | PASS |
| Mini slice holds | `npm run test:mini` | 0 | `pass 1, fail 0` | PASS |
| Schema holds | `npm run test:schema` | 0 | `pass 3, fail 0` | PASS |
| Renderer holds | `npm run test:render` | 0 | `pass 2, fail 0` | PASS |
| Live boundary holds with mocks | `npm run test:live` | 0 | `pass 8, fail 0` | PASS |
| Three eval cases hold | `npm run eval` | 0 | `pass 6, fail 0` | PASS |
| Mock Outlook mission holds | `npm run test:tool` | 0 | `pass 3, fail 0` | PASS |
| Page renders | `npm run brief:sample` | 0 | `Wrote out/latest.html (2136 bytes) from synthetic data` | PASS |
| Local live configuration | `npm run live:check` | 2 | `OPEN — approved local live configuration is unavailable` | OPEN |
| Full suite | `npm test` | OPEN | Assigned to remote CI by local resource policy | OPEN |

## Fresh local checkout

OPEN locally. The full `HEAD^` and `HEAD` worktree commands are assigned to remote CI. No temporary worktree was created.

## Rollback proof

OPEN until remote CI runs the documented previous and current revision checks.

## Visible result

`out/latest.html` contains Summary, Push your work forward, Top to-dos, New updates, Your day, and Sources. The OPEN badge is visible and source labels are synthetic.

## Local trigger proposal

- Schedule: 08:30 Europe/Amsterdam on weekdays.
- Command: `npm run brief:live`.
- Working directory: this repository checkout.
- Logs: exit status and artifact path only; never brief contents.
- Owner: Maya after organisation approval.
- Rollback: remove the uninstalled scheduler proposal or disable the approved local entry.
- Status: PROPOSED ONLY. No scheduler was installed or activated.

## Differences from the references

- The live connector, private dated artifact, Vertex route, and exact Jira tool remain OPEN.
- The full suite and two-worktree recovery proof remain OPEN for remote CI.
- The generated verification skill remains DRAFT until those remote checks finish.
