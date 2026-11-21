# Project skills for the Daily Brief lab

Claude Code loads these skills from `.claude/skills/` when you work in this repo. `SOLO.md` names one focused skill for every assignment.

| Assignment | Skill | Job |
| --- | --- | --- |
| A1 | `/grilling` | Challenge the user, decision, and boundary. |
| A2 | `/eli5` | Explain the brief contract before approval. |
| A3 | `/visual-plan` | Make the accepted route reviewable. |
| A4 | `/verify-this` | Prove the synthetic HTML artifact. |
| A5 | `/eli5` | Explain the live source boundary before approval. |
| A6 | `/create-verification-skill` | Turn real repository checks into repeatable proof. |
| A7 | `/handoff` | Return the full continuation prompt in chat. |

| Skill | Used in | Copied from | Licence and origin |
|-------|---------|-------------|--------------------|
| `grilling` | Step 1 | [AetherLink-bv/claude-code-skills-pack](https://github.com/AetherLink-bv/claude-code-skills-pack) `skills/grilling` | MIT. Verbatim copy of [mattpocock/skills](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling), Copyright (c) 2026 Matt Pocock |
| `eli5` | Steps 2 and 5 | claude-code-skills-pack `skills/eli5` | MIT, Copyright (c) 2026 Ryan Lisse. Original rewrite |
| `visual-plan` | Step 3 | claude-code-skills-pack `skills/visual-plan` | MIT. Adapted from [display-dev/visualize](https://github.com/display-dev/visualize) (Copyright (c) 2026 display.dev) and [humanlayer/skills](https://github.com/humanlayer/skills) show-me (Copyright (c) 2026 HumanLayer) |
| `create-verification-skill` | Step 6 | Adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack/skills/create-verification-skill) for Claude Code | MIT, Copyright (c) 2026 Lauren Tan |
| `verify-this` | Step 4 | claude-code-skills-pack `skills/verify-this` | MIT. Port of [cursor/plugins](https://github.com/cursor/plugins/tree/main/cursor-team-kit) cursor-team-kit, Copyright (c) 2026 Cursor |
| `show-me` | Optional reference | [AetherLink-bv/sre-oncall-agent](https://github.com/AetherLink-bv/sre-oncall-agent) `workshop/start`, `.claude/skills/show-me` | MIT. Lab copy of humanlayer/skills show-me @653b641, Copyright (c) 2026 HumanLayer. Licence in `show-me/LICENSE-humanlayer.txt` |
| `review-and-ship` | Optional, outside the local A1–A7 route | claude-code-skills-pack `skills/review-and-ship` | MIT. Port of cursor/plugins cursor-team-kit, Copyright (c) 2026 Cursor |
| `handoff` | Step 7 | claude-code-skills-pack `skills/handoff` | MIT, Copyright (c) 2026 Ryan Lisse |

Licence texts are in `LICENSES/`. The full attribution is in the pack's [ATTRIBUTION.md](https://github.com/AetherLink-bv/claude-code-skills-pack/blob/main/ATTRIBUTION.md) and [NOTICE](https://github.com/AetherLink-bv/claude-code-skills-pack/blob/main/NOTICE).

A7 has no prescribed implementation prompt. Use `/handoff` after the mission and return its full continuation prompt in chat. Do not run `review-and-ship` for this private local assignment; that skill includes publication steps.

## Known gaps in this lab

These optional paths still depend on local tools or create their output folder on first use:

- `visual-plan` and `show-me` write to `docs/visual/` and `docs/show-me/`. These folders do not exist until the skill creates them.
- `review-and-ship` calls `gh`. Without the GitHub CLI, those steps report a blocker. `visual-plan` uses `gh` only when it is available.
- `handoff` writes `/tmp/handoff-prompt.txt` and copies it with `pbcopy` or a similar clipboard tool.
