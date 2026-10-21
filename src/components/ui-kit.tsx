import { useState, type ReactNode } from "react";
import { AlertTriangle, Check, Copy, KeyRound, Loader2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border border-border bg-card p-5 shadow-card", className)}>{children}</div>;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-gradient-primary text-primary-foreground shadow-glow hover:brightness-110",
        variant === "outline" && "border border-border bg-secondary text-foreground hover:border-primary/60",
        variant === "ghost" && "text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
    />
  );
}

export const fieldCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</label>;
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      variant="ghost"
      className="px-2 py-1 text-xs"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : "Copy"}
    </Button>
  );
}

export function Loading({ label = "Generating…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-primary" /> {label}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {message}
    </div>
  );
}

export function SetupNotice() {
  return (
    <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
      <div className="mb-1 flex items-center gap-2 font-semibold text-foreground">
        <KeyRound className="h-4 w-4 text-primary" /> AI service not connected
      </div>
      <p className="text-muted-foreground">
        No responses will be generated until an API key is configured. Add{" "}
        <code className="rounded bg-secondary px-1 text-foreground">VITE_AI_API_KEY</code> (and optionally{" "}
        <code className="rounded bg-secondary px-1 text-foreground">VITE_AI_BASE_URL</code>,{" "}
        <code className="rounded bg-secondary px-1 text-foreground">VITE_AI_MODEL</code>) to a <code>.env</code> file. See{" "}
        <code className="rounded bg-secondary px-1 text-foreground">src/lib/ai-config.ts</code>.
      </p>
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="flex items-start gap-2 text-xs text-muted-foreground">
      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      AI-generated content may contain errors or outdated information. Review and verify all outputs before using them.
    </p>
  );
}

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">{icon}</div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function EditableOutput({ value, onChange, rows = 14 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Output · editable</span>
        <CopyButton text={value} />
      </div>
      <textarea className={cn(fieldCls, "flex-1 font-mono leading-relaxed")} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
