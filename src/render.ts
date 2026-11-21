import type { DailyBrief } from "./brief.js";
import { parseDailyBrief } from "./brief.js";

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const itemHtml = (item: DailyBrief["summary"]) => `<li><span class="status ${item.status.toLowerCase()}">${item.status}</span> ${escapeHtml(item.text)}${item.sourceIds.length ? `<small>Sources: ${item.sourceIds.map(escapeHtml).join(", ")}</small>` : ""}</li>`;
const section = (title: string, items: DailyBrief["topTodos"]) => `<section><h2>${title}</h2><ul>${items.map(itemHtml).join("")}</ul></section>`;

export function renderBrief(input: unknown): string {
  const brief = parseDailyBrief(input);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(brief.title)}</title><style>body{font:17px system-ui;max-width:800px;margin:auto;padding:32px;color:#172033}header{border-bottom:2px solid #172033}.status{font-size:.75rem;font-weight:800;padding:.2rem .45rem;border-radius:.25rem}.ready{background:#d7f5df}.open{background:#ffe08a}.conflict{background:#ffd4d4}li{margin:.8rem 0}small{display:block;color:#536070}</style></head><body><header><h1>${escapeHtml(brief.title)}</h1><p>${escapeHtml(brief.date)}</p><p>${escapeHtml(brief.greeting)}</p></header><main>${section("Summary", [brief.summary])}${section("Push your work forward", [brief.moveWorkForward])}${section("Top to-dos", brief.topTodos)}${section("New updates", brief.newUpdates)}${section("Your day", brief.yourDay)}<section><h2>Sources</h2><ul>${brief.sources.map(source => `<li><strong>${escapeHtml(source.id)}</strong> — ${escapeHtml(source.label)}</li>`).join("")}</ul></section></main></body></html>`;
}
