import { ArrowRight, ArrowUpRight, Clock, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { QuoteCard } from "@/components/home-widgets";
import { getTranslator } from "@/i18n/server";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/lib/taxonomy";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listResources } from "@/server/services/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("explore.title") };
}

const TYPES = ["framework", "cheat_sheet", "template", "case_study", "insight", "video"] as const;

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  await requireUser();
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const type = typeof sp.type === "string" && (TYPES as readonly string[]).includes(sp.type) ? sp.type : undefined;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : undefined;
  const db = getDb();
  const [items, all, { t }] = await Promise.all([listResources(db, { category, type, q }), listResources(db), getTranslator()]);
  const usedCategories = new Set(all.map((r) => r.category));
  // An expert insight up top while browsing — not while searching or filtering.
  const insight = !category && !type && !q ? all.find((r) => r.type === "insight") : undefined;
  const list = insight ? items.filter((r) => r.id !== insight.id) : items;

  const href = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { category, type, q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const s = params.toString();
    return s ? `/explore?${s}` : "/explore";
  };

  return (
    <div className="space-y-6">
      <header className="animate-fade">
        <h1 className="font-display text-[36px] leading-none">{t("explore.title")}</h1>
        <p className="mt-2 text-[15px] text-ink-2">{t("explore.subtitle")}</p>
      </header>

      <form action="/explore" role="search" className="relative">
        {category && <input type="hidden" name="category" value={category} />}
        {type && <input type="hidden" name="type" value={type} />}
        <Search size={18} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t("explore.search")}
          aria-label={t("explore.search")}
          className="h-13 w-full rounded-full bg-surface pr-5 pl-12 text-[16px] shadow-card outline-none ring-1 ring-transparent transition placeholder:text-muted focus:ring-accent/40"
        />
      </form>

      <div className="space-y-2.5">
        <nav aria-label={t("explore.categoryNav")} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
          <Chip href={href({ category: undefined })} active={!category}>
            {t("explore.allTopics")}
          </Chip>
          {CATEGORIES.filter((c) => usedCategories.has(c.key)).map((c) => (
            <Chip key={c.key} href={href({ category: c.key })} active={category === c.key}>
              {t(`taxonomy.categories.${c.key}`)}
            </Chip>
          ))}
        </nav>
        <nav aria-label={t("explore.typeNav")} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
          <Chip href={href({ type: undefined })} active={!type} subtle>
            {t("explore.allTypes")}
          </Chip>
          {TYPES.map((ty) => (
            <Chip key={ty} href={href({ type: ty })} active={type === ty} subtle>
              {t(`taxonomy.resourceTypes.${ty}`)}
            </Chip>
          ))}
        </nav>
      </div>

      {insight && (
        <section className="animate-rise" aria-label={t("taxonomy.resourceTypes.insight")}>
          <QuoteCard
            eyebrow={`${t("taxonomy.resourceTypes.insight")} · ${t(`taxonomy.categories.${insight.category}`)}`}
            footer={
              <Link
                href={`/explore/${insight.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-accent-ink hover:opacity-90"
              >
                {t("explore.readInsight")} <ArrowRight size={14} aria-hidden />
              </Link>
            }
          >
            {insight.description || insight.title}
          </QuoteCard>
        </section>
      )}

      {list.length === 0 ? (
        <p className="rounded-[28px] border border-dashed border-line px-6 py-10 text-center text-ink-2">{t("explore.empty")}</p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {list.map((r, i) => (
            <li key={r.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
              <Link href={`/explore/${r.slug}`} className="flex h-full flex-col rounded-[28px] bg-surface p-5 shadow-card transition hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 font-semibold text-accent">{t(`taxonomy.resourceTypes.${r.type}`)}</span>
                  <span className="flex items-center gap-1 text-muted">
                    <Clock size={12} aria-hidden /> {t("common.minutes", { count: r.estimatedMinutes })}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-[22px] leading-[1.15]">{r.title}</h2>
                <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-ink-2">{r.description}</p>
                <p className="mt-4 flex items-center justify-between text-[12px] font-medium text-muted">
                  {t(`taxonomy.categories.${r.category}`)}
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-ink" aria-hidden>
                    <ArrowUpRight size={15} />
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({ href, active, children, subtle }: { href: string; active: boolean; children: React.ReactNode; subtle?: boolean }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "shrink-0 rounded-full font-semibold transition",
        subtle ? "px-3.5 py-1.5 text-[12px]" : "px-4 py-2 text-[13px]",
        active
          ? subtle
            ? "bg-accent-soft text-accent ring-1 ring-accent/30"
            : "bg-hero text-hero-ink shadow-card"
          : "bg-surface text-ink-2 shadow-card hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
