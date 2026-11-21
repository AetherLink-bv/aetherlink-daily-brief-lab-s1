import type { Options } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const fixtureSchema = z.object({ synthetic: z.literal(true), messageId: z.string(), from: z.string(), subject: z.string(), dueAt: z.string(), body: z.string() });
const summarySchema = z.object({ messageId: z.string(), summary: z.string(), action: z.string(), dueAt: z.string(), sourceId: z.string() });
type QueryLike = (args: { prompt: string; options: Options }) => AsyncIterable<any>;

export async function summarizeSyntheticRequest(input: unknown, query: QueryLike) {
  const fixture = fixtureSchema.parse(input);
  let candidate: unknown;
  for await (const message of query({
    prompt: `Summarise this synthetic request as JSON. Preserve its source ID and deadline.\n${JSON.stringify(fixture)}`,
    options: { tools: [], allowedTools: [], settingSources: [], permissionMode: "default", strictMcpConfig: true, mcpServers: {}, canUseTool: async (toolName) => ({ behavior: "deny", message: `Synthetic Outlook mission denies ${toolName}`, interrupt: true }), maxTurns: 1 }
  })) if (message.type === "result" && message.subtype === "success") candidate = JSON.parse(message.result);
  const result = summarySchema.parse(candidate);
  if (result.messageId !== fixture.messageId || result.sourceId !== fixture.messageId) throw new Error("Rejected source ID outside the synthetic fixture");
  if (result.dueAt !== fixture.dueAt) throw new Error("Rejected deadline outside the synthetic fixture");
  return result;
}
