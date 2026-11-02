import type { Metadata } from "next";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { saveJourneyAction } from "../../../actions";
import { AdminForm } from "../../../form";
import { LangTabs } from "../../../lang-tabs";
import { Input, MetaFields, PageHeader, Panel, SpanishIntro, SpanishMetaFields } from "../../../ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.journey.newTitle") };
}

export default async function NewJourneyPage() {
  const user = await requirePermission("content:write");
  const { t } = await getTranslator();
  return (
    <div className="max-w-3xl">
      <PageHeader title={t("admin.journey.newTitle")} crumbs={[{ href: "/admin/content", label: t("admin.content.title") }]} />
      <Panel>
        <AdminForm action={saveJourneyAction} submitLabel={t("admin.journey.create")}>
          <LangTabs
            esMissing
            en={
              <>
                <MetaFields canPublish={can(user.roles, "content:publish")} minutes={{ min: 1, max: 1000 }} />
                <Input label={t("admin.fields.subtitle")} name="subtitle" />
              </>
            }
            es={
              <>
                <SpanishIntro />
                <SpanishMetaFields english={{}} spanish={{}} withSubtitle />
              </>
            }
          />
        </AdminForm>
      </Panel>
    </div>
  );
}
