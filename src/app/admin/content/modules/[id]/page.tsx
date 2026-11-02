import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/ui/button";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getModuleAdmin, hasSpanish } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { saveModuleAction } from "../../../actions";
import { AdminForm } from "../../../form";
import { LangTabs } from "../../../lang-tabs";
import {
  EsMissingBadge,
  formatDate,
  isLiveLocked,
  LiveNotice,
  MetaFields,
  PageHeader,
  Panel,
  PanelTitle,
  SpanishIntro,
  SpanishMetaFields,
  spanishOf,
  StatusBadge,
  Table,
} from "../../../ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.module.metaTitle") };
}

export default async function ModuleAdminPage({ params }: PageProps<"/admin/content/modules/[id]">) {
  const user = await requirePermission("content:read");
  const { t, locale } = await getTranslator();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  let data;
  try {
    data = await getModuleAdmin(getDb(), id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  const { module: mod, journey, lessons } = data;
  const canWrite = can(user.roles, "content:write");
  const canPublish = can(user.roles, "content:publish");

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title={mod.title}
        crumbs={[
          { href: "/admin/content", label: t("admin.content.title") },
          { href: `/admin/content/journeys/${journey.id}`, label: journey.title },
        ]}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {!hasSpanish(mod.translations) && <EsMissingBadge />}
            <StatusBadge status={mod.status} />
            {canWrite && (
              <Link href={`/admin/content/lessons/new?module=${mod.id}`} className={buttonClass("primary", "sm")}>
                {t("admin.module.newLesson")}
              </Link>
            )}
          </div>
        }
      />
      <Table head={[t("admin.module.head.order"), t("admin.module.head.lesson"), t("admin.module.head.status"), t("admin.module.head.minutes"), t("admin.module.head.updated")]}>
        {lessons.map((l) => (
          <tr key={l.id} className="hover:bg-surface-2">
            <td className="px-4 py-3 tabular-nums text-muted">{l.order}</td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/content/lessons/${l.id}`} className="font-medium hover:underline">
                  {l.title}
                </Link>
                {!l.hasEs && <EsMissingBadge />}
              </div>
              <div className="font-mono text-[11px] text-muted">{l.slug}</div>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={l.status} />
            </td>
            <td className="px-4 py-3 tabular-nums">{l.estimatedMinutes}</td>
            <td className="whitespace-nowrap px-4 py-3 text-[13px] text-ink-2">{formatDate(l.updatedAt, locale)}</td>
          </tr>
        ))}
      </Table>
      {canWrite && isLiveLocked(canPublish, mod.status) && <LiveNotice />}
      {canWrite && !isLiveLocked(canPublish, mod.status) && (
        <Panel className="max-w-3xl">
          <PanelTitle className="mb-4">{t("admin.module.edit")}</PanelTitle>
          <AdminForm action={saveModuleAction} hidden={{ id: mod.id, journeyId: journey.id }}>
            <LangTabs
              esMissing={!hasSpanish(mod.translations)}
              en={<MetaFields values={mod} canPublish={canPublish} withSlug={false} minutes={{ min: 1, max: 600 }} />}
              es={
                <>
                  <SpanishIntro />
                  <SpanishMetaFields english={mod} spanish={spanishOf(mod)} />
                </>
              }
            />
          </AdminForm>
        </Panel>
      )}
    </div>
  );
}
