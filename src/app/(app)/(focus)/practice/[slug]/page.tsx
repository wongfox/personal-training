import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { Pill } from "@/components/ui/primitives";
import { categoryName } from "@/lib/taxonomy";
import { aiEnabled } from "@/server/ai/client";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { toClientConfig } from "@/server/engine/client-config";
import { getPracticeTool, recentPracticeAttempts } from "@/server/services/catalog";
import { PracticeRunner } from "./runner";

export const metadata: Metadata = { title: "Practice" };

export default async function PracticeToolPage({ params }: PageProps<"/practice/[slug]">) {
  const { slug } = await params;
  const user = await requireUser();
  const db = getDb();
  const tool = await getPracticeTool(db, slug);
  if (!tool) notFound();
  const attempts = await recentPracticeAttempts(db, user.id, tool.id);
  const open = tool.type === "roleplay" || tool.type === "pitch";

  return (
    <FocusShell closeHref="/practice" top={<p className="truncate text-[13px] text-muted">{tool.title.split(":")[0]}</p>}>
      <div className="pt-4">
        <div className="flex flex-wrap gap-2">
          <Pill>{categoryName(tool.category)}</Pill>
          <Pill>{tool.estimatedMinutes} min</Pill>
          {attempts.length > 0 && <Pill>Best {Math.max(...attempts.map((a) => a.score))}</Pill>}
          {open && <Pill className={aiEnabled() ? "bg-accent-soft text-accent" : ""}>{aiEnabled() ? "AI partner" : "Scripted partner"}</Pill>}
        </div>
        <h1 className="mt-4 font-display text-[32px] leading-[1.08]">
          {tool.title.includes(":") ? tool.title.split(":").slice(1).join(":").trim() : tool.title}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{tool.description}</p>
        <div className="mt-7">
          <PracticeRunner exerciseId={tool.id} config={toClientConfig(tool.config, tool.id)} />
        </div>
      </div>
    </FocusShell>
  );
}
