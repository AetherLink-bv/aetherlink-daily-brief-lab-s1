# Daily brief agent: the main Workshop 5 route

This lab teaches the [AI-native SDLC](https://claude.com/resources/articles/the-ai-native-sdlc-playbook).
It has six stages, one committed file per stage, and a person decides at every
stage. The daily brief agent is the example. It reads GitLab, Jira, Confluence
and the Outlook calendar, or your own GitHub, Linear and Notion, and writes a
one-page morning brief.

This is the main Day 5 lab. The on-call SRE agent lab (`sre-oncall-agent`)
is the bonus.

The `main` branch is the unsolved participant starter. It contains templates
and a package skeleton. You build all seven steps in class: A1 to A4 (steps 1
to 4) before lunch, A5 to A7 (steps 5 to 7) after lunch.

## Start in Claude Code

You need Node.js 20 or newer, Git and Claude Code signed in with your own
account. You do not need an API key for the classroom route.
The Sonny bonus (`sre-oncall-agent`) needs Node 22, so install Node 22 if you
plan to do it.

Run these commands. Use your own first name in the branch name.

```bash
git clone https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1.git
cd aetherlink-daily-brief-lab-s1
git switch -c my/firstname
claude --setting-sources project,user --strict-mcp-config --no-chrome
```

This workshop command loads the repository settings and your user settings.
User settings include a company login such as Vertex in `~/.claude/settings.json`.
MCP servers stay off through `--strict-mcp-config`. Claude in Chrome stays off.
A large personal setup can change the tone of answers and cost more.

In class, follow the slides. Work one assignment at a time. Start with the
"Prepare your branch" prompt from `SOLO.md`, then paste one build prompt per
assignment from the slides. Approve each command that Claude Code proposes.
Claude Code stops after each review point.

Working alone? You can use this combined prompt for steps 1 to 4 instead:

> Read SOLO.md, AGENTS.md and progress.md in the daily-brief repo. Help me build steps 1–4 with Claude Code, one step at a time. Interview me for intent.md; ask before edits. Show a red schema test, then build the schema. Stay in plan mode until I accept. Build the sample renderer with a red-to-green test and render out/latest.html without a model call. Ask me to choose one style variation. Show its diff and test result. Run commands yourself and stop after each step for my review. Do not copy solved tags or add live credentials.

Before lunch, finish step 4. Open `out/latest.html` and confirm that `npm test`
passes. After lunch, continue with steps 5 to 7 in `SOLO.md`. Steps 1 to 4 need
no API key. Open a pull request only after the human
review in step 7.

If you already have this repository, open the existing folder in Claude Code.
Ask Claude Code to inspect `git status` before it updates anything. Preserve
your work and use `git pull --ff-only` only on a clean branch that tracks the
remote branch.

## Facilitator preparation

There is no preview. The deck is `day5-daily-brief` in the classroom slides.
Keep `main` unsolved for participants. The reference tags `step-1-intent` to
`step-7-gate-deploy` are for comparing after an attempt, not for showing first.

## The steps

| Step | Phase | You write | Proof |
| --- | --- | --- | --- |
| 1 | Plan | `intent.md` | A facilitator accepts the boundary |
| 2 | Design | `docs/spec.md`, `src/brief.ts`, `sample/brief.sample.json`, `test/schema.test.ts` | `npm test` green on the schema tests |
| 3 | Build (plan mode writes `docs/plan.md`) | `docs/design.md`, one ADR, `docs/plan.md` | A stranger can follow the plan and name what proves completion |
| 4 | Build | `src/render.ts`, `src/main.ts` | `npm run brief:sample` writes `out/latest.html` |
| 5 | Build | `src/sources.ts`, `src/agent.ts`, live wiring in `src/main.ts` | `npm test`, `npm run typecheck`, and `npm run brief:sample` green; wiring proven without a network |
| 6 | Test | `docs/evidence.md` and one screenshot | Three commands with exit codes and a reviewer |
| 7 | Deploy | `docs/gate.md`, inactive schedule, PR preview | PASS / FAIL / OPEN with a quoted line |

Maintain is not an assignment. OPEN items in `docs/gate.md` become a new `intent.md`.

## Always-on artifacts

`CLAUDE.md` · `AGENTS.md` · `progress.md` · `SOLO.md`. Read before you change anything; append `progress.md` each SOLO.

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

Walking it alone, with your own GitHub, Linear and Notion: `SOLO.md`. Each step
includes a paste-ready Claude Code **Prompt** block; all seven are also in
[`docs/prompts.md`](docs/prompts.md).

## Compare with the reference after your attempt

Ask Claude Code to show a reference diff only after your own attempt. Preserve
your work and apply only the change that you reviewed. Do not copy solved files
into your branch.

```bash
git diff main step-2-spec -- src test docs
git diff step-2-spec -- docs/spec.md
git log --oneline main..step-7-gate-deploy
```

Compare by path. A plain `git diff main step-2-spec --stat` shows unrelated
deletions, because the tags predate `course/` and the PDFs.

The reference tags are `step-1-intent` through `step-7-gate-deploy`. The same
commits are available as `steps/1-intent` through `steps/7-gate-deploy` for
browsing on GitLab or GitHub. The tag for step 5 has many tools. The assignment
builds one.

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
