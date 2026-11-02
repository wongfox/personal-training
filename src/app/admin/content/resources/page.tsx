import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listResourcesAdmin } from "@/server/services/admin";
import { EsMissingBadge, formatDate, PageHeader, StatusBadge, Table } from "../../ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.resource.listTitle") };
}

export default async function ResourcesAdminPage() {
  await requirePermission("content:read");
  const { t, locale } = await getTranslator();
  const rows = await listResourcesAdmin(getDb());
  return (
    <div className="max-w-6xl">
      <PageHeader
        title={t("admin.resource.listTitle")}
        crumbs={[{ href: "/admin/content", label: t("admin.content.title") }]}
        action={
          <Link href="/admin/content/resources/new" className={buttonClass("primary", "sm")}>
            {t("admin.resource.new")}
          </Link>
        }
      />
      <Table head={[t("admin.resource.head.title"), t("admin.resource.head.type"), t("admin.resource.head.category"), t("admin.resource.head.status"), t("admin.resource.head.updated")]}>
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-surface-2">
            <td className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/content/resources/${r.id}`} className="font-medium hover:underline">
                  {r.title}
                </Link>
                {!r.hasEs && <EsMissingBadge />}
              </div>
            </td>
            <td className="px-4 py-3 text-[13px]">{t(`taxonomy.resourceTypes.${r.type}`)}</td>
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
