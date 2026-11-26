# Progress — Daily brief agent lab

Status per assignment. VERIFIED means the proof command ran in the current checkout; OPEN means not yet.

| Assignment | Artifact | Proof | Status |
| --- | --- | --- | --- |
| 1 | intent.md, sample/calendar-item.sample.json, src/mini.ts, test/mini.test.ts | npm run test:mini && npm run mini | OPEN |
| 2 | docs/spec.md, src/brief.ts, sample, test/schema.test.ts | npm run test:schema | OPEN |
| 3 | docs/design.md, docs/decisions/ADR-001, docs/plan.md, offline visual plan | complete route accepted before build | OPEN |
| 4 | src/render.ts, src/main.ts | npm run brief:sample | OPEN |
| 5 | `test/live.test.ts`, `src/live.ts` and local settings | Run `npm run test:live`, then `npm run live:check` in Terminal. With example settings, expect OPEN (exit 3). Record live source and dated page separately | OPEN |
| 6 | evaluations, `verify-bree`, evidence, and local gate | ordinary, OPEN, CONFLICT; one synthetic journey; current and previous versions | OPEN |
| 7 | participant-chosen intent, fixture, bounded SDK route, and proof | one synthetic journey plus separate live status | OPEN |

No secret belongs in this repository. Live connector approval, configuration, authentication, and source access remain separate checks.
