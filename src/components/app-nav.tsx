"use client";

import { Compass, House, Route, Target, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/home", key: "home", icon: House },
  { href: "/journey", key: "journey", icon: Route },
  { href: "/practice", key: "practice", icon: Target },
  { href: "/explore", key: "explore", icon: Compass },
  { href: "/profile", key: "profile", icon: UserRound },
] as const;

function useActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

/** Floating rounded bar; the active tab grows into a dark pill with its label. */
export function BottomNav() {
  const isActive = useActive();
  const t = useT();
  return (
    <nav aria-label={t("nav.main")} className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <ul className="mx-auto flex max-w-[448px] items-center justify-between gap-1 rounded-[26px] border border-line/70 bg-surface/95 p-1.5 shadow-[0_10px_30px_-12px_rgba(29,38,32,0.35)] backdrop-blur-xl">
        {ITEMS.map(({ href, key, icon: Icon }) => {
          const active = isActive(href);
          const label = t(`nav.${key}`);
          return (
            <li key={href} className={cn("min-w-0", active ? "flex-[1.6]" : "flex-1")}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                className={cn(
                  "flex h-12 items-center justify-center gap-1.5 rounded-[20px] text-[12px] font-semibold transition-all duration-300",
                  active ? "bg-hero px-3 text-hero-ink" : "text-muted hover:text-ink",
                )}
              >
                <Icon size={21} strokeWidth={active ? 2.1 : 1.7} aria-hidden className="shrink-0" />
                {active && <span className="truncate">{label}</span>}
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
  const t = useT();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line px-5 py-7 lg:flex">
      <Link href="/home" className="px-2">
        <Wordmark />
      </Link>
      <nav aria-label={t("nav.main")} className="mt-10 flex-1">
        <ul className="space-y-1">
          {ITEMS.map(({ href, key, icon: Icon }) => {
            const active = isActive(href);
            const label = t(`nav.${key}`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors",
                    active ? "bg-hero text-hero-ink shadow-card" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
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
          {t("nav.coach")}
        </Link>
        {isStaff && (
          <Link href="/admin" className="flex h-10 items-center rounded-xl px-3 text-ink-2 hover:bg-surface-2 hover:text-ink">
            {t("nav.admin")}
          </Link>
        )}
      </div>
    </aside>
  );
}
