import type { Metadata } from "next";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { PageHeader, Panel } from "../../../ui";
import { ResourceForm } from "../../library-forms";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.resource.newTitle") };
}

export default async function NewResourcePage() {
  const user = await requirePermission("content:write");
  const { t } = await getTranslator();
  return (
    <div className="max-w-3xl">
      <PageHeader
        title={t("admin.resource.newTitle")}
        crumbs={[
          { href: "/admin/content", label: t("admin.content.title") },
          { href: "/admin/content/resources", label: t("admin.resource.listTitle") },
        ]}
      />
      <Panel>
        <ResourceForm canPublish={can(user.roles, "content:publish")} />
      </Panel>
    </div>
  );
}
