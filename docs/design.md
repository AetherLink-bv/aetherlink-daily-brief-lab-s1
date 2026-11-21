# Design — Daily brief agent

Status: `TEMPLATE — complete before the build`

## Shape

`TEMPLATE — synthetic fixtures → DailyBrief schema → full HTML renderer → out/latest.html, plus approved Jira MCP → exact read-only tool → Agent SDK → same schema → host writer → ~/.bree/briefs/YYYY-MM-DD.html.`

## Parts

| Part | File | Owns | Never does |
| --- | --- | --- | --- |
| The contract | `TEMPLATE` | `TEMPLATE` | `TEMPLATE` |
| Synthetic adapter | `TEMPLATE` | Repeatable tests and recordings | Read work data |
| Live adapter | `TEMPLATE` | One exact approved MCP read tool | Offer another tool or store raw output |
| Agent loop | `TEMPLATE` | Bounded SDK turns and validated DailyBrief output | Use built-in or write tools |
| Host writer | `TEMPLATE` | Validated dated HTML with private permissions | Write inside the repository or expose raw input |
| The checker | `TEMPLATE` | `TEMPLATE` | `TEMPLATE` |

## Boundaries in code

- One live source tool: `TEMPLATE — exact Jira read-tool name inspected with /mcp and confirmed read-only by its owner.`
- No extra capability: no built-in, shell, file-write, messaging, or ticket-update tool.
- Separate evidence: synthetic tests may be stored; live contents may not. Record only the dated path and status.
- Human gate: `TEMPLATE — where the participant accepts the plan and results.`

## Hooks (deterministic, hold without asking)

- `TEMPLATE — the rule from the prompt that must hold even if the model ignores the prompt, and the code that holds it.`

## Decisions

- `TEMPLATE — link each ADR in docs/decisions/.`

## Risks

| Risk | Signal | Response |
| --- | --- | --- |
| `TEMPLATE` | `TEMPLATE` | `TEMPLATE` |

## OPEN

- `TEMPLATE`

## Optional voice route

After the core route, the participant may follow [the voice extension](voice-extension.md). This is a separate, synthetic-only route. Its tests mock the network. A real request uses the participant's personal key from ignored `.env.local`. The starter contains no prebuilt voice implementation.
