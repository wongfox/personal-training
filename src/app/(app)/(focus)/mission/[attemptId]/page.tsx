import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getMission } from "@/server/services/learning";
import { MissionCheckIn } from "./check-in";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("mission.metaTitle") };
}

export default async function MissionPage({ params }: PageProps<"/mission/[attemptId]">) {
  const { attemptId } = await params;
  const user = await requireUser();
  if (!/^[0-9a-f-]{36}$/i.test(attemptId)) notFound();
  const mission = await getMission(getDb(), user.id, attemptId).catch((e: unknown) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  return <MissionCheckIn mission={mission} />;
}
