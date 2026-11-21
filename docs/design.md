# Design — Daily brief agent

Status: `TEMPLATE — complete before the build`

## Shape

`TEMPLATE — synthetic fixture → contract → renderer → HTML, plus existing approved Jira MCP → exact read-only tool → Agent SDK through Anthropic via Vertex → private terminal brief.`

## Parts

| Part | File | Owns | Never does |
| --- | --- | --- | --- |
| The contract | `TEMPLATE` | `TEMPLATE` | `TEMPLATE` |
| Synthetic adapter | `TEMPLATE` | Repeatable tests and recordings | Read work data |
| Live adapter | `TEMPLATE` | One exact approved MCP read tool | Offer another tool or persist output |
| Agent loop | `TEMPLATE` | Bounded SDK turns and source-aware response | Use built-in tools or persist a session |
| The checker | `TEMPLATE` | `TEMPLATE` | `TEMPLATE` |

## Boundaries in code

- One live source tool: `TEMPLATE — exact Jira read-tool name inspected with /mcp and confirmed read-only by its owner.`
- No extra capability: no built-in, shell, file-write, messaging, or ticket-update tool.
- Separate evidence: synthetic tests may be stored; private live output may not.
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
