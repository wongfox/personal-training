"use client";

import { Quote } from "lucide-react";
import { useActionState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { useT } from "@/i18n/client";
import { submitWeeklyReview, type WeeklyState } from "./actions";

export function WeeklyReviewForm() {
  const t = useT();
  const [state, action, pending] = useActionState<WeeklyState, FormData>(submitWeeklyReview, {});
  if (state.nextFocus) {
    return (
      <section className="mt-8 animate-rise">
        <figure className="rounded-[28px] bg-accent-soft px-6 py-6 text-ink">
          <div className="flex items-center gap-2">
            <Quote size={22} className="shrink-0 fill-accent/25 text-accent" aria-hidden />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("review.week.nextFocus")}</span>
          </div>
          <p className="mt-3 font-display text-[26px] leading-[1.2]">{state.nextFocus.headline}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{state.nextFocus.detail}</p>
        </figure>
        {state.xp ? <p className="mt-3 text-center text-[13px] font-semibold text-accent">{t("common.plusXp", { count: state.xp })}</p> : null}
        <ButtonLink href="/home" className="mt-6">
          {t("review.week.startWeek")}
        </ButtonLink>
      </section>
    );
  }
  return (
    <form action={action} className="mt-8 space-y-4">
      <label htmlFor="reflection" className="block font-display text-[28px] leading-tight">
        {t("review.week.prompt")}
      </label>
      <textarea
        id="reflection"
        name="reflection"
        maxLength={2000}
        placeholder={t("review.week.placeholder")}
        className="min-h-36 w-full resize-none rounded-[24px] border border-line bg-surface p-5 text-[16px] leading-relaxed shadow-card outline-none placeholder:text-muted focus:border-accent/50"
      />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Button type="submit" disabled={pending}>
        {pending ? t("common.saving") : t("review.week.submit")}
      </Button>
    </form>
  );
}
