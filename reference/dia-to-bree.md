# Dia-to-Bree structural map

This file records only a safe visual and information pattern. All examples are synthetic. Do not copy facts, names, wording, or work data from a private reference brief.

The implementation reuses the workshop's established pure pipeline: validated schema data enters a renderer, and only the host writes the artifact. The editorial hierarchy comes from the reference structure; no old artwork, network font, authentication path, or private content is reused.

## Artifact map

| Visual section | `DailyBrief` field | Source rule | Prompt rule | Check |
| --- | --- | --- | --- | --- |
| Page heading | `title`, `date` | Host date plus accepted title | State the date; do not infer events | Both appear once |
| Greeting | `greeting` | Accepted user only | Keep it short and factual | No work claim |
| Opening context | `summary` | Sourced evidence only | Summarise without adding urgency | Item has resolved `sourceIds` and `status` |
| Push your work forward | `moveWorkForward` | Best supported next action | Choose one action only when evidence is READY | Missing evidence is OPEN; disagreement is CONFLICT |
| Top to-dos | `topTodos` | Sourced work items | Preserve owner, deadline, and uncertainty | List may contain READY and OPEN items |
| New updates | `newUpdates` | Changes visible in the source | Report changes; do not claim an action occurred | Every update is traceable |
| Your day | `yourDay` | Sourced agenda or time-bound work | Sort by time when a time exists | Unknown time remains OPEN |
| Made for you | `sources` | Provenance behind this personal view | Show safe source labels, not raw responses | Every content `sourceIds` entry resolves here |

`summary` and `moveWorkForward` are single items. `topTodos`, `newUpdates`, and `yourDay` are non-empty item arrays. Each item contains `status: READY | OPEN | CONFLICT`, `text`, and `sourceIds: string[]`. READY and CONFLICT have at least one source ID. OPEN text starts `OPEN`; CONFLICT text starts `CONFLICT`. The repository stores synthetic output only.

## Prompt progression

1. Describe the desired full Daily Brief artifact.
2. Define and test the complete `DailyBrief` schema.
3. Plan one bounded read route and one host-owned write route.
4. Compose only from validated source evidence.
5. Render every section as escaped HTML.
6. Verify sections, provenance, OPEN behavior, long text, and output path.
7. Propose an organisation-approved local daily trigger with owner and rollback.

The final live command writes one dated artifact outside the repository at `~/.bree/briefs/YYYY-MM-DD.html`. No automatic daily execution exists until the participant approves and installs their own local trigger.

## Optional decorative image after A4 passes

The complete working brief comes first. After its tests pass, the participant may add one decorative public photo from [Lorem Picsum](https://picsum.photos):

`https://picsum.photos/id/1015/1200/400`

- Use this fixed URL. Put no work content, identifier, or query data in it.
- Add useful alt text. Keep a local placeholder or omit the photo when offline; the complete brief must still render.
- Treat the photo as a placeholder. It is not AI-generated, a source, or business evidence.
- Keep network loading optional. This adds no runtime tool or connector permission.
