import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getJourneyAdmin, hasSpanish } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { saveJourneyAction, saveModuleAction } from "../../../actions";
import { AdminForm } from "../../../form";
import { LangTabs } from "../../../lang-tabs";
import { EsMissingBadge, Input, isLiveLocked, LiveNotice, MetaFields, PageHeader, Panel, PanelTitle, SpanishIntro, SpanishMetaFields, spanishOf, StatusBadge, Table } from "../../../ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.journey.metaTitle") };
}

export default async function JourneyAdminPage({ params }: PageProps<"/admin/content/journeys/[id]">) {
  const user = await requirePermission("content:read");
  const { t } = await getTranslator();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  let data;
  try {
    data = await getJourneyAdmin(getDb(), id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  const { journey, modules } = data;
  const canWrite = can(user.roles, "content:write");
  const canPublish = can(user.roles, "content:publish");

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title={journey.title}
        crumbs={[{ href: "/admin/content", label: t("admin.content.title") }]}
        action={
          <div className="flex items-center gap-2">
            {!hasSpanish(journey.translations) && <EsMissingBadge />}
            <StatusBadge status={journey.status} />
          </div>
        }
      />

      <section>
        <PanelTitle className="mb-3">{t("admin.journey.modules")}</PanelTitle>
        <Table
          head={[t("admin.journey.head.order"), t("admin.journey.head.module"), t("admin.journey.head.status"), t("admin.journey.head.lessons"), t("admin.journey.head.minutes")]}
        >
          {modules.map((m) => (
            <tr key={m.id} className="hover:bg-surface-2">
              <td className="px-4 py-3 tabular-nums text-muted">{m.order}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/content/modules/${m.id}`} className="font-medium hover:underline">
                    {m.title}
                  </Link>
                  {!m.hasEs && <EsMissingBadge />}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={m.status} />
              </td>
              <td className="px-4 py-3 tabular-nums">{m.lessons}</td>
              <td className="px-4 py-3 tabular-nums">{m.estimatedMinutes}</td>
            </tr>
          ))}
        </Table>
      </section>

      {canWrite && (
        <div className="grid gap-6 lg:grid-cols-2">
          {isLiveLocked(canPublish, journey.status) ? (
            <LiveNotice />
          ) : (
            <Panel>
              <PanelTitle className="mb-4">{t("admin.journey.edit")}</PanelTitle>
              <AdminForm action={saveJourneyAction} hidden={{ id: journey.id }}>
                <LangTabs
                  esMissing={!hasSpanish(journey.translations)}
                  en={
                    <>
                      <MetaFields values={journey} canPublish={canPublish} minutes={{ min: 1, max: 1000 }} />
                      <Input label={t("admin.fields.subtitle")} name="subtitle" defaultValue={journey.subtitle ?? ""} />
                    </>
                  }
                  es={
                    <>
                      <SpanishIntro />
                      <SpanishMetaFields english={journey} spanish={spanishOf(journey)} withSubtitle />
                    </>
                  }
                />
              </AdminForm>
            </Panel>
          )}
          <Panel>
            <PanelTitle className="mb-4">{t("admin.journey.addModule")}</PanelTitle>
            <AdminForm action={saveModuleAction} hidden={{ journeyId: journey.id }} submitLabel={t("admin.journey.addModuleSubmit")}>
              <MetaFields
                canPublish={canPublish}
                withSlug={false}
                values={{ order: modules.length + 1, category: journey.category, difficulty: journey.difficulty, estimatedMinutes: 30 }}
                minutes={{ min: 1, max: 600 }}
              />
            </AdminForm>
          </Panel>
        </div>
      )}
    </div>
  );
}
