# Private live preflight

## Sub-features

Approvals, the exact Jira tool, Jira-only MCP configuration, Vertex selection, and the private output path.

## How to get to it (user POV)

Create ignored `.bree.local.json` only after the organisation confirms every field.

## Driving it with the repository commands

Run `npm run live:check`. Run `npm run brief:live` only after READY and human approval.

## Gotchas

OPEN is expected without approved configuration. READY still does not prove authentication or source access.
