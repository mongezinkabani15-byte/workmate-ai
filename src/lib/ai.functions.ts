import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export const aiComplete = createServerFn({ method: "POST" })
  .inputValidator((d: { messages: Msg[] }) => {
    if (!Array.isArray(d?.messages) || d.messages.length === 0) throw new Error("No messages");
    return { messages: d.messages.slice(-40).map((m) => ({ role: m.role, content: String(m.content).slice(0, 20000) })) };
  })
  .handler(async ({ data }): Promise<{ text?: string; error?: string }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { error: "AI service is not configured." };
    const system = data.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const input = data.messages.filter((m) => m.role !== "system");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: system || undefined,
        input,
        reasoning: { effort: "low" },
        store: false,
        stream: true,
      }),
    });
    if (!res.ok || !res.body) {
      if (res.status === 429) return { error: "Rate limit reached. Please wait and try again." };
      if (res.status === 402) return { error: "AI credits exhausted. Add credits in your workspace settings." };
      return { error: `AI service error (${res.status}).` };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "response.output_text.delta" && typeof ev.delta === "string") text += ev.delta;
          if (ev.type === "error" || ev.type === "response.failed") return { error: "The AI service failed to respond." };
        } catch {
          /* partial line */
        }
      }
    }
    if (!text.trim()) return { error: "The AI service returned an empty response." };
    return { text: text.trim() };
  });
