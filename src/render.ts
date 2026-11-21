import type { BriefResult, DailyBrief } from "./brief.js";

const escapeHtml = (value: string): string => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export function renderBrief(result: BriefResult): string {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>Daily brief</title><style>body{font:18px system-ui;max-width:720px;margin:10vh auto;padding:24px;background:#f5f7fb;color:#122033}main{background:white;padding:32px;border-radius:16px}p{font-size:1.25rem}small{color:#526273}</style><main><h1>${escapeHtml(result.user)}'s daily brief</h1><p>${escapeHtml(result.line)}</p><small>Source: ${escapeHtml(result.source)}</small></main></html>`;
}

const renderItem = (item: DailyBrief["summary"]): string => {
  const sources = item.sourceIds.length > 0
    ? `<span class="refs">${item.sourceIds.map((id) => escapeHtml(id)).join(" · ")}</span>`
    : "";
  return `<li class="${item.status.toLowerCase()}"><span>${escapeHtml(item.text)}</span>${sources}</li>`;
};

export function renderDailyBrief(brief: DailyBrief): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(brief.title)}</title><style>:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#ece8df;color:#17232d;font:18px/1.65 Georgia,serif}.page{max-width:760px;margin:40px auto;background:#fff;padding:72px 72px 56px;box-shadow:0 18px 55px rgba(30,38,45,.08)}header{padding-bottom:40px}.eyebrow,.date,.refs,footer{font:700 12px/1.4 system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase}.eyebrow{color:#835b35}.date{color:#6b6f72;margin:18px 0}h1{font-size:clamp(48px,8vw,82px);font-weight:500;line-height:.98;letter-spacing:-.04em;margin:18px 0}h2{font-size:29px;font-weight:500;line-height:1.1;margin:0 0 20px}.greeting{font-size:21px;font-style:italic;margin:22px 0 0}.lead{border-top:4px solid #17232d;padding-top:32px}.lead li>span:first-child{font-size:24px;line-height:1.45}section{border-top:1px solid #cfc9be;padding:34px 0}ul{list-style:none;padding:0;margin:0;display:grid;gap:18px}li{display:grid;gap:6px}.open{color:#8a4b2f}.conflict{color:#8b5a16}.refs{color:#667785}.sources li{font:14px/1.5 system-ui,sans-serif}.source-id{font-weight:800;color:#31596c}footer{border-top:1px solid #cfc9be;padding-top:24px;color:#667785}@media(max-width:760px){body{background:#fff}.page{margin:0;padding:42px 24px;box-shadow:none}}</style></head><body><main class="page"><header><div class="eyebrow">Your private daily brief</div><h1>${escapeHtml(brief.title)}</h1><div class="date">${escapeHtml(brief.date)}</div><p class="greeting">${escapeHtml(brief.greeting)}</p></header><section class="lead"><h2>Today in short</h2><ul>${renderItem(brief.summary)}</ul></section><section><h2>Move your work forward</h2><ul>${renderItem(brief.moveWorkForward)}</ul></section><section><h2>Top to-dos</h2><ul>${brief.topTodos.map(renderItem).join("")}</ul></section><section><h2>New updates</h2><ul>${brief.newUpdates.map(renderItem).join("")}</ul></section><section><h2>Your day</h2><ul>${brief.yourDay.map(renderItem).join("")}</ul></section><section class="sources"><h2>Sources</h2><ul>${brief.sources.map((source) => `<li><span><span class="source-id">${escapeHtml(source.id)}</span> — ${escapeHtml(source.label)}</span></li>`).join("") || "<li class=\"open\">OPEN — no verified source was available.</li>"}</ul></section><footer>Bree — based on approved sources</footer></main></body></html>`;
}
