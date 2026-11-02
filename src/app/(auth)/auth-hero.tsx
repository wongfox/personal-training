import type { ReactNode } from "react";
import { DawnScene } from "@/components/scene";

/** Page heading for the sign-in screens: a small dawn banner, a serif title and a lede. */
export function AuthHero({ title, body }: { title: ReactNode; body?: ReactNode }) {
  return (
    <div>
      <div className="relative h-[112px] overflow-hidden rounded-[28px] shadow-card" aria-hidden>
        <DawnScene className="absolute inset-0" />
      </div>
      <h1 className="mt-6 font-display text-[38px] leading-[1.04] tracking-[-0.01em]">{title}</h1>
      {body && <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{body}</p>}
    </div>
  );
}

/** "— or —" separator between the Google button and the email form. */
export function OrDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] text-muted">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** Footer line with a link ("New here? Create an account"). */
export function AuthFooter({ children }: { children: ReactNode }) {
  return <p className="mt-auto pt-10 text-center text-[15px] text-ink-2">{children}</p>;
}
