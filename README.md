# Daily brief agent — optional Workshop 5 bonus

This is the optional bonus after the main Workshop 5 SRE lab. You build an
agent that reads GitLab, Jira, Confluence and the Outlook calendar, or your own
GitHub, Linear and Notion, and writes a one-page morning brief.

The `main` branch is the unsolved participant starter. It contains templates
and a package skeleton. Build steps 1 through 4 during the 30 to 40 minute
classroom block. Complete steps 5 through 7 as homework.

## Start in Claude Code

You need Node.js 20 or newer, Git and Claude Code signed in with your own
account. You do not need an API key for the classroom route.

Run these commands. Use your own first name in the branch name.

```bash
git clone https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1.git
cd aetherlink-daily-brief-lab-s1
git switch -c my/firstname
claude
```

Paste this prompt into Claude Code. Approve the setup command that Claude Code
proposes before step 1. Claude Code stops after each review point.

> Read SOLO.md, AGENTS.md and progress.md in the daily-brief repo. Help me build steps 1–4 with Claude Code, one step at a time. Interview me for intent.md; ask before edits. Show a red schema test, then build the schema. Stay in plan mode until I accept. Build the sample renderer with a red-to-green test and render out/latest.html without a model call. Ask me to choose one style variation. Show its diff and test result. Run commands yourself and stop after each step for my review. Do not copy solved tags or add live credentials.

Stop after step 4. Open `out/latest.html` and confirm that `npm test` passes.
The classroom route needs no API key. Open a pull request only after the human
review in step 7.

If you already have this repository, open the existing folder in Claude Code.
Ask Claude Code to inspect `git status` before it updates anything. Preserve
your work and use `git pull --ff-only` only on a clean branch that tracks the
remote branch.

## Facilitator preparation

Use a separate reviewed branch with completed steps 1 through 4 for the
18-minute preview. Keep `main` unsolved for participants. The Workshop 5
speaker notes define the preview, the 30 to 40 minute build block and the stop
after step 4.

## The steps

| Step | Phase | You write | Proof |
| --- | --- | --- | --- |
| 1 | Plan | `intent.md` | A facilitator accepts the boundary |
| 2 | Plan | `docs/spec.md`, `src/brief.ts`, `sample/brief.sample.json`, `test/schema.test.ts` | `npm test` green on the schema tests |
| 3 | Design | `docs/design.md`, one ADR, `docs/plan.md` | A stranger can follow the plan and name what proves completion |
| 4 | Build | `src/render.ts`, `src/main.ts` | `npm run brief:sample` writes `out/latest.html` |
| 5 | Build | `src/sources.ts`, `src/agent.ts`, live wiring in `src/main.ts` | `npm test`, `npm run typecheck`, and `npm run brief:sample` green; wiring proven without a network |
| 6 | Test | `docs/evidence.md` and one screenshot | Three commands with exit codes and a reviewer |
| 7 | Gate | `docs/gate.md`, inactive schedule, PR preview | PASS / FAIL / OPEN with a quoted line |

## Always-on artifacts

`CLAUDE.md` · `AGENTS.md` · `progress.md` · `SOLO.md` — read before you change anything; append `progress.md` each SOLO.

## Rules

- Sample data only. No credential is typed into a prompt or committed. A blocked
  credential is an access result and goes down as `OPEN`, not as a failure.
- Every claim needs a source, a reproduced check and a reviewer. Anything less is
  a hypothesis and is written as `OPEN`.
- Read `intent.md` and `progress.md` before you change anything; `CLAUDE.md`
  loads them for the agent too.
- The empty scaffold has no `src/` or `test/` files. `npm run typecheck` and
  `npm test` become meaningful after SOLO 2 creates the first schema and test.

Step 2 uses the committed canonical references
`reference/The_Tuesday_Brief_-_September_1.pdf` and
`reference/The_Wednesday_Brief_-_August_26.pdf`. The October brief is an extra
example. Read `reference/README.md` before you quote them.

Walking it alone, with your own GitHub, Linear and Notion: `SOLO.md` — each step
includes a paste-ready Claude Code **Prompt** block; all seven are also in
[`docs/prompts.md`](docs/prompts.md).

## Compare with the reference after your attempt

Ask Claude Code to show a reference diff only after your own attempt. Preserve
your work and apply only the change that you reviewed. Do not copy solved files
into your branch.

```bash
git diff main step-2-spec --stat
git diff step-2-spec -- docs/spec.md
git log --oneline main..step-7-gate-deploy
```

The reference tags are `step-1-intent` through `step-7-gate-deploy`. The same
commits are available as `steps/1-intent` through `steps/7-gate-deploy` for
browsing on GitLab or GitHub.

## Interactive course

`course/` is a self-contained, six-module course that explains this lab's
workflow to someone who has never read a spec: intent, spec, design and plan,
the agent instructions, evidence and the gate, and the SOLO loop. Every code
block quotes a file in this repository exactly. No install, no server:

```bash
open course/index.html
```

To change it, edit `course/modules/*.html` and rebuild with
`cd course && bash build.sh`.
