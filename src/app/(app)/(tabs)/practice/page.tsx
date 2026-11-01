import { ArrowRight, Brain, ListOrdered, MessagesSquare, Mic, Scale, Sparkles, Users, Wand2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CATEGORIES, categoryName } from "@/lib/taxonomy";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listPracticeTools, type PracticeToolSummary } from "@/server/services/catalog";

export const metadata: Metadata = { title: "Practice" };

const FAMILY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "Conversation Simulator": MessagesSquare,
  "Networking Practice": Users,
  "Presentation Trainer": Mic,
  "Thought Organizer": ListOrdered,
  "Story Builder": Sparkles,
  "Decision Framework": Scale,
  "Memory Trainer": Brain,
};

function family(tool: PracticeToolSummary): string {
  const prefix = tool.title.split(":")[0].trim();
  if (prefix !== tool.title) return prefix;
  return tool.type === "pitch" ? "Presentation Trainer" : "Quick drills";
}

export default async function PracticePage({ searchParams }: PageProps<"/practice">) {
  const user = await requireUser();
  const { category } = await searchParams;
  const active = typeof category === "string" ? category : undefined;
  const tools = await listPracticeTools(getDb(), user.id);
  const used = new Set(tools.map((t) => t.category));
  const visible = active ? tools.filter((t) => t.category === active) : tools;

  const families = new Map<string, PracticeToolSummary[]>();
  for (const t of visible) {
    const f = family(t);
    families.set(f, [...(families.get(f) ?? []), t]);
  }

  return (
    <div className="space-y-7">
      <header className="animate-fade">
        <h1 className="font-display text-[36px] leading-none">Practice</h1>
        <p className="mt-2 text-[15px] text-ink-2">Rehearse the moments that matter before they happen.</p>
      </header>

      <nav aria-label="Categories" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
        <Chip href="/practice" active={!active}>
          All
        </Chip>
        {CATEGORIES.filter((c) => used.has(c.key)).map((c) => (
          <Chip key={c.key} href={`/practice?category=${c.key}`} active={active === c.key}>
            {c.name}
          </Chip>
        ))}
      </nav>

      {[...families.entries()].map(([name, list]) => {
        const Icon = FAMILY_ICONS[name] ?? Wand2;
        return (
          <section key={name} aria-labelledby={`fam-${name}`} className="animate-rise">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-bg">
                <Icon size={16} />
              </span>
              <h2 id={`fam-${name}`} className="text-[17px] font-semibold">
                {name}
              </h2>
            </div>
            <ul className="divide-y divide-line overflow-hidden rounded-3xl bg-surface shadow-card">
              {list.map((t) => (
                <li key={t.id}>
                  <Link href={`/practice/${t.slug}`} className="flex items-center gap-3 px-5 py-4 transition hover:bg-surface-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium leading-snug">{t.title.includes(":") ? t.title.split(":").slice(1).join(":").trim() : t.title}</p>
                      <p className="mt-1 text-[12px] text-muted">
                        {categoryName(t.category)} · {t.estimatedMinutes} min
                        {t.attempts > 0 && ` · best ${t.bestScore}`}
                      </p>
                    </div>
                    <ArrowRight size={17} className="shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-medium transition",
        active ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink-2 hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
