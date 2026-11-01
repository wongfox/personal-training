import { X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/** Chrome for full-screen flows: close button, optional progress, content, sticky footer. */
export function FocusShell({
  closeHref = "/home",
  top,
  children,
  footer,
}: {
  closeHref?: string;
  top?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <div className="sticky top-0 z-30 bg-bg/90 px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link href={closeHref} aria-label="Close" className="-ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-surface-2">
            <X size={22} />
          </Link>
          <div className="min-w-0 flex-1">{top}</div>
        </div>
      </div>
      <main className="flex-1 px-5 pb-8 pt-2">{children}</main>
      {footer && (
        <div className="sticky bottom-0 z-30 bg-gradient-to-t from-bg via-bg to-bg/0 px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {footer}
        </div>
      )}
    </div>
  );
}
