# Design — Daily brief agent

Status: `ACCEPTED — 2026-11-21`

## Shape

Synthetic fixtures → DailyBrief schema → HTML renderer → `out/latest.html`. The live route is approved Jira MCP → one exact read-only tool → Agent SDK → the same schema → host writer → `~/.bree/briefs/YYYY-MM-DD.html`.

## Parts

| Part | File | Owns | Never does |
| --- | --- | --- | --- |
| The contract | `src/brief.ts` | Validation and resolved provenance | Read or write files |
| Synthetic adapter | `sample/*.json` | Repeatable tests and recordings | Read work data |
| Live adapter | `src/live.ts` | One exact approved MCP read tool | Offer another tool or store raw output |
| Agent loop | `src/live.ts` | Bounded SDK turns and validated DailyBrief output | Use built-in or write tools |
| Host writer | `src/render.ts`, `src/live.ts` | Validated dated HTML with private permissions | Expose raw input |
| The checker | `test/*.test.ts` | Contract and boundary proof | Contact a live source |

## Boundaries in code

- One live source tool: exact name remains OPEN until `/mcp` and owner confirmation.
- No extra capability: no built-in, shell, file-write, messaging, or ticket-update tool.
- Separate evidence: synthetic tests may be stored; live contents may not. Record only the dated path and status.
- Human gate: the participant accepts tests, tool name, and boundary before any private live run.

## Hooks (deterministic, hold without asking)

- Zod rejects malformed output; the host rejects unlisted source IDs; SDK options expose only the exact configured tool.

## Decisions

- [ADR-001](decisions/ADR-001.md) keeps writing and validation in the host.

## Risks

| Risk | Signal | Response |
| --- | --- | --- |
| Live tool is unavailable | `live:check` reports OPEN | Keep synthetic route usable; do not run live |
| Model invents a source | Source ID does not resolve | Reject the complete output |
| Private content leaks | Output path is inside repository | Reject path; host writes outside repository with mode 0600 |

## OPEN

- Exact approved Jira tool, Vertex account, and live authentication are OPEN.

## Optional voice route

After the core route, the participant may follow [the voice extension](voice-extension.md). This is a separate, synthetic-only route. Its tests mock the network. A real request uses the participant's personal key from ignored `.env.local`. The starter contains no prebuilt voice implementation.
