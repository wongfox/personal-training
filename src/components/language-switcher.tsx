"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleAction } from "@/i18n/actions";
import { useLocale, useT } from "@/i18n/client";
import { LOCALE_NAMES, LOCALES } from "@/i18n/config";
import { cn } from "@/lib/cn";

/** EN | ES pill switch. Saves to the profile (and a cookie) and re-renders in the new language. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div
      role="radiogroup"
      aria-label={t("common.language")}
      aria-busy={pending || undefined}
      className={cn("inline-flex rounded-full bg-surface-2 p-1", pending && "opacity-60", className)}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          lang={l}
          aria-checked={locale === l}
          aria-label={LOCALE_NAMES[l]}
          title={LOCALE_NAMES[l]}
          disabled={pending}
          onClick={() => {
            if (l === locale) return;
            start(async () => {
              await setLocaleAction(l);
              router.refresh();
            });
          }}
          className={cn(
            "h-8 min-w-11 flex-1 rounded-full px-3 text-[13px] font-semibold uppercase tracking-wide transition",
            locale === l ? "bg-hero text-hero-ink shadow-card" : "text-ink-2 hover:text-ink",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
