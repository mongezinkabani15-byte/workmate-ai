import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpenText, Search } from "lucide-react";
import { Button, Card, Disclaimer, EditableOutput, EmptyState, ErrorBox, Label, Loading, PageHeader, SetupNotice, fieldCls } from "@/components/ui-kit";
import { complete, researchPrompt } from "@/lib/ai";
import { isAIConfigured } from "@/lib/ai-config";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Relay" },
      { name: "description", content: "Summarize articles or topics into key insights and recommendations." },
      { property: "og:title", content: "AI Research Assistant — Relay" },
      { property: "og:description", content: "Summarize articles or topics into key insights and recommendations." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [input, setInput] = useState("");
  const [focus, setFocus] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const configured = isAIConfigured();

  async function analyse() {
    setLoading(true);
    setError("");
    try {
      setOutput(await complete(researchPrompt(input, focus)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="AI Research Assistant" subtitle="Paste an article or name a topic — get insights you can act on." />
      {!configured && <div className="mb-6"><SetupNotice /></div>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div><Label>Article text or topic</Label><textarea className={fieldCls} rows={12} placeholder="Paste article text, or type a topic like 'Four-day work week pilots in 2025'" value={input} onChange={(e) => setInput(e.target.value)} /></div>
          <div><Label>Focus / audience (optional)</Label><input className={fieldCls} placeholder="e.g. HR leadership at a 200-person company" value={focus} onChange={(e) => setFocus(e.target.value)} /></div>
          <Button onClick={analyse} disabled={!configured || loading || input.trim().length < 3} className="w-full"><Search className="h-4 w-4" /> Analyse</Button>
          <Disclaimer />
        </Card>
        <Card className="min-h-80">
          {loading ? <Loading label="Analysing…" /> : error ? <ErrorBox message={error} /> : output ? (
            <EditableOutput value={output} onChange={setOutput} rows={22} />
          ) : (
            <EmptyState icon={<BookOpenText className="h-5 w-5" />} title="Nothing analysed yet" text="You'll get a summary, key insights, recommendations and caveats." />
          )}
        </Card>
      </div>
    </div>
  );
}
