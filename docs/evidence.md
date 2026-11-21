# Evidence — Daily brief agent

Cutoff: 2026-11-21, participant checkpoint `0e65a7795cdef7ef68753d8965ad5370f62a543f`.

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
| Full suite | `npm test` | 0 | `tests 23; pass 23; fail 0` | PASS in remote CI |

## Fresh local checkout

Remote run [44863044663](https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1/actions/runs/44863044663) checked fixed revision `0e65a7795cdef7ef68753d8965ad5370f62a543f`. `docs:check`, typecheck, the 23-test suite, six evaluations, synthetic render, and the 1499×878 screenshot passed.

## Rollback proof

The same remote run checked parent `35ca6836729a6b462f1a81de0a9ad20abf8c4f73`: typecheck and 16 tests passed. Cleanup left exactly one worktree.

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
- The complete remote proof passed for both fixed revisions. Live source proof remains separate and OPEN.
