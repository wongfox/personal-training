"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { saveThemeAction, type ThemeChoice } from "@/app/(app)/(focus)/settings/actions";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "pgos-theme";

/**
 * Applies a theme to this page right away and remembers it on this device
 * (the root layout's pre-paint script reads it on the next load).
 */
export function applyTheme(theme: string) {
  const root = document.documentElement;
  try {
    if (theme === "light" || theme === "dark") localStorage.setItem(STORAGE_KEY, theme);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
  if (theme === "light" || theme === "dark") root.dataset.theme = theme;
  else delete root.dataset.theme;
}

/** Applies the account's saved theme on this device (the pre-paint script reads it next time). */
export function ThemeSync({ theme }: { theme: string }) {
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  return null;
}

const OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const satisfies readonly { value: ThemeChoice; icon: unknown }[];

/**
 * Light / Dark / System pill switch. Applies instantly and saves to the
 * account (user_settings.theme), so Profile, Settings and every device agree.
 */
export function ThemeToggle({ value, onChange, className }: { value: ThemeChoice; onChange?: (theme: ThemeChoice) => void; className?: string }) {
  const t = useT();
  const [current, setCurrent] = useState<ThemeChoice>(value);
  const [synced, setSynced] = useState<ThemeChoice>(value);
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();
  // Follow the server value when it changes (e.g. saved from another screen).
  if (value !== synced) {
    setSynced(value);
    setCurrent(value);
  }

  const choose = (next: ThemeChoice) => {
    if (next === current) return;
    setCurrent(next);
    setFailed(false);
    applyTheme(next);
    onChange?.(next);
    start(async () => {
      const res = await saveThemeAction(next).catch(() => ({ error: "offline" }));
      if (res.error) setFailed(true);
    });
  };

  return (
    <div className={className}>
      <div role="radiogroup" aria-label={t("common.theme.label")} aria-busy={pending || undefined} className="grid grid-cols-3 gap-1 rounded-full bg-surface-2 p-1">
        {OPTIONS.map(({ value: option, icon: Icon }) => {
          const selected = current === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => choose(option)}
              className={cn(
                "flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-full px-3 text-[14px] font-semibold transition",
                selected ? "bg-hero text-hero-ink shadow-card" : "text-ink-2 hover:text-ink",
              )}
            >
              <Icon size={16} strokeWidth={2.2} aria-hidden className="shrink-0" />
              <span className="truncate">{t(`common.theme.${option}`)}</span>
            </button>
          );
        })}
      </div>
      {failed && (
        <p role="status" className="mt-2 text-[13px] text-danger">
          {t("settings.errors.themeNotSaved")}
        </p>
      )}
    </div>
  );
}
