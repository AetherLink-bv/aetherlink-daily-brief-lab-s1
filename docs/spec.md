# Spec — Bree Daily Brief

Status: `TRAINER EXAMPLE — accepted synthetic contract`

References: `reference/dia-to-bree.md` and `reference/brief-example.md`. Both contain synthetic structural guidance only.

## Artifact

The brief renders these fields in order: `title`, `date`, `greeting`, `summary`, `moveWorkForward`, `topTodos`, `newUpdates`, `yourDay`, and `sources`.

## Contract

| Field | Type | Rule |
| --- | --- | --- |
| `title` | non-empty string | Names the artifact |
| `date` | real `YYYY-MM-DD` date | Names the artifact date |
| `greeting` | non-empty string | Contains no unsupported work claim |
| `summary` | content item | Opens with sourced context |
| `moveWorkForward` | content item | Shows one best-supported action |
| `topTodos` | non-empty content item array | Preserves priority and uncertainty |
| `newUpdates` | non-empty content item array | Claims no unsourced action |
| `yourDay` | non-empty content item array | Shows sourced time-bound work |
| `sources` | `{ id: string, label: string }[]` | Resolves every `sourceIds` entry |

A content item is `{ status, text, sourceIds }`. Status is `READY`, `OPEN`, or `CONFLICT`. `READY` and `CONFLICT` require at least one resolved source ID. `OPEN` may have no source ID. `OPEN` text starts with `OPEN`; `CONFLICT` text starts with `CONFLICT`.

For live Jira output, each source ID is an exact issue key extracted from the successful structured tool result. Invented, transformed, or unstructured provenance is rejected.

## Evaluation cases

- Complete: every section renders with resolvable synthetic provenance.
- Missing: the affected item is `OPEN` and invents no fact.
- Conflict: the affected item is `CONFLICT` and resolves nothing silently.

## Prohibited behavior

- Do not invent facts or hide missing or conflicting evidence.
- Do not connect work email or store work data.
- Do not write through Jira, send messages, start a shell, or permit a second tool.
- Do not store raw connector output in the repository or the dated HTML artifact.

## Optional voice extension

The [voice extension](voice-extension.md) is outside the core `DailyBrief` contract. It may use only the validated synthetic sample. It speaks only the summary and top todos, preserves the words `OPEN` and `CONFLICT`, and never reads a live brief or connector response.
