# A4 Picsum participant replay

Date: 2026-11-21

## Source checkpoint

- Participant base: `329fe43647cf57b608a7d9255005e9b31bb20f5d` (`Render the complete synthetic Daily Brief`).
- Current starter HEAD while instructions were copied: `8335f2f13e9b19c949ca67052cc0b1a7d54e14c5`.
- Replay commit: `0464f74e251d3848c2ea1662bc6b3ceeae4d7b22` on local branch `codex/ryan-picsum-replay`.
- `SOLO.md` SHA-256: `e96fa1715b7e71782e5f5b6d5c47dd33df402ba161cd5d4a829c92a57b1689a7`.
- `docs/prompts.md` SHA-256: `7e27b3d2b57693fede8372bd43b7754747067c10bf5ce6f3a870e7d7c0694c43`.
- `reference/dia-to-bree.md` SHA-256: `5c54288a51bb144b9adb071a564143269c864adfadb8078c8039dedf1a05f302`.
- Current starter participant documents and bundled skills were copied into the replay before the instruction was applied. The accepted participant plan, specification, and implementation were preserved.

## Prescribed instruction

Read the accepted plan, specification, and Dia-to-Bree map. Add the complete synthetic renderer test first. Include `https://picsum.photos/seed/bree-morning/1200/400` as a decorative illustration with empty alt text, `referrerpolicy="no-referrer"`, stable visible fallback text, no work data in the URL, and no dependency on the image for brief readability. Prove the renderer and sample output, then stop.

## Participant action and choice

I treated the product decision to use Lorem Picsum by default as the human review choice. I added one renderer test before implementation. I used the exact fixed public seed. I kept the image outside the `DailyBrief` contract. I used an always-visible fallback sentence and hid only the failed image. I added no configuration, key, connector, package, or runtime tool.

The environment had no approved Claude, Vertex, Jira, or ElevenLabs route. Model-assisted proof is `OPEN`. This replay is a synthetic Codex substitute based only on the participant instructions and the participant's previously accepted artifacts. No live model, connector, audio service, customer data, credential, or Picsum request was used.

## Visible result

`out/latest.html` contains the fixed illustration before the full brief. The image has empty alt text and sends no referrer. The fallback sentence remains visible. The brief sections and synthetic provenance remain present when the image is unavailable.

## Evidence

- `a4-red.log`: the new image test failed on the missing fixed URL with exit code 1.
- `a4-green-test.log`: all three renderer tests passed with exit code 0.
- `a4-green-render.log`: `out/latest.html` was written from synthetic data with exit code 0.
- `a4-final-check.log`: the final targeted rerun and static artifact assertions passed.
- `npm run typecheck`: passed with exit code 0.

## Ambiguities and boundaries

- The historical participant checkpoint contained an older optional-image reference. That was not a current lesson defect. Copying the current starter documents resolved it before replay.
- Actual image availability and browser rendering were not tested in this lane. The public image URL was not fetched.
- The install of the historical participant dependency graph at `329fe43` completed, but npm reported eight audit findings and blocked two install scripts. These warnings describe that old graph, not the current starter dependency graph. They did not prevent the targeted renderer tests.
- Browser and remote visual proof remain outside this lane.
