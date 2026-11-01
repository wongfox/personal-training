import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSignedIn } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { getAssessmentQuestions } from "@/server/services/onboarding";
import { OnboardingWizard } from "./wizard";

export const metadata: Metadata = { title: "Your diagnosis" };

export default async function OnboardingPage() {
  const user = await requireSignedIn();
  if (user.onboarded) redirect("/home");
  const questions = await getAssessmentQuestions(getDb(), "onboarding");
  return <OnboardingWizard firstName={user.name.split(" ")[0]} questions={questions} />;
}
