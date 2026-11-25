# Synthetic brief

## Sub-features

- Page header: title, date, greeting, and the state tally `5 READY · 1 OPEN · 1 CONFLICT`.
- Six sections in order: Summary, Push your work forward, Top to-dos, New updates, Your day, Sources.
- Per item: a visible state (`READY`, `OPEN`, `CONFLICT`) and a `Source:` line with the source id and its label. An item without a source says `Source: No source`.
- Resolved source IDs: every `sourceIds` entry matches an entry in `sources` (enforced by `src/brief.ts`, tested in `test/schema.test.ts`).
- Long-text escaping: markup in text, titles and source labels is escaped; a 5000-character unbroken word wraps (`test/render.test.ts`).
- Decorative photo `https://picsum.photos/seed/bree-morning/1200/400` with empty alt text, `referrerpolicy="no-referrer"` and visible fallback text.

## How to get to it (user POV)

Run `npm run brief:sample`, then open `out/latest.html` in a browser. The command prints the path.

## Driving it with the repository commands

```bash
npm run brief:sample
for h in "Summary" "Push your work forward" "Top to-dos" "New updates" "Your day" "Sources"; do grep -c ">$h</h2>" out/latest.html; done   # each prints 1
grep -c '<li class="item" data-status=' out/latest.html                                                                                 # item count plus source list
npm run test:render && npm run test:schema                                                                                              # escaping and source IDs
```

Expected: exit 0 everywhere; `out/latest.html` exists; the printed source line reads `source: sample/brief.sample.json (synthetic)`.

## Gotchas

- `out/` is ignored by git, so the page is never in a commit.
- A plain `grep 'data-status="OPEN"'` also matches the page's own CSS selector. Anchor on `<li class="item" data-status="OPEN"` (this fooled one test during the build).
- The photo needs a network. Without one, the visible fallback sentence appears and the brief is still complete.
- `brief:sample` reads only `sample/brief.sample.json`; it cannot show live data.
