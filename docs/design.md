# Design — Bree Daily Brief

Status: `TRAINER EXAMPLE — accepted design`

## Routes

Synthetic route: fixture → brief contract → escaped HTML → local file.

Live route: existing approved Jira MCP connection → one exact read-only tool → Claude Agent SDK through the approved model provider → private terminal JSON.

## Parts and boundaries

| Part | File | Owns | Never does |
| --- | --- | --- | --- |
| Contract | `src/brief.ts` | Validation and ordinary, `OPEN`, `CONFLICT` outcomes | Calls a connector |
| Renderer | `src/render.ts` | Escaped synthetic HTML | Stores live data |
| Sample entry | `src/main.ts` | Synthetic input and local output | Calls a model |
| Live entry | `src/live.ts` | One bounded SDK and MCP run | Enables built-in or write tools |

The live configuration is ignored by Git. All three approval flags default to `false`. `/mcp` identifies the existing connection and exact Jira read tool. No installation or token creation is part of the workshop.

## Evidence separation

Synthetic tests, screenshots, recordings, and HTML may be stored. Live authentication, source access, and output are checked privately and are never recorded.
