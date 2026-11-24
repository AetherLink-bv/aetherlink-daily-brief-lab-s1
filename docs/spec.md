# Spec — Daily brief

Status: `ACCEPTED 2026-11-24 by Maya (A2 Part 1)`

References: `reference/dia-to-bree.md` and `reference/brief-example.md`. Both contain synthetic structural guidance only.

Live source: `OPEN — one exact owner-confirmed read-only tool from the existing approved Jira MCP connection. It is chosen in A5 after /mcp inspection. Live source IDs are exact issue keys from its successful structured result. Never paste its response here.`

## The artifact

One `DailyBrief` object with these fields, in this order: `title`, `date`, `greeting`, `summary`, `moveWorkForward`, `topTodos`, `newUpdates`, `yourDay`, `sources`. No other field is allowed.

## The contract

| Field | Type | Rule | Example from the reference |
| --- | --- | --- | --- |
| `title` | string | Names the artifact; not empty | `Maya's Daily Brief` |
| `date` | `YYYY-MM-DD` | Names the artifact date | `2026-11-21` |
| `greeting` | string | Contains no work claim; not empty | `Good morning, Maya.` |
| `summary` | content item | Opens with sourced context | Synthetic example |
| `moveWorkForward` | content item | One best-supported action | Synthetic example |
| `topTodos` | content item list | Not empty; preserves uncertainty | Synthetic example |
| `newUpdates` | content item list | Not empty; claims no unsourced action | Synthetic example |
| `yourDay` | content item list | Not empty; shows sourced time-bound work | Synthetic example |
| `sources` | `{ id: string, label: string }[]` | Resolves every `sourceIds` entry | Synthetic labels only |
| Content item | `{ status, text, sourceIds }` | `status` is `READY`, `OPEN`, or `CONFLICT`; `text` is not empty; READY and CONFLICT have at least one resolved ID; OPEN may have none | OPEN |

Rules that hold for every content item:

- Every `sourceIds` entry matches the `id` of one entry in `sources`.
- `OPEN` text starts with `OPEN`.
- `CONFLICT` text starts with `CONFLICT`.
- A `READY` item without a source ID is rejected. The brief never states a fact it cannot trace.

## House style

- Second person ("you"), present tense, plain words. One sentence per item where possible.
- No hype, no emoji, no exclamation marks, no bullet lists inside an item's text.
- Describe the work; never decide for the reader (no "you should assign X").
- A missing source is written as `OPEN — <what is missing>`. A disagreement is written as `CONFLICT — <what disagrees>`.

## What the agent may never do

- Invent a fact, hide OPEN evidence, connect work email, write through a source, expose customer data, or store raw connector output.

## Acceptance examples

| Given | When | Then | Proof |
| --- | --- | --- | --- |
| `sample/brief.sample.json` | the contract is checked | it passes | `npm run test:schema` |
| a brief without a required section | the contract is checked | it is rejected | `npm run test:schema` |
| a READY item whose `sourceIds` names an ID missing from `sources` | the contract is checked | it is rejected | `npm run test:schema` |

## Evaluation cases

- Complete: every section renders with resolvable synthetic provenance (`sample/eval/ordinary-brief.json`).
- Missing: affected content is OPEN and invents no fact (`sample/eval/missing-brief.json`).
- Conflict: affected content is CONFLICT and chooses nothing silently (`sample/eval/conflict-brief.json`).

## OPEN

- OPEN — the format check accepts `2026-13-45`. Real calendar validity is not settled in this spec.
- OPEN — whether two `sources` entries may share one `id`. The contract only requires that every `sourceIds` entry resolves.
- OPEN — the exact Jira read tool and the live issue-key field. Settled in A5 from `/mcp` and one reviewed structured result.

## Optional voice extension

The [voice extension](voice-extension.md) is outside the core `DailyBrief` contract. It may use only the validated synthetic sample. It speaks only the summary and top todos, preserves the words `OPEN` and `CONFLICT`, and never reads a live brief or connector response.
