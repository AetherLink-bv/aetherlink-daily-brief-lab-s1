# Design — Outlook request summary

Status: `ACCEPTED 2026-11-24 by Maya (A7)`

```text
sample/outlook-email.sample.json -> summariseEmail (src/outlook.ts) -> item (ItemSchema from src/brief.ts) -> one printed line (npm run outlook)

optional SDK route after approval: synthetic email text as untrusted data -> approved Worldline model, no tools, no MCP -> structured item -> validateOutlookOutput -> same item shape
```

| Part | File | Owns | Never does |
| --- | --- | --- | --- |
| Summariser | `src/outlook.ts` | Deterministic summary of the fixture | Read any file except the path it is given, or call a model |
| SDK options | `src/outlook.ts` (`buildOutlookOptions`) | Load the approved Worldline user and local settings. Set `tools: []`, `mcpServers: {}` and `strictMcpConfig: true`. Deny tool requests | Allow any tool |
| Output check | `src/outlook.ts` (`validateOutlookOutput`) | The item shape and source IDs | Accept an unknown source ID |
| Tests | `test/tool.test.ts` | Red-then-green proof | Spend credits |

Proof command: `npm run test:tool`. Journey: `npm run outlook`. Rollback: `git revert --no-edit <A7 commit>`.
