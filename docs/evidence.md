# Evidence — Daily brief agent

Cutoff: `2026-11-21, current targeted solution checks`

Every row is a claim with the command that proves it, the exit code observed, and one quoted output line. An unrun command is `OPEN`, never a pass.

| Claim | Command | Exit code | Output line quoted | Status |
| --- | --- | --- | --- | --- |
| The full schema holds | `npm run test:schema` | `0` | `# pass 5` | `VERIFIED` |
| The complete HTML renderer holds | `npm run test:render` | `0` | `# pass 3` | `VERIFIED` |
| The live boundary holds | `npm run test:live` | `0` | `# pass 15` | `VERIFIED` |
| The evaluation cases hold | `npm run eval` | `0` | `# pass 6` | `VERIFIED` |
| The learning slice holds | `npm run test:mini` | `0` | `# pass 1` | `VERIFIED` |
| The full suite holds | `npm test` | `0` | `# pass 32; # fail 0` | `VERIFIED — remote CI` |
| The page renders | `npm run brief:sample` | `0` | `WROTE out/latest.html` | `VERIFIED` |

The targeted checks cover 30 tests in total. The full 32-test suite, typecheck, documentation check, and sample render passed in [GitHub Actions](https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1/actions/runs/44856586902) at trainer revision `d6e3203`.

## Fresh local checkout

`OPEN — recorded after the A6 commit is exercised in detached worktrees.`

## Rollback proof

`OPEN — recorded after the previous A5 commit and current A6 commit both run.`

## Visible result

`out/latest.html — contains the complete synthetic Daily Brief: title, date, greeting, summary, move-work-forward action, top todos, new updates, your day, and sources.`

## Private live result

`OPEN — record only the dated path under ~/.bree/briefs/ after approved access succeeds. Never paste its contents here.`

## Differences from the references

- `OPEN — one difference per line; a difference is an observation, not a failure.`
