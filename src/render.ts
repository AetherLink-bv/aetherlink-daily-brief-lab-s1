import { parseBrief, STATUSES, type DailyBrief, type Item } from "./brief.js";

const ILLUSTRATION = "https://picsum.photos/seed/bree-morning/1200/400";

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const CSS = `
:root{color-scheme:light dark;--bg:#fbfbfa;--fg:#1c1c1a;--muted:#5f5f5a;--rule:#dcdcd6;--surface:#f1f1ed;--ready:#1f7a4d;--open:#9a5b00;--conflict:#b42318}
@media (prefers-color-scheme:dark){:root{--bg:#141413;--fg:#ececea;--muted:#a3a39c;--rule:#33332f;--surface:#1d1d1b;--ready:#5cc28c;--open:#e0a64a;--conflict:#ff7a6e}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 ui-sans-serif,system-ui,sans-serif}
main{max-width:46rem;margin:0 auto;padding:2rem 1.25rem 4rem;overflow-wrap:anywhere}
h1{font-size:1.9rem;line-height:1.2;margin:0 0 .3rem}
h2{font-size:1.15rem;margin:2rem 0 .5rem;padding-top:.8rem;border-top:1px solid var(--rule)}
.date{color:var(--muted);margin:0}
.tally{color:var(--muted);font:600 .8rem ui-monospace,Menlo,monospace;margin:0}
figure{margin:1.2rem 0}
figure img{display:block;width:100%;height:auto;max-height:12rem;object-fit:cover;background:var(--surface);border-radius:6px}
figcaption{color:var(--muted);font-size:.85rem;margin-top:.3rem}
ul{list-style:none;margin:0;padding:0}
li.item{padding:.55rem 0;border-bottom:1px solid var(--rule)}
.status{display:inline-block;min-width:5.2rem;font:600 .75rem ui-monospace,Menlo,monospace;letter-spacing:.03em}
[data-status="READY"] .status{color:var(--ready)}
[data-status="OPEN"] .status{color:var(--open)}
[data-status="CONFLICT"] .status{color:var(--conflict)}
.src{display:block;color:var(--muted);font-size:.82rem;margin-left:5.2rem}
code{font:.85em ui-monospace,Menlo,monospace}
@media (max-width:480px){main{padding:1.25rem 1rem 3rem}h1{font-size:1.5rem}.src{margin-left:0}}
`;

function renderItem(item: Item, labels: Map<string, string>): string {
  const sources = item.sourceIds.length
    ? item.sourceIds
        .map((id) => `<code>${escapeHtml(id)}</code> ${escapeHtml(labels.get(id) ?? "")}`)
        .join("; ")
    : "No source";
  return (
    `<li class="item" data-status="${item.status}"><span class="status">${item.status}</span>` +
    `<span class="text">${escapeHtml(item.text)}</span>` +
    `<span class="src">Source: ${sources}</span></li>`
  );
}

export function renderBrief(input: DailyBrief): string {
  const brief = parseBrief(input);
  const labels = new Map(brief.sources.map((source) => [source.id, source.label]));
  const all = [brief.summary, brief.moveWorkForward, ...brief.topTodos, ...brief.newUpdates, ...brief.yourDay];
  const tally = STATUSES.map((s) => `${all.filter((item) => item.status === s).length} ${s}`).join(" · ");
  const list = (items: Item[]) => `<ul>${items.map((item) => renderItem(item, labels)).join("")}</ul>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; style-src 'unsafe-inline'">
<title>${escapeHtml(brief.title)}</title>
<style>${CSS}</style>
</head>
<body>
<main>
<header>
<h1>${escapeHtml(brief.title)}</h1>
<p class="date">${escapeHtml(brief.date)}</p>
<p class="greeting">${escapeHtml(brief.greeting)}</p>
<p class="tally">${tally}</p>
</header>
<figure>
<img src="${ILLUSTRATION}" alt="" referrerpolicy="no-referrer" width="1200" height="400">
<figcaption>Decorative photo from a public placeholder service. It is not a source. If it does not load, the brief below is complete.</figcaption>
</figure>
<section><h2>Summary</h2>${list([brief.summary])}</section>
<section><h2>Push your work forward</h2>${list([brief.moveWorkForward])}</section>
<section><h2>Top to-dos</h2>${list(brief.topTodos)}</section>
<section><h2>New updates</h2>${list(brief.newUpdates)}</section>
<section><h2>Your day</h2>${list(brief.yourDay)}</section>
<section><h2>Sources</h2><ul>${brief.sources
    .map((source) => `<li class="item"><code>${escapeHtml(source.id)}</code> ${escapeHtml(source.label)}</li>`)
    .join("")}</ul></section>
</main>
</body>
</html>
`;
}
