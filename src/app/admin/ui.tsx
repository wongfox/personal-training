import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { INTL_LOCALE, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import type { TFunction } from "@/i18n/translate";
import { cn } from "@/lib/cn";
import { formatDay } from "@/lib/dates";
import { CATEGORIES } from "@/lib/taxonomy";
import type { ContentTranslations } from "@/server/db/types";

/* Presentational building blocks for the admin back office (server components). */

export function PageHeader({ title, subtitle, action, crumbs }: { title: string; subtitle?: string; action?: ReactNode; crumbs?: { href: string; label: string }[] }) {
  return (
    <header className="mb-6 lg:mb-8">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap gap-1.5 text-[13px] text-muted">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex min-w-0 items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              <Link href={c.href} className="truncate hover:text-ink">
                {c.label}
              </Link>
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-[34px] leading-[1.05] tracking-[-0.01em] text-ink break-words sm:text-[40px]">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-[14px] text-ink-2">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

export function Panel({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("rounded-[28px] bg-surface p-5 shadow-card sm:p-6", className)} {...props} />;
}

export function PanelTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("text-[13px] font-semibold uppercase tracking-[0.12em] text-muted", className)} {...props} />;
}

const STATUS_TONE: Record<string, string> = {
  published: "bg-success-soft text-success",
  review: "bg-accent-soft text-accent",
  archived: "bg-surface-2 text-muted line-through",
  suspended: "bg-danger-soft text-danger",
};

export async function StatusBadge({ status }: { status: string }) {
  const { t } = await getTranslator();
  return (
    <span className={cn("inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-medium", STATUS_TONE[status] ?? "bg-surface-2 text-ink-2")}>
      {t(`admin.status.${status}`)}
    </span>
  );
}

/** Small marker for content rows that have no Spanish translation yet. */
export async function EsMissingBadge({ className }: { className?: string }) {
  const { t } = await getTranslator();
  return (
    <span title={t("admin.lang.missingTitle")} className={cn("inline-flex shrink-0 items-center rounded-full bg-sun-soft px-2 py-0.5 text-[11px] font-semibold text-ink-2", className)}>
      {t("admin.lang.missing")}
    </span>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[28px] bg-surface shadow-card">
      <table className="w-full min-w-[640px] text-left text-[14px]">
        <thead className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3.5 font-semibold first:pl-6 last:pr-6">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line [&_td:first-child]:pl-6 [&_td:last-child]:pr-6">{children}</tbody>
      </table>
    </div>
  );
}

const control = "w-full rounded-2xl border border-line bg-bg px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-accent";

export function Input({ label, name, hint, className, ...props }: ComponentProps<"input"> & { label: string; name: string; hint?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>
      <input name={name} className={control} {...props} />
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Area({ label, name, hint, className, rows = 3, ...props }: ComponentProps<"textarea"> & { label: string; name: string; hint?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>
      <textarea name={name} rows={rows} className={cn(control, "leading-relaxed")} {...props} />
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Select({ label, name, options, className, ...props }: ComponentProps<"select"> & { label: string; name: string; options: { value: string; label: string; disabled?: boolean }[] }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>
      <select name={name} className={control} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function categoryOptions(t: TFunction) {
  return CATEGORIES.map((c) => ({ value: c.key, label: t(`taxonomy.categories.${c.key}`) }));
}

export function difficultyOptions(t: TFunction) {
  return (["beginner", "intermediate", "advanced"] as const).map((value) => ({ value, label: t(`common.difficulty.${value}`) }));
}

export function statusOptions(t: TFunction, canPublish: boolean, current?: string) {
  return [
    { value: "draft", label: t("admin.status.draft") },
    { value: "review", label: t("admin.status.review") },
    { value: "published", label: t(canPublish ? "admin.status.published" : "admin.status.publishedAdminOnly"), disabled: !canPublish && current !== "published" },
    { value: "archived", label: t(canPublish ? "admin.status.archived" : "admin.status.archivedAdminOnly"), disabled: !canPublish && current !== "archived" },
  ];
}

/** Common metadata fields every content type shares. */
export async function MetaFields({
  values,
  canPublish,
  withSlug = true,
  minutes = { min: 1, max: 120 },
}: {
  values?: { title?: string; slug?: string; description?: string; category?: string; difficulty?: string; estimatedMinutes?: number; order?: number; status?: string };
  canPublish: boolean;
  withSlug?: boolean;
  minutes?: { min: number; max: number };
}) {
  const { t } = await getTranslator();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label={t("admin.fields.title")} name="title" defaultValue={values?.title} required className="sm:col-span-2" />
      {withSlug && <Input label={t("admin.fields.slug")} name="slug" defaultValue={values?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" hint={t("admin.fields.slugHint")} />}
      <Select label={t("admin.fields.status")} name="status" defaultValue={values?.status ?? "draft"} options={statusOptions(t, canPublish, values?.status)} />
      <Area label={t("admin.fields.description")} name="description" defaultValue={values?.description} className="sm:col-span-2" rows={2} />
      <Select label={t("admin.fields.category")} name="category" defaultValue={values?.category ?? "communication"} options={categoryOptions(t)} />
      <Select label={t("admin.fields.difficulty")} name="difficulty" defaultValue={values?.difficulty ?? "beginner"} options={difficultyOptions(t)} />
      <Input label={t("admin.fields.estimatedMinutes")} name="estimatedMinutes" type="number" min={minutes.min} max={minutes.max} defaultValue={values?.estimatedMinutes ?? minutes.min} required />
      <Input label={t("admin.fields.order")} name="order" type="number" min={0} max={1000} defaultValue={values?.order ?? 0} required />
    </div>
  );
}

/** The Spanish overrides stored on a content row (empty when none). */
export function spanishOf<T extends Record<string, unknown>>(row: { translations?: ContentTranslations | null } | null | undefined): Partial<T> {
  return (row?.translations?.es ?? {}) as Partial<T>;
}

/** "English: …" placeholder so translators see the source text next to each field. */
export function englishHint(t: TFunction, text: string | null | undefined): string | undefined {
  return text ? t("admin.lang.englishPlaceholder", { text }) : undefined;
}

/** Intro line at the top of every "Español" tab. */
export async function SpanishIntro() {
  const { t } = await getTranslator();
  return <p className="rounded-2xl bg-surface-2 px-4 py-3 text-[13px] text-ink-2">{t("admin.lang.intro")}</p>;
}

/** Spanish title / (subtitle) / description, named `es_*`, with the English text as placeholder. */
export async function SpanishMetaFields({
  english,
  spanish,
  withSubtitle = false,
}: {
  english: { title?: string; subtitle?: string | null; description?: string };
  spanish: { title?: unknown; subtitle?: unknown; description?: unknown };
  withSubtitle?: boolean;
}) {
  const { t } = await getTranslator();
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return (
    <div className="grid gap-4">
      <Input label={t("admin.fields.title")} name="es_title" lang="es" defaultValue={str(spanish.title)} placeholder={englishHint(t, english.title)} />
      {withSubtitle && <Input label={t("admin.fields.subtitle")} name="es_subtitle" lang="es" defaultValue={str(spanish.subtitle)} placeholder={englishHint(t, english.subtitle)} />}
      <Area label={t("admin.fields.description")} name="es_description" lang="es" defaultValue={str(spanish.description)} placeholder={englishHint(t, english.description)} rows={2} />
    </div>
  );
}

/** Live (published/archived) content is read-only for anyone who can't publish. */
export function isLiveLocked(canPublish: boolean, status: string): boolean {
  return !canPublish && (status === "published" || status === "archived");
}

export async function LiveNotice() {
  const { t } = await getTranslator();
  return (
    <Panel className="bg-accent-soft">
      <p className="text-[15px] font-semibold">{t("admin.live.title")}</p>
      <p className="mt-1 text-[14px] text-ink-2">{t("admin.live.body")}</p>
    </Panel>
  );
}

/** A date (or ISO day) as "Mar 2, 2026" / "2 mar 2026" in the reader's language. */
export function formatDate(value: Date | string | null | undefined, locale: Locale): string {
  if (!value) return "—";
  const day = typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10);
  return formatDay(day, { year: "numeric", month: "short", day: "numeric" }, locale);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);
}
