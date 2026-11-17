# Project skills for the Daily Brief lab

Claude Code loads these skills from `.claude/skills/` when you work in this repo. Each SOLO step in `SOLO.md` names one skill prompt.

| Skill | Used in | Copied from | Licence and origin |
|-------|---------|-------------|--------------------|
| `grilling` | Step 1 | [AetherLink-bv/claude-code-skills-pack](https://github.com/AetherLink-bv/claude-code-skills-pack) `skills/grilling` | MIT. Verbatim copy of [mattpocock/skills](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling), Copyright (c) 2026 Matt Pocock |
| `eli5` | Step 2 | claude-code-skills-pack `skills/eli5` | MIT, Copyright (c) 2026 Ryan Lisse. Original rewrite |
| `visual-plan` | Step 3 | claude-code-skills-pack `skills/visual-plan` | MIT. Adapted from [display-dev/visualize](https://github.com/display-dev/visualize) (Copyright (c) 2026 display.dev) and [humanlayer/skills](https://github.com/humanlayer/skills) show-me (Copyright (c) 2026 HumanLayer) |
| `verify-this` | Steps 4 and 6 | claude-code-skills-pack `skills/verify-this` | MIT. Port of [cursor/plugins](https://github.com/cursor/plugins/tree/main/cursor-team-kit) cursor-team-kit, Copyright (c) 2026 Cursor |
| `show-me` | Step 5 | [AetherLink-bv/sre-oncall-agent](https://github.com/AetherLink-bv/sre-oncall-agent) `workshop/start`, `.claude/skills/show-me` | MIT. Lab copy of humanlayer/skills show-me @653b641, Copyright (c) 2026 HumanLayer. Licence in `show-me/LICENSE-humanlayer.txt` |
| `review-and-ship` | Step 7 | claude-code-skills-pack `skills/review-and-ship` | MIT. Port of cursor/plugins cursor-team-kit, Copyright (c) 2026 Cursor |
| `handoff` | Any step | claude-code-skills-pack `skills/handoff` | MIT, Copyright (c) 2026 Ryan Lisse |

Licence texts are in `LICENSES/`. The full attribution is in the pack's [ATTRIBUTION.md](https://github.com/AetherLink-bv/claude-code-skills-pack/blob/main/ATTRIBUTION.md) and [NOTICE](https://github.com/AetherLink-bv/claude-code-skills-pack/blob/main/NOTICE).

## Known gaps in this lab

The skills are copied unchanged. These references point at things this lab does not have:

- `visual-plan` points to `/diagram` and `/archify`. Neither skill is in this lab.
- `visual-plan` reads `PROGRESS.md` for a recap. This lab uses `progress.md`.
- `visual-plan` and `show-me` write to `docs/visual/` and `docs/show-me/`. These folders do not exist until the skill creates them.
- `review-and-ship` and `visual-plan` call `gh`. Without the GitHub CLI, those steps report a blocker.
- `handoff` writes `/tmp/handoff-prompt.txt` and copies it with `pbcopy` or a similar clipboard tool.
