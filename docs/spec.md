# Spec — Daily brief

Status: `TEMPLATE — complete before design`

References: `reference/dia-to-bree.md` and `reference/brief-example.md`. Both contain synthetic structural guidance only.

Live source: `TEMPLATE — one exact owner-confirmed read-only tool from the existing approved Jira MCP connection. Live source IDs are exact issue keys from its successful structured result. Never paste its response here.`

## The artifact

`TEMPLATE — title, date, greeting, summary, moveWorkForward, topTodos, newUpdates, yourDay, and sources, in that order.`

## The contract

| Field | Type | Rule | Example from the reference |
| --- | --- | --- | --- |
| `title` | string | Names the artifact | `Maya's Daily Brief` |
| `date` | `YYYY-MM-DD` | Names the artifact date | `2026-11-21` |
| `greeting` | string | Contains no work claim | `Good morning, Maya.` |
| `summary` | content item | Opens with sourced context | Synthetic example |
| `moveWorkForward` | content item | One best-supported action | Synthetic example |
| `topTodos` | content item list | Preserves uncertainty | Synthetic example |
| `newUpdates` | content item list | Claims no unsourced action | Synthetic example |
| `yourDay` | content item list | Shows sourced time-bound work | Synthetic example |
| `sources` | `{ id: string, label: string }[]` | Resolves every `sourceIds` entry | Synthetic labels only |
| Content item | `{ status, text, sourceIds }` | READY and CONFLICT have at least one resolved ID; OPEN may have none | OPEN |

`OPEN` text starts with `OPEN`. `CONFLICT` text starts with `CONFLICT`.

## House style

- `TEMPLATE — tone, person, tense, what is forbidden (hype, emoji, bullet lists inside bodies).`

## What the agent may never do

- Invent a fact, hide OPEN evidence, connect work email, write through a source, expose customer data, or store raw connector output.

## Acceptance examples

| Given | When | Then | Proof |
| --- | --- | --- | --- |
| `TEMPLATE — the sample brief` | `TEMPLATE — the contract is checked` | `TEMPLATE — it passes` | `npm test` |
| `TEMPLATE — a brief without a required section` | `TEMPLATE` | `TEMPLATE — it is rejected` | `npm test` |

## Evaluation cases

- Complete: `TEMPLATE — every section renders with resolvable synthetic provenance.`
- Missing: `TEMPLATE — affected content is OPEN and invents no fact.`
- Conflict: `TEMPLATE — affected content is CONFLICT and chooses nothing silently.`

## OPEN

- `TEMPLATE — every rule you could not settle from the reference alone.`

## Optional voice extension

The [voice extension](voice-extension.md) is outside the core `DailyBrief` contract. It may use only the validated synthetic sample. It speaks only the summary and top todos, preserves the words `OPEN` and `CONFLICT`, and never reads a live brief or connector response.
