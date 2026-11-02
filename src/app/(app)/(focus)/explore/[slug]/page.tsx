import { Clock, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { MarkdownLite } from "@/components/markdown-lite";
import { Pill } from "@/components/ui/primitives";
import { getTranslator } from "@/i18n/server";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { getResource } from "@/server/services/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("explore.title") };
}

export default async function ResourcePage({ params }: PageProps<"/explore/[slug]">) {
  await requireUser();
  const { slug } = await params;
  const [row, { t }] = await Promise.all([getResource(getDb(), slug), getTranslator()]);
  if (!row) notFound();
  const { resource: r, source } = row;
  const safeUrl = r.url && /^https:\/\//.test(r.url) ? r.url : null;

  return (
    <FocusShell closeHref="/explore" top={<p className="text-[13px] text-muted">{t(`taxonomy.resourceTypes.${r.type}`)}</p>}>
      <article className="pt-4">
        <div className="flex flex-wrap gap-2">
          <Pill className="bg-accent-soft text-accent">{t(`taxonomy.categories.${r.category}`)}</Pill>
          <Pill>
            <Clock size={12} aria-hidden /> {t("common.minutes", { count: r.estimatedMinutes })}
          </Pill>
        </div>
        <h1 className="mt-4 font-display text-[36px] leading-[1.06]">{r.title}</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink">{r.description}</p>
        {source && <p className="mt-2 text-[13px] text-muted">{t("explore.drawsOn", { source })}</p>}
        {safeUrl && (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-hero px-5 text-[15px] font-semibold text-hero-ink shadow-card hover:brightness-110"
          >
            {t("explore.watch")} <ExternalLink size={15} aria-hidden />
          </a>
        )}
        <div className="mt-7 rounded-[28px] bg-surface p-5 shadow-card">
          <MarkdownLite source={r.body} />
        </div>
      </article>
    </FocusShell>
  );
}
