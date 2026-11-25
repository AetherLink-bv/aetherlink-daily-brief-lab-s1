# Live preflight and the private artifact path

## Sub-features

- `npm run live:check`: checks that the local configuration names Jira, a tool with the expected name format, the reader and the decision. It contacts nothing. Exit 0 = `READY`, exit 3 = `OPEN` with one reason per line.
- Boundary tests (`npm run test:live`, mocked, no network): exactly one allowed tool, deny-by-default for everything else, no built-in tools, project-local settings, a PreToolUse hook that denies other tools, exact issue keys from a successful structured result, unknown source IDs rejected.
- Dated private artifact path: `~/.bree/briefs/YYYY-MM-DD.html`, directory mode 0700, file mode 0600, never inside the repository.

## How to get to it (user POV)

A person runs `npm run live:check`. Only after it says `READY`, and a person has approved, may that person run `npm run brief:live` privately. This skill never runs `brief:live`.

## Driving it with the repository commands

```bash
npm run test:live
npm run live:check; echo "exit=$?"
test -e ~/.bree/briefs/$(date +%F).html && echo "artifact present" || echo "artifact absent"   # existence only; never open or copy it
```

Expected with the example file: `live:check` prints `OPEN` and its reasons, exit 3.

## Gotchas

- `READY` proves only the local configuration. Before a live run, the participant must confirm that the tool is marked read-only in `/mcp`. This offline check cannot establish permissions, authentication or source access.
- `.bree.local.json` is ignored by git and stores the reader, decision and tool name.
- Never paste connector output, issue keys from a live run, or the artifact into evidence. Record `PASS` or `OPEN` only.
- The Jira tool name must come from `/mcp`. Until then the status stays `OPEN`.
