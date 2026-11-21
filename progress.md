# Progress — Daily brief agent lab

Status per step. VERIFIED means the proof command ran in the current checkout; OPEN means not yet.

| Step | Artifact | Proof | Status |
| --- | --- | --- | --- |
| 1 | intent.md, sample/calendar-item.sample.json, src/mini.ts, test/mini.test.ts | npm run test:mini && npm run mini | VERIFIED by fictional participant, 2026-11-21 |
| 2 | docs/spec.md, src/brief.ts, sample, test/schema.test.ts | npm run test:schema | VERIFIED by fictional participant, 2026-11-21 |
| 3 | docs/design.md, docs/decisions/ADR-001, docs/plan.md, offline visual plan | complete route accepted before build | VERIFIED by fictional participant, 2026-11-21 |
| 4 | src/render.ts, src/main.ts | npm run test:render && npm run brief:sample | VERIFIED by fictional participant, 2026-11-21 |
| 5 | synthetic tool tests plus `src/live.ts` and private config | `npm run test:live`; `live:check` reports OPEN separately | SYNTHETIC VERIFIED; LIVE OPEN, 2026-11-21 |
| 6 | evaluations, `verify-bree`, evidence, and local gate | targeted synthetic journey PASS; full suite and worktrees OPEN for remote CI | PARTIAL, 2026-11-21 |
| 7 | participant-chosen intent, fixture, bounded SDK route, and proof | one synthetic journey plus separate live status | OPEN |

No secret belongs in this repository. Live connector approval, configuration, authentication, and source access remain separate checks.
