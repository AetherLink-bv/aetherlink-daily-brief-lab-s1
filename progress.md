# Progress — Daily brief agent lab

Status per step. VERIFIED means the proof command ran in the current checkout; OPEN means not yet.

| Step | Artifact | Proof | Status |
| --- | --- | --- | --- |
| 1 | intent.md, sample/calendar-item.sample.json, src/mini.ts, test/mini.test.ts | npm run test:mini && npm run mini | VERIFIED 2026-11-24 (Maya reran both; exit 0) |
| 2 | docs/spec.md, src/brief.ts, sample, test/schema.test.ts | npm test (schema) | VERIFIED 2026-11-24 (Maya reran `npm run test:schema`; exit 0) |
| 3 | docs/design.md, docs/decisions/ADR-001, docs/plan.md, offline visual plan | complete route accepted before build | VERIFIED 2026-11-24 (Maya accepted design, ADR-001, plan and the visual plan; `npm run docs:check` exit 0) |
| 4 | src/render.ts, src/main.ts | npm run brief:sample | VERIFIED 2026-11-24 (Maya reran `npm run test:render` and `npm run brief:sample`; exit 0; page opened) |
| 5 | `test/live.test.ts`, `src/live.ts` and local settings | Run `npm run test:live`, then `npm run live:check` in PowerShell or Terminal. With example settings, expect OPEN (exit 3). Record live source and dated page separately | Codex reran 20 synthetic tests on macOS on 2026-11-26 (exit 0). Missing or broad Windows permissions stopped the mocked model before its first call. Native Windows publication remains OPEN. The local preflight returned OPEN for missing or example settings (exit 3) and READY for a synthetic tool name (exit 0). Live source and private page: OPEN. |
| 6 | evaluations, `verify-bree`, evidence, and local gate | ordinary, OPEN, CONFLICT; one synthetic journey; current and previous versions | Eval and synthetic journey VERIFIED 2026-11-24 (`npm run eval` exit 0; `verify-bree` journey PASS; evidence in `docs/evidence.md`). Previous-vs-current worktree check VERIFIED 2026-11-24 (both exit 0, worktrees removed, status clean). Trigger: proposal only in `docs/gate.md`, nothing installed. |
| 7 | participant-chosen intent, fixture, bounded SDK route, and proof | one synthetic journey plus separate live status | Codex reran the Mock Outlook tests on 2026-11-26 (9 passed, exit 0). The local `npm run outlook` printed the sourced deadline (exit 0). The optional Worldline model run remains OPEN. |

No secret belongs in this repository. Live connector approval, configuration, authentication, and source access remain separate checks.
