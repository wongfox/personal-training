import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getResourceAdmin } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { PageHeader, Panel, StatusBadge } from "../../../ui";
import { ResourceForm } from "../../library-forms";

export const metadata: Metadata = { title: "Resource" };

export default async function ResourceAdminPage({ params }: PageProps<"/admin/content/resources/[id]">) {
  const user = await requirePermission("content:read");
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  let resource;
  try {
    resource = await getResourceAdmin(getDb(), id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  return (
    <div className="max-w-3xl">
      <PageHeader
        title={resource.title}
        crumbs={[{ href: "/admin/content", label: "Content" }, { href: "/admin/content/resources", label: "Explore library" }]}
        action={<StatusBadge status={resource.status} />}
      />
      <Panel>{can(user.roles, "content:write") ? <ResourceForm resource={resource} canPublish={can(user.roles, "content:publish")} /> : <p>Read-only.</p>}</Panel>
    </div>
  );
}
