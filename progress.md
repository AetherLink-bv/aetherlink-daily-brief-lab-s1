# Progress — Daily brief agent lab

Status per step. VERIFIED means the proof command ran in the current checkout; OPEN means not yet.

| Step | Artifact | Proof | Status |
| --- | --- | --- | --- |
| 1 | intent.md, sample/calendar-item.sample.json, src/mini.ts, test/mini.test.ts | npm run test:mini && npm run mini | OPEN |
| 2 | docs/spec.md, src/brief.ts, sample, test/schema.test.ts | npm test (schema) | OPEN |
| 3 | docs/design.md, docs/decisions/ADR-001, docs/plan.md | plan accepted before build | OPEN |
| 4 | src/render.ts, src/main.ts | npm run brief:sample | OPEN |
| 5 | src/sources.ts, src/agent.ts, test/tool.test.ts, invalid fixture | npm run test:tool names the faulty field | OPEN |
| 6 | test/eval.test.ts, docs/evidence.md, docs/gate.md | ordinary, missing, conflict; fresh checkout; rollback | OPEN |
| 7 | challenge/README.md and participant-chosen files | one red-green test and one visible local result | OPEN |

No live token is needed. All seven assignments stay local.
