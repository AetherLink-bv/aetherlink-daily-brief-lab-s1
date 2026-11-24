# ADR-001 — The host validates and writes the HTML; the model returns data only

Status: `ACCEPTED`

Date: `2026-11-24`

Decision owner: `Maya`

## Context

Bree reads work items through one approved read-only tool and must produce one private HTML page. A model that could also write files would need a write tool, and a write tool is outside the permission boundary in `AGENTS.md` rule 3 and the "Data and permission rules" in `SOLO.md`. The model output also has to be checkable before anyone reads it: `docs/spec.md` requires a source ID on every `READY` and `CONFLICT` item.

## Decision

The Agent SDK route returns one `DailyBrief` object. The host process validates it with the schema in `src/brief.ts`, renders it with `src/render.ts`, and writes the HTML itself to `~/.bree/briefs/YYYY-MM-DD.html` with private permissions. The model never gets a write, shell or built-in tool.

## Options considered

| Option | Evidence or trade-off | Outcome |
| --- | --- | --- |
| The model writes the HTML file with a file-write tool | Needs a write tool, which `AGENTS.md` rule 3 forbids | Rejected |
| The model returns an HTML string and the host saves it | Nothing checks sources, `OPEN` or `CONFLICT`; escaping depends on the model | Rejected |
| The model returns `DailyBrief` data; the host validates, renders and writes | Reuses the schema from A2 and the renderer from A4; one code path for synthetic and live | Chosen |

## Consequences and rollback

- Positive: one renderer and one contract for both routes; a bad model answer fails validation instead of reaching the page; the file permission and path are decided by code.
- Cost or risk: the model must fill every section; missing evidence must be written as `OPEN` items, not omitted.
- Rollback or revisit trigger: revert the commit that adds `src/live.ts`. Revisit if the approved connector offers a structured result shape that makes the schema unusable.

## Evidence and follow-up

- Evidence links: `docs/spec.md`, `AGENTS.md` rule 3, `SOLO.md` Assignment 5 Part 2. No live measurement exists; live behaviour stays `OPEN` until the private run in step 5.
- Follow-up owner and due date: Maya, at the step 4 review.
