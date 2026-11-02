"use client";

import { Frown, Laugh, Meh, Smile } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LeafSprig } from "@/components/scene";
import { useT } from "@/i18n/client";
import { postJSON } from "@/lib/api-client";
import { cn } from "@/lib/cn";

const FACES = [
  { value: "difficult", icon: Frown },
  { value: "normal", icon: Meh },
  { value: "good", icon: Smile },
  { value: "excellent", icon: Laugh },
] as const;

/**
 * Dark green "How did your mission go?" card: one tap logs the mission with
 * an outcome, then the reflection screen opens.
 */
export function MissionMoodCard({ attemptId, title, eyebrow }: { attemptId: string; title: string; eyebrow?: string }) {
  const t = useT();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function pick(outcome: string) {
    setSelected(outcome);
    setError(null);
    start(async () => {
      try {
        await postJSON(`/api/missions/${attemptId}/checkin`, { status: "done", outcome });
        router.push(`/mission/${attemptId}`);
      } catch (e) {
        setSelected(null);
        setError(e instanceof Error ? e.message : t("common.somethingWrong"));
      }
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-hero p-5 text-hero-ink shadow-card">
      <LeafSprig className="absolute -top-2 -right-2 h-24 w-24 text-hero-ink/30" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-hero-ink/65">{eyebrow ?? t("home.missionCard.eyebrow")}</p>
      <h2 className="mt-1.5 max-w-[85%] font-display text-[22px] leading-tight">{title}</h2>
      <p className="mt-3 text-[13px] text-hero-ink/75">{t("home.missionCard.question")}</p>
      <div role="radiogroup" aria-label={t("home.missionCard.question")} className="mt-3 grid grid-cols-4 gap-2">
        {FACES.map(({ value, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected === value}
            aria-label={t(`home.missionCard.outcomes.${value}`)}
            disabled={pending}
            onClick={() => pick(value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl py-2.5 transition active:scale-95",
              selected === value ? "bg-hero-ink text-hero" : "bg-hero-ink/10 hover:bg-hero-ink/20",
            )}
          >
            <Icon size={26} strokeWidth={1.6} />
            <span className="text-[11px] font-medium">{t(`home.missionCard.outcomes.${value}`)}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px] text-hero-ink/70">
        <span>{error ?? t("home.missionCard.hint")}</span>
        <a href={`/mission/${attemptId}`} className="font-medium underline-offset-4 hover:underline">
          {t("home.missionCard.notYet")}
        </a>
      </div>
    </section>
  );
}
