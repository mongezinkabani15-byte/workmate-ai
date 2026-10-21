import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare, Pencil, Send, Trash2, Zap } from "lucide-react";
import { Button, CopyButton, Disclaimer, EmptyState, ErrorBox, Loading, PageHeader, SetupNotice, fieldCls } from "@/components/ui-kit";
import { chatSystem, complete, type ChatMessage } from "@/lib/ai";
import { isAIConfigured } from "@/lib/ai-config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Relay" },
      { name: "description", content: "Chat with a context-aware workplace assistant." },
      { property: "og:title", content: "AI Chat — Relay" },
      { property: "og:description", content: "Chat with a context-aware workplace assistant." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const configured = isAIConfigured();

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const reply = await complete([chatSystem, ...next.slice(-20)]);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const update = (i: number, content: string) => setMessages((m) => m.map((x, j) => (j === i ? { ...x, content } : x)));

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col md:h-[calc(100vh-4rem)]">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="AI Chat" subtitle="Your workplace assistant. Responses use the conversation as context." />
        {messages.length > 0 && <Button variant="ghost" onClick={() => setMessages([])}><Trash2 className="h-4 w-4" /> Clear</Button>}
      </div>
      {!configured && <div className="mb-4"><SetupNotice /></div>}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-border bg-card p-4">
        {messages.length === 0 && !loading ? (
          <EmptyState icon={<MessagesSquare className="h-5 w-5" />} title="Start a conversation" text="Try: “Help me plan a 30-minute weekly team sync agenda.”" />
        ) : (
          messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
              {m.role === "assistant" && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary"><Zap className="h-4 w-4 text-primary-foreground" /></div>}
              <div className={cn("max-w-[85%] text-sm", m.role === "user" ? "rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-primary-foreground" : "text-foreground")}>
                {editing === i ? (
                  <textarea autoFocus className={cn(fieldCls, "min-w-64")} rows={8} value={m.content} onChange={(e) => update(i, e.target.value)} onBlur={() => setEditing(null)} />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                )}
                {m.role === "assistant" && (
                  <div className="mt-1 flex gap-1">
                    <CopyButton text={m.content} />
                    <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => setEditing(editing === i ? null : i)}><Pencil className="h-3.5 w-3.5" /> {editing === i ? "Done" : "Edit"}</Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && <Loading label="Thinking…" />}
        {error && <ErrorBox message={error} />}
        <div ref={endRef} />
      </div>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea
          className={cn(fieldCls, "resize-none")}
          rows={2}
          placeholder={configured ? "Ask anything about your work…" : "Configure an AI key to start chatting"}
          value={input}
          disabled={!configured}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <Button type="submit" aria-label="Send" disabled={!configured || loading || !input.trim()} className="h-auto px-4"><Send className="h-4 w-4" /></Button>
      </form>
      <div className="mt-2"><Disclaimer /></div>
    </div>
  );
}
