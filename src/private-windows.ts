import childProcess from "node:child_process";
import { randomUUID } from "node:crypto";
import { open, rename, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const acl = z.object({
  owner: z.string(),
  aces: z.array(z.object({ kind: z.enum(["AccessAllowed", "AccessDenied"]), sid: z.string().min(1) })),
});

export class PrivateOutputError extends Error {
  constructor() {
    super("Bree could not verify private Windows access. Run npm run brief:sample. Keep the live source and dated page OPEN.");
  }
}

export function isPrivateWindowsAcl(user: string, input: unknown): boolean {
  const result = acl.safeParse(input);
  if (!result.success || !/^S-1-\d+(?:-\d+)+$/.test(user)) return false;
  const permitted = new Set([user, "S-1-5-18", "S-1-5-32-544"]);
  return permitted.has(result.data.owner) &&
    result.data.aces.every(ace => ace.kind === "AccessDenied" || permitted.has(ace.sid));
}

const script = fileURLToPath(new URL("../scripts/read-private-acl.ps1", import.meta.url));

function checkAccess(path: string, staged?: string): void {
  try {
    const shell = join(process.env.SystemRoot ?? "C:\\Windows", "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
    const args = ["-NoProfile", "-NonInteractive", "-File", script, "-BriefPath", path];
    if (staged) args.push("-StagedPath", staged);
    const output = childProcess.execFileSync(shell, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    const evidence = z.object({ user: z.string(), records: z.array(acl).min(staged ? 3 : 2) }).parse(JSON.parse(output));
    if (evidence.records.every(record => isPrivateWindowsAcl(evidence.user, record))) return;
  } catch { /* A failed probe or unreadable policy leaves the live route OPEN. */ }
  throw new PrivateOutputError();
}

// Publish only a fully written, checked page. The temporary file contains no data during the first check.
export async function writeWindowsPage(path: string, render: () => Promise<string>): Promise<void> {
  checkAccess(path);
  const staged = join(dirname(path), `.bree-${randomUUID()}.tmp`);
  const file = await open(staged, "wx").catch(() => { throw new PrivateOutputError(); });
  try {
    try {
      checkAccess(path, staged);
      // A deny rule can still prevent the reader from opening an allow-listed page.
      const reader = await open(staged, "r").catch(() => { throw new PrivateOutputError(); });
      await reader.close();
      const html = await render();
      checkAccess(path, staged);
      await file.writeFile(html, "utf8");
    } finally {
      await file.close();
    }
    await rename(staged, path);
  } finally {
    await rm(staged, { force: true });
  }
}
