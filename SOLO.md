# Build your personal Daily Brief agent

It is 08:30. Your stand-up starts at 09:00. Bree prepares one private brief from your own permitted work items in the existing, approved Jira MCP connection.

You are the builder and reviewer. Claude Code helps you through the local AI-native SDLC. Each assignment leaves an artifact and a visible check. Missing information stays `OPEN`. Conflicting evidence stays `CONFLICT`.

Local fixtures are synthetic. Use them for tests, recordings, and reproducible evidence. The finished Bree route reads only your permitted work items through the existing approved Jira MCP connection.

## Data and permission rules

- Use Bree privately for your own work. Do not publish the brief or its live output.
- Never add customer data, credentials, connector responses, or live briefs to prompts, fixtures, screenshots, recordings, evidence files, or commits.
- Use only the existing, organisation-approved Jira MCP connection and your own permitted work items.
- Use only the organisation-approved Anthropic via Vertex model route configured for this session.
- Do not connect work email. Paste only sanitised, non-sensitive text when an exercise explicitly needs mail-like input.
- Give Bree one exact read-only source tool. Do not give it shell, file-write, messaging, or ticket-update tools.
- Stop when the connector offers write scope, the source contains customer data, or permission is unclear.

## Start synthetic work

Run every command from the project folder, `aetherlink-daily-brief-lab-s1`. It is also called the repository root. The slides show it as "Work in this folder".

The slides name each prompt `SOLO N`, or `SOLO N · Part M`. That is Assignment N, Part M in this file.

```bash
npm ci
claude --setting-sources project,user --permission-mode default --strict-mcp-config --no-chrome
```

This starts Manual mode and loads no MCP server for A1–A4. Local settings are excluded. Confirm the organisation-approved Vertex route with `/status` before the first prompt. If it is unavailable, keep model-assisted work `OPEN`; manual synthetic checks can continue.

Complete one assignment at a time. Inspect each diff and run the named check yourself before you continue.

Save your work after every part that you accept. A commit is a saved version of the project. Claude Code keeps its own terminal, so open a second terminal window in the project folder and type:

```bash
git status --short
git add -A && git commit -m "A1 P1"
```

The first command lists what changed. Stop if it shows a file that you did not make. Change the message for each part: `A1 P2`, `A2 P1`, and so on. Assignment 6 compares your last two commits, so it needs these saved versions. If Git asks who you are, run `git config user.name "Your name"` and `git config user.email "you@example.com"` once, then run the commit again.

When a named command runs, preserve its synthetic red and green output with the actual exit codes. Never reconstruct historical raw logs or record live connector contents.

| SDLC phase | Artifact and proof |
| --- | --- |
| Plan | Accepted `intent.md` and one synthetic decision line |
| Design | Accepted Dia-to-Bree contract, design, and visual plan |
| Build | Tested full HTML renderer plus one bounded SDK and MCP route |
| Test | Synthetic evaluations, one scripted journey, and separate live status |
| Deploy | A dated private HTML artifact and an approved trigger proposal. Nothing is published. |
| Maintain | One observed result becomes the next intent and check |

## Use one skill for one clear job

These skills are already included in the repository. Do not install a separate skills pack.

| Assignment | Skill | Purpose | Visible output |
| --- | --- | --- | --- |
| A1 | `/grilling` | Challenge the user, decision, and boundary | Focused questions before any edit |
| A2 | `/eli5` | Explain the contract in plain language | A field-by-field explanation |
| A3 | `/visual-plan` | Make the accepted route reviewable | One offline HTML plan |
| A4 | `/verify-this` | Prove the synthetic artifact | Exit code, output path, source, and `OPEN` behavior |
| A5 | `/eli5` | Explain the live source boundary | A plain-language boundary check |
| A6 | `/create-verification-skill` | Make the proof repeatable | A repository-specific verification skill |
| A7 | `/handoff` | Continue your own mission safely | The full fresh-session prompt in chat |

## Assignment 1: choose the user and prove one line

Use manual mode. Choose one reader and one decision that the brief should support.

**Where:** Claude Code at the repository root.

### Part 1: choose and approve the user and decision

**Action:** Paste Part 1. Answer one question at a time. Approve the wording before Claude edits files.

> Goal: choose one user and one morning decision. Context: intent.md and sample/calendar-item.sample.json. Constraints: ask me one question at a time; change no file before I approve the wording. Done when: intent.md and the sample file name my user and my decision. Output: the diff. Check: I read the diff; then stop.

