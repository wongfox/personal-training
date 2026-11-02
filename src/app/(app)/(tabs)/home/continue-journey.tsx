"use client";

import { ArrowRight } from "lucide-react";
import { useTransition } from "react";
import { switchJourneyAction } from "../journey/actions";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/client";

export function ContinueJourneyButton({ journeyId }: { journeyId: string }) {
  const t = useT();
  const [pending, start] = useTransition();
  return (
    <Button className="mt-5" disabled={pending} onClick={() => start(() => switchJourneyAction(journeyId))}>
      {pending ? t("home.hero.starting") : t("home.hero.continuePlan")} <ArrowRight size={18} />
    </Button>
  );
}
