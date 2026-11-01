"use client";

import { useActionState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { submitWeeklyReview, type WeeklyState } from "./actions";

export function WeeklyReviewForm() {
  const [state, action, pending] = useActionState<WeeklyState, FormData>(submitWeeklyReview, {});
  if (state.nextFocus) {
    return (
      <section className="mt-8 animate-rise">
        <div className="rounded-3xl bg-ink p-6 text-bg">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-bg/60">Next week&apos;s focus</p>
          <p className="mt-2 font-display text-[28px] leading-tight">{state.nextFocus.headline}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-bg/80">{state.nextFocus.detail}</p>
        </div>
        {state.xp ? <p className="mt-3 text-center text-[13px] font-semibold text-accent">+{state.xp} XP</p> : null}
        <ButtonLink href="/home" className="mt-6">
          Start the week
        </ButtonLink>
      </section>
    );
  }
  return (
    <form action={action} className="mt-8 space-y-4">
      <label htmlFor="reflection" className="block font-display text-[26px] leading-tight">
        What changed this week?
      </label>
      <textarea
        id="reflection"
        name="reflection"
        maxLength={2000}
        placeholder="A moment you handled differently, something you noticed…"
        className="min-h-32 w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[16px] leading-relaxed outline-none focus:border-ink/40"
      />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Close the week"}
      </Button>
    </form>
  );
}
