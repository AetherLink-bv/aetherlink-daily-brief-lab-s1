# Project instructions

@intent.md
@progress.md
@AGENTS.md

`intent.md` and `progress.md` are project convention files; their presence at
the repository root does not load them independently. Keep these imports
explicit so the outcome, the current-state board and the contribution rules are
loaded together before anything is changed.

See `SOLO.md` for the exact A1-A6 prompts and their proof. A7 is deliberately self-directed and has no implementation prompt.

Use the synthetic fixture route for tests and stored evidence. The live route uses the existing approved Jira MCP connection, one owner-confirmed read-only tool, and the approved Anthropic via Vertex route. Inspect it with `/mcp`; do not install a connector or create a token. Never copy live output into project files or transcripts.
