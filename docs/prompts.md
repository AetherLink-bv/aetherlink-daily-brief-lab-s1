# Exact Claude Code prompts

These twelve prompt parts are identical to A1–A6 in `SOLO.md`. A7 is participant-designed.

## Assignment 1: choose the user and prove one line

### Part 1

> Goal: one user and one morning decision for the brief. Context: intent.md, sample/calendar-item.sample.json and reference/solo-details.md, section A1 Part 1. Constraints: do not ask more than one question at a time; change no file before I approve the wording. Done when: the User and decision section of intent.md has no TEMPLATE line, and the sample file names my user and my decision. Output: the diff. Check: I read the diff.

### Part 2

> Goal: one calendar item becomes one decision line. Context: intent.md and reference/solo-details.md, section A1 Part 2. Constraints: no code before its test is red; nothing beyond the mini-path; do not go on after the diff. Done when: npm run test:mini is green and npm run mini prints the line. Output: the red run, the green run and the diff. Check: real output only; mark doubts as OPEN.

## Assignment 2: agree the brief contract

### Part 1

> Goal: a contract for a complete DailyBrief in docs/spec.md. Context: intent.md, reference/dia-to-bree.md and reference/solo-details.md, section A2 Part 1. Constraints: no code and no tests; do not go on before I approve. Done when: the contract has every section and the rules for READY, OPEN and CONFLICT. Output: the proposed docs/spec.md. Check: I approve it, or I ask for one change.

### Part 2

> Goal: a schema in src/brief.ts that checks the contract. Context: docs/spec.md and reference/solo-details.md, section A2 Part 2. Constraints: no code before its test is red; no renderer and no connector; do not go on after the diff. Done when: npm run test:schema is green and one invalid sample is rejected. Output: the red run, the green run and the diff. Check: real output only; mark doubts as OPEN.

## Assignment 3: design the complete route

> Goal: a design, one decision record and a plan for the complete Bree route. Context: intent.md, docs/spec.md and reference/solo-details.md, section A3. Constraints: do not leave plan mode and edit no file before I approve. Done when: every plan step has a path, a proof command and a rollback. Output: the proposal; after my approval, the saved documents and the diff. Check: I approve it, or I ask for one change.

## Assignment 4: build the synthetic product path

### Part 1

> Goal: the sample brief becomes one HTML page at out/latest.html. Context: docs/plan.md, docs/spec.md and reference/solo-details.md, section A4 Part 1. Constraints: no code before its test is red; no model call and no live data; do not go on after the diff. Done when: npm run test:render is green and npm run brief:sample writes the page. Output: the red run, the green run and the diff. Check: real output only; mark doubts as OPEN.

### Part 2

> Goal: one small house-style change. Context: out/latest.html and reference/solo-details.md, section A4 Part 2. Constraints: no change before I name it; no code before its test is red; no change to the facts or the schema; do not go on after the diff. Done when: npm run test:render and npm run brief:sample pass. Output: the changed detail and the diff. Check: real output only; mark doubts as OPEN.

## Assignment 5: test what Bree may read

Keep your current Claude Code session for the sample route. Reply `OPEN` when asked for a tool. Only restart to load a newly added Jira server. Use your existing organisation sign-in. If asked for a personal API key, cancel. Run available local checks or work with a partner. Keep your own unverified results `OPEN`.

In Terminal, `npm run test:live` runs sample tests and `npm run live:check` checks local settings. If either asks for a key, follow the [offline check in the README](../README.md#check-the-code-and-the-settings). Only the optional private run uses approved model and Jira access. For Worldline the SDK needs both user and local settings in an organisation-approved profile. See [A5 Part 2](../reference/solo-details.md#a5-part-2).

### Part 1

> Goal: tests for the boundary of the live route. Context: docs/plan.md, docs/spec.md and reference/solo-details.md, section A5 Part 1. Constraints: no route yet; no installs; no tool name of your own: ask me for it, and accept OPEN. Done when: the new tests fail for the right reason. Output: the red run. Check: I approve the tool and the tests.

### Part 2

> Goal: the smallest live route with the Claude Agent SDK. Context: reference/solo-details.md, section A5 Part 2. Constraints: no tool other than the approved Jira read tool; no MCP config other than the approved one; do not run npm run brief:live. Done when: the tests are green and npm run live:check prints READY or OPEN. Output: the boundaries and the diff. Check: real output only; mark doubts as OPEN.

## Assignment 6: make the proof repeatable

### Part 1

> Goal: test/eval.test.ts proves three cases: a complete brief, missing evidence and conflicting evidence. Context: docs/spec.md, the three -brief.json files in sample/eval/ and reference/solo-details.md, section A6 Part 1. Constraints: no change to the spec; fix only mismatches with it; do not go on after the diff. Done when: npm run eval is green; missing stays OPEN and conflicting stays CONFLICT. Output: the three outcomes and the diff. Check: real output only; mark doubts as OPEN.

### Part 2

> Goal: proof that a colleague can repeat. Context: .claude/skills/verify-bree/ and reference/solo-details.md, section A6 Part 2. Constraints: no live content in the skill or the evidence; do not go on after the evidence diff. Done when: the five checks ran, and docs/evidence.md has each command with its real exit code. Output: the evidence diff. Check: a command that nobody ran is OPEN.

### Part 3

> Goal: a proposal for one organisation-approved local daily trigger in docs/gate.md. Context: docs/evidence.md, docs/gate.md and reference/solo-details.md, section A6 Part 3. Constraints: do not install or activate a scheduler; publish nothing; do not go on before I approve. Done when: docs/gate.md names the command, working directory, logs, rollback and owner. Output: the diff. Check: the live source and the dated page stay OPEN unless I tell you that I ran them.

The optional voice route is separate from these core prompts. Start it only after A7 and the Maintain loop. [Open the optional voice extension](voice-extension.md).
