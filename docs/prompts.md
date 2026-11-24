# Exact Claude Code prompts

These twelve prompt parts are identical to A1–A6 in `SOLO.md`. A7 is participant-designed.

## Assignment 1: choose the user and prove one line

### Part 1

> Read CLAUDE.md, SOLO.md, intent.md, progress.md, and sample/calendar-item.sample.json. Interview me one question at a time until I choose one user and one morning decision. After I approve the wording, update the User and decision section of intent.md and the matching synthetic fixture fields. Show the diff and stop.

### Part 2

> Read the accepted intent.md and sample/calendar-item.sample.json. Write test/mini.test.ts first for one exact line in the form `<start> <title> — decide: <decision>`. Run npm run test:mini and show the expected red failure. Build src/mini.ts. Run npm run test:mini and npm run mini. Show the green proof and diff, then stop. State clearly that this synthetic line is a learning slice, not the finished agent.

## Assignment 2: agree the brief contract

### Part 1

> Read the accepted intent.md, reference/dia-to-bree.md, reference/brief-example.md, and sample/brief.sample.json. Reverse engineer only the safe structural pattern: title, date, greeting, summary, one move-work-forward action, top todos, new updates, your day, and sources. Draft docs/spec.md with the complete DailyBrief schema. Title and greeting are strings; date uses YYYY-MM-DD. Summary and moveWorkForward are single items. TopTodos, newUpdates, and yourDay are non-empty item arrays. Every item has status READY, OPEN, or CONFLICT, text, and sourceIds. READY and CONFLICT items have at least one source ID; OPEN may have none. Every sourceId resolves in sources, whose entries have id and label. OPEN text starts OPEN; CONFLICT text starts CONFLICT. Stop for my approval.

### Part 2

> After I approve docs/spec.md, write test/schema.test.ts first and run npm run test:schema to show the expected red failure. Build src/brief.ts and sample/brief.sample.json until the full valid sample passes. Add one invalid synthetic sample and prove the schema rejects it. Show the red and green evidence and the diff, then stop. Do not build the renderer, SDK route, or connector.

## Assignment 3: design the complete route

> In plan mode, read the accepted intent.md, docs/spec.md, reference/dia-to-bree.md, AGENTS.md, and the current diff. Propose docs/design.md, one decision under docs/decisions/, and docs/plan.md for the smallest complete Bree route: synthetic fixtures → DailyBrief schema → full HTML renderer, plus one approved read-only MCP tool → Claude Agent SDK → the same schema → dated private HTML under ~/.bree/briefs/. Give every plan step exact root-relative paths, one proof command, and a reversible rollback. Include OPEN sections, host-owned file writing, human approval points, and separate synthetic proof from live source proof. Do not edit files or build. Stop for my approval. After I approve the plan, tell me to return to manual mode. Save only the accepted design documents, show the diff, and stop.

## Assignment 4: build the synthetic product path

### Part 1

> Read the accepted docs/plan.md, docs/spec.md, and reference/dia-to-bree.md. Write test/render.test.ts first and run npm run test:render to show the expected red failure. Build src/render.ts and a sample-only src/main.ts. Render the complete DailyBrief schema as one readable HTML page with title, date, greeting, summary, move-work-forward action, top todos, new updates, your day, sources, and visible OPEN states. Include the fixed public illustration https://picsum.photos/seed/bree-morning/1200/400 with empty alt text, referrerpolicy="no-referrer", and stable visible fallback text. Keep it outside the DailyBrief contract, put no work data in its URL, and keep the brief usable when the image fails. Escape long untrusted text and source labels. Run npm run test:render and npm run brief:sample. Prove that out/latest.html contains every section, source provenance, and no invented fact. Show the proof and diff, then stop.

### Part 2

> Ask me for one small house-style change. Write its failing renderer test first. Make the smallest change that passes it. Run npm run test:render and npm run brief:sample again. Open out/latest.html. Show the changed detail and confirm the complete brief still renders. Show the proof and diff, then stop.

## Assignment 5: connect the existing read-only Jira source

Before Part 1, close the synthetic-only session. Your organisation provides the path to the existing approved Jira-only config as `AETHERLINK_JIRA_MCP_CONFIG`. The trainer has no access to it. Verify the file before restarting Claude Code with `--permission-mode default --strict-mcp-config --mcp-config "$AETHERLINK_JIRA_MCP_CONFIG"`. Confirm the approved Vertex route with `/status` and the Jira-only connection with `/mcp`. Missing access stays `OPEN`. `.bree.local.json` stores runtime approvals; it is not MCP server configuration.

### Part 1

> Read the accepted design, plan, DailyBrief contract, AGENTS.md, and the Bree config example. Use /mcp to inspect the existing organisation-approved Jira connection. Identify one exact read-only tool for my own permitted work items. Do not install a connector or create a token. Write focused tests first for the live configuration boundary, exact allowed tool, schema validation, and private output path. Include rejection cases for a failed or unstructured tool result, an unknown source ID, and any unexpected tool. Show the expected red failure and stop for my approval.

### Part 2

> After I approve the tests and boundary, build the smallest Claude Agent SDK route through the approved model provider. Read only the selected server definition from the existing Jira-only config at AETHERLINK_JIRA_MCP_CONFIG and pass it explicitly as the SDK mcpServers option; a new SDK process does not inherit the CLI session configuration. Permit only the chosen Jira read tool. Set built-in tools to none, enable strict MCP config, and deny every other request in canUseTool. Map available data into the complete DailyBrief schema. Keep unavailable sections OPEN and reject unvalidated output. Accept only exact Jira keys from the successful structured tool result as live source IDs. Let only the host write validated HTML to ~/.bree/briefs/YYYY-MM-DD.html with private permissions. Add npm run live:check and npm run brief:live. Never store raw connector output or expose credentials, customer data, or work email. Run the synthetic tests and live:check. Show the boundaries and diff, then stop before the live run.

## Assignment 6: make the proof repeatable

### Part 1

> Read docs/spec.md, the synthetic evaluation fixtures, package.json, and the current application routes. Write test/eval.test.ts for a complete brief, missing evidence with OPEN items, and conflicting evidence with CONFLICT items. Run npm run eval. Fix only mismatches with the accepted spec. Show the three outcomes and diff, then stop.

### Part 2

> Read .claude/skills/verify-bree/. Confirm that it covers every synthetic HTML section, long-text escaping, resolved sourceIds, OPEN and CONFLICT behavior, the dated private artifact path, and the private live preflight without storing live contents. Add what is missing. Run npm run typecheck, npm test, npm run eval, npm run brief:sample, and npm run live:check. Record real commands and exit codes in docs/evidence.md. Show the evidence diff and stop.

### Part 3

> Propose one organisation-approved local daily trigger with its command, working directory, logs, rollback, and owner, but do not install or activate a scheduler. Mark the live connector and dated artifact OPEN unless you privately ran them with approved access. Show the evidence diff and stop for approval. Do not publish anything.

The optional voice route is separate from these core prompts. Start it only after A7 and the Maintain loop. [Open the optional voice extension](voice-extension.md).
