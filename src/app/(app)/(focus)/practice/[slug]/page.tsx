import { Bot, Clock, Trophy } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { Pill } from "@/components/ui/primitives";
import { getTranslator } from "@/i18n/server";
import { aiEnabled } from "@/server/ai/client";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { toClientConfig } from "@/server/engine/client-config";
import { getPracticeTool, recentPracticeAttempts } from "@/server/services/catalog";
import { PracticeRunner } from "./runner";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("exercises.practice.metaTitle") };
}

export default async function PracticeToolPage({ params }: PageProps<"/practice/[slug]">) {
  const { slug } = await params;
  const user = await requireUser();
  const db = getDb();
  const tool = await getPracticeTool(db, slug);
  if (!tool) notFound();
  const attempts = await recentPracticeAttempts(db, user.id, tool.id);
  const { t } = await getTranslator();
  const open = tool.type === "roleplay" || tool.type === "pitch";
  const ai = aiEnabled();

  return (
    <FocusShell closeHref="/practice" top={<p className="truncate text-[13px] font-medium text-muted">{tool.title.split(":")[0]}</p>}>
      <div className="pt-4">
        <div className="flex flex-wrap gap-2">
          <Pill>{t(`taxonomy.categories.${tool.category}`)}</Pill>
          <Pill>
            <Clock size={12} aria-hidden /> {t("common.minutes", { count: tool.estimatedMinutes })}
          </Pill>
          {attempts.length > 0 && (
            <Pill className="bg-sun-soft text-ink">
              <Trophy size={12} className="text-sun" aria-hidden /> {t("exercises.practice.best", { score: Math.max(...attempts.map((a) => a.score)) })}
            </Pill>
          )}
          {open && (
            <Pill className={ai ? "bg-accent-soft text-accent" : ""}>
              <Bot size={12} aria-hidden /> {ai ? t("exercises.practice.aiPartner") : t("exercises.practice.scriptedPartner")}
            </Pill>
          )}
        </div>
        <h1 className="mt-5 font-display text-[34px] leading-[1.08] tracking-[-0.01em]">
          {tool.title.includes(":") ? tool.title.split(":").slice(1).join(":").trim() : tool.title}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{tool.description}</p>
        <div className="mt-7">
          <PracticeRunner exerciseId={tool.id} config={toClientConfig(tool.config, tool.id)} />
        </div>
      </div>
    </FocusShell>
  );
}
