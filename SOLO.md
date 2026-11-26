# Build your personal Daily Brief agent

It is 08:30. Your stand-up starts at 09:00. Bree helps you choose what to raise at stand-up. Start with sample items. You can also try your own items with approved Jira access.

You are the builder and reviewer. Claude Code helps you through the local AI-native SDLC. Each assignment leaves an artifact and a visible check. Missing information stays `OPEN`. Conflicting evidence stays `CONFLICT`.

Local fixtures are synthetic. Use them for tests, recordings, and reproducible evidence. The optional private run in Assignment 5 reads only your own permitted work items.

## Data and permission rules

- Use Bree privately for your own work. Do not publish the brief or its live output.
- Never add customer data, credentials, connector responses, or live briefs to prompts, fixtures, screenshots, recordings, evidence files, or commits.
- For the optional private run in Assignment 5, use only the approved Jira server and your own permitted items.
- Do not connect work email. Paste only sanitised, non-sensitive text when an exercise explicitly needs mail-like input.
- Give Bree one exact read-only source tool. Do not give it shell, file-write, messaging, or ticket-update tools.
- Stop when the connector offers write scope, the source contains customer data, or permission is unclear.

## Start synthetic work

Run every command from the project folder, `aetherlink-daily-brief-lab-s1`. It is also called the repository root. The slides show it as "Work in this folder".

Use Windows PowerShell 5.1 or macOS Terminal. Enter one command at a time. Wait for it to finish before entering the next. Stop on an unexpected error. If PowerShell blocks `npm.ps1`, type `npm.cmd` wherever this guide says `npm`. Keep the organisation’s execution policy. For the exit code, enter `$LASTEXITCODE` in PowerShell or `echo $?` on macOS immediately after the command.

The slides name each prompt `SOLO N`, or `SOLO N · Part M`. That is Assignment N, Part M in this file.

```text
npm ci
claude --permission-mode default
```

Claude Code starts in manual mode and asks before edits or commands.

Use your existing organisation sign-in for Claude Code. If it asks for a personal API key, cancel the prompt. If your approved sign-in is unavailable, run the local checks for code you already have or work with a partner. Keep anything you could not verify yourself `OPEN`.

Complete one assignment at a time. Inspect each diff and run the named check yourself before you continue.

### How the prompts are written

Each prompt has the six parts of Day 1, with their Day 1 meaning: Goal is the result you want, Context what the model needs to know, Constraints what it must not do, Done when what good looks like, Output the format you want back, and Check how you verify it. The prompts are short. The exact requirements of a part are in `reference/solo-details.md`, and every prompt names its section.

- Assignments 1 and 2, and Assignment 6, Parts 1 and 3: paste the prompt.
- Assignments 3 and 4, and Assignment 6, Part 2: find the six parts in the prompt, then paste it.
- Assignment 5, Parts 1 and 2: write the prompt in a note first, in six lines. Compare it with the prompt in this file. Then send only the prompt in this file.

The prompt in this file is always the backup. It gives every participant the same result.

Save your work after every part that you accept. A commit is a saved version of the project. Claude Code keeps its own terminal, so open a second terminal window in the project folder and type:

```text
git status --short
```

Stop if the status lists an unexpected or private file. Otherwise save the accepted part:

```text
git add -A
git commit -m "A1 P1"
```

Change the message for each part: `A1 P2`, `A2 P1`, and so on. Assignment 6 compares your last two commits, so it needs these saved versions. If Git asks who you are, run `git config user.name "Your name"` and `git config user.email "you@example.com"` once, then run the commit again.

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
| A4 | `/verify-this` | Prove the synthetic artifact | Exit code, output path, and source line |
| A5 | `/eli5` | Explain the live source boundary | A plain-language boundary check |
| A6 | `/create-verification-skill` | Make the proof repeatable | A repository-specific verification skill |
| A7 | `/handoff` | Continue your own mission safely | The full fresh-session prompt in chat |

## Assignment 1: choose the user and prove one line

