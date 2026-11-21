# Design — Bree Daily Brief

Status: `TRAINER EXAMPLE — accepted design`

## Routes

Synthetic route: `sample/brief.sample.json` → `DailyBrief` schema → escaped HTML renderer → `out/latest.html`.

Live route: existing approved Jira MCP connection → one exact read-only tool → Claude Agent SDK through the approved Vertex model route → the same schema → host-owned writer → `~/.bree/briefs/YYYY-MM-DD.html`.

## Parts and boundaries

| Part | File | Owns | Never does |
| --- | --- | --- | --- |
| Contract | `src/brief.ts` | Full schema and provenance validation | Calls a connector |
| Renderer | `src/render.ts` | Escaped full-page HTML | Reads a source or writes a file |
| Sample entry | `src/main.ts` | Synthetic input and `out/latest.html` | Calls a model |
| Live entry | `src/live.ts` | One bounded SDK and MCP run, validation, and private dated write | Enables built-in or write tools |

The live configuration is ignored by Git. All three approval flags default to `false`. `/mcp` identifies the existing connection and exact Jira read tool. No installation or token creation is part of the workshop.

The SDK may call one configured tool exactly once. A host hook and permission callback deny every other tool. The host accepts live provenance only when exact Jira keys appear in the successful structured tool result. It validates the model result before the renderer or writer receives it.

## Evidence separation

Synthetic tests, screenshots, recordings, and `out/latest.html` may be stored. The live writer creates only validated HTML outside the repository. Record the dated path and result status, not its contents. Provider retention follows company policy.

## Human gates

The participant accepts the intent, contract, plan, visual plan, exact read-only tool, model route, and final evidence before continuing.

## Optional voice route

After the core route, the participant may follow [the voice extension](voice-extension.md). This is a separate, synthetic-only route. Its tests mock the network. A real request uses the participant's personal key from ignored `.env.local`. The participant starter contains no prebuilt voice implementation.
