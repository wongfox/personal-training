"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/client";
import { switchJourneyAction } from "./actions";

/** Two-step inline confirm: switching changes tomorrow's lesson, so it's never one accidental tap. */
export function SwitchJourneyButton({ journeyId, title }: { journeyId: string; title: string }) {
  const t = useT();
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  if (!confirming) {
    return (
      <Button variant="secondary" size="sm" className="shrink-0" onClick={() => setConfirming(true)} aria-label={t("journey.switchTo", { title })}>
        {t("journey.switch")}
      </Button>
    );
  }
  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={pending}>
        {t("common.cancel")}
      </Button>
      <Button size="sm" onClick={() => start(() => switchJourneyAction(journeyId))} disabled={pending} aria-label={t("journey.confirmSwitchTo", { title })}>
        {pending ? t("journey.switching") : t("common.confirm")}
      </Button>
    </span>
  );
}
