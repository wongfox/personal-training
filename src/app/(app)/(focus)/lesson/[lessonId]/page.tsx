import { Lock } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { ButtonLink } from "@/components/ui/button";
import { localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { getLessonForUser } from "@/server/services/learning";
import { LessonPlayer } from "./player";

export const metadata: Metadata = { title: "Lesson" };

export default async function LessonPage({ params }: PageProps<"/lesson/[lessonId]">) {
  const { lessonId } = await params;
  const user = await requireUser();
  const lesson = await getLessonForUser(getDb(), user.id, lessonId, localDate(user.timezone));
  if (!lesson) notFound();

  if (lesson.locked) {
    return (
      <FocusShell closeHref="/journey">
        <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-ink-2">
            <Lock size={22} />
          </span>
          <h1 className="mt-6 font-display text-[30px] leading-tight">{lesson.title}</h1>
          <p className="mt-3 max-w-xs text-[15px] text-ink-2">
            {lesson.access === "not_enrolled"
              ? "This lesson is part of another journey. Switch journeys to start it."
              : "One idea a day. This lesson unlocks once you've finished the ones before it — one per day."}
          </p>
          <ButtonLink href={lesson.access === "not_enrolled" ? "/journey#journeys" : "/home"} className="mt-8 max-w-xs">
            {lesson.access === "not_enrolled" ? "See journeys" : "Back to today"}
          </ButtonLink>
        </div>
      </FocusShell>
    );
  }

  return <LessonPlayer lesson={lesson} />;
}
