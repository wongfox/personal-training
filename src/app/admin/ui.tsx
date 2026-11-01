import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/lib/taxonomy";

/* Presentational building blocks for the admin back office (server-safe). */

export function PageHeader({ title, subtitle, action, crumbs }: { title: string; subtitle?: string; action?: ReactNode; crumbs?: { href: string; label: string }[] }) {
  return (
    <header className="mb-6">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap gap-1.5 text-[13px] text-muted">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              <Link href={c.href} className="hover:text-ink">
                {c.label}
              </Link>
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[34px] leading-none">{title}</h1>
          {subtitle && <p className="mt-2 text-[14px] text-ink-2">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

export function Panel({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("rounded-2xl border border-line bg-surface p-5", className)} {...props} />;
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "published"
      ? "bg-success-soft text-success"
      : status === "review"
        ? "bg-accent-soft text-accent"
        : status === "archived"
          ? "bg-surface-2 text-muted line-through"
          : status === "suspended"
            ? "bg-danger-soft text-danger"
            : "bg-surface-2 text-ink-2";
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium capitalize", tone)}>{status}</span>;
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[640px] text-left text-[14px]">
        <thead className="border-b border-line text-[12px] uppercase tracking-[0.08em] text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

const control = "w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-[15px] outline-none focus:border-ink/40";

export function Input({ label, name, hint, className, ...props }: ComponentProps<"input"> & { label: string; name: string; hint?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-[13px] font-medium text-ink-2">{label}</span>
      <input name={name} className={control} {...props} />
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Area({ label, name, hint, className, rows = 3, ...props }: ComponentProps<"textarea"> & { label: string; name: string; hint?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-[13px] font-medium text-ink-2">{label}</span>
      <textarea name={name} rows={rows} className={cn(control, "leading-relaxed")} {...props} />
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Select({ label, name, options, className, ...props }: ComponentProps<"select"> & { label: string; name: string; options: { value: string; label: string; disabled?: boolean }[] }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-[13px] font-medium text-ink-2">{label}</span>
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

export const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.key, label: c.name }));
export const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export function statusOptions(canPublish: boolean, current?: string) {
  return [
    { value: "draft", label: "Draft" },
    { value: "review", label: "Review" },
    { value: "published", label: canPublish ? "Published" : "Published (admin only)", disabled: !canPublish && current !== "published" },
    { value: "archived", label: canPublish ? "Archived" : "Archived (admin only)", disabled: !canPublish && current !== "archived" },
  ];
}

/** Common metadata fields every content type shares. */
export function MetaFields({
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
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="Title" name="title" defaultValue={values?.title} required className="sm:col-span-2" />
      {withSlug && <Input label="Slug" name="slug" defaultValue={values?.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" hint="lowercase-with-dashes, unique" />}
      <Select label="Status" name="status" defaultValue={values?.status ?? "draft"} options={statusOptions(canPublish, values?.status)} />
      <Area label="Description" name="description" defaultValue={values?.description} className="sm:col-span-2" rows={2} />
      <Select label="Category" name="category" defaultValue={values?.category ?? "communication"} options={CATEGORY_OPTIONS} />
      <Select label="Difficulty" name="difficulty" defaultValue={values?.difficulty ?? "beginner"} options={DIFFICULTY_OPTIONS} />
      <Input label="Estimated minutes" name="estimatedMinutes" type="number" min={minutes.min} max={minutes.max} defaultValue={values?.estimatedMinutes ?? minutes.min} required />
      <Input label="Order" name="order" type="number" min={0} defaultValue={values?.order ?? 0} required />
    </div>
  );
}

/** Live (published/archived) content is read-only for anyone who can't publish. */
export function isLiveLocked(canPublish: boolean, status: string): boolean {
  return !canPublish && (status === "published" || status === "archived");
}

export function LiveNotice() {
  return (
    <Panel className="border-accent/30 bg-accent-soft/40">
      <p className="text-[15px] font-semibold">This is live — read-only for your role.</p>
      <p className="mt-1 text-[14px] text-ink-2">
        Learners are using it right now. Ask an admin to move it back to Review if it needs changes.
      </p>
    </Panel>
  );
}
