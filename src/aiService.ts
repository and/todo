import Anthropic from "@anthropic-ai/sdk";
import type { Goal, LifeArea } from "./types";

export interface SuggestedTask {
  title: string;
  why: string;
  recurring: "daily" | "weekly" | "";
}

export async function breakGoalIntoTasks(
  apiKey: string,
  goal: Goal,
  lifeArea: LifeArea | undefined
): Promise<SuggestedTask[]> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `You are a productivity coach helping someone break down a long-term goal into concrete daily or weekly tasks.

Goal: "${goal.title}"
${goal.description ? `Description: ${goal.description}` : ""}
Why it matters: "${goal.why}"
Life area: "${lifeArea?.name ?? "General"}"
${goal.targetDate ? `Target date: ${goal.targetDate}` : ""}

Suggest 5-7 specific, actionable tasks that will help achieve this goal. Each task should be something that can realistically be done in a single day or week. Focus on habits and routines that compound over time.

Respond with ONLY a valid JSON array (no markdown, no explanation). Each element must have exactly these fields:
- "title": string — the task name (concise, action-oriented, under 60 chars)
- "why": string — 1 sentence explaining how this task moves toward the goal
- "recurring": "daily" | "weekly" | "" — suggested frequency ("" means one-time)

Example format:
[{"title":"...", "why":"...", "recurring":"daily"}, ...]`;

  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("No text response from Claude");

  const raw = textBlock.text.trim();
  const jsonStart = raw.indexOf("[");
  const jsonEnd = raw.lastIndexOf("]");
  if (jsonStart === -1 || jsonEnd === -1) throw new Error("Could not parse task suggestions");

  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as SuggestedTask[];
  return parsed;
}
