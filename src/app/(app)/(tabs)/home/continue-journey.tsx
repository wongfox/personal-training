"use client";

import { ArrowRight } from "lucide-react";
import { useTransition } from "react";
import { switchJourneyAction } from "../journey/actions";
import { Button } from "@/components/ui/button";

export function ContinueJourneyButton({ journeyId }: { journeyId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button className="mt-5" disabled={pending} onClick={() => start(() => switchJourneyAction(journeyId))}>
      {pending ? "Starting…" : "Continue my plan"} <ArrowRight size={18} />
    </Button>
  );
}
