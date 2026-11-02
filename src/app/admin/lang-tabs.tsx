"use client";

import { type KeyboardEvent, type MouseEvent, type ReactNode, useId, useState } from "react";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";

type Tab = "en" | "es";

/**
 * "English | Español" switch for CMS editors. Both versions stay mounted (only
 * the inactive one is hidden) so a single form submit saves both.
 */
export function LangTabs({ en, es, esMissing = false }: { en: ReactNode; es: ReactNode; esMissing?: boolean }) {
  const t = useT();
  const id = useId();
  const [tab, setTab] = useState<Tab>("en");
  const tabs: { key: Tab; label: string }[] = [
    { key: "en", label: t("admin.lang.english") },
    { key: "es", label: t("admin.lang.spanish") },
  ];

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next: Tab = tab === "en" ? "es" : "en";
    setTab(next);
    document.getElementById(`${id}-${next}-tab`)?.focus();
  }

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label={t("admin.lang.label")} onKeyDown={onKeyDown} className="inline-flex max-w-full items-center gap-1 rounded-full bg-surface-2 p-1">
        {tabs.map((x) => {
          const selected = tab === x.key;
          return (
            <button
              key={x.key}
              id={`${id}-${x.key}-tab`}
              type="button"
              role="tab"
              lang={x.key}
              aria-selected={selected}
              aria-controls={`${id}-${x.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(x.key)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-colors",
                selected ? "bg-hero text-hero-ink shadow-card" : "text-ink-2 hover:text-ink",
              )}
            >
              {x.label}
              {x.key === "es" && esMissing && (
                <span title={t("admin.lang.missingTitle")} className="rounded-full bg-sun-soft px-2 py-0.5 text-[11px] font-semibold text-ink-2">
                  {t("admin.lang.missing")}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`${id}-en`} aria-labelledby={`${id}-en-tab`} hidden={tab !== "en"} className="space-y-5">
        {en}
      </div>
      <div role="tabpanel" id={`${id}-es`} aria-labelledby={`${id}-es-tab`} hidden={tab !== "es"} lang="es" className="space-y-5">
        {es}
      </div>
    </div>
  );
}

/** Copies the English JSON into a Spanish field so translators only change the text. */
export function PrefillButton({ target, value }: { target: string; value: string }) {
  const t = useT();
  function onClick(e: MouseEvent<HTMLButtonElement>) {
    const field = e.currentTarget.form?.elements.namedItem(target);
    if (!(field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement)) return;
    if (field.value.trim() && !window.confirm(t("admin.lang.prefillConfirm"))) return;
    field.value = value;
    field.focus();
  }
  return (
    <button type="button" onClick={onClick} className="inline-flex h-8 items-center rounded-full border border-line bg-surface px-3.5 text-[13px] font-medium text-ink-2 hover:bg-surface-2 hover:text-ink">
      {t("admin.lang.prefill")}
    </button>
  );
}
