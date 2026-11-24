# Exact Claude Code prompts

These twelve prompt parts are identical to A1–A6 in `SOLO.md`. A7 is participant-designed.

## Assignment 1: choose the user and prove one line

### Part 1

> Goal: choose one user and one morning decision. Context: intent.md and sample/calendar-item.sample.json. Constraints: ask me one question at a time; change no file before I approve the wording. Done when: intent.md and the sample file name my user and my decision. Output: the diff. Check: I read the diff; then stop.

### Part 2

> Goal: one calendar item becomes one decision line. Context: intent.md and reference/solo-details.md, section A1 Part 2. Constraints: write the test first; build only the mini-path. Done when: npm run test:mini is green and npm run mini prints the line. Output: the red run, the green run and the diff. Check: show real output, then stop.

## Assignment 2: agree the brief contract

### Part 1

> Goal: a contract for a complete DailyBrief in docs/spec.md. Context: intent.md, reference/dia-to-bree.md and reference/solo-details.md, section A2 Part 1. Constraints: write no code and no tests. Done when: the contract has every section and the rules for READY, OPEN and CONFLICT. Output: the proposed docs/spec.md. Check: stop for my approval.

### Part 2

> Goal: a schema that checks the contract. Context: docs/spec.md and reference/solo-details.md, section A2 Part 2. Constraints: write the test first; do not build the renderer or a connector. Done when: npm run test:schema is green and one invalid sample is rejected. Output: the red run, the green run and the diff. Check: show real output, then stop.

## Assignment 3: design the complete route

> Goal: a design, one decision record and a plan for the complete Bree route. Context: intent.md, docs/spec.md and reference/solo-details.md, section A3. Constraints: stay in plan mode; edit no file. Done when: every plan step has a path, a proof command and a rollback. Output: the proposal. Check: stop for my approval.

## Assignment 4: build the synthetic product path

### Part 1

> Goal: the sample brief becomes one HTML page at out/latest.html. Context: docs/plan.md, docs/spec.md and reference/solo-details.md, section A4 Part 1. Constraints: write the test first; local sample data only, no model call. Done when: npm run test:render is green and npm run brief:sample writes the page. Output: the red run, the green run and the diff. Check: show real output, then stop.

### Part 2

> Goal: one small house-style change. Context: ask me which change. Constraints: write its failing renderer test first; change the presentation only. Done when: npm run test:render and npm run brief:sample pass. Output: the changed detail and the diff. Check: show real output, then stop.

## Assignment 5: connect the existing read-only Jira source

Before Part 1, close the synthetic-only session. Ask the trainer to make the existing approved Jira-only config path available privately as `AETHERLINK_JIRA_MCP_CONFIG`. Verify the file before restarting Claude Code with `--permission-mode default --strict-mcp-config --mcp-config "$AETHERLINK_JIRA_MCP_CONFIG"`. Confirm the approved Vertex route with `/status` and the Jira-only connection with `/mcp`. Missing access stays `OPEN`. `.bree.local.json` stores runtime approvals; it is not MCP server configuration.

### Part 1

> Goal: tests for the boundary of the live route. Context: docs/plan.md, docs/spec.md and reference/solo-details.md, section A5 Part 1. Constraints: ask me for the exact name of the one read-only Jira tool; do not build the route; install nothing. Done when: the new tests fail for the right reason. Output: the red run. Check: stop for my approval.

### Part 2

> Goal: the smallest live route with the Claude Agent SDK. Context: reference/solo-details.md, section A5 Part 2. Constraints: only the approved Jira read tool, through the approved MCP config; do not run npm run brief:live. Done when: the tests are green and npm run live:check prints READY or OPEN. Output: the boundaries and the diff. Check: show real output, then stop.

## Assignment 6: make the proof repeatable

### Part 1

> Goal: prove three cases: a complete brief, missing evidence and conflicting evidence. Context: docs/spec.md and the files in sample/eval/. Constraints: fix only mismatches with the spec. Done when: npm run eval is green; missing stays OPEN and conflicting stays CONFLICT. Output: the three outcomes and the diff. Check: show real output, then stop.

### Part 2

> Goal: proof that a colleague can repeat. Context: .claude/skills/verify-bree/ and reference/solo-details.md, section A6 Part 2. Constraints: store no live content. Done when: the five checks ran, and docs/evidence.md has each command with its real exit code. Output: the evidence diff. Check: a command that nobody ran is OPEN; then stop.

### Part 3

> Goal: a proposal for one local daily trigger. Context: docs/evidence.md. Constraints: do not install or activate a scheduler; publish nothing. Done when: the proposal names the command, working directory, logs, rollback and owner. Output: the evidence diff. Check: mark the live source and the dated page OPEN unless I tell you that I ran them; then stop for my approval.

The optional voice route is separate from these core prompts. Start it only after A7 and the Maintain loop. [Open the optional voice extension](voice-extension.md).
