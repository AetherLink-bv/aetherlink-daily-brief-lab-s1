# Live preflight and the private artifact path

## Sub-features

- `npm run live:check`: local check of `.bree.local.json` (three approvals true, `modelProvider` is `vertex`, a real `mcp__<server>__<tool>` name for the named server) and of the `AETHERLINK_JIRA_MCP_CONFIG` file. It contacts nothing. Exit 0 = `READY`, exit 3 = `OPEN` with one reason per line.
- Boundary tests (`npm run test:live`, mocked, no network): exactly one allowed tool, deny-by-default for everything else, no built-in tools, strict MCP config, only the selected server definition, exact issue keys from a successful structured result, unknown source IDs rejected.
- Dated private artifact path: `~/.bree/briefs/YYYY-MM-DD.html`, directory mode 0700, file mode 0600, never inside the repository.

## How to get to it (user POV)

A person runs `npm run live:check`. Only after it says `READY`, and a person has approved, may that person run `npm run brief:live` privately. This skill never runs `brief:live`.

## Driving it with the repository commands

```bash
npm run test:live
npm run live:check; echo "exit=$?"
test -e ~/.bree/briefs/$(date +%F).html && echo "artifact present" || echo "artifact absent"   # existence only; never open or copy it
```

Expected without approvals: `live:check` prints `OPEN` and its reasons, exit 3.

## Gotchas

- `READY` proves only local approvals and configuration. It does not prove authentication or source access (AGENTS.md rule 8).
- `.bree.local.json` is ignored by git and stores approvals, not MCP server configuration.
- Never paste connector output, issue keys from a live run, or the artifact into evidence. Record `PASS` or `OPEN` only.
- The Jira tool name must come from `/mcp`. Until then the status stays `OPEN`.
