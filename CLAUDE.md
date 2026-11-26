# Project instructions

@intent.md
@progress.md
@AGENTS.md

`intent.md` and `progress.md` are project convention files; their presence at
the repository root does not load them independently. Keep these imports
explicit so the outcome, the current-state board and the contribution rules are
loaded together before anything is changed.

See `SOLO.md` for the exact A1-A6 prompts and their proof. A7 is deliberately self-directed and has no implementation prompt.

Use the synthetic fixture route for tests and stored evidence. Keep the current Claude Code session for A5 sample work. Only restart it to load a newly added Jira server. Accept OPEN when the participant has no verified tool. Never ask for a personal API key. Both A5 Terminal checks run offline. Follow the flag and test requirements in `reference/solo-details.md`.

For Worldline SDK model calls in A5 or A7, load `settingSources: ['user', 'local']` with an organisation-approved profile. Preserve the single-tool checks for a connected mission, even if more servers are visible. Allow no tools for Mock Outlook. The A5 live route uses the Jira server that the participant added with `claude mcp add` in this folder, and one read-only tool. Check it with `/mcp`; add no other server and create no token. Never copy live output into project files or transcripts.
