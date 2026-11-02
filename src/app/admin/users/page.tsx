import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { getTranslator } from "@/i18n/server";
import { cn } from "@/lib/cn";
import { requirePermission } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listUsers } from "@/server/services/admin";
import { formatDate, formatNumber, PageHeader, StatusBadge, Table } from "../ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.users.title") };
}

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  await requirePermission("users:read");
  const { t, locale } = await getTranslator();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : undefined;
  const page = Number(sp.page) || 1;
  const { rows, total } = await listUsers(getDb(), { q, page });
  const pages = Math.max(1, Math.ceil(total / 50));

  return (
    <div className="max-w-6xl">
      <PageHeader title={t("admin.users.title")} subtitle={t("admin.users.count", { count: total })} />
      <form className="mb-4 flex max-w-md gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder={t("admin.users.searchPlaceholder")}
          aria-label={t("admin.users.searchLabel")}
          className="h-11 w-full min-w-0 rounded-full border border-line bg-surface px-4 text-[14px] outline-none placeholder:text-muted focus:border-accent"
        />
        <button className={buttonClass("primary", "md", "shrink-0")}>{t("admin.users.search")}</button>
      </form>
      <Table
        head={[
          t("admin.users.head.learner"),
          t("admin.users.head.roles"),
          t("admin.users.head.status"),
          t("admin.users.head.plan"),
          t("admin.users.head.xp"),
          t("admin.users.head.streak"),
          t("admin.users.head.lastTrained"),
          t("admin.users.head.joined"),
        ]}
      >
        {rows.map((u) => {
          const staff = u.roles.filter((r) => r !== "USER");
          return (
            <tr key={u.id} className="hover:bg-surface-2">
              <td className="px-4 py-3">
                <Link href={`/admin/users/${u.id}`} className="font-medium hover:underline">
                  {u.name}
                </Link>
                <div className="text-[12px] text-muted">{u.email}</div>
              </td>
              <td className="px-4 py-3 text-[12px]">{staff.length ? staff.map((r) => t(`admin.roles.${r}.name`)).join(", ") : t("admin.roles.USER.name")}</td>
              <td className="px-4 py-3">
                <StatusBadge status={u.status} />
              </td>
              <td className="px-4 py-3 text-[13px]">{u.onboarded ? t("admin.users.yes") : t("admin.users.notYet")}</td>
              <td className="px-4 py-3 tabular-nums">{formatNumber(u.totalXp ?? 0, locale)}</td>
              <td className="px-4 py-3 tabular-nums">{u.streak}</td>
              <td className="whitespace-nowrap px-4 py-3 text-[13px] text-ink-2">{formatDate(u.lastActive, locale)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-[13px] text-ink-2">{formatDate(u.createdAt, locale)}</td>
            </tr>
          );
        })}
      </Table>
      {pages > 1 && (
        <nav className="mt-4 flex flex-wrap gap-1.5 text-[14px]" aria-label={t("admin.users.pages")}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/users?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              aria-current={p === page ? "page" : undefined}
              className={cn("grid h-9 min-w-9 place-items-center rounded-full px-3 tabular-nums", p === page ? "bg-hero text-hero-ink" : "text-ink-2 hover:bg-surface-2")}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
