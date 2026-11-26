---
name: verify-bree
description: "Prove Bree's synthetic Daily Brief journey end to end (launch, doctor, drive, evidence, cleanup) and report the live preflight separately. Use before claiming any Bree step works."
---

# Verify Bree

Status: `VERIFIED` (2026-11-24, synthetic journey only; see "Last journey"). Live access is not verified by this skill.

All commands exist in `package.json`. Run them from the repository root. Evidence is synthetic output only. This skill never runs `npm run brief:live`, never connects an account, and never stores live source content.

## Launch

Open PowerShell on Windows or Terminal on macOS in the repository folder. Run `npm run verify:journey`. It prints the path to its evidence file and a PASS or FAIL result. The journey installs dependencies if needed.

## Doctor (read-only)

The journey records the Node version, Git revision and worktree state. It checks that Git ignores the generated page. It records only whether local configuration exists.

## Drive

| Journey | Command | Pass signal |
| --- | --- | --- |
| Synthetic brief | `npm run brief:sample` | exit 0; prints `wrote <root>/out/latest.html` and `source: sample/brief.sample.json (synthetic)` |
| Every section, escaping, source IDs | `npm run test:render`, then `npm run test:schema` | exit 0 |
| OPEN and CONFLICT | `npm run eval` | exit 0, four passing tests |
| Live boundary in code | `npm run test:live` | exit 0 |
| Live preflight (local only) | `npm run live:check` | exit 0 = `READY`; exit 3 = `OPEN` with reasons. Both are honest results. Neither proves authentication or source access. |

For a chosen evidence file, run `npm run verify:journey -- evidence.txt` from the repository folder. The filename is optional.

Details per journey are in `features/`.

## Evidence

Capture the command, its exit code and one output line. Record them in `docs/evidence.md`. Keep synthetic output only. A synthetic pass is not live proof (AGENTS.md rule 8). The private artifact path is `~/.bree/briefs/YYYY-MM-DD.html`; record only its status (`PASS` or `OPEN`), never its contents.

## Cleanup

The journey removes its generated page if the page was absent at the start. It restores an existing page and keeps the evidence file.

## Last journey

2026-11-24, `bash .claude/skills/verify-bree/journey.sh <evidence-file>`: launch, doctor, drive, evidence and cleanup all passed (`journey result: PASS`, exit 0). The first attempt failed in the doctor step because `git check-ignore -v out` fails while `out/` does not exist; the check now uses `out/latest.html`. `live:check` returned exit 3 (`OPEN`), recorded and not counted as a journey failure. `brief:live` was not run.
