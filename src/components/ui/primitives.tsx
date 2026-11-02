import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-[28px] bg-surface p-5 shadow-card", className)} {...props} />;
}

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-[11px] font-semibold uppercase tracking-[0.14em] text-muted", className)} {...props} />;
}

export function DisplayTitle({ className, ...props }: ComponentProps<"h1">) {
  return <h1 className={cn("font-display text-[34px] leading-[1.05] tracking-[-0.01em] text-ink", className)} {...props} />;
}

export function SectionTitle({ className, children, action }: { className?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className={cn("mb-3 flex items-end justify-between", className)}>
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{children}</h2>
      {action}
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  tone = "ink",
  label,
}: {
  value: number;
  className?: string;
  tone?: "ink" | "accent" | "success";
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const fill = tone === "accent" ? "bg-accent" : tone === "success" ? "bg-success" : "bg-ink";
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className)}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out", fill)} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Thin circular progress ring with content in the middle. */
export function Ring({
  value,
  size = 64,
  stroke = 4,
  tone = "accent",
  children,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "accent" | "ink" | "success";
  children?: ReactNode;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const color = tone === "accent" ? "var(--accent)" : tone === "success" ? "var(--success)" : "var(--ink)";
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.2,.7,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function Pill({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-[12px] font-medium text-ink-2", className)}
      {...props}
    />
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-line px-6 py-10 text-center">
      <p className="font-display text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-xs text-sm text-ink-2">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