Use manual mode. Choose one reader and one decision that the brief should support.

**Where:** Claude Code at the repository root.

### Part 1: choose and approve the user and decision

**Action:** Paste Part 1. Answer one question at a time. Approve the wording before Claude edits files.

> Goal: one user and one morning decision for the brief. Context: intent.md, sample/calendar-item.sample.json and reference/solo-details.md, section A1 Part 1. Constraints: do not ask more than one question at a time; change no file before I approve the wording. Done when: the User and decision section of intent.md has no TEMPLATE line, and the sample file names my user and my decision. Output: the diff. Check: I read the diff.

```text
/grilling Challenge whether my chosen user, decision, and boundary are observable. Ask one question at a time. Do not edit files.
```

### Part 2: build one useful line

**Action:** Paste Part 2 only after you accept the change to `intent.md`.

> Goal: one calendar item becomes one decision line. Context: intent.md and reference/solo-details.md, section A1 Part 2. Constraints: no code before its test is red; nothing beyond the mini-path; do not go on after the diff. Done when: npm run test:mini is green and npm run mini prints the line. Output: the red run, the green run and the diff. Check: real output only; mark doubts as OPEN.

**Visible result:** `npm run mini` prints one traceable decision line.

## Assignment 2: agree the brief contract

Keep the working mini route. Reverse engineer the safe structure of a useful Daily Brief before adding a model or connector.

### Part 1: propose and approve the contract

**Where:** Claude Code in manual mode.

**Action:** Paste Part 1. Read `docs/spec.md` section by section before you approve it.

> Goal: a contract for a complete DailyBrief in docs/spec.md. Context: intent.md, reference/dia-to-bree.md and reference/solo-details.md, section A2 Part 1. Constraints: no code and no tests; do not go on before I approve. Done when: the contract has every section and the rules for READY, OPEN and CONFLICT. Output: the proposed docs/spec.md. Check: I approve it, or I ask for one change.

```text
/eli5 Explain my brief contract. Name what each field and status protects. Do not edit files.
```

Approve the contract or request one precise revision.

### Part 2: prove the accepted contract

**Action:** Paste Part 2 only after you accept `docs/spec.md`.

> Goal: a schema in src/brief.ts that checks the contract. Context: docs/spec.md and reference/solo-details.md, section A2 Part 2. Constraints: no code before its test is red; no renderer and no connector; do not go on after the diff. Done when: npm run test:schema is green and one invalid sample is rejected. Output: the red run, the green run and the diff. Check: real output only; mark doubts as OPEN.

**Visible result:** `npm run test:schema` passes for the valid sample and rejects the invalid sample.

## Assignment 3: design the complete route

Press Shift+Tab until Claude Code shows plan mode. No implementation changes happen in this assignment.

**Where:** Claude Code in plan mode.

**Action:** Find the six parts in the prompt below, then paste it. Review both routes, every proof command, and every rollback before approval.

> Goal: a design, one decision record and a plan for the complete Bree route. Context: intent.md, docs/spec.md and reference/solo-details.md, section A3. Constraints: do not leave plan mode and edit no file before I approve. Done when: every plan step has a path, a proof command and a rollback. Output: the proposal; after my approval, the saved documents and the diff. Check: I approve it, or I ask for one change.

```text
/visual-plan plan Read the accepted intent, specification, design, and plan. Create one offline HTML plan for the complete Bree journey. Show synthetic fixtures, the full DailyBrief schema, HTML renderer, approved source, exact read-only MCP tool, Claude Agent SDK, dated private artifact, OPEN sections, approval points, and evidence after each step. Use synthetic labels and no real work data. Do not change source files or invent commands.
```

**Visible result:** Another participant can execute the plan without a hidden permission, source, or proof step.

## Assignment 4: build the synthetic product path

Use manual mode. Build the renderer with Claude Code. The sample command, `npm run brief:sample`, generates local HTML without calling a model or live connector. Opening the HTML may fetch its illustration.

**Where:** Claude Code in manual mode, then your terminal and browser.

