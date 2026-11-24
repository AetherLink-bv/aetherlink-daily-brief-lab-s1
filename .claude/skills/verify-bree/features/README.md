# Bree features mapped for verification

| Feature file | User journey | Main command |
| --- | --- | --- |
| [synthetic-brief.md](synthetic-brief.md) | Open the synthetic brief page and trace every line to a source | `npm run brief:sample` |
| [open-and-conflict.md](open-and-conflict.md) | Missing evidence stays OPEN; disagreeing evidence stays CONFLICT | `npm run eval` |
| [live-preflight.md](live-preflight.md) | Check the local live approvals and the private artifact path without contacting the source | `npm run live:check` |

Every file has the same four headings: Sub-features, How to get to it (user POV), Driving it with the repository commands, Gotchas.
