import type { BriefResult } from "./brief.js";

const escapeHtml = (value: string): string => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export function renderBrief(result: BriefResult): string {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>Daily brief</title><style>body{font:18px system-ui;max-width:720px;margin:10vh auto;padding:24px;background:#f5f7fb;color:#122033}main{background:white;padding:32px;border-radius:16px}p{font-size:1.25rem}</style><main><h1>${escapeHtml(result.user)}'s daily brief</h1><p>${escapeHtml(result.line)}</p></main></html>`;
}