```text
/grilling Challenge whether my chosen user, decision, and boundary are observable. Ask one question at a time. Do not edit files.
```

### Part 2: build one useful line

**Action:** Paste Part 2 only after you accept the change to `intent.md`.

> Goal: one calendar item becomes one decision line. Context: intent.md and reference/solo-details.md, section A1 Part 2. Constraints: write the test first; build only the mini-path. Done when: npm run test:mini is green and npm run mini prints the line. Output: the red run, the green run and the diff. Check: show real output, then stop.

**Visible result:** `npm run mini` prints one traceable decision line.

## Assignment 2: agree the brief contract

Keep the working mini route. Reverse engineer the safe structure of a useful Daily Brief before adding a model or connector.

### Part 1: propose and approve the contract

**Where:** Claude Code in manual mode.

**Action:** Paste Part 1. Read `docs/spec.md` section by section before you approve it.

> Goal: a contract for a complete DailyBrief in docs/spec.md. Context: intent.md, reference/dia-to-bree.md and reference/solo-details.md, section A2 Part 1. Constraints: write no code and no tests. Done when: the contract has every section and the rules for READY, OPEN and CONFLICT. Output: the proposed docs/spec.md. Check: stop for my approval.

```text
/eli5 Explain my brief contract. Name what each field and status protects. Do not edit files.
```

Approve the contract or request one precise revision.

### Part 2: prove the accepted contract

**Action:** Paste Part 2 only after you accept `docs/spec.md`.

> Goal: a schema that checks the contract. Context: docs/spec.md and reference/solo-details.md, section A2 Part 2. Constraints: write the test first; do not build the renderer or a connector. Done when: npm run test:schema is green and one invalid sample is rejected. Output: the red run, the green run and the diff. Check: show real output, then stop.

**Visible result:** `npm run test:schema` passes for the valid sample and rejects the invalid sample.

## Assignment 3: design the complete route

Press Shift+Tab until Claude Code shows plan mode. No implementation changes happen in this assignment.

**Where:** Claude Code in plan mode.

**Action:** Paste the prompt. Review both routes, every proof command, and every rollback before approval.

> Goal: a design, one decision record and a plan for the complete Bree route. Context: intent.md, docs/spec.md and reference/solo-details.md, section A3. Constraints: stay in plan mode; edit no file. Done when: every plan step has a path, a proof command and a rollback. Output: the proposal. Check: stop for my approval.

```text
/visual-plan plan Read the accepted intent, specification, design, and plan. Create one offline HTML plan for the complete Bree journey. Show synthetic fixtures, the full DailyBrief schema, HTML renderer, approved source, exact read-only MCP tool, Claude Agent SDK, dated private artifact, OPEN sections, approval points, and evidence after each step. Use synthetic labels and no real work data. Do not change source files or invent commands.
```

**Visible result:** Another participant can execute the plan without a hidden permission, source, or proof step.

## Assignment 4: build the synthetic product path

Use manual mode. This assignment builds the visible result with synthetic input. It does not call a model or live connector.

**Where:** Claude Code in manual mode, then your terminal and browser.

### Part 1: build and prove the full brief

**Action:** Paste Part 1. Inspect the red test, the green rerun, and the generated page.

> Goal: the sample brief becomes one HTML page at out/latest.html. Context: docs/plan.md, docs/spec.md and reference/solo-details.md, section A4 Part 1. Constraints: write the test first; local sample data only, no model call. Done when: npm run test:render is green and npm run brief:sample writes the page. Output: the red run, the green run and the diff. Check: show real output, then stop.

```text
/verify-this Prove that npm run brief:sample writes out/latest.html from synthetic data. Show the exit code, output path, source label, and unavailable-source behavior.
```

Optional, when Impeccable is available:

```text
/impeccable critique Bree's brief view. Read only. Use the accepted specification and existing visual system. Report the three most important hierarchy or accessibility issues, then stop for approval.
```

### Part 2: improve one house-style detail

**Action:** Paste Part 2. Accept one small visual change only after its failing test is visible.

> Goal: one small house-style change. Context: ask me which change. Constraints: write its failing renderer test first; change the presentation only. Done when: npm run test:render and npm run brief:sample pass. Output: the changed detail and the diff. Check: show real output, then stop.

