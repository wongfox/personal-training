"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { switchJourneyAction } from "./actions";

export function SwitchJourneyButton({ journeyId, title }: { journeyId: string; title: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Switch your daily training to “${title}”? Your progress everywhere is kept.`)) {
          start(() => switchJourneyAction(journeyId));
        }
      }}
    >
      {pending ? "Switching…" : "Switch"}
    </Button>
  );
}
