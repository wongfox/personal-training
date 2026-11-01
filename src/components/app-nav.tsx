"use client";

import { Compass, House, Route, Target, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/home", label: "Home", icon: House },
  { href: "/journey", label: "Journey", icon: Route },
  { href: "/practice", label: "Practice", icon: Target },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

function useActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const isActive = useActive();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/85 backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid max-w-[480px] grid-cols-5 px-2 pt-1.5 safe-bottom">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active ? "text-ink" : "text-muted hover:text-ink-2",
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.7} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav({ isStaff }: { isStaff: boolean }) {
  const isActive = useActive();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line px-5 py-7 lg:flex">
      <Link href="/home" className="px-2">
        <Wordmark />
      </Link>
      <nav aria-label="Main" className="mt-10 flex-1">
        <ul className="space-y-1">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors",
                    active ? "bg-surface text-ink shadow-card" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  <Icon size={19} strokeWidth={active ? 2.2 : 1.8} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-1 text-[14px]">
        <Link href="/coach" className="flex h-10 items-center rounded-xl px-3 text-ink-2 hover:bg-surface-2 hover:text-ink">
          AI Coach
        </Link>
        {isStaff && (
          <Link href="/admin" className="flex h-10 items-center rounded-xl px-3 text-ink-2 hover:bg-surface-2 hover:text-ink">
            Admin
          </Link>
        )}
      </div>
    </aside>
  );
}