**Visible result:** Open `out/latest.html` and trace its decision back to the synthetic input.

## Assignment 5: connect the existing read-only Jira source

Close the first Claude Code session. Your organisation provides `AETHERLINK_JIRA_MCP_CONFIG`: the path to an existing approved Jira-only MCP configuration. It must be set before the session. The trainer has no access to it and cannot provide it. If it is missing, ask a colleague from your organisation. Do not create a connector or copy the configuration into the repository. Verify it before the guarded restart:

```bash
test -n "${AETHERLINK_JIRA_MCP_CONFIG:-}" && test -f "$AETHERLINK_JIRA_MCP_CONFIG" && echo "Config found" || echo "Config missing"
```

You see `Config found`. If you see `Config missing`, keep live proof `OPEN` and do not start the live session. After `Config found`, start Claude Code with only that configuration:

```bash
claude --setting-sources project,user --permission-mode default --strict-mcp-config --mcp-config "$AETHERLINK_JIRA_MCP_CONFIG" --no-chrome
```

Run `/status` to confirm the approved Vertex route. Then use `/mcp` to inspect the existing approved connection. Local settings are not loaded. If either check fails, keep live proof `OPEN`. Do not install a connector or create a token. Keep the synthetic route for tests.

**Where:** Claude Code for the bounded route. Use your terminal only for preflight and the approved private run.

### Part 1: choose and test the source boundary

**Action:** Paste Part 1. Review the proposed tests and exact tool before you approve the build.

> Goal: tests for the boundary of the live route. Context: docs/plan.md, docs/spec.md and reference/solo-details.md, section A5 Part 1. Constraints: ask me for the exact name of the one read-only Jira tool; do not build the route; install nothing. Done when: the new tests fail for the right reason. Output: the red run. Check: stop for my approval.

Ask Claude to explain the boundary before you approve it:

```text
/eli5 Explain Bree's source boundary from Jira through one read-only tool and the Agent SDK to validated private HTML. Name what each boundary prevents. Do not edit files or expose live data.
```

Inspect one successful structured result during the private human review. Choose its exact Jira key field only after that review. The mocked `issues[].key` shape is test evidence, not live proof.

### Part 2: build and check the bounded route

**Action:** Paste Part 2 only after you approve the tests, tool, and boundary.

> Goal: the smallest live route with the Claude Agent SDK. Context: reference/solo-details.md, section A5 Part 2. Constraints: only the approved Jira read tool, through the approved MCP config; do not run npm run brief:live. Done when: the tests are green and npm run live:check prints READY or OPEN. Output: the boundaries and the diff. Check: show real output, then stop.

Create the ignored local configuration. Set its three approval flags to `true` only after the connector, read-only tool status, and model route are confirmed. Add the chosen user, decision, and exact Jira read-tool name shown by `/mcp`:

```bash
test -f .bree.local.json || cp .bree.example.json .bree.local.json
```

This command prints nothing when it works. `.bree.local.json` stores runtime approvals; it is not MCP server configuration.

Run the preflight:

```bash
npm run live:check
```

If it reports `OPEN`, record the missing approval or configuration. `OPEN` usually ends with an exit code that is not 0. That is the honest status, not a broken build.

### Part 3: create the private live brief

**Action:** After a person approves Part 2, run this privately. Do not paste a new prompt into Claude Code.

```bash
npm run brief:live
```

Open the dated HTML privately. Record only `PASS` or `OPEN` for the source and artifact.

This part changes no file in the project folder, so there is no version to save.

**Visible result:** Synthetic tests pass, exactly one tool is allowed, and the private artifact status is honestly `PASS` or `OPEN`.

## Assignment 6: make the proof repeatable

Use synthetic data for recorded evidence. Treat live connector verification as a separate private check.

### Part 1: evaluate the three evidence cases

**Where:** Claude Code in manual mode.

> Goal: prove three cases: a complete brief, missing evidence and conflicting evidence. Context: docs/spec.md and the files in sample/eval/. Constraints: fix only mismatches with the spec. Done when: npm run eval is green; missing stays OPEN and conflicting stays CONFLICT. Output: the three outcomes and the diff. Check: show real output, then stop.

**Visible result:** `npm run eval` proves the complete, `OPEN`, and `CONFLICT` cases.

### Part 2: make the proof repeatable

