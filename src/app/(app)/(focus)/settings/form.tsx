"use client";

import { useState, useTransition } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-sync";
import { Button } from "@/components/ui/button";
import { Field, FormAlert } from "@/components/ui/field";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { saveSettings, type SettingsInput } from "./actions";

const sectionTitle = "px-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted";

export function SettingsForm({ initial }: { initial: SettingsInput }) {
  const t = useT();
  const [v, setV] = useState(initial);
  const [status, setStatus] = useState<{ error?: string; ok?: boolean }>({});
  const [pending, start] = useTransition();
  const set = <K extends keyof SettingsInput>(k: K, value: SettingsInput[K]) => {
    setV((prev) => ({ ...prev, [k]: value }));
    setStatus({});
  };

  return (
    <div className="mt-7 space-y-8">
      <section className="space-y-4 rounded-[28px] bg-surface p-5 shadow-card">
        <Field id="displayName" label={t("settings.name")} value={v.displayName} onChange={(e) => set("displayName", e.target.value)} />
        <div>
          <Field id="timezone" label={t("settings.timezone")} value={v.timezone} onChange={(e) => set("timezone", e.target.value)} hint={t("settings.timezoneHint")} />
          <button
            type="button"
            onClick={() => set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone)}
            className="mt-1 text-[13px] font-medium text-accent underline underline-offset-4"
          >
            {t("settings.useDeviceTimezone")}
          </button>
        </div>
      </section>

      <section>
        <h2 className={sectionTitle}>{t("settings.reminders.title")}</h2>
        <p className="mt-1 px-1 text-[13px] text-ink-2">{t("settings.reminders.body")}</p>
        <div className="mt-3 divide-y divide-line rounded-[28px] bg-surface px-5 shadow-card">
          <Toggle label={t("settings.reminders.daily")} checked={v.dailyReminder} onChange={(x) => set("dailyReminder", x)} />
          <Toggle label={t("settings.reminders.streak")} checked={v.streakReminder} onChange={(x) => set("streakReminder", x)} />
          <Toggle label={t("settings.reminders.weekly")} checked={v.weeklyReview} onChange={(x) => set("weeklyReview", x)} />
          <Toggle label={t("settings.reminders.email")} checked={v.emailNotifications} onChange={(x) => set("emailNotifications", x)} />
          <label className="flex items-center justify-between gap-3 py-3.5 text-[15px]">
            {t("settings.reminders.time")}
            <input
              type="time"
              value={v.reminderTime}
              onChange={(e) => set("reminderTime", e.target.value)}
              className="rounded-full border border-line bg-bg px-3 py-1.5 text-[15px]"
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className={sectionTitle}>{t("common.theme.label")}</h2>
        <div className="space-y-5 rounded-[28px] bg-surface p-5 shadow-card">
          <div>
            <ThemeToggle value={v.theme} onChange={(theme) => setV((prev) => ({ ...prev, theme }))} />
            <p className="mt-2 px-1 text-[13px] text-muted">{t("settings.appearanceHint")}</p>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
            <div className="min-w-0">
              <p className="text-[15px] font-medium">{t("common.language")}</p>
              <p className="text-[13px] text-muted">{t("settings.languageHint")}</p>
            </div>
            <LanguageSwitcher className="shrink-0" />
          </div>
        </div>
      </section>

      {status.error && <FormAlert>{status.error}</FormAlert>}
      {status.ok && <FormAlert tone="success">{t("common.saved")}</FormAlert>}
      <Button
        disabled={pending}
        onClick={() =>
          start(async () => {
            setStatus(await saveSettings(v));
          })
        }
      >
        {pending ? t("common.saving") : t("settings.save")}
      </Button>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-3.5 text-[15px]">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-7 w-12 shrink-0 rounded-full ring-1 transition-colors", checked ? "bg-hero ring-hero" : "bg-muted/35 ring-muted/50")}
      >
        <span className={cn("absolute top-0.5 h-6 w-6 rounded-full bg-surface shadow transition-[left]", checked ? "left-[22px]" : "left-0.5")} />
      </button>
    </label>
  );
}
