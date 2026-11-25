# Local delivery gate — Bree

Fresh checkout: `temporary worktrees at edfac27 (previous) and 3fddd63 (current), both removed afterwards; commands and exit codes in docs/evidence.md`

Read against: `intent.md` at revision `the A6 P3 commit`

## What the local checks observed

| Check | Observed | Is it an approval? |
| --- | --- | --- |
| `npm run eval` | Complete, missing and conflict cases pass (`ℹ pass 4`, exit 0) | No |
| `npm run brief:sample` | `out/latest.html` written; six sections, source lines, tally and visible `OPEN` and `CONFLICT` items (exit 0) | No |
| `npm run live:check` | `OPEN`, exit 3: the example uses a placeholder tool name; no network call | No |
| `verify-bree` synthetic journey | `journey result: PASS`; evidence file kept after cleanup | No |

Private dated artifact: `OPEN — ~/.bree/briefs/YYYY-MM-DD.html. npm run brief:live was not run. Nothing is recorded about its contents.`

Local daily trigger proposal: `OPEN — proposal only, below. No scheduler is installed or activated in this session.`

## Proposed local daily trigger (not installed)

| Field | Proposal |
| --- | --- |
| Trigger | One macOS user LaunchAgent, label `local.bree.daily-brief`, weekdays 08:15, so the brief exists before the 08:30 read. The organisation must confirm that a user LaunchAgent is an approved local scheduler. `OPEN` |
| Command | `npm run brief:live` |
| Working directory | The project folder `aetherlink-daily-brief-lab-s1` (the repository root; absolute path set by its owner when installing) |
| Logs | `~/.bree/logs/daily-brief.out.log` and `daily-brief.err.log`, outside the repository. The command prints only `PASS`, `OPEN` and the artifact path, never source content. |
| Preconditions | `npm run live:check` prints `READY`; the participant has authenticated to Jira from the project folder and confirmed read access. Live access remains `OPEN`. |
| Rollback | Unload the agent with `launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/local.bree.daily-brief.plist`, delete that plist, and delete `~/.bree/logs/`. The brief files in `~/.bree/briefs/` can stay or be deleted by their owner. |
| Owner | Maya (reader and owner of the schedule). The gate owner named in `intent.md` accepts or rejects it. |
| Stop conditions | `live:check` is `OPEN`; the connector offers write scope; the artifact would land in the repository. |

Live connector: `OPEN`. Dated artifact: `OPEN`. Nothing is published.

## What the human read

- Success check proven locally: `npm run mini prints one synthetic decision line.` (see intent.md)
- Boundary touched: `NONE`
- Rollback proof: `git restore docs/evidence.md` then `git status --short` prints nothing (docs/evidence.md, Rollback proof)

## Decision

`OPEN` — the synthetic route passes; the live source, the private artifact and the trigger approval are `OPEN`. Maya, 2026-11-24.

## Handoff

- Receiver: the next person who opens the local folder
- Start from: the A6 P3 commit on branch `run/day5-real-run`
- Run: `bash .claude/skills/verify-bree/journey.sh` (read-only apart from `out/`)
- Compare: `journey result: PASS`, and `live:check` exit 3 while the Jira tool name is missing
- Open work: confirm the Jira read tool with `/mcp` (owner: Maya with the tool owner); approve the trigger type (owner: the organisation); stop condition: any write scope offered

Do not treat this record, an agent claim or historical output as fresh evidence.
