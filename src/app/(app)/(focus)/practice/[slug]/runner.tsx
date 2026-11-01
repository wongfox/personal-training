"use client";

import { useRouter } from "next/navigation";
import { ExerciseRunner } from "@/components/exercises/exercise-runner";
import type { ClientExerciseConfig } from "@/server/engine/client-config";

export function PracticeRunner({ exerciseId, config }: { exerciseId: string; config: ClientExerciseConfig }) {
  const router = useRouter();
  return <ExerciseRunner exerciseId={exerciseId} config={config} onComplete={() => router.refresh()} />;
}
