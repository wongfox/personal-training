import type { Metadata } from "next";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { PageHeader, Panel } from "../../../ui";
import { PracticeForm } from "../../library-forms";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.practice.newTitle") };
}

export default async function NewPracticePage() {
  const user = await requirePermission("content:write");
  const { t } = await getTranslator();
  return (
    <div className="max-w-3xl">
      <PageHeader
        title={t("admin.practice.newTitle")}
        crumbs={[
          { href: "/admin/content", label: t("admin.content.title") },
          { href: "/admin/content/practice", label: t("admin.practice.listTitle") },
        ]}
      />
      <Panel>
        <PracticeForm canPublish={can(user.roles, "content:publish")} />
      </Panel>
    </div>
  );
}
