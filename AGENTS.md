# Contribution instructions

1. Read [intent.md](intent.md) and [progress.md](progress.md) before changing anything. Follow the step order in the README; do not skip to the code before the document of that step exists.
2. Verify the current state with the relevant command. Do not invent evidence, exit codes, screenshots or run results. Quote actual output; mark unrun checks `OPEN`.
3. Bree is read-only by construction: no built-in tools, one exact approved MCP read tool, and no write scope. Never widen that boundary.
4. Never put credentials, connector URLs, raw connector responses, live briefs, customer data, or private work data in this repository, a prompt, evidence, a screenshot, or a recording. Synthetic data lives in `sample/`.
5. Work test-first inside a step: the assertion exists and fails before the code that satisfies it.
6. Treat the phases as a loop: when evidence changes the intent, the spec or the plan, go back and change that document before continuing.
7. Before reporting a step complete, update `progress.md` with what was verified, what is `OPEN`, and who reran the check.
8. Treat synthetic proof, the local `live:check` preflight, and a private live connector run as three different kinds of evidence. Never claim one proves another.
