import type { Metadata } from "next";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { PageHeader, Panel } from "../../../ui";
import { ResourceForm } from "../../library-forms";

export const metadata: Metadata = { title: "New resource" };

export default async function NewResourcePage() {
  const user = await requirePermission("content:write");
  return (
    <div className="max-w-3xl">
      <PageHeader title="New resource" crumbs={[{ href: "/admin/content", label: "Content" }, { href: "/admin/content/resources", label: "Explore library" }]} />
      <Panel>
        <ResourceForm canPublish={can(user.roles, "content:publish")} />
      </Panel>
    </div>
  );
}
