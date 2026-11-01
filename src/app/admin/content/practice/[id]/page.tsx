import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getPracticeAdmin } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { isLiveLocked, LiveNotice, PageHeader, Panel, StatusBadge } from "../../../ui";
import { PracticeForm } from "../../library-forms";

export const metadata: Metadata = { title: "Practice tool" };

export default async function PracticeToolAdminPage({ params }: PageProps<"/admin/content/practice/[id]">) {
  const user = await requirePermission("content:read");
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  let tool;
  try {
    tool = await getPracticeAdmin(getDb(), id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  return (
    <div className="max-w-3xl">
      <PageHeader
        title={tool.title}
        crumbs={[{ href: "/admin/content", label: "Content" }, { href: "/admin/content/practice", label: "Practice tools" }]}
        action={<StatusBadge status={tool.status} />}
      />
      {can(user.roles, "content:write") && isLiveLocked(can(user.roles, "content:publish"), tool.status) ? (
        <LiveNotice />
      ) : (
        <Panel>{can(user.roles, "content:write") ? <PracticeForm tool={tool} canPublish={can(user.roles, "content:publish")} /> : <p>Read-only.</p>}</Panel>
      )}
    </div>
  );
}
