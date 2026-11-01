import { ArrowUpRight, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CATEGORIES, categoryName, RESOURCE_TYPE_LABELS } from "@/lib/taxonomy";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listResources } from "@/server/services/catalog";

export const metadata: Metadata = { title: "Explore" };

const TYPES = ["framework", "cheat_sheet", "template", "case_study", "insight", "video"] as const;

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  await requireUser();
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const type = typeof sp.type === "string" && (TYPES as readonly string[]).includes(sp.type) ? sp.type : undefined;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : undefined;
  const db = getDb();
  const [items, all] = await Promise.all([listResources(db, { category, type, q }), listResources(db)]);
  const usedCategories = new Set(all.map((r) => r.category));

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
        <h1 className="font-display text-[36px] leading-none">Explore</h1>
        <p className="mt-2 text-[15px] text-ink-2">Frameworks, cheat sheets and ideas — for when you want to go deeper.</p>
      </header>

      <form action="/explore" className="relative">
        {category && <input type="hidden" name="category" value={category} />}
        {type && <input type="hidden" name="type" value={type} />}
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search the library"
          aria-label="Search the library"
          className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-[16px] outline-none focus:border-ink/40"
        />
      </form>

      <div className="space-y-2.5">
        <nav aria-label="Type" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
          <Chip href={href({ type: undefined })} active={!type}>
            All types
          </Chip>
          {TYPES.map((t) => (
            <Chip key={t} href={href({ type: t })} active={type === t}>
              {RESOURCE_TYPE_LABELS[t]}
            </Chip>
          ))}
        </nav>
        <nav aria-label="Category" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
          <Chip href={href({ category: undefined })} active={!category} subtle>
            All topics
          </Chip>
          {CATEGORIES.filter((c) => usedCategories.has(c.key)).map((c) => (
            <Chip key={c.key} href={href({ category: c.key })} active={category === c.key} subtle>
              {c.name}
            </Chip>
          ))}
        </nav>
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-ink-2">Nothing matches that yet. Try another search.</p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {items.map((r, i) => (
            <li key={r.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
              <Link href={`/explore/${r.slug}`} className="flex h-full flex-col rounded-3xl bg-surface p-5 shadow-card transition hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold uppercase tracking-[0.12em] text-accent">{RESOURCE_TYPE_LABELS[r.type]}</span>
                  <span className="text-muted">{r.estimatedMinutes} min</span>
                </div>
                <h2 className="mt-2 text-[17px] font-semibold leading-snug">{r.title}</h2>
                <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-ink-2">{r.description}</p>
                <p className="mt-3 flex items-center justify-between text-[12px] text-muted">
                  {categoryName(r.category)}
                  <ArrowUpRight size={15} />
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
        "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition",
        active ? (subtle ? "border-ink text-ink" : "border-ink bg-ink text-bg") : "border-line bg-surface text-ink-2 hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
