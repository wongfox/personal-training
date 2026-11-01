"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { switchJourneyAction } from "./actions";

/** Two-step inline confirm: switching changes tomorrow's lesson, so it's never one accidental tap. */
export function SwitchJourneyButton({ journeyId, title }: { journeyId: string; title: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  if (!confirming) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setConfirming(true)} aria-label={`Switch to ${title}`}>
        Switch
      </Button>
    );
  }
  return (
    <span className="flex items-center gap-1.5">
      <Button variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={pending}>
        Cancel
      </Button>
      <Button size="sm" onClick={() => start(() => switchJourneyAction(journeyId))} disabled={pending} aria-label={`Confirm switch to ${title}`}>
        {pending ? "Switching…" : "Confirm"}
      </Button>
    </span>
  );
}
