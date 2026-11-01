"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, FormAlert } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { saveSettings, type SettingsInput } from "./actions";

export function SettingsForm({ initial }: { initial: SettingsInput }) {
  const [v, setV] = useState(initial);
  const [status, setStatus] = useState<{ error?: string; ok?: boolean }>({});
  const [pending, start] = useTransition();
  const set = <K extends keyof SettingsInput>(k: K, value: SettingsInput[K]) => {
    setV({ ...v, [k]: value });
    setStatus({});
  };

  function applyTheme(theme: SettingsInput["theme"]) {
    try {
      if (theme === "system") {
        localStorage.removeItem("pgos-theme");
        delete document.documentElement.dataset.theme;
      } else {
        localStorage.setItem("pgos-theme", theme);
        document.documentElement.dataset.theme = theme;
      }
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <div className="mt-7 space-y-8">
      <section className="space-y-4">
        <Field id="displayName" label="Name" value={v.displayName} onChange={(e) => set("displayName", e.target.value)} />
        <div>
          <Field id="timezone" label="Timezone" value={v.timezone} onChange={(e) => set("timezone", e.target.value)} hint="Training days are counted in this timezone." />
          <button
            type="button"
            onClick={() => set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone)}
            className="mt-1 text-[13px] font-medium text-ink-2 underline underline-offset-4"
          >
            Use this device&apos;s timezone
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Reminders</h2>
        <p className="mt-1 text-[13px] text-ink-2">At most one reminder a day. Never noise.</p>
        <div className="mt-3 divide-y divide-line rounded-3xl bg-surface px-5 shadow-card">
          <Toggle label="Daily training reminder" checked={v.dailyReminder} onChange={(x) => set("dailyReminder", x)} />
          <Toggle label="Streak at risk" checked={v.streakReminder} onChange={(x) => set("streakReminder", x)} />
          <Toggle label="Weekly review" checked={v.weeklyReview} onChange={(x) => set("weeklyReview", x)} />
          <Toggle label="Also send by email" checked={v.emailNotifications} onChange={(x) => set("emailNotifications", x)} />
          <label className="flex items-center justify-between py-3.5 text-[15px]">
            Reminder time
            <input
              type="time"
              value={v.reminderTime}
              onChange={(e) => set("reminderTime", e.target.value)}
              className="rounded-lg border border-line bg-bg px-2 py-1 text-[15px]"
            />
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Appearance</h2>
        <div role="radiogroup" aria-label="Theme" className="mt-3 grid grid-cols-3 gap-2">
          {(["system", "light", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={v.theme === t}
              onClick={() => {
                set("theme", t);
                applyTheme(t);
              }}
              className={cn("rounded-2xl border py-3 text-[14px] capitalize", v.theme === t ? "border-ink bg-ink text-bg" : "border-line bg-surface")}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {status.error && <FormAlert>{status.error}</FormAlert>}
      {status.ok && <FormAlert tone="success">Saved.</FormAlert>}
      <Button
        disabled={pending}
        onClick={() =>
          start(async () => {
            setStatus(await saveSettings(v));
          })
        }
      >
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-3.5 text-[15px]">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-7 w-12 rounded-full transition-colors", checked ? "bg-ink" : "bg-surface-2")}
      >
        <span className={cn("absolute top-0.5 h-6 w-6 rounded-full bg-bg shadow transition-[left]", checked ? "left-[22px]" : "left-0.5")} />
      </button>
    </label>
  );
}
