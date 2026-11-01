import { cn } from "@/lib/cn";

/** Wordmark: a rising arc over a baseline — "one step up, every day". */
export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--ink)" />
      <path d="M8 22.5h16" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 18.5c2.6-5.6 9.8-8.2 13.5-8" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="23" cy="10.5" r="2.2" fill="var(--accent)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[22px] leading-none tracking-tight">Growth OS</span>
    </span>
  );
}
