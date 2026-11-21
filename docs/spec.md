# Spec — Bree Daily Brief

Status: `TRAINER EXAMPLE — accepted synthetic contract`

## Artifact

The brief names the reader and shows a sourced decision line. Every line is derived from one input item. Missing input returns `OPEN`. Items that share a start time return `CONFLICT`.

## Contract

| Field | Type | Rule | Synthetic example |
| --- | --- | --- | --- |
| `user` | non-empty string | Names the private reader | `Maya` |
| `items[].id` | non-empty string | Identifies the source item | `CAL-001` |
| `items[].start` | `HH:MM` | Preserves source time | `09:00` |
| `items[].title` | non-empty string | Preserves source title | `Daily stand-up` |
| `items[].decision` | non-empty string | States the user's next decision | `Bring the top blocker` |

The source ID is the provenance carried by the contract. Shared HTML evidence uses only synthetic IDs. The application prints a live result to the terminal and does not write a brief file. The configured client and provider follow company retention policy.

## Evaluation cases

- Ordinary: render `<start> <title> — decide: <decision>`.
- Missing: return `OPEN — no agenda item available`.
- Conflict: return `CONFLICT` and do not choose silently.

## Prohibited behavior

- Do not invent facts or hide missing input.
- Do not connect work email or store work data.
- Do not write to Jira, send messages, start a shell, or permit a second tool.
