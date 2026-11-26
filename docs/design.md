# Design — Daily brief agent

Status: `ACCEPTED 2026-11-24 by Maya (A3)`

## Shape

Two routes share one contract and one renderer.

```text
Synthetic route (steps 1-2, proof stored in the repository)
  sample/brief.sample.json -> DailyBrief schema (src/brief.ts) -> HTML renderer (src/render.ts) -> out/latest.html

Live route (steps 3-5, proof stored only as PASS or OPEN)
  approved Jira MCP -> one exact read-only tool -> Claude Agent SDK (src/live.ts)
    -> same DailyBrief schema -> same renderer -> host writer -> ~/.bree/briefs/YYYY-MM-DD.html
```

Only the host process writes files. The model returns data, never a file.

## Parts

| Part | File | Owns | Never does |
| --- | --- | --- | --- |
| The contract | `src/brief.ts` | The `DailyBrief` schema and the rules in `docs/spec.md` | Render HTML or read a source |
| Synthetic adapter | `sample/brief.sample.json`, `sample/eval/*-brief.json` | Repeatable tests and recordings | Read work data |
| Renderer | `src/render.ts` | Validated `DailyBrief` to one escaped HTML page | Fetch anything, write a file, or invent a fact |
| Sample entry | `src/main.ts` | Read the sample, validate, render, write `out/latest.html` | Call a model or a connector |
| Live adapter | `src/live.ts` | One exact approved MCP read tool, passed explicitly to the SDK | Offer another tool or store raw output |
| Agent loop | `src/live.ts` | Bounded SDK turns and validated `DailyBrief` output | Use built-in, shell, file-write, messaging or ticket-update tools |
| Host writer | `src/live.ts` | Validated dated HTML at `~/.bree/briefs/YYYY-MM-DD.html` with private permissions | Write inside the repository or expose raw input |
| The checker | `test/*.test.ts`, `.claude/skills/verify-bree/`, `docs/evidence.md` | Red-then-green proof and one repeatable synthetic journey | Count a synthetic pass as live proof |

## Boundaries in code

- One live source tool: `OPEN — the exact Jira read-tool name is inspected with /mcp and confirmed read-only by its owner in A5. Until then live proof stays OPEN.`
- No extra capability: no built-in, shell, file-write, messaging, or ticket-update tool.
- Run the synthetic verification journey with `npm run verify:journey` in PowerShell or Terminal. It records the exit code of each command and preserves the evidence after cleanup.
- Separate evidence: synthetic tests may be stored; live contents may not. Record only the dated path and status.
- Human gate: Maya accepts this design and `docs/plan.md` before step 1, accepts the live tests and tool before step 4, and approves the live run (step 5) herself.

## Hooks (deterministic, hold without asking)

- Deny by default: `canUseTool` in `src/live.ts` allows exactly the one approved tool name and denies every other request. Checked by `test/live.test.ts`.
- No built-in tools: the SDK is started with built-in tools set to none. A PreToolUse hook denies every tool except the exact Jira read tool. Checked by `test/live.test.ts`.
- Unvalidated output is rejected: the host parses the model output with the `DailyBrief` schema before it renders anything. Checked by `test/schema.test.ts` and `test/live.test.ts`.
- Live source IDs are exact Jira keys from the successful structured tool result; an unknown ID is rejected. Checked by `test/live.test.ts`.
- On native Windows the host checks the private folders and the dated page under the user profile before contacting Jira. Only the current user, SYSTEM and local administrators may have access. If Bree cannot verify access, keep both live results OPEN and run `npm run brief:sample`.
- The host owns the file: the artifact path is built from the validated date, written with private permissions, outside the repository. Checked by `test/live.test.ts`.

## Decisions

- [ADR-001: the host validates and writes the HTML; the model returns data only](decisions/ADR-001-host-writes-validated-html.md)

## Risks

| Risk | Signal | Response |
| --- | --- | --- |
| Untrusted text becomes live HTML | A test string such as `<script>` appears unescaped in `out/latest.html` | Escape every text and label in `src/render.ts`; keep `test/render.test.ts` red until it holds |
| The model invents a fact | An item is `READY` with no resolvable source ID | The schema rejects it; the item must become `OPEN` |
| Sources disagree and one is chosen silently | A `CONFLICT` item names one winner | The schema requires `CONFLICT` text to start with `CONFLICT`; `test/eval.test.ts` covers it |
| A write or extra tool becomes reachable | `canUseTool` allows a name other than the approved one | Deny by default; `test/live.test.ts` rejects any other tool |
| Synthetic proof is mistaken for live proof | A claim cites `brief:sample` for Jira access | `AGENTS.md` rule 8; live status is recorded as PASS or OPEN only |

## OPEN

- OPEN — exact Jira read tool and the issue-key field of its structured result (step 3).
- OPEN — the local trigger (step 8). It is a proposal only.

## Optional voice route

After the core route, the participant may follow [the voice extension](voice-extension.md). This is a separate, synthetic-only route. Its tests mock the network. A real request uses the participant's personal key from ignored `.env.local`. The starter contains no prebuilt voice implementation.
