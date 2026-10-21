import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Wand2 } from "lucide-react";
import { Button, Card, Disclaimer, EditableOutput, EmptyState, ErrorBox, Label, Loading, PageHeader, SetupNotice, fieldCls } from "@/components/ui-kit";
import { complete, emailPrompt, type Tone } from "@/lib/ai";
import { isAIConfigured } from "@/lib/ai-config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Relay" },
      { name: "description", content: "Generate professional emails in Formal, Friendly or Persuasive tone." },
      { property: "og:title", content: "Smart Email Generator — Relay" },
      { property: "og:description", content: "Generate professional emails in Formal, Friendly or Persuasive tone." },
    ],
  }),
  component: EmailPage,
});

const tones: Tone[] = ["Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const [instructions, setInstructions] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const configured = isAIConfigured();

  async function generate() {
    setLoading(true);
    setError("");
    try {
      setOutput(await complete(emailPrompt({ instructions, recipient, sender, tone })));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Smart Email Generator" subtitle="Describe what you need — get a ready-to-send draft." />
      {!configured && <div className="mb-6"><SetupNotice /></div>}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Recipient</Label><input className={fieldCls} placeholder="e.g. Sarah, Head of Finance" value={recipient} onChange={(e) => setRecipient(e.target.value)} /></div>
            <div><Label>Your name</Label><input className={fieldCls} placeholder="e.g. Mongezi" value={sender} onChange={(e) => setSender(e.target.value)} /></div>
          </div>
          <div>
            <Label>Tone</Label>
            <div className="grid grid-cols-3 gap-2">
              {tones.map((t) => (
                <button key={t} onClick={() => setTone(t)} className={cn("rounded-lg border px-3 py-2 text-sm transition-colors", tone === t ? "border-primary bg-primary/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground")}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <Label>Instructions</Label>
            <textarea className={fieldCls} rows={7} placeholder="e.g. Ask for approval of the Q4 software budget increase of 12%, mention it saves 6 hours per week for the team, need answer by Friday." value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>
          <Button onClick={generate} disabled={!configured || loading || instructions.trim().length < 5} className="w-full">
            <Wand2 className="h-4 w-4" /> Generate email
          </Button>
          <Disclaimer />
        </Card>
        <Card className="min-h-80">
          {loading ? <Loading label="Drafting your email…" /> : error ? <ErrorBox message={error} /> : output ? (
            <EditableOutput value={output} onChange={setOutput} />
          ) : (
            <EmptyState icon={<Mail className="h-5 w-5" />} title="No draft yet" text="Fill in the instructions and pick a tone to generate your email." />
          )}
        </Card>
      </div>
    </div>
  );
}
