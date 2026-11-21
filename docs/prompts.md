# Exact Claude Code prompts

These six prompts are identical to A1–A6 in `SOLO.md`. A7 is participant-designed.

## Assignment 1: choose the user and prove one line

> Read CLAUDE.md, SOLO.md, intent.md, progress.md, and sample/calendar-item.sample.json. Interview me one question at a time until I choose one user and one morning decision. After I approve the wording, update the User and decision section of intent.md and the matching synthetic fixture fields. Write test/mini.test.ts first for one exact line in the form `<start> <title> — decide: <decision>`. Run npm run test:mini and show the expected red failure. Build src/mini.ts, run npm run test:mini and npm run mini, show the green proof and diff, then stop. State clearly that this synthetic line is a learning slice, not the finished agent.

## Assignment 2: agree the brief contract

> Read the accepted intent.md, reference/brief-example.md, and the synthetic agenda fixture. Draft docs/spec.md with the complete private brief schema, source provenance, and explicit rules for ordinary, missing, and conflicting input. Every claim must name its synthetic source or remain OPEN. Stop for my approval. After approval, write test/schema.test.ts first and run npm run test:schema to show the expected red failure. Build src/brief.ts and sample/brief.sample.json until the test passes. Add one invalid synthetic sample and prove the schema rejects it. Show the red and green evidence and the diff, then stop. Do not build the renderer, SDK route, or connector.

## Assignment 3: design the complete route

> In plan mode, read the accepted intent.md, docs/spec.md, AGENTS.md, and the current diff. Propose docs/design.md, one decision under docs/decisions/, and docs/plan.md for the smallest complete Bree route: approved read-only source → one exact MCP tool → Claude Agent SDK → private terminal brief. Keep the synthetic fixture route for deterministic tests and recordings. Give every plan step exact root-relative paths, one proof command, and a reversible rollback. Include the unavailable-source state, human approval points, and separate synthetic proof from live connector proof. Do not edit files or build. Stop for my approval. After I approve the plan, tell me to return to manual mode. Save only the accepted design documents, show the diff, and stop.

## Assignment 4: build the synthetic product path

> Read the accepted docs/plan.md and docs/spec.md. Write test/render.test.ts first and run npm run test:render to show the expected red failure. Build src/render.ts and a sample-only src/main.ts. Escape untrusted text. Run npm run test:render and npm run brief:sample. Prove that out/latest.html contains the chosen user, decision line, source provenance, and no invented fact. Ask me for one small house-style change, add its failing test first, make it pass, regenerate the page, show the proof and diff, then stop.

## Assignment 5: connect the existing read-only Jira source

> Read the accepted design, plan, brief contract, AGENTS.md, and the provided Bree config example. Use /mcp to inspect the existing organisation-approved Jira connection and identify one exact read-only tool for my own permitted work items. Do not install a connector or create a token. Write focused tests first for the live configuration boundary and exact allowed tool. Build the smallest Claude Agent SDK route through the organisation-approved model provider. Permit only that Jira read tool, disable built-in tools, bound the turns, do not persist the SDK session, and print the private brief only to the terminal. Add npm run live:check as a local preflight and npm run brief:live as the explicit live run. Deny every other tool. Return OPEN when approval, configuration, authentication, source access, or source evidence is missing. Never print a token, connector URL, raw connector response, customer data, or work email. Run the synthetic tests and live:check, show the options passed to the SDK, show the diff, and stop before the live run.

## Assignment 6: make the proof repeatable

> Read docs/spec.md, the synthetic evaluation fixtures, package.json, and the current application routes. Write test/eval.test.ts for ordinary, OPEN, and CONFLICT outcomes. Run npm run eval and fix only mismatches with the accepted spec. Then use the project-local create-verification-skill to generate .claude/skills/verify-bree/ from commands, routes, selectors, and outputs that exist in this repository. Its feature map must cover the synthetic brief, unavailable-source behavior, and private live preflight without storing live output. Run one complete synthetic user journey through launch, doctor, drive, evidence, and cleanup. Then run npm run typecheck, npm test, npm run eval, npm run brief:sample, and npm run live:check. Record real commands and exit codes in docs/evidence.md. Mark the live connector OPEN unless you privately ran it with approved access. Show the evidence diff and stop for approval. Do not publish anything.
