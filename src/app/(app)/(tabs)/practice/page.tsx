import { ArrowRight, Brain, Clock, ListOrdered, MessagesSquare, Mic, Scale, Sparkles, Users, Wand2, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType } from "react";
import { LeafSprig } from "@/components/scene";
import { getTranslator } from "@/i18n/server";
import type { TFunction } from "@/i18n/translate";
import { cn } from "@/lib/cn";
import { CATEGORIES, categorySkill, SKILLS } from "@/lib/taxonomy";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listPracticeTools, type PracticeToolSummary } from "@/server/services/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("practice.title") };
}

type Icon = ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;

/** Tool families, recognised by slug (titles are localized). */
const FAMILIES: { key: string; match: RegExp; icon: Icon }[] = [
  { key: "conversation", match: /conversation/, icon: MessagesSquare },
  { key: "networking", match: /networking/, icon: Users },
  { key: "presentation", match: /presentation/, icon: Mic },
  { key: "organizer", match: /organizer/, icon: ListOrdered },
  { key: "story", match: /story/, icon: Sparkles },
  { key: "decision", match: /decision/, icon: Scale },
  { key: "memory", match: /memory/, icon: Brain },
  { key: "hedge", match: /hedge/, icon: Zap },
];

function family(tool: PracticeToolSummary, t: TFunction): { label: string; icon: Icon } {
  const known = FAMILIES.find((f) => f.match.test(tool.slug));
  if (known) return { label: t(`practice.families.${known.key}`), icon: known.icon };
  const prefix = tool.title.split(":")[0].trim();
  return { label: prefix !== tool.title ? prefix : t("practice.families.quickDrills"), icon: Wand2 };
}

/** "Family: The scenario" → "The scenario". */
function shortTitle(title: string): string {
  return title.includes(":") ? title.split(":").slice(1).join(":").trim() : title;
}

export default async function PracticePage({ searchParams }: PageProps<"/practice">) {
  const user = await requireUser();
  const { category } = await searchParams;
  const active = typeof category === "string" ? category : undefined;
  const [tools, { t }] = await Promise.all([listPracticeTools(getDb(), user.id), getTranslator()]);
  const used = new Set(tools.map((tool) => tool.category));
  const visible = active ? tools.filter((tool) => tool.category === active) : tools;

  // One featured tool (the first you haven't tried yet), then the rest grouped by skill.
  const featured = visible.find((tool) => tool.attempts === 0) ?? visible[0];
  const bySkill = new Map<string, PracticeToolSummary[]>();
  for (const tool of visible) {
    if (tool === featured) continue;
    const skill = categorySkill(tool.category);
    bySkill.set(skill, [...(bySkill.get(skill) ?? []), tool]);
  }
  const groups = SKILLS.filter((s) => bySkill.has(s.key)).map((s) => ({ key: s.key, tools: bySkill.get(s.key)! }));

  const meta = (tool: PracticeToolSummary) =>
    [t("common.minutes", { count: tool.estimatedMinutes }), tool.attempts > 0 && tool.bestScore !== null ? t("practice.best", { score: tool.bestScore }) : null]
      .filter(Boolean)
      .join(" · ");

  return (
    <div className="space-y-7">
      <header className="animate-fade">
        <h1 className="font-display text-[36px] leading-none">{t("practice.title")}</h1>
        <p className="mt-2 text-[15px] text-ink-2">{t("practice.subtitle")}</p>
      </header>

      <nav aria-label={t("practice.categories")} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
        <Chip href="/practice" active={!active}>
          {t("practice.all")}
        </Chip>
        {CATEGORIES.filter((c) => used.has(c.key)).map((c) => (
          <Chip key={c.key} href={`/practice?category=${c.key}`} active={active === c.key}>
            {t(`taxonomy.categories.${c.key}`)}
          </Chip>
        ))}
      </nav>

      {featured ? (
        <FeaturedCard tool={featured} t={t} meta={meta(featured)} />
      ) : (
        <p className="rounded-[28px] border border-dashed border-line px-6 py-10 text-center text-[15px] text-ink-2">{t("practice.empty")}</p>
      )}

      {groups.map(({ key, tools: list }) => (
        <section key={key} aria-labelledby={`skill-${key}`} className="animate-rise">
          <h2 id={`skill-${key}`} className="mb-3 px-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
            {t(`taxonomy.skills.${key}`)}
          </h2>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {list.map((tool) => {
              const fam = family(tool, t);
              const Icon = fam.icon;
              return (
                <li key={tool.id}>
                  <Link
                    href={`/practice/${tool.slug}`}
                    className="group flex h-full flex-col rounded-[22px] bg-surface p-4 shadow-card transition hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
                      <Icon size={20} strokeWidth={1.8} aria-hidden />
                    </span>
                    <span className="mt-3 block truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{fam.label}</span>
                    <span className="mt-0.5 line-clamp-3 flex-1 text-[15px] font-semibold leading-snug">{shortTitle(tool.title)}</span>
                    <span className="mt-2 flex items-center gap-1 text-[12px] text-muted">
                      <Clock size={12} aria-hidden /> {meta(tool)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function FeaturedCard({ tool, t, meta }: { tool: PracticeToolSummary; t: TFunction; meta: string }) {
  const fam = family(tool, t);
  const Icon = fam.icon;
  return (
    <Link
      href={`/practice/${tool.slug}`}
      className="relative isolate block overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card transition hover:brightness-110 animate-rise"
    >
      <LeafSprig className="absolute -right-4 -bottom-5 -z-10 h-36 w-36 text-hero-ink/20" />
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-hero-ink/12 text-hero-ink">
          <Icon size={20} strokeWidth={1.8} aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-hero-ink/70">{t("practice.featured")}</span>
          <span className="block truncate text-[13px] text-hero-ink/85">{fam.label}</span>
        </span>
      </div>
      <span className="mt-4 block max-w-[85%] font-display text-[28px] leading-[1.08]">{shortTitle(tool.title)}</span>
      {tool.description && <span className="mt-2 line-clamp-2 block max-w-[90%] text-[14px] text-hero-ink/75">{tool.description}</span>}
      <span className="mt-5 flex items-center justify-between gap-3">
        <span className="text-[13px] text-hero-ink/75">{meta}</span>
        <span className="inline-flex h-11 items-center gap-2 rounded-full bg-hero-ink pr-1.5 pl-4 text-[14px] font-semibold text-hero">
          {t("practice.featuredCta")}
          <span className="grid h-8 w-8 place-items-center rounded-full bg-hero text-hero-ink">
            <ArrowRight size={16} aria-hidden />
          </span>
        </span>
      </span>
    </Link>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition",
        active ? "bg-hero text-hero-ink shadow-card" : "bg-surface text-ink-2 shadow-card hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