**Action:** Run the skill generator first. It writes `.claude/skills/verify-bree/` and runs one synthetic journey.

```text
/create-verification-skill Inspect this repository and create .claude/skills/verify-bree/. Use only commands, routes, and harnesses that exist here. Map the synthetic brief, unavailable-source result, and private live preflight. Never connect an account, write through a connector, or store live work data in evidence. Run one synthetic journey end to end. Keep the skill DRAFT if any launch, doctor, drive, evidence, or cleanup step is unproven.
```

Then paste Part 2. It checks the generated skill, runs the five checks and records the evidence.

> Goal: proof that a colleague can repeat. Context: .claude/skills/verify-bree/ and reference/solo-details.md, section A6 Part 2. Constraints: store no live content. Done when: the five checks ran, and docs/evidence.md has each command with its real exit code. Output: the evidence diff. Check: a command that nobody ran is OPEN; then stop.

**Visible result:** `docs/evidence.md` records real commands and exit codes for one cleaned-up synthetic journey.

### Part 3: prepare local delivery

**Action:** Paste Part 3. Review the command, working directory, logs, rollback, and owner. Do not enable the trigger.

> Goal: a proposal for one local daily trigger. Context: docs/evidence.md. Constraints: do not install or activate a scheduler; publish nothing. Done when: the proposal names the command, working directory, logs, rollback and owner. Output: the evidence diff. Check: mark the live source and the dated page OPEN unless I tell you that I ran them; then stop for my approval.

Commit only the accepted result. Test the previous and current commits in temporary worktrees. A worktree is a second folder with another version of the same project. `HEAD` is your last commit. `HEAD^` is the commit before it. The two folders appear next to the project folder, and you stay in the project folder:

```bash
git worktree add --detach ../daily-brief-previous HEAD^
git worktree add --detach ../daily-brief-current HEAD
(cd ../daily-brief-previous && npm ci && npm run typecheck && npm test && npm run brief:sample)
(cd ../daily-brief-current && npm ci && npm run typecheck && npm test && npm run eval && npm run brief:sample)
```

When both lines end without an error, open `out/latest.html` in the folder `daily-brief-previous` and in the folder `daily-brief-current`. Then remove the two folders:

```bash
git worktree remove ../daily-brief-previous
git worktree remove ../daily-brief-current
git worktree list
```

**Visible result:** Both synthetic versions run, the journey preserves its evidence, and live proof remains separate.

## Close the loop

Choose one result you observed. Add `## Next iteration` to `intent.md` with the command, one safe output signal, remaining risk, one improvement, and one check. Never copy live source content into the file.

## Assignment 7: build your own small agent

There is no prescribed implementation prompt. Apply the same loop to one new personal use case.

**Where:** Start in a fresh Claude Code session at the repository root.

Choose one mission:

- Jira: find today's top blocker.
- GitLab: find one merge request that needs review.
- Confluence: retrieve one agreed decision with context.
- Mock Outlook: summarise one synthetic work request from `sample/outlook-email.sample.json`.

Start with one approved source and one owner-confirmed read-only tool. Add another source only after the first mission is proven.

The Jira, GitLab and Confluence missions need a session that loads that approved source from your organisation. The trainer cannot provide it. Without one, choose the mock Outlook mission (a made-up email in the project) and start Claude Code with the `claude --setting-sources …` command from "Start synthetic work".

The mock Outlook mission is different. It uses the synthetic fixture only. It does not connect Outlook or read work email.

1. Choose one user, one decision, one mission, and one organisation-approved read-only source.
2. Define a synthetic fixture with the same shape for repeatable tests.
3. Write the intent, contract, design, and visual plan.
4. Write a red test before implementation.
5. Build the smallest bounded SDK route.
6. Prove one synthetic journey and record live access separately.
7. Inspect the diff and keep all live data outside the repository.

Use the handoff skill after you finish the mission:

```text
/handoff Write a prompt for a fresh Claude Code session to continue from my current assignment. Name the accepted artifacts, files, decisions, permission status, and next proof. Return the full prompt in chat. Do not include live data or credentials.
```

**Visible result:** A second builder can run the synthetic proof and name the next check without your help.

## Optional extension after the core route

The core Day 5 route ends after A7 and the Maintain loop. If you want another small iteration, follow the [optional ElevenLabs voice extension](docs/voice-extension.md). It uses only the synthetic brief and your personal account. It is not required for Day 5 approval.
