import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import { requireSignedIn } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { getAssessmentQuestions } from "@/server/services/onboarding";
import { OnboardingWizard } from "./wizard";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("onboarding.metaTitle") };
}

export default async function OnboardingPage() {
  const user = await requireSignedIn();
  if (user.onboarded) redirect("/home");
  const questions = await getAssessmentQuestions(getDb(), "onboarding");
  return <OnboardingWizard firstName={user.name.split(" ")[0]} questions={questions} />;
}
