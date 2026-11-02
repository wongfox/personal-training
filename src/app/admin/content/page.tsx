import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listJourneysAdmin, reviewQueue } from "@/server/services/admin";
import { EsMissingBadge, PageHeader, Panel, PanelTitle, StatusBadge, Table } from "../ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.content.title") };
}

export default async function ContentPage() {
  await requirePermission("content:read");
  const { t } = await getTranslator();
  const db = getDb();
  const [journeys, queue] = await Promise.all([listJourneysAdmin(db), reviewQueue(db)]);
  return (
    <div className="max-w-6xl">
      <PageHeader
        title={t("admin.content.title")}
        subtitle={t("admin.content.subtitle")}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/content/practice" className={buttonClass("secondary", "sm")}>
              {t("admin.content.practiceTools")}
            </Link>
            <Link href="/admin/content/resources" className={buttonClass("secondary", "sm")}>
              {t("admin.content.exploreLibrary")}
            </Link>
            <Link href="/admin/content/journeys/new" className={buttonClass("primary", "sm")}>
              {t("admin.content.newJourney")}
            </Link>
          </div>
        }
      />
      {queue.length > 0 && (
        <Panel className="mb-6">
          <PanelTitle>{t("admin.content.inReview", { count: queue.length })}</PanelTitle>
          <ul className="mt-3 flex flex-wrap gap-2">
            {queue.map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-[13px] text-accent hover:brightness-95">
                  {t(`admin.kinds.${q.kindKey}`)}: {q.title}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <Table
        head={[
          t("admin.content.head.journey"),
          t("admin.content.head.category"),
          t("admin.content.head.status"),
          t("admin.content.head.modules"),
          t("admin.content.head.lessons"),
          t("admin.content.head.learners"),
          t("admin.content.head.order"),
        ]}
      >
        {journeys.map((j) => (
          <tr key={j.id} className="hover:bg-surface-2">
            <td className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/content/journeys/${j.id}`} className="font-medium hover:underline">
                  {j.title}
                </Link>
                {!j.hasEs && <EsMissingBadge />}
              </div>
              <div className="font-mono text-[11px] text-muted">{j.slug}</div>
            </td>
            <td className="px-4 py-3 text-[13px]">{t(`taxonomy.categories.${j.category}`)}</td>
            <td className="px-4 py-3">
              <StatusBadge status={j.status} />
            </td>
            <td className="px-4 py-3 tabular-nums">{j.modules}</td>
            <td className="px-4 py-3 tabular-nums">{j.lessons}</td>
            <td className="px-4 py-3 tabular-nums">{j.learners}</td>
            <td className="px-4 py-3 tabular-nums">{j.order}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
