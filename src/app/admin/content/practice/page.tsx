import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listPracticeAdmin } from "@/server/services/admin";
import { EsMissingBadge, formatDate, PageHeader, StatusBadge, Table } from "../../ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.practice.listTitle") };
}

export default async function PracticeAdminPage() {
  await requirePermission("content:read");
  const { t, locale } = await getTranslator();
  const rows = await listPracticeAdmin(getDb());
  return (
    <div className="max-w-6xl">
      <PageHeader
        title={t("admin.practice.listTitle")}
        subtitle={t("admin.practice.subtitle")}
        crumbs={[{ href: "/admin/content", label: t("admin.content.title") }]}
        action={
          <Link href="/admin/content/practice/new" className={buttonClass("primary", "sm")}>
            {t("admin.practice.new")}
          </Link>
        }
      />
      <Table head={[t("admin.practice.head.tool"), t("admin.practice.head.type"), t("admin.practice.head.category"), t("admin.practice.head.status"), t("admin.practice.head.updated")]}>
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-surface-2">
            <td className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/content/practice/${r.id}`} className="font-medium hover:underline">
                  {r.title}
                </Link>
                {!r.hasEs && <EsMissingBadge />}
              </div>
            </td>
            <td className="px-4 py-3 font-mono text-[12px]">{r.type}</td>
            <td className="px-4 py-3 text-[13px]">{t(`taxonomy.categories.${r.category}`)}</td>
            <td className="px-4 py-3">
              <StatusBadge status={r.status} />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-[13px] text-ink-2">{formatDate(r.updatedAt, locale)}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