### Part 1: build and prove the full brief

**Action:** Find the six parts in Part 1 below, then paste it. Inspect the red test, the green rerun, and the generated page.

> Goal: the sample brief becomes one HTML page at out/latest.html. Context: docs/plan.md, docs/spec.md and reference/solo-details.md, section A4 Part 1. Constraints: no code before its test is red; no model call and no live data; do not go on after the diff. Done when: npm run test:render is green and npm run brief:sample writes the page. Output: the red run, the green run and the diff. Check: real output only; mark doubts as OPEN.

```text
/verify-this Prove that npm run brief:sample writes out/latest.html from synthetic data. Show the exit code, the output path, and the source line that it prints.
```

Optional, when Impeccable is available:

```text
/impeccable critique Bree's brief view. Read only. Use the accepted specification and existing visual system. Report the three most important hierarchy or accessibility issues, then stop for approval.
```

### Part 2: improve one house-style detail

**Action:** Find the six parts in Part 2 below, then paste it. Accept one small visual change only after its failing test is visible.

> Goal: one small house-style change. Context: out/latest.html and reference/solo-details.md, section A4 Part 2. Constraints: no change before I name it; no code before its test is red; no change to the facts or the schema; do not go on after the diff. Done when: npm run test:render and npm run brief:sample pass. Output: the changed detail and the diff. Check: real output only; mark doubts as OPEN.

**Visible result:** Open `out/latest.html` and trace its decision back to the synthetic input.

## Assignment 5: test what Bree may read

Use Claude Code in manual mode. Keep your current session for the sample route. Reply `OPEN` when Claude asks for a Jira tool.

Only with approval, check `/mcp` in your existing session. If Jira is missing and you want the private route, add it from the project folder in Terminal:

```text
claude mcp add --transport http jira https://mcpjira.kazan.ai.worldline-solutions.com/mcp
```

Restart Claude Code only after adding the server. Type `/exit`, then run `claude --permission-mode default` in Terminal. Otherwise keep the session open. In `/mcp`, sign in to Jira privately and verify the exact name of one read-only tool. Approve only that read call. Without a verified name, reply `OPEN`.

### Part 1: choose and test the source boundary

**Action:** Write this prompt in a note first, in six lines. Take two minutes. Compare it with Part 1 below. Then send only Part 1, so that nothing runs twice. Review the proposed tests. With Jira, check the exact tool name. Without Jira, approve the mocked tests and leave the live tool OPEN.

> Goal: tests for the boundary of the live route. Context: docs/plan.md, docs/spec.md and reference/solo-details.md, section A5 Part 1. Constraints: no route yet; no installs; no tool name of your own: ask me for it, and accept OPEN. Done when: the new tests fail for the right reason. Output: the red run. Check: I approve the tool and the tests.

Ask Claude to explain the boundary before you approve it:

```text
/eli5 Explain Bree's source boundary from Jira through one read-only tool and the Agent SDK to validated private HTML. Name what each boundary prevents. Do not edit files or expose live data.
```

If you have approved Jira access and a successful result, inspect it privately to identify its Jira key field. Otherwise, use the synthetic `issues[].key` fixture for the tests and record the live key field as `OPEN`.

### Part 2: build and check the bounded route

**Action:** After approving the tests and the boundary for your route, write this prompt in a note. Compare it with Part 2 below, then send only Part 2.

> Goal: the smallest live route with the Claude Agent SDK. Context: reference/solo-details.md, section A5 Part 2. Constraints: no tool other than the approved Jira read tool; no MCP config other than the approved one; do not run npm run brief:live. Done when: the tests are green and npm run live:check prints READY or OPEN. Output: the boundaries and the diff. Check: real output only; mark doubts as OPEN.

In the `src/live.ts` diff, check `settingSources: ['user', 'local']` for Worldline. Use an organisation-approved profile. User settings can load hooks, environment variables and permission rules. Check that Bree still has no built-in tools and allows only the verified Jira tool.

