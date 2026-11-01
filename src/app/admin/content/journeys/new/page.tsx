import type { Metadata } from "next";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { saveJourneyAction } from "../../../actions";
import { AdminForm } from "../../../form";
import { Input, MetaFields, PageHeader, Panel } from "../../../ui";

export const metadata: Metadata = { title: "New journey" };

export default async function NewJourneyPage() {
  const user = await requirePermission("content:write");
  return (
    <div className="max-w-3xl">
      <PageHeader title="New journey" crumbs={[{ href: "/admin/content", label: "Content" }]} />
      <Panel>
        <AdminForm action={saveJourneyAction} submitLabel="Create journey">
          <MetaFields canPublish={can(user.roles, "content:publish")} minutes={{ min: 1, max: 1000 }} />
          <Input label="Subtitle" name="subtitle" />
        </AdminForm>
      </Panel>
    </div>
  );
}
