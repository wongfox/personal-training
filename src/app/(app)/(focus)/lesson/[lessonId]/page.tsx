import { Lock } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { ButtonLink } from "@/components/ui/button";
import { getTranslator } from "@/i18n/server";
import { localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { getLessonForUser } from "@/server/services/learning";
import { LessonPlayer } from "./player";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("lesson.metaTitle") };
}

export default async function LessonPage({ params }: PageProps<"/lesson/[lessonId]">) {
  const { lessonId } = await params;
  const user = await requireUser();
  const lesson = await getLessonForUser(getDb(), user.id, lessonId, localDate(user.timezone));
  if (!lesson) notFound();

  if (lesson.locked) {
    const { t } = await getTranslator();
    const otherJourney = lesson.access === "not_enrolled";
    return (
      <FocusShell closeHref="/journey">
        <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-surface text-accent shadow-card">
            <Lock size={24} strokeWidth={1.8} />
          </span>
          <h1 className="mt-6 font-display text-[32px] leading-[1.1]">{lesson.title}</h1>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-2">
            {otherJourney ? t("lesson.locked.otherJourney") : t("lesson.locked.notYet")}
          </p>
          <ButtonLink href={otherJourney ? "/journey#journeys" : "/home"} className="mt-8 max-w-xs">
            {otherJourney ? t("lesson.locked.seeJourneys") : t("common.backToToday")}
          </ButtonLink>
        </div>
      </FocusShell>
    );
  }

  return <LessonPlayer lesson={lesson} />;
}
