import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpenText, Mail, MessagesSquare } from "lucide-react";
import { Card, Disclaimer, PageHeader, SetupNotice } from "@/components/ui-kit";
import { isAIConfigured } from "@/lib/ai-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Relay — AI Workplace Productivity Assistant" },
      { name: "description", content: "Draft emails, summarize research and chat with a workplace AI assistant." },
      { property: "og:title", content: "Relay — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Draft emails, summarize research and chat with a workplace AI assistant." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", text: "Turn rough instructions into polished emails in Formal, Friendly or Persuasive tone." },
  { to: "/research", icon: BookOpenText, title: "Research Assistant", text: "Summarize articles or topics into key insights and actionable recommendations." },
  { to: "/chat", icon: MessagesSquare, title: "AI Chat", text: "Ask workplace questions and get context-aware answers that build on the conversation." },
] as const;

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-hero p-6 md:p-10">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Workspace</p>
        <h1 className="mt-2 max-w-xl font-display text-3xl font-semibold text-foreground md:text-4xl">Do focused work. Let AI handle the drafts.</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">Three structured assistants built for everyday professional tasks.</p>
      </div>
      {!isAIConfigured() && <SetupNotice />}
      <PageHeader title="Tools" subtitle="Pick a tool to get started." />
      <div className="grid gap-4 md:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/60">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}
