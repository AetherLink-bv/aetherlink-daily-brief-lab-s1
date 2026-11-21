# Spec — Daily brief

Status: `ACCEPTED — 2026-11-21`

References: `reference/dia-to-bree.md` and `reference/brief-example.md`. Both contain synthetic structural guidance only.

Live source: one exact owner-confirmed read-only Jira tool. Its name remains OPEN until `/mcp` confirms it.

## The artifact

The artifact contains title, date, greeting, summary, moveWorkForward, topTodos, newUpdates, yourDay, and sources, in that order.

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

- Use direct factual English for Maya. Avoid hype, emoji, and nested lists inside item text.

## What the agent may never do

- Invent a fact, hide OPEN evidence, connect work email, write through a source, expose customer data, or store raw connector output.

## Acceptance examples

| Given | When | Then | Proof |
| --- | --- | --- | --- |
| The complete sample brief | The contract is checked | It passes | `npm run test:schema` |
| A brief without a required section | The contract is checked | It is rejected | `npm run test:schema` |

## Evaluation cases

- Complete: every section renders with resolvable synthetic provenance.
- Missing: affected content is OPEN and invents no fact.
- Conflict: affected content is CONFLICT and chooses nothing silently.

## OPEN

- The exact approved live Jira tool remains OPEN.

## Optional voice extension

The [voice extension](voice-extension.md) is outside the core `DailyBrief` contract. It may use only the validated synthetic sample. It speaks only the summary and top todos, preserves the words `OPEN` and `CONFLICT`, and never reads a live brief or connector response.
