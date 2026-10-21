import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenText, LayoutDashboard, Mail, Menu, MessagesSquare, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAIConfigured } from "@/lib/ai-config";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpenText },
  { to: "/chat", label: "AI Chat", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const connected = isAIConfigured();

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-display font-semibold leading-tight text-foreground">Relay</div>
          <div className="text-[11px] text-muted-foreground">Workplace AI</div>
        </div>
      </div>
      {nav.map((n) => {
        const active = path === n.to;
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active ? "bg-primary/15 text-foreground ring-1 ring-primary/40" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <n.icon className={cn("h-4 w-4", active && "text-primary")} /> {n.label}
          </Link>
        );
      })}
      <div className="mt-auto flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground">
        <span className={cn("h-2 w-2 rounded-full", connected ? "bg-success" : "bg-destructive")} />
        {connected ? "AI service connected" : "AI not configured"}
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-sidebar md:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 border-r border-border bg-sidebar">{sidebar}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 md:hidden">
          <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="text-foreground">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-display font-semibold text-foreground">Relay</span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
