# Design — Outlook request summary

Status: `ACCEPTED 2026-11-24 by Maya (A7)`

```text
sample/outlook-email.sample.json -> summariseEmail (src/outlook.ts) -> item (ItemSchema from src/brief.ts) -> one printed line (npm run outlook)

bounded SDK route (defined, not run): synthetic email text as untrusted data -> Claude Agent SDK, no tools, no MCP -> structured item -> validateOutlookOutput -> same item shape
```

| Part | File | Owns | Never does |
| --- | --- | --- | --- |
| Summariser | `src/outlook.ts` | Deterministic summary of the fixture | Read any file except the path it is given, or call a model |
| SDK options | `src/outlook.ts` (`buildOutlookOptions`) | No built-in tools, no MCP server, deny everything in `canUseTool` | Allow any tool |
| Output check | `src/outlook.ts` (`validateOutlookOutput`) | The item shape and source IDs | Accept an unknown source ID |
| Tests | `test/tool.test.ts` | Red-then-green proof | Spend credits |

Proof command: `npm run test:tool`. Journey: `npm run outlook`. Rollback: `git revert --no-edit <A7 commit>`.
