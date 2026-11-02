"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/** Back-office navigation: horizontal chips on phones, a sidebar list on desktop. */
export function AdminNav({ label, items, back }: { label: string; items: { href: string; label: string }[]; back: { href: string; label: string } }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <nav aria-label={label} className="no-scrollbar -mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:mx-0 lg:mt-10 lg:flex-col lg:px-0">
      {items.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          aria-current={active(n.href) ? "page" : undefined}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition-colors",
            active(n.href) ? "bg-hero text-hero-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
          )}
        >
          {n.label}
        </Link>
      ))}
      <Link href={back.href} className="shrink-0 rounded-full px-4 py-2 text-[14px] text-muted hover:bg-surface-2 hover:text-ink lg:mt-6">
        {back.label}
      </Link>
    </nav>
  );
}