Create the ignored local configuration if it is missing:

```text
npm run config:init
```

`.bree.local.json` is not MCP server configuration. With a verified read-only tool, enter its exact name from `/mcp`, your user and your decision in `.bree.local.json`. Without one, keep the placeholder and expect `OPEN` from the offline check.

In Terminal, run the sample tests. Then check the local settings:

```text
npm run test:live
npm run live:check
```

The tests should pass. With the example tool the settings give `OPEN` (exit 3). `READY` (exit 0) only confirms the fields in the file. If either command asks for a key, cancel. Follow the [offline check in the README](README.md#check-the-code-and-the-settings).

### Part 3: record two statuses

Missing approval, a verified read-only Jira tool or local `READY`? Record `source OPEN` and `page OPEN`. Continue with `out/latest.html` in Assignment 6.

<details>
<summary>Optional private run</summary>

Only with all three checks and existing, approved model and Jira access, run this yourself in Terminal:

```text
npm run brief:live
```

On Windows the private run checks the output folder and any existing page before calling the model. If it cannot verify private access, it returns `OPEN` (exit 3). Continue with `npm run brief:sample`. After a successful run, open the printed path privately in File Explorer or Finder. Record only `PASS` or `OPEN` for the source and the page separately. If you skip the run, keep both `OPEN`.

</details>

This part changes no file in the project folder, so there is no version to save.

**Visible result:** Synthetic tests pass, exactly one tool is allowed, and the private artifact status is honestly `PASS` or `OPEN`.

## Assignment 6: make the proof repeatable

Use synthetic data for recorded evidence. Treat live connector verification as a separate private check.

### Part 1: evaluate the three evidence cases

**Where:** Claude Code in manual mode.

> Goal: test/eval.test.ts proves three cases: a complete brief, missing evidence and conflicting evidence. Context: docs/spec.md, the three -brief.json files in sample/eval/ and reference/solo-details.md, section A6 Part 1. Constraints: no change to the spec; fix only mismatches with it; do not go on after the diff. Done when: npm run eval is green; missing stays OPEN and conflicting stays CONFLICT. Output: the three outcomes and the diff. Check: real output only; mark doubts as OPEN.

**Visible result:** `npm run eval` proves the complete, `OPEN`, and `CONFLICT` cases.

### Part 2: make the proof repeatable

**Action:** Run the skill generator first. It writes `.claude/skills/verify-bree/` and runs one synthetic journey.

```text
/create-verification-skill Inspect this repository and create .claude/skills/verify-bree/. Use only commands, routes, and harnesses that exist here. Map the synthetic brief, unavailable-source result, and private live preflight. Never connect an account, write through a connector, or store live work data in evidence. Run one synthetic journey end to end. Keep the skill DRAFT if any launch, doctor, drive, evidence, or cleanup step is unproven.
```

Then find the six parts in Part 2 below, and paste it. It checks the generated skill, runs the five checks and records the evidence.

> Goal: proof that a colleague can repeat. Context: .claude/skills/verify-bree/ and reference/solo-details.md, section A6 Part 2. Constraints: no live content in the skill or the evidence; do not go on after the evidence diff. Done when: the five checks ran, and docs/evidence.md has each command with its real exit code. Output: the evidence diff. Check: a command that nobody ran is OPEN.

**Visible result:** `docs/evidence.md` records real commands and exit codes for one cleaned-up synthetic journey.

### Part 3: prepare local delivery

**Action:** Paste Part 3. Review the command, working directory, logs, rollback, and owner. Do not enable the trigger.

> Goal: a proposal for one organisation-approved local daily trigger in docs/gate.md. Context: docs/evidence.md, docs/gate.md and reference/solo-details.md, section A6 Part 3. Constraints: do not install or activate a scheduler; publish nothing; do not go on before I approve. Done when: docs/gate.md names the command, working directory, logs, rollback and owner. Output: the diff. Check: the live source and the dated page stay OPEN unless I tell you that I ran them.

Commit only the accepted result. Test the previous and current commits in temporary worktrees. A worktree is a second folder with another version of the same project. `HEAD` is your last commit. `HEAD^` is the commit before it. The two folders appear next to the project folder, and you stay in the project folder:

```text
git worktree add --detach ../daily-brief-previous HEAD^
git worktree add --detach ../daily-brief-current HEAD
```

Check the previous version. Enter each command from the original project folder. Continue after it succeeds.

```text
npm --prefix ../daily-brief-previous ci
npm --prefix ../daily-brief-previous run typecheck
npm --prefix ../daily-brief-previous test
npm --prefix ../daily-brief-previous run brief:sample
```

Check the current version from that same project folder:

```text
npm --prefix ../daily-brief-current ci
npm --prefix ../daily-brief-current run typecheck
npm --prefix ../daily-brief-current test
npm --prefix ../daily-brief-current run eval
npm --prefix ../daily-brief-current run brief:sample
```

In File Explorer or Finder, open `out/latest.html` in each worktree. Inspect both pages. Once you have saved the evidence, close them and remove the two temporary folders:

```text
git worktree remove ../daily-brief-previous
git worktree remove ../daily-brief-current
git worktree list
```

**Visible result:** Both synthetic versions run, the journey preserves its evidence, and live proof remains separate.

## Close the loop

Choose one result you observed. Add `## Next iteration` to `intent.md` with the command, one safe output signal, remaining risk, one improvement, and one check. Never copy live source content into the file.

## Assignment 7: build your own small agent

There is no prescribed implementation prompt. Apply the same loop to one new personal use case.

**Where:** Use the same project folder as Assignment 6.

Choose one mission:

- Jira: find today's top blocker.
- GitLab: find one merge request that needs review.
- Confluence: retrieve one agreed decision with context.
- Mock Outlook: summarise one synthetic work request from `sample/outlook-email.sample.json`.

Choose one source. Keep your current Claude Code session for Mock Outlook or an existing approved connection.

- **Jira:** Use the connection from Assignment 5.
- **GitLab:** Only if you need to add this approved server, run `claude mcp add --transport http gitlab https://mcpgitlab.kazan.ai.worldline-solutions.com/mcp` in the project folder.
- **Confluence:** Only if you need to add this approved server, run `claude mcp add --transport http confluence https://mcpconfluence.kazan.ai.worldline-solutions.com/mcp` in the project folder.
- **Mock Outlook:** Use the sample email. Skip connector setup.

Only after adding a new server, type `/exit` and restart in the project folder with `claude --permission-mode default`. For a live mission, open `/mcp`, sign in privately and verify one read-only tool. If you cannot confirm access, choose Mock Outlook.

1. Choose one user, one decision, one mission, and one read-only source that you connected with `claude mcp add` (or Mock Outlook).
2. Define a synthetic fixture with the same shape for repeatable tests.
3. Write the intent, contract, design, and visual plan.
4. Write a red test before implementation.
5. Build the smallest route. An optional Worldline model run uses `settingSources: ['user', 'local']`. Keep `tools: []`. For a connected mission, restrict `allowedTools`, `canUseTool` and `PreToolUse` to its one approved read-only tool. Mock Outlook permits no tools. Its test stays offline. Only an explicitly chosen model run sends the sample to the approved provider.
6. Prove one synthetic journey and record live access separately.
7. Inspect the diff and keep all live data outside the repository.

Use the handoff skill after you finish the mission:

```text
/handoff Write a prompt for a fresh Claude Code session to continue from my current assignment. Name the accepted artifacts, files, decisions, permission status, and next proof. Return the full prompt in chat. Do not include live data or credentials.
```

**Visible result:** A second builder can run the synthetic proof and name the next check without your help.

## Optional extension after the core route

The core Day 5 route ends after A7 and the Maintain loop. If you want another small iteration, follow the [optional ElevenLabs voice extension](docs/voice-extension.md). It uses only the synthetic brief and your personal account. It is not required for Day 5 approval.
