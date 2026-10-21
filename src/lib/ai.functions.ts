import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export const aiComplete = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: Msg[] }) => {
    if (!Array.isArray(d?.messages) || d.messages.length === 0) throw new Error("No messages");
    return { messages: d.messages.slice(-40).map((m) => ({ role: m.role, content: String(m.content).slice(0, 20000) })) };
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { error: "AI service is not configured." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: data.messages }),
    });
    if (!res.ok) {
      if (res.status === 429) return { error: "Rate limit reached. Please wait and try again." };
      if (res.status === 402) return { error: "AI credits exhausted. Add credits in your workspace settings." };
      return { error: `AI service error (${res.status}).` };
    }
    const json: any = await res.json();
    const text = json?.choices?.[0]?.message?.content;
    if (!text) return { error: "The AI service returned an empty response." };
    return { text: String(text).trim() };
  });
