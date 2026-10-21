import { aiComplete } from "./ai.functions";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class AINotConfiguredError extends Error {
  constructor() {
    super("No AI service is configured.");
  }
}

export async function complete(messages: ChatMessage[], _signal?: AbortSignal): Promise<string> {
  let r: { text?: string; error?: string };
  try {
    r = await aiComplete({ data: { messages } });
  } catch {
    throw new Error("Could not reach the AI service. Check your connection.");
  }
  if (r.error || !r.text) throw new Error(r.error ?? "Empty response.");
  return r.text;
}

export type Tone = "Formal" | "Friendly" | "Persuasive";

const toneGuide: Record<Tone, string> = {
  Formal: "Formal: precise, respectful, no contractions, no slang.",
  Friendly: "Friendly: warm, conversational, contractions allowed, still professional.",
  Persuasive: "Persuasive: lead with the recipient's benefit, use concrete evidence, end with one clear call to action.",
};

export function emailPrompt(i: { instructions: string; recipient: string; sender: string; tone: Tone }): ChatMessage[] {
  return [
    {
      role: "system",
      content: `You are an expert business communications writer. Write ONE email.
Rules:
- Tone: ${toneGuide[i.tone]}
- Start with "Subject: <specific subject line>" then a blank line, then the body.
- Use only facts given by the user. If a detail is missing, insert a [bracketed placeholder] instead of inventing it.
- Keep it under 220 words, short paragraphs, no filler phrases like "I hope this email finds you well".
- End with a sign-off using the sender's name.`,
    },
    {
      role: "user",
      content: `Recipient: ${i.recipient || "[Recipient]"}\nSender: ${i.sender || "[Your name]"}\nWhat the email must achieve:\n${i.instructions}`,
    },
  ];
}

export function researchPrompt(input: string, focus: string): ChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a senior workplace research analyst. Analyse the provided article or topic.
Respond in Markdown with exactly these sections:
## Summary
(3-5 sentences)
## Key Insights
(4-6 bullets, each specific and grounded in the input; no generic statements)
## Actionable Recommendations
(3-5 numbered steps a professional could do this week, each starting with a verb)
## Caveats
(what is uncertain, missing, or should be verified)
If the input is only a topic (not an article), say your summary is based on general knowledge and may be outdated.`,
    },
    { role: "user", content: `${focus ? `Focus / audience: ${focus}\n\n` : ""}Input:\n${input}` },
  ];
}

export const chatSystem: ChatMessage = {
  role: "system",
  content: `You are Relay, a workplace productivity assistant. Give specific, practical answers for professionals.
- Use the conversation history for context.
- Prefer structured answers (short headings, bullets, steps) when helpful; be concise.
- Ask one clarifying question if the request is ambiguous.
- Never invent facts about the user's company; say when you're unsure.`,
};
