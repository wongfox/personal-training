import type { Metadata } from "next";
import { getTranslator } from "@/i18n/server";
import { localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { getDueReviews } from "@/server/services/learning";
import { ReviewSession } from "./session";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("review.metaTitle") };
}

export default async function ReviewPage() {
  const user = await requireUser();
  const items = await getDueReviews(getDb(), user.id, localDate(user.timezone), 8);
  return <ReviewSession items={items} />;
}
