import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { MarkdownLite } from "@/components/markdown-lite";
import { Pill } from "@/components/ui/primitives";
import { categoryName, RESOURCE_TYPE_LABELS } from "@/lib/taxonomy";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { getResource } from "@/server/services/catalog";

export const metadata: Metadata = { title: "Explore" };

export default async function ResourcePage({ params }: PageProps<"/explore/[slug]">) {
  await requireUser();
  const { slug } = await params;
  const row = await getResource(getDb(), slug);
  if (!row) notFound();
  const { resource: r, source } = row;
  const safeUrl = r.url && /^https:\/\//.test(r.url) ? r.url : null;

  return (
    <FocusShell closeHref="/explore" top={<p className="text-[13px] text-muted">{RESOURCE_TYPE_LABELS[r.type]}</p>}>
      <article className="pt-4">
        <div className="flex flex-wrap gap-2">
          <Pill>{categoryName(r.category)}</Pill>
          <Pill>{r.estimatedMinutes} min</Pill>
        </div>
        <h1 className="mt-4 font-display text-[34px] leading-[1.06]">{r.title}</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink">{r.description}</p>
        {source && <p className="mt-2 text-[13px] text-muted">Draws on {source}</p>}
        {safeUrl && (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-bg"
          >
            Watch <ExternalLink size={15} />
          </a>
        )}
        <div className="mt-7 border-t border-line pt-6">
          <MarkdownLite source={r.body} />
        </div>
      </article>
    </FocusShell>
  );
}
