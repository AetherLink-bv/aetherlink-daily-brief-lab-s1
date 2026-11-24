# Progress — Daily brief agent lab

Status per step. VERIFIED means the proof command ran in the current checkout; OPEN means not yet.

| Step | Artifact | Proof | Status |
| --- | --- | --- | --- |
| 1 | intent.md, sample/calendar-item.sample.json, src/mini.ts, test/mini.test.ts | npm run test:mini && npm run mini | VERIFIED 2026-11-24 (Maya reran both; exit 0) |
| 2 | docs/spec.md, src/brief.ts, sample, test/schema.test.ts | npm test (schema) | OPEN |
| 3 | docs/design.md, docs/decisions/ADR-001, docs/plan.md, offline visual plan | complete route accepted before build | OPEN |
| 4 | src/render.ts, src/main.ts | npm run brief:sample | OPEN |
| 5 | synthetic tool tests plus `src/live.ts` and private config | `npm run test:live && npm run live:check`; private live status recorded separately | OPEN |
| 6 | evaluations, `verify-bree`, evidence, and local gate | ordinary, OPEN, CONFLICT; one synthetic journey; current and previous versions | OPEN |
| 7 | participant-chosen intent, fixture, bounded SDK route, and proof | one synthetic journey plus separate live status | OPEN |

No secret belongs in this repository. Live connector approval, configuration, authentication, and source access remain separate checks.
